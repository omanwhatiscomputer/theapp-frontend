import { Tooltip } from "react-tooltip";
import { Sparklines, SparklinesBars } from "react-sparklines";
const DashboardTableLastSeenCell = ({
    lastSeen,
    readableDate,
    id,
    isBlocked,
    previousLoginDates,
}) => {
    const getBarChartData = (arr) => {
        const currentDate = new Date().toISOString().substring(0, 10);
        let data = [currentDate];
        const prefix = currentDate.substring(0, 8);
        const date = currentDate.substring(8);
        for (let i = 1; i < 7; i++) {
            data.push(prefix + (Number(date) - i));
        }
        data = data.map((x) => arr.filter((y) => y === x).length);
        return data.reverse();
    };
    const data = getBarChartData(previousLoginDates);

    return (
        <>
            <a
                data-tooltip-id={id}
                data-tooltip-content={readableDate}
                className={`${isBlocked && "text-gray-400"}`}
            >
                {lastSeen}
                <Sparklines data={data} style={{ maxWidth: "85px" }}>
                    <SparklinesBars
                        style={{
                            fill: "#3f83f8",
                            stroke: "skyblue",
                            fillOpacity: ".75",
                        }}
                    />
                </Sparklines>
            </a>
            <Tooltip id={id} />
        </>
    );
};

export default DashboardTableLastSeenCell;
