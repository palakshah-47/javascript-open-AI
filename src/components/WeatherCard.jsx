import PropTypes from 'prop-types';
import './WeatherCard.css';
import Loader from './Loader';

// Translate temperature from the unit returned by the weather API.
const tempTranslator = (temp, unit) => {
	const normalizedTemp = Number(temp);

	if (unit === 'metric') {
		return {
			value: normalizedTemp,
			unit: '°C',
		};
	}

	if (unit === 'imperial') {
		return {
			value: normalizedTemp,
			unit: '°F',
		};
	}

	return {
		value: normalizedTemp,
		unit: '°K',
	};
};

// Translate wind speed from meters per second to feet per second.
const speedTranslator = (speed, units) => {
	const allSpeeds = {
		metric: {
			value: speed,
			unit: 'm/s',
		},
		imperial: {
			value: speed * 3.281,
			unit: 'ft/s',
		},
	};
	if (units === 'metric') {
		return allSpeeds.metric;
	} else if (units === 'imperial') {
		return allSpeeds.imperial;
	} else {
		return allSpeeds.metric;
	}
};

const WeatherCard = ({ isLoading, data, units, country, USstate, setUnits }) => {
	const hasWeatherData = Boolean(
		data?.name &&
		data.name !== '--' &&
		data?.main?.temp !== undefined &&
		data.main.temp !== 273,
	);

	// Display state if country is US.
	const stateDisplay = () => {
		if (data?.sys?.country === 'US') {
			return `, ${USstate}`;
		} else {
			return '';
		}
	};

	// Handle unit change.
	const handleUnitChange = () => {
		if (!hasWeatherData) return;
		if (units === 'metric') {
			setUnits('imperial');
		} else {
			setUnits('metric');
		}
	};

	// Set wind direction.
	const windDirStyle = {
		transform: `rotate(${data?.wind?.deg + 90 ?? 90}deg)`,
	};

	return (
		<article className="weathercard">
			{isLoading && <Loader />}
			<div className="weathercard__data">
				<div className="weathercard__meta">
					<div className="weathercard__meta-location">
						{hasWeatherData
							? `${data.name}${stateDisplay()}, ${country}`
							: 'Enter a location to see the weather'}
					</div>
				</div>
				<div className="weathercard__temp">
					<span className="temp">
						{hasWeatherData
							? tempTranslator(data.main.temp, units).value.toFixed(1)
							: '--'}
					</span>
					<span className="tempunit">
						{hasWeatherData ? tempTranslator(data.main.temp, units).unit : ''}
					</span>
				</div>
				<div className="weathercard__wind">
					<div className="weathercard__wind-speed">
						<span className="speed">
							{hasWeatherData
								? speedTranslator(data.wind.speed, units).value.toFixed(1)
								: '--'}
						</span>
						<span className="windunit">
							{hasWeatherData ? speedTranslator(data.wind.speed, units).unit : ''}
						</span>
					</div>
					<div className="weathercard__wind-dir" style={windDirStyle}>
						<span className="screen-reader-text">
							{hasWeatherData ? data.wind.deg : 0}
						</span>
					</div>
				</div>
				<button id="units" onClick={handleUnitChange} disabled={!hasWeatherData}>
					Change units
				</button>
			</div>
		</article>
	);
};

// default props
WeatherCard.defaultProps = {
	data: {},
	units: 'metric',
	setUnits: () => {},
};

// props validation
WeatherCard.propTypes = {
	isLoading: PropTypes.bool,
	data: PropTypes.shape({
		name: PropTypes.string,
		sys: PropTypes.shape({
			country: PropTypes.string,
		}),
		main: PropTypes.shape({
			temp: PropTypes.number,
		}),
		wind: PropTypes.shape({
			speed: PropTypes.number,
			deg: PropTypes.number,
		}),
	}),
	units: PropTypes.string,
	country: PropTypes.string,
	USstate: PropTypes.string,
	setUnits: PropTypes.func,
};

export default WeatherCard;

