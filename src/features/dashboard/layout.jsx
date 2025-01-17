import React from "react";
import Sidenav from "../../components/SidaNav";
import NavBar from "../../components/NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="flex flex-col bg-light-grey h-screen w-full overflow-hidden lg:flex-row">
            <Sidenav />
            <div className="flex flex-col w-full h-full lg:h-screen overflow-scroll bg-light-grey">
                <div className="w-full block">
                    <div className="hidden lg:block">
                    <NavBar />
                    </div>
                    <div className="lg:px-8 lg:py-6 pb-6 py-4 px-4 w-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}