import React from "react";

export default function Modal(props) {
    return props.isOpen &&
   (     <div className="modal_overlay flex justify-center items-center">
            <div className="bg-white p-4 border rounded-xl max-h-screen lg:max-h-[80vh] overflow-y-auto">
                {props.children}
            </div>
        </div>)
}