"use client";
import { toast } from "react-toastify";
import { getEmitterConfig } from "./(components)/common/NotificationToaster";
import { deleteAllCookies, redirectToLoginPage } from "./utils.server";

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const parseBodyFromResponseObjectBodyAsReadStream = async (responseObject) => {
    const reader = responseObject.body.getReader();
    const decoder = new TextDecoder();

    let result = await reader.read();
    return JSON.parse(decoder.decode(result.value));
};

export const getSortedUsers = (users, sortBy, sortOrder) => {
    if (sortBy === "LastSeen") {
        if (sortOrder === "ascending") {
            return users.sort(
                (a, b) => new Date(a.lastLogin) - new Date(b.lastLogin)
            );
        } else {
            return users.sort(
                (a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)
            );
        }
    } else if (sortBy === "Email") {
        if (sortOrder === "ascending") {
            return users.sort((a, b) => a.email.localeCompare(b.email));
        } else {
            return users.sort((a, b) => b.email.localeCompare(a.email));
        }
    } else {
        if (sortOrder === "ascending") {
            return users.sort((a, b) => a.firstName.localeCompare(b.firstName));
        } else {
            return users.sort((a, b) => b.firstName.localeCompare(a.firstName));
        }
    }
};

export const areArraysEqual = (a, b) => {
    return a.length === b.length && a.every((val, index) => val === b[index]);
};

export const getReadableDateString = (isoDateTime) => {
    const dataTime = new Date(isoDateTime);
    return dataTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        time: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    });
};

export const getLastSeenValue = (dateTimeString) => {
    const currentDateTime = new Date();
    const recordDateTime = new Date(dateTimeString);
    const diff = currentDateTime - recordDateTime;
    const timeDiff = {
        milliseconds: diff,
        seconds: Math.floor(diff / 1000),
        minutes: Math.floor(diff / (60 * 1000)),
        hours: Math.floor(diff / (60 * 60 * 1000)),
        days: Math.floor(diff / (24 * 60 * 60 * 1000)),
        months: Math.floor(diff / (30 * 24 * 60 * 60 * 1000)),
        years: Math.floor(diff / (365 * 30 * 24 * 60 * 60 * 1000)),
    };
    const keys = Object.keys(timeDiff).reverse();

    const firstNonZeroValueKey = keys.find((dt) => timeDiff[dt] !== 0);
    const firstNonZeroValue = timeDiff[firstNonZeroValueKey];
    const suffix =
        firstNonZeroValue === 1
            ? firstNonZeroValueKey.slice(0, -1)
            : firstNonZeroValueKey;

    if (firstNonZeroValueKey === keys[keys.length - 1]) {
        return "just now";
    }
    if (firstNonZeroValueKey === keys[keys.length - 2]) {
        return "less than a minute ago";
    }
    return `${firstNonZeroValue} ${suffix} ago`;
};

const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// API request handlers

export const makeClientUserDeletionRequest = async (id, authTokens) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.jwt}`,
    };

    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL + `/api/dashboard/users/${id}`;
    const options = {
        method: "DELETE",
        headers: headers,
        credentials: "include",
    };

    const apiResponse = await fetch(url, options);

    if (!apiResponse.ok) {
        switch (apiResponse.status) {
            case 404:
                toast.error(
                    "Error 404 - User account not found!",
                    getEmitterConfig()
                );
                break;

            default:
                toast.error(
                    `Deletion request failed with status ${apiResponse.status}: ${apiResponse.statusText}`,
                    getEmitterConfig()
                );
                break;
        }
        return { status: apiResponse.status, id: id };
    }

    let result = await parseBodyFromResponseObjectBodyAsReadStream(apiResponse);

    toast.success(
        `User account with name \"${result.firstName} ${result.lastName}\" as been successfully deleted!`,
        getEmitterConfig()
    );
    return { status: apiResponse.status, id: id };
};

