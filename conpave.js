/**
 * ConPave Adviser v3.0
 * Advanced Concrete Pavement Recommendation System
 * Based on IRC Standards
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix for GitHub Pages base URL issues
    function fixGitHubPagesBaseURL() {
        // Check if we're on GitHub Pages by looking for "github.io" in the hostname
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        if (isGitHubPages) {
            console.log('Running on GitHub Pages, checking script paths...');
            
            // Check if necessary scripts are loaded
            const checkScripts = ['recommendations.js', 'training.js', 'main.js'];
            const loadedScripts = Array.from(document.scripts).map(script => {
                const pathParts = script.src.split('/');
                return pathParts[pathParts.length - 1];
            });
            
            const missingScripts = checkScripts.filter(script => 
                !loadedScripts.some(loaded => loaded.includes(script))
            );
            
            // If scripts are missing, try to load them
            if (missingScripts.length > 0) {
                console.warn('Missing scripts detected:', missingScripts);
                
                // Get the repository name from the URL path
                const pathSegments = window.location.pathname.split('/');
                const repoName = pathSegments[1]; // The first segment after the domain
                
                // Dynamically load missing scripts
                missingScripts.forEach(script => {
                    const scriptElement = document.createElement('script');
                    scriptElement.src = `/${repoName}/assets/js/${script}`;
                    scriptElement.async = false;
                    document.body.appendChild(scriptElement);
                    console.log(`Attempting to load: ${scriptElement.src}`);
                });
            }
        }
    }
    
    // Call the fix function
    fixGitHubPagesBaseURL();
    
    // Initialize tooltips and popovers
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    
    // Initialize form validation
    initFormValidation();
    
    // Dark mode toggle functionality
    initDarkMode();
    
    // Initialize recommendation engine
    initRecommendationEngine();
    
    // Initialize data visualization
    initCharts();
    
    // Initialize reference table toggle
    initReferenceTableToggle();
    
    // Add probability calculator button listener
    const calculateProbabilitiesBtn = document.getElementById('calculateProbabilitiesBtn');
    if (calculateProbabilitiesBtn && window.probabilityCalculator && window.probabilityDisplay) {
        calculateProbabilitiesBtn.addEventListener('click', function() {
            // Check if probability results already exist and are visible
            const probabilityResults = document.getElementById('probabilityResults');
            if (probabilityResults && probabilityResults.style.display !== 'none' && 
                probabilityResults.innerHTML.trim() !== '') {
                // If results are visible, add animation class
                probabilityResults.classList.add('fade-out');
                
                // Update button text immediately
                calculateProbabilitiesBtn.innerHTML = '<i class="bi bi-graph-up me-2"></i>Calculate Type Probabilities';
                
                // Hide after animation completes
                setTimeout(() => {
                    probabilityResults.style.display = 'none';
                    // Remove the class for next time
                    probabilityResults.classList.remove('fade-out');
                }, 300);
                return;
            }
            
            // Show loading state
            calculateProbabilitiesBtn.disabled = true;
            calculateProbabilitiesBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Calculating...';
            
            // Run analysis in a setTimeout to allow UI to update
            setTimeout(() => {
                try {
                    const results = window.probabilityCalculator.runProbabilityAnalysis(2000);
                    window.probabilityDisplay.showProbabilityResults(results);
                    showNotification('Probability analysis completed with 2000 simulations', 'success');
                    calculateProbabilitiesBtn.innerHTML = '<i class="bi bi-eye-slash me-2"></i>Hide Probability Results';
                } catch (e) {
                    console.error('Error running probability analysis:', e);
                    showNotification('Error calculating pavement type probabilities', 'danger');
                    calculateProbabilitiesBtn.innerHTML = '<i class="bi bi-graph-up me-2"></i>Calculate Type Probabilities';
                }
                
                // Restore button state
                calculateProbabilitiesBtn.disabled = false;
            }, 100);
        });
    }
    
    // Add debug button listener
    const debugButton = document.getElementById('debugButton');
    if (debugButton) {
        debugButton.addEventListener('click', function() {
            console.log('Debug button clicked');
            const toggleReferenceBtn = document.getElementById('toggleReferenceBtn');
            if (toggleReferenceBtn) {
                toggleReferenceBtn.click();
                showNotification('Debug: Toggled reference table', 'info');
            } else {
                console.error('Toggle reference button not found');
                showNotification('Error: Toggle reference button not found', 'danger');
            }
        });
    }
    
    // Add a small admin hint in the footer, only visible to developers
    const footer = document.querySelector('footer');
    if (footer) {
        const adminHint = document.createElement('div');
        adminHint.className = 'small text-muted mt-2';
        adminHint.style.opacity = '0.5';
        adminHint.innerHTML = 'Developer Tools: <a href="?admin" class="text-muted">Admin Panel</a>';
        
        const footerContainer = footer.querySelector('.container');
        if (footerContainer) {
            footerContainer.appendChild(adminHint);
        }
    }
    
    // Check if admin mode is activated and show toast notification
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin')) {
        showToast('Admin Panel Activated', 'The admin panel is now accessible at the bottom of the page.', 'info');
    }
});

/**
 * Initialize form validation
 */
