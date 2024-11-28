import background_img from "../../../../public/background2.jpg";
import SignUpForm from "@/app/(components)/forms/SignUpForm";

export const metadata = {
    title: "Sign up for The App",
    description: "Great things await you! Join the wolfpack and be the change!",
};
const SignUp = (props) => {
    return <SignUpForm background_img={background_img} />;
};

export default SignUp;
