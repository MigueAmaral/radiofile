/* eslint-disable react/prop-types */
import { green } from "@mui/material/colors";
import React from "react";
import { BsHandThumbsUpFill } from "react-icons/bs";
import Marquee from "react-fast-marquee";

export default function StationList({ stationCollection, chooseStation }) {

  return (
    <div className="border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 flex justify-center w-full max-h-[70vh] py-4 px-4 bg-slate-100 items-center mx-auto mt-4 rounded-md shadow-lg">
      <ul className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 bg-slate-100 flex flex-col w-full h-full p-2 rounded-md overflow-y-scroll">
        {stationCollection.map((i) => {
          let uuid = i.stationuuid;
          return (
            <div
              className="w-full grid grid-cols-[20px_1fr] border-slate-500 h-fit gap-6 items-center p-2  hover:bg-slate-300 rounded-md"
              key={uuid}
            >
              <div className="flex flex-col justify-center items-center">
                <BsHandThumbsUpFill color="#006305" />
                <p className="text-[#006305] text-xs">{i.votes}</p>
              </div>
              <li
                onClick={() => chooseStation(uuid)}
                className="cursor-pointer items-center font-sans whitespace-nowrap overflow-hidden text-ellipsis text-gray-700"
              >
                {i.name}{" "}
                <span
                  className={`text-xs ${
                    i.bitrate < 128 ? "text-red-800" : "text-[#006305]"
                  }`}
                >
                  ({i.bitrate})
                </span>
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
