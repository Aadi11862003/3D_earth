import axios from 'axios';

const apiKey = '0cf255871bmshdcf1c017668df96p16c7b7jsna3174a1cb051';

export const fetchCoordinates = async (query) => {
  const options = {
    method: 'GET',
    url: 'https://trueway-geocoding.p.rapidapi.com/Geocode',
    params: { address: query },
    headers: {
      'x-rapidapi-key': '0cf255871bmshdcf1c017668df96p16c7b7jsna3174a1cb051',
      'x-rapidapi-host': 'trueway-geocoding.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const data = response.data;
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].location;
      return { lat, lng };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Too many requests - rate limit exceeded');
    } else if (error.response && error.response.status === 403) {
      console.error('Forbidden - check your API key and permissions');
    } else {
      console.error('Error fetching coordinates:', error);
    }
    throw error;
  }
};

