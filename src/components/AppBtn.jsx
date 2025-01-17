import React from "react";

const AppBtn = (props) => {
  return (
    <div className={props.isLoading ? 'w-[100px]' : ''}>
      <button
        className={`${props.variant} py-3 px-4 flex items-center gap-1 justify-center relative text-center font-medium w-full rounded-[8px]`}
        type={props.type}
        disabled={props.disabled}
        onClick={props.onClick} // Attach the onClick handler here
      >
        {props.isLoading ? (
          <span className="loader"></span>
        ) : (
          props.children
        )}
      </button>
    </div>
  );
};

export default AppBtn;