import React, { useState } from "react";
import hidden from '../assets/icons/hidden.svg'
import open from '../assets/icons/open eye.svg'

const AppInput = (props) => {
    const [show, setShow] = useState(false)
    const toggleVisibility = () => {
        setShow(!show)
    }
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={props.id} className="text-dark-grey font-medium">{props.label}</label>
            <input placeholder={props.placeholder} required={props.required} type={props.type === "password" && show ? "text" : props.type} id={props.id} name={props.name} value={props.value} autoComplete='true'
            onChange={ (e) => props.onChange(e)}
            />
            {props?.type === "password" && (
                <div className="relative">
                    {show ? <img
                        onClick={toggleVisibility}
                        width={20}
                        height={20}
                        className="absolute cursor-pointer right-5 top-[-38px]"
                        src={hidden}
                        alt="hidden"
                    /> : <img
                    width={20}
                    height={20}
                        onClick={toggleVisibility}
                        className="absolute cursor-pointer right-5 top-[-38px] w-[20px] h-[20px]"
                        src={open}
                        alt="open"
                    />}

                </div>
            )}
        </div>
    );
};

export default AppInput;
