import { NextResponse } from 'next/server';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "10 s"),
  timeout: 1000,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address')?.trim();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";

  if (!address || address.length < 3) return NextResponse.json([]);

  const cacheKey = `geocode_cache:${address.toLowerCase()}`;

  // 1️⃣ Rate limiting
  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) return NextResponse.json({ error: "Slow down!" }, { status: 429 });
  } catch (e) { console.error("Ratelimit error", e); }

  // 2️⃣ Redis cache check
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached);
  } catch (e) { console.error("Cache error", e); }

  // 3️⃣ Geocoding API request
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const res = await fetch(geocodeUrl);
    const data = await res.json();

    const results = data.results || [];

    if (results.length > 0) {
      // Cache for 24h
      redis.set(cacheKey, JSON.stringify(results), { ex: 86400 }).catch(() => {});
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error("Geocode API failed", err);
    return NextResponse.json({ error: "Geocode API failed" }, { status: 500 });
  }
}