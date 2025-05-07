/**
 * ConPave Adviser - Standardized Scoring System
 * Based on IRC standards and principles from AASHTO & HDM-4 design methodologies
 */

// Main scoring weights (based on industry standards)
const WEIGHT_FACTORS = {
    trafficVolume: 0.30,       // ESAL calculation factor (HDM-4) - increased importance
    designLife: 0.20,          // Design reliability factor (AASHTO 93)
    subgradeCBR: 0.15,         // Subgrade strength factor (IRC method)
    slabThickness: 0.10,       // Thickness design factor
    environmentalFactors: 0.10, // Environmental coefficient - decreased slightly
    constructionConstraints: 0.15 // Construction feasibility
};

// Traffic volume standardized score mapping (based on ESAL calculations and IRC:58-2015 2.1/p.2, IRC:118-2015 1/p.1, IRC:SP:62-2014 2.1/p.5)
const TRAFFIC_SCORE = {
    "1": { JPCP: 0.65, JRCP: 0.55, CRCP: 0.30, PCP: 0.95 }, // < 450 CVPD - PCP strongly favored (IRC:SP:62-2014)
    "2": { JPCP: 0.95, JRCP: 0.80, CRCP: 0.60, PCP: 0.70 }, // 450-2000 CVPD - JPCP strongly favored (IRC:58-2015)
    "3": { JPCP: 0.70, JRCP: 0.95, CRCP: 0.85, PCP: 0.55 }, // > 2000 CVPD - JRCP favored (IRC:58-2015)
    "4": { JPCP: 0.60, JRCP: 0.75, CRCP: 0.98, PCP: 0.40 }  // Very high traffic - CRCP strongly favored (IRC:118-2015)
};

// Design life standardized score mapping (based on IRC:58-2015 2.1/p.2, IRC:118-2015 3.1/p.5, IRC:SP:62-2014 3.1/p.8)
const DESIGN_LIFE_SCORE = {
    "10": { JPCP: 0.65, JRCP: 0.50, CRCP: 0.30, PCP: 0.95 }, // Short design life - PCP strongly favored (IRC:SP:62-2014)
    "20": { JPCP: 0.95, JRCP: 0.75, CRCP: 0.60, PCP: 0.70 }, // Medium design life - JPCP strongly favored (IRC:58-2015)
    "30": { JPCP: 0.65, JRCP: 0.95, CRCP: 0.80, PCP: 0.50 }, // Long design life - JRCP strongly favored (IRC:58-2015)
    "40": { JPCP: 0.50, JRCP: 0.65, CRCP: 0.98, PCP: 0.30 }  // Very long design life - CRCP strongly favored (IRC:118-2015)
};

// Subgrade CBR standardized score mapping (based on IRC:58-2015 Table 4/p.13, IRC:118-2015 6.3/p.10, IRC:SP:62-2014 5.3/p.12)
const SUBGRADE_CBR_SCORE = {
    "1": { JPCP: 0.40, JRCP: 0.45, CRCP: 0.35, PCP: 0.95 }, // < 3% - PCP strongly favored (IRC:SP:62-2014 rural)
    "2": { JPCP: 0.70, JRCP: 0.95, CRCP: 0.60, PCP: 0.75 }, // 3-5% - JRCP strongly favored (IRC:SP:62-2014 expwy)
    "3": { JPCP: 0.95, JRCP: 0.80, CRCP: 0.70, PCP: 0.65 }, // 6-7% - JPCP strongly favored (IRC:58-2015)
    "4": { JPCP: 0.70, JRCP: 0.80, CRCP: 0.95, PCP: 0.60 }  // ≥ 8% - CRCP strongly favored (IRC:118-2015)
};

// Slab thickness standardized score mapping (based on IRC:58-2015 6.3.2/p.26, IRC:118-2015 6.3/p.10, IRC:SP:62-2014 7.1/p.15)
const SLAB_THICKNESS_SCORE = {
    "150": { JPCP: 0.50, JRCP: 0.40, CRCP: 0.30, PCP: 0.95 }, // Thin slabs - PCP strongly favored (IRC:SP:62-2014 rural)
    "200": { JPCP: 0.95, JRCP: 0.75, CRCP: 0.60, PCP: 0.75 }, // Medium thickness - JPCP strongly favored (IRC:58-2015, IRC:SP:62-2014 expwy)
    "250": { JPCP: 0.75, JRCP: 0.95, CRCP: 0.80, PCP: 0.60 }, // Thick slabs - JRCP favored (IRC:58-2015)
    "300": { JPCP: 0.65, JRCP: 0.80, CRCP: 0.95, PCP: 0.50 }  // Very thick slabs - CRCP favored (IRC:118-2015)
};

