"use client";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Button from "@/app/(components)/common/Button";
import InputField from "@/app/(components)/common/InputField";
import AppLogo from "@/app/(components)/common/AppLogo";
import { getEmitterConfig } from "@/app/(components)/common/NotificationToaster";
import { makeClientLogInRequest, validateEmail } from "@/app/utils.client";

const LogInForm = (props) => {
    const router = useRouter();

    const { background_img } = props;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let data = {
            Email: formData.get("email").trim(),
            Password: formData.get("password"),
        };
        const emptyFields = Object.keys(data).filter(
            (key) => data[key] === "" || data[key] === null
        );
        if (emptyFields.length > 0) {
            emptyFields.forEach((x) =>
                toast.error(`Input field ${x} is empty!`, getEmitterConfig())
            );
            return;
        }
        if (!validateEmail(data.Email)) {
            toast.error(
                "Email is invalid! Enter a valid email.",
                getEmitterConfig()
            );
            return;
        }
        data = { ...data, RememberMe: formData.get("remember") };
        let result = makeClientLogInRequest(data);
        result
            .then((value) => {
                if (
                    value &&
                    value.status === 200 &&
                    value.body.accountStatus !== 1
                ) {
                    router.push("/dashboard");
                    toast(
                        `Logged in successfully! Welcome back ${value.body.firstName}!`,
                        getEmitterConfig()
                    );
                }
            })
            .catch((err) =>
                toast(
                    `Login request failed with error message: ${err}!`,
                    getEmitterConfig()
                )
            );
    };

    return (
        <div className="flex min-h-[700px] lg:min-h-[900px] bg-white">
            <div className="content-center w-full pt-36 lg:pt-0 lg:w-1/2">
                <AppLogo alignXOptions={"left-20 lg:left-20 md:max-w-52"} />

                <div className="place-self-center m-auto w-80 md:w-[400px] bg-white">
                    <div className="mb-16">
                        <p>Start your journey</p>

                        <p className="text-2xl font-medium">
                            Sign In to The App
                        </p>
                    </div>
                    <form onSubmit={(event) => handleSubmit(event)}>
                        <InputField
                            name={"email"}
                            type={"email"}
                            placeholder={"Email"}
                        />
                        <InputField
                            name={"password"}
                            type={"password"}
                            placeholder={"Password"}
                        />

                        <div className="ml-4">
                            <input name="remember" id="rm" type="checkbox" />
                            <label className="ml-2" htmlFor="rm">
                                Remember Me
                            </label>
                        </div>

                        <Button type="submit">Sign In</Button>
                    </form>
                </div>

                <p className="ml-20 mt-24">
                    Don&#39;t have an account?{" "}
                    <Link className="underline text-blue-400" href="/signup">
                        Sign Up
                    </Link>
                </p>
            </div>
            <div className="hidden lg:block w-1/2 h-screen">
                <Image
                    src={background_img}
                    width={500}
                    height={500}
                    alt="Page Background"
                    className="w-full h-screen min-h-[700px] lg:min-h-[900px]"
                />
            </div>
        </div>
    );
};

export default LogInForm;
