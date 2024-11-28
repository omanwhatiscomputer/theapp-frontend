import background_img from "../../../../public/background1.jpg";
import LogInForm from "@/app/(components)/forms/LogInForm";

export const metadata = {
    title: "Sign in to The App",
    description: "Start your journey here!",
};
const Login = (props) => {
    return <LogInForm background_img={background_img} />;
};

export default Login;
