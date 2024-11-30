"use client";
import DashboardToolbarButton from "@/app/(components)/common/DashboardToolbarButton";

import { useEffect, useState } from "react";

import { FaLock, FaLockOpen, FaRegTrashAlt, FaUser } from "react-icons/fa";
import {
    areArraysEqual,
    getLastSeenValue,
    getReadableDateString,
    getSortedUsers,
    makeClientAuthorizationRequest,
    makeClientUserBlockOrUnblockRequest,
    makeClientUserDeletionRequest,
} from "../utils.client";
import DashboardTableHeader from "./common/DashboardTableHeader";
import DashboardTableNameCell from "./common/DashboardTableNameCell";
import DashboardTableLastSeenCell from "./common/DashboardTableLastSeenCell";
import { getEmitterConfig } from "./common/NotificationToaster";
import { toast } from "react-toastify";

const DashboardContent = (props) => {
    const [sortBy, setSortBy] = useState("LastSeen");
    const [sortOrder, setSortOrder] = useState("descending");

    const [users, setUsers] = useState(props.users);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allUsersSelected, setAllUsersSelected] = useState(false);

    const sortingProps = { sortBy, sortOrder };

    const handleSortingOptions = (event) => {
        const value = event.currentTarget.value;

        if (value === sortBy) {
            setSortOrder((prevOrder) => {
                const newOrder =
                    prevOrder === "descending" ? "ascending" : "descending";

                const sortedUsers = getSortedUsers(users, value, newOrder);
                setUsers(sortedUsers);

                return newOrder;
            });
        } else {
            setSortBy(value);
            setSortOrder("ascending");

            const sortedUsers = getSortedUsers(users, value, "ascending");
            setUsers(sortedUsers);
        }
    };

    const isIdSelected = (id) => {
        return selectedUsers.some((x) => x === id);
    };
    const areAllUsersSelected = () => {
        let allUsers = [...users.map((i) => i.id)];
        return areArraysEqual(allUsers, selectedUsers);
    };
    useEffect(() => {
        if (areAllUsersSelected) {
            setAllUsersSelected(true);
        } else {
            setAllUsersSelected(false);
        }
    }, [selectedUsers]);

    const handleSpecificUserSelect = (event) => {
        if (!isIdSelected(event.target.id)) {
            let susers = [...selectedUsers, event.target.id];
            setSelectedUsers(susers);

            let allUsers = [...users.map((i) => i.id)];
            if (areArraysEqual(susers, allUsers)) setAllUsersSelected(true);
        } else {
            let susers = [...selectedUsers];
            susers = susers.filter((x) => x !== event.target.id);
            setSelectedUsers(susers);
            setAllUsersSelected(false);
        }
    };
    const handleAllUsersSelect = () => {
        let allUsers = [...users.map((i) => i.id)];
        if (!areArraysEqual(allUsers, selectedUsers)) {
            setSelectedUsers(allUsers);
            setAllUsersSelected(true);
        } else {
            setSelectedUsers([]);
            setAllUsersSelected(false);
        }
    };
    const handleRowClick = (id) => {
        const tempObj = { target: { id: id } };
        handleSpecificUserSelect(tempObj);
    };

    const updateAccountStatusOnClient = (id, newValue) => {
        setUsers((prevState) =>
            prevState.map((x) =>
                x.id === id ? { ...x, accountStatus: newValue } : x
            )
        );
    };

    // API dependent
    const handleBlockOrUnblockUser = async (event) => {
        const action = event.currentTarget.value;

        if (selectedUsers.length === 0) {
            toast.error("No users selected!", getEmitterConfig());
            return;
        }
        // saving the affected users
        let affectedUserObjects = selectedUsers.map((x) =>
            users.find((y) => y.id === x)
        );

        // filtering out users who aren't affected
        affectedUserObjects =
            action === "block"
                ? affectedUserObjects.filter((x) => x.accountStatus !== 1)
                : affectedUserObjects.filter((x) => x.accountStatus !== 0);

        if (affectedUserObjects.length === 0) {
            toast.error(
                `Selected users are already ${action}ed`,
                getEmitterConfig()
            );
            return;
        }

        // updating users id list
        const affectedUserIds = affectedUserObjects.map((x) => x.id);

        // intent: update affected users' html elements
        action === "block"
            ? selectedUsers.forEach((id) => updateAccountStatusOnClient(id, 1))
            : selectedUsers.forEach((id) => updateAccountStatusOnClient(id, 0));

        // authorize user
        let isAuthorized = await makeClientAuthorizationRequest(
            props.authTokens
        );

        if (!(await isAuthorized)) {
            return;
        }

        // make API request
        const results = affectedUserIds.map((id) =>
            makeClientUserBlockOrUnblockRequest(id, props.authTokens, action)
        );

        let failedOperationsId = [];
        results.map((p) => {
            p.then((value) => {
                switch (value.status) {
                    case 200:
                    case 201:
                        break;
                    case 404:
                        break;
                    default:
                        failedOperationsId.push(value.id);
                        break;
                }
            }).catch((err) => {
                toast.error(
                    `An unexpected error occurred with message: ${err}!`,
                    getEmitterConfig()
                );
            });
        });

        if (failedOperationsId.length === 0) {
            // toast.success(
            //     `All users ${action}ed successfully!`,
            //     getEmitterConfig()
            // );
        } else {
            toast.error(`Failed to ${action} some users!`, getEmitterConfig());
            action === "block"
                ? failedOperationsId.map((id) =>
                      updateAccountStatusOnClient(id, 0)
                  )
                : failedOperationsId.map((id) =>
                      updateAccountStatusOnClient(id, 1)
                  );
        }
    };

    const handleDeleteUser = async (event) => {
        if (selectedUsers.length === 0) {
            toast.error("No users selected!", getEmitterConfig());
            return;
        }

        // saving the affected users
        let affectedUserObjects = selectedUsers.map((x) =>
            users.find((y) => y.id === x)
        );

        // filter Out Non Existent users
        affectedUserObjects = affectedUserObjects.filter((x) =>
            users.some((y) => y.id === x.id)
        );
        if (affectedUserObjects.length === 0) {
            toast.error("Selected user(s) do not exist!", getEmitterConfig());
            return;
        }

        // updating users id list
        const affectedUserIds = affectedUserObjects.map((x) => x.id);

        // updating client html
        setUsers((prevState) =>
            prevState.filter((x) => !affectedUserIds.includes(x.id))
        );

        // authorize user
        let isAuthorized = await makeClientAuthorizationRequest(
            props.authTokens
        );

        if (!(await isAuthorized)) {
            return;
        }

        // make API request
        const results = affectedUserIds.map((id) =>
            makeClientUserDeletionRequest(id, props.authTokens)
        );
        let failedOperationsId = [];
        results.map((p) => {
            p.then((value) => {
                switch (value.status) {
                    case 200:
                    case 201:
                        break;
                    case 404:
                        break;
                    default:
                        failedOperationsId.push(value.id);
                        break;
                }
            }).catch((err) => {
                toast.error(
                    `An unexpected error occurred with message: ${err}!`,
                    getEmitterConfig()
                );
            });
        });
        if (failedOperationsId.length === 0) {
            // toast.success(
            //     `All users deleted successfully!`,
            //     getEmitterConfig()
            // );
            setSelectedUsers([]);
        } else {
            toast.error(`Failed to delete some users!`, getEmitterConfig());
            setUsers((prevState) => ({ ...prevState, ...affectedUserObjects }));
        }
    };

    const theadStyle = "sticky";

    return (
        <div>
            <div className="mb-1 w-full pt-1 pb-1 bg-slate-50 pl-5 fixed z-10 top-[56px]">
                <DashboardToolbarButton
                    styles={
                        "text-blue-500 border-blue-500 hover:bg-gray-100 active:bg-gray-200"
                    }
                    onClick={handleBlockOrUnblockUser}
                    hvalue={"block"}
                >
                    <FaLock className="inline h-4 -translate-y-[0.15rem] text-blue-500" />
                    &nbsp;Block
                </DashboardToolbarButton>
                <DashboardToolbarButton
                    styles={
                        "text-blue-500 border-blue-500 hover:bg-gray-100 active:bg-gray-200"
                    }
                    onClick={handleBlockOrUnblockUser}
                    hvalue={"unblock"}
                >
                    <FaLockOpen className="inline h-4 -translate-y-[0.15rem] text-blue-500" />
                </DashboardToolbarButton>
                <DashboardToolbarButton
                    styles={
                        "text-blue-500 border-red-700 hover:bg-gray-100 active:bg-gray-200"
                    }
                    onClick={handleDeleteUser}
                    hvalue={"delete"}
                >
                    <FaRegTrashAlt className="inline h-4 -translate-y-[0.15rem] text-red-700" />
                </DashboardToolbarButton>
            </div>
            <div className=" h-[100px] bg-white w-full"></div>
            <div className="relative ">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-collapse">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-[100px] z-10">
                        <tr>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-right ${theadStyle}`}
                            >
                                <input
                                    id="default-checkbox"
                                    checked={allUsersSelected}
                                    type="checkbox"
                                    onChange={() => handleAllUsersSelect()}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 ${theadStyle}`}
                            >
                                <DashboardTableHeader
                                    hvalue={"Name"}
                                    handleSortingOptions={handleSortingOptions}
                                    sortingProps={sortingProps}
                                >
                                    Name
                                </DashboardTableHeader>
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 ${theadStyle}`}
                            >
                                <DashboardTableHeader
                                    hvalue={"Email"}
                                    handleSortingOptions={handleSortingOptions}
                                    sortingProps={sortingProps}
                                >
                                    Email
                                </DashboardTableHeader>
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 ${theadStyle}`}
                            >
                                <DashboardTableHeader
                                    hvalue={"LastSeen"}
                                    handleSortingOptions={handleSortingOptions}
                                    sortingProps={sortingProps}
                                >
                                    Last Seen
                                </DashboardTableHeader>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="overflow-auto max-h-full">
                        {users.map((x) => (
                            <tr
                                className="bg-white border-b hover:bg-gray-100 cursor-pointer"
                                key={x.id}
                                onClick={() => handleRowClick(x.id)}
                            >
                                <td
                                    scope="col"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-right"
                                >
                                    <input
                                        id={x.id}
                                        type="checkbox"
                                        value={x.id}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        checked={isIdSelected(x.id)}
                                        onChange={(event) =>
                                            handleSpecificUserSelect(event)
                                        }
                                    />
                                </td>
                                <td className="px-6 py-4 flex">
                                    <DashboardTableNameCell
                                        lastName={x.lastName}
                                        firstName={x.firstName}
                                        designation={x.designation}
                                        company={x.company}
                                        isBlocked={x.accountStatus === 1}
                                    />
                                    {props.authTokens.userId === x.id && (
                                        <span className="bg-blue-100 opacity-50 text-blue-800 h-5 text-xs font-sm me-2 px-1.5 py-0.5 rounded-full">
                                            {<FaUser />}
                                        </span>
                                    )}
                                </td>
                                <td
                                    className={`px-6 py-4 ${
                                        x.accountStatus === 1 && "text-gray-400"
                                    }`}
                                >
                                    {x.email}
                                </td>
                                <td className="px-6 py-4">
                                    <DashboardTableLastSeenCell
                                        lastSeen={getLastSeenValue(x.lastLogin)}
                                        readableDate={getReadableDateString(
                                            x.lastLogin
                                        )}
                                        id={x.id}
                                        isBlocked={x.accountStatus === 1}
                                        previousLoginDates={
                                            x.previousLoginDates
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardContent;
