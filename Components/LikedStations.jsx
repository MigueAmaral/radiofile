/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { BsHandThumbsUpFill } from "react-icons/bs";

export default function LikedStations({ votedStations, chooseStation }) {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    setHighlight(true);
    setTimeout(() => {
      setHighlight(false);
    }, 9500);
  }, [votedStations]);

  return (
    <div
      className={`border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 flex justify-center w-full py-1 px-1 ${
        highlight ? "bg-green-700 animate-bounce" : "bg-slate-100"
      } items-center mx-auto rounded-md shadow-lg`}
    >
      <ul className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 bg-slate-100 md:flex lg:flex gap-2 w-full rounded-md">
        {votedStations.map((i) => {
          let uuid = i.stationuuid;
          return (
            <div
              className="w-full grid grid-cols-[20px_1fr_20px] h-fit gap-2 items-center bg-slate-200  hover:bg-slate-300 lg:rounded-md p-2"
              key={uuid}
            >
              <div className="flex flex-col justify-center items-center">
                {i.favicon && i.favicon != "" ? (
                  <img className="rounded-full" src={i.favicon} alt="" />
                ) : (
                  <img
                    className="rounded-full"
                    src="../../radio-svgrepo-com.svg"
                    alt=""
                  />
                )}
              </div>
              <li
                onClick={() => chooseStation(uuid)}
                className="flex flex-col text-sm cursor-pointer justify-center font-sans whitespace-nowrap truncate text-gray-600"
              >
                {i.name}
                <span className="text-xs">
                  {i.country === "The United States Of America"
                    ? "USA"
                    : i.country ===
                      "The United Kingdom Of Great Britain And Northern Ireland"
                    ? "UK"
                    : i.country? i.country : "unk"}
                </span>
              </li>
              <BsHandThumbsUpFill size={20} color="#006305" />
            </div>
          );
        })}
      </ul>
    </div>
  );
}
