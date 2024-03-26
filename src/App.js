import React, { useState } from 'react';

// Importing the icons
import searchIcon from './Assets/search.png';
import clearIcon from './Assets/clear.png';
import cloudIcon from './Assets/cloud.png';
import drizzleIcon from './Assets/drizzle.png';
import rainIcon from './Assets/rain.png';
import snowIcon from './Assets/snow.png';

function App() {
  // b3dbc0b5d0646a9e299bb42b3551ecb4 -- use this key for the weather API when it activates
  const apiKey = "56cd94bbcb55eba35a4bbd7126df5058";
  const [temperature, setTemperature] = useState("50 °F");
  const [location, setLocation] = useState("New York");
  const [searchItem, setSearchItem] = useState("");
  const [weatherIcon, setWeatherIcon] = useState(cloudIcon);

  // Function to search and retrieve weather data
  const search = async () => {
    if (searchItem.trim() === "") {
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchItem}&appid=${apiKey}&units=imperial`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setLocation(data.name);
      setTemperature(Math.floor(data.main.temp) + "°F");

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
      console.error(error);
    }
  };

  return (
    <div className="App bg-background-blue min-h-screen flex flex-col items-center justify-start py-12">
      <div className="relative w-full max-w-md">
        <input
          className="w-full pl-4 pr-12 py-3 rounded-full border-none shadow-lg focus:ring focus:ring-blue-300"
          placeholder="Search..."
          value={searchItem}
          onChange={e => setSearchItem(e.target.value)}
        />
        <button onClick={search} className="absolute right-0 top-0 mt-3 mr-4">
          <img className="h-6 w-6" src={searchIcon} alt="Search" />
        </button>
      </div>

      <p className='text-xl text-white font-medium mb-2 pt-2'>
        Today
      </p>

      {/* Weather info container */}
      <div className="flex items-center justify-center w-full max-w-2xl px-4 py-1">

        {/* Text container for city name and temperature */}
        <div className="flex flex-col items-center justify-center mr-2">

          {/* City Name */}
          <p className="text-3xl text-white font-medium mb-2">
            {location}
          </p>

          {/* Temperature */}
          <p className="text-5xl text-white font-light">
            {temperature}
          </p>

        </div>

        {/* Weather Icon directly next to the text with matching padding */}
        <img className="h-24 w-24 self-end mb-2" src={weatherIcon} alt="Weather" />
      </div>

    </div>
  );
}

export default App;
