import { useState} from 'react';
import './App.css';

import searchIcon from "./assets/images/Search.jfif";
import clearIcon from "./assets/images/Sun.jfif";
import cloudIcon from "./assets/images/Cloud.jfif";
import drizzleIcon from "./assets/images/drizzle.jfif";
import rainIcon from "./assets/images/Raining.jfif";
import windIcon from "./assets/images/humidity.jfif";
import snowIcon from "./assets/images/snow.jfif";
import humidityIcon from "./assets/images/Storm.jfif";
import { useEffect } from 'react';
import PropTypes from 'prop-types';


const WeatherDetails = ({icon, temp, city, country, lat, log , humidity, wind}) => {
  return(
  <>
    <div className="image">
      <img src={icon} alt="Image"/>
    </div>
    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className="lat">latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className="log">longitude</span>
        <span>{log}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={humidityIcon} alt="humidity" className="icon"/>
        <div className="data">
          <div className="humidity-percent">{humidity}% </div>
          <div className="text">Humidity</div>
        </div>
      </div>
      <div className="element">
        <img src={windIcon} alt="wind" className="icon"/>
        <div className="data">
          <div className="wind-percent">{wind} km/h</div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
    </div>
  </>
  )
}

  WeatherDetails.PropTypes = {
    icon: PropTypes.string.isRequired,
    temp: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    humidity: PropTypes.number.isRequired,
    wind : PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired,
    log: PropTypes.number.isRequired,
  }

function App() {
  let api_key="4ddfc3acafbf0bf3daccd54e02493d47";
  const [text, setText] = useState("Chennai");

  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFount] = useState(false);
  const [loading , setLoading] = useState(false);


  const [error , setError] = useState(null);

const weatherIconMap = {
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
  "13d": snowIcon,
  "13n": snowIcon
}

const handleCity= (e) =>{
   setText(e.target.value);
}

const handleKeyDown= (e) =>{
  if(e.key === "Enter");
  search();
}

const search = async() => {
  setLoading(true);
  let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

  try{
    let res= await fetch(url);
    let data = await res.json();
    console.log(data)
    if(data.cod === "404"){
      console.error("City not found");
      setCityNotFount(true);
      setLoading(false);
      return;
    }
    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.floor(data.main.temp));
    setCity(data.name);
    setCountry(data.sys.country);
    setLog(data.coord.lon);
    setLat(data.coord.lat);
    const weatherIconCode=data.weather[0].icon;
    setIcon(weatherIconMap[weatherIconCode] || clearIcon);

    setCityNotFount(false);
  }catch(error){

    console.log("An error occurred:", error.message);
setError("An Error occurred whilw fetching data");
  }finally{
    setLoading(false);
  }
};
useEffect(function() {
  search();
}, []);
  return (
    <>
    <div className="container">
      <div className="input-container">
        <input type="text" className="cityInput" placeholder="Search City" onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
        <div className="search-icon" onClick={() => search()}>
          <img src={searchIcon} alt="Search"/>
        </div>
      </div>

{loading && <div className="loading-message">loading...</div>}
{error && <div className="error-message">{error}</div>}
{cityNotFound && <div className="city-not-found">City not found...</div>}

{!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}


   <div className="copyright">Designed By <span> Vinoth</span></div>

    </div>
    </>
  )
}

export default App
