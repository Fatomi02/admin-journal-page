import React, { useEffect, useState } from "react";
import DashboardBanner from "../../components/DashboardBanner";
import empty from '../../assets/images/empty.png'
import DashboardCard from "../../components/dashboardcard";
import { useNavigate } from "react-router";
import api from "../../api/api";
import { toast } from "react-toastify";

export default function Dashboard() {
    const [journals, setJournals] = useState([]);
    const [recentJournals, setRecentJournals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        fetchJournal()
    }, []);

    const fetchJournal = () => {
        setIsLoading(true)
        api.get('/api/journals').then((res) => {
            if (res && res.status === 200) {
                setIsLoading(false);
                setJournals(res.data.journals);
                setRecentJournals(res.data.journals?.slice(0, 5))
            }
        }).catch((error) => {
            toast.error(error);
            setIsLoading(false);
            console.error(error);
        })
    }

    const routeTo = (route) => {
        navigate(route)
    }

    return (
        <div className="flex flex-col gap-4">
            <DashboardBanner title="My Dashboard"
                description="Welcome! Have a view of your recently added journals"
                routeTo="Go to journal" route="/journals" />
            <DashboardCard data={journals.length} recentData={recentJournals.length} />
            <div className="grid grid-cols-1 gap-4">
                <div className="px-4 py-2 flex flex-col gap-4 bg-white big_card">
                    <div className="flex justify-between items-center">
                        <h2>Recent Added Article</h2>
                        <button onClick={() => routeTo('/journals')} className="text-blue p-2 hover:opacity-80">
                            View all {">"}
                        </button>
                    </div>
                    {(journals.length > 0 && !isLoading) && (
                    <div className="flex flex-col w-full">
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 bg-blue py-3 px-4 rounded-lg w-full border-b border-b-primary">
                            <div className="w-full col-span-4 md:col-span-3">Title</div>
                            <div className="w-full hidden md:flex md:col-span-2">Date</div>
                            <div className="w-full hidden md:block">Volume</div>
                        </div>
                        <div>
                            {journals.map((journal, index) => (
                                <div key={journal._id}>
                                <div
                                    className="grid grid-cols-4 md:grid-cols-6 gap-4 py-4 items-center px-4 rounded-lg hover:bg-partial-white cursor-pointer"
                                >
                                    <div className="pr-4 w-full truncate capitalize flex col-span-4 md:col-span-3">
                                        <span className="truncate w-[98%]">
                                        {journal.title}
                                        </span>
                                    </div>
                                    <div className="pr-4 w-full truncate hidden md:flex md:col-span-2">
                                        <span className="w-[98%] truncate">
                                        {new Date(journal.date).toLocaleString("en-US", {
                                            month: "long",
                                            day: "2-digit",
                                            year: "numeric",
                                        })}
                                        </span>
                                    </div>
                                    <div className="md:flex gap-2 items-center hidden">
                                        <span className="truncate capitalize">
                                            {journal.volume}
                                        </span>
                                    </div>
                                </div>
                                {index !== journals.length - 1 &&
                                        <div className="w-full h-[1px] bg-[#e5e5e5]"></div>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                    {(journals.length === 0 && !isLoading) && (
                        <div className="min-h-[200px] pb-8 w-full flex flex-col gap-4 justify-center items-center text-light-blue text-xl">
                            <img height="200" width="200" src={empty} alt="" />
                            No recent journal
                        </div>
                    )}
                    {isLoading && (
                        <div className="flex justify-center items-center w-full h-[200px]">
                            <span className="main_loader"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}