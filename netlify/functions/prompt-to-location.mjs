export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { prompt, units } = await req.json();

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    functions: [
      {
        name: 'displayData',
        description: 'Get the current weather in a given location.',
        parameters: {
          type: 'object',
          properties: {
            country: { type: 'string', description: 'Country name.' },
            countryCode: { type: 'string', description: 'Country code. Use ISO-3166' },
            USstate: { type: 'string', description: 'Full state name.' },
            state: { type: 'string', description: 'Two-letter state code.' },
            city: { type: 'string', description: 'City name.' },
            unit: { type: 'string', description: 'location unit: metric or imperial.' },
          },
          required: ['countryCode', 'country', 'USstate', 'state', 'city', 'unit'],
        },
      },
    ],
    function_call: 'auto',
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
  path: '/api/prompt-to-location',
};
