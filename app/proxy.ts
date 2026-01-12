import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();
	url.pathname = "/jaja";
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/host/:path*", "/host"],
};
