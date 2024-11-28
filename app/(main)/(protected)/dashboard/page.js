import DashboardContent from "@/app/(components)/DashboardContent";
import { getAllUsers } from "@/app/utils.server";
import { cookies } from "next/headers";

export const metadata = {
    title: "Dashboard",
    description: "Block, unblock or delete users! Go crazy!",
};

const Dashboard = async (props) => {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt").value;
    const userId = cookieStore.get("userId").value;
    const authTokens = { jwt, userId };
    const users = await getAllUsers();

    return (
        <div>
            <DashboardContent authTokens={authTokens} users={users} />
        </div>
    );
};

export default Dashboard;
