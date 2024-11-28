"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const deleteAllCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("jwt");
    cookieStore.delete("userId");
};

export const redirectToLoginPage = async () => {
    redirect("/login");
};

export const getJWTCookie = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("jwt");
};

export const getAllUsers = async () => {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt").value;
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
    };
    const options = {
        method: "GET",
        headers: headers,
        credentials: "include",
    };
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/dashboard/users";
    const response = await fetch(url, options);
    if (!response.ok) {
        return null;
    }
    const result = await response.json();
    return result;
};
