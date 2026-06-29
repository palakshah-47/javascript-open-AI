import PropTypes from 'prop-types';
import './ForecastList.css';

const ForecastList = ({ forecastDays, units }) => {
	const displayTemp = (temp) => {
		if (units === 'imperial') {
			return Math.round((temp * 9) / 5 + 32);
		}
		return temp;
	};

	return (
		<section className="forecast-list">
			<h2 className="forecast-list__title">Travel window forecast</h2>
			<p className="forecast-list__note">
				Predictions are most accurate when the start date is today or within the next 7
				days.
			</p>
			{forecastDays.length > 0 ? (
				<div className="forecast-list__grid">
					{forecastDays.map((day) => (
						<article className="forecast-card" key={day.date}>
							<h3>{day.label}</h3>
							<p className="forecast-card__temp">
								{displayTemp(day.temp)}°{units === 'imperial' ? 'F' : 'C'}
							</p>
							<p className="forecast-card__description">{day.description}</p>
						</article>
					))}
				</div>
			) : (
				<p className="forecast-list__empty">
					No forecast data is available for the selected dates. Choose a start date within
					the next 7 days and an end date that remains within the available forecast
					horizon.
				</p>
			)}
		</section>
	);
};

ForecastList.propTypes = {
	forecastDays: PropTypes.arrayOf(
		PropTypes.shape({
			date: PropTypes.string,
			label: PropTypes.string,
			temp: PropTypes.number,
			description: PropTypes.string,
		}),
	).isRequired,
	units: PropTypes.string,
};

ForecastList.defaultProps = {
	units: 'metric',
};

export default ForecastList;
