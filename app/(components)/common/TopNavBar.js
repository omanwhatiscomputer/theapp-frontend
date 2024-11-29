"use client";
import app_logo from "@/public/theapp.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Navbar } from "flowbite-react";
import { handleClientLogout } from "@/app/utils.client";

const TopNavBar = () => {
    const pathname = usePathname();
    const unprotectedPaths = ["/login", "/signup"];
    const isUnprotected = unprotectedPaths.some((path) =>
        pathname.startsWith(path)
    );
    const display = isUnprotected ? "hidden" : "";

    return (
        <Navbar fluid rounded className={`fixed z-20 w-full ${display}`}>
            <Navbar.Brand href="/">
                <Image
                    src={app_logo}
                    width={500}
                    height={200}
                    alt="App logo"
                    className="w-[95px]"
                />
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link
                    href="/dashboard"
                    active={pathname === "/dashboard"}
                >
                    Dashboard
                </Navbar.Link>
                <Navbar.Link
                    className="hover:cursor-pointer"
                    onClick={handleClientLogout}
                >
                    Logout
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default TopNavBar;
