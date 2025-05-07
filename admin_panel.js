/**
 * ConPave Adviser - Admin Panel
 * Advanced monitoring and statistics for the concrete pavement recommendation system
 */

// Track usage statistics
let usageStats = {
    totalRecommendations: 0,
    recommendationsByType: {
        JPCP: 0,
        JRCP: 0,
        CRCP: 0,
        PCP: 0
    },
    formCompletionRate: 0,
    averageInputTime: 0,
    startTime: null,
    mostCommonInputs: {},
    userSessions: 0
};

// Initialize admin panel when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin mode is enabled
    if (isAdminMode()) {
        initializeAdminPanel();
        setupEventListeners();
        loadSavedStats();
    }
    
    // Always track usage even when admin panel is not shown
    trackUsage();
});

/**
 * Check if admin mode is enabled via URL parameter
 */
function isAdminMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('admin');
}

/**
 * Initialize the admin panel UI
 */
function initializeAdminPanel() {
    // Create admin panel container
    const adminPanel = document.createElement('div');
    adminPanel.id = 'adminPanel';
    adminPanel.className = 'admin-panel card shadow-sm p-3 mt-4';
    
    // Add header
    adminPanel.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0"><i class="bi bi-shield-lock me-2"></i>ConPave Admin Panel <span class="badge bg-secondary">v3.5</span></h4>
            <div>
                <button id="resetStatsBtn" class="btn btn-sm btn-outline-danger me-2">
                    <i class="bi bi-arrow-counterclockwise me-1"></i>Reset Stats
                </button>
                <button id="exportStatsBtn" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-download me-1"></i>Export Data
                </button>
            </div>
        </div>
        
        <div class="row g-3">
            <div class="col-md-6">
                <div class="card bg-light">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-graph-up me-2"></i>Usage Statistics</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <tbody>
                                    <tr>
                                        <td>Total Recommendations:</td>
                                        <td id="totalRecommendations">0</td>
                                    </tr>
                                    <tr>
                                        <td>Form Completion Rate:</td>
                                        <td id="formCompletionRate">0%</td>
                                    </tr>
                                    <tr>
                                        <td>Average Input Time:</td>
                                        <td id="averageInputTime">0 sec</td>
                                    </tr>
                                    <tr>
                                        <td>User Sessions:</td>
                                        <td id="userSessions">0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card bg-light">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-pie-chart me-2"></i>Recommendation Distribution</h5>
                        <canvas id="adminTypeChart" width="100" height="100"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="col-md-12">
                <div class="card bg-light">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-sliders me-2"></i>Popular Parameter Combinations</h5>
                        <div id="popularCombinations" class="mt-2">
                            <div class="alert alert-info">No data available yet. Generate recommendations to see popular parameter combinations.</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-12">
                <div class="card bg-light">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-gear me-2"></i>System Calibration</h5>
                        <p class="small text-muted mb-3">Adjust recommendation probability weights to fine-tune the system</p>
                        
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label>JPCP Weight</label>
                                <input type="range" class="form-range" id="jpcp-weight" min="0.5" max="1.5" step="0.1" value="1.0">
                                <div class="d-flex justify-content-between">
                                    <small>0.5x</small>
                                    <small id="jpcp-weight-value">1.0x</small>
                                    <small>1.5x</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label>JRCP Weight</label>
                                <input type="range" class="form-range" id="jrcp-weight" min="0.5" max="1.5" step="0.1" value="1.0">
                                <div class="d-flex justify-content-between">
                                    <small>0.5x</small>
                                    <small id="jrcp-weight-value">1.0x</small>
                                    <small>1.5x</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label>CRCP Weight</label>
                                <input type="range" class="form-range" id="crcp-weight" min="0.5" max="1.5" step="0.1" value="1.0">
                                <div class="d-flex justify-content-between">
                                    <small>0.5x</small>
                                    <small id="crcp-weight-value">1.0x</small>
                                    <small>1.5x</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label>PCP Weight</label>
                                <input type="range" class="form-range" id="pcp-weight" min="0.5" max="1.5" step="0.1" value="1.0">
                                <div class="d-flex justify-content-between">
                                    <small>0.5x</small>
                                    <small id="pcp-weight-value">1.0x</small>
                                    <small>1.5x</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-grid mt-3">
                            <button id="applyWeightsBtn" class="btn btn-primary">
                                <i class="bi bi-check-circle me-2"></i>Apply Weights & Recalculate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Append to page just before footer
    const footer = document.querySelector('footer');
    if (footer) {
        document.body.insertBefore(adminPanel, footer);
    } else {
        document.body.appendChild(adminPanel);
    }
    
    // Add admin panel styles
    addAdminStyles();
}

