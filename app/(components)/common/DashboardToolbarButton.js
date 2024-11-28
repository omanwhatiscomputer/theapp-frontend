const DashboardToolbarButton = ({ children, styles, onClick, hvalue }) => {
    return (
        <button
            value={hvalue}
            type="button"
            className={`ml-1 border-[2px] rounded-lg pl-2 pr-2 pt-1 pb-1 ${styles}`}
            onClick={(e) => onClick(e)}
        >
            {children}
        </button>
    );
};

export default DashboardToolbarButton;
