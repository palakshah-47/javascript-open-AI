import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LocationToCoordinates from './LocationToCoordinates';
import WeatherData from './WeatherData';
import PromptToLocation from './PromptToLocation';
import WeatherDescript from './WeahterDescript';

const useApiRequests = (request) => {
	const [error, setError] = useState(null);
	const [promptData, setPromptData] = useState({});
	const [locationData, setLocationData] = useState([]);
	const [weatherData, setWeatherData] = useState({});
	const [weatherDescription, setWeatherDescription] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!request?.location) return;

			try {
				const promptDataRes = await PromptToLocation(request.location);
				setPromptData(promptDataRes);

				const locationDataRes = await LocationToCoordinates(promptDataRes.locationString);
				setLocationData(locationDataRes);

				const weatherDataRes = await WeatherData(
					locationDataRes,
					promptDataRes.units,
					request.startDate,
					request.endDate,
				);
				setWeatherData(weatherDataRes);

				const weatherDescriptRes = await WeatherDescript(
					request.location,
					weatherDataRes.currentWeather,
					weatherDataRes.forecastDays,
					request.startDate,
					request.endDate,
				);
				setWeatherDescription(weatherDescriptRes);
			} catch (error) {
				setError(error);
				console.error('Error:', error);
			}
		};

		fetchData();
	}, [request]);

	return { error, promptData, locationData, weatherData, weatherDescription };
};

useApiRequests.propTypes = {
	request: PropTypes.shape({
		location: PropTypes.string,
		startDate: PropTypes.string,
		endDate: PropTypes.string,
	}),
};

export default useApiRequests;

