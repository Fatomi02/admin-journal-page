import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoutIcon from "../assets/icons/Logout.svg";
import dropdown from "../assets/icons/dropWhite.svg";

export default function NavBar() {
    const navigate = useNavigate()
    const [data, setData] = useState({});
    const dropdownRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false);

    useEffect(()=> {
        document.addEventListener('click', closeDropdown);
        let user = localStorage.getItem('data');
        user = JSON.parse(user)
        setData(user);
        return () => document.removeEventListener('click', closeDropdown)
    }, [])

    const closeDropdown = (event) => {
        if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(() => false)
        }
    }

    const logout = () => {
        localStorage.clear();
        navigate('/login')
    }
    return (
        <div ref={dropdownRef} className="flex justify-end px-8 py-5 bg-primary border-b border-b-[#f5f5f5]">
        <div onClick={() => setIsOpen(!isOpen)} className="border p-2 cursor-pointer flex items-center gap-3 rounded-lg relative border-blue">
            <div className="flex gap-2 items-center capitalize text-white">
                <div className="bg-[#e05897] h-7 w-7 flex justify-center items-center uppercase text-white rounded-md">
                    {data?.user?.[0]}
                </div>
                {data?.user}
            </div>
            <img src={dropdown} alt="dropdown" />
            {isOpen && 
            <div className="dropdown_box">
                <button onClick={() => logout()} className="py-3 text-error w-full px-5 hover:bg-light-grey cursor-pointer flex gap-3 items-center">
                    <img src={logoutIcon} alt="Logout" />
                    Log Out
                </button>
            </div>}

        </div>
    </div>
    )
}