// Environmental and construction factors scoring
function getEnvironmentalScore(params) {
    // Default params to avoid errors
    params = params || {};
    
    // More balanced base scores per IRC standards
    const scores = { JPCP: 0.85, JRCP: 0.75, CRCP: 0.70, PCP: 0.80 };
    
    // Marine environment affects reinforced pavements negatively (IRC:58-2015 5.4/p.21, IRC:118-2015 3.2(i)/p.5)
    if (params.marineEnvironment === "Yes") {
        scores.JPCP *= 0.95;  // Compatible (IRC:58-2015)
        scores.JRCP *= 0.75;  // More severe reduction for reinforced pavement (IRC:58-2015)
        scores.CRCP *= 0.55;  // Significant reduction - avoid unless epoxy/galvanized (IRC:118-2015)
        scores.PCP *= 0.90;   // Compatible (IRC:SP:62-2014)
    }
    
    return scores;
}

function getConstructionConstraintsScore(params) {
    // Default params to avoid errors
    params = params || {};
    
    // More balanced base scores per IRC standards
    const scores = { JPCP: 0.80, JRCP: 0.75, CRCP: 0.70, PCP: 0.85 };
    
    // Utility lines affect CRCP negatively (IRC:58-2015 13/p.46, IRC:118-2015 3.2(ii)/p.5)
    if (params.utilityLines === "Yes") {
        scores.JPCP *= 0.90;  // Compatible (IRC:58-2015)
        scores.JRCP *= 0.85;  // Compatible (IRC:58-2015)
        scores.CRCP *= 0.55;  // Avoid (IRC:118-2015)
        scores.PCP *= 0.95;   // Compatible (IRC:SP:62-2014)
    }
    
    // Manual construction is more suitable for JPCP & PCP (IRC:118-2015 3.2(iv)/p.5)
    if (params.manualConstruction === "Yes") {
        scores.JPCP *= 0.95;  // Compatible (IRC:58-2015)
        scores.JRCP *= 0.75;  // Compatible (IRC:58-2015)
        scores.CRCP *= 0.55;  // Avoid (IRC:118-2015)
        scores.PCP *= 1.15;   // Compatible (IRC:SP:62-2014)
    }
    
    // Pavement width affects longitudinal joint requirements (IRC:58-2015 8.5/p.36, IRC:118-2015 2.2(ii)/p.3)
    if (params.longitudinalJoints === "Width7") {
        scores.JPCP *= 0.90;  // Required per IRC:58-2015
        scores.JRCP *= 0.85;  // Required per IRC:58-2015
        scores.CRCP *= 0.95;  // Required per IRC:118-2015 at width > 4.5m
        scores.PCP *= 0.75;   // As needed per IRC:SP:62-2014
    }
    
    // Budget considerations (IRC:58-2015 1.2/p.1, IRC:118-2015 3.1/p.5, IRC:SP:62-2014 12/p.24)
    if (params.initialCost === "Low") {
        scores.JPCP *= 0.95;  // JPCP more favorable for low budget
        scores.JRCP *= 0.80;
        scores.CRCP *= 0.55;  // Higher initial cost (IRC:118-2015)
        scores.PCP *= 0.75;   // Moderate for rural, High for expressway (IRC:SP:62-2014)
    } else if (params.initialCost === "High") {
        scores.JPCP *= 0.85;
        scores.JRCP *= 0.90;
        scores.CRCP *= 1.20;  // Lower lifecycle cost (IRC:118-2015)
        scores.PCP *= 0.95;
    }

    // Construction time constraints (derived from IRC standards on construction methods)
    if (params.constructionTime === "Limited") {
        scores.JPCP *= 0.70;
        scores.JRCP *= 0.65;
        scores.CRCP *= 0.55;  // Complex construction (IRC:118-2015)
        scores.PCP *= 1.35;   // Prefabricated (IRC:SP:62-2014)
    } else if (params.constructionTime === "Flexible") {
        scores.JPCP *= 0.90;
        scores.JRCP *= 0.95;
        scores.CRCP *= 1.15;  // Better with longer construction time
        scores.PCP *= 0.80;
    }
    
    return scores;
}

