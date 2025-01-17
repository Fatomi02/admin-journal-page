import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import homeIcon from "../assets/icons/Home.svg";
import logo from "../assets/logos/ACTA-BIOSCIENTA.png";
import homeIconWhite from "../assets/icons/homeWhite.svg";
import journal from "../assets/icons/journal.svg";
import logoutIcon from "../assets/icons/Logout.svg";
import hamburger from "../assets/icons/hambuger.svg"

export default function Sidenav() {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
        let user = localStorage.getItem('data');
        user = JSON.parse(user)
        setData(user);
    }, [])

    const closeSideNav = () => {
        setIsOpen(() => false)
    }
    const logout = () => {
        localStorage.clear();
        navigate('/login')
    }
    return (
        <div>
            <div className="h-screen hidden lg:flex flex-col justify-between min-w-[330px] bg-primary border-r border-[#f5f5f5]">
                <div className="p-8 flex flex-col mt-[50px] gap-10">
                    <div className="flex w-full justify-center">
                        <img width={100} height={100} src={logo} alt="Acta BioScientia" />
                    </div>
                    <h1 className="text-3xl text-center font-semibold text-white">
                        Acta BioScientia
                    </h1>
                    <div className="flex flex-col gap-5">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? `py-4 px-5 w-full flex items-center gap-2 active_link`
                                    : `py-4 px-5 w-full flex items-center gap-2`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <img
                                        className="h-6 w-6"
                                        src={isActive ? homeIconWhite : homeIcon}
                                        alt="Home"
                                    />
                                    Dashboard
                                </>
                            )}
                        </NavLink>
                        <NavLink
                            to="/journals"
                            className={({ isActive }) =>
                                isActive
                                    ? `py-4 px-5 w-full flex items-center gap-2 active_link`
                                    : `py-4 px-5 w-full flex items-center gap-2`
                            }
                        >
                            <img className="h-6 w-6" src={journal} alt="journal" />
                            Journals
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="py-3 lg:hidden  bg-primary border-0 px-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex gap-1 items-center">
                    <img width={32} height={32} src={logo} alt="Acta BioScientia" />
                    <h1 className="text-center text-white">Acta BioScientia</h1>
                </div>
                <img
                    onClick={() => setIsOpen(true)}
                    className="w-8 h-8"
                    src={hamburger}
                    alt="hamburger"
                />
            </div>
            {isOpen && (
                <div onClick={closeSideNav} className="modal_overlay lg:hidden">
                    <div onClick={(e) => e.stopPropagation()} className="h-screen relative z-10 w-[78%] bg-primary flex flex-col justify-between pb-10">
                        <div className="p-8 flex flex-col mt-[20px] gap-8">
                            <div className="flex w-full justify-center">
                                <img width={100} height={100} src={logo} alt="Acta BioScientia" />
                            </div>
                            <h1 className="text-3xl text-center font-semibold text-white">
                                Acta BioScientia
                            </h1>
                            <div className="flex flex-col gap-5">
                                <NavLink
                                   onClick={closeSideNav}
                                    to="/"
                                    className={({ isActive }) =>
                                        isActive
                                            ? `py-4 px-5 w-full flex items-center gap-2 active_link`
                                            : `py-4 px-5 w-full flex items-center gap-2`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <img
                                                className="h-6 w-6"
                                                src={isActive ? homeIconWhite : homeIcon}
                                                alt="Home"
                                            />
                                            Dashboard
                                        </>
                                    )}
                                </NavLink>
                                <NavLink
                                onClick={closeSideNav}
                                    to="/journals"
                                    className={({ isActive }) =>
                                        isActive
                                            ? `py-4 px-5 w-full flex items-center gap-2 active_link`
                                            : `py-4 px-5 w-full flex items-center gap-2`
                                    }
                                >
                                    <img className="h-6 w-6" src={journal} alt="journal" />
                                    Journals
                                </NavLink>
                            </div>
                        </div>
                        <button onClick={logout} className="flex items-start w-full gap-2 p-6 text-white">
                            <img src={logoutIcon} alt="Logout" />
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
