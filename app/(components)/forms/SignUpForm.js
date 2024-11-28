"use client";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import Button from "@/app/(components)/common/Button";
import InputField from "@/app/(components)/common/InputField";
import AppLogo from "@/app/(components)/common/AppLogo";
import { makeClientSignUpRequest, validateEmail } from "@/app/utils.client";
import { getEmitterConfig } from "@/app/(components)/common/NotificationToaster";
import { useRouter } from "next/navigation";

const SignUpForm = (props) => {
    const router = useRouter();
    const { background_img } = props;

    const emptyFieldsInclude = (emptyFields, value) => {
        return emptyFields.some((x) => x.includes(value));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let data = {
            FirstName: formData.get("fname").trim(),
            LastName: formData.get("lname").trim(),
            Email: formData.get("email").trim(),
            Password: formData.get("password"),
            RePassword: formData.get("repassword"),
        };
        let optionalData = {
            Company: formData.get("company").trim(),
            Designation: formData.get("designation").trim(),
        };

        const errors = [];
        const dict = {
            RePassword: "Re-enter Password",
            FirstName: "First Name",
            LastName: "Last Name",
        };
        const emptyFields = Object.keys(data).filter(
            (key) => data[key] === "" || data[key] === null
        );

        if (emptyFields.length > 0) {
            emptyFields.forEach((x) =>
                errors.push(`Required field ${dict[x] || x} is empty!`)
            );
        }
        if (
            !emptyFieldsInclude(emptyFields, "Email") &&
            !validateEmail(data.Email)
        ) {
            errors.push("Email is invalid! Enter a valid email.");
        }
        if (
            !emptyFieldsInclude(emptyFields, "Password") &&
            data.Password !== data.RePassword
        ) {
            errors.push("Passwords do not match!");
        }
        if (errors.length > 0) {
            errors.forEach((x) => toast.error(x, getEmitterConfig()));
            return;
        }
        data = { ...data, ...optionalData };
        delete data.RePassword;

        let result = makeClientSignUpRequest(data);
        result
            .then((value) => {
                if (value && value.status === 201) {
                    router.push("/dashboard");
                    toast(
                        `Registered successfully! Welcome aboard, ${value.body.firstName}!`,
                        getEmitterConfig()
                    );
                }
            })
            .catch((err) =>
                toast(
                    `Sing up request failed with error message: ${err}!`,
                    getEmitterConfig()
                )
            );
    };
    return (
        <div className="flex min-h-[700px] lg:min-h-[900px] bg-white">
            <div className="hidden lg:block w-1/2 h-screen">
                <Image
                    src={background_img}
                    width={500}
                    height={500}
                    alt="Page Background"
                    className="w-full h-screen min-h-[700px] md:min-h-[900px]"
                />
            </div>
            <div className="content-center w-full pt-32 lg:pt-0 lg:w-1/2">
                <AppLogo alignXOptions={"right-20 lg:right-20 md:max-w-24"} />

                <div className="place-self-center m-auto min-w-80 w-2/5 mt-20">
                    <div className="mb-16">
                        <p>Make a difference</p>

                        <p className="text-2xl font-medium">
                            Create Your The App Account
                        </p>
                    </div>
                    <form onSubmit={(event) => handleSubmit(event)}>
                        <div className=" md:flex md:flex-row md:justify-between gap-1">
                            <InputField
                                name={"fname"}
                                type={"text"}
                                placeholder={"First name*"}
                                layoutStyles={"md:w-3/7"}
                            />
                            <InputField
                                name={"lname"}
                                type={"text"}
                                placeholder={"Last name*"}
                                layoutStyles={"md:w-3/7"}
                            />
                        </div>

                        <InputField
                            name={"email"}
                            type={"email"}
                            placeholder={"Email*"}
                        />
                        <InputField
                            name={"password"}
                            type={"password"}
                            placeholder={"Password*"}
                        />
                        <InputField
                            name={"repassword"}
                            type={"password"}
                            placeholder={"Re-enter Password*"}
                        />

                        <p className="pb-2 pt-2 mt-4 border-t-2 leading-[0.1em]">
                            <span className="absolute -translate-y-5 bg-white text-gray-400 text-sm">
                                &nbsp;&nbsp;Optional&nbsp;
                            </span>
                        </p>

                        <InputField
                            name={"company"}
                            type={"text"}
                            placeholder={"Company"}
                        />

                        <InputField
                            name={"designation"}
                            type={"text"}
                            placeholder={"Designation"}
                        />

                        <Button type={"submit"}>Sign Up</Button>
                    </form>
                </div>

                <p className="mr-24 mt-24 place-self-end float-end">
                    Already have an account?{" "}
                    <Link className="underline text-blue-400" href="/login">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpForm;