/**
 * Calculate standardized scores for pavement types based on input parameters
 * Using weighted scoring based on IRC standards & HDM-4 methodology
 * @param {Object} params - Form input parameters
 * @returns {Object} Scores and recommendation
 */
function calculatePavementScores(params) {
    // Define pavement types
    const pavementTypes = ["JPCP", "JRCP", "CRCP", "PCP"];
    
    // Initialize scores
    const scores = {};
    pavementTypes.forEach(type => {
        scores[type] = 0;
    });
    
    // Calculate weighted scores for each factor
    
    // 1. Traffic Volume (30%)
    if (params.trafficVolume && TRAFFIC_SCORE[params.trafficVolume]) {
        pavementTypes.forEach(type => {
            scores[type] += TRAFFIC_SCORE[params.trafficVolume][type] * WEIGHT_FACTORS.trafficVolume;
        });
    }
    
    // 2. Design Life (20%)
    if (params.designLife && DESIGN_LIFE_SCORE[params.designLife]) {
        pavementTypes.forEach(type => {
            scores[type] += DESIGN_LIFE_SCORE[params.designLife][type] * WEIGHT_FACTORS.designLife;
        });
    }
    
    // 3. Subgrade CBR (15%)
    if (params.subgradeCBR && SUBGRADE_CBR_SCORE[params.subgradeCBR]) {
        pavementTypes.forEach(type => {
            scores[type] += SUBGRADE_CBR_SCORE[params.subgradeCBR][type] * WEIGHT_FACTORS.subgradeCBR;
        });
    }
    
    // 4. Slab Thickness (10%)
    if (params.slabThickness && SLAB_THICKNESS_SCORE[params.slabThickness]) {
        pavementTypes.forEach(type => {
            scores[type] += SLAB_THICKNESS_SCORE[params.slabThickness][type] * WEIGHT_FACTORS.slabThickness;
        });
    }
    
    // 5. Environmental Factors (10%)
    const environmentalScores = getEnvironmentalScore(params);
    pavementTypes.forEach(type => {
        scores[type] += environmentalScores[type] * WEIGHT_FACTORS.environmentalFactors;
    });
    
    // 6. Construction Constraints (15%)
    const constructionScores = getConstructionConstraintsScore(params);
    pavementTypes.forEach(type => {
        scores[type] += constructionScores[type] * WEIGHT_FACTORS.constructionConstraints;
    });
    
    // Apply scenario-specific boost or penalty based on combined factors
    applyScenarioAdjustments(scores, params);
    
    // Check for strongly favorable scenarios and apply final adjustments
    applyStronglyFavorableScenarios(scores, params);
    
    // Ensure minimum scores to maintain reasonable distribution
    ensureMinimumScores(scores);
    
    // Normalize scores to 100-point scale
    pavementTypes.forEach(type => {
        scores[type] = Math.round(scores[type] * 100);
    });
    
    // Find highest scoring pavement type
    let highestScore = 0;
    let recommendedType = "";
    
    pavementTypes.forEach(type => {
        if (scores[type] > highestScore) {
            highestScore = scores[type];
            recommendedType = type;
        }
    });
    
    // Calculate confidence level
    const scoreDifference = calculateScoreDifference(scores, recommendedType);
    const confidenceLevel = calculateConfidenceLevel(highestScore, scoreDifference);
    
    // Determine reliability based on provided parameters
    const reliability = calculateReliability(params);
    
    return {
        scores: scores,
        recommendedType: recommendedType,
        highestScore: highestScore,
        confidenceLevel: confidenceLevel,
        reliability: reliability,
        scoreDifference: scoreDifference
    };
}

/**
 * Apply scenario-specific adjustments for special cases
 * This helps create more differentiated recommendations based on IRC standards
 */
