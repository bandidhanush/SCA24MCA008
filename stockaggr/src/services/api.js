import axios from 'axios';

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MjAwMzc2LCJpYXQiOjE3NDcyMDAwNzYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkzZjU0MzgyLWU5ODktNGVjYS04ODk1LWRjNTk5ZjcyNjMwMiIsInN1YiI6ImJhbmRpLmRoYW51c2g4NDIxQGdtYWlsLmNvbSJ9LCJlbWFpbCI6ImJhbmRpLmRoYW51c2g4NDIxQGdtYWlsLmNvbSIsIm5hbWUiOiJkaGFudXNoIGIiLCJyb2xsTm8iOiJzY2EyNG1jYTAwOCIsImFjY2Vzc0NvZGUiOiJDdnRQY1UiLCJjbGllbnRJRCI6IjkzZjU0MzgyLWU5ODktNGVjYS04ODk1LWRjNTk5ZjcyNjMwMiIsImNsaWVudFNlY3JldCI6ImVoalFaRlJSa3B5ZFdVc3cifQ.BqIw8XeJuk9ruL8XM4BEZ74rUox1Hk9T71boov7tFOU"; // replace this with your token

export const getStocks = async () => {
  const response = await axios.get('http://20.244.56.144/evaluation-service/stocks', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const getStockPriceHistory = async (symbol) => {
  const response = await axios.get(`http://20.244.56.144/evaluation-service/stocks/${symbol}/history`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
