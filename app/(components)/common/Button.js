const Button = (props) => {
    const { type, children, onClick } = props;
    return (
        <button
            type={type}
            className="w-full rounded-lg mt-12 bg-blue-500 text-white font-bold leading-8 hover:bg-sky-700"
            onClick={() => (onClick ? onClick() : "")}
        >
            {children}
        </button>
    );
};

export default Button;
