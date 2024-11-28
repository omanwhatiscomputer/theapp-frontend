const DashboardTableNameCell = ({
    lastName,
    firstName,
    designation,
    company,
    isBlocked,
}) => {
    return (
        <div>
            <p
                className={`font-bold ${
                    isBlocked && "text-gray-400 line-through"
                }`}
            >
                {lastName}, {firstName}
            </p>
            {(designation && company && (
                <p className={`text-sm ${isBlocked && "text-gray-400"}`}>
                    {designation}, {company}
                </p>
            )) ||
                "N/A"}
        </div>
    );
};

export default DashboardTableNameCell;