function initFormValidation() {
    const form = document.getElementById('pavementForm');
    if (!form) return;
    
    const formInputs = form.querySelectorAll('select, input');
    const progressBar = document.getElementById('formProgressBar');
    const progressText = document.querySelector('.form-progress small:first-child');
    
    // Add validation on change
    formInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateInput(this);
            updateFormProgress();
        });
    });
    
    // Add submit event listener
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            generateRecommendation();
        } else {
            showNotification('Please fill all required fields', 'warning');
        }
    });
    
    function validateInput(input) {
        if (input.value) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            return true;
        } else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            return false;
        }
    }
    
    function updateFormProgress() {
        // Safety check for required elements
        if (!progressBar || !progressText) {
            console.warn('Form progress elements not found');
            return;
        }
        
        let validCount = 0;
        const totalCount = formInputs.length;
        
        formInputs.forEach(input => {
            if (input.value) validCount++;
        });
        
        const progressPercent = Math.round((validCount / totalCount) * 100);
        progressBar.style.width = `${progressPercent}%`;
        progressBar.setAttribute('aria-valuenow', progressPercent);
        progressText.textContent = `${validCount}/${totalCount} Fields`;
        
        // Update submit button - safely find it first
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = validCount !== totalCount;
            
            if (validCount === totalCount) {
                submitBtn.classList.add('btn-pulse');
                // Only show notification if changing from incomplete to complete
                if (!submitBtn.classList.contains('form-completed')) {
                    showNotification('All fields completed! Ready to generate recommendation.', 'success');
                    submitBtn.classList.add('form-completed');
                }
            } else {
                submitBtn.classList.remove('btn-pulse');
                submitBtn.classList.remove('form-completed');
            }
        }
    }
    
    // Initial progress update
    updateFormProgress();
}

