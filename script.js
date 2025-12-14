// Function to get data from Local Storage
function getData() {
    const data = localStorage.getItem('weightTrackerData');
    // Returns an array of objects: [{ date: 'YYYY-MM-DD', weight: 75.5 }]
    return data ? JSON.parse(data).sort((a, b) => new Date(a.date) - new Date(b.date)) : [];
}

// Function to save data to Local Storage
function saveData(data) {
    localStorage.setItem('weightTrackerData', JSON.stringify(data));
}

let weightChart;

// Function to draw or update the Chart.js graph
function renderChart(data) {
    const ctx = document.getElementById('weight-chart').getContext('2d');
    
    // Extracting labels (dates) and data points (weights)
    const labels = data.map(item => item.date);
    const weights = data.map(item => item.weight);

    // Destroy existing chart instance before creating a new one
    if (weightChart) {
        weightChart.destroy();
    }

    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Your Weight Progress',
                data: weights,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Important for Notion embedding
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Function to update the history list
function renderList(data) {
    const list = document.getElementById('weight-list');
    list.innerHTML = '';
    data.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.date}</strong>: ${item.weight} <button onclick="deleteWeight(${index})">Delete</button>`;
        list.appendChild(li);
    });
}

// Function to add a new weight
function addWeight() {
    const dateInput = document.getElementById('date-input');
    const weightInput = document.getElementById('weight-input');
    
    const date = dateInput.value;
    const weight = parseFloat(weightInput.value);

    if (date && weight) {
        const data = getData();
        data.push({ date, weight });
        saveData(data);
        updateUI();
        // Clear input fields
        dateInput.value = '';
        weightInput.value = '';
    } else {
        alert('Please enter a valid date and weight!');
    }
}

// Function to delete a weight entry
function deleteWeight(indexToDelete) {
    const data = getData();
    data.splice(indexToDelete, 1); // Remove item at the specified index
    saveData(data);
    updateUI();
}

// Function to call all rendering functions
function updateUI() {
    const data = getData();
    renderChart(data);
    renderList(data);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    document.getElementById('date-input').valueAsDate = new Date();
    updateUI();
});
