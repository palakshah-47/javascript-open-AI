export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { prompt, weatherData } = await req.json();

  const sysMsg = `In a conversational professional tone, answer the [Question] based on the [Weather Data].

- Provide an opinion about what the weather feels like.
- Provide temperature in either Celsius or Fahrenheit, whichever is more appropriate.
- Never display the temperature in Kelvin.
- Provide a recommendation on how to prepare and what to wear (e.g. bring an umbrella, wear a wind breaker, a warm jacket, etc.)`;

  const newPrompt = `Question: ${prompt}. Weather Data: ${JSON.stringify(weatherData)}`;

  const data = {
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: sysMsg },
      { role: 'user', content: newPrompt },
    ],
  };

  const apiKey = Netlify.env.get('VITE_OPENAI');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return Response.json(result, { status: response.status });
};

export const config = {
  path: '/api/weather-description',
};
