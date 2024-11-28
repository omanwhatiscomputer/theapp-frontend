import { NextResponse } from "next/server";
export const GET = async (request) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: request.headers.get("authorization"),
    };

    const url = process.env.ASP_DOTNET_CORE_API_BASE_URL + `/api/users`;
    const options = {
        method: "GET",
        headers: headers,
        credentials: "include",
    };

    const apiResponse = await fetch(url, options);
    if (!apiResponse.ok) {
        switch (apiResponse.status) {
            case 401:
                return NextResponse.json(
                    { error: "Access Denied!" },
                    { status: apiResponse.status }
                );
                break;

            default:
                return NextResponse.json(
                    { error: "Failed to fetch data from server!" },
                    { status: apiResponse.status }
                );
                break;
        }
    }

    const response = NextResponse.json(await apiResponse.json(), {
        status: apiResponse.status,
    });

    return response;
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
