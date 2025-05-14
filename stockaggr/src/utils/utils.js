export const calculateCorrelation = (data) => {
    const correlationMatrix = {};
    const stocks = Object.keys(data);
    
    for (let i = 0; i < stocks.length; i++) {
        for (let j = i; j < stocks.length; j++) {
            const stockX = stocks[i];
            const stockY = stocks[j];
            const covariance = calculateCovariance(data[stockX], data[stockY]);
            const stdDevX = calculateStandardDeviation(data[stockX]);
            const stdDevY = calculateStandardDeviation(data[stockY]);
            const correlation = covariance / (stdDevX * stdDevY);
            if (!correlationMatrix[stockX]) correlationMatrix[stockX] = {};
            correlationMatrix[stockX][stockY] = correlation;
            correlationMatrix[stockY] = correlationMatrix[stockY] || {};
            correlationMatrix[stockY][stockX] = correlation;
        }
    }

    return correlationMatrix;
};

const calculateCovariance = (X, Y) => {
    const n = X.length;
    const meanX = X.reduce((a, b) => a + b, 0) / n;
    const meanY = Y.reduce((a, b) => a + b, 0) / n;
    return X.reduce((acc, xi, i) => acc + (xi - meanX) * (Y[i] - meanY), 0) / (n - 1);
};

const calculateStandardDeviation = (X) => {
    const n = X.length;
    const mean = X.reduce((a, b) => a + b, 0) / n;
    return Math.sqrt(X.reduce((acc, xi) => acc + Math.pow(xi - mean, 2), 0) / (n - 1));
};
