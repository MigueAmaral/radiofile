import { useEffect, useRef, useState } from "react";
import CountriesSelector from "../../Components/countriesSelector";
import GenreSelector from "../../Components/GenreSelector";
import axios from "axios";
import MusicPlayerSlider from "../../Components/ui/MusicPlayer";
import StationList from "../../Components/StationList";
import LocationDisplay from "../../Components/LocationDisplay";
import { auth, db } from "/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Login from "../../Components/auth/login";
import SavedStations from "../../Components/SavedStations";
import { BiSolidDownArrow } from "react-icons/bi";
import NewLogoDisplay from "../../Components/ui/NewLogo";


function Home() {
  const [country, setCountry] = useState();
  const [countryName, setCountryName] = useState();
  const [genre, setGenre] = useState();
  const [stationCollection, setStationCollection] = useState();
  const [station, setStation] = useState();
  const [previousStation, setPreviousStation] = useState();
  const [countryImg, setCountryImg] = useState();
  const [user, loading] = useAuthState(auth);
  const [update, setUpdate] = useState(false);
  const [savedStations, setSavedStations] = useState();
  const [votedStations, setVotedStations] = useState();
  const [newLogo, setNewLogo] = useState(false)

  useEffect(() => {
    if (country && genre) {
      axios
        .get(
          `https://at1.api.radio-browser.info/json/stations/search?tag=${genre}&countrycode=${country}&limit=50&order=votes&reverse=true`
        )
        .then((res) => setStationCollection(res.data))
        .catch((err) => console.log(err));
    }
    if ((country === "any" || !country) && (genre === "any" || !genre)) {
      axios
        .get(
          `https://at1.api.radio-browser.info/json/stations/search?&limit=50&order=votes&reverse=true`
        )
        .then((res) => setStationCollection(res.data))
        .catch((err) => console.log(err));
    }
    if (country && country !== "any" && (!genre || genre === "any")) {
      const countryCap = country.charAt(0).toUpperCase() + country.slice(1);
      axios
        .get(
          `https://at1.api.radio-browser.info/json/stations/search?countrycode=${country}&limit=50&order=votes&reverse=true`
        )
        .then((res) => setStationCollection(res.data))
        .catch((err) => console.log(err));
    }
    if (genre && genre !== "any" && (!country || country === "any")) {
      axios
        .get(
          `https://at1.api.radio-browser.info/json/stations/search?tag=${genre}&limit=50&order=votes&reverse=true`
        )
        .then((res) => setStationCollection(res.data))
        .catch((err) => console.log(err));
    }
  }, [country, genre]);

  function getVotes() {
    axios
      .get(
        `https://at1.api.radio-browser.info/json/stations/lastclick?hidebroken=true&limit=3`
      )
      .then((res) => {
        console.log(res.data);
        setVotedStations(res.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getVotes()
    const minutes = 1000*60*2
    const interval = setInterval(() =>{getVotes()},minutes)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!station) {
      if (stationCollection) {
        const number = Math.floor(
          Math.random() * (stationCollection.length - 1)
        );
        setStation(stationCollection[number]);
      }
    }
  }, [stationCollection]);

  function randomStation() {
    if (stationCollection) {
      const number = Math.floor(Math.random() * (stationCollection.length - 1));
      setPreviousStation(station);
      setStation(stationCollection[number]);
    }
  }

  function chooseStation(uuid) {
    axios
      .get(`https://at1.api.radio-browser.info/json/stations/byuuid/${uuid}`)
      .then((res) => {
        setPreviousStation(station);
        setStation(res.data[0]);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (station) {
      if (
        station.state !== "" &&
        station.country === "The United States Of America"
      ) {
        axios
          .get(
            `https://pixabay.com/api/?key=32731470-7a8f6ac4428513ccb19368a97&q=${station.state}&image_type=photo&orientation=horizontal&safesearch=true`
          )
          .then((res) => {
            let picArray = res.data.hits;
            let pic =
              picArray[Math.floor(Math.random()) * (picArray.length - 1)]
                .largeImageURL;
            setCountryImg(pic);
          })
          .catch((err) => console.log(err));
      } else {
        axios
          .get(
            `https://pixabay.com/api/?key=32731470-7a8f6ac4428513ccb19368a97&q=${station.country}&image_type=photo&orientation=horizontal&safesearch=true`
          )
          .then((res) => {
            let picArray = res.data.hits;
            let pic =
              picArray[Math.floor(Math.random() * (picArray.length - 1))]
                .largeImageURL;
            setCountryImg(pic);
          })
          .catch((err) => console.log(err));
      }
    }
  }, [station]);

  async function postStation() {
    const collectionRef = collection(db, "Stations");
    await addDoc(collectionRef, {
      station,
      timestamp: serverTimestamp(),
      user: user.uid,
      avatar: user.photoURL,
      username: user.displayName,
    });
  }

  useEffect(() => {
    setNewLogo(true)
    setTimeout(() => {setNewLogo(false)}, 9500)
  },[votedStations])

  return (
    <div className="relative h-[100vh] lg:overflow-scroll lg:snap-y snap-mandatory">
      <NewLogoDisplay newLogo={newLogo}/>
      {station && (
        <img
          className="opacity-90 shadow-2xl rounded-md fixed lg:w-4/5 w-full aspect-square lg:aspect-video object-cover left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          src={countryImg}
          alt=""
        />
      )}
      <BiSolidDownArrow
        color="rgb(130,141,156)"
        size={30}
        className="absolute bottom-[1.5rem] left-[4%] lg:bottom-[0.7rem] lg:left-[30%]"
      />
      <BiSolidDownArrow
        color="rgb(130,141,156)"
        size={30}
        className="absolute bottom-[1.5rem] left-[91%] lg:bottom-[0.7rem] lg:left-[68%]"
      />
      <div className="snap-center flex justify-around h-20 w-4/5 lg:w-1/2 bg-gradient-to-r from-slate-400 to-slate-100 items-center mx-auto mt-4 rounded-md shadow-lg ">
        {user && (
          <div className="flex items-center gap-2">
            <img
              className="rounded-full shadow-md"
              src={user.photoURL}
              alt=""
            />
            <div>
              <h1 className="text-sm">{user.displayName}</h1>
              <button
                className="text-sm bg-slate-400 rounded-md px-2 py-1 text-slate-100 mt-1"
                onClick={() => {
                  auth.signOut();
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        )}
        <h1 className="text-slate-600 text-5xl italic font-semibold tracking-tight">
          radio file
        </h1>
      </div>
      <div className="flex-col gap-20 justify-center w-4/5 lg:w-1/2 items-center mx-auto mt-4">
        <div className="flex gap-4 lg:flex">
          <CountriesSelector
            country={country}
            setCountry={setCountry}
            setCountryName={setCountryName}
          />
          <GenreSelector genre={genre} setGenre={setGenre} />
        </div>
        <div className="grid grid-rows-2 min-h-[70vh] item-start lg:grid-cols-2 lg:grid-rows-1 gap-4">
          {stationCollection && (
            <StationList
              chooseStation={chooseStation}
              stationCollection={stationCollection}
            />
          )}
          <div className="grid grid-rows-[max-1fr_1fr] min-h-[70vh] mt-2 lg:mt-4 items-start gap-4">
            <MusicPlayerSlider
              update={update}
              setUpdate={setUpdate}
              station={station}
              postStation={postStation}
              savedStations={savedStations}
              randomStation={randomStation}
              chooseStation={chooseStation}
              previousStation={previousStation}
            />
            {!user ? (
              <Login />
            ) : (
              <SavedStations
                savedStations={savedStations}
                setSavedStations={setSavedStations}
                update={update}
                setUpdate={setUpdate}
                chooseStation={chooseStation}
              />
            )}
          </div>
        </div>
      </div>
      <div className="snap-center flex flex-col justify-center w-4/5 h-[100vh] lg:w-1/2 items-center mx-auto mt-4 lg:mt-12 p-2">
        {station && (
          <LocationDisplay
            station={station}
            votedStations={votedStations}
            chooseStation={chooseStation}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
