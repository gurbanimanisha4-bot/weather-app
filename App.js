import { useState } from "react";
import "./App.css"; // ✅ import CSS file

function App() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  const API_Key = "265c8fc5f3020c81673a5ad780db4218";

  const fetchWeather = async () => {
    if (city.trim() === "") {
      alert("Please enter a city name");
      return;
    }
    try {
      const resCurrent = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`
      );
      if (!resCurrent.ok) throw new Error("City not Found");
      const dataCurrent = await resCurrent.json();

      const resForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_Key}&units=metric`
      );
      if (!resForecast.ok) throw new Error("Forecast not available");
      const dataForecast = await resForecast.json();

      const dailyForecast = dataForecast.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setCurrentWeather(dataCurrent);
      setForecast(dailyForecast);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCurrentWeather(null);
      setForecast([]);
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">🌤 Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City"
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      {error && <p className="error">{error}</p>}

      {currentWeather && (
        <div className="weather-card">
          <h2>
            {currentWeather.name}, {currentWeather.sys.country}
          </h2>
          <p className="temp">🌡 {currentWeather.main.temp}°C</p>
          <p>☁ {currentWeather.weather[0].description}</p>
          <p>
            💧 {currentWeather.main.humidity}% | 💨 {currentWeather.wind.speed} m/s
          </p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h3>📅 5-Day Forecast</h3>
          <div className="forecast-list">
            {forecast.map((day, idx) => (
              <div key={idx} className="forecast-card">
                <p>
                  <b>{new Date(day.dt_txt).toLocaleDateString()}</b>
                </p>
                <p>🌡 {day.main.temp}°C</p>
                <p>{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