/**
 * Initialize dark mode functionality
 */
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Check for user preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        updateThemeToggle(true);
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        updateThemeToggle(savedTheme === 'dark');
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateThemeToggle(newTheme === 'dark');
        showNotification(newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
    });
    
    function updateThemeToggle(isDark) {
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (isDark) {
            icon.className = 'bi bi-sun';
            text.textContent = 'Light Mode';
        } else {
            icon.className = 'bi bi-moon-stars';
            text.textContent = 'Dark Mode';
        }
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Bootstrap color theme (primary, success, danger, etc.)
 */
function showNotification(message, type = 'info') {
    try {
        const toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            console.warn('Toast container not found, creating one');
            
            // Create toast container if it doesn't exist
            const newContainer = document.createElement('div');
            newContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            newContainer.style.zIndex = '1050';
            document.body.appendChild(newContainer);
            
            // Try again with the new container
            showNotification(message, type);
            return;
        }
        
        const toastHTML = `
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = toastContainer.lastChild;
        
        // Create toast instance with Bootstrap
        try {
            const toast = new bootstrap.Toast(toastElement, {
                autohide: true,
                delay: 3000
            });
            toast.show();
            
            // Remove toast after it's hidden
            toastElement.addEventListener('hidden.bs.toast', function() {
                try {
                    toastContainer.removeChild(toastElement);
                } catch (e) {
                    console.warn('Error removing toast element:', e);
                }
            });
        } catch (e) {
            console.error('Error showing toast with Bootstrap:', e);
            // Fallback to manual timeout if Bootstrap Toast fails
            setTimeout(() => {
                try {
                    toastContainer.removeChild(toastElement);
                } catch (e) {
                    console.warn('Error removing toast element in fallback:', e);
                }
            }, 3000);
        }
    } catch (e) {
        // If all else fails, log to console
        console.error('Failed to show notification:', message, type, e);
    }
}

/**
 * Initialize the recommendation engine
 */
function initRecommendationEngine() {
    // Implementation depends on existing code structure
}

/**
 * Initialize Chart.js visualizations
 */
function initCharts() {
    // Will be initialized when a recommendation is generated
}

/**
 * Generate PDF report
 */
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const recommendationSection = document.getElementById('recommendationSection');
    if (!recommendationSection) {
        showNotification('No recommendation to export', 'warning');
        return;
    }
    
    // Show loading indicator
    showNotification('Generating PDF...', 'primary');
    document.body.classList.add('pdf-generating');
    
    html2canvas(recommendationSection, {
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        document.body.classList.remove('pdf-generating');
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Calculate width and height to fit on A4
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // Add the image to the PDF
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        
        // If content exceeds a page, create additional pages
        if (pdfHeight > pdf.internal.pageSize.getHeight()) {
            let heightLeft = pdfHeight;
            let position = 0;
            
            heightLeft -= pdf.internal.pageSize.getHeight();
            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
        }
        
        // Add metadata
        pdf.setProperties({
            title: 'ConPave Adviser Recommendation Report',
            subject: 'Concrete Pavement Recommendation',
            author: 'ConPave Adviser',
            keywords: 'concrete, pavement, IRC, recommendation',
            creator: 'ConPave Adviser v3.0'
        });
        
        // Save the PDF
        pdf.save('ConPave_Recommendation.pdf');
        showNotification('PDF successfully generated!', 'success');
    }).catch(error => {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF. Please try again.', 'danger');
        document.body.classList.remove('pdf-generating');
    });
}

/**
 * Get form data from user inputs
 * @returns {Object} Form data object
 */
function getFormData() {
    return {
        // Core parameters
        trafficVolume: document.getElementById('trafficVolume')?.value || '',
        designLife: document.getElementById('designLife')?.value || '',
        subgradeCBR: document.getElementById('subgradeCBR')?.value || '',
        slabThickness: document.getElementById('slabThickness')?.value || '',
        
        // Construction parameters
        longitudinalJoints: document.getElementById('longitudinalJoints')?.value || '',
        transverseJoints: document.getElementById('transverseJoints')?.value || '',
        marineEnvironment: document.getElementById('marineEnvironment')?.value || '',
        utilityLines: document.getElementById('utilityLines')?.value || '',
        manualConstruction: document.getElementById('manualConstruction')?.value || '',
        initialCost: document.getElementById('initialCost')?.value || '',
        
        // Additional parameters used in scoring system
        maintenance: document.getElementById('maintenance')?.value || '',
        constructionTime: document.getElementById('constructionTime')?.value || '',
        freezeThawCycles: document.getElementById('freezeThawCycles')?.value || '',
        
        // For fallback compatibility with older forms
        steelReinforcement: document.getElementById('steelReinforcement')?.value || '',
        notForLightTraffic: document.getElementById('notForLightTraffic')?.value || '',
        antiFrictionLayer: document.getElementById('antiFrictionLayer')?.value || '',
        edgeSupport: document.getElementById('edgeSupport')?.value || '',
        terminalSlabs: document.getElementById('terminalSlabs')?.value || '',
        specialJoints: document.getElementById('specialJoints')?.value || ''
    };
}

/**
 * Generate recommendation based on form inputs
 */
function generateRecommendation() {
    // Show loading indicator
    const loadingIndicator = document.getElementById('loadingIndicator');
    const recommendationSection = document.getElementById('recommendationSection');
    
    if (loadingIndicator) {
        loadingIndicator.classList.remove('d-none');
    }
    
    if (recommendationSection) {
        recommendationSection.classList.add('d-none');
    }
    
    // Get form data
    const formData = getFormData();
    
    // Simulate processing time (would be replaced with actual calculation)
    setTimeout(() => {
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.classList.add('d-none');
        }
        
        try {
            // Use the new scoring system to generate recommendation
            if (typeof pavementScoring === 'undefined') {
                throw new Error('Scoring module not available');
            }
            
            // Calculate scores using new system
            const result = pavementScoring.calculatePavementScores(formData);
            
            // Get detailed information about the recommended pavement type
            const pavementDetails = pavementScoring.getPavementTypeDetails(result.recommendedType, formData);
            
            // Create recommendation content
            if (recommendationSection) {
                createRecommendationContent(recommendationSection, result, pavementDetails);
                
                // Show the section
                recommendationSection.classList.remove('d-none');
                
                // Scroll to recommendation
                recommendationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Show success notification
            showNotification('Recommendation generated using IRC standards', 'success');
            
        } catch (error) {
            console.error('Error generating recommendation:', error);
            showNotification('Error in recommendation calculation', 'danger');
            
            // Show fallback recommendation
            if (recommendationSection) {
                createFallbackRecommendation(recommendationSection, formData);
                recommendationSection.classList.remove('d-none');
            }
        }
    }, 1500);
}

/**
 * Create recommendation content with the results from scoring system
 */
function createRecommendationContent(container, result, details) {
    // Clear existing content
    container.innerHTML = '';
    
    // Get the form data to pass to the explanation generator
    const formData = getFormData();
    
    // Generate recommendation explanation with probabilities
    const explanation = pavementScoring.generateRecommendationExplanation(result, formData);
    
    // Add header with print and export buttons
    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-4';
    header.innerHTML = `
        <h3 class="mb-0"><i class="bi bi-check-circle-fill text-success me-2"></i>Recommendation</h3>
        <div>
            <button class="btn btn-sm btn-outline-primary me-2" onclick="window.print()">
                <i class="bi bi-printer me-1"></i>Print Report
            </button>
            <button class="btn btn-sm btn-outline-secondary" onclick="generatePDF()">
                <i class="bi bi-file-earmark-pdf me-1"></i>Export PDF
            </button>
        </div>
    `;
    container.appendChild(header);
    
    // Add probability information
    const probabilitySection = document.createElement('div');
    probabilitySection.className = 'card mb-4 border-0 shadow-sm';
    probabilitySection.innerHTML = `
        <div class="card-header bg-light">
            <h5 class="mb-0"><i class="bi bi-graph-up me-2"></i>Recommendation Analysis</h5>
        </div>
        <div class="card-body">
            <p class="alert alert-info">
                ${explanation.mainExplanation}
            </p>
            <div class="row">
                <div class="col-md-12">
                    <h6 class="mb-3">Pavement Type Suitability Analysis</h6>
                    ${explanation.probabilityBars}
                    ${explanation.alternativeRecommendation ? 
                        `<div class="alert alert-secondary mt-2">${explanation.alternativeRecommendation}</div>` : ''}
                </div>
            </div>
        </div>
    `;
    container.appendChild(probabilitySection);
    
    // Add recommendation title and confidence
    const titleSection = document.createElement('div');
    titleSection.className = 'mb-4';
    titleSection.innerHTML = `
        <div class="alert alert-success d-flex">
            <div class="flex-shrink-0">
                <i class="bi bi-check-circle-fill fs-1 me-3"></i>
            </div>
            <div>
                <h4 class="alert-heading">${details.name}</h4>
                <p>${details.description}</p>
                <div class="mt-2 d-flex align-items-center">
                    <span class="badge bg-${getConfidenceBadgeColor(result.confidenceLevel)} me-2">
                        ${result.confidenceLevel} Confidence
                    </span>
                    <span class="small text-muted">
                        Score: ${result.highestScore}/100 · IRC Design Reliability: ${result.reliability}%
                    </span>
                </div>
            </div>
        </div>
    `;
    container.appendChild(titleSection);
    
    // Add summary cards
    const summarySection = document.createElement('div');
    summarySection.className = 'row g-3 mb-4';
    summarySection.innerHTML = `
        <div class="col-md-3">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body text-center">
                    <h6 class="text-muted mb-2">Slab Thickness</h6>
                    <div class="display-6 fw-bold text-primary">${details.thickness.split(' ')[0]}</div>
                    <div class="small">IRC:58-2015</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body text-center">
                    <h6 class="text-muted mb-2">Steel Requirement</h6>
                    <div class="display-6 fw-bold text-primary">${details.reinforcement.split(' ')[0]}</div>
                    <div class="small">IRC:118-2015</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body text-center">
                    <h6 class="text-muted mb-2">Joint Spacing</h6>
                    <div class="display-6 fw-bold text-primary">${details.jointSpacing.split(' ')[0]}</div>
                    <div class="small">IRC:SP:62-2014</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body text-center">
                    <h6 class="text-muted mb-2">Design Life</h6>
                    <div class="display-6 fw-bold text-primary">${details.designLife.split(' ')[0]}</div>
                    <div class="small">IRC:SP:140-2024</div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(summarySection);
    
    // Add comparative scores
    const scoresSection = document.createElement('div');
    scoresSection.className = 'card mb-4 border-0 shadow-sm';
    scoresSection.innerHTML = `
        <div class="card-header bg-light">
            <h5 class="mb-0">Comparative Analysis</h5>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <p class="text-muted">Comparative scoring of all pavement types based on your inputs:</p>
                    <div class="progress-stacked mb-4">
                        <div class="progress" style="width: ${result.scores.JPCP}%; height: 20px;">
                            <div class="progress-bar bg-primary" style="width: 100%">JPCP: ${result.scores.JPCP}</div>
                        </div>
                    </div>
                    <div class="progress-stacked mb-4">
                        <div class="progress" style="width: ${result.scores.JRCP}%; height: 20px;">
                            <div class="progress-bar bg-info" style="width: 100%">JRCP: ${result.scores.JRCP}</div>
                        </div>
                    </div>
                    <div class="progress-stacked mb-4">
                        <div class="progress" style="width: ${result.scores.CRCP}%; height: 20px;">
                            <div class="progress-bar bg-success" style="width: 100%">CRCP: ${result.scores.CRCP}</div>
                        </div>
                    </div>
                    <div class="progress-stacked mb-4">
                        <div class="progress" style="width: ${result.scores.PCP}%; height: 20px;">
                            <div class="progress-bar bg-warning" style="width: 100%">PCP: ${result.scores.PCP}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div style="height: 250px;">
                        <canvas id="scoreComparisonChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(scoresSection);
    
    // Add recommended details section with tabs
    const detailsSection = document.createElement('div');
    detailsSection.className = 'card mb-4 border-0 shadow-sm';
    detailsSection.innerHTML = `
        <div class="card-header bg-light">
            <ul class="nav nav-tabs card-header-tabs" id="detailTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="specs-tab" data-bs-toggle="tab" data-bs-target="#specs" type="button" role="tab" aria-controls="specs" aria-selected="true">
                        <i class="bi bi-card-checklist me-1"></i>Specifications
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="costs-tab" data-bs-toggle="tab" data-bs-target="#costs" type="button" role="tab" aria-controls="costs" aria-selected="false">
                        <i class="bi bi-currency-rupee me-1"></i>Cost Analysis
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="advantages-tab" data-bs-toggle="tab" data-bs-target="#advantages" type="button" role="tab" aria-controls="advantages" aria-selected="false">
                        <i class="bi bi-check2-circle me-1"></i>Pros & Cons
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="special-tab" data-bs-toggle="tab" data-bs-target="#special" type="button" role="tab" aria-controls="special" aria-selected="false">
                        <i class="bi bi-exclamation-diamond me-1"></i>Special Considerations
                    </button>
                </li>
            </ul>
        </div>
        <div class="card-body">
            <div class="tab-content" id="detailTabContent">
                <div class="tab-pane fade show active" id="specs" role="tabpanel" aria-labelledby="specs-tab">
                    <div class="row">
                        <div class="col-md-6">
                            <h5>Technical Specifications</h5>
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <th scope="row">Thickness:</th>
                                        <td>${details.thickness}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Reinforcement:</th>
                                        <td>${details.reinforcement}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Joint Spacing:</th>
                                        <td>${details.jointSpacing}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Design Life:</th>
                                        <td>${details.designLife}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Maintenance Interval:</th>
                                        <td>${details.maintenanceInterval}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">IRC Reference:</th>
                                        <td>${details.ircReference}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <h5>Design Reliability</h5>
                            <div class="progress mb-3" style="height: 30px;">
                                <div class="progress-bar bg-success" role="progressbar" style="width: ${result.reliability}%;" aria-valuenow="${result.reliability}" aria-valuemin="0" aria-valuemax="100">
                                    ${result.reliability}% Reliability
                                </div>
                            </div>
                            <div class="card bg-light p-3 mt-3">
                                <div class="card-body">
                                    <h6>What is Design Reliability?</h6>
                                    <p class="small mb-0">Design reliability represents the probability that the pavement will perform satisfactorily over its design period. Higher traffic volumes and longer design periods require higher reliability levels per IRC and AASHTO guidelines.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="costs" role="tabpanel" aria-labelledby="costs-tab">
                    <div class="row">
                        <div class="col-md-6">
                            <h5>Lifecycle Cost Analysis</h5>
                            <div style="height: 250px;">
                                <canvas id="costBreakdownChart"></canvas>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h5>Cost Comparison</h5>
                            <div style="height: 250px;">
                                <canvas id="lifecycleCostChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="advantages" role="tabpanel" aria-labelledby="advantages-tab">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card bg-light mb-3">
                                <div class="card-header bg-success text-white">
                                    <i class="bi bi-plus-circle me-2"></i>Advantages
                                </div>
                                <div class="card-body">
                                    <ul class="list-group list-group-flush">
                                        ${details.advantages.map(adv => `<li class="list-group-item bg-transparent"><i class="bi bi-check-circle-fill text-success me-2"></i>${adv}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card bg-light mb-3">
                                <div class="card-header bg-danger text-white">
                                    <i class="bi bi-dash-circle me-2"></i>Disadvantages
                                </div>
                                <div class="card-body">
                                    <ul class="list-group list-group-flush">
                                        ${details.disadvantages.map(disadv => `<li class="list-group-item bg-transparent"><i class="bi bi-exclamation-circle-fill text-danger me-2"></i>${disadv}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="special" role="tabpanel" aria-labelledby="special-tab">
                    <h5>Special Considerations</h5>
                    ${details.specialConsiderations.length > 0 ? 
                        `<div class="alert alert-info">
                            <ul class="mb-0">
                                ${details.specialConsiderations.map(note => `<li>${note}</li>`).join('')}
                            </ul>
                        </div>` : 
                        `<div class="alert alert-secondary">No special considerations needed for this pavement type with your input parameters.</div>`
                    }
                    
                    <div class="card bg-light mt-3">
                        <div class="card-body">
                            <h6><i class="bi bi-lightbulb me-2 text-warning"></i>Note on IRC Standards</h6>
                            <p class="small mb-0">These recommendations are based on IRC guidelines. Always consult the latest IRC documents and consider local conditions before finalizing design decisions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(detailsSection);
    
    // Initialize tabs
    const tabElements = document.querySelectorAll('#detailTabs [data-bs-toggle="tab"]');
    tabElements.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            const tabTrigger = new bootstrap.Tab(tab);
            tabTrigger.show();
        });
    });
    
    // Initialize score comparison chart
    setTimeout(() => {
        createScoreComparisonChart(result.scores);
        updateCharts();
    }, 100);
}

