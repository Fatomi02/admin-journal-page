import React from "react";

export default function Modal(props) {
    return props.isOpen &&
   (     <div className="modal_overlay flex justify-center items-center">
            <div className="flex w-full h-full items-center justify-center">
                {props.children}
            </div>
        </div>)
}