function applyScenarioAdjustments(scores, params) {
    // Set default values for params to avoid errors
    params = params || {};
    params.trafficVolume = params.trafficVolume || "2";
    params.designLife = params.designLife || "20";
    params.subgradeCBR = params.subgradeCBR || "3";
    params.constructionTime = params.constructionTime || "Normal";
    params.marineEnvironment = params.marineEnvironment || "No";
    
    // High traffic + long design life = CRCP advantage (IRC:118-2015 1/p.1, IRC:118-2015 3.1/p.5)
    if (params.trafficVolume === "4" && (params.designLife === "30" || params.designLife === "40")) {
        scores.CRCP *= 1.10;
    }
    
    // Low traffic + short design life = PCP advantage (IRC:SP:62-2014 2.1/p.5, IRC:SP:62-2014 3.1/p.8)
    if (params.trafficVolume === "1" && params.designLife === "10") {
        scores.PCP *= 1.15;
    }
    
    // Medium traffic + medium design life = JPCP advantage (IRC:58-2015 2.1/p.2)
    if (params.trafficVolume === "2" && params.designLife === "20") {
        scores.JPCP *= 1.10;
    }
    
    // High CBR + high traffic + flexible construction time = CRCP advantage
    // (based on IRC:118-2015 requirements for optimal performance)
    if (params.subgradeCBR === "4" && params.trafficVolume === "4" && params.constructionTime === "Flexible") {
        scores.CRCP *= 1.20;
    }
    
    // Medium CBR + wide pavement + long design life = JRCP advantage
    // (based on IRC:58-2015 for optimal JRCP conditions)
    if (params.subgradeCBR === "3" && params.longitudinalJoints === "Width7" && params.designLife === "30") {
        scores.JRCP *= 1.15;
    }
    
    // For marine environments with utility lines, strongly penalize CRCP and slightly boost PCP
    // (IRC:118-2015 3.2(i)/p.5, IRC:SP:62-2014 5.4/p.13)
    if (params.marineEnvironment === "Yes" && params.utilityLines === "Yes") {
        scores.CRCP *= 0.70;
        scores.PCP *= 1.10;
    }
}

/**
 * Calculate the difference between highest score and the next highest
 * Used as indicator of recommendation strength
 */
function calculateScoreDifference(scores, recommendedType) {
    let nextHighestScore = 0;
    
    for (const type in scores) {
        if (type !== recommendedType && scores[type] > nextHighestScore) {
            nextHighestScore = scores[type];
        }
    }
    
    return scores[recommendedType] - nextHighestScore;
}

/**
 * Calculate confidence level based on score and difference
 * Uses qualitative indicators similar to AASHTO reliability level
 */
function calculateConfidenceLevel(highestScore, scoreDifference) {
    // Base confidence on highest score
    let confidence = "";
    
    if (highestScore >= 90) {
        confidence = "Very High";
    } else if (highestScore >= 80) {
        confidence = "High";
    } else if (highestScore >= 70) {
        confidence = "Moderate";
    } else if (highestScore >= 60) {
        confidence = "Low";
    } else {
        confidence = "Very Low";
    }
    
    // Adjust based on difference from next highest score
    if (scoreDifference < 5) {
        // Small difference means less certainty
        if (confidence === "Very High") confidence = "High";
        else if (confidence === "High") confidence = "Moderate";
        else if (confidence === "Moderate") confidence = "Low";
    } else if (scoreDifference >= 15) {
        // Large difference means more certainty
        if (confidence === "Moderate") confidence = "High";
        else if (confidence === "Low") confidence = "Moderate";
    }
    
    return confidence;
}

/**
 * Calculate reliability of the recommendation based on IRC:58-2015, IRC:118-2015 and IRC:SP standards
 * Higher reliability indicates better confidence in the recommendation
 */
function calculateReliability(params) {
    // Default to moderate reliability
    let reliability = 75;
    
    // Add reliability points for complete information
    if (params.trafficVolume && params.designLife && params.subgradeCBR && params.slabThickness) {
        reliability += 10; // Key IRC parameters are provided
    }
    
    // Add reliability for optimal IRC-recommended conditions
    
    // JPCP reliability factors (IRC:58-2015)
    if (params.trafficVolume === "2" && params.designLife === "20" && 
        params.subgradeCBR === "3" && params.slabThickness === "200") {
        reliability += 15; // Optimal JPCP conditions per IRC:58-2015
    }
    
    // JRCP reliability factors (IRC:58-2015)
    if (params.trafficVolume === "3" && params.designLife === "30" && 
        params.subgradeCBR === "3" && params.slabThickness === "250") {
        reliability += 15; // Optimal JRCP conditions per IRC:58-2015
    }
    
    // CRCP reliability factors (IRC:118-2015)
    if (params.trafficVolume === "4" && params.designLife === "40" && 
        params.subgradeCBR === "4" && params.slabThickness === "300" &&
        params.marineEnvironment === "No" && params.utilityLines === "No") {
        reliability += 15; // Optimal CRCP conditions per IRC:118-2015
    }
    
    // PCP reliability factors (IRC:SP:62-2014, IRC:SP:140-2024)
    if (params.trafficVolume === "1" && params.designLife === "10" && 
        params.subgradeCBR === "1" && params.slabThickness === "150") {
        reliability += 15; // Optimal PCP conditions for rural roads per IRC:SP:62-2014
    }
    
    // Deduct reliability for potentially conflicting information
    if (params.trafficVolume === "4" && params.slabThickness === "150") {
        reliability -= 20; // Very high traffic with thin slabs is not recommended by IRC
    }
    
    if (params.designLife === "40" && params.slabThickness === "150") {
        reliability -= 15; // Long design life with thin slabs conflicts with IRC recommendations
    }
    
    if (params.trafficVolume === "1" && params.designLife === "40") {
        reliability -= 10; // Low traffic with very long design life is not cost-effective per IRC
    }
    
    // Cap reliability at reasonable bounds
    reliability = Math.max(50, Math.min(reliability, 95));
    
    return reliability;
}

