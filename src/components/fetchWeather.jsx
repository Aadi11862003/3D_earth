import axios from 'axios';

const apiKey = 'f8456acd80mshffc75fad6b034f9p10fc86jsn9163cb3c3f01'; // Replace with your Weatherbit API key

export const fetchWeather = async (lat, lon) => {
  const options = {
    method: 'GET',
    url: 'https://weatherbit-v1-mashape.p.rapidapi.com/current',
    params: {
      lat: lat.toString(),
      lon: lon.toString(),
      units: 'metric', // Adjust units as needed ('metric' for Celsius, 'imperial' for Fahrenheit)
      lang: 'en', // Language for response
    },
    headers: {
      'x-rapidapi-key': 'f8456acd80mshffc75fad6b034f9p10fc86jsn9163cb3c3f01',
      'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};