/**
 * Add admin panel styles to page
 */
function addAdminStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .admin-panel {
            margin-bottom: 2rem;
            border-top: 3px solid #2a6cc2;
        }
        .admin-panel .card-title {
            font-size: 1.1rem;
            font-weight: 600;
        }
        .admin-panel .table {
            margin-bottom: 0;
        }
        .admin-panel .table td:first-child {
            font-weight: 500;
        }
        .admin-panel .table td:last-child {
            text-align: right;
            font-weight: 600;
        }
    `;
    document.head.appendChild(styleEl);
}

/**
 * Set up event listeners for admin panel
 */
function setupEventListeners() {
    // Reset stats button
    const resetBtn = document.getElementById('resetStatsBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all usage statistics?')) {
                resetStats();
                updateAdminUI();
                alert('Statistics have been reset');
            }
        });
    }
    
    // Export data button
    const exportBtn = document.getElementById('exportStatsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportStatistics();
        });
    }
    
    // Weight adjustment sliders
    const weightSliders = ['jpcp-weight', 'jrcp-weight', 'crcp-weight', 'pcp-weight'];
    weightSliders.forEach(id => {
        const slider = document.getElementById(id);
        const valueDisplay = document.getElementById(`${id}-value`);
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', function() {
                valueDisplay.textContent = `${slider.value}x`;
            });
        }
    });
    
    // Apply weights button
    const applyBtn = document.getElementById('applyWeightsBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            applyScoreWeights();
            simulateProportions();
        });
    }
    
    // Listen for recommendation generation
    document.getElementById('pavementForm')?.addEventListener('submit', function() {
        // Track form submission
        usageStats.totalRecommendations++;
        
        // Calculate input time if startTime exists
        if (usageStats.startTime) {
            const inputTime = (new Date() - usageStats.startTime) / 1000;
            if (usageStats.averageInputTime === 0) {
                usageStats.averageInputTime = inputTime;
            } else {
                // Moving average
                usageStats.averageInputTime = (usageStats.averageInputTime * (usageStats.totalRecommendations - 1) + inputTime) / usageStats.totalRecommendations;
            }
            usageStats.startTime = null;
        }
        
        // Record parameters
        setTimeout(() => {
            trackRecommendation();
        }, 1000);
    });
}

/**
 * Track new user session and initialize form timing
 */
function trackUsage() {
    // Increment session counter if new session
    if (!sessionStorage.getItem('conpaveSession')) {
        sessionStorage.setItem('conpaveSession', 'true');
        usageStats.userSessions++;
        saveStats();
    }
    
    // Start timing when user first interacts with form
    document.getElementById('pavementForm')?.addEventListener('focusin', function() {
        if (!usageStats.startTime) {
            usageStats.startTime = new Date();
        }
    }, { once: true });
    
    // Track form completion rate
    const formFields = document.querySelectorAll('#pavementForm select, #pavementForm input');
    formFields.forEach(field => {
        field.addEventListener('change', function() {
            // Calculate completion rate
            const totalFields = formFields.length;
            const completedFields = document.querySelectorAll('#pavementForm select:valid, #pavementForm input:valid').length;
            usageStats.formCompletionRate = completedFields / totalFields;
            
            if (isAdminMode()) {
                updateAdminUI();
            }
        });
    });
}

/**
 * Track and record a recommendation
 */
function trackRecommendation() {
    const recommendationSection = document.getElementById('recommendationSection');
    if (!recommendationSection || recommendationSection.classList.contains('d-none')) {
        return;
    }
    
    // Try to find the recommended type
    const recommendedTypeEl = recommendationSection.querySelector('.badge-success, .badge-primary, .recommended-badge');
    if (recommendedTypeEl) {
        const text = recommendedTypeEl.textContent;
        
        // Check which type was recommended
        if (text.includes('JPCP')) {
            usageStats.recommendationsByType.JPCP++;
        } else if (text.includes('JRCP')) {
            usageStats.recommendationsByType.JRCP++;
        } else if (text.includes('CRCP')) {
            usageStats.recommendationsByType.CRCP++;
        } else if (text.includes('PCP')) {
            usageStats.recommendationsByType.PCP++;
        }
    }
    
    // Record parameter combination
    const params = getFormData();
    const paramKey = generateParamKey(params);
    
    if (!usageStats.mostCommonInputs[paramKey]) {
        usageStats.mostCommonInputs[paramKey] = {
            count: 0,
            params: params
        };
    }
    
    usageStats.mostCommonInputs[paramKey].count++;
    
    // Save stats and update UI
    saveStats();
    if (isAdminMode()) {
        updateAdminUI();
    }
}

/**
 * Generate a key string from parameters
 */
function generateParamKey(params) {
    return `${params.trafficVolume}-${params.designLife}-${params.subgradeCBR}-${params.slabThickness}`;
}

/**
 * Get all form data
 */
function getFormData() {
    const formData = {};
    
    // Get all form elements
    const form = document.getElementById('pavementForm');
    if (!form) return formData;
    
    // Collect all input values
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        if (select.value) {
            formData[select.id] = select.value;
        }
    });
    
    const inputs = form.querySelectorAll('input:not([type="submit"])');
    inputs.forEach(input => {
        if (input.value) {
            formData[input.id] = input.value;
        }
    });
    
    return formData;
}

/**
 * Update admin panel UI with current stats
 */
function updateAdminUI() {
    // Update basic stats
    document.getElementById('totalRecommendations').textContent = usageStats.totalRecommendations;
    document.getElementById('formCompletionRate').textContent = `${Math.round(usageStats.formCompletionRate * 100)}%`;
    document.getElementById('averageInputTime').textContent = `${Math.round(usageStats.averageInputTime)} sec`;
    document.getElementById('userSessions').textContent = usageStats.userSessions;
    
    // Update distribution chart
    updateDistributionChart();
    
    // Update popular combinations
    updatePopularCombinations();
}

/**
 * Update the recommendation distribution chart
 */
function updateDistributionChart() {
    const ctx = document.getElementById('adminTypeChart');
    if (!ctx) return;
    
    const chartData = {
        labels: ['JPCP', 'JRCP', 'CRCP', 'PCP'],
        datasets: [{
            data: [
                usageStats.recommendationsByType.JPCP,
                usageStats.recommendationsByType.JRCP,
                usageStats.recommendationsByType.CRCP,
                usageStats.recommendationsByType.PCP
            ],
            backgroundColor: [
                '#4287f5',  // blue
                '#42b7f5',  // light blue
                '#f54242',  // red
                '#42f59e'   // green
            ],
            borderWidth: 1
        }]
    };
    
    // Check if chart already exists
    if (window.adminChart) {
        window.adminChart.data = chartData;
        window.adminChart.update();
    } else {
        // Create new chart
        window.adminChart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Update popular parameter combinations section
 */
function updatePopularCombinations() {
    const container = document.getElementById('popularCombinations');
    if (!container) return;
    
    // Convert to array and sort by count
    const combinations = Object.values(usageStats.mostCommonInputs)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5
    
    if (combinations.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No data available yet. Generate recommendations to see popular parameter combinations.</div>`;
        return;
    }
    
    // Build HTML
    let html = '<div class="table-responsive"><table class="table table-sm">';
    html += `<thead><tr>
                <th>Traffic</th>
                <th>Design Life</th>
                <th>CBR</th>
                <th>Thickness</th>
                <th>Count</th>
                <th>Action</th>
            </tr></thead><tbody>`;
    
    combinations.forEach(combo => {
        const p = combo.params;
        html += `<tr>
                    <td>${getTrafficLabel(p.trafficVolume)}</td>
                    <td>${p.designLife} years</td>
                    <td>${getCBRLabel(p.subgradeCBR)}</td>
                    <td>${p.slabThickness} mm</td>
                    <td><span class="badge bg-primary">${combo.count}</span></td>
                    <td><button class="btn btn-sm btn-outline-primary fill-params" 
                            data-params='${JSON.stringify(p)}'>Fill Form</button></td>
                </tr>`;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
    
    // Add event listeners for fill buttons
    container.querySelectorAll('.fill-params').forEach(btn => {
        btn.addEventListener('click', function() {
            const params = JSON.parse(btn.dataset.params);
            fillFormWithParams(params);
        });
    });
}

/**
 * Get human-readable traffic volume label
 */
function getTrafficLabel(value) {
    const labels = {
        '1': '<450 CVPD',
        '2': '450-2000 CVPD',
        '3': '>2000 CVPD',
        '4': 'Very High'
    };
    return labels[value] || value;
}

/**
 * Get human-readable CBR label
 */
function getCBRLabel(value) {
    const labels = {
        '1': '<3%',
        '2': '3-5%',
        '3': '6-7%',
        '4': '≥8%'
    };
    return labels[value] || value;
}

/**
 * Fill form with parameter set
 */
function fillFormWithParams(params) {
    const form = document.getElementById('pavementForm');
    if (!form) return;
    
    // Fill all form fields
    Object.keys(params).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = params[fieldId];
            
            // Trigger change event to update validation state
            const event = new Event('change', { bubbles: true });
            field.dispatchEvent(event);
        }
    });
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Apply score weights for calibration
 */