/**
 * Get detailed recommendations for the selected pavement type
 */
function getPavementTypeDetails(recommendedType, params) {
    const details = {
        JPCP: {
            name: "Jointed Plain Concrete Pavement (JPCP)",
            description: "A high-performance rigid pavement with transverse joints to control cracking without reinforcement. Suitable for highways and expressways with medium to high traffic.",
            thickness: determineSuggestedThickness("JPCP", params),
            reinforcement: "None (except dowels at joints)",
            jointSpacing: determineJointSpacing("JPCP", params),
            designLife: determineDesignLife("JPCP", params),
            ircReference: "IRC:58-2015, Section 7.2, Page 32-34",
            maintenanceInterval: "6-8 years (joint resealing)",
            advantages: [
                "Lower initial cost compared to CRCP",
                "Well-established construction practices",
                "Easier to repair specific slabs"
            ],
            disadvantages: [
                "Regular joint maintenance required",
                "More joints than JRCP",
                "Potential for pumping at joints under heavy traffic"
            ],
            specialConsiderations: determineSpecialConsiderations("JPCP", params)
        },
        JRCP: {
            name: "Jointed Reinforced Concrete Pavement (JRCP)",
            description: "Concrete pavement with steel reinforcement and transverse joints at longer intervals. The reinforcement holds cracks tightly together.",
            thickness: determineSuggestedThickness("JRCP", params),
            reinforcement: "0.15-0.25% of cross-sectional area",
            jointSpacing: determineJointSpacing("JRCP", params),
            designLife: determineDesignLife("JRCP", params),
            ircReference: "IRC:58-2015, Section 9.5, Page 48-50",
            maintenanceInterval: "8-10 years (joint resealing)",
            advantages: [
                "Fewer joints than JPCP",
                "Better load transfer across cracks",
                "Less susceptible to pumping"
            ],
            disadvantages: [
                "Higher initial cost than JPCP",
                "More complex construction",
                "Reinforcement may corrode in marine environments"
            ],
            specialConsiderations: determineSpecialConsiderations("JRCP", params)
        },
        CRCP: {
            name: "Continuously Reinforced Concrete Pavement (CRCP)",
            description: "High-performance pavement with continuous longitudinal reinforcement and no transverse joints except at structures. Provides superior long-term performance for high-traffic roads.",
            thickness: determineSuggestedThickness("CRCP", params),
            reinforcement: "0.65-0.80% of cross-sectional area",
            jointSpacing: "None required (except at structures)",
            designLife: determineDesignLife("CRCP", params),
            ircReference: "IRC:118-2015, Section 4.3, Page 18-22",
            maintenanceInterval: "12-15 years (minimal maintenance)",
            advantages: [
                "No transverse joints (smoother ride)",
                "Longer service life",
                "Lower maintenance costs over lifetime",
                "Superior performance in heavy traffic"
            ],
            disadvantages: [
                "Highest initial cost",
                "Most complex construction",
                "Specialized equipment and skilled labor required",
                "Potential for steel corrosion"
            ],
            specialConsiderations: determineSpecialConsiderations("CRCP", params)
        },
        PCP: {
            name: "Precast Concrete Pavement (PCP)",
            description: "Factory-produced concrete panels installed on-site. Ideal for rapid construction, repairs, and areas with limited construction windows.",
            thickness: determineSuggestedThickness("PCP", params),
            reinforcement: "As per design requirements",
            jointSpacing: "Panel length (typically 3-5m)",
            designLife: determineDesignLife("PCP", params),
            ircReference: "IRC:SP:62-2014, Section 5.3, Page 25-28",
            maintenanceInterval: "8-12 years (joint maintenance)",
            advantages: [
                "Rapid construction/installation",
                "Factory quality control",
                "Reduced traffic disruption",
                "Suitable for repair/rehabilitation"
            ],
            disadvantages: [
                "Higher initial cost than JPCP",
                "More joints",
                "Specialized transportation needed",
                "Limited panel size options"
            ],
            specialConsiderations: determineSpecialConsiderations("PCP", params)
        }
    };
    
    return details[recommendedType];
}

