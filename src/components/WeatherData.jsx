import PropTypes from 'prop-types';

const buildForecastDays = (forecastData, startDate, endDate) => {
	if (!forecastData?.list?.length) return [];

	const start = new Date(`${startDate}T00:00:00`);
	const end = new Date(`${endDate}T23:59:59`);
	const groupedEntries = new Map();

	forecastData.list.forEach((entry) => {
		const entryDate = new Date(entry.dt * 1000);
		if (entryDate < start || entryDate > end) return;

		const dayKey = entryDate.toISOString().split('T')[0];
		const existingEntry = groupedEntries.get(dayKey);

		if (!existingEntry) {
			groupedEntries.set(dayKey, entry);
			return;
		}

		const existingHour = Number(existingEntry.dt_txt?.split(' ')[1]?.split(':')[0] ?? 12);
		const newHour = Number(entry.dt_txt?.split(' ')[1]?.split(':')[0] ?? 12);
		const existingDistance = Math.abs(existingHour - 12);
		const newDistance = Math.abs(newHour - 12);

		if (newDistance < existingDistance) {
			groupedEntries.set(dayKey, entry);
		}
	});

	return Array.from(groupedEntries.entries())
		.sort((a, b) => new Date(a[0]) - new Date(b[0]))
		.map(([date, entry]) => {
			const weather = entry.weather?.[0] || {};
			return {
				date,
				label: new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
					weekday: 'short',
					month: 'short',
					day: 'numeric',
				}),
				temp: Math.round(entry.main?.temp || 0),
				description: weather.description || 'No data',
				icon: weather.icon,
			};
		});
};

const WeatherData = async (locationData, units, startDate, endDate) => {
	try {
		const [currentResponse, forecastResponse] = await Promise.all([
			fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${locationData[0].lat}&lon=${locationData[0].lon}&units=${units}&appid=${import.meta.env.VITE_OWM}`,
			),
			fetch(
				`https://api.openweathermap.org/data/2.5/forecast?lat=${locationData[0].lat}&lon=${locationData[0].lon}&units=${units}&appid=${import.meta.env.VITE_OWM}`,
			),
		]);

		const currentWeather = await currentResponse.json();
		const forecastData = await forecastResponse.json();
		const forecastDays = buildForecastDays(forecastData, startDate, endDate);

		return { currentWeather, forecastDays };
	} catch (error) {
		console.error('Error:', error);
		return await Promise.reject('Unable to fetch weather data.');
	}
};

WeatherData.propTypes = {
	locationData: PropTypes.array.isRequired,
	units: PropTypes.string,
	startDate: PropTypes.string,
	endDate: PropTypes.string,
};

export default WeatherData;

