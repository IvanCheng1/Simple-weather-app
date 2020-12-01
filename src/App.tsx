import React, { useEffect, useState } from "react";
import "./App.css";

const API_KEY = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;
const URL = "api.openweathermap.org/data/2.5/";

interface Coord {
  lon: number;
  lat: number;
}

function App() {
  const [city, setCity] = useState("London");
  const [searchCity, setSearchCity] = useState(city);
  const [forecast, setForecast] = useState("");

  const fetchCoord = async (): Promise<Coord> => {
    let coord;
    try {
      coord = await fetch(`https://${URL}weather?q=${city},uk&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.cod === 200) {
            return res.coord;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }

    return coord;
  };

  const fetchForecast = (coord: Coord) => {
    if (!coord) {
      setForecast("no city found");
      return;
    }
    fetch(
      `https://${URL}onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setForecast(JSON.stringify(res, null, 2));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchCoord().then((coord) => fetchForecast(coord));
  }, [city]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather in {city}</h1>
        <input
          type="text"
          defaultValue={searchCity}
          onChange={(value) => setSearchCity(value.target.value)}
        />
        <button onClick={() => setCity(searchCity)}>get weather</button>
        <p>{forecast}</p>
      </header>
    </div>
  );
}

export default App;
