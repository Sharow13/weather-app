import { MainWrapper } from "./styles";
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { FiWind } from "react-icons/fi";
import {
  BsFillSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsCloudFog2Fill,
} from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";

interface WeatherDataProps {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
  };
  weather: {
    main: string;
  }[];
  wind: {
    speed: number;
  };
}

const DisplayWeather = () => {
  const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const api_base_url = import.meta.env.VITE_OPENWEATHER_API_BASE_URL;

  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCity, setSearchCity] = useState("");

  /*
   * method to fetch the current weather based on the user's location from openweather api with axios.
   */
  const fetchCurrentWeather = async (latitude: number, longitude: number) => {
    const url = `${api_base_url}weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

  /*
   * method to fetch the weather data based on city name from openweather api with axios
   */
  const fetchWeatherDataForCity = async (city: string) => {
    try {
      const url = `${api_base_url}weather?q=${city}&appid=${api_key}&units=metric`;
      const response = await axios.get(url);
      const currentSearchResult: WeatherDataProps = response.data;
      return { currentSearchResult };
    } catch (error) {
      console.error("No Data Found!");
      throw error;
    }
  };

  const handleSearchForCity = async () => {
    if (searchCity.trim() === "") {
      return;
    }

    try {
      const { currentSearchResult } = await fetchWeatherDataForCity(searchCity);
      setWeatherData(currentSearchResult);
    } catch (error) {
      console.error("No Results Found!");
    }
  };

  /*
   * method to change icon based on weather response
   */
  const iconChanger = (weather: string) => {
    let iconElement: ReactNode;
    let iconColor: string;

    switch (weather) {
      case "Rain":
        iconElement = <BsFillCloudRainFill />;
        iconColor = "#272829";
        break;

      case "Clear":
        iconElement = <BsFillSunFill />;
        iconColor = "#ffc436";
        break;

      case "Clouds":
        iconElement = <BsCloudyFill />;
        iconColor = "#102c57";
        break;

      case "Mist":
        iconElement = <BsCloudFog2Fill />;
        iconColor = "#279EFF";
        break;

      default:
        iconElement = <TiWeatherPartlySunny />;
        iconColor = "#7b2869";
    }
    return (
      <span className="icon" style={{ color: iconColor }}>
        {iconElement}
      </span>
    );
  };

  // hook to fetch data based on location initially
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      Promise.all([fetchCurrentWeather(latitude, longitude)]).then(
        ([currentWeather]) => {
          setWeatherData(currentWeather);
          setIsLoading(true);
          console.log("currentWeather", currentWeather);
        }
      );
    });
  }, []);

  return (
    <MainWrapper>
      <div className="container">
        <div className="searchArea">
          <input
            type="text"
            placeholder="enter a city"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <div className="searchCircle">
            <AiOutlineSearch
              className="searchIcon"
              onClick={handleSearchForCity}
            />
          </div>
        </div>
        {weatherData && isLoading ? (
          <>
            <div className="weatherArea">
              <h1>{weatherData.name}</h1>
              <span>{weatherData.sys.country}</span>
              <div className="icon">
                {iconChanger(weatherData.weather[0].main)}
              </div>
              <h1>{weatherData.main.temp.toFixed(0)}°C</h1>
              <h2>{weatherData.weather[0].main}</h2>
            </div>
            <div className="bottomInfoArea">
              <div className="humidityLevel">
                <WiHumidity className="windIcon" />
                <div className="humidityInfo">
                  <h1>{weatherData.main.humidity}%</h1>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="wind">
                <FiWind className="windIcon" />
                <div className="windInfo">
                  <h1>{weatherData.wind.speed}km/h</h1>
                  <p>Wind</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loading">
            <RiLoaderFill className="loadingIcon" />
            <p>Loading</p>
          </div>
        )}
      </div>
    </MainWrapper>
  );
};
export default DisplayWeather;