function applyScoreWeights() {
    // Get weight values
    const weights = {
        JPCP: parseFloat(document.getElementById('jpcp-weight').value),
        JRCP: parseFloat(document.getElementById('jrcp-weight').value),
        CRCP: parseFloat(document.getElementById('crcp-weight').value),
        PCP: parseFloat(document.getElementById('pcp-weight').value)
    };
    
    // Store in localStorage
    localStorage.setItem('conpaveWeights', JSON.stringify(weights));
    
    // Show confirmation
    alert('Weights applied. These will be used for future recommendations.');
}

/**
 * Simulate probability distribution with current weights
 */
function simulateProportions() {
    // Run probability analysis with current weights
    if (window.probabilityCalculator) {
        // Show loading state
        const btn = document.getElementById('applyWeightsBtn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Calculating...';
            btn.disabled = true;
            
            setTimeout(() => {
                try {
                    const results = window.probabilityCalculator.runProbabilityAnalysis(1000);
                    alert(`Estimated distribution with new weights:\n\n` + 
                        `JPCP: ${(results.rawProbabilities.JPCP * 100).toFixed(1)}%\n` +
                        `JRCP: ${(results.rawProbabilities.JRCP * 100).toFixed(1)}%\n` +
                        `CRCP: ${(results.rawProbabilities.CRCP * 100).toFixed(1)}%\n` +
                        `PCP: ${(results.rawProbabilities.PCP * 100).toFixed(1)}%`);
                } catch (e) {
                    console.error(e);
                    alert('Error calculating probabilities');
                }
                
                // Restore button
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 100);
        }
    } else {
        alert('Probability calculator not available');
    }
}

/**
 * Save stats to localStorage
 */
function saveStats() {
    localStorage.setItem('conpaveStats', JSON.stringify(usageStats));
}

/**
 * Load saved stats from localStorage
 */
function loadSavedStats() {
    const saved = localStorage.getItem('conpaveStats');
    if (saved) {
        try {
            usageStats = JSON.parse(saved);
            updateAdminUI();
        } catch (e) {
            console.error('Error loading saved stats', e);
        }
    }
}

/**
 * Reset all statistics
 */
function resetStats() {
    usageStats = {
        totalRecommendations: 0,
        recommendationsByType: {
            JPCP: 0,
            JRCP: 0,
            CRCP: 0,
            PCP: 0
        },
        formCompletionRate: 0,
        averageInputTime: 0,
        startTime: null,
        mostCommonInputs: {},
        userSessions: 0
    };
    saveStats();
}

/**
 * Export statistics as CSV
 */
function exportStatistics() {
    // Prepare data for export
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Basic stats
    csvContent += "Statistic,Value\r\n";
    csvContent += `Total Recommendations,${usageStats.totalRecommendations}\r\n`;
    csvContent += `JPCP Recommendations,${usageStats.recommendationsByType.JPCP}\r\n`;
    csvContent += `JRCP Recommendations,${usageStats.recommendationsByType.JRCP}\r\n`;
    csvContent += `CRCP Recommendations,${usageStats.recommendationsByType.CRCP}\r\n`;
    csvContent += `PCP Recommendations,${usageStats.recommendationsByType.PCP}\r\n`;
    csvContent += `Form Completion Rate,${(usageStats.formCompletionRate * 100).toFixed(1)}%\r\n`;
    csvContent += `Average Input Time,${Math.round(usageStats.averageInputTime)} seconds\r\n`;
    csvContent += `User Sessions,${usageStats.userSessions}\r\n\r\n`;
    
    // Popular combinations
    csvContent += "Popular Parameter Combinations\r\n";
    csvContent += "Traffic,Design Life,CBR,Thickness,Count\r\n";
    
    Object.values(usageStats.mostCommonInputs)
        .sort((a, b) => b.count - a.count)
        .forEach(combo => {
            const p = combo.params;
            csvContent += `${getTrafficLabel(p.trafficVolume)},${p.designLife} years,${getCBRLabel(p.subgradeCBR)},${p.slabThickness} mm,${combo.count}\r\n`;
        });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "conpave_statistics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Patch the calculatePavementScores function to apply weights if they exist
(function patchScoringFunction() {
    // Store original function
    if (window.pavementScoring && window.pavementScoring.calculatePavementScores) {
        const originalFunction = window.pavementScoring.calculatePavementScores;
        
        // Override with weight-applying version
        window.pavementScoring.calculatePavementScores = function(params) {
            // Call original function
            const result = originalFunction(params);
            
            // Apply weights if they exist
            const weights = localStorage.getItem('conpaveWeights');
            if (weights) {
                try {
                    const weightObj = JSON.parse(weights);
                    
                    // Apply weights to scores
                    Object.keys(weightObj).forEach(type => {
                        if (result.scores[type]) {
                            result.scores[type] = Math.round(result.scores[type] * weightObj[type]);
                        }
                    });
                    
                    // Recalculate highest score and recommended type
                    let highestScore = 0;
                    let recommendedType = "";
                    
                    Object.keys(result.scores).forEach(type => {
                        if (result.scores[type] > highestScore) {
                            highestScore = result.scores[type];
                            recommendedType = type;
                        }
                    });
                    
                    // Update result
                    result.recommendedType = recommendedType;
                    result.highestScore = highestScore;
                } catch (e) {
                    console.error('Error applying weights', e);
                }
            }
            
            return result;
        };
    }
})(); 