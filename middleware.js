import { NextResponse } from "next/server";

const publicPaths = ["/login", "/signup"];

export async function middleware(request) {
    const isAuthorized = await authorize(request);

    if (!isAuthorized && isAPublicPath(request)) {
        return NextResponse.next();
    }

    if (isAuthorized && isAPublicPath(request)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If the user is authenticated, continue as normal
    if (isAuthorized) {
        return NextResponse.next();
    }

    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
}

// Make sure your matcher includes both protected AND public paths.
// Everything outside this will be considered 404 via direct access if not handled by the middleware.
export const config = {
    matcher: ["/", "/dashboard/:path*", "/login", "/signup"],
};

const authorize = async (request) => {
    const jwt = request.cookies.get("jwt");
    const userId = request.cookies.get("userId");

    if (!jwt && !userId) {
        return false;
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt?.value}`,
    };

    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL + `/api/auth/${userId?.value}`;
    const options = {
        method: "GET",
        headers: headers,
        credentials: "include",
    };

    const apiResponse = await fetch(url, options);

    if (!apiResponse.ok) {
        return false;
    }

    const result = await apiResponse.json();
    if (result.accountStatus == 1) {
        return false;
    }

    return true;
};

const isAPublicPath = (request) => {
    return publicPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );
};
