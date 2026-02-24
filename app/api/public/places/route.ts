import { NextResponse } from 'next/server';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "10 s"), // Bumped slightly for faster typing
  timeout: 1000, 
});

export async function GET(request: Request) {


console.log('eii----');

  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input')?.trim(); // Don't lowercase yet, keep original for URL
  const token = searchParams.get('token');
  const ip = request.headers.get("x-real-ip") ?? "anonymous";

  if (!input || input.length < 3) return NextResponse.json([]);

  const cacheKey = `place_cache:${input.toLowerCase()}`;

  // 1. Rate Limiting
  try {
    const { success } = await ratelimit.limit(ip);
    
    if (!success) return NextResponse.json({ error: "Slow down!" }, { status: 429 });
  } catch (e) { console.error("Ratelimit bypass", e); }

  // 2. Redis Cache Check (Fast path)
  try {
    const cached = await redis.get(cacheKey);

    // Upstash returns objects if stored as JSON, but we check to be safe
    if (cached) return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached);
  } catch (e) { console.error("Cache error", e); }

  // 3. Construct Google URL - REFIXED: No types restriction
  const googleUrl = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  
  
  if (!token) {
    return NextResponse.json({ error: "Session token required" }, { status: 400 });
  }

  const params: Record<string, string> = {
    input,
    key: process.env.GOOGLE_MAPS_API_KEY!,
    sessiontoken: token // Now we know it exists
  };


  console.log(params);
  
  googleUrl.search = new URLSearchParams(params).toString();

  try {
    const res = await fetch(googleUrl.toString());
    const data = await res.json();

    
    // Google returns 'predictions'. We grab the top 5.
    const top5 = data.predictions?.slice(0, 5) || [];

    if (top5.length > 0) {
      // Store as stringified JSON for 24 hours
      redis.set(cacheKey, JSON.stringify(top5), { ex: 86400 }).catch(() => {});
    }

    return NextResponse.json(top5);
  } catch (err) {
    return NextResponse.json({ error: "Google API failed" }, { status: 500 });
  }
}