const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 9876;
const WINDOW_SIZE = 10;

// Replace this with your full access token
const ACCESS_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MjAwMzc2LCJpYXQiOjE3NDcyMDAwNzYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkzZjU0MzgyLWU5ODktNGVjYS04ODk1LWRjNTk5ZjcyNjMwMiIsInN1YiI6ImJhbmRpLmRoYW51c2g4NDIxQGdtYWlsLmNvbSJ9LCJlbWFpbCI6ImJhbmRpLmRoYW51c2g4NDIxQGdtYWlsLmNvbSIsIm5hbWUiOiJkaGFudXNoIGIiLCJyb2xsTm8iOiJzY2EyNG1jYTAwOCIsImFjY2Vzc0NvZGUiOiJDdnRQY1UiLCJjbGllbnRJRCI6IjkzZjU0MzgyLWU5ODktNGVjYS04ODk1LWRjNTk5ZjcyNjMwMiIsImNsaWVudFNlY3JldCI6ImVoalFaRlJSa3B5ZFdVc3cifQ.BqIw8XeJuk9ruL8XM4BEZ74rUox1Hk9T71boov7tFOU";

const numberWindow = [];

// Mapping types to test server endpoints
const typeMap = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand'
};

// Fetch numbers from third-party API with 500ms timeout
async function fetchNumbers(type) {
  const url = `http://20.244.56.144/evaluation-service/${type}`;
  try {
    const response = await axios.get(url, {
      timeout: 500,
      headers: {
        Authorization: ACCESS_TOKEN
      }
    });
    return response.data.numbers || [];
  } catch (error) {
    console.error(`Failed to fetch ${type}:`, error.message);
    return [];
  }
}

// API route
app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;

  if (!typeMap[type]) {
    return res.status(400).json({ error: 'Invalid type. Use p, f, e, or r.' });
  }

  const apiType = typeMap[type];
  const fetchedNumbers = await fetchNumbers(apiType);

  const prevWindow = [...numberWindow];

  for (const num of fetchedNumbers) {
    if (!numberWindow.includes(num)) {
      if (numberWindow.length >= WINDOW_SIZE) {
        numberWindow.shift(); // remove oldest
      }
      numberWindow.push(num);
    }
  }

  const avg =
    numberWindow.length > 0
      ? (
          numberWindow.reduce((sum, val) => sum + val, 0) / numberWindow.length
        ).toFixed(2)
      : 0;

  res.json({
    windowPrevState: prevWindow,
    windowCurrState: numberWindow,
    numbers: fetchedNumbers,
    avg: parseFloat(avg)
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
