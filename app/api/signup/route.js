import { NextResponse } from "next/server";

// signup
export const POST = async (request) => {
    try {
        const body = await request.json();
        const headers = {
            "Content-Type": "application/json",
        };
        const url = process.env.ASP_DOTNET_CORE_API_BASE_URL + "/api/users/";
        const options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
            credentials: "include",
        };

        const apiResponse = await fetch(url, options);
        if (!apiResponse.ok) {
            return NextResponse.json(
                { error: "Failed to process signup request." },
                { status: apiResponse.status }
            );
        }

        const response = NextResponse.json(await apiResponse.json(), {
            status: apiResponse.status,
        });

        const cookieHeader = apiResponse.headers.get("set-cookie");

        if (cookieHeader) {
            response.headers.set("Set-Cookie", cookieHeader);
        }

        return response;
    } catch (error) {
        console.error("Proxy signup error:", error);
        return NextResponse.json(
            { error: "Internal server error!" },
            { status: 500 }
        );
    }
};

// Handle cors
export async function OPTIONS(request) {
    const response = NextResponse.json({}, { status: 200 });
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
        "Access-Control-Allow-Origin",
        process.env.ALLOWED_ORIGIN || "*"
    );

    return response;
}