/**
 * Determine suggested thickness based on pavement type and traffic
 */
function determineSuggestedThickness(pavementType, params) {
    const baseThickness = {
        JPCP: { "1": 180, "2": 220, "3": 250, "4": 280 },
        JRCP: { "1": 180, "2": 220, "3": 240, "4": 260 },
        CRCP: { "1": 180, "2": 200, "3": 230, "4": 250 },
        PCP: { "1": 150, "2": 180, "3": 200, "4": 220 }
    };
    
    const trafficVolume = params.trafficVolume || "2";
    let thickness = baseThickness[pavementType][trafficVolume];
    
    // Adjust for CBR
    if (params.subgradeCBR === "1") { // < 3% CBR
        thickness += 20;
    } else if (params.subgradeCBR === "4") { // ≥ 8% CBR
        thickness -= 10;
    }
    
    // Ensure thickness is within bounds of selected maximum
    const maxThickness = parseInt(params.slabThickness) || 250;
    if (thickness > maxThickness) {
        thickness = maxThickness;
    }
    
    return `${thickness} mm (IRC:58-2015)`;
}

/**
 * Determine joint spacing based on pavement type and parameters
 */
function determineJointSpacing(pavementType, params) {
    if (pavementType === "CRCP") {
        return "No transverse joints required";
    }
    
    if (pavementType === "PCP") {
        return "Panel length (typically 3-5m)";
    }
    
    const thickness = parseInt(determineSuggestedThickness(pavementType, params));
    let spacing;
    
    if (pavementType === "JPCP") {
        // JPCP joint spacing formula based on IRC:58-2015
        spacing = Math.min(25 * thickness / 1000, 4.5);
    } else { // JRCP
        // JRCP can have longer joint spacing due to reinforcement
        spacing = Math.min(25 * thickness / 1000, 9.0);
    }
    
    // Round to nearest 0.5m
    spacing = Math.round(spacing * 2) / 2;
    
    return `${spacing} m (IRC:58-2015)`;
}

/**
 * Determine design life based on pavement type and parameters
 */
function determineDesignLife(pavementType, params) {
    const baseDesignLife = {
        JPCP: 20,
        JRCP: 25,
        CRCP: 30,
        PCP: 15
    };
    
    let designLife = baseDesignLife[pavementType];
    
    // Adjust for design life selection
    if (params.designLife) {
        const selectedLife = parseInt(params.designLife);
        // If user selected longer design life, increase accordingly
        if (selectedLife > designLife) {
            designLife = selectedLife;
        }
    }
    
    // Adjust for traffic volume (higher traffic = reduced life)
    if (params.trafficVolume === "4") { // Very high traffic
        designLife = Math.round(designLife * 0.9);
    }
    
    return `${designLife} years`;
}

/**
 * Determine special considerations based on pavement type and parameters
 */
function determineSpecialConsiderations(pavementType, params) {
    const considerations = [];
    
    // Common considerations for all types
    if (params.subgradeCBR === "1") {
        considerations.push("Additional subbase treatment recommended due to low subgrade strength");
    }
    
    // Marine environment considerations
    if (params.marineEnvironment === "Yes") {
        if (pavementType === "CRCP" || pavementType === "JRCP") {
            considerations.push("Use epoxy-coated or galvanized reinforcement to prevent corrosion in marine environment");
        }
        considerations.push("Increase concrete cover over reinforcement by 10mm");
        considerations.push("Use sulfate-resistant cement (IRC:15-2017)");
    }
    
    // Utility considerations
    if (params.utilityLines === "Yes") {
        if (pavementType === "CRCP") {
            considerations.push("Not recommended for areas with many utility lines. Consider JPCP as alternative");
        } else {
            considerations.push("Design access chambers aligned with joint patterns");
        }
    }
    
    // Construction considerations
    if (params.manualConstruction === "Yes") {
        if (pavementType === "CRCP") {
            considerations.push("Not suitable for manual construction. Requires specialized equipment");
        } else if (pavementType === "JPCP" || pavementType === "PCP") {
            considerations.push("Well-suited for manual construction with proper quality control");
        }
    }
    
    // Budget considerations
    if (params.initialCost === "Low") {
        if (pavementType === "CRCP") {
            considerations.push("Higher initial cost but lower life-cycle cost. Consider staged construction");
        }
        if (pavementType === "JPCP") {
            considerations.push("Most economical rigid pavement option for initial construction");
        }
    }
    
    return considerations;
}

