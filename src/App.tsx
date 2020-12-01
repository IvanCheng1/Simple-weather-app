import React, { useCallback, useEffect, useState } from "react";
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

  const fetchCoord = useCallback( async (): Promise<Coord> => {
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
  }, [city]);

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
  }, [fetchCoord]);

  const convertUnixToDate = (unix: number): string => {
    const date = new Date(unix * 1000)

    return `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather in {city} for the next 7 days</h1>
        <input
          type="text"
          defaultValue={searchCity}
          onChange={(value) => setSearchCity(value.target.value)}
        />
        <button onClick={() => setCity(searchCity)}>get weather</button>
        {forecast && JSON.parse(forecast).daily.map((day: any) => {
          return <p key={day.dt}> {convertUnixToDate(day.dt)} {day.weather[0].description}</p>
        })}
      </header>
    </div>
  );
}

export default App;
