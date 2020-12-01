import React, { useCallback, useEffect, useState } from "react";
import "./App.css";

const API_KEY = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;
const URL = "api.openweathermap.org/data/2.5/weather?q=";

function App() {
  const [city, setCity] = useState("London");
  const [searchCity, setSearchCity] = useState(city)
  const [weather, setWeather] = useState("");

  const fetchWeather = useCallback(() => {
    fetch(`https://${URL}${city},uk&appid=${API_KEY}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.cod === 200) {
          setWeather(JSON.stringify(res, null, 2));
          console.log(res);
        } else {
          setWeather(res.message);
        }
      });
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather</h1>
        <p>{weather}</p>
        <input
          type="text"
          defaultValue={searchCity}
          onChange={value => setSearchCity(value.target.value)}
        />
        <button onClick={(value) => setCity(searchCity)}>get weather</button>
      </header>
    </div>
  );
}

export default App;
