/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import axios from "axios";
import LikedStations from "./LikedStations";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LocationDisplay({
  station,
  votedStations,
  chooseStation,
}) {
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [weather, setWeather] = useState();
  const [wiki, setWiki] = useState();
  const [wikiName, setWikiName] = useState();
  const [description, setDescription] = useState();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.2, 2]);

  function getLoc() {
    if (
      (station.country === "The United States Of America" &&
        station.state !== "") ||
      station.country === ""
    ) {
      axios
        .get(
          `https://nominatim.openstreetmap.org/search?countrycodes=${station.countrycode}&q=${station.state}&format=json&addressdetails=1&extratags=1&namedetails=1&accept-language=en`
        )
        .then((res) => {
          let data = res.data[0];
          setLat(data.lat);
          setLong(data.lon);
          if (!data.extratags) {
            setWikiName(data.address.state);
          } else {
            setWiki(data.extratags.wikidata);
          }
        })
        .catch((err) => console.log(err));
    } else if (station.state !== "") {
      axios
        .get(
          `https://nominatim.openstreetmap.org/search?q=${station.state}&countrycodes=${station.countrycode}&format=json&addressdetails=1&extratags=1&namedetails=1&accept-language=en`
        )
        .then((res) => {
          let data = res.data[0];
          setLat(data.lat);
          setLong(data.lon);
          if (!data.extratags) {
            setWikiName(data.address.city);
          } else {
            setWiki(data.extratags.wikidata);
          }
        })
        .catch((err) => console.log(err));
    } else if (station.state === "") {
      let country;
      if (station.country === "The United States Of America") {
        country = "USA";
      } else if (
        station.country ===
        "The United Kingdom Of Great Britain And Northern Ireland"
      ) {
        country = "UK";
      } else if (station.country.substr(0, 4) === "The ") {
        country = station.country.substr(4);
      } else {
        country = station.country;
      }
      axios
        .get(
          `https://nominatim.openstreetmap.org/search?q=${country}&countrycodes=${station.countrycode}&format=json&addressdetails=1&extratags=1&namedetails=1&accept-language=en`
        )
        .then((res) => {
          let data = res.data[0];
          if (data) {
            setLat(data.lat);
          } else setLat(null);
          if (data) {
            setLong(data.lon);
          } else setLong(null);
          if (data && !data.extratags) {
            setWikiName(data.address.country);
          } else if (data && data.extratags) {
            setWiki(data.extratags.wikidata);
          } else {
            setWiki(null);
            setWikiName(null);
          }
        })
        .catch((err) => console.log(err));
    }
  }

  function getAppLoc() {
    axios
      .get(
        `https://nominatim.openstreetmap.org/search?q=${station.country}&format=json&addressdetails=1&extratags=1&namedetails=1&accept-language=en`
      )
      .then((res) => {
        let data = res.data[0];
        setLat(data.lat);
        setLong(data.lon);
        if (!data.extratags) {
          setWikiName(data.address.country);
        } else {
          setWiki(data.extratags.wikidata);
        }
      })
      .catch((err) => console.log(err));
  }

  function getWeather() {
    if (station.geo_lat && station.geo_long) {
      axios
        .get(
          `https://api.weatherapi.com/v1/current.json?key=${
            import.meta.env.VITE_W_API_KEY
          }&q=${station.geo_lat},${station.geo_long}`
        )
        .then((res) => {
          let data = res.data.current;
          setWeather(data);
        })
        .catch((err) => console.log(err));
    } else if (lat && long) {
      axios
        .get(
          `https://api.weatherapi.com/v1/current.json?key=${
            import.meta.env.VITE_W_API_KEY
          }&q=${lat},${long}`
        )
        .then((res) => {
          let data = res.data.current;
          setWeather(data);
        })
        .catch((err) => console.log(err));
    }
  }

  function getWikiCode() {
    if (wiki) {
      axios
        .get(
          `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks/urls&ids=${wiki}&origin=*&sitefilter=enwiki`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_WIKI_ACCESS}`,
              "Api-User-Agent": "RadiofileTest",
            },
          }
        )
        .then((res) => {
          let entity = Object.values(res.data.entities)[0].sitelinks.enwiki
            .title;
          setWikiName(entity);
        })
        .catch((err) => console.log(err));
    }
  }

  function getWikiDescription() {
    if (wikiName) {
      axios
        .get(
          `https://en.wikipedia.org/w/api.php?&format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${wikiName}&origin=*`
        )
        .then((res) => {
          let response = Object.values(res.data.query.pages);
          setDescription("");
          setDescription(response[0]);
        })
        .catch((err) => console.log(err));
    }
  }

  function getWikiSummary() {
    if (wikiName) {
      axios
        .get(`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiName}`)
        .then((res) => {
          setDescription(res.data);
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    if (station) {
      getLoc();
    }
  }, [station]);

  useEffect(() => {
    getWeather();
    getWikiCode();
    if (station && !long) {
      getAppLoc();
    }
  }, [long]);

  useEffect(() => {
    if (wikiName) {
      getWikiSummary();
    }
  }, [wikiName]);

  useEffect(() => {
    if (description && description.extract < 10) {
      getWikiDescription();
    }
  }, [description]);

  return (
    <motion.div className="grid grid-rows-[1fr_1f_1fr] gap-1 max-h-fit lg:max-h-[90%] border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 w-full py-4 px-4 bg-slate-100 rounded-md shadow-lg">
      {votedStations && (
        <div className="h-full">
          <LikedStations
            votedStations={votedStations}
            chooseStation={chooseStation}
          />
        </div>
      )}
      {station.geo_lat && station.geo_long ? (
        <MapContainer
          className="h-[250px] md:h-[350px] lg:h-[420px] w-full border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 flex justify-center py-4 px-4 bg-slate-100 items-center mx-auto rounded-md shadow-lg"
          center={[station.geo_lat, station.geo_long]}
          key={lat + long}
          zoom={8}
          minZoom={3}
          maxZoom={19}
          maxBounds={[
            [-85.06, -180],
            [85.06, 180],
          ]}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[station.geo_lat, station.geo_long]}>
            <Tooltip permanent direction="top" offset={[-15, -15]}>
              {station.country}
              {station.state !== "" ? `, ${station.state}` : ""} <br />{" "}
              <b>{station.name}</b> is right here.
            </Tooltip>
          </Marker>
        </MapContainer>
      ) : lat && long ? (
        <MapContainer
          className="h-[250px] md:h-[350px] lg:h-[420px] w-full border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 flex justify-center py-4 px-4 bg-slate-100 items-center mx-auto rounded-md shadow-lg"
          center={[lat, long]}
          key={lat + long}
          zoom={5}
          minZoom={3}
          maxZoom={19}
          maxBounds={[
            [-85.06, -180],
            [85.06, 180],
          ]}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[lat, long]}>
            <Tooltip permanent direction="top" offset={[-15, -15]}>
              {station.country}
              {station.state !== "" ? `, ${station.state}` : ""} <br />{" "}
              <b>{station.name}</b> is around here.
            </Tooltip>
          </Marker>
        </MapContainer>
      ) : (
        ""
      )}
      <div className="grid grid-cols-[1fr_2fr] w-full">
        {weather && (
          <div className="flex-col max-h-[200px] md:max-h[200px] lg:max-h-[250px] w-full border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 flex justify-center py-4 px-4 bg-slate-100 items-center mx-auto rounded-md shadow-lg">
            <img className="h-1/2" src={weather.condition.icon} alt="" />
            <p className="text-md lg:text-lg text-center leading-5 text-slate-500 -mt-1">
              {weather.condition.text}
            </p>
            <h1 className="text-xl lg:text-4xl text-slate-600 font-bold mt-3">
              {Math.floor(weather.temp_c)} ºC
            </h1>
          </div>
        )}

        {description && (
          <div className="flex-col max-h-[200px] md:max-h-[200px] lg:max-h-[250px] overflow-scroll w-full border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 flex justify-center py-4 px-4 bg-slate-100 items-center mx-auto rounded-md shadow-lg">
            <div
              className="text-sm md:text-base lg:text-base text-slate-800 -mt-2 max-h-full"
              dangerouslySetInnerHTML={
                description.extract_html
                  ? { __html: description.extract_html }
                  : { __html: description.extract }
              }
            ></div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
