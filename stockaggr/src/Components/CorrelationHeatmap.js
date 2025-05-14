import React, { useEffect, useState } from 'react';
import { getStocks, getStockPriceHistory } from '../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { calculateCorrelation } from '../utils/utils';
const CorrelationHeatmap = () => {
    const [stocks, setStocks] = useState([]);
    const [correlationData, setCorrelationData] = useState({});
    const [timeInterval, setTimeInterval] = useState(50);

    useEffect(() => {
        const fetchStocks = async () => {
            const stocksData = await getStocks();
            setStocks(stocksData);
        };
        fetchStocks();
    }, []);

    useEffect(() => {
        const fetchCorrelationData = async () => {
            const data = {};
            for (let stock in stocks) {
                const priceHistory = await getStockPriceHistory(stocks[stock], timeInterval);
                data[stock] = priceHistory.map((entry) => entry.price);
            }
            setCorrelationData(calculateCorrelation(data));
        };
        fetchCorrelationData();
    }, [timeInterval, stocks]);

    return (
        <div>
            <h1>Correlation Heatmap</h1>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {Object.keys(correlationData).map((stock) => (
                                <TableCell key={stock}>{stock}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(correlationData).map((rowStock) => (
                            <TableRow key={rowStock}>
                                {Object.keys(correlationData).map((colStock) => (
                                    <TableCell key={colStock}>
                                        {correlationData[rowStock][colStock].toFixed(2)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default CorrelationHeatmap;
