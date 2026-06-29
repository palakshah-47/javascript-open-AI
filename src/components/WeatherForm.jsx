import { useState } from 'react';
import PropTypes from 'prop-types';
import './WeatherForm.css';

function WeatherForm({ onSubmit }) {
	const [inputLocation, setInputLocation] = useState('');
	const [inputStartDate, setInputStartDate] = useState('');
	const [inputEndDate, setInputEndDate] = useState('');

	const today = new Date();
	const formattedToday = today.toISOString().split('T')[0];
	const maxStart = new Date(today);
	maxStart.setDate(today.getDate() + 7);
	const formattedMaxStart = maxStart.toISOString().split('T')[0];

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({
			location: inputLocation.trim(),
			startDate: inputStartDate,
			endDate: inputEndDate,
		});
	};

	return (
		<form className="locationform" onSubmit={handleSubmit}>
			<div className="locationform__elements">
				<label htmlFor="location">Enter location:</label>
				<input
					id="location"
					type="text"
					value={inputLocation}
					onChange={(e) => setInputLocation(e.target.value)}
					placeholder="City,state code (if USA),country code"
				/>

				<label htmlFor="startDate">Start date:</label>
				<input
					id="startDate"
					type="date"
					value={inputStartDate}
					onChange={(e) => setInputStartDate(e.target.value)}
					min={formattedToday}
					max={formattedMaxStart}
				/>

				<label htmlFor="endDate">End date:</label>
				<input
					id="endDate"
					type="date"
					value={inputEndDate}
					onChange={(e) => setInputEndDate(e.target.value)}
					min={inputStartDate || formattedToday}
				/>

				<input type="submit" value="Submit" />
			</div>
			<p className="instructions">
				For the most accurate predictions, start your travel window on today or within the
				next 7 days.
			</p>
		</form>
	);
}

WeatherForm.propTypes = {
	onSubmit: PropTypes.func,
};

export default WeatherForm;

