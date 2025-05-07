/**
 * ConPave Adviser Emergency Path Fixer
 * This script fixes path issues when deployed on GitHub Pages
 */

(function() {
    // Check if we're running on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
        console.log('Path-fixer: Running on GitHub Pages - checking for script loading issues');
        
        // Wait for DOMContentLoaded to ensure we can append scripts
        window.addEventListener('DOMContentLoaded', function() {
            // Get the repository name from the URL path
            const pathSegments = window.location.pathname.split('/');
            const repoName = pathSegments[1]; // The first segment after the domain
            const basePath = `/${repoName}/`;
            
            // Check if required JS files are loaded properly
            setTimeout(function() {
                const requiredObjects = [
                    'pavementRecommendations',
                    'pavementTrainingSystem'
                ];
                
                // Check if any objects are missing
                const missingObjects = requiredObjects.filter(obj => window[obj] === undefined);
                
                if (missingObjects.length > 0) {
                    console.warn(`Path-fixer: Missing required objects: ${missingObjects.join(', ')}`);
                    
                    // The order is important for dependencies
                    const requiredScripts = [
                        'scoring.js',
                        'recommendations.js',
                        'training.js',
                        'main.js'
                    ];
                    
                    // Force reload the scripts with correct paths
                    requiredScripts.forEach(function(script, index) {
                        const scriptElement = document.createElement('script');
                        scriptElement.src = `${basePath}assets/js/${script}?fix=${Date.now()}`;
                        // Make sure scripts load in order by setting async to false
                        scriptElement.async = false;
                        document.body.appendChild(scriptElement);
                        console.log(`Path-fixer: Loading ${scriptElement.src}`);
                    });
                    
                    // Add a message for the user
                    const fixMessage = document.createElement('div');
                    fixMessage.style.position = 'fixed';
                    fixMessage.style.top = '10px';
                    fixMessage.style.left = '50%';
                    fixMessage.style.transform = 'translateX(-50%)';
                    fixMessage.style.padding = '10px';
                    fixMessage.style.background = 'rgba(255,255,0,0.8)';
                    fixMessage.style.borderRadius = '5px';
                    fixMessage.style.zIndex = '9999';
                    fixMessage.style.fontWeight = 'bold';
                    fixMessage.innerHTML = 'Fixing script loading issues...';
                    
                    document.body.appendChild(fixMessage);
                    
                    // Remove the message after 3 seconds
                    setTimeout(function() {
                        fixMessage.remove();
                    }, 3000);
                    
                    // If issues persist, offer a reload button after 5 seconds
                    setTimeout(function() {
                        if (requiredObjects.some(obj => window[obj] === undefined)) {
                            const reloadMessage = document.createElement('div');
                            reloadMessage.style.position = 'fixed';
                            reloadMessage.style.top = '10px';
                            reloadMessage.style.left = '50%';
                            reloadMessage.style.transform = 'translateX(-50%)';
                            reloadMessage.style.padding = '10px';
                            reloadMessage.style.background = 'rgba(255,0,0,0.8)';
                            reloadMessage.style.color = 'white';
                            reloadMessage.style.borderRadius = '5px';
                            reloadMessage.style.zIndex = '9999';
                            reloadMessage.style.fontWeight = 'bold';
                            reloadMessage.innerHTML = 'Still having issues. <button onclick="location.reload()">Reload Page</button>';
                            
                            document.body.appendChild(reloadMessage);
                        }
                    }, 5000);
                } else {
                    console.log('Path-fixer: All required objects are loaded correctly');
                }
            }, 1500); // Wait for scripts to load
        });
    }
})(); 