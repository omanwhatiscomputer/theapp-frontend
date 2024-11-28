// TODO: update - block/unblock - Put
// TODO: delete - Delete
import { NextResponse } from "next/server";

export const PUT = async (request, params) => {
    const { id } = await params.params;
    const body = await request.json();

    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: request.headers.get("authorization"),
        };

        const url =
            process.env.ASP_DOTNET_CORE_API_BASE_URL + `/api/users/${id}`;
        const options = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(body),
            credentials: "include",
        };

        const apiResponse = await fetch(url, options);

        if (!apiResponse.ok) {
            return NextResponse.json(
                { error: "Failed to update user records with specified ID." },
                { status: apiResponse.status }
            );
        }

        const response = NextResponse.json(await apiResponse.json(), {
            status: apiResponse.status,
        });

        return response;
    } catch (error) {
        console.error("Proxy update error:", error);
        return NextResponse.json(
            { error: "Internal server error!" },
            { status: 500 }
        );
    }
};

export const DELETE = async (request, params) => {
    const { id } = await params.params;

    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: request.headers.get("authorization"),
        };

        const url =
            process.env.ASP_DOTNET_CORE_API_BASE_URL + `/api/users/${id}`;
        const options = {
            method: "DELETE",
            headers: headers,
            credentials: "include",
        };

        const apiResponse = await fetch(url, options);

        if (!apiResponse.ok) {
            return NextResponse.json(
                { error: "Failed to delete user records with specified ID." },
                { status: apiResponse.status }
            );
        }

        const response = NextResponse.json(await apiResponse.json(), {
            status: apiResponse.status,
        });

        return response;
    } catch (error) {
        console.error("Proxy update error:", error);
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
