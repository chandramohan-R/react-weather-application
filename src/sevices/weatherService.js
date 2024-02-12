import { DateTime } from 'luxon';

const API_KEY = "623a4a3019ad72cc7617291843cc4c10";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(`${BASE_URL}/${infoType}`);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });
  return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;
  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const formatForecastWeather = (data) => {
  console.log("Raw forecast data:", data); // Log raw API response

  let { timezone, daily, hourly } = data;

  if (!daily || !hourly) {
    console.warn("Daily or hourly data is missing. Providing default values.");
    daily = [];
    hourly = [];
  } else {
    // Existing formatting logic for daily and hourly data
    daily = daily.slice(1, 6).map((d) => {
      return {
        title: formatToLocalTime(d.dt, timezone, 'hhh:mm a'),
        temp: d.temp.day,
        icon: d.weather[0].icon,
      };
    });

    hourly = hourly.slice(1, 6).map((d) => {
      return {
        title: formatToLocalTime(d.dt, timezone, 'hhh:mm a'),
        temp: d.temp,
        icon: d.weather[0].icon,
      };
    });
  }

  return { timezone, daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData('weather', searchParams).then(formatCurrentWeather);
  const { lat, lon } = formattedCurrentWeather;

  try {
    const formattedForecastWeather = await getWeatherData("onecall", {
      lat,
      lon,
      exclude: "current, minutely, alerts",
      units: searchParams.units,
    }).then(formatForecastWeather);

    return { ...formattedCurrentWeather, ...formattedForecastWeather };
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return formattedCurrentWeather; // Return only current weather if forecast fails
  }
};

const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => {
  return DateTime.fromSeconds(secs).setZone(zone).toFormat(format);
};

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export { formatToLocalTime, iconUrlFromCode };
