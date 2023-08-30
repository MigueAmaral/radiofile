/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { BsHandThumbsUpFill } from "react-icons/bs";
import { auth, db } from "/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { AiOutlineDelete } from "react-icons/ai";

export default function SavedStations({ chooseStation, update, setUpdate, savedStations, setSavedStations }) {
  
  const [user, loading] = useAuthState(auth);

  async function getStations() {
    let stationsA = [];
    if (user) {
      const querySnapshot = await getDocs(collection(db, "Stations"));
      querySnapshot.forEach((doc) => {
        stationsA.push({ id: doc.id, data: doc.data() });
      });
      setSavedStations(stationsA);
    }
  }

  async function delStations(key) {
    let deleteStation = savedStations.find((i) => i.id === key);
    await deleteDoc(doc(db, "Stations", deleteStation.id));
    setUpdate(!update);
  }

  useEffect(() => {
    getStations();
  }, [user, update]);

  if (savedStations && savedStations.length != 0) {
    return (
      <div className="border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 flex justify-center w-full h-full py-4 px-4 bg-slate-100 items-center mx-auto rounded-md shadow-lg">
        <ul className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 bg-slate-100 flex flex-col w-full p-2 rounded-md max-h-[34vh] overflow-y-scroll">
          {savedStations &&
            savedStations.map((i) => {
              let uuid = i.data.station.stationuuid;
              return (
                <div
                  className="w-full grid grid-cols-[20px_1fr_20px] border-slate-500 h-fit gap-6 items-center p-3 hover:bg-slate-300 rounded-md"
                  key={i.id}
                >
                  <div className="flex flex-col justify-center items-center">
                    {i.data.station.favicon && i.data.station.favicon != ""? (
                      <img
                        className="rounded-full"
                        src={i.data.station.favicon}
                        alt=""
                      />
                    ): <img
                    className="rounded-full"
                    src="../../radio-svgrepo-com.svg"
                    alt=""
                  />}
                  </div>
                  <li
                    onClick={() => chooseStation(uuid)}
                    className="cursor-pointer items-center font-sans whitespace-nowrap overflow-hidden text-ellipsis text-gray-600"
                  >
                    {i.data.station.name}{" "}
                    <span className="text-xs">({i.data.station.country === "The United States Of America"? "USA" :i.data.station.country === "The United Kingdom Of Great Britain And Northern Ireland"? "UK" : i.data.station.country})</span>
                  </li>
                  <AiOutlineDelete
                    onClick={() => delStations(i.id)}
                    className="cursor-pointer hover:bg-slate-400 rounded-full"
                    size={15}
                  />
                </div>
              );
            })}
        </ul>
      </div>
    );
  }
}
