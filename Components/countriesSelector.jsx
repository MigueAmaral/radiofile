import React, { useEffect, useState } from "react";
import axios from "axios";
import { Combobox } from "./ui/Combobox";

export default function CountriesSelector({country, setCountry, setCountryName}) {
  const [countryList, setCountryList] = useState();

  const servers = [
    "https://de1.api.radio-browser.info",
    "https://at1.api.radio-browser.info",
    "https://nl1.api.radio-browser.info",
  ];

  useEffect(() => {
    axios
      .get("https://at1.api.radio-browser.info/json/countries")
      .then((res) => setCountryList(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 flex justify-center w-1/2 h-fit-content py-4 px-4 bg-slate-100 items-center mx-auto mt-4 rounded-md shadow-lg">
      {countryList && <Combobox list={countryList} item={country} setItem={setCountry} setCountryName={setCountryName} ticket={"country"} />}
    </div>
  );
}
