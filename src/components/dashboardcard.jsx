import React from "react";

export default function DashboardCard(props) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-center rounded-2xl bg-white shadow">
            <div
                className="border-r border-r-grey col-span-2 h-full lg:col-span-1 items-center justify-center flex flex-col gap-2 p-4 xl:py-6 xl:px-4">
                <span className="font-bold text-primary">{new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}</span>
            </div>
            <div className="border-r border-r-grey flex flex-col gap-2 p-4 xl:py-6 xl:px-4">
                <span>Total Journal</span>
                <span className="text-xl">{props.data}</span>
            </div>
            <div className="flex flex-col gap-2 p-4 xl:py-6 xl:px-4">
                <span>Total recently added journal</span>
                <span className="text-xl">{props.recentData}</span>
            </div>
        </div>
    )
}