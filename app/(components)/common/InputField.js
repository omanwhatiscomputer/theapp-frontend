const InputField = (props) => {
    const { name, type, placeholder, layoutStyles } = props;
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            className={`border-[1px] w-full rounded-2xl leading-10 pl-4 mb-4 focus:outline-blue-400 focus:outline-none ${layoutStyles}`}
        />
    );
};

export default InputField;

// {...(isRequired ? { required: true } : {})}
