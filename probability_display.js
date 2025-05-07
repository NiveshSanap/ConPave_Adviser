/**
 * Probability Display Utility for ConPave Adviser
 * This file provides functions to display pavement type probability information
 */

document.addEventListener('DOMContentLoaded', function() {
    // The button is now added directly in the HTML
});

/**
 * Shows probability results in the reference section
 * @param {Object} result - Probability analysis results
 */
function showProbabilityResults(result) {
    const referenceSection = document.querySelector('.reference-section');
    if (!referenceSection) return;
    
    // Create or get results container
    let resultContainer = document.getElementById('probabilityResults');
    if (!resultContainer) {
        resultContainer = document.createElement('div');
        resultContainer.className = 'probability-results mt-4';
        resultContainer.id = 'probabilityResults';
        referenceSection.appendChild(resultContainer);
    }
    
    // Ensure the container is visible
    resultContainer.style.display = 'block';
    
    // Prepare colors for chart
    const colors = {
        JPCP: '#4287f5', // blue
        JRCP: '#42b7f5', // light blue
        CRCP: '#f54242', // red
        PCP: '#42f59e'   // green
    };
    
    // Create HTML content
    let html = `
        <div class="card shadow-sm">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Pavement Type Probabilities</h5>
                    <small class="text-muted">Based on ${result.sampleSize.toLocaleString()} random input combinations</small>
                </div>
                <div>
                    <button type="button" class="btn btn-sm btn-outline-secondary me-2" id="minimizeProbabilityBtn">
                        <i class="bi bi-arrows-collapse"></i>
                    </button>
                    <button type="button" class="btn-close" id="closeProbabilityBtn" aria-label="Close"></button>
                </div>
            </div>
            <div class="card-body" id="probabilityCardBody">
                <div class="row">
                    <div class="col-md-6">
                        <canvas id="probabilityChart" width="100" height="100"></canvas>
                    </div>
                    <div class="col-md-6">
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Pavement Type</th>
                                        <th>Probability</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
    `;
    
    // Add table rows for each pavement type
    Object.keys(result.formattedProbabilities).forEach(type => {
        html += `
            <tr>
                <td>${getPavementFullName(type)}</td>
                <td><span class="badge bg-primary">${result.formattedProbabilities[type]}</span></td>
                <td>${result.counts[type].toLocaleString()}</td>
            </tr>
        `;
    });
    
    html += `
                                </tbody>
                            </table>
                        </div>
                        <p class="small text-muted mt-3">
                            This calculation uses a Monte Carlo simulation to estimate the probability of each pavement 
                            type being recommended based on random combinations of input parameters. The results show 
                            the overall distribution of recommendations across the parameter space.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update container with the HTML
    resultContainer.innerHTML = html;
    
    // Create chart
    setTimeout(() => {
        createProbabilityChart(result.rawProbabilities, colors);
        
        // Set up close button event listener
        const closeBtn = document.getElementById('closeProbabilityBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                // Add fade-out class for animation
                resultContainer.classList.add('fade-out');
                
                // Reset the calculate button text immediately
                const calcBtn = document.getElementById('calculateProbabilitiesBtn');
                if (calcBtn) {
                    calcBtn.innerHTML = '<i class="bi bi-graph-up me-2"></i>Calculate Type Probabilities';
                }
                
                // Hide after animation completes
                setTimeout(() => {
                    resultContainer.style.display = 'none';
                    // Remove the fade-out class for next time
                    resultContainer.classList.remove('fade-out');
                }, 300);
            });
        }

        // Set up minimize/expand button
        const minimizeBtn = document.getElementById('minimizeProbabilityBtn');
        const cardBody = document.getElementById('probabilityCardBody');
        if (minimizeBtn && cardBody) {
            minimizeBtn.addEventListener('click', function() {
                // Toggle the visibility of the card body
                if (cardBody.style.display === 'none') {
                    // Expand
                    cardBody.style.display = 'block';
                    minimizeBtn.innerHTML = '<i class="bi bi-arrows-collapse"></i>';
                    
                    // Recreate chart since it might have been destroyed
                    setTimeout(() => {
                        createProbabilityChart(result.rawProbabilities, colors);
                    }, 100);
                } else {
                    // Minimize
                    cardBody.style.display = 'none';
                    minimizeBtn.innerHTML = '<i class="bi bi-arrows-expand"></i>';
                }
            });
        }
    }, 100);
    
    // Scroll to results
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Create a pie chart to display probabilities
 */
function createProbabilityChart(probabilities, colors) {
    const ctx = document.getElementById('probabilityChart');
    if (!ctx) return;
    
    // Destroy existing chart if any
    if (window.probabilityChart) {
        window.probabilityChart.destroy();
    }
    
    // Prepare data for chart
    const data = {
        labels: Object.keys(probabilities).map(type => getPavementFullName(type)),
        datasets: [{
            data: Object.values(probabilities).map(value => (value * 100).toFixed(1)),
            backgroundColor: Object.keys(probabilities).map(type => colors[type]),
            borderWidth: 1
        }]
    };
    
    // Create chart
    window.probabilityChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Get the full name of a pavement type from its code
 */
function getPavementFullName(code) {
    const names = {
        'JPCP': 'Jointed Plain Concrete Pavement',
        'JRCP': 'Jointed Reinforced Concrete Pavement',
        'CRCP': 'Continuously Reinforced Concrete Pavement',
        'PCP': 'Precast Concrete Pavement'
    };
    return names[code] || code;
}

// Export functions for browser use
window.probabilityDisplay = {
    showProbabilityResults
}; 