import { FaSortDown, FaSortUp } from "react-icons/fa6";

const DashboardTableHeader = ({
    children,
    hvalue,
    handleSortingOptions,
    sortingProps,
}) => {
    return (
        <button
            className="text-xs text-gray-700 uppercase bg-gray-50"
            scope="col"
            value={hvalue}
            onClick={(event) => handleSortingOptions(event)}
        >
            {children}
            {hvalue === sortingProps.sortBy &&
                (sortingProps.sortOrder === "descending" ? (
                    <FaSortDown
                        className={"inline ml-1 h-4 -translate-y-[5px]"}
                    />
                ) : (
                    <FaSortUp className={"inline ml-1 h-4 translate-y-[3px]"} />
                ))}
        </button>
    );
};

export default DashboardTableHeader;
