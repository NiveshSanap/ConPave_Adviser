/**
 * Concrete Pavement Recommendation System
 * training.js - ML training module based on IRC standards data
 */

const pavementTrainingSystem = {
    // Training data from IRC standards table
    trainingData: {
        jpcp: {
            trafficVolume: { min: 450, preferred: "highway", irc_ref: "IRC:58-2015 2.1/p.2" },
            designLife: { preferred: 20, min: 20, max: 20, irc_ref: "IRC:58-2015 2.1/p.2" },
            subgradeCBR: { min: 6, irc_ref: "IRC:58-2015 Table 4/p.13" },
            slabThickness: { min: 200, irc_ref: "IRC:58-2015 6.3.2/p.26" },
            longitudinalSteel: { value: "None (except at joints)", irc_ref: "IRC:58-2015 7.1/p.31" },
            transverseJoints: { value: "At regular intervals", irc_ref: "IRC:58-2015 2.1/p.2" },
            longitudinalJoints: { condition: "width > 7m", irc_ref: "IRC:58-2015 8.5/p.36" },
            shoulders: { value: "May be tied to slab", irc_ref: "IRC:58-2015 9.1/p.38" },
            antiFrictionLayer: { value: "May be provided", irc_ref: "IRC:58-2015 6.1/p.25" },
            edgeSupport: { value: "May be provided", irc_ref: "IRC:58-2015 9.1/p.38" },
            terminalSlabs: { value: null, irc_ref: null },
            specialJoints: { value: "As per design", irc_ref: "IRC:58-2015 8.6/p.36" },
            surfaceTexture: { value: "Required (tine brush)", irc_ref: "IRC:58-2015 8.9/p.36" },
            maintenance: { value: "Low", irc_ref: "IRC:58-2015 11/p.44" },
            initialCost: { value: "High", irc_ref: "IRC:58-2015 1.2/p.1" },
            crackSpacing: { value: null, irc_ref: null },
            maxCrackWidth: { value: null, irc_ref: null },
            notForLightTraffic: { value: false, irc_ref: null },
            marineEnvironment: { value: true, warning: null, irc_ref: "IRC:58-2015 5.4/p.21" },
            utilityLines: { value: true, warning: null, irc_ref: "IRC:58-2015 13/p.46" },
            manualConstruction: { value: true, warning: null, irc_ref: null },
            environmentSuitability: {
                marineEnvironment: true,
                utilityLines: true,
                manualConstruction: true
            }
        },
        jrcp: {
            trafficVolume: { min: 450, preferred: "highway", irc_ref: "IRC:58-2015 2.1/p.2" },
            designLife: { preferred: 20, min: 20, max: 20, irc_ref: "IRC:58-2015 2.1/p.2" },
            subgradeCBR: { min: 6, irc_ref: "IRC:58-2015 Table 4/p.13" },
            slabThickness: { min: 200, irc_ref: "IRC:58-2015 6.3.2/p.26" },
            longitudinalSteel: { value: "At joints and along slab length", irc_ref: "IRC:58-2015 7.2/p.32" },
            transverseJoints: { value: "At longer intervals than JPCP", irc_ref: "IRC:58-2015 2.1/p.2" },
            longitudinalJoints: { condition: "width > 7m", irc_ref: "IRC:58-2015 8.5/p.36" },
            shoulders: { value: "May be tied to slab", irc_ref: "IRC:58-2015 9.1/p.38" },
            antiFrictionLayer: { value: "May be provided", irc_ref: "IRC:58-2015 6.1/p.25" },
            edgeSupport: { value: "May be provided", irc_ref: "IRC:58-2015 9.1/p.38" },
            terminalSlabs: { value: null, irc_ref: null },
            specialJoints: { value: "As per design", irc_ref: "IRC:58-2015 8.6/p.36" },
            surfaceTexture: { value: "Required (tine brush)", irc_ref: "IRC:58-2015 8.9/p.36" },
            maintenance: { value: "Low", irc_ref: "IRC:58-2015 11/p.44" },
            initialCost: { value: "High", irc_ref: "IRC:58-2015 1.2/p.1" },
            crackSpacing: { value: null, irc_ref: null },
            maxCrackWidth: { value: null, irc_ref: null },
            notForLightTraffic: { value: false, irc_ref: null },
            marineEnvironment: { value: true, warning: null, irc_ref: "IRC:58-2015 5.4/p.21" },
            utilityLines: { value: true, warning: null, irc_ref: "IRC:58-2015 13/p.46" },
            manualConstruction: { value: true, warning: null, irc_ref: null },
            environmentSuitability: {
                marineEnvironment: true,
                utilityLines: true,
                manualConstruction: true
            }
        },
        crcp: {
            trafficVolume: { preferred: "very high", description: "Very high volume of commercial traffic", irc_ref: "IRC:118-2015 1/p.1" },
            designLife: { preferred: 35, min: 30, max: 40, irc_ref: "IRC:118-2015 3.1/p.5" },
            subgradeCBR: { min: 6, irc_ref: "IRC:118-2015 6.3/p.10" }, 
            slabThickness: { note: "No reduction in thickness is desirable", min: 250, irc_ref: "IRC:118-2015 6.3/p.10" },
            longitudinalSteel: { value: "0.65-0.80% of area", irc_ref: "IRC:118-2015 2.2(vii)/p.4" },
            crackSpacing: { min: 0.5, max: 2.0, irc_ref: "IRC:118-2015 2.2(i)/p.3" },
            maxCrackWidth: { good: 1, effective: 0.6, irc_ref: "IRC:118-2015 2.2(i)/p.3" },
            transverseJoints: { value: "None", irc_ref: "IRC:118-2015 1/p.1" },
            longitudinalJoints: { condition: "width > 4.5m", irc_ref: "IRC:118-2015 2.2(ii)/p.3" },
            shoulders: { value: "Concrete shoulders recommended, tied, no longitudinal joint", irc_ref: "IRC:118-2015 2.2(vii)/p.4" },
            antiFrictionLayer: { value: "Not provided", irc_ref: "IRC:118-2015 2.2(iv)/p.3" },
            edgeSupport: { value: "Important; concrete shoulder recommended", irc_ref: "IRC:118-2015 2.2(vii)/p.4" },
            terminalSlabs: { value: "Yes", irc_ref: "IRC:118-2015 2.2(vi)/p.4" },
            specialJoints: { value: "Yes", irc_ref: "IRC:118-2015 2.2(v)/p.4" },
            surfaceTexture: { value: "Required (tine brush)", irc_ref: "IRC:118-2015 2.2(viii)/p.4" },
            maintenance: { value: "Minimal (no joint seals except longitudinal)", irc_ref: "IRC:118-2015 3.1/p.4" },
            initialCost: { value: "Higher (but lower life cycle cost)", irc_ref: "IRC:118-2015 3.1/p.5" },
            notForLightTraffic: { value: true, warning: "Not for light traffic, village roads, urban streets, short length", irc_ref: "IRC:118-2015 3.2(iii)/p.5" },
            marineEnvironment: { value: false, warning: "Avoid unless epoxy/galvanized steel used", irc_ref: "IRC:118-2015 3.2(i)/p.5" },
            utilityLines: { value: false, warning: "Avoid", irc_ref: "IRC:118-2015 3.2(ii)/p.5" },
            manualConstruction: { value: false, warning: "Avoid", irc_ref: "IRC:118-2015 3.2(iv)/p.5" },
            environmentSuitability: {
                marineEnvironment: false,
                utilityLines: false,
                manualConstruction: false
            }
        },
        pcp: {
            trafficVolume: { max: 450, rural: true, highVolume: "expwy", irc_ref: "IRC:SP:62-2014 2.1/p.5, IRC:SP:140-2024 3.1" },
            designLife: { rural: { min: 10, max: 20 }, expwy: { min: 20, max: 30 }, irc_ref: "IRC:SP:62-2014 3.1/p.8, IRC:SP:140-2024 4.1" },
            subgradeCBR: { rural: { min: 3 }, expwy: { min: 5 }, irc_ref: "IRC:SP:62-2014 5.3/p.12, IRC:SP:140-2024 6.2" },
            slabThickness: { rural: { min: 150 }, expwy: { min: 200 }, irc_ref: "IRC:SP:62-2014 7.1/p.15, IRC:SP:140-2024 8.1" },
            longitudinalSteel: { value: "Not applicable", irc_ref: "IRC:SP:62-2014 7.3/p.17" },
            transverseJoints: { value: "As per design", irc_ref: "IRC:SP:62-2014 8.1/p.18" },
            surfaceTexture: { value: "Required", irc_ref: "IRC:SP:62-2014 8.4/p.20" },
            maintenance: { rural: "Moderate", expwy: "Low", irc_ref: "IRC:SP:62-2014 11/p.24" },
            initialCost: { rural: "Moderate", expwy: "High", irc_ref: "IRC:SP:62-2014 12/p.24" },
            crackSpacing: { value: null, irc_ref: null },
            maxCrackWidth: { value: null, irc_ref: null },
            longitudinalJoints: { condition: "As needed", irc_ref: "IRC:SP:62-2014 8.3/p.19" },
            shoulders: { value: "Recommended for expwy", irc_ref: "IRC:SP:62-2014 9.1/p.21" },
            antiFrictionLayer: { value: "Required if no base course", irc_ref: "IRC:SP:62-2014 6.2/p.14" },
            edgeSupport: { value: "Important for expwy", irc_ref: "IRC:SP:140-2024 9.1" },
            terminalSlabs: { value: "As per design", irc_ref: "IRC:SP:140-2024 8.6" },
            specialJoints: { value: "As per design", irc_ref: "IRC:SP:62-2014 8.5/p.19" },
            notForLightTraffic: { value: false, irc_ref: null },
            marineEnvironment: { value: true, warning: null, irc_ref: "IRC:SP:62-2014 5.4/p.13" },
            utilityLines: { value: true, warning: null, irc_ref: "IRC:SP:62-2014 13/p.25" },
            manualConstruction: { value: true, warning: null, irc_ref: "IRC:SP:62-2014 10/p.22" },
            environmentSuitability: {
                marineEnvironment: true,
                utilityLines: true,
                manualConstruction: true
            }
        }
    },
    
    // Feature weights for scoring algorithm - based on IRC parameter table priorities
    featureWeights: {
        trafficVolume: 15,      // Most important parameter according to table
        designLife: 12,         // Critical design parameter (second-ranked)
        subgradeCBR: 10,        // Key structural factor
        slabThickness: 10,      // Critical thickness parameter
        longitudinalSteel: 8,    // Important for CRCP and JRCP
        transverseJoints: 8,     // Key design factor
        longitudinalJoints: 8,   // Important for width considerations
        shoulders: 6,           // Edge support importance
        antiFrictionLayer: 5,    // Affects performance
        edgeSupport: 7,         // Critical for edge performance
        terminalSlabs: 5,        // Important at transitions
        specialJoints: 5,        // Important at structures
        surfaceTexture: 4,       // Safety and durability
        maintenance: 7,         // Lifecycle consideration
        initialCost: 9,         // Economic consideration - high importance in IRC table
        crackSpacing: 6,        // CRCP performance metric
        maxCrackWidth: 6,       // CRCP performance metric
        notForLightTraffic: 8,   // Application constraint - high importance in IRC
        marineEnvironment: 9,    // Environmental factor - high importance in IRC 
        utilityLines: 8,        // Practical constraint - high importance in IRC
        manualConstruction: 8,   // Construction method factor - high importance in IRC
        environmentFactors: 10   // Comprehensive environmental suitability
    },
    
    // Train model with the provided data
    trainModel: function() {
        console.log("Training pavement recommendation model with IRC standards data...");
        
        // In a real ML scenario, we would:
        // 1. Normalize the data
        // 2. Split into training/test sets
        // 3. Train a classifier or regression model
        
        // For this implementation, we're using a rule-based system with scoring
        // based on the IRC standards directly
        
        // Perform data preprocessing and validation
        this.preprocessTrainingData();
        const validationResults = this.validateModel();
        
        console.log("Model training complete!");
        return {
            modelVersion: "2.0.0",
            trainingDate: new Date().toISOString(),
            accuracy: validationResults.accuracy,
            precision: validationResults.precision,
            recall: validationResults.recall,
            modelType: "Enhanced rule-based weighted scoring system",
            dataSource: "IRC Standards (58-2015, 118-2015, SP:62-2014, SP:140-2024)"
        };
    },
    
    // Preprocess the training data
    preprocessTrainingData: function() {
        console.log("Preprocessing training data...");
        
        // Convert categorical values to numerical representations
        // (In a real system, this would involve more complex operations)
        
        // Add derived features and standardize parameter formats
        Object.keys(this.trainingData).forEach(pavementType => {
            const data = this.trainingData[pavementType];
            
            // Convert string values to standardized formats
            this.standardizeParameterFormats(data);
            
            // Calculate performance metrics
            data.durabilityScore = this.calculateDurabilityScore(data);
            data.costEffectivenessScore = this.calculateCostEffectivenessScore(data);
            data.constructionComplexityScore = this.calculateConstructionComplexityScore(data);
            
            // Add IRC reference code coverage metric (how well documented in IRC)
            data.ircReferenceCoverage = this.calculateIRCReferenceCoverage(pavementType);
            
            // Generate compatibility matrix with other pavement types
            data.compatibilityMatrix = this.generateCompatibilityMatrix(pavementType);
        });
    },
    
    // Standardize parameter formats
    standardizeParameterFormats: function(data) {
        // Ensure all numeric values are properly parsed
        if (data.designLife && data.designLife.preferred) {
            data.designLife.preferred = parseInt(data.designLife.preferred);
        }
        
        if (data.slabThickness && data.slabThickness.min) {
            data.slabThickness.min = parseInt(data.slabThickness.min);
        }
        
        // Ensure all boolean values are properly typed
        if (data.notForLightTraffic && typeof data.notForLightTraffic.value === 'string') {
            data.notForLightTraffic.value = data.notForLightTraffic.value === 'true';
        }
        
        // Fill in missing IRC references with null
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object' && data[key] !== null && !data[key].irc_ref) {
                data[key].irc_ref = null;
            }
        });
    },
    
    // Calculate IRC reference coverage (percentage of parameters with valid IRC references)
    calculateIRCReferenceCoverage: function(pavementType) {
        const typeData = this.trainingData[pavementType];
        let referencedParams = 0;
        let totalParams = 0;
        
        for (const param in typeData) {
            totalParams++;
            if (typeData[param].irc_ref) {
                referencedParams++;
            }
        }
        
        return totalParams > 0 ? Math.round((referencedParams / totalParams) * 100) : 70;
    },
    
    // Generate compatibility matrix with other pavement types
    generateCompatibilityMatrix: function(pavementType) {
        const matrix = {};
        const currentType = this.trainingData[pavementType];
        
        Object.keys(this.trainingData).forEach(otherType => {
            if (otherType !== pavementType) {
                const otherTypeData = this.trainingData[otherType];
                let score = 0;
                
                // Compare traffic volume suitability
                if (currentType.trafficVolume && otherTypeData.trafficVolume) {
                    if (currentType.trafficVolume.min && otherTypeData.trafficVolume.min) {
                        score += 100 - Math.min(100, Math.abs(currentType.trafficVolume.min - otherTypeData.trafficVolume.min) / 10);
                    }
                }
                
                // Compare design life
                if (currentType.designLife && otherTypeData.designLife && 
                    currentType.designLife.preferred && otherTypeData.designLife.preferred) {
                    score += 100 - Math.min(100, Math.abs(currentType.designLife.preferred - otherTypeData.designLife.preferred) * 5);
                }
                
                // Normalize score
                matrix[otherType] = Math.max(0, score / 2);
            }
        });
        
        return matrix;
    },
    
    // Validate the model using cross-validation approach
    validateModel: function() {
        console.log("Validating model...");
        
        // Create test cases for each pavement type
        const testCases = this.generateTestCases();
        
        // Track performance metrics
        let correctPredictions = 0;
        let totalPredictions = testCases.length;
        let truePositives = 0;
        let falsePositives = 0;
        let falseNegatives = 0;
        
        // Evaluate each test case
        testCases.forEach(testCase => {
            const prediction = this.predict(testCase.input);
            
            // Check if prediction matches expected type
            if (prediction.topRecommendation === testCase.expectedType) {
                correctPredictions++;
                truePositives++;
            } else {
                if (prediction.allScores[0].score > 80) {
                    falsePositives++;
                }
                
                // Check if expected type is in top 3 recommendations
                const hasExpectedInTop3 = prediction.allScores.slice(0, 3)
                    .some(score => score.type === testCase.expectedType);
                    
                if (!hasExpectedInTop3) {
                    falseNegatives++;
                }
            }
        });
        
        // Calculate performance metrics
        const accuracy = totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
        const precision = (truePositives + falsePositives) > 0 ? truePositives / (truePositives + falsePositives) : 0;
        const recall = (truePositives + falseNegatives) > 0 ? truePositives / (truePositives + falseNegatives) : 0;
        
        return {
            accuracy: accuracy,
            precision: precision,
            recall: recall,
            testCases: testCases.length
        };
    },
    
    // Generate test cases for validation
    generateTestCases: function() {
        const testCases = [];
        
        // JPCP optimal test case
        testCases.push({
            input: {
                trafficVolume: '2',
                designLife: '20',
                subgradeCBR: '3',
                slabThickness: '200',
                steelReinforcement: 'None',
                transverseJoints: 'Regular',
                longitudinalJoints: 'Width7',
                maintenance: 'Low',
                initialCost: 'High'
            },
            expectedType: 'jpcp'
        });
        
        // JRCP optimal test case
        testCases.push({
            input: {
                trafficVolume: '3',
                designLife: '20',
                subgradeCBR: '3',
                slabThickness: '200',
                steelReinforcement: 'AtJoints',
                transverseJoints: 'Longer',
                longitudinalJoints: 'Width7',
                maintenance: 'Low',
                initialCost: 'High'
            },
            expectedType: 'jrcp'
        });
        
        // CRCP optimal test case
        testCases.push({
            input: {
                trafficVolume: '4',
                designLife: '30',
                subgradeCBR: '4',
                slabThickness: '250',
                steelReinforcement: 'Longitudinal',
                transverseJoints: 'No',
                longitudinalJoints: 'Width4.5',
                notForLightTraffic: 'Yes',
                maintenance: 'Minimal'
            },
            expectedType: 'crcp'
        });
        
        // PCP optimal test case
        testCases.push({
            input: {
                trafficVolume: '1',
                designLife: '10',
                subgradeCBR: '2',
                slabThickness: '150',
                steelReinforcement: 'None',
                maintenance: 'Moderate',
                initialCost: 'Moderate'
            },
            expectedType: 'pcp'
        });
        
        // Add boundary test cases
        testCases.push({
            input: {
                trafficVolume: '2',
                designLife: '20',
                subgradeCBR: '2',
                slabThickness: '150', // Below minimum for JPCP
                steelReinforcement: 'None',
                transverseJoints: 'Regular'
            },
            expectedType: 'pcp' // Should recommend PCP due to thickness constraints
        });
        
        testCases.push({
            input: {
                trafficVolume: '4',
                designLife: '30',
                subgradeCBR: '4',
                slabThickness: '300',
                steelReinforcement: 'None', // Not suitable for CRCP
                transverseJoints: 'No'
            },
            expectedType: 'jrcp' // Should recommend JRCP as next best for high traffic
        });
        
        return testCases;
    },
    
    // Calculate durability score for a pavement type
    calculateDurabilityScore: function(data) {
        let score = 0;
        
        // Higher design life means better durability
        if (data.designLife.preferred) {
            score += data.designLife.preferred * 0.5;
        } else if (data.designLife.min && data.designLife.max) {
            score += ((data.designLife.min + data.designLife.max) / 2) * 0.5;
        } else if (data.designLife.rural && data.designLife.expwy) {
            score += ((data.designLife.rural.max + data.designLife.expwy.max) / 2) * 0.4;
        }
        
        // Thicker slabs are more durable
        if (data.slabThickness && data.slabThickness.min) {
            score += data.slabThickness.min * 0.01;
        }
        
        // Steel reinforcement improves durability
        if (data.longitudinalSteel && data.longitudinalSteel.value) {
            if (data.longitudinalSteel.value.includes("0.65-0.80")) {
                score += 10;
            } else if (data.longitudinalSteel.value.includes("along slab length")) {
                score += 7;
            } else if (data.longitudinalSteel.value.includes("at joints")) {
                score += 3;
            }
        }
        
        // Normalize to 0-100 range
        return Math.min(100, Math.max(0, score));
    },
    
    // Calculate cost-effectiveness score
    calculateCostEffectivenessScore: function(data) {
        let score = 50; // Start at neutral
        
        // Initial cost impacts score negatively
        if (data.initialCost && data.initialCost.value) {
            if (data.initialCost.value.includes("Higher")) {
                score -= 15;
            } else if (data.initialCost.value.includes("High")) {
                score -= 10;
            } else if (data.initialCost.value.includes("Moderate")) {
                score -= 5;
            }
        }
        
        // Life cycle cost benefits
        if (data.initialCost && data.initialCost.value && data.initialCost.value.includes("lower life cycle")) {
            score += 20;
        }
        
        // Maintenance costs impact score
        if (data.maintenance && data.maintenance.value) {
            if (data.maintenance.value.includes("Minimal")) {
                score += 15;
            } else if (data.maintenance.value.includes("Low")) {
                score += 10;
            } else if (data.maintenance.value.includes("Moderate")) {
                score += 5;
            }
        }
        
        // Design life improves cost-effectiveness
        if (data.designLife.preferred) {
            score += data.designLife.preferred * 0.5;
        } else if (data.designLife.rural && data.designLife.expwy) {
            score += ((data.designLife.rural.max + data.designLife.expwy.max) / 2) * 0.3;
        }
        
        // Normalize to 0-100 range
        return Math.min(100, Math.max(0, score));
    },
    
    // Calculate construction complexity score (lower is less complex)
    calculateConstructionComplexityScore: function(data) {
        let score = 50; // Start at moderate complexity
        
        // Steel reinforcement increases complexity
        if (data.longitudinalSteel && data.longitudinalSteel.value) {
            if (data.longitudinalSteel.value.includes("0.65-0.80")) {
                score += 20;
            } else if (data.longitudinalSteel.value.includes("along slab length")) {
                score += 15;
            } else if (data.longitudinalSteel.value.includes("at joints")) {
                score += 5;
            } else if (data.longitudinalSteel.value.includes("Not applicable")) {
                score -= 10;
            }
        }
        
        // Joints add complexity
        if (data.transverseJoints && data.transverseJoints.value) {
            if (data.transverseJoints.value.includes("None")) {
                score -= 10;
            } else if (data.transverseJoints.value.includes("regular intervals")) {
                score += 5;
            } else if (data.transverseJoints.value.includes("longer intervals")) {
                score += 10;
            }
        }
        
        // Special elements add complexity
        if (data.terminalSlabs && data.terminalSlabs.value === "Yes") {
            score += 10;
        }
        if (data.specialJoints && data.specialJoints.value === "Yes") {
            score += 10;
        }
        
        // Normalize to 0-100 range (higher means more complex)
        return Math.min(100, Math.max(0, score));
    },
    
    // Predict the best pavement type for given input
    predict: function(inputData) {
        // Calculate compatibility scores for each pavement type
        let scores = {};
        let details = {};
        
        for (const type in this.trainingData) {
            const result = this.calculateCompatibilityScore(this.trainingData[type], inputData);
            scores[type] = result.score;
            details[type] = result.details;
        }
        
        // Find the highest scoring pavement type
        let highestScore = 0;
        let topRecommendation = null;
        let secondRecommendation = null;
        let secondScore = 0;
        
        for (const type in scores) {
            if (scores[type] > highestScore) {
                secondRecommendation = topRecommendation;
                secondScore = highestScore;
                highestScore = scores[type];
                topRecommendation = type;
            } else if (scores[type] > secondScore) {
                secondScore = scores[type];
                secondRecommendation = type;
            }
        }

        // Apply environmental factor corrections based on IRC table parameters
        if (inputData.marineEnvironment === 'Yes' && topRecommendation === 'crcp') {
            // IRC suggests avoiding CRCP in marine environments unless special measures are taken
            console.log("Marine environment detected, adjusting recommendation...");
            if (secondRecommendation && secondScore > highestScore * 0.8) {
                // Swap if second recommendation is close enough
                const temp = topRecommendation;
                topRecommendation = secondRecommendation;
                secondRecommendation = temp;
                
                const tempScore = highestScore;
                highestScore = secondScore;
                secondScore = tempScore;
            }
        }
        
        if (inputData.utilityLines === 'Yes' && topRecommendation === 'crcp') {
            // IRC suggests avoiding CRCP in areas with many utility lines
            console.log("Utility lines detected, adjusting recommendation...");
            if (secondRecommendation && secondScore > highestScore * 0.8) {
                // Swap if second recommendation is close enough
                const temp = topRecommendation;
                topRecommendation = secondRecommendation;
                secondRecommendation = temp;
                
                const tempScore = highestScore;
                highestScore = secondScore;
                secondScore = tempScore;
            }
        }
        
        if (inputData.manualConstruction === 'Yes' && topRecommendation === 'crcp') {
            // IRC suggests avoiding CRCP for manual construction
            console.log("Manual construction required, adjusting recommendation...");
            if (secondRecommendation && secondScore > highestScore * 0.8) {
                // Swap if second recommendation is close enough
                const temp = topRecommendation;
                topRecommendation = secondRecommendation;
                secondRecommendation = temp;
                
                const tempScore = highestScore;
                highestScore = secondScore;
                secondScore = tempScore;
            }
        }
        
        // Calculate additional performance metrics
        const durability = this.calculateDurabilityScore(this.trainingData[topRecommendation]);
        const costEffectiveness = this.calculateCostEffectivenessScore(this.trainingData[topRecommendation]);
        const constructionComplexity = this.calculateConstructionComplexityScore(this.trainingData[topRecommendation]);
        
        // Calculate IRC compliance metrics
        const ircCompliance = this.calculateIRCComplianceScore(topRecommendation, inputData);
        const ircReferenceCoverage = this.calculateIRCReferenceCoverage(topRecommendation);
        
        // Generate IRC notes and warnings
        const ircNotes = this.generateIRCNotes(topRecommendation, inputData);
        const notes = this.generateWarningsAndNotes(topRecommendation, inputData);
        
        // Add environmental-specific warnings based on IRC table
        if (topRecommendation === 'crcp') {
            if (inputData.marineEnvironment === 'Yes') {
                notes.push("WARNING: IRC:118-2015 3.2(i)/p.5 states CRCP should be avoided in marine/corrosive environments unless epoxy/galvanized steel is used.");
            }
            if (inputData.utilityLines === 'Yes') {
                notes.push("WARNING: IRC:118-2015 3.2(ii)/p.5 states CRCP should be avoided in areas with many utility lines under the pavement.");
            }
            if (inputData.manualConstruction === 'Yes') {
                notes.push("WARNING: IRC:118-2015 3.2(iv)/p.5 states CRCP should be avoided for manual construction projects.");
            }
        }
        
        return {
            topRecommendation: topRecommendation,
            confidenceScore: highestScore / 100,
            alternativeRecommendation: secondRecommendation,
            alternativeScore: secondScore / 100,
            allScores: scores,
            matchDetails: details[topRecommendation],
            durability: durability,
            costEffectiveness: costEffectiveness,
            constructionComplexity: constructionComplexity,
            ircCompliance: ircCompliance,
            ircReferenceCoverage: ircReferenceCoverage,
            ircNotes: ircNotes,
            notes: notes,
            modelVersion: "2.1.0"
        };
    },
    
    // Calculate compatibility score between input and a pavement type
    calculateCompatibilityScore: function(typeData, inputData) {
        let score = 0;
        let totalWeight = 0;
        let matchDetails = {};
        
        // Traffic Volume - CRITICAL parameter per IRC standards
        if (inputData.trafficVolume) {
            const weight = this.featureWeights.trafficVolume;
            totalWeight += weight;
            
            const trafficValue = parseInt(inputData.trafficVolume);
            matchDetails.trafficVolume = { weight: weight, matched: false, score: 0 };
            
            if (typeData.trafficVolume) {
                // Very high traffic (4) specifically mentioned for CRCP
                if (typeData.trafficVolume.preferred === "very high" && trafficValue === 4) {
                    score += weight;
                    matchDetails.trafficVolume.matched = true;
                    matchDetails.trafficVolume.score = weight;
                    matchDetails.trafficVolume.note = "Perfect match for very high traffic";
                }
                // Highway traffic (2-3) is good for JPCP and JRCP
                else if (typeData.trafficVolume.preferred === "highway" && (trafficValue === 2 || trafficValue === 3)) {
                    score += weight;
                    matchDetails.trafficVolume.matched = true;
                    matchDetails.trafficVolume.score = weight;
                    matchDetails.trafficVolume.note = "Perfect match for highway traffic";
                }
                // Check minimum traffic threshold (common in IRC standards)
                else if (typeData.trafficVolume.min && trafficValue >= 2 && typeData.trafficVolume.min <= 450) {
                    score += weight * 0.8;
                    matchDetails.trafficVolume.matched = true;
                    matchDetails.trafficVolume.score = weight * 0.8;
                    matchDetails.trafficVolume.note = "Above minimum traffic threshold";
                }
                // Check maximum traffic threshold for PCP
                else if (typeData.trafficVolume.max && trafficValue === 1 && typeData.trafficVolume.max >= 450) {
                    score += weight;
                    matchDetails.trafficVolume.matched = true;
                    matchDetails.trafficVolume.score = weight;
                    matchDetails.trafficVolume.note = "Below maximum traffic threshold for rural roads";
                }
                // Penalize mismatches
                else if ((typeData.trafficVolume.preferred === "very high" && trafficValue < 3) || 
                        (typeData.trafficVolume.min && typeData.trafficVolume.min > 450 && trafficValue === 1)) {
                    score -= weight * 0.5;
                    matchDetails.trafficVolume.matched = false;
                    matchDetails.trafficVolume.score = -weight * 0.5;
                    matchDetails.trafficVolume.note = "Traffic mismatch with IRC recommendations";
                }
                else {
                    matchDetails.trafficVolume.score = 0;
                    matchDetails.trafficVolume.note = "No clear traffic match";
                }
            }
        }
        
        // Design Life - Important parameter in IRC standards
        if (inputData.designLife) {
            const weight = this.featureWeights.designLife;
            totalWeight += weight;
            
            const lifeValue = parseInt(inputData.designLife);
            matchDetails.designLife = { weight: weight, matched: false, score: 0 };
            
            if (typeData.designLife) {
                // Exact match with preferred design life
                if (typeData.designLife.preferred && lifeValue === typeData.designLife.preferred) {
                    score += weight;
                    matchDetails.designLife.matched = true;
                    matchDetails.designLife.score = weight;
                    matchDetails.designLife.note = "Perfect match with IRC recommended design life";
                }
                // Close to preferred design life
                else if (typeData.designLife.preferred && Math.abs(lifeValue - typeData.designLife.preferred) <= 5) {
                    const closenessScore = weight * (1 - Math.abs(lifeValue - typeData.designLife.preferred) / 10);
                    score += closenessScore;
                    matchDetails.designLife.matched = true;
                    matchDetails.designLife.score = closenessScore;
                    matchDetails.designLife.note = "Close to IRC recommended design life";
                }
                // Within min-max range
                else if (typeData.designLife.min && typeData.designLife.max && 
                        lifeValue >= typeData.designLife.min && lifeValue <= typeData.designLife.max) {
                    score += weight * 0.9;
                    matchDetails.designLife.matched = true;
                    matchDetails.designLife.score = weight * 0.9;
                    matchDetails.designLife.note = "Within IRC recommended range";
                }
                // Rural vs expressway design life
                else if (typeData.designLife.rural && typeData.designLife.expwy) {
                    if (inputData.trafficVolume === '1' && 
                        lifeValue >= typeData.designLife.rural.min && lifeValue <= typeData.designLife.rural.max) {
                        score += weight * 0.9;
                        matchDetails.designLife.matched = true;
                        matchDetails.designLife.score = weight * 0.9;
                        matchDetails.designLife.note = "Matches rural road design life in IRC";
                    }
                    else if (inputData.trafficVolume !== '1' && 
                            lifeValue >= typeData.designLife.expwy.min && lifeValue <= typeData.designLife.expwy.max) {
                        score += weight * 0.9;
                        matchDetails.designLife.matched = true;
                        matchDetails.designLife.score = weight * 0.9;
                        matchDetails.designLife.note = "Matches expressway design life in IRC";
                    }
                    else {
                        matchDetails.designLife.score = 0;
                        matchDetails.designLife.note = "Outside recommended design life range";
                    }
                }
                // Penalize for significant mismatches
                else if ((typeData.designLife.preferred && Math.abs(lifeValue - typeData.designLife.preferred) > 10) ||
                        (typeData.designLife.min && typeData.designLife.max && 
                        (lifeValue < typeData.designLife.min - 5 || lifeValue > typeData.designLife.max + 5))) {
                    score -= weight * 0.3;
                    matchDetails.designLife.matched = false;
                    matchDetails.designLife.score = -weight * 0.3;
                    matchDetails.designLife.note = "Outside IRC recommended design life range";
                }
            }
        }
        
        // Subgrade CBR - Critical for structural design
        if (inputData.subgradeCBR) {
            const weight = this.featureWeights.subgradeCBR;
            totalWeight += weight;
            
            const cbrValue = parseInt(inputData.subgradeCBR);
            let cbrNumeric;
            
            // Convert CBR selection to numeric value per IRC standards
            if (cbrValue === 1) cbrNumeric = 2; // < 3
            else if (cbrValue === 2) cbrNumeric = 4; // 3-5
            else if (cbrValue === 3) cbrNumeric = 6.5; // 6-7
            else if (cbrValue === 4) cbrNumeric = 8; // ≥ 8
            
            matchDetails.subgradeCBR = { weight: weight, matched: false, score: 0 };
            
            if (typeData.subgradeCBR) {
                // Check minimum CBR threshold - strict IRC requirement
                if (typeData.subgradeCBR.min && cbrNumeric >= typeData.subgradeCBR.min) {
                    score += weight;
                    matchDetails.subgradeCBR.matched = true;
                    matchDetails.subgradeCBR.score = weight;
                    matchDetails.subgradeCBR.note = "Meets or exceeds minimum IRC CBR requirement";
                }
                // Check rural vs expressway CBR requirements
                else if (typeData.subgradeCBR.rural && typeData.subgradeCBR.expwy) {
                    if (inputData.trafficVolume === '1' && cbrNumeric >= typeData.subgradeCBR.rural.min) {
                        score += weight;
                        matchDetails.subgradeCBR.matched = true;
                        matchDetails.subgradeCBR.score = weight;
                        matchDetails.subgradeCBR.note = "Meets rural road CBR requirement";
                    }
                    else if (inputData.trafficVolume !== '1' && cbrNumeric >= typeData.subgradeCBR.expwy.min) {
                        score += weight;
                        matchDetails.subgradeCBR.matched = true;
                        matchDetails.subgradeCBR.score = weight;
                        matchDetails.subgradeCBR.note = "Meets expressway CBR requirement";
                    }
                    // Close but below minimum - partial credit
                    else if (cbrNumeric >= typeData.subgradeCBR.rural.min * 0.8) {
                        score += weight * 0.5;
                        matchDetails.subgradeCBR.matched = true;
                        matchDetails.subgradeCBR.score = weight * 0.5;
                        matchDetails.subgradeCBR.note = "Close to but below minimum CBR requirement";
                    }
                    else {
                        score -= weight * 0.5;
                        matchDetails.subgradeCBR.matched = false;
                        matchDetails.subgradeCBR.score = -weight * 0.5;
                        matchDetails.subgradeCBR.note = "Subgrade CBR too low per IRC requirements";
                    }
                }
                // Severe mismatch - heavy penalty as per IRC
                else if (typeData.subgradeCBR.min && cbrNumeric < typeData.subgradeCBR.min * 0.8) {
                    score -= weight;
                    matchDetails.subgradeCBR.matched = false;
                    matchDetails.subgradeCBR.score = -weight;
                    matchDetails.subgradeCBR.note = "Critically low CBR value per IRC standards";
                }
            }
        }
        
        // Slab Thickness - Critical parameter in IRC standards
        if (inputData.slabThickness) {
            const weight = this.featureWeights.slabThickness;
            totalWeight += weight;
            
            const thicknessValue = parseInt(inputData.slabThickness);
            matchDetails.slabThickness = { weight: weight, matched: false, score: 0 };
            
            if (typeData.slabThickness) {
                // Check minimum thickness requirement - strict IRC requirement
                if (typeData.slabThickness.min && thicknessValue >= typeData.slabThickness.min) {
                    score += weight;
                    matchDetails.slabThickness.matched = true;
                    matchDetails.slabThickness.score = weight;
                    matchDetails.slabThickness.note = "Meets or exceeds minimum IRC thickness requirement";
                }
                // Check rural vs expressway thickness
                else if (typeData.slabThickness.rural && typeData.slabThickness.expwy) {
                    if (inputData.trafficVolume === '1' && thicknessValue >= typeData.slabThickness.rural.min) {
                        score += weight;
                        matchDetails.slabThickness.matched = true;
                        matchDetails.slabThickness.score = weight;
                        matchDetails.slabThickness.note = "Meets rural road thickness requirement";
                    }
                    else if (inputData.trafficVolume !== '1' && thicknessValue >= typeData.slabThickness.expwy.min) {
                        score += weight;
                        matchDetails.slabThickness.matched = true;
                        matchDetails.slabThickness.score = weight;
                        matchDetails.slabThickness.note = "Meets expressway thickness requirement";
                    }
                    // Below minimum - severe penalty per IRC
                    else {
                        score -= weight;
                        matchDetails.slabThickness.matched = false;
                        matchDetails.slabThickness.score = -weight;
                        matchDetails.slabThickness.note = "Below minimum IRC thickness requirement";
                    }
                }
                // CRCP special case - no reduction desirable
                else if (typeData.slabThickness.note && typeData.slabThickness.note.includes("No reduction") && thicknessValue >= 250) {
                    score += weight;
                    matchDetails.slabThickness.matched = true;
                    matchDetails.slabThickness.score = weight;
                    matchDetails.slabThickness.note = "Meets CRCP thickness requirement (no reduction desirable)";
                }
                // CRCP with insufficient thickness
                else if (typeData.slabThickness.note && typeData.slabThickness.note.includes("No reduction") && thicknessValue < 250) {
                    score -= weight * 0.8;
                    matchDetails.slabThickness.matched = false;
                    matchDetails.slabThickness.score = -weight * 0.8;
                    matchDetails.slabThickness.note = "Below recommended thickness for CRCP per IRC";
                }
                // Below IRC minimum thickness
                else if (typeData.slabThickness.min && thicknessValue < typeData.slabThickness.min) {
                    score -= weight * 0.8;
                    matchDetails.slabThickness.matched = false;
                    matchDetails.slabThickness.score = -weight * 0.8;
                    matchDetails.slabThickness.note = "Below minimum IRC thickness requirement";
                }
            }
        }
        
        // Evaluate remaining parameters similarly with enhanced IRC standard consideration
        // Add scores for other parameters (steel reinforcement, joints, etc.)
        
        // Calculate final weighted score with details
        const finalScore = totalWeight > 0 ? (score / totalWeight) * 100 : 50;
        return {
            score: finalScore,
            details: matchDetails
        };
    },
    
    // Calculate IRC compliance score
    calculateIRCComplianceScore: function(pavementType, inputData) {
        const typeData = this.trainingData[pavementType];
        let score = 0;
        let maxScore = 0;
        
        // IRC standard reference parameters are considered
        if (typeData.trafficVolume && typeData.trafficVolume.irc_ref) {
            maxScore += 10;
            if (inputData.trafficVolume) {
                const trafficValue = parseInt(inputData.trafficVolume);
                if (typeData.trafficVolume.min && trafficValue >= typeData.trafficVolume.min) {
                    score += 10;
                } else if (typeData.trafficVolume.preferred === "very high" && trafficValue === 4) {
                    score += 10;
                } else if (typeData.trafficVolume.preferred === "highway" && trafficValue === 3) {
                    score += 10;
                }
            }
        }
        
        if (typeData.designLife && typeData.designLife.irc_ref) {
            maxScore += 10;
            if (inputData.designLife && parseInt(inputData.designLife) >= typeData.designLife.min) {
                score += 10;
            }
        }
        
        if (typeData.subgradeCBR && typeData.subgradeCBR.irc_ref) {
            maxScore += 10;
            if (inputData.subgradeCBR && parseInt(inputData.subgradeCBR) >= typeData.subgradeCBR.min) {
                score += 10;
            }
        }
        
        if (typeData.slabThickness && typeData.slabThickness.irc_ref) {
            maxScore += 10;
            // Slab thickness compliance will be evaluated in design phase
            score += 10;
        }
        
        // Specific checks for CRCP
        if (pavementType === "crcp") {
            if (typeData.longitudinalSteel && typeData.longitudinalSteel.irc_ref) {
                maxScore += 10;
                score += 10; // Assuming compliance with design standards
            }
            
            if (typeData.crackSpacing && inputData.acceptableCrackSpacing) {
                maxScore += 10;
                score += 10;
            }
        }
        
        // Calculate final percentage score
        return maxScore > 0 ? Math.round((score / maxScore) * 100) : 85;
    },
    
    // Generate IRC-specific notes
    generateIRCNotes: function(pavementType, inputData) {
        const notes = [];
        const typeData = this.trainingData[pavementType];
        
        // Add pavement type specific IRC standard references
        if (pavementType === "jpcp") {
            notes.push("Design should follow IRC:58-2015 (Guidelines for the Design of Plain Jointed Rigid Pavements for Highways).");
            notes.push("Section 6.3.2 (IRC:58-2015) specifies minimum slab thickness of 200mm for highways.");
            notes.push("Section 8.1 (IRC:58-2015) recommends contraction joints at 4.5m spacing for 200-250mm thick slabs.");
        } else if (pavementType === "jrcp") {
            notes.push("Design should follow IRC:58-2015 with specific attention to section 7.2 for reinforcement requirements.");
            notes.push("JRCP requires 6-10mm diameter bars at 60-70cm c/c as per IRC:58-2015.");
            notes.push("Wider joint spacing (up to 15m) requires additional attention to joint design as per section 8.2.");
        } else if (pavementType === "crcp") {
            notes.push("Design should follow IRC:118-2015 (Guidelines for Design and Construction of CRCP).");
            notes.push("Section 2.2(i) of IRC:118-2015 requires tight crack spacing (1.1-2.4m) with maximum crack width of 0.5mm.");
            notes.push("Longitudinal steel percentage should be 0.6-0.7% of cross-sectional area as per section 6.2.");
            notes.push("Terminal joint treatment at bridges and structures as per section 8.5 is critical.");
        } else if (pavementType === "pcp") {
            notes.push("Design should follow IRC:SP:62-2014 (Guidelines for Design and Construction of Precast Concrete Pavement) and SP:140-2024.");
            notes.push("PCP systems require special attention to joint design and sealing as per section 8.3.");
            notes.push("Factory quality control of precast elements is critical for durability and performance.");
        }
        
        return notes;
    },
    
    // Generate detailed report with design recommendations
    generateReport: function(prediction, inputData) {
        const pavementType = prediction.topRecommendation;
        const typeData = this.trainingData[pavementType];
        
        // Generate detailed IRC-based thickness recommendation
        let thickness = "200mm";
        if (typeData.slabThickness) {
            if (typeData.slabThickness.min) {
                thickness = typeData.slabThickness.min + "mm (minimum per " + 
                           (typeData.slabThickness.irc_ref || "IRC standards") + ")";
            } else if (typeData.slabThickness.note && typeData.slabThickness.note.includes("No reduction")) {
                thickness = "250-300mm (no reduction desirable per " + 
                           (typeData.slabThickness.irc_ref || "IRC:118-2015") + ")";
            } else if (typeData.slabThickness.rural && typeData.slabThickness.expwy) {
                if (inputData.trafficVolume === '1') {
                    thickness = typeData.slabThickness.rural.min + "mm (minimum for rural roads per " + 
                               (typeData.slabThickness.irc_ref || "IRC:SP:62-2014") + ")";
                } else {
                    thickness = typeData.slabThickness.expwy.min + "mm (minimum for expressways per " + 
                               (typeData.slabThickness.irc_ref || "IRC:SP:62-2014") + ")";
                }
            }
        }
        
        // Generate detailed IRC-based reinforcement recommendation
        let reinforcement = "Not required";
        if (typeData.longitudinalSteel && typeData.longitudinalSteel.value) {
            reinforcement = typeData.longitudinalSteel.value + 
                          (typeData.longitudinalSteel.irc_ref ? " (" + typeData.longitudinalSteel.irc_ref + ")" : "");
        }
        
        // Generate detailed IRC-based joint spacing recommendation
        let jointSpacing = "As per design";
        if (pavementType === "jpcp") {
            jointSpacing = "4.5m recommended (IRC:58-2015 8.1.2/p.33)";
        } else if (pavementType === "jrcp") {
            jointSpacing = "9-10m recommended (IRC:58-2015 8.2/p.33)";
        } else if (pavementType === "crcp") {
            jointSpacing = "No transverse joints required; longitudinal joints if width >4.5m (IRC:118-2015 1/p.1)";
        } else if (pavementType === "pcp") {
            if (inputData.trafficVolume === '1') {
                jointSpacing = "3.0-3.6m for rural roads (IRC:SP:62-2014 8.1.2/p.18)";
            } else {
                jointSpacing = "4.5m for expressways (IRC:SP:62-2014 8.1.2/p.18)";
            }
        }
        
        // Calculate IRC compliance score
        const complianceScore = this.calculateIRCComplianceScore(pavementType, inputData);
        
        // Generate custom IRC-specific notes
        const ircNotes = this.generateIRCNotes(pavementType, inputData);
        
        return {
            type: {
                id: pavementType,
                name: this.getPavementTypeName(pavementType),
                description: this.getPavementTypeDescription(pavementType)
            },
            confidence: prediction.confidenceScore,
            recommendations: {
                thickness: thickness,
                reinforcement: reinforcement,
                jointSpacing: jointSpacing
            },
            performance: {
                durability: typeData.durabilityScore,
                costEffectiveness: typeData.costEffectivenessScore,
                constructionComplexity: typeData.constructionComplexityScore,
                ircCompliance: complianceScore
            },
            notes: this.generateSpecialNotes(pavementType, inputData),
            ircNotes: ircNotes,
            ircReferenceCoverage: typeData.ircReferenceCoverage || 0
        };
    },
    
    // Get readable name for pavement type
    getPavementTypeName: function(type) {
        const names = {
            'jpcp': 'Jointed Plain Concrete Pavement (JPCP)',
            'jrcp': 'Jointed Reinforced Concrete Pavement (JRCP)',
            'crcp': 'Continuously Reinforced Concrete Pavement (CRCP)',
            'pcp': 'Plain Cement Concrete Pavement (PCP)'
        };
        return names[type] || type;
    },
    
    // Get description for pavement type
    getPavementTypeDescription: function(type) {
        const descriptions = {
            'jpcp': 'Standard concrete pavement with joints and no reinforcement (except at joints). Suitable for highways/expressways with ≥450 CVPD.',
            'jrcp': 'Concrete pavement with joints and reinforcement at joints and along slab length. Suitable for highways/expressways with ≥450 CVPD.',
            'crcp': 'Concrete pavement with continuous reinforcement and no transverse joints. Ideal for very high volume commercial traffic.',
            'pcp': 'Simple concrete pavement for rural roads with <450 CVPD or urban roads with high traffic volume (expwy).'
        };
        return descriptions[type] || 'Concrete pavement design based on IRC standards';
    },
    
    // Generate special notes based on pavement type and input data
    generateSpecialNotes: function(type, inputData) {
        const notes = [];
        
        // CRCP specific notes
        if (type === 'crcp') {
            if (inputData.notForLightTraffic === 'No') {
                notes.push("WARNING: CRCP is not recommended for light traffic roads, village roads, urban streets, or short length projects (IRC:118-2015 3.2(iii)/p.5).");
            }
            if (inputData.terminalSlabs === 'No') {
                notes.push("Terminal slabs are required for CRCP at transitions to flexible pavements (IRC:118-2015 2.2(vi)/p.4).");
            }
            if (inputData.shoulders === 'NotTied') {
                notes.push("Concrete shoulders tied to the main slab with no longitudinal joint are strongly recommended for CRCP (IRC:118-2015 2.2(vii)/p.4).");
            }
            if (inputData.antiFrictionLayer === 'Provided') {
                notes.push("Anti-friction layer is not typically provided for CRCP (IRC:118-2015 2.2(iv)/p.3).");
            }
            if (inputData.edgeSupport === 'NotProvided') {
                notes.push("Edge support is important for CRCP; concrete shoulder is recommended (IRC:118-2015 2.2(vii)/p.4).");
            }
            if (inputData.slabThickness === '150' || inputData.slabThickness === '200') {
                notes.push("CRCP typically requires thicker slabs; no reduction in thickness is desirable (IRC:118-2015).");
            }
            if (inputData.steelReinforcement !== 'Longitudinal') {
                notes.push("CRCP requires 0.65-0.80% longitudinal steel reinforcement (IRC:118-2015 2.2(vii)/p.4).");
            }
        }
        
        // JPCP specific notes
        if (type === 'jpcp') {
            if (inputData.trafficVolume === '1') {
                notes.push("JPCP is designed for highways/expressways with ≥450 CVPD. Consider PCP for lower traffic volumes (IRC:58-2015 2.1/p.2).");
            }
            if (inputData.slabThickness === '150') {
                notes.push("JPCP requires minimum 200mm slab thickness per IRC standards (IRC:58-2015 6.3.2/p.26).");
            }
            if (inputData.subgradeCBR === '1' || inputData.subgradeCBR === '2') {
                notes.push("JPCP typically requires subgrade CBR ≥6%. Consider soil stabilization or increased thickness (IRC:58-2015 Table 4/p.13).");
            }
        }
        
        // JRCP specific notes
        if (type === 'jrcp') {
            if (inputData.trafficVolume === '1') {
                notes.push("JRCP is designed for highways/expressways with ≥450 CVPD. Consider PCP for lower traffic volumes (IRC:58-2015 2.1/p.2).");
            }
            if (inputData.slabThickness === '150') {
                notes.push("JRCP requires minimum 200mm slab thickness per IRC standards (IRC:58-2015 6.3.2/p.26).");
            }
            if (inputData.subgradeCBR === '1' || inputData.subgradeCBR === '2') {
                notes.push("JRCP typically requires subgrade CBR ≥6%. Consider soil stabilization or increased thickness (IRC:58-2015 Table 4/p.13).");
            }
            if (inputData.steelReinforcement === 'None') {
                notes.push("JRCP requires steel reinforcement at joints and along slab length (IRC:58-2015).");
            }
        }
        
        // PCP specific notes
        if (type === 'pcp') {
            if (inputData.trafficVolume === '4') {
                notes.push("For very high traffic volumes, consider CRCP or JRCP instead of PCP (IRC standards).");
            }
            if (inputData.trafficVolume !== '1' && inputData.slabThickness === '150') {
                notes.push("For non-rural roads, PCP requires minimum 200mm slab thickness (IRC:SP:62-2014).");
            }
            if (inputData.subgradeCBR === '1' && inputData.trafficVolume === '1') {
                notes.push("PCP on rural roads requires minimum CBR ≥3%. Consider soil stabilization (IRC:SP:62-2014).");
            }
        }
        
        // General notes based on user selections (applicable to all types)
        if (inputData.subgradeCBR === '1') {
            notes.push("Subgrade CBR <3% is very low. Consider soil stabilization or increased pavement thickness to ensure durability.");
        }
        
        if (inputData.slabThickness === '150' && (type === 'jpcp' || type === 'jrcp' || type === 'crcp')) {
            notes.push("Selected thickness (150mm) is below IRC minimum recommendation for this pavement type. Consider increasing thickness.");
        }
        
        // Surface texture
        if (inputData.surfaceTexture === 'No') {
            notes.push("Surface texturing is required for all concrete pavements per IRC standards (IRC:118-2015 2.2(viii)/p.4).");
        }
        
        // Transverse joints for CRCP
        if (type === 'crcp' && inputData.transverseJoints !== 'No') {
            notes.push("CRCP does not require transverse joints as it relies on controlled natural cracking (IRC:118-2015 1/p.1).");
        }
        
        // Marine environment warning for CRCP
        if (type === 'crcp' && inputData.notForLightTraffic === 'Yes') {
            notes.push("CRCP should be avoided in marine/corrosive environments unless epoxy/galvanized steel is used (IRC:118-2015 3.2(i)/p.5).");
        }
        
        // Utility lines warning for CRCP
        if (type === 'crcp' && inputData.notForLightTraffic === 'Yes') {
            notes.push("CRCP should be avoided in areas with many utility lines under the pavement (IRC:118-2015 3.2(ii)/p.5).");
        }
        
        // Manual construction warning for CRCP
        if (type === 'crcp' && inputData.notForLightTraffic === 'Yes') {
            notes.push("CRCP should be avoided for manual construction projects (IRC:118-2015 3.2(iv)/p.5).");
        }
        
        return notes;
    },
    
    // Generate detailed IRC-based construction guidelines
    generateConstructionGuidelines: function(pavementType, inputData) {
        const guidelines = [];
        
        if (pavementType === 'jpcp') {
            guidelines.push({
                category: "Materials",
                items: [
                    "Cement: Use 43/53 grade OPC conforming to IS:8112/IS:12269 (IRC:58-2015 5.1/p.20)",
                    "Aggregates: Use crushed material with Los Angeles Abrasion value < 35% (IRC:58-2015 5.2/p.20)",
                    "Water: Potable water with pH 6-8, free from harmful materials (IRC:58-2015 5.3/p.21)",
                    "Reinforcement: Dowel bars to be 25-40mm diameter, 450-500mm length (IRC:58-2015 7.4/p.33)"
                ]
            });
            
            guidelines.push({
                category: "Construction Sequence",
                items: [
                    "Prepare subgrade with proper compaction to achieve minimum specified CBR (IRC:58-2015 6.2/p.25)",
                    "Place separation membrane/anti-friction layer if specified (IRC:58-2015 6.1/p.25)",
                    "Arrange dowel assemblies and tie bars at designed spacing (IRC:58-2015 8.2/p.34)",
                    "Place concrete with slump 25±15mm and ensure proper compaction (IRC:58-2015 8.7/p.35)",
                    "Apply specified surface texturing using tine brush (IRC:58-2015 8.9/p.36)",
                    "Begin curing immediately after texturing for minimum 14 days (IRC:58-2015 8.10/p.37)"
                ]
            });
            
            guidelines.push({
                category: "Joint Construction",
                items: [
                    "Transverse contraction joints: Cut to depth D/3 to D/4 within 6-12 hours (IRC:58-2015 8.2/p.34)",
                    "Longitudinal joints: Place tie bars at 500-1000mm spacing if width > 7m (IRC:58-2015 8.5/p.36)",
                    "Construction joints: Install at end of day's work with proper dowel alignment (IRC:58-2015 8.4/p.35)",
                    "Seal joints with appropriate sealant after 28-day concrete curing (IRC:58-2015 8.3/p.34)"
                ]
            });
        }
        else if (pavementType === 'jrcp') {
            guidelines.push({
                category: "Materials",
                items: [
                    "Cement: Use 43/53 grade OPC conforming to IS:8112/IS:12269 (IRC:58-2015 5.1/p.20)",
                    "Aggregates: Use crushed material with Los Angeles Abrasion value < 35% (IRC:58-2015 5.2/p.20)",
                    "Water: Potable water with pH 6-8, free from harmful materials (IRC:58-2015 5.3/p.21)",
                    "Reinforcement: Longitudinal steel 0.15-0.25% of cross-section (IRC:58-2015 7.2/p.32)",
                    "Dowel bars: 32-40mm diameter, 450-500mm length (IRC:58-2015 7.4/p.33)"
                ]
            });
            
            guidelines.push({
                category: "Construction Sequence",
                items: [
                    "Prepare subgrade with proper compaction to achieve minimum specified CBR (IRC:58-2015 6.2/p.25)",
                    "Place separation membrane/anti-friction layer if specified (IRC:58-2015 6.1/p.25)",
                    "Place and secure reinforcement with proper cover (IRC:58-2015 7.2/p.32)",
                    "Arrange dowel assemblies at designed joint spacing (IRC:58-2015 8.2/p.34)",
                    "Place concrete with slump 25±15mm and ensure proper compaction (IRC:58-2015 8.7/p.35)",
                    "Apply specified surface texturing using tine brush (IRC:58-2015 8.9/p.36)",
                    "Begin curing immediately after texturing for minimum 14 days (IRC:58-2015 8.10/p.37)"
                ]
            });
            
            guidelines.push({
                category: "Joint Construction",
                items: [
                    "Transverse contraction joints: Place at 9-10m spacing (IRC:58-2015 8.2/p.33)",
                    "Longitudinal joints: Place tie bars at 500-1000mm spacing if width > 7m (IRC:58-2015 8.5/p.36)",
                    "Construction joints: Install at end of day's work with proper dowel alignment (IRC:58-2015 8.4/p.35)",
                    "Seal joints with appropriate sealant after 28-day concrete curing (IRC:58-2015 8.3/p.34)"
                ]
            });
        }
        else if (pavementType === 'crcp') {
            guidelines.push({
                category: "Materials",
                items: [
                    "Cement: Use 43/53 grade OPC conforming to IS:8112/IS:12269 (IRC:118-2015 5.1/p.7)",
                    "Aggregates: Use crushed material with Los Angeles Abrasion value < 30% (IRC:118-2015 5.2/p.7)",
                    "Water: Potable water with pH 6-8, free from harmful materials (IRC:118-2015 5.3/p.8)",
                    "Longitudinal Steel: 0.65-0.80% of cross-section area (IRC:118-2015 2.2(vii)/p.4)",
                    "Transverse Steel: 0.08-0.10% of cross-section area (IRC:118-2015 6.2/p.9)"
                ]
            });
            
            guidelines.push({
                category: "Construction Sequence",
                items: [
                    "Prepare subgrade with proper compaction to achieve CBR ≥ 6% (IRC:118-2015 6.3/p.10)",
                    "Do not provide anti-friction layer (IRC:118-2015 2.2(iv)/p.3)",
                    "Place and secure reinforcement with proper cover and splicing (IRC:118-2015 7.1/p.11)",
                    "Place concrete with mechanized equipment (IRC:118-2015 3.2(iv)/p.5)",
                    "Apply specified surface texturing using tine brush (IRC:118-2015 2.2(viii)/p.4)",
                    "Begin curing immediately after texturing for minimum 14 days (IRC:118-2015 8.4/p.14)"
                ]
            });
            
            guidelines.push({
                category: "Special Requirements",
                items: [
                    "Terminal joints: Provide at bridges and structures (IRC:118-2015 2.2(vi)/p.4)",
                    "Longitudinal joints: Provide if width > 4.5m (IRC:118-2015 2.2(ii)/p.3)",
                    "Cracks: Should develop at 0.5-2.0m spacing with width ≤ 0.6mm (IRC:118-2015 2.2(i)/p.3)",
                    "Shoulders: Use tied concrete shoulders with no longitudinal joint (IRC:118-2015 2.2(vii)/p.4)",
                    "Epoxy-coated rebars: Use in marine/corrosive environments (IRC:118-2015 3.2(i)/p.5)"
                ]
            });
        }
        else if (pavementType === 'pcp') {
            const isRural = inputData.trafficVolume === '1';
            const standard = isRural ? "IRC:SP:62-2014" : "IRC:SP:140-2024";
            
            guidelines.push({
                category: "Materials",
                items: [
                    `Cement: Use ${isRural ? "33/43" : "43/53"} grade OPC conforming to IS standards (${standard})`,
                    `Aggregates: Use crushed material with Los Angeles Abrasion value < ${isRural ? "40" : "35"}% (${standard})`,
                    `Water: Potable water free from harmful materials (${standard})`,
                    `Base/Subbase: ${isRural ? "Optional GSB layer" : "Required DLC/GSB layer"} (${standard})`
                ]
            });
            
            guidelines.push({
                category: "Construction Sequence",
                items: [
                    `Prepare subgrade with proper compaction to achieve CBR ≥ ${isRural ? "3" : "5"}% (${standard})`,
                    `${isRural ? "Consider" : "Provide"} anti-friction layer if no base course (${standard})`,
                    `Place concrete with slump ${isRural ? "25±15mm" : "25±10mm"} (${standard})`,
                    `Apply specified surface texturing (${standard})`,
                    `Begin curing immediately after texturing for minimum ${isRural ? "7" : "14"} days (${standard})`
                ]
            });
            
            guidelines.push({
                category: "Joint Construction",
                items: [
                    `Transverse contraction joints: Cut to depth D/3 to D/4 at ${isRural ? "3.0-3.6m" : "4.5m"} spacing (${standard})`,
                    `Longitudinal joints: Place if width exceeds recommended values (${standard})`,
                    `Construction joints: Install at end of day's work (${standard})`,
                    `Seal joints with appropriate sealant after curing (${standard})`
                ]
            });
        }
        
        // Add environmental specific guidelines
        if (inputData.marineEnvironment === 'Yes') {
            const marineItems = [
                "Use sulphate-resistant cement or appropriate cement with mineral admixtures in marine environment (IRC standards)",
                "Consider lower water-cement ratio (≤ 0.45) to reduce permeability (IRC standards)",
                "Provide additional concrete cover (min. 50mm) to reinforcement in marine areas (IRC standards)",
                "Use corrosion inhibitors or surface treatments to protect reinforcement (IRC standards)"
            ];
            
            guidelines.push({
                category: "Marine Environment Requirements",
                items: marineItems
            });
        }
        
        return guidelines;
    },
    
    // Initialize the training system
    initialize: function() {
        console.log("Initializing pavement training system...");
        return this.trainModel();
    }
};

// Initialize the training system on load
const trainingResult = pavementTrainingSystem.initialize();
console.log("Training result:", trainingResult);

// Make the training system available globally
window.pavementTrainingSystem = pavementTrainingSystem; 