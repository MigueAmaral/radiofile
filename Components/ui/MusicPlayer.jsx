/* eslint-disable react/prop-types */
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import { useRef, useEffect, useLayoutEffect } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import axios from "axios";


const Widget = styled("div")(({ theme }) => ({}));

const CoverImage = styled("div")({
  position: "absolute",
  zIndex: "-10",
  right: "-15px",
  top: "-15px",
  width: 100,
  height: 100,
  objectFit: "cover",
  overflow: "hidden",
  flexShrink: 0,
  borderRadius: 50,
  opacity: 0.7,
  backgroundColor: "rgba(0,0,0,0.001)",
  "& > img": {
    width: "100%",
  },
});

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export default function MusicPlayerSlider({
  station,
  postStation,
  update,
  setUpdate,
  savedStations,
  randomStation,
  chooseStation,
  previousStation,
}) {
  const theme = useTheme();
  const duration = 200; // seconds
  const [position, setPosition] = React.useState(32);
  const [paused, setPaused] = React.useState(true);
  const [volume, setVolume] = React.useState(0.6);
  const [stationImg, setStationImg] = React.useState(null);
  const [like, setLike] = React.useState(false);

  const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const lightIconColor =
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  const audioRef = useRef();



  useLayoutEffect(() => {
    if (audioRef.current) {
      if (paused) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [paused, station]);

  useEffect(() => {
    if (!paused) audioRef.current.volume = volume;
  }, [volume, paused]);

  function likeStation(uuid) {
    axios
      .post(`http://at1.api.radio-browser.info/json/vote/${uuid}`)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <Box className="overflow-hidden h-fit">
      <Widget className="relative overflow-hidden border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60 h-full md:h-full lg:h-[30vh] w-full py-1 px-1 md:py-1 md:px-1 lg:py-4 lg:px-4 bg-slate-100 items-center mx-auto rounded-md shadow-lg">
        {station && station.favicon !== "" ? (
          <CoverImage>
            <img alt="can't win - Chilling Sunday" src={station.favicon} />
          </CoverImage>
        ) : (
          ""
        )}
        <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
          <Box sx={{ ml: 1.5, minWidth: 0 }}>
            <Typography
              fontFamily={"Poppins"}
              variant="caption"
              color="text.secondary"
              fontWeight={500}
              noWrap
            >
              {station && (
                <a href={station.homepage} target="_blank" rel="noreferrer">
                  {station.homepage}
                </a>
              )}
            </Typography>
            <Typography
              fontFamily={"Poppins"}
              fontSize={24}
              noWrap
              className="text-slate-800"
            >
              <b>{station && station.name}</b>
            </Typography>
            <Typography
              marginTop={1}
              fontFamily={"Poppins"}
              fontSize={14}
              noWrap
              letterSpacing={-0.25}
            >
              {station && station.country + " (" + station.language + ")"}
            </Typography>
            <Typography
              fontFamily={"Poppins"}
              fontSize={14}
              noWrap
              letterSpacing={-0.25}
            >
              {station && station.tags.split(",").join(", ")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          {!like ? (
            <BiLike
              onClick={() => {
                setLike(true);
                likeStation(station.stationuuid);
              }}
              size={30}
              className="ml-5 cursor-pointer"
            />
          ) : (
            <BiSolidLike
              onClick={() => setLike(false)}
              color="darkgreen"
              size={30}
              className="ml-5 cursor-pointer"
            />
          )}
          <div className="flex">
            <IconButton
              onClick={() => chooseStation(previousStation.stationuuid)}
              aria-label="previous song"
            >
              <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
            </IconButton>
            <IconButton
              aria-label={paused ? "play" : "pause"}
              onClick={() => setPaused(!paused)}
            >
              {paused ? (
                <PlayArrowRounded
                  sx={{ fontSize: "3rem" }}
                  htmlColor={mainIconColor}
                />
              ) : (
                <PauseRounded
                  sx={{ fontSize: "3rem" }}
                  htmlColor={mainIconColor}
                />
              )}
            </IconButton>
            <IconButton onClick={() => randomStation()} aria-label="next song">
              <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
            </IconButton>
          </div>
          {savedStations &&
          !savedStations.some(
            (i) => i.data.station.stationuuid === station.stationuuid
          ) ? (
            <AiOutlineHeart
              onClick={() => {
                postStation();
                setUpdate(!update);
              }}
              size={30}
              className="mr-5 cursor-pointer"
            />
          ) : (
            <AiFillHeart
              color="darkred"
              size={30}
              className="mr-5 cursor-pointer"
            />
          )}
        </Box>
        <Stack
          spacing={2}
          direction="row"
          sx={{ mt: 1, px: 1 }}
          alignItems="center"
        >
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider
            aria-label="Volume"
            value={volume * 100}
            onChange={(e) => {
              let vol = e.target.value / 100;
              setVolume(vol);
            }}
            sx={{
              color:
                theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
              "& .MuiSlider-track": {
                border: "none",
              },
              "& .MuiSlider-thumb": {
                width: 24,
                height: 24,
                backgroundColor: "#fff",
                "&:before": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "none",
                },
              },
            }}
          />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
      </Widget>
      {station && (
        <audio
          ref={audioRef}
          id="audio-element"
          src={`${station.url_resolved}`}
        ></audio>
      )}
    </Box>
  );
}
