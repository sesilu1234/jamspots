import { NextRequest, NextResponse } from 'next/server';

// 1. Removed 'server-only'
// 2. Used NextRequest instead of Request

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ message: "Test Success" });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed', details: error.message },
      { status: 500 }
    );
  }
}