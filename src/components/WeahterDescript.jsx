import PropTypes from 'prop-types';

const WeatherDescript = (prompt, weatherData) => {
  return fetch('/api/weather-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, weatherData }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.choices[0].message.content;
    })
    .catch((error) => {
      console.log('Error:', error);
      return Promise.reject('Unable to fetch weather description.');
    });
};

WeatherDescript.propTypes = {
  prompt: PropTypes.string.isRequired,
};

export default WeatherDescript;