/**
 * Generate an explanation of why a particular pavement type is recommended
 * and the probability of each pavement type being suitable
 */
function generateRecommendationExplanation(result, params) {
    const { scores, recommendedType, scoreDifference, confidenceLevel } = result;
    const pavementTypes = ["JPCP", "JRCP", "CRCP", "PCP"];
    const explanations = [];
    
    // Calculate the sum of all scores to determine percentages
    const totalScore = pavementTypes.reduce((sum, type) => sum + scores[type], 0);
    
    // Calculate percentage probability for each type
    const probabilities = {};
    pavementTypes.forEach(type => {
        probabilities[type] = Math.round((scores[type] / totalScore) * 100);
    });
    
    // Generate main recommendation explanation
    let mainExplanation = `<strong>${getPavementFullName(recommendedType)}</strong> is recommended with a confidence level of ${confidenceLevel} (${probabilities[recommendedType]}% probability).`;
    
    // Add specific factors that led to the recommendation
    const factors = getKeyFactors(recommendedType, params);
    if (factors.length > 0) {
        mainExplanation += ` Key factors: ${factors.join(", ")}.`;
    }
    
    explanations.push(mainExplanation);
    
    // Add comparative probability
    explanations.push("<strong>Probability of suitability for each pavement type:</strong>");
    
    // Sort pavement types by probability
    const sortedTypes = [...pavementTypes].sort((a, b) => probabilities[b] - probabilities[a]);
    
    // Generate probability bars with explanations
    const probabilityBars = sortedTypes.map(type => {
        const fullName = getPavementFullName(type);
        const probability = probabilities[type];
        let barClass = 'bg-secondary';
        
        if (type === recommendedType) {
            barClass = 'bg-success';
        } else if (probability > 25) {
            barClass = 'bg-info';
        } else if (probability < 15) {
            barClass = 'bg-danger';
        }
        
        return `
            <div class="mb-2">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span><strong>${fullName}</strong></span>
                    <span>${probability}%</span>
                </div>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar ${barClass}" role="progressbar" style="width: ${probability}%;" 
                        aria-valuenow="${probability}" aria-valuemin="0" aria-valuemax="100">
                        ${probability}%
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    explanations.push(probabilityBars);
    
    // Add alternative recommendation if there's a close second
    const secondType = getSecondBestOption(scores, recommendedType);
    if (scoreDifference < 10 && secondType) {
        explanations.push(`<strong>${getPavementFullName(secondType)}</strong> is also a viable alternative with ${probabilities[secondType]}% probability.`);
    }
    
    return {
        mainExplanation: explanations[0],
        probabilityBars: explanations[1] + explanations[2],
        alternativeRecommendation: explanations[3] || ''
    };
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

/**
 * Get the key factors that led to a pavement type being recommended
 */
function getKeyFactors(recommendedType, params) {
    const factors = [];
    
    // Traffic volume factors
    if (recommendedType === 'JPCP' && params.trafficVolume === '2') {
        factors.push('medium traffic volume');
    } else if (recommendedType === 'JRCP' && params.trafficVolume === '3') {
        factors.push('high traffic volume');
    } else if (recommendedType === 'CRCP' && params.trafficVolume === '4') {
        factors.push('very high traffic volume');
    } else if (recommendedType === 'PCP' && params.trafficVolume === '1') {
        factors.push('low traffic volume');
    }
    
    // Design life factors
    if (recommendedType === 'JPCP' && params.designLife === '20') {
        factors.push('medium design life');
    } else if (recommendedType === 'JRCP' && params.designLife === '30') {
        factors.push('long design life');
    } else if (recommendedType === 'CRCP' && params.designLife === '40') {
        factors.push('very long design life');
    } else if (recommendedType === 'PCP' && params.designLife === '10') {
        factors.push('short design life');
    }
    
    // Subgrade factors
    if (recommendedType === 'PCP' && params.subgradeCBR === '1') {
        factors.push('weak subgrade');
    } else if (recommendedType === 'CRCP' && params.subgradeCBR === '4') {
        factors.push('strong subgrade');
    }
    
    // Construction time factors
    if (recommendedType === 'PCP' && params.constructionTime === 'Limited') {
        factors.push('limited construction time');
    } else if (recommendedType === 'CRCP' && params.constructionTime === 'Flexible') {
        factors.push('flexible construction time');
    }
    
    // Budget factors
    if ((recommendedType === 'JPCP' || recommendedType === 'PCP') && params.initialCost === 'Low') {
        factors.push('low budget constraints');
    } else if (recommendedType === 'CRCP' && params.initialCost === 'High') {
        factors.push('high budget availability');
    }
    
    return factors;
}

/**
 * Get the second best option
 */
function getSecondBestOption(scores, recommendedType) {
    let highestScore = 0;
    let secondType = '';
    
    for (const type in scores) {
        if (type !== recommendedType && scores[type] > highestScore) {
            highestScore = scores[type];
            secondType = type;
        }
    }
    
    return secondType;
}

/**
 * Apply special adjustments for strongly favorable scenarios based on IRC standards
 * These represent the ideal conditions for each pavement type according to IRC codes
 */
function applyStronglyFavorableScenarios(scores, params) {
    // Check for JPCP strongly favorable scenario per IRC:58-2015
    // Medium-high traffic, standard design life, good subgrade, 200mm thickness
    if (params.trafficVolume === "2" 
        && params.designLife === "20" 
        && params.subgradeCBR === "3"
        && params.slabThickness === "200") {
        scores.JPCP *= 1.15;
    }
    
    // Check for JRCP strongly favorable scenario per IRC:58-2015
    // High traffic, longer design life, good subgrade, thicker slab
    if (params.trafficVolume === "3" 
        && params.designLife === "30" 
        && params.subgradeCBR === "3"
        && params.slabThickness === "250") {
        scores.JRCP *= 1.15;
    }
    
    // Check for CRCP strongly favorable scenario per IRC:118-2015
    // Very high traffic, very long design life, excellent subgrade, no utility lines
    if (params.trafficVolume === "4" 
        && params.designLife === "40" 
        && params.subgradeCBR === "4"
        && params.utilityLines === "No"
        && params.marineEnvironment === "No") {
        scores.CRCP *= 1.20;
    }
    
    // Check for PCP strongly favorable scenario per IRC:SP:62-2014
    // Low traffic rural or high performance need with rapid construction
    if ((params.trafficVolume === "1" && params.designLife === "10") 
        || (params.constructionTime === "Limited" && params.initialCost === "High")) {
        scores.PCP *= 1.15;
    }
    
    // Balance scores to avoid extreme dominance
    balanceScoresIfNeeded(scores);
}

/**
 * Ensure minimum scores to maintain reasonable distribution
 * as per IRC parameter comparison
 */
function ensureMinimumScores(scores) {
    const minScoreRatio = 0.50; // No pavement type should score less than 50% of the best option
    let maxScore = 0;
    
    // Find highest score
    Object.keys(scores).forEach(type => {
        maxScore = Math.max(maxScore, scores[type]);
    });
    
    // Ensure minimum score relative to highest
    Object.keys(scores).forEach(type => {
        const minAllowedScore = maxScore * minScoreRatio;
        if (scores[type] < minAllowedScore) {
            scores[type] = minAllowedScore;
        }
    });
}

/**
 * Balance scores to avoid extreme dominance by one pavement type
 * This ensures a fair comparison as recommended by IRC design guidelines
 */
function balanceScoresIfNeeded(scores) {
    const threshold = 1.5; // Max ratio between highest and second highest scores
    
    // Find highest and second highest scores
    let highest = 0;
    let secondHighest = 0;
    let highestType = "";
    
    Object.keys(scores).forEach(type => {
        if (scores[type] > highest) {
            secondHighest = highest;
            highest = scores[type];
            highestType = type;
        } else if (scores[type] > secondHighest) {
            secondHighest = scores[type];
        }
    });
    
    // If highest score is more than threshold times the second highest
    if (highest > 0 && secondHighest > 0 && (highest / secondHighest) > threshold) {
        // Reduce highest score to maintain reasonable ratio
        scores[highestType] = secondHighest * threshold;
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePavementScores,
        getPavementTypeDetails,
        generateRecommendationExplanation
    };
} else {
    // For browser environment
    window.pavementScoring = {
        calculatePavementScores,
        getPavementTypeDetails,
        generateRecommendationExplanation
    };
} 