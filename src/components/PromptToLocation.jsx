import PropTypes from 'prop-types';

const PromptToLocation = (prompt, units) => {
  return fetch('/api/prompt-to-location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, units }),
  })
    .then((response) => response.json())
    .then((data) => {
      let promptRes = {};
      promptRes = data?.choices[0]?.message?.function_call?.arguments;
      if (promptRes) {
        promptRes = JSON.parse(promptRes);
      }
      console.log(promptRes);

      const locationString = () => {
        if (promptRes?.countryCode === 'US') {
          return `${promptRes?.city},${promptRes?.state},${promptRes?.country}`;
        } else {
          return `${promptRes?.city},${promptRes?.country}`;
        }
      };

      const promptData = {
        locationString: locationString(),
        units: promptRes?.unit,
        country: promptRes?.country,
        USstate: promptRes?.USstate,
      };

      return promptData;
    })
    .catch((error) => {
      console.log('Error:', error);
      return Promise.reject(
        'Unable to identify a location from your question. Please try again.'
      );
    });
};

PromptToLocation.propTypes = {
  prompt: PropTypes.string.isRequired,
};

export default PromptToLocation;

