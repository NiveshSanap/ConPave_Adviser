/**
 * Concrete Pavement Recommendation System
 * main.js - Main application script
 */

// GitHub Pages debug and path fixer helper
(function() {
    // Check if debug mode is enabled via URL parameter or if we're on GitHub Pages
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.has('debug');
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    // Helper function to ensure all required scripts are loaded
    function ensureScriptsAreLoaded() {
        const requiredObjects = [
            'pavementRecommendations',
            'pavementTrainingSystem',
            'probabilityCalculator',
            'probabilityDisplay'
        ];
        
        // Check if any of the required objects are missing
        const missingObjects = requiredObjects.filter(obj => window[obj] === undefined);
        
        if (missingObjects.length > 0) {
            console.warn(`Missing required objects: ${missingObjects.join(', ')}`);
            
            // Get the repository name from the URL for GitHub Pages
            let basePath = './';
            if (isGitHubPages) {
                const pathParts = window.location.pathname.split('/');
                // If we have at least 2 parts (e.g., /repo-name/index.html)
                if (pathParts.length >= 2) {
                    const repoName = pathParts[1]; // The first segment after the domain
                    basePath = `/${repoName}/`;
                }
            }
            
            // List of critical scripts
            const criticalScripts = [
                'scoring.js',
                'recommendations.js',
                'training.js',
                'main.js',
                'probability_calculator.js',
                'probability_display.js'
            ];
            
            // Load scripts sequentially
            function loadNextScript(index) {
                if (index >= criticalScripts.length) {
                    console.log('All critical scripts attempted to load');
                    return;
                }
                
                const scriptSrc = `${basePath}assets/js/${criticalScripts[index]}`;
                console.log(`Loading script: ${scriptSrc}`);
                
                const script = document.createElement('script');
                script.src = scriptSrc;
                script.onload = () => {
                    console.log(`Successfully loaded: ${scriptSrc}`);
                    loadNextScript(index + 1);
                };
                script.onerror = () => {
                    console.error(`Failed to load: ${scriptSrc}`);
                    
                    // Try alternative path as fallback
                    const altScript = document.createElement('script');
                    altScript.src = `./assets/js/${criticalScripts[index]}`;
                    console.log(`Trying alternative path: ${altScript.src}`);
                    altScript.onload = () => loadNextScript(index + 1);
                    altScript.onerror = () => loadNextScript(index + 1); // Continue to next script even if this fails
                    document.head.appendChild(altScript);
                };
                
                document.head.appendChild(script);
            }
            
            // Start loading scripts
            loadNextScript(0);
            
            return true; // Indicates we had to fix missing scripts
        }
        
        return false; // All scripts are loaded
    }
    
    // If we're on GitHub Pages or in debug mode, ensure scripts are loaded
    if (isGitHubPages || debugMode) {
        // Try to load scripts after a short delay
        setTimeout(() => {
            const hadToFix = ensureScriptsAreLoaded();
            
            // If we're in debug mode, show the debug panel
            if (debugMode) {
                console.log('Debug mode activated');
                createDebugPanel(hadToFix);
            }
        }, 1000);
    }
    
    function createDebugPanel(hadToFix) {
        const debugPanel = document.createElement('div');
        debugPanel.style.position = 'fixed';
        debugPanel.style.bottom = '10px';
        debugPanel.style.left = '10px';
        debugPanel.style.padding = '10px';
        debugPanel.style.background = 'rgba(0,0,0,0.8)';
        debugPanel.style.color = 'white';
        debugPanel.style.zIndex = '9999';
        debugPanel.style.borderRadius = '5px';
        debugPanel.style.maxHeight = '200px';
        debugPanel.style.overflowY = 'auto';
        debugPanel.style.width = '400px';
        debugPanel.style.fontSize = '12px';
        debugPanel.style.fontFamily = 'monospace';
        
        // Debug information
        const info = [
            `Host: ${window.location.hostname}`,
            `Path: ${window.location.pathname}`,
            `GitHub Pages: ${isGitHubPages ? 'Yes' : 'No'}`,
            `User Agent: ${navigator.userAgent}`,
            `Scripts Loaded: ${document.scripts.length}`,
            `Had to fix scripts: ${hadToFix ? 'Yes' : 'No'}`,
            'Required Objects:'
        ];
        
        // Check important objects
        setTimeout(() => {
            const objects = {
                'pavementRecommendations': window.pavementRecommendations !== undefined,
                'pavementTrainingSystem': window.pavementTrainingSystem !== undefined,
                'probabilityCalculator': window.probabilityCalculator !== undefined,
                'probabilityDisplay': window.probabilityDisplay !== undefined
            };
            
            Object.entries(objects).forEach(([name, exists]) => {
                info.push(`  - ${name}: ${exists ? '✅' : '❌'}`);
            });
            
            debugPanel.innerHTML = info.join('<br>');
            
            // Add fix button if any required object is missing
            if (Object.values(objects).some(v => !v)) {
                const fixButton = document.createElement('button');
                fixButton.innerText = 'Attempt Fix';
                fixButton.style.marginTop = '10px';
                fixButton.style.padding = '5px 10px';
                fixButton.onclick = function() {
                    location.reload();
                };
                debugPanel.appendChild(document.createElement('br'));
                debugPanel.appendChild(fixButton);
            } else {
                const successMsg = document.createElement('div');
                successMsg.style.color = '#4CAF50';
                successMsg.style.marginTop = '10px';
                successMsg.innerHTML = 'All scripts loaded successfully!';
                debugPanel.appendChild(successMsg);
            }
        }, 1500);
        
        document.body.appendChild(debugPanel);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
    // Add Chart.js to the page
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(chartScript);
    
    // Get references to form and result elements
    const pavementForm = document.getElementById('pavementForm');
    const resultSection = document.getElementById('resultSection');
    const recommendationTitle = document.getElementById('recommendationTitle');
    const recommendationDetails = document.getElementById('recommendationDetails');
    
    if (!pavementForm || !resultSection || !recommendationTitle || !recommendationDetails) {
        console.error('Required elements not found');
        return;
    }
    
    // Set initial valid state for all selected options
    document.querySelectorAll('select option:checked').forEach(option => {
        if (option.value) {
            option.closest('select').classList.add('is-valid');
        }
    });
    
    // Make form fields optional and add change listeners
    document.querySelectorAll('#pavementForm select').forEach(select => {
        select.removeAttribute('required');
        select.addEventListener('change', function() {
            if (this.value) {
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
            updateFormProgress();
        });
    });
    
    // Initialize progress bar
    updateFormProgress();
    
    // Add submit event listener to the form
    pavementForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Show loading indicator
        showLoading();
        
        try {
            // Get form values
            const formData = collectFormData();
            
            // Generate recommendation
            setTimeout(function() {
                try {
                    if (typeof pavementRecommendations === 'undefined') {
                        throw new Error('pavementRecommendations object is not defined');
                    }
                    
                    const result = pavementRecommendations.generateRecommendation(formData);
                    
                    // Hide loading indicator
                    hideLoading();
                    
                    // Display results
                    displayRecommendation(result);
                } catch (error) {
                    console.error('Error generating recommendation:', error);
                    hideLoading();
                    alert('An error occurred while generating the recommendation. Please try again.');
                }
            }, 800);
        } catch (error) {
            console.error('Error collecting form data:', error);
            hideLoading();
            alert('An error occurred while processing the form. Please try again.');
        }
    });
    
    // Function to collect form data
    function collectFormData() {
        return {
            trafficVolume: document.getElementById('trafficVolume').value,
            designLife: document.getElementById('designLife').value,
            subgradeCBR: document.getElementById('subgradeCBR').value,
            slabThickness: document.getElementById('slabThickness').value,
            longitudinalJoints: document.getElementById('longitudinalJoints').value,
            marineEnvironment: document.getElementById('marineEnvironment').value,
            utilityLines: document.getElementById('utilityLines').value,
            manualConstruction: document.getElementById('manualConstruction').value,
            initialCost: document.getElementById('initialCost').value
        };
    }

    // Function to show loading state
    function showLoading() {
        const submitBtn = pavementForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
        submitBtn.disabled = true;
        
        // Show loading animation in results section
        resultSection.style.display = 'block';
        document.getElementById('loadingResults').style.display = 'block';
        document.querySelector('.recommendation-card').style.display = 'none';
    }
    
    // Function to hide loading state
    function hideLoading() {
        const submitBtn = pavementForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="bi bi-lightning-fill me-2"></i>Generate IRC-Based Recommendation';
        submitBtn.disabled = false;
        
        // Hide loading animation in results section
        document.getElementById('loadingResults').style.display = 'none';
        document.querySelector('.recommendation-card').style.display = 'block';
    }

    // Function to display recommendation
    function displayRecommendation(result) {
        if (!result || !result.type || !result.recommendations) {
            console.error('Invalid recommendation result:', result);
            alert('Error: Invalid recommendation data. Please try again.');
            return;
        }
        
        recommendationTitle.textContent = result.type.name;
        recommendationDetails.innerHTML = '';
        
        // Add confidence indicator
        const confidenceIndicator = document.createElement('div');
        confidenceIndicator.className = `alert ${getConfidenceAlertClass(result.confidenceLevel)} mb-3`;
        confidenceIndicator.innerHTML = `
            <div class="d-flex align-items-center">
                ${getConfidenceIcon(result.confidenceLevel)}
                <div class="ms-2">
                    <strong>Recommendation Confidence: ${result.confidenceLevel}</strong>
                    <div class="small">${result.filledParameterCount ? result.filledParameterCount : '9'}/9 parameters provided</div>
                    ${result.usedTrainedModel ? '<div class="small text-success"><i class="bi bi-graph-up"></i> Using trained ML model v' + result.modelVersion + '</div>' : ''}
                </div>
            </div>
        `;
        recommendationDetails.appendChild(confidenceIndicator);
        
        // Add recommendation summary
        const summaryElement = document.createElement('div');
        summaryElement.className = 'recommendation-summary';
        
        // Add description
        const descriptionElement = document.createElement('p');
        descriptionElement.className = 'mb-2';
        descriptionElement.textContent = result.type.description;
        
        // Add key specs in summary
        const keySpecsElement = document.createElement('div');
        keySpecsElement.className = 'row row-cols-2 g-2 mt-2 recommendation-detail';
        keySpecsElement.innerHTML = `
            <div class="col">
                <strong><i class="bi bi-rulers me-1"></i>Thickness:</strong> 
                <span class="badge bg-primary">${result.recommendations.thickness.split('(')[0].trim()}</span>
            </div>
            <div class="col">
                <strong><i class="bi bi-grid-3x3 me-1"></i>Steel:</strong> 
                ${result.recommendations.reinforcement.includes('None') ? 
                  '<span class="badge bg-secondary">None</span>' : 
                  '<span class="badge bg-info">Required</span>'}
            </div>
            <div class="col">
                <strong><i class="bi bi-distribute-horizontal me-1"></i>Joints:</strong> 
                ${result.recommendations.jointSpacing.includes('No') ? 
                  '<span class="badge bg-secondary">None</span>' : 
                  '<span class="badge bg-info">Required</span>'}
            </div>
            <div class="col">
                <strong><i class="bi bi-graph-up me-1"></i>IRC:</strong> 
                <span class="badge ${result.additionalParams?.ircCompliance >= 80 ? 'bg-success' : 'bg-warning'}">${result.additionalParams?.ircCompliance || 85}%</span>
            </div>
        `;
        
        summaryElement.appendChild(descriptionElement);
        summaryElement.appendChild(keySpecsElement);
        recommendationDetails.appendChild(summaryElement);
        
        // Create accordion for expandable sections
        const accordion = document.createElement('div');
        accordion.className = 'accordion mb-3';
        accordion.id = 'recommendationAccordion';
        recommendationDetails.appendChild(accordion);
        
        // Add key recommendations section
        addAccordionItem(
            accordion,
            'keyRecommendations',
            'Key Recommendations',
            'bi-star-fill',
            true,
            () => {
                const content = document.createElement('div');
        
        // Add specific recommendations
        const specsList = document.createElement('ul');
                specsList.className = 'list-group mb-0';
        
        const thicknessItem = document.createElement('li');
        thicknessItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        thicknessItem.innerHTML = '<strong>Recommended Thickness:</strong> <span class="badge bg-primary rounded-pill">' + result.recommendations.thickness + '</span>';
        specsList.appendChild(thicknessItem);
        
        const reinforcementItem = document.createElement('li');
        reinforcementItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        reinforcementItem.innerHTML = '<strong>Reinforcement:</strong> <span>' + result.recommendations.reinforcement + '</span>';
        specsList.appendChild(reinforcementItem);
        
        const jointSpacingItem = document.createElement('li');
        jointSpacingItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        jointSpacingItem.innerHTML = '<strong>Joint Spacing:</strong> <span>' + result.recommendations.jointSpacing + '</span>';
        specsList.appendChild(jointSpacingItem);
        
                content.appendChild(specsList);
                
                // Add special considerations if available
                if (result.recommendations.specialConsiderations && result.recommendations.specialConsiderations.length > 0) {
                    const specialConsDiv = document.createElement('div');
                    specialConsDiv.className = 'alert alert-info mt-3';
                    specialConsDiv.innerHTML = '<strong><i class="bi bi-info-circle-fill me-2"></i>Special IRC Considerations:</strong><ul class="mb-0 mt-2">';
                    
                    result.recommendations.specialConsiderations.forEach(cons => {
                        specialConsDiv.innerHTML += `<li>${cons}</li>`;
                    });
                    
                    specialConsDiv.innerHTML += '</ul>';
                    content.appendChild(specialConsDiv);
                }
                
                return content;
            }
        );
        
        // Add Environmental Considerations section
        addAccordionItem(
            accordion,
            'environmentalConsiderations',
            'Environmental Considerations',
            'bi-tree',
            false,
            () => {
                const content = document.createElement('div');
                
                // Add IRC-based environmental guidance
                const envGuidanceDiv = document.createElement('div');
                envGuidanceDiv.className = 'alert alert-primary mb-3';
                envGuidanceDiv.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-info-circle-fill fs-4 me-2"></i>
                        <div>
                            <strong>IRC-Based Environmental Guidance</strong>
                            <div class="small">Based on Indian Roads Congress specifications</div>
                        </div>
                    </div>
                `;
                content.appendChild(envGuidanceDiv);
                
                // Create the environmental factors list
                const envFactorsList = document.createElement('ul');
                envFactorsList.className = 'list-group mb-3';
                
                // Marine environment
                const marineItem = document.createElement('li');
                marineItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                let marineStatus = result.type.marineEnvironment || 'Not specified';
                let marineClass = 'bg-success';
                
                if (marineStatus.includes('Avoid')) {
                    marineClass = 'bg-danger';
                }
                
                marineItem.innerHTML = `
                    <div>
                        <strong>Marine/Corrosive Environment:</strong>
                        <div class="small text-muted">Projects in coastal or chemically corrosive areas</div>
                    </div>
                    <span class="badge ${marineClass}">${marineStatus}</span>
                `;
                envFactorsList.appendChild(marineItem);
                
                // Utility lines
                const utilityItem = document.createElement('li');
                utilityItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                let utilityStatus = result.type.utilityLines || 'Not specified';
                let utilityClass = 'bg-success';
                
                if (utilityStatus.includes('Avoid')) {
                    utilityClass = 'bg-danger';
                }
                
                utilityItem.innerHTML = `
                    <div>
                        <strong>Underground Utility Lines:</strong>
                        <div class="small text-muted">Projects with utilities under pavement</div>
                    </div>
                    <span class="badge ${utilityClass}">${utilityStatus}</span>
                `;
                envFactorsList.appendChild(utilityItem);
                
                // Manual construction
                const constructionItem = document.createElement('li');
                constructionItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                let constructionStatus = result.type.manualConstruction || 'Not specified';
                let constructionClass = 'bg-success';
                
                if (constructionStatus.includes('Avoid')) {
                    constructionClass = 'bg-danger';
                }
                
                constructionItem.innerHTML = `
                    <div>
                        <strong>Manual Construction:</strong>
                        <div class="small text-muted">Projects with limited mechanization</div>
                    </div>
                    <span class="badge ${constructionClass}">${constructionStatus}</span>
                `;
                envFactorsList.appendChild(constructionItem);
                
                content.appendChild(envFactorsList);
                
                // Add IRC reference for environmental factors
                const ircRefDiv = document.createElement('div');
                ircRefDiv.className = 'card mb-3';
                ircRefDiv.innerHTML = `
                    <div class="card-header bg-light py-2">
                        <strong><i class="bi bi-book me-1"></i>IRC Environmental Standards Reference</strong>
                    </div>
                    <div class="card-body p-3">
                        <table class="table table-sm table-striped mb-0">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>IRC Code</th>
                                    <th>Section</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Marine Environment</td>
                                    <td>IRC:118-2015</td>
                                    <td>3.2(i)/p.5</td>
                                </tr>
                                <tr>
                                    <td>Utility Lines</td>
                                    <td>IRC:118-2015</td>
                                    <td>3.2(ii)/p.5</td>
                                </tr>
                                <tr>
                                    <td>Manual Construction</td>
                                    <td>IRC:118-2015</td>
                                    <td>3.2(iv)/p.5</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                content.appendChild(ircRefDiv);
                
                // Add any environment-specific warnings
                if (result.specialNotes && result.specialNotes.filter(note => 
                    note.includes('environment') || 
                    note.includes('marine') || 
                    note.includes('utility') || 
                    note.includes('construction')
                ).length > 0) {
                    const warningDiv = document.createElement('div');
                    warningDiv.className = 'alert alert-warning';
                    warningDiv.innerHTML = '<strong><i class="bi bi-exclamation-triangle-fill me-2"></i>Environmental Warnings:</strong><ul class="mb-0 mt-2">';
                    
                    result.specialNotes.filter(note => 
                        note.includes('environment') || 
                        note.includes('marine') || 
                        note.includes('utility') || 
                        note.includes('construction')
                    ).forEach(note => {
                        warningDiv.innerHTML += `<li>${note}</li>`;
                    });
                    
                    warningDiv.innerHTML += '</ul>';
                    content.appendChild(warningDiv);
                }
                
                return content;
            }
        );
        
        // Add Performance Metrics section if available
        if (result.usedTrainedModel && result.additionalParams) {
            addAccordionItem(
                accordion,
                'performanceMetrics',
                'Performance Metrics',
                'bi-graph-up',
                false,
                () => {
                    const content = document.createElement('div');
                    content.className = 'row g-2';
                    content.innerHTML = `
                        <div class="col-md-6">
                            <div class="card h-100">
                                <div class="card-header bg-light py-2">
                                    <strong><i class="bi bi-speedometer2 me-1"></i>Performance Metrics</strong>
                                </div>
                                <div class="card-body p-3">
                                    <div class="mb-3">
                                        <label class="form-label mb-1">Durability</label>
                                        <div class="progress">
                                            <div class="progress-bar bg-primary" role="progressbar" style="width: ${result.additionalParams.durability}%" aria-valuenow="${result.additionalParams.durability}" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div class="small text-muted mt-1">Based on IRC design life and material requirements</div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label mb-1">Cost Effectiveness</label>
                                        <div class="progress">
                                            <div class="progress-bar bg-success" role="progressbar" style="width: ${result.additionalParams.costEffectiveness}%" aria-valuenow="${result.additionalParams.costEffectiveness}" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div class="small text-muted mt-1">Considers initial cost vs. maintenance requirements</div>
                                    </div>
                                    <div>
                                        <label class="form-label mb-1">Construction Complexity</label>
                                        <div class="progress">
                                            <div class="progress-bar bg-warning" role="progressbar" style="width: ${result.additionalParams.constructionComplexity}%" aria-valuenow="${result.additionalParams.constructionComplexity}" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div class="small text-muted mt-1">Higher value indicates more complex construction</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card h-100">
                                <div class="card-header bg-light py-2">
                                    <strong><i class="bi bi-check-circle me-1"></i>IRC Compliance</strong>
                                </div>
                                <div class="card-body p-3">
                                    <div class="text-center mb-3">
                                        <div class="display-4 mb-2">${result.additionalParams.ircCompliance}%</div>
                                        <div class="progress">
                                            <div class="progress-bar ${result.additionalParams.ircCompliance >= 80 ? 'bg-success' : result.additionalParams.ircCompliance >= 60 ? 'bg-warning' : 'bg-danger'}" role="progressbar" style="width: ${result.additionalParams.ircCompliance}%" aria-valuenow="${result.additionalParams.ircCompliance}" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div class="text-muted small mt-2">Compliance with IRC standards</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="mb-1">Reference Coverage: ${result.additionalParams.ircReferenceCoverage}%</div>
                                        <div class="progress">
                                            <div class="progress-bar bg-info" role="progressbar" style="width: ${result.additionalParams.ircReferenceCoverage}%" aria-valuenow="${result.additionalParams.ircReferenceCoverage}" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div class="text-muted small mt-2">Parameter documentation in IRC</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    return content;
                }
            );
        }
        
        // Add IRC References section if available
        if (result.ircReferences && result.ircReferences.sections && result.ircReferences.sections.length > 0) {
            addAccordionItem(
                accordion,
                'ircReferences',
                'IRC Standard References',
                'bi-book',
                false,
                () => {
                    const content = document.createElement('div');
                    
                    // Add IRC main reference
                    const mainRefElement = document.createElement('div');
                    mainRefElement.className = 'alert alert-secondary';
                    mainRefElement.innerHTML = `<strong>Primary Reference:</strong> ${result.ircReferences.main}`;
                    content.appendChild(mainRefElement);
                    
                    // Add specific references
                    const refsTable = document.createElement('table');
                    refsTable.className = 'table table-sm table-striped mt-3';
                    refsTable.innerHTML = `
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Section</th>
                                <th>Page</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody id="ircRefTableBody">
                        </tbody>
                    `;
                    
                    const tableBody = refsTable.querySelector('#ircRefTableBody');
                    result.ircReferences.sections.forEach(ref => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${ref.code}</td>
                            <td>${ref.section}</td>
                            <td>${ref.page || '-'}</td>
                            <td>${ref.description}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                    
                    content.appendChild(refsTable);
                    
                    // Add IRC notes if available
                    if (result.additionalParams && result.additionalParams.ircNotes && result.additionalParams.ircNotes.length > 0) {
                        const notesDiv = document.createElement('div');
                        notesDiv.className = 'alert alert-info mt-3';
                        notesDiv.innerHTML = '<strong>Additional IRC Notes:</strong><ul class="mb-0 mt-2">';
                        
                        result.additionalParams.ircNotes.forEach(note => {
                            notesDiv.innerHTML += `<li>${note}</li>`;
                        });
                        
                        notesDiv.innerHTML += '</ul>';
                        content.appendChild(notesDiv);
                    }
                    
                    return content;
                }
            );
        }
        
        // Add Lifecycle Cost Analysis section if available
        if (result.lifecycleCost) {
            addAccordionItem(
                accordion,
                'lifecycleCost',
                'Lifecycle Cost Analysis',
                'bi-currency-rupee',
                false,
                () => {
                    const content = document.createElement('div');
                    
                    // Add cost overview
                    const costOverview = document.createElement('div');
                    costOverview.className = 'alert alert-info mb-3';
                    costOverview.innerHTML = `
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-info-circle-fill fs-4 me-2"></i>
                            <div>
                                <strong>Lifecycle Cost Overview</strong>
                                <div class="small">Based on ${result.lifecycleCost.designLife} year design life</div>
                            </div>
                        </div>
                        <div class="small text-muted mb-2">${result.lifecycleCost.note}</div>
                    `;
                    content.appendChild(costOverview);
                    
                    // Add cost breakdown
                    const costCard = document.createElement('div');
                    costCard.className = 'card mb-3';
                    costCard.innerHTML = `
                        <div class="card-header bg-light py-2">
                            <strong><i class="bi bi-cash-stack me-1"></i>Cost Breakdown (${result.lifecycleCost.unit})</strong>
                        </div>
                        <div class="card-body p-3">
                            <div class="row">
                                <div class="col-md-7">
                                    <canvas id="costChart" width="100%" height="200"></canvas>
                                </div>
                                <div class="col-md-5">
                                    <table class="table table-sm">
                                        <tbody>
                                            <tr>
                                                <th>Initial Construction:</th>
                                                <td class="text-end">${result.lifecycleCost.initialCost}</td>
                                            </tr>
                                            <tr>
                                                <th>Maintenance (${result.lifecycleCost.designLife} years):</th>
                                                <td class="text-end">${result.lifecycleCost.maintenanceCost}</td>
                                            </tr>
                                            <tr class="table-active">
                                                <th>Total Lifecycle Cost:</th>
                                                <td class="text-end fw-bold">${result.lifecycleCost.totalLifecycleCost}</td>
                                            </tr>
                                            <tr>
                                                <th>Annual Cost:</th>
                                                <td class="text-end">${result.lifecycleCost.annualCost}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `;
                    content.appendChild(costCard);
                    
                    // Add comparison with alternative if available
                    if (result.alternativeType) {
                        const comparisonDiv = document.createElement('div');
                        comparisonDiv.className = 'alert alert-secondary';
                        comparisonDiv.innerHTML = `
                            <strong><i class="bi bi-arrow-left-right me-1"></i>Cost Comparison:</strong>
                            <p class="small mb-0 mt-1">
                                ${result.type.name} typically has ${result.type.id === 'crcp' ? 'higher initial but lower lifecycle' : 
                                result.type.id === 'pcp' && result.alternativeType.id !== 'pcp' ? 'lower initial but higher maintenance' : 
                                'comparable lifecycle'} costs compared to ${result.alternativeType.name}.
                            </p>
                        `;
                        content.appendChild(comparisonDiv);
                    }
                    
                    // Set up to render chart after component is added to DOM
                    setTimeout(() => {
                        const chartElement = document.getElementById('costChart');
                        if (chartElement) {
                            const ctx = chartElement.getContext('2d');
                            new Chart(ctx, {
                                type: 'pie',
                                data: {
                                    labels: ['Initial Construction', 'Maintenance'],
                                    datasets: [{
                                        data: [result.lifecycleCost.initialCost, result.lifecycleCost.maintenanceCost],
                                        backgroundColor: ['#0d6efd', '#20c997']
                                    }]
                                },
                                options: {
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom'
                                        }
                                    }
                                }
                            });
                        }
                    }, 100);
                    
                    return content;
                }
            );
        }
        
        // Add Construction Guidelines section if available
        if (result.constructionGuidelines && result.constructionGuidelines.length > 0) {
            addAccordionItem(
                accordion,
                'constructionGuidelines',
                'IRC Construction Guidelines',
                'bi-tools',
                false,
                () => {
                    const content = document.createElement('div');
                    
                    // Add header
                    const guidelinesHeader = document.createElement('div');
                    guidelinesHeader.className = 'alert alert-primary mb-3';
                    guidelinesHeader.innerHTML = `
                        <div class="d-flex">
                            <i class="bi bi-info-circle-fill fs-4 me-2"></i>
                            <div>
                                <strong>IRC-Based Construction Guidelines</strong>
                                <p class="small mb-0">The following guidelines are based on IRC standards for ${result.type.name}</p>
                            </div>
                        </div>
                    `;
                    content.appendChild(guidelinesHeader);
                    
                    // Create tabbed interface for guidelines
                    const tabsContainer = document.createElement('div');
                    tabsContainer.innerHTML = `
                        <ul class="nav nav-tabs" id="guidelinesTabs" role="tablist">
                        </ul>
                        <div class="tab-content p-3 border border-top-0 rounded-bottom" id="guidelinesTabContent">
                        </div>
                    `;
                    content.appendChild(tabsContainer);
                    
                    const tabList = tabsContainer.querySelector('#guidelinesTabs');
                    const tabContent = tabsContainer.querySelector('#guidelinesTabContent');
                    
                    // Add tabs and content for each category
                    result.constructionGuidelines.forEach((category, index) => {
                        const tabId = `guidelines-${category.category.toLowerCase().replace(/\s+/g, '-')}`;
                        const isActive = index === 0;
                        
                        // Create tab
                        const tab = document.createElement('li');
                        tab.className = 'nav-item';
                        tab.innerHTML = `
                            <button class="nav-link ${isActive ? 'active' : ''}" 
                                   id="${tabId}-tab" 
                                   data-bs-toggle="tab" 
                                   data-bs-target="#${tabId}" 
                                   type="button" 
                                   role="tab" 
                                   aria-controls="${tabId}" 
                                   aria-selected="${isActive ? 'true' : 'false'}">
                                ${category.category}
                            </button>
                        `;
                        tabList.appendChild(tab);
                        
                        // Create content
                        const tabPane = document.createElement('div');
                        tabPane.className = `tab-pane fade ${isActive ? 'show active' : ''}`;
                        tabPane.id = tabId;
                        tabPane.setAttribute('role', 'tabpanel');
                        tabPane.setAttribute('aria-labelledby', `${tabId}-tab`);
                        
                        // Add list items
                        const list = document.createElement('ul');
                        list.className = 'list-group';
                        
                        category.items.forEach(item => {
                            const listItem = document.createElement('li');
                            listItem.className = 'list-group-item';
                            listItem.innerHTML = item;
                            list.appendChild(listItem);
                        });
                        
                        tabPane.appendChild(list);
                        tabContent.appendChild(tabPane);
                    });
                    
                    return content;
                }
            );
        }
        
        // Show result section
        resultSection.style.display = 'block';
        
        // Scroll to results if needed
        if (window.innerWidth < 992) {
        resultSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Function to get alert class based on confidence level
    function getConfidenceAlertClass(confidence) {
        switch (confidence) {
            case 'High':
                return 'alert-success';
            case 'Medium':
                return 'alert-warning';
            default:
                return 'alert-secondary';
        }
    }
    
    // Function to get confidence icon
    function getConfidenceIcon(confidence) {
        switch (confidence) {
            case 'High':
                return '<i class="bi bi-shield-check fs-4 text-success"></i>';
            case 'Medium':
                return '<i class="bi bi-shield-exclamation fs-4 text-warning"></i>';
            default:
                return '<i class="bi bi-shield fs-4 text-secondary"></i>';
        }
    }
    
    // Function to update form progress
    function updateFormProgress() {
        const totalRequiredFields = document.querySelectorAll('#pavementForm select[required]').length;
        const filledRequiredFields = document.querySelectorAll('#pavementForm select[required].is-valid').length;
        
        // Calculate percentage
        const percentage = totalRequiredFields > 0 ? (filledRequiredFields / totalRequiredFields) * 100 : 0;
        
        // Log for debugging
        console.log(`Form completion: ${filledRequiredFields}/${totalRequiredFields} (${percentage}%)`);
    }
    
    // Toggle reference table
    const toggleReferenceBtn = document.getElementById('toggleReferenceBtn');
    const referenceSection = document.querySelector('.reference-section .table-responsive');
    
    if (toggleReferenceBtn && referenceSection) {
        toggleReferenceBtn.addEventListener('click', function() {
            if (referenceSection.style.display === 'none') {
                referenceSection.style.display = 'block';
                this.innerHTML = '<i class="bi bi-eye-slash me-2"></i>Hide Reference Table';
            } else {
                referenceSection.style.display = 'none';
                this.innerHTML = '<i class="bi bi-eye me-2"></i>Show Reference Table';
            }
        });
    }
    
    // Function to get a list of critical parameters for a given pavement type
    function getCriticalParameters(pavementType) {
        const commonParams = [
            'trafficVolume',
            'designLife',
            'subgradeCBR',
            'slabThickness'
        ];
        
        const typeSpecificParams = {
            jpcp: [
                'longitudinalJoints',
                'transverseJoints',
                'maintenance'
            ],
            jrcp: [
                'longitudinalJoints',
                'transverseJoints',
                'longitudinalSteel',
                'maintenance'
            ],
            crcp: [
                'longitudinalSteel',
                'crackSpacing',
                'terminalSlabs',
                'marineEnvironment',
                'utilityLines',
                'manualConstruction'
            ],
            pcp: [
                'maintenance',
                'initialCost',
                'manualConstruction'
            ]
        };
        
        return [...commonParams, ...(typeSpecificParams[pavementType] || [])];
    }
    
    // Helper function to add accordion items
    function addAccordionItem(accordion, id, title, iconClass, expanded, contentGenerator) {
        const item = document.createElement('div');
        item.className = 'accordion-item';
        
        const header = document.createElement('h2');
        header.className = 'accordion-header';
        header.id = `heading${id}`;
        
        const button = document.createElement('button');
        button.className = `accordion-button ${expanded ? '' : 'collapsed'}`;
        button.type = 'button';
        button.setAttribute('data-bs-toggle', 'collapse');
        button.setAttribute('data-bs-target', `#collapse${id}`);
        button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        button.setAttribute('aria-controls', `collapse${id}`);
        button.innerHTML = `<i class="bi ${iconClass} me-2"></i> ${title}`;
        
        header.appendChild(button);
        item.appendChild(header);
        
        const collapseDiv = document.createElement('div');
        collapseDiv.id = `collapse${id}`;
        collapseDiv.className = `accordion-collapse collapse ${expanded ? 'show' : ''}`;
        collapseDiv.setAttribute('aria-labelledby', `heading${id}`);
        collapseDiv.setAttribute('data-bs-parent', `#recommendationAccordion`);
        
        const body = document.createElement('div');
        body.className = 'accordion-body';
        
        // Generate content
        body.appendChild(contentGenerator());
        
        collapseDiv.appendChild(body);
        item.appendChild(collapseDiv);
        
        accordion.appendChild(item);
    }
}); 