export const makeClientUserBlockOrUnblockRequest = async (
    id,
    authTokens,
    action
) => {
    const body = { accountStatus: action === "block" ? 1 : 0 };
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.jwt}`,
    };

    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL + `/api/dashboard/users/${id}`;

    const options = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
        credentials: "include",
    };

    const apiResponse = await fetch(url, options);
    if (!apiResponse.ok) {
        switch (apiResponse.status) {
            case 404:
                toast.error(
                    "Error 404 - User account not found!",
                    getEmitterConfig()
                );
                break;

            default:
                toast.error(
                    `${capitalizeFirstLetter(
                        action
                    )} request failed with status ${apiResponse.status}: ${
                        apiResponse.statusText
                    }`,
                    getEmitterConfig()
                );
                break;
        }
        return { status: apiResponse.status, id: id, action };
    }
    let result = await parseBodyFromResponseObjectBodyAsReadStream(apiResponse);
    toast.success(
        `User account with name \"${result.firstName} ${result.lastName}\" as been successfully ${action}ed!`,
        getEmitterConfig()
    );
    return { status: apiResponse.status, id: id, action };
};

export const handleClientLogout = async () => {
    try {
        await deleteAllCookies();
        localStorage.removeItem("userId");
        localStorage.removeItem("jwt");
        sessionStorage.clear();
        toast("You have been logged out!", getEmitterConfig());
        await redirectToLoginPage();
    } catch (err) {
        console.error("Error during logout:", err);
    }
};

export const makeClientAuthorizationRequest = async (authTokens) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.jwt}`,
    };
    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL + `/api/auth/${authTokens.userId}`;
    const options = {
        method: "GET",
        headers: headers,
        credentials: "include",
    };

    const responseObject = await fetch(url, options);
    if (!responseObject.ok) {
        switch (responseObject.status) {
            case 400:
            case 401:
            case 404:
                handleClientLogout();
                toast("Session expired!", getEmitterConfig());
                return false;

            default:
                toast(
                    "An unexpected server error occurred! Please try again after some time.",
                    getEmitterConfig()
                );
                break;
        }
        return false;
    }
    let result = await parseBodyFromResponseObjectBodyAsReadStream(
        responseObject
    );
    if (result.accountStatus === 1) {
        handleClientLogout();
        toast.error("Access denied!", getEmitterConfig());
        return false;
    }
    return true;
};

export const makeClientSignUpRequest = async (data) => {
    const headers = {
        "Content-Type": "application/json",
    };
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/signup";
    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
        credentials: "include",
    };

    const responseObject = await fetch(url, options);
    if (!responseObject.ok) {
        switch (responseObject.status) {
            case 400:
                toast(
                    "Email address is already registered!",
                    getEmitterConfig()
                );
                break;

            default:
                toast(
                    `Sign up failed with status ${responseObject.status}`,
                    getEmitterConfig()
                );
                break;
        }

        return;
    }

    let result = await parseBodyFromResponseObjectBodyAsReadStream(
        responseObject
    );

    return { status: responseObject.status, body: result };
};

export const makeClientLogInRequest = async (data) => {
    const headers = {
        "Content-Type": "application/json",
    };
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth";
    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
        credentials: "include",
    };

    const responseObject = await fetch(url, options);
    if (!responseObject.ok) {
        switch (responseObject.status) {
            case 404:
            case 401:
                toast(
                    "Invalid credentials! Please make sure your email and password are correct.",
                    getEmitterConfig()
                );
                break;

            default:
                toast(
                    `Log in failed with status ${responseObject.status}`,
                    getEmitterConfig()
                );
                break;
        }

        return;
    }

    let result = await parseBodyFromResponseObjectBodyAsReadStream(
        responseObject
    );

    if (result.accountStatus === 1) {
        toast(
            "Access denied! Your account has been blocked. If you think this was a mistake contact a website administrator.",
            getEmitterConfig()
        );
    }

    if (data.RememberMe) {
        localStorage.setItem("userId", result.id);
        localStorage.setItem("jwt", result.token);
    }

    return { status: responseObject.status, body: result };
};