/**
 * Create score comparison chart
 */
function createScoreComparisonChart(scores) {
    try {
        // Check if Chart is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not available');
            return;
        }
        
        const ctx = document.getElementById('scoreComparisonChart');
        if (!ctx) return;
        
        // Get existing chart instance and destroy if it exists
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['JPCP', 'JRCP', 'CRCP', 'PCP'],
                datasets: [{
                    label: 'Pavement Score',
                    data: [scores.JPCP, scores.JRCP, scores.CRCP, scores.PCP],
                    fill: true,
                    backgroundColor: 'rgba(42, 108, 194, 0.2)',
                    borderColor: 'rgb(42, 108, 194)',
                    pointBackgroundColor: 'rgb(42, 108, 194)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(42, 108, 194)'
                }]
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating score comparison chart:', error);
    }
}

/**
 * Get badge color based on confidence level
 */
function getConfidenceBadgeColor(confidenceLevel) {
    switch (confidenceLevel) {
        case 'Very High':
            return 'success';
        case 'High':
            return 'primary';
        case 'Moderate':
            return 'info';
        case 'Low':
            return 'warning';
        case 'Very Low':
            return 'danger';
        default:
            return 'secondary';
    }
}

/**
 * Create a fallback recommendation if the scoring system fails
 */
