import React, { useEffect, useState } from 'react';
import { getStocks, getStockPriceHistory } from '../services/api';
import { Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const StockPage = () => {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState('');
    const [priceHistory, setPriceHistory] = useState([]);
    const [timeInterval, setTimeInterval] = useState(50);

    useEffect(() => {
        const fetchStocks = async () => {
            const stocksData = await getStocks();
            setStocks(stocksData);
        };
        fetchStocks();
    }, []);

    useEffect(() => {
        const fetchStockPriceHistory = async () => {
            if (selectedStock) {
                const data = await getStockPriceHistory(selectedStock, timeInterval);
                setPriceHistory(data);
            }
        };
        fetchStockPriceHistory();
    }, [selectedStock, timeInterval]);

    const handleStockChange = (event) => {
        setSelectedStock(event.target.value);
    };

    const handleTimeIntervalChange = (event) => {
        setTimeInterval(event.target.value);
    };

    const getChartData = () => {
        const prices = priceHistory.map((entry) => entry.price);
        const labels = priceHistory.map((entry) => new Date(entry.lastUpdatedAt).toLocaleTimeString());
        const average = prices.reduce((a, b) => a + b, 0) / prices.length;

        return {
            labels,
            datasets: [
                {
                    label: 'Stock Price',
                    data: prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'Average Price',
                    data: Array(prices.length).fill(average),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                },
            ],
        };
    };

    return (
        <div>
            <h1>Stock Price Aggregation</h1>
            <FormControl fullWidth>
                <InputLabel>Stock</InputLabel>
                <Select value={selectedStock} onChange={handleStockChange}>
                    {Object.keys(stocks).map((stockName) => (
                        <MenuItem key={stockName} value={stocks[stockName]}>
                            {stockName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Time Interval (minutes)</InputLabel>
                <Select value={timeInterval} onChange={handleTimeIntervalChange}>
                    {[50, 100, 200].map((minutes) => (
                        <MenuItem key={minutes} value={minutes}>
                            Last {minutes} minutes
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div style={{ height: '400px' }}>
                <Line data={getChartData()} />
            </div>
        </div>
    );
};

export default StockPage;
