import React from "react";
import { useNavigate } from "react-router-dom";
import diagonalArrow from '../assets/icons/arrow_diagonal_blue.svg'

export default function DashboardBanner(props) {
    const navigate = useNavigate();

    const goToRoute = (route) => {
        navigate(`${route}`)
    }
  return (
    <div className="p-6 flex flex-col md:flex-row xl:items-center rounded-2xl bg-primary">
      <div className="flex flex-col items-start gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl lg:text-3xl font-medium text-light-grey">
            {props.title}
          </h2>
          <span className="text-white">{props.description}</span>
        </div>
        <button onClick={() => goToRoute(props.route)} className="flex items-center bg-white rounded-lg py-[6px] px-3 text-[14px] text-[#0D3051]">
          {props.routeTo}
          <img
            className="inline-block ml-1"
            src={diagonalArrow}
            alt="goTo"
          />
        </button>
      </div>
    </div>
  );
}
