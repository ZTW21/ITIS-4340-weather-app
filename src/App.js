import React, { useState, useEffect } from 'react';

// Importing the icons
import searchIcon from './Assets/search.png';
import clearIcon from './Assets/clear.png';
import cloudIcon from './Assets/cloud.png';
import drizzleIcon from './Assets/drizzle.png';
import rainIcon from './Assets/rain.png';
import snowIcon from './Assets/snow.png';

function App() {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [temperature, setTemperature] = useState("50 °F");
  const [location, setLocation] = useState("New York");
  const [searchItem, setSearchItem] = useState("");
  const [weatherIcon, setWeatherIcon] = useState(cloudIcon);
  const [highTemperature, setHighTemperature] = useState("");
  const [lowTemperature, setLowTemperature] = useState("");
  const [precipitationChance, setPrecipitationChance] = useState("");
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState("F");

  const fetchWeather = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === "404") {
        alert("City not found. Please try again.");
        return; // Early return to stop further execution
      }

      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();
      const aggregateForecastData = (forecastData) => {
        const dailyData = {};
        // Use UTC date for today to align with API data
        const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
        console.log("Today's date in UTC for comparison:", today.toISOString());

        forecastData.list.forEach((item) => {
          // Convert item date to UTC
          const date = new Date(item.dt * 1000);
          const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
          const day = utcDate.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format

          console.log(`Processing forecast item for UTC date: ${day}, Actual timestamp: ${item.dt}`);

          // Compare using UTC dates
          if (utcDate > today) {
            if (!dailyData[day]) {
              dailyData[day] = {
                high: item.main.temp_max,
                low: item.main.temp_min,
                date: day,
              };

            } else {
              dailyData[day].high = Math.max(dailyData[day].high, item.main.temp_max);
              dailyData[day].low = Math.min(dailyData[day].low, item.main.temp_min);
            }
          }
        });
        return Object.values(dailyData); // Convert to an array
      };




      const aggregatedData = aggregateForecastData(forecastData);
      setForecast(aggregatedData);


      console.log(data);
      console.log(forecastData);

      if (data.cod === "404") {
        alert("City not found. Please try again.");
        return;
      }

      setLocation(data.name);
      setTemperature(Math.floor(data.main.temp) + "°F");
      setHighTemperature(Math.floor(data.main.temp_max) + "°F");
      setLowTemperature(Math.floor(data.main.temp_min) + "°F");


      const precipChance = forecastData.list[0].pop * 100;
      setPrecipitationChance(`${precipChance}%`)

      const iconCode = data.weather[0].icon;
      const iconMap = {
        "01d": clearIcon,
        "01n": clearIcon,

        "02d": cloudIcon,
        "02n": cloudIcon,

        "03d": drizzleIcon,
        "03n": drizzleIcon,

        "04d": drizzleIcon,
        "04n": drizzleIcon,

        "09d": rainIcon,
        "09n": rainIcon,

        "10d": rainIcon,
        "10n": rainIcon,

        "11d": rainIcon,
        "11n": rainIcon,

        "13d": snowIcon,
        "13n": snowIcon
      };
      setWeatherIcon(iconMap[iconCode] || cloudIcon);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeather("New York");
  }, []);

  const search = () => {
    if (searchItem.trim() === "") return;
    fetchWeather(searchItem);
  };

  const convertTemperature = (temp, toUnit) => {
    return toUnit === "C"
      ? ((temp - 32) * 5) / 9
      : (temp * 9) / 5 + 32;
  }

  return (
    <div className="App bg-background-blue min-h-screen flex flex-col items-center justify-start py-12">
      <div className="w-full max-w-md flex justify-center items-center space-x-4">
        <input
          className="pl-4 pr-12 py-3 w-full rounded-full border-none shadow-lg focus:ring focus:ring-blue-300"
          placeholder="Search..."
          value={searchItem}
          onChange={e => setSearchItem(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              search();
            }
          }}
        />
        <button
          onClick={search}
          className="bg-yellow-400 hover:bg-yellow-500 h-12 w-12 rounded-full flex justify-center items-center transition-colors duration-150 shadow-lg"
          style={{ aspectRatio: '1 / 1' }}
        >
          <img className="h-6 w-6" src={searchIcon} alt="Search" />
        </button>
      </div>



      <p className='text-xl text-white font-medium mb-2 pt-2'>
        Today
      </p>

      {/* Weather info container */}
      <div className="flex items-center justify-center w-full max-w-2xl px-4 py-1">
        {/* High and Low Temperature Container */}
        <div className="flex flex-col justify-center mr-4">
          <p className="text-xl text-white font-medium mb-1">
            H: {unit === "F" ? highTemperature : Math.round(convertTemperature(parseInt(highTemperature), "C")) + "°C"}
          </p>
          <p className="text-xl text-white font-medium">
            L: {unit === "F" ? lowTemperature : Math.round(convertTemperature(parseInt(lowTemperature), "C")) + "°C"}
          </p>
        </div>

        {/* Text container for city name and temperature */}
        <div className="flex flex-col items-center justify-center mr-2">

          {/* City Name */}
          <p className="text-3xl text-white font-medium mb-2">
            {location}
          </p>

          {/* Temperature */}
          <p className="text-5xl text-white font-light">
            {unit === "F" ? temperature : Math.round(convertTemperature(parseInt(temperature), "C")) + "°C"}
          </p>

        </div>

        {/* Weather Icon directly next to the text with matching padding */}
        <img className="h-24 w-24 self-end mb-2" src={weatherIcon} alt="Weather" />
      </div>

      {/* Precipitation chance */}
      {precipitationChance && precipitationChance !== "0%" && (
        <p className="text-xl text-white font-medium mt-2">
          Precipitation chance: {precipitationChance}
        </p>
      )}

      <div className="forecast-container w-full max-w-md mx-auto bg-[#0d2a32] py-2 rounded-lg shadow-lg mt-8">
        <div className="flex items-center justify-end mt-2 mr-4">
          <label htmlFor="toggle" className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" value="" id="toggle" className="sr-only peer" checked={unit === "C"} onChange={() => setUnit(unit === "F" ? "C" : "F")} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-white">
              {unit === "F" ? "°F" : "°C"}
            </span>
          </label>
        </div>
        {forecast.map((day, index) => (
          <div key={index} className="flex justify-between items-center text-white py-4 px-4">
            <span>
              {new Date(day.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
              })}
            </span>
            <span>
              {unit === "F"
                ? Math.round(day.low) + "°F - " + Math.round(day.high) + "°F"
                : Math.round(convertTemperature(day.low, "C")) + "°C - " + Math.round(convertTemperature(day.high, "C")) + "°C"}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
