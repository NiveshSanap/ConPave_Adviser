/**
 * Probability Calculator for ConPave Adviser
 * This script calculates the probability distribution of each pavement type 
 * being recommended across various input combinations.
 */

// Import scoring functions if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    const { calculatePavementScores } = require('./scoring.js');
}

// Define the parameter space to test
const parameterSpace = {
    trafficVolume: ["1", "2", "3", "4"],
    designLife: ["10", "20", "30", "40"],
    subgradeCBR: ["1", "2", "3", "4"],
    slabThickness: ["150", "200", "250", "300"],
    longitudinalJoints: ["NotRequired", "Width4.5", "Width7"],
    marineEnvironment: ["Yes", "No"],
    utilityLines: ["Yes", "No"],
    manualConstruction: ["Yes", "No"],
    initialCost: ["Low", "Moderate", "High"],
    constructionTime: ["Limited", "Normal", "Flexible"]
};

// Initialize counters
const recommendationCounts = {
    JPCP: 0,
    JRCP: 0,
    CRCP: 0,
    PCP: 0,
    total: 0
};

/**
 * Run a Monte Carlo simulation to estimate probabilities
 * @param {number} sampleSize - Number of random combinations to test
 * @return {Object} Probabilities for each pavement type
 */
function calculateProbabilities(sampleSize = 1000) {
    // Reset counters
    recommendationCounts.JPCP = 0;
    recommendationCounts.JRCP = 0;
    recommendationCounts.CRCP = 0;
    recommendationCounts.PCP = 0;
    recommendationCounts.total = 0;
    
    for (let i = 0; i < sampleSize; i++) {
        // Generate random parameter combination
        const params = generateRandomParameters();
        
        // Calculate scores for this combination
        const result = calculatePavementScores(params);
        
        // Increment counter for recommended type
        if (result && result.recommendedType) {
            recommendationCounts[result.recommendedType]++;
            recommendationCounts.total++;
        }
    }
    
    // Calculate probabilities
    const probabilities = {};
    Object.keys(recommendationCounts).forEach(type => {
        if (type !== 'total' && recommendationCounts.total > 0) {
            probabilities[type] = recommendationCounts[type] / recommendationCounts.total;
        }
    });
    
    return probabilities;
}

/**
 * Generate a random set of parameters from the parameter space
 * @return {Object} Random parameter combination
 */
function generateRandomParameters() {
    const params = {};
    
    // Select one value randomly from each parameter option
    Object.keys(parameterSpace).forEach(param => {
        const options = parameterSpace[param];
        const randomIndex = Math.floor(Math.random() * options.length);
        params[param] = options[randomIndex];
    });
    
    return params;
}

/**
 * Format probabilities as percentages for display
 * @param {Object} probabilities - Raw probability values
 * @return {Object} Formatted probability percentages
 */
function formatProbabilities(probabilities) {
    const formatted = {};
    
    Object.keys(probabilities).forEach(type => {
        formatted[type] = (probabilities[type] * 100).toFixed(1) + '%';
    });
    
    return formatted;
}

/**
 * Run probability calculator and return results
 * @param {number} sampleSize - Number of combinations to test
 * @return {Object} Formatted results including counts and probabilities
 */
function runProbabilityAnalysis(sampleSize = 5000) {
    const probabilities = calculateProbabilities(sampleSize);
    const formattedProbabilities = formatProbabilities(probabilities);
    
    // Return comprehensive results
    return {
        sampleSize: sampleSize,
        counts: { ...recommendationCounts },
        rawProbabilities: { ...probabilities },
        formattedProbabilities: formattedProbabilities
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateProbabilities,
        runProbabilityAnalysis
    };
} else {
    // For browser environment
    window.probabilityCalculator = {
        calculateProbabilities,
        runProbabilityAnalysis
    };
} 