function createFallbackRecommendation(container, formData) {
    // Simple fallback recommendation
    container.innerHTML = `
        <div class="alert alert-warning mb-4">
            <h4 class="alert-heading"><i class="bi bi-exclamation-triangle me-2"></i>Fallback Recommendation</h4>
            <p>We encountered an issue with the advanced scoring system. Here's a basic recommendation:</p>
        </div>
        
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Jointed Plain Concrete Pavement (JPCP)</h5>
                <p class="card-text">Based on your inputs, JPCP is likely the most suitable option as it works well across a wide range of conditions.</p>
                <p class="card-text">Please retry your query or contact support if this issue persists.</p>
            </div>
        </div>
    `;
}

/**
 * Update charts with the latest data
 */
function updateCharts() {
    try {
        // Check if Chart is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not available');
            return;
        }
        
        // Cost breakdown chart
        const costBreakdownCtx = document.getElementById('costBreakdownChart');
        if (costBreakdownCtx) {
            try {
                // Get existing chart instance and destroy if it exists
                const existingChart = Chart.getChart(costBreakdownCtx);
                if (existingChart) {
                    existingChart.destroy();
                }
                
                new Chart(costBreakdownCtx, {
                    type: 'pie',
                    data: {
                        labels: ['Initial Construction', 'Maintenance', 'Rehabilitation'],
                        datasets: [{
                            data: [65, 25, 10],
                            backgroundColor: ['#2a6cc2', '#0d98ba', '#5ac0de'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                            title: {
                                display: true,
                                text: 'Lifecycle Cost Breakdown'
                            }
                        }
                    }
                });
                console.log('Cost breakdown chart created');
            } catch (error) {
                console.error('Error creating cost breakdown chart:', error);
            }
        } else {
            console.warn('Cost breakdown chart element not found');
        }
        
        // Lifecycle cost comparison chart
        const lifecycleCostCtx = document.getElementById('lifecycleCostChart');
        if (lifecycleCostCtx) {
            try {
                // Get existing chart instance and destroy if it exists
                const existingChart = Chart.getChart(lifecycleCostCtx);
                if (existingChart) {
                    existingChart.destroy();
                }
                
                new Chart(lifecycleCostCtx, {
                    type: 'bar',
                    data: {
                        labels: ['JPCP', 'JRCP', 'CRCP', 'PCP'],
                        datasets: [{
                            label: '40-Year Lifecycle Cost (Lakhs ₹/km)',
                            data: [120, 135, 180, 95],
                            backgroundColor: [
                                'rgba(42, 108, 194, 0.7)',
                                'rgba(13, 152, 186, 0.7)',
                                'rgba(90, 192, 222, 0.7)',
                                'rgba(233, 146, 15, 0.7)'
                            ],
                            borderColor: [
                                'rgb(42, 108, 194)',
                                'rgb(13, 152, 186)',
                                'rgb(90, 192, 222)', 
                                'rgb(233, 146, 15)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Lifecycle Cost Comparison'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Cost (Lakhs ₹/km)'
                                }
                            }
                        }
                    }
                });
                console.log('Lifecycle cost chart created');
            } catch (error) {
                console.error('Error creating lifecycle cost chart:', error);
            }
        } else {
            console.warn('Lifecycle cost chart element not found');
        }
    } catch (error) {
        console.error('Error in updateCharts function:', error);
    }
}

/**
 * Initialize the reference table toggle functionality
 */
function initReferenceTableToggle() {
    // Get the toggle button and the reference table
    const toggleReferenceBtn = document.getElementById('toggleReferenceBtn');
    const referenceTable = document.querySelector('.reference-section .table-responsive');
    
    if (!toggleReferenceBtn || !referenceTable) {
        console.error('Reference table elements not found');
        return;
    }
    
    // Ensure initial state is correct
    referenceTable.style.display = 'none';
    toggleReferenceBtn.innerHTML = '<i class="bi bi-eye me-2"></i>Show Reference Table';
    
    // Set up the toggle button event listener
    toggleReferenceBtn.addEventListener('click', function(e) {
        // Prevent default behavior
        e.preventDefault();
        
        try {
            // Get the current display state
            const currentDisplay = window.getComputedStyle(referenceTable).display;
            const isVisible = currentDisplay !== 'none';
            
            // Toggle visibility
            referenceTable.style.display = isVisible ? 'none' : 'block';
            
            // Update button text
            toggleReferenceBtn.innerHTML = isVisible
                ? '<i class="bi bi-eye me-2"></i>Show Reference Table'
                : '<i class="bi bi-eye-slash me-2"></i>Hide Reference Table';
            
            // If showing the table, scroll to it
            if (!isVisible) {
                setTimeout(() => {
                    referenceTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
            
            // Show a notification
            showNotification(
                isVisible ? 'Reference table hidden' : 'Reference table displayed', 
                'info'
            );
            
            // Log for debugging
            console.log('Toggle reference table. Is visible:', !isVisible);
        } catch (error) {
            console.error('Error toggling reference table:', error);
            showNotification('Error toggling reference table', 'danger');
        }
    });
    
    // Log for debugging
    console.log('Reference table toggle initialized');
}

// Expose functions to window for HTML event handling
window.generatePDF = generatePDF;
window.updateCharts = updateCharts;
window.generateRecommendation = generateRecommendation;
window.showNotification = showNotification; 