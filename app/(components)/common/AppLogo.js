import Image from "next/image";
import app_logo from "../../../public/theapp.png";

const AppLogo = ({ alignXOptions }) => {
    const logoStyle = `absolute max-w-40 top-10 lg:top-15 ${alignXOptions}`;
    return (
        <Image
            src={app_logo}
            width={500}
            height={200}
            alt="App logo"
            className={logoStyle}
        />
    );
};

export default AppLogo;
