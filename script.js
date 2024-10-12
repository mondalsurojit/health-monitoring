// Simulated sensor data with random generation
let heartRate = 75; // Initial heart rate
let spo2 = 98; // Initial oxygen saturation
let temperatureCelsius = (Math.random() * (37 - 36 + 1) + 36).toFixed(1); // Constant temperature

let heartRateData = [heartRate];
let spo2Data = [spo2];
let temperatureData = [temperatureCelsius]; // Initially store temperature in Celsius
let isCelsius = true; // Track the current unit (Celsius or Fahrenheit)

// Function to generate slight variations in health data
function generateSlightlyChangedData() {
    heartRate += Math.floor(Math.random() * 3) - 1;
    spo2 += Math.floor(Math.random() * 3) - 1;

    heartRate = Math.max(60, Math.min(heartRate, 100));
    spo2 = Math.max(90, Math.min(spo2, 100));

    // Push new values into data arrays
    heartRateData.push(heartRate);
    spo2Data.push(spo2);
    temperatureData.push(temperatureCelsius);

    // Keep only the latest 10 values
    if (heartRateData.length > 10) heartRateData.shift();
    if (spo2Data.length > 10) spo2Data.shift();
    if (temperatureData.length > 10) temperatureData.shift();
}

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

// Function to toggle between Celsius and Fahrenheit
function toggleTemperatureUnit() {
    const temperatureElement = document.getElementById('temperature').querySelector('.value');
    
    if (isCelsius) {
        // Convert to Fahrenheit and update the UI
        const temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius).toFixed(1);
        temperatureElement.innerText = `${temperatureFahrenheit} °F`;
    } else {
        // Convert back to Celsius and update the UI
        temperatureElement.innerText = `${temperatureCelsius} °C`;
    }

    // Toggle the unit state
    isCelsius = !isCelsius;

    // Update the chart to reflect the new unit
    updateTemperatureChart();
}

// Function to update the metrics and charts
function updateMetrics() {
    generateSlightlyChangedData();

    document.getElementById('heartRate').querySelector('.value').innerText = heartRate + ' BPM';
    document.getElementById('spo2').querySelector('.value').innerText = spo2 + ' %';

    // Respect the current temperature unit when updating the temperature
    const temperatureElement = document.getElementById('temperature').querySelector('.value');
    if (isCelsius) {
        temperatureElement.innerText = `${temperatureCelsius} °C`;
    } else {
        const temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius).toFixed(1);
        temperatureElement.innerText = `${temperatureFahrenheit} °F`;
    }

    updateCharts();
}

// Chart initialization
const heartRateChart = new Chart(document.getElementById('heartRateChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: Array(10).fill(''),
        datasets: [{
            label: 'Heart Rate (BPM)',
            data: heartRateData,
            borderColor: 'red',
            fill: false,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 120
            }
        }
    }
});

const spo2Chart = new Chart(document.getElementById('spo2Chart').getContext('2d'), {
    type: 'line',
    data: {
        labels: Array(10).fill(''),
        datasets: [{
            label: 'Oxygen Level (%)',
            data: spo2Data,
            borderColor: 'blue',
            fill: false,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

// Initialize temperature chart (Celsius initially)
let temperatureChart = new Chart(document.getElementById('temperatureChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: Array(10).fill(''),
        datasets: [{
            label: 'Temperature (°C)',
            data: temperatureData,
            borderColor: 'green',
            fill: false,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 40 // Celsius scale max
            }
        }
    }
});

// Function to update all charts
function updateCharts() {
    heartRateChart.data.datasets[0].data = heartRateData;
    spo2Chart.data.datasets[0].data = spo2Data;

    updateTemperatureChart();

    heartRateChart.update();
    spo2Chart.update();
}

// Function to update the temperature chart based on the current unit (Celsius or Fahrenheit)
function updateTemperatureChart() {
    let updatedTemperatureData;

    if (isCelsius) {
        // Keep temperature data in Celsius
        updatedTemperatureData = temperatureData.map(temp => parseFloat(temp));
        temperatureChart.data.datasets[0].label = 'Temperature (°C)';

        // Set Y-axis maximum value to 40 for Celsius
        temperatureChart.options.scales.y.max = 40;
    } else {
        // Convert all temperature data to Fahrenheit
        updatedTemperatureData = temperatureData.map(temp => celsiusToFahrenheit(parseFloat(temp)).toFixed(1));
        temperatureChart.data.datasets[0].label = 'Temperature (°F)';

        // Set Y-axis maximum value to 120 for Fahrenheit
        temperatureChart.options.scales.y.max = 120;
    }

    temperatureChart.data.datasets[0].data = updatedTemperatureData;
    temperatureChart.update();
}

// Show preloader for a few seconds before displaying the main content
function showPreloader() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        updateMetrics();

        setInterval(updateMetrics, 5000);
    }, 3000);
}

// Call the function to start the preloader
showPreloader();
