import PropTypes from 'prop-types';

const WeatherDescript = (prompt, weatherData, forecastDays, startDate, endDate) => {
	const url = 'https://api.openai.com/v1/chat/completions';

	const sysMsg = `In a conversational professional tone, answer the [Question] based on the [Weather Data].

- Describe the weather across the requested travel window from the start date to the end date.
- Mention how conditions are likely to change over that period.
- Provide a recommendation on how to prepare and what to wear (e.g. bring an umbrella, wear a wind breaker, a warm jacket, etc.).
- Never display the temperature in Kelvin.`;

	const forecastSummary = (forecastDays || [])
		.map((day) => `${day.label}: ${day.description} with about ${day.temp}°C`)
		.join(' | ');

	const newPrompt = `Question: ${prompt}. Travel window: ${startDate} to ${endDate}. Current weather: ${JSON.stringify(
		weatherData,
	)}. Forecast window: ${forecastSummary}`;

	const data = {
		model: 'gpt-4o-mini',
		messages: [
			{ role: 'system', content: sysMsg },
			{ role: 'user', content: newPrompt },
		],
	};

	const params = {
		headers: {
			Authorization: `Bearer ${import.meta.env.VITE_OPENAI}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
		method: 'POST',
	};

	return fetch(url, params)
		.then((response) => response.json())
		.then((data) => data.choices[0].message.content)
		.catch((error) => {
			console.log('Error:', error);
			return Promise.reject('Unable to fetch weather description.');
		});
};

WeatherDescript.propTypes = {
	prompt: PropTypes.string.isRequired,
	weatherData: PropTypes.object,
	forecastDays: PropTypes.array,
	startDate: PropTypes.string,
	endDate: PropTypes.string,
};

export default WeatherDescript;

