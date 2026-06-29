import { useEffect, useState } from 'react';
import './App.css';
import useApiRequests from './components/useApiRequests';
import WeatherForm from './components/WeatherForm';
import WeatherCard from './components/WeatherCard';
import Description from './components/Description';
import ForecastList from './components/ForecastList';

function App() {
	const [request, setRequest] = useState(null);
	const [units, setUnits] = useState('metric');
	const [weatherDataLoading, setWeatherDataLoading] = useState(false);
	const [weatherDescriptLoading, setWeatherDescriptLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const { error, promptData, locationData, weatherData, weatherDescription } =
		useApiRequests(request);

	useEffect(() => {
		if (error) {
			setErrorMsg(error?.message || error);
			setWeatherDataLoading(false);
		}
	}, [error]);

	useEffect(() => {
		if (weatherData?.currentWeather) {
			setWeatherDataLoading(false);
		}
	}, [weatherData]);

	useEffect(() => {
		if (weatherDescription) {
			setWeatherDescriptLoading(false);
		}
	}, [weatherDescription]);

	useEffect(() => {
		if (promptData && promptData.units) {
			setUnits(promptData.units);
		}
	}, [promptData]);

	const handleSubmit = ({ location, startDate, endDate }) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const parsedStartDate = new Date(startDate);
		const parsedEndDate = new Date(endDate);
		const maxStartDate = new Date(today);
		maxStartDate.setDate(today.getDate() + 7);

		if (!location || !startDate || !endDate) {
			setErrorMsg('Please enter a location and both travel dates.');
			setWeatherDataLoading(false);
			return;
		}

		if (parsedStartDate < today) {
			setErrorMsg('Start date must be today or later.');
			setWeatherDataLoading(false);
			return;
		}

		if (parsedStartDate > maxStartDate) {
			setErrorMsg(
				'The start date can be no more than 7 days from today for accurate predictions.',
			);
			setWeatherDataLoading(false);
			return;
		}

		if (parsedEndDate < parsedStartDate) {
			setErrorMsg('End date must be on or after the start date.');
			setWeatherDataLoading(false);
			return;
		}

		setErrorMsg('');
		setWeatherDataLoading(true);
		setWeatherDescriptLoading(true);
		setRequest({ location, startDate, endDate });
	};

	const currentWeather = weatherData?.currentWeather || null;
	const forecastDays = weatherData?.forecastDays || [];
	const displayCountry = promptData?.country || locationData?.[0]?.country || '';
	const displayState = locationData?.[0]?.state || '';

	return (
		<div className="container">
			<header className="header">
				<h1 className="page-title">Travel Weather Forecast</h1>
				<WeatherForm onSubmit={handleSubmit} />
				{errorMsg && <p className="error">{errorMsg}</p>}
				{weatherDescription ? (
					<Description
						isLoading={weatherDescriptLoading}
						weatherDescription={weatherDescription}
					/>
				) : (
					<Description isLoading={weatherDescriptLoading} />
				)}
			</header>
			<main className="main-content">
				{currentWeather && !errorMsg ? (
					<>
						<WeatherCard
							isLoading={weatherDataLoading}
							data={currentWeather}
							units={units}
							country={displayCountry}
							USstate={displayState}
							setUnits={setUnits}
						/>
						<ForecastList forecastDays={forecastDays} units={units} />
					</>
				) : (
					<WeatherCard isLoading={weatherDataLoading} setUnits={setUnits} />
				)}
			</main>
		</div>
	);
}

export default App;

