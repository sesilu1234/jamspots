/**
 * Shrinking photos in the browser, before they are ever sent.
 *
 * This exists because of a hard limit that sits in front of the route and
 * never reaches it: a Vercel serverless function refuses a request body over
 * 4.5 MB itself, answering FUNCTION_PAYLOAD_TOO_LARGE / 413. A jam carries
 * three photos and the server accepts 8 MB each, so a host uploading straight
 * off a phone camera — 3 to 6 MB a shot is ordinary — blew past the cap every
 * time and saw "Your jam could not be published". Nothing on the server could
 * have caught it. The only fix is to send less.
 *
 * So the compression happens twice, on purpose and for different reasons.
 * Here, to get the request under the cap and off a mobile connection quickly.
 * Again in lib/upload-photos.ts with sharp, because that one is the rule: it
 * is what decides what is actually stored, and a browser is not something to
 * take size promises from.
 */

/** Longest side to aim for, in order. A photo that fits stops at the first. */
const DIMENSION_LADDER = [1600, 1200, 900];

/** What the ladder aims for per photo. Three of these sit well under the cap. */
const TARGET_BYTES = 600 * 1024;

const QUALITY = 0.82;

/**
 * Everything this is allowed to send in one request, with room left for the
 * JSON field and multipart overhead. The platform cap is 4.5 MB.
 */
export const MAX_TOTAL_UPLOAD_BYTES = 3.6 * 1024 * 1024;

/**
 * Decode with the EXIF orientation applied, so portrait photos off a phone do
 * not come out on their side once the re-encode drops the metadata.
 *
 * `createImageBitmap` honours `imageOrientation` where it is supported and
 * ignores the option where it is not; the <img> fallback is for the browsers
 * without it at all, and those apply the orientation during decode anyway.
 */
async function decode(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(blob, { imageOrientation: 'from-image' });
    } catch {
      // Fall through — some browsers reject the options object outright.
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('The image could not be decoded.'));
      img.src = url;
    });
  } finally {
    // Revoked after onload: the bitmap is already in memory by then.
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

/**
 * Re-encode `blob`, stepping the resolution down until it fits TARGET_BYTES.
 *
 * Dimension is the lever rather than quality, same reasoning as the server:
 * the same bytes spread over more pixels is a visibly worse photo, while the
 * same pixels at a slightly smaller size is barely noticeable.
 */
async function shrink(blob: Blob): Promise<Blob> {
  const source = await decode(blob);
  const width = 'width' in source ? source.width : 0;
  const height = 'height' in source ? source.height : 0;
  if (!width || !height) throw new Error('The image has no size.');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2D canvas context.');

  const longest = Math.max(width, height);

  // Rungs above the photo's own size would be no-ops, and two rungs clamped
  // to the same size would encode identical bytes twice.
  const rungs = [...new Set(DIMENSION_LADDER.map((d) => Math.min(d, longest)))];

  // WebP everywhere it exists — roughly a third off JPEG at this quality.
  // The check is real: a canvas that cannot encode WebP hands back a PNG
  // under the requested type, which is far LARGER than the original.
  const probe = document.createElement('canvas');
  probe.width = probe.height = 1;
  const type = probe.toDataURL('image/webp').startsWith('data:image/webp')
    ? 'image/webp'
    : 'image/jpeg';

  let best: Blob | null = null;

  for (const dimension of rungs) {
    const scale = dimension / longest;
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));

    // JPEG has no alpha, and an unpainted canvas is transparent black — which
    // encodes as a black background rather than the white one people expect.
    if (type === 'image/jpeg') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(
      source as CanvasImageSource,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const out = await canvasToBlob(canvas, type);
    if (!out) continue;

    best = out;
    if (out.size <= TARGET_BYTES) break;
  }

  if ('close' in source) source.close();

  if (!best) throw new Error('The image could not be re-encoded.');
  return best;
}

/**
 * Turn the form's photo URLs — blob: URLs for a new pick, https: for one
 * already stored — into files small enough to post.
 *
 * A photo that cannot be re-encoded is sent as it came. That is deliberate:
 * a page that silently drops one of a host's three photos is worse than a
 * request that is a little bigger, and `assertFitsUpload` below still stops
 * the batch before it can earn a 413.
 */
export async function prepareImagesForUpload(urls: string[]): Promise<File[]> {
  const files: File[] = [];

  for (const [index, url] of urls.entries()) {
    const original = await (await fetch(url)).blob();

    let out: Blob = original;
    try {
      const shrunk = await shrink(original);
      // Already-stored photos come back compressed; re-encoding one can come
      // out bigger than it went in, so keep whichever is smaller.
      if (shrunk.size < original.size) out = shrunk;
    } catch (e) {
      console.error('Client-side compression failed, sending as-is:', e);
    }

    const extension = out.type === 'image/webp' ? 'webp' : 'jpg';
    files.push(
      new File([out], `photo-${index + 1}-${Date.now()}.${extension}`, {
        type: out.type || original.type || 'image/jpeg',
      }),
    );
  }

  return files;
}

/**
 * The last check before the request goes out.
 *
 * Without it an over-cap upload comes back as a raw platform 413 that the
 * route never runs for, so the host is told "Failed to fetch" with no idea
 * which photo to blame or what to do about it.
 */
export function assertFitsUpload(files: File[]): string | null {
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total <= MAX_TOTAL_UPLOAD_BYTES) return null;

  return `Those photos come to ${(total / 1024 / 1024).toFixed(1)} MB after compression, which is more than we can upload at once. Try smaller photos, or fewer of them.`;
}
