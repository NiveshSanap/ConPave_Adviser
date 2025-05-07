/**
 * Concrete Pavement Recommendation System
 * recommendations.js - Recommendation engine based on IRC standards
 */

const pavementRecommendations = {
    // IRC standards data from parameter table
    ircStandards: {
        jpcp: {
            name: 'Jointed Plain Concrete Pavement (JPCP)',
            description: 'Standard concrete pavement with joints and no reinforcement (except at joints). Suitable for highways/expressways with ≥450 CVPD.',
            traffic: '≥450 CVPD highways/expressways',
            designLife: '20 years',
            subgradeCBR: '≥6%',
            slabThickness: '≥200 mm',
            longitudinalSteel: 'None (except at joints)',
            crackSpacing: 'N/A',
            maxCrackWidth: 'N/A',
            transverseJoints: 'At regular intervals',
            longitudinalJoints: 'If width >7 m',
            shoulders: 'May be tied to slab',
            antiFrictionLayer: 'May be provided',
            edgeSupport: 'May be provided',
            terminalSlabs: 'N/A',
            specialJoints: 'As per design',
            surfaceTexture: 'Required (tine brush)',
            maintenance: 'Low',
            initialCost: 'High',
            marineEnvironment: 'Compatible',
            utilityLines: 'Compatible',
            manualConstruction: 'Compatible',
            suitableFor: 'Highways, expressways, major roads with moderate to high traffic'
        },
        jrcp: {
            name: 'Jointed Reinforced Concrete Pavement (JRCP)',
            description: 'Concrete pavement with joints and reinforcement at joints and along slab length. Suitable for highways/expressways with ≥450 CVPD.',
            traffic: '≥450 CVPD highways/expressways',
            designLife: '20 years',
            subgradeCBR: '≥6%',
            slabThickness: '≥200 mm',
            longitudinalSteel: 'At joints and along slab length',
            crackSpacing: 'N/A',
            maxCrackWidth: 'N/A',
            transverseJoints: 'At longer intervals than JPCP',
            longitudinalJoints: 'If width >7 m',
            shoulders: 'May be tied to slab',
            antiFrictionLayer: 'May be provided',
            edgeSupport: 'May be provided',
            terminalSlabs: 'N/A',
            specialJoints: 'As per design',
            surfaceTexture: 'Required (tine brush)',
            maintenance: 'Low',
            initialCost: 'High',
            marineEnvironment: 'Compatible',
            utilityLines: 'Compatible',
            manualConstruction: 'Compatible',
            suitableFor: 'Highways, expressways, major roads with high traffic volume'
        },
        crcp: {
            name: 'Continuously Reinforced Concrete Pavement (CRCP)',
            description: 'Concrete pavement with continuous reinforcement and no transverse joints. Ideal for very high volume commercial traffic.',
            traffic: 'Very high volume of commercial traffic',
            designLife: '30-40 years',
            subgradeCBR: 'High strength recommended, ≥6%',
            slabThickness: 'No reduction in thickness is desirable',
            longitudinalSteel: '0.65-0.80% of area',
            crackSpacing: '0.5-2.0 m',
            maxCrackWidth: '≤1 mm (good), ≤0.6 mm (effective for water)',
            transverseJoints: 'None',
            longitudinalJoints: 'If width >4.5 m',
            shoulders: 'Concrete shoulders recommended, tied, no longitudinal joint',
            antiFrictionLayer: 'Not provided',
            edgeSupport: 'Important; concrete shoulder recommended',
            terminalSlabs: 'Yes',
            specialJoints: 'Yes',
            surfaceTexture: 'Required (tine brush)',
            maintenance: 'Minimal (no joint seals except longitudinal)',
            initialCost: 'Higher (but lower life cycle cost)',
            marineEnvironment: 'Avoid unless epoxy/galvanized steel used',
            utilityLines: 'Avoid',
            manualConstruction: 'Avoid',
            notForLightTraffic: 'Not for light traffic, village roads, urban streets, short length',
            suitableFor: 'Heavy-duty expressways, high-volume commercial corridors, ports'
        },
        pcp: {
            name: 'Plain Cement Concrete Pavement (PCP)',
            description: 'Simple concrete pavement for rural roads with <450 CVPD or urban roads with high traffic volume (expwy).',
            traffic: '<450 CVPD (rural), high volume (expwy)',
            designLife: '10-20 years (rural), 20-30 years (expwy)',
            subgradeCBR: '≥3% (rural), ≥5% (expwy)',
            slabThickness: '≥150 mm (rural), ≥200 mm (expwy)',
            longitudinalSteel: 'Not applicable',
            crackSpacing: 'N/A',
            maxCrackWidth: 'N/A',
            transverseJoints: 'As per design',
            longitudinalJoints: 'As needed',
            shoulders: 'Recommended for expressways',
            antiFrictionLayer: 'Required if no base course',
            edgeSupport: 'Important for expressways',
            terminalSlabs: 'As per design',
            specialJoints: 'As per design',
            surfaceTexture: 'Required',
            maintenance: 'Moderate (rural), Low (expwy)',
            initialCost: 'Moderate (rural), High (expwy)',
            marineEnvironment: 'Compatible',
            utilityLines: 'Compatible',
            manualConstruction: 'Compatible',
            suitableFor: 'Rural roads, urban streets with moderate traffic'
        }
    },
    
    // Generate recommendation based on input parameters
    generateRecommendation: function(formData) {
        console.log('Generating recommendation based on parameters:', formData);
        
        // Count how many parameters were filled in
        const filledParameterCount = Object.values(formData).filter(value => value).length;
        
        // If the training system is available, use it for enhanced recommendations
        if (window.pavementTrainingSystem) {
            console.log("Using trained model for recommendations");
            return this.generateTrainedRecommendation(formData, filledParameterCount);
        } else {
            console.log("Falling back to rule-based recommendation (no trained model available)");
            return this.generateRuleBasedRecommendation(formData, filledParameterCount);
        }
    },
    
    // Generate recommendations using the trained model
    generateTrainedRecommendation: function(formData, filledParameterCount) {
        // Use the trained model to predict the best pavement type
        const prediction = window.pavementTrainingSystem.predict(formData);
        
        // Generate detailed report with design recommendations
        const report = window.pavementTrainingSystem.generateReport(prediction, formData);
        
        // Format the recommendation for display
        const typeObj = this.ircStandards[report.type.id];
        
        // Determine confidence level based on filled parameters and prediction score
        let confidenceLevel;
        if (prediction.confidenceScore >= 0.8 && filledParameterCount >= 8) {
            confidenceLevel = 'High';
        } else if (prediction.confidenceScore >= 0.6 && filledParameterCount >= 6) {
            confidenceLevel = 'Medium';
        } else {
            confidenceLevel = 'Low';
        }
        
        // Get the second best recommendation for comparison
        let alternativeType = null;
        if (prediction.alternativeRecommendation) {
            alternativeType = {
                id: prediction.alternativeRecommendation,
                name: this.ircStandards[prediction.alternativeRecommendation].name,
                score: prediction.alternativeScore * 100
            };
        }
        
        // Add IRC references to the recommendation
        const ircReferences = this.getIRCReferences(report.type.id);
        
        return {
            type: {
                id: report.type.id,
                name: typeObj.name,
                description: typeObj.description,
                traffic: typeObj.traffic,
                designLife: typeObj.designLife,
                subgradeCBR: typeObj.subgradeCBR,
                slabThickness: typeObj.slabThickness,
                longitudinalSteel: typeObj.longitudinalSteel,
                transverseJoints: typeObj.transverseJoints,
                longitudinalJoints: typeObj.longitudinalJoints,
                crackSpacing: typeObj.crackSpacing,
                maxCrackWidth: typeObj.maxCrackWidth,
                shoulders: typeObj.shoulders,
                antiFrictionLayer: typeObj.antiFrictionLayer,
                edgeSupport: typeObj.edgeSupport,
                terminalSlabs: typeObj.terminalSlabs,
                specialJoints: typeObj.specialJoints,
                surfaceTexture: typeObj.surfaceTexture,
                marineEnvironment: typeObj.marineEnvironment,
                utilityLines: typeObj.utilityLines,
                manualConstruction: typeObj.manualConstruction
            },
            alternativeType: alternativeType,
            score: prediction.confidenceScore * 100,
            confidenceLevel: confidenceLevel,
            recommendations: report.recommendations,
            specialNotes: report.specialNotes,
            usedTrainedModel: true,
            modelVersion: prediction.modelVersion,
            ircReferences: ircReferences,
            additionalParams: {
                durability: prediction.durability,
                costEffectiveness: prediction.costEffectiveness,
                constructionComplexity: prediction.constructionComplexity,
                ircCompliance: prediction.ircCompliance || 85,
                ircReferenceCoverage: prediction.ircReferenceCoverage || 70,
                ircNotes: prediction.ircNotes || [],
                notes: prediction.notes || []
            }
        };
    },
    
    // Get IRC standards references for a pavement type
    getIRCReferences: function(pavementType) {
        const references = {
            jpcp: {
                main: "IRC:58-2015",
                sections: [
                    { code: "IRC:58-2015", section: "2.1", page: "2", description: "Traffic volume requirements" },
                    { code: "IRC:58-2015", section: "Table 4", page: "13", description: "Subgrade CBR requirements" },
                    { code: "IRC:58-2015", section: "6.3.2", page: "26", description: "Slab thickness specifications" },
                    { code: "IRC:58-2015", section: "8.5", page: "36", description: "Longitudinal joint requirements" }
                ]
            },
            jrcp: {
                main: "IRC:58-2015",
                sections: [
                    { code: "IRC:58-2015", section: "2.1", page: "2", description: "Traffic volume and design life" },
                    { code: "IRC:58-2015", section: "7.2", page: "32", description: "Longitudinal steel requirements" },
                    { code: "IRC:58-2015", section: "8.2", page: "33", description: "Transverse joint specifications" }
                ]
            },
            crcp: {
                main: "IRC:118-2015",
                sections: [
                    { code: "IRC:118-2015", section: "1", page: "1", description: "Traffic volume requirements" },
                    { code: "IRC:118-2015", section: "2.2(i)", page: "3", description: "Crack spacing and width" },
                    { code: "IRC:118-2015", section: "2.2(vii)", page: "4", description: "Longitudinal steel percentage" },
                    { code: "IRC:118-2015", section: "3.1", page: "5", description: "Design life specifications" },
                    { code: "IRC:118-2015", section: "3.2", page: "5", description: "Environmental restrictions" }
                ]
            },
            pcp: {
                main: "IRC:SP:62-2014, IRC:SP:140-2024",
                sections: [
                    { code: "IRC:SP:62-2014", section: "2.1", page: "5", description: "Traffic volume for rural roads" },
                    { code: "IRC:SP:62-2014", section: "5.3", page: "12", description: "Subgrade CBR requirements" },
                    { code: "IRC:SP:62-2014", section: "7.1", page: "15", description: "Slab thickness specifications" },
                    { code: "IRC:SP:140-2024", section: "4.1", page: "", description: "Design life for expressways" }
                ]
            }
        };
        
        return references[pavementType] || { main: "", sections: [] };
    },
    
    // Original rule-based recommendation (fallback if trained model is unavailable)
    generateRuleBasedRecommendation: function(formData, filledParameterCount) {
        // Determine confidence level based on filled parameters
        let confidenceLevel;
        if (filledParameterCount >= 8) {
            confidenceLevel = 'High';
        } else if (filledParameterCount >= 6) {
            confidenceLevel = 'Medium';
        } else {
            confidenceLevel = 'Low';
        }
        
        // Get appropriate pavement type based on parameters
        const pavementTypes = this.determinePavementTypes(formData);
        
        // Sort pavement types by score (highest first)
        pavementTypes.sort((a, b) => b.score - a.score);
        
        // Get the top recommendation
        const type = pavementTypes[0];
        
        // Generate specific recommendations
        const recommendations = this.generateSpecificRecommendations(formData, type.type);
        
        // Extract additional parameters for display
        const additionalParams = this.getAdditionalParameters(type.type);
        
        // Get IRC references
        const ircReferences = this.getIRCReferences(type.id);
        
        // Return the full recommendation package
        return {
            type: type.type,
            score: type.score,
            alternativeTypes: pavementTypes.slice(1),
            recommendations: recommendations,
            additionalParams: additionalParams,
            confidenceLevel: confidenceLevel,
            filledParameterCount: filledParameterCount,
            ircReferences: ircReferences,
            usedTrainedModel: false
        };
    },
    
    // Determine suitable pavement types based on input parameters with scores
    determinePavementTypes: function(formData) {
        const types = [
            { type: this.ircStandards.jpcp, score: 0 },
            { type: this.ircStandards.jrcp, score: 0 },
            { type: this.ircStandards.crcp, score: 0 },
            { type: this.ircStandards.pcp, score: 0 }
        ];
        
        // Calculate scores for each pavement type based on input parameters
        
        // Traffic Volume
        if (formData.trafficVolume === '1') { // < 450 CVPD
            types[3].score += 10; // PCP
            types[0].score -= 5;  // JPCP
            types[1].score -= 5;  // JRCP
            types[2].score -= 10; // CRCP
        } else if (formData.trafficVolume === '2') { // 450-2000 CVPD
            types[0].score += 10; // JPCP
            types[1].score += 5;  // JRCP
            types[3].score += 5;  // PCP
        } else if (formData.trafficVolume === '3') { // > 2000 CVPD
            types[0].score += 5;  // JPCP
            types[1].score += 10; // JRCP
            types[2].score += 5;  // CRCP
        } else if (formData.trafficVolume === '4') { // Very high commercial traffic
            types[2].score += 10; // CRCP
            types[1].score += 5;  // JRCP
        }
        
        // Design Life
        if (formData.designLife === '10') {
            types[3].score += 10; // PCP (rural)
            types[2].score -= 10; // CRCP
        } else if (formData.designLife === '20') {
            types[0].score += 10; // JPCP
            types[1].score += 10; // JRCP
            types[3].score += 5;  // PCP (expwy)
        } else if (formData.designLife === '30' || formData.designLife === '40') {
            types[2].score += 10; // CRCP
            types[3].score += 5;  // PCP (expwy)
        }
        
        // Subgrade CBR
        if (formData.subgradeCBR === '1') { // < 3%
            types[3].score -= 5;  // PCP
        } else if (formData.subgradeCBR === '2') { // 3-5%
            types[3].score += 10; // PCP (rural)
        } else if (formData.subgradeCBR === '3' || formData.subgradeCBR === '4') { // ≥ 6%
            types[0].score += 10; // JPCP
            types[1].score += 10; // JRCP
            types[3].score += 5;  // PCP (expwy)
        }
        
        // Slab Thickness
        if (formData.slabThickness === '150') {
            types[3].score += 10; // PCP (rural)
            types[0].score -= 5;  // JPCP
            types[1].score -= 5;  // JRCP
        } else if (formData.slabThickness === '200') {
            types[0].score += 10; // JPCP
            types[1].score += 10; // JRCP
            types[3].score += 5;  // PCP (expwy)
        } else if (formData.slabThickness === '250' || formData.slabThickness === '300') {
            types[2].score += 10; // CRCP
        }
        
        // Steel Reinforcement
        if (formData.steelReinforcement === 'None') {
            types[0].score += 10; // JPCP
            types[3].score += 10; // PCP
            types[1].score -= 5;  // JRCP
            types[2].score -= 10; // CRCP
        } else if (formData.steelReinforcement === 'AtJoints') {
            types[1].score += 10; // JRCP
            types[0].score += 5;  // JPCP
        } else if (formData.steelReinforcement === 'Longitudinal') {
            types[2].score += 10; // CRCP
            types[1].score += 5;  // JRCP
        }
        
        // Transverse Joints
        if (formData.transverseJoints === 'Regular') {
            types[0].score += 10; // JPCP
            types[3].score += 5;  // PCP
            types[2].score -= 10; // CRCP
        } else if (formData.transverseJoints === 'Longer') {
            types[1].score += 10; // JRCP
            types[2].score -= 5;  // CRCP
        } else if (formData.transverseJoints === 'No') {
            types[2].score += 10; // CRCP
            types[0].score -= 5;  // JPCP
            types[1].score -= 5;  // JRCP
        }
        
        // Longitudinal Joints
        if (formData.longitudinalJoints === 'NotRequired') {
            types[3].score += 5;  // PCP
        } else if (formData.longitudinalJoints === 'Width4.5') {
            types[2].score += 10; // CRCP
        } else if (formData.longitudinalJoints === 'Width7') {
            types[0].score += 10; // JPCP
            types[1].score += 10; // JRCP
        }
        
        // Maintenance
        if (formData.maintenance === 'Minimal') {
            types[2].score += 10; // CRCP
        } else if (formData.maintenance === 'Low') {
            types[0].score += 10; // JPCP
            types[1].score += 10; // JRCP
            types[3].score += 5;  // PCP (expwy)
        } else if (formData.maintenance === 'Moderate') {
            types[3].score += 10; // PCP (rural)
        }
        
        // Initial Cost
        if (formData.initialCost === 'Low') {
            types[3].score += 5;  // PCP (rural)
            types[0].score -= 5;  // JPCP
            types[1].score -= 5;  // JRCP
            types[2].score -= 10; // CRCP
        } else if (formData.initialCost === 'Moderate') {
            types[3].score += 10; // PCP (rural)
        } else if (formData.initialCost === 'High') {
            types[0].score += 10; // JPCP
            types[1].score += 10; // JRCP
            types[2].score += 5;  // CRCP
            types[3].score += 5;  // PCP (expwy)
        }
        
        // Heavy Traffic Only
        if (formData.notForLightTraffic === 'Yes') {
            types[2].score += 10; // CRCP
        } else if (formData.notForLightTraffic === 'No') {
            types[3].score += 10; // PCP (rural)
        }
        
        // Anti-friction Layer
        if (formData.antiFrictionLayer === 'Provided') {
            types[0].score += 10; // JPCP
            types[1].score += 10; // JRCP
            types[2].score -= 5;  // CRCP
        } else if (formData.antiFrictionLayer === 'NotProvided') {
            types[2].score += 10; // CRCP
        }
        
        // Edge Support
        if (formData.edgeSupport === 'Provided') {
            types[0].score += 5;  // JPCP
            types[1].score += 5;  // JRCP
            types[2].score += 10; // CRCP
        } else if (formData.edgeSupport === 'NotProvided') {
            types[3].score += 5;  // PCP
        }
        
        // Terminal Slabs
        if (formData.terminalSlabs === 'Yes') {
            types[2].score += 10; // CRCP
        } else if (formData.terminalSlabs === 'No') {
            types[0].score += 5;  // JPCP
            types[1].score += 5;  // JRCP
            types[3].score += 5;  // PCP
        }
        
        // Special Joints
        if (formData.specialJoints === 'Yes') {
            types[2].score += 10; // CRCP
        } else if (formData.specialJoints === 'No') {
            types[0].score += 5;  // JPCP
            types[1].score += 5;  // JRCP
            types[3].score += 5;  // PCP
        }
        
        return types;
    },
    
    // Generate specific recommendations based on pavement type and input parameters
    generateSpecificRecommendations: function(formData, typeData) {
        let thickness, reinforcement, jointSpacing;
        
        // Determine thickness based on IRC parameters
        if (typeData.name.includes('CRCP')) {
            if (formData.slabThickness) {
                if (formData.slabThickness === '300') {
                    thickness = '300mm (meets high durability requirement for CRCP per IRC:118-2015)';
                } else if (formData.slabThickness === '250') {
                    thickness = '250mm (meets standard requirement for CRCP per IRC:118-2015)';
                } else {
                    thickness = '250-300mm recommended (IRC:118-2015 specifies "no reduction in thickness is desirable")';
                }
            } else {
                thickness = '250-300mm recommended for CRCP per IRC:118-2015';
            }
        } else if (typeData.name.includes('JPCP') || typeData.name.includes('JRCP')) {
            if (formData.slabThickness) {
                if (formData.slabThickness === '150') {
                    thickness = '200mm minimum recommended (IRC:58-2015 6.3.2/p.26 specifies minimum 200mm)';
                } else if (formData.slabThickness === '200') {
                    thickness = '200mm (meets minimum requirement per IRC:58-2015 6.3.2/p.26)';
                } else {
                    thickness = formData.slabThickness + 'mm (exceeds minimum IRC requirement of 200mm)';
                }
            } else {
                thickness = '200mm minimum per IRC:58-2015 6.3.2/p.26';
            }
        } else if (typeData.name.includes('PCP')) {
            if (formData.trafficVolume === '1') { // Rural
                if (formData.slabThickness === '150') {
                    thickness = '150mm (meets rural road requirement per IRC:SP:62-2014 7.1/p.15)';
                } else {
                    thickness = formData.slabThickness + 'mm (exceeds minimum rural road requirement of 150mm)';
                }
            } else { // Expressway
                if (formData.slabThickness === '150') {
                    thickness = '200mm recommended for expressways (current selection may be insufficient)';
                } else if (formData.slabThickness === '200') {
                    thickness = '200mm (meets expressway requirement per IRC:SP:62-2014 7.1/p.15)';
                } else {
                    thickness = formData.slabThickness + 'mm (exceeds minimum expressway requirement of 200mm)';
                }
            }
        } else {
            thickness = '200mm (default IRC recommendation)';
        }
        
        // Determine reinforcement based on IRC parameters
        if (typeData.name.includes('CRCP')) {
            reinforcement = '0.65-0.80% longitudinal steel (IRC:118-2015 2.2(vii)/p.4)';
        } else if (typeData.name.includes('JRCP')) {
            reinforcement = 'Steel at joints and along slab length (IRC:58-2015 7.2/p.32)';
        } else if (typeData.name.includes('JPCP')) {
            reinforcement = 'None except at joints (IRC:58-2015 7.1/p.31)';
        } else {
            reinforcement = 'Not applicable for PCP (IRC:SP:62-2014 7.3/p.17)';
        }
        
        // Determine joint spacing based on IRC parameters
        if (typeData.name.includes('CRCP')) {
            jointSpacing = 'No transverse joints; longitudinal joints if width >4.5m (IRC:118-2015 2.2(ii)/p.3)';
        } else if (typeData.name.includes('JRCP')) {
            jointSpacing = 'Longer spacing than JPCP (9-10m typical); longitudinal joints if width >7m (IRC:58-2015 8.2/p.33)';
        } else if (typeData.name.includes('JPCP')) {
            jointSpacing = '4.5m typical for transverse joints (IRC:58-2015 8.1/p.33); longitudinal joints if width >7m';
        } else if (typeData.name.includes('PCP')) {
            if (formData.trafficVolume === '1') { // Rural
                jointSpacing = '3.0-3.6m spacing for rural roads (IRC:SP:62-2014 8.1/p.18)';
            } else { // Expressway
                jointSpacing = '4.5m spacing for expressways (IRC:SP:62-2014 8.1/p.18)';
            }
        } else {
            jointSpacing = 'As per design requirements';
        }
        
        // Special considerations based on environment factors
        let specialConsiderations = [];
        
        // Marine environment considerations
        if (formData.marineEnvironment === 'Yes') {
            if (typeData.name.includes('CRCP')) {
                specialConsiderations.push("Use epoxy-coated or galvanized steel for marine environments (IRC:118-2015 3.2(i)/p.5)");
            } else if (typeData.name.includes('JPCP') || typeData.name.includes('JRCP')) {
                specialConsiderations.push("Special attention to joint sealing in marine environments (IRC:58-2015 5.4/p.21)");
            }
        }
        
        // Utility lines considerations
        if (formData.utilityLines === 'Yes') {
            if (typeData.name.includes('CRCP')) {
                specialConsiderations.push("Consider alternative pavement type with many utility lines (IRC:118-2015 3.2(ii)/p.5)");
            } else {
                specialConsiderations.push("Provide adequate access points for utility maintenance (IRC recommendations)");
            }
        }
        
        // Manual construction considerations
        if (formData.manualConstruction === 'Yes') {
            if (typeData.name.includes('CRCP')) {
                specialConsiderations.push("Mechanized construction strongly recommended for CRCP (IRC:118-2015 3.2(iv)/p.5)");
            } else if (typeData.name.includes('PCP')) {
                specialConsiderations.push("Ensure quality control for manual construction of PCP (IRC:SP:62-2014 10/p.22)");
            }
        }
        
        return {
            thickness: thickness,
            reinforcement: reinforcement,
            jointSpacing: jointSpacing,
            specialConsiderations: specialConsiderations
        };
    },
    
    // Get additional parameters to display in recommendation
    getAdditionalParameters: function(typeData) {
        return {
            suitableFor: typeData.suitableFor || '',
            designLife: typeData.designLife || '',
            maintenance: typeData.maintenance || '',
            initialCost: typeData.initialCost || ''
        };
    },
    
    // Calculate compatibility score between input and a pavement type
    calculateCompatibilityScore: function(typeData, inputData) {
        let score = 0;
        let totalWeight = 0;
        
        // Traffic Volume
        if (inputData.trafficVolume) {
            const weight = this.featureWeights.trafficVolume;
            totalWeight += weight;
            
            const trafficValue = parseInt(inputData.trafficVolume);
            if (typeData.trafficVolume) {
                if (typeData.trafficVolume.min && trafficValue >= typeData.trafficVolume.min) {
                    score += weight;
                } else if (typeData.trafficVolume.max && trafficValue <= typeData.trafficVolume.max) {
                    score += weight;
                } else if (typeData.trafficVolume.preferred === "very high" && trafficValue === 4) {
                    score += weight;
                } else if (typeData.trafficVolume.preferred === "highway" && (trafficValue === 2 || trafficValue === 3)) {
                    score += weight;
                }
            }
        }
        
        // Design Life
        if (inputData.designLife) {
            const weight = this.featureWeights.designLife;
            totalWeight += weight;
            
            const lifeValue = parseInt(inputData.designLife);
            if (typeData.designLife) {
                if (typeData.designLife.preferred && Math.abs(lifeValue - typeData.designLife.preferred) <= 5) {
                    score += weight * (1 - Math.abs(lifeValue - typeData.designLife.preferred) / 10);
                } else if (typeData.designLife.min && typeData.designLife.max && 
                          lifeValue >= typeData.designLife.min && lifeValue <= typeData.designLife.max) {
                    score += weight;
                } else if (typeData.designLife.rural && typeData.designLife.expwy) {
                    const ruralMatch = lifeValue >= typeData.designLife.rural.min && lifeValue <= typeData.designLife.rural.max;
                    const expwyMatch = lifeValue >= typeData.designLife.expwy.min && lifeValue <= typeData.designLife.expwy.max;
                    if (ruralMatch || expwyMatch) {
                        score += weight * 0.8;
                    }
                }
            }
        }
        
        // Subgrade CBR
        if (inputData.subgradeCBR) {
            const weight = this.featureWeights.subgradeCBR;
            totalWeight += weight;
            
            const cbrValue = parseInt(inputData.subgradeCBR);
            let cbrNumeric;
            
            // Convert CBR selection to numeric value
            if (cbrValue === 1) cbrNumeric = 2; // < 3
            else if (cbrValue === 2) cbrNumeric = 4; // 3-5
            else if (cbrValue === 3) cbrNumeric = 6.5; // 6-7
            else if (cbrValue === 4) cbrNumeric = 8; // ≥ 8
            
            if (typeData.subgradeCBR) {
                if (typeData.subgradeCBR.min && cbrNumeric >= typeData.subgradeCBR.min) {
                    score += weight;
                } else if (typeData.subgradeCBR.rural && typeData.subgradeCBR.expwy) {
                    const ruralMatch = cbrNumeric >= typeData.subgradeCBR.rural.min;
                    const expwyMatch = cbrNumeric >= typeData.subgradeCBR.expwy.min;
                    if (ruralMatch || expwyMatch) {
                        score += weight * 0.8;
                    }
                }
            }
        }
        
        // Slab Thickness
        if (inputData.slabThickness) {
            const weight = this.featureWeights.slabThickness;
            totalWeight += weight;
            
            const thicknessValue = parseInt(inputData.slabThickness);
            
            if (typeData.slabThickness) {
                if (typeData.slabThickness.min && thicknessValue >= typeData.slabThickness.min) {
                    score += weight;
                } else if (typeData.slabThickness.rural && typeData.slabThickness.expwy) {
                    const ruralMatch = thicknessValue >= typeData.slabThickness.rural.min;
                    const expwyMatch = thicknessValue >= typeData.slabThickness.expwy.min;
                    if (ruralMatch || expwyMatch) {
                        score += weight * 0.8;
                    }
                } else if (typeData.slabThickness.note && typeData.slabThickness.note.includes("No reduction") && thicknessValue >= 200) {
                    score += weight;
                }
            }
        }
        
        // Steel Reinforcement
        if (inputData.steelReinforcement) {
            const weight = this.featureWeights.longitudinalSteel;
            totalWeight += weight;
            
            if (typeData.longitudinalSteel && typeData.longitudinalSteel.value) {
                if (inputData.steelReinforcement === "None" && 
                    typeData.longitudinalSteel.value.includes("None")) {
                    score += weight;
                } else if (inputData.steelReinforcement === "AtJoints" && 
                          typeData.longitudinalSteel.value.includes("joints")) {
                    score += weight;
                } else if (inputData.steelReinforcement === "Longitudinal" && 
                          typeData.longitudinalSteel.value.includes("0.65-0.80")) {
                    score += weight;
                }
            }
        }
        
        // Transverse Joints
        if (inputData.transverseJoints) {
            const weight = this.featureWeights.transverseJoints;
            totalWeight += weight;
            
            if (typeData.transverseJoints && typeData.transverseJoints.value) {
                if (inputData.transverseJoints === "Regular" && 
                    typeData.transverseJoints.value.includes("regular")) {
                    score += weight;
                } else if (inputData.transverseJoints === "Longer" && 
                          typeData.transverseJoints.value.includes("longer")) {
                    score += weight;
                } else if (inputData.transverseJoints === "No" && 
                          typeData.transverseJoints.value.includes("None")) {
                    score += weight;
                }
            }
        }
        
        // Longitudinal Joints
        if (inputData.longitudinalJoints) {
            const weight = this.featureWeights.longitudinalJoints;
            totalWeight += weight;
            
            if (typeData.longitudinalJoints && typeData.longitudinalJoints.condition) {
                if (inputData.longitudinalJoints === "Width4.5" && 
                    typeData.longitudinalJoints.condition.includes("4.5m")) {
                    score += weight;
                } else if (inputData.longitudinalJoints === "Width7" && 
                          typeData.longitudinalJoints.condition.includes("7m")) {
                    score += weight;
                } else if (inputData.longitudinalJoints === "NotRequired") {
                    score += weight * 0.5; // Partial match for not required
                }
            }
        }
        
        // Shoulders
        if (inputData.shoulders) {
            const weight = this.featureWeights.shoulders;
            totalWeight += weight;
            
            if (typeData.shoulders && typeData.shoulders.value) {
                if (inputData.shoulders === "TiedConcrete" && 
                    typeData.shoulders.value.includes("concrete") && 
                    typeData.shoulders.value.includes("tied")) {
                    score += weight;
                } else if (inputData.shoulders === "TiedOther" && 
                          typeData.shoulders.value.includes("tied")) {
                    score += weight * 0.8;
                } else if (inputData.shoulders === "NotTied" && 
                          typeData.shoulders.value.includes("May be tied")) {
                    score += weight * 0.5;
                }
            }
        }
        
        // Anti-friction Layer
        if (inputData.antiFrictionLayer) {
            const weight = this.featureWeights.antiFrictionLayer;
            totalWeight += weight;
            
            if (typeData.antiFrictionLayer && typeData.antiFrictionLayer.value) {
                if (inputData.antiFrictionLayer === "Provided" && 
                    typeData.antiFrictionLayer.value.includes("May be provided")) {
                    score += weight;
                } else if (inputData.antiFrictionLayer === "NotProvided" && 
                          typeData.antiFrictionLayer.value.includes("Not provided")) {
                    score += weight;
                }
            }
        }
        
        // Edge Support
        if (inputData.edgeSupport) {
            const weight = this.featureWeights.edgeSupport;
            totalWeight += weight;
            
            if (typeData.edgeSupport && typeData.edgeSupport.value) {
                if (inputData.edgeSupport === "Provided" && 
                    (typeData.edgeSupport.value.includes("May be provided") || 
                     typeData.edgeSupport.value.includes("Important"))) {
                    score += weight;
                } else if (inputData.edgeSupport === "NotProvided" && 
                          !typeData.edgeSupport.value.includes("Important")) {
                    score += weight * 0.3;
                }
            }
        }
        
        // Terminal Slabs
        if (inputData.terminalSlabs) {
            const weight = this.featureWeights.terminalSlabs;
            totalWeight += weight;
            
            if (typeData.terminalSlabs && typeData.terminalSlabs.value) {
                if (inputData.terminalSlabs === "Yes" && 
                    typeData.terminalSlabs.value === "Yes") {
                    score += weight;
                } else if (inputData.terminalSlabs === "No" && 
                          (typeData.terminalSlabs.value === null || typeData.terminalSlabs.value === "No")) {
                    score += weight;
                }
            }
        }
        
        // Special Joints
        if (inputData.specialJoints) {
            const weight = this.featureWeights.specialJoints;
            totalWeight += weight;
            
            if (typeData.specialJoints && typeData.specialJoints.value) {
                if (inputData.specialJoints === "Yes" && 
                    typeData.specialJoints.value === "Yes") {
                    score += weight;
                } else if (inputData.specialJoints === "No" && 
                          (typeData.specialJoints.value === "As per design" || typeData.specialJoints.value === null)) {
                    score += weight * 0.7;
                }
            }
        }
        
        // Surface Texture
        if (inputData.surfaceTexture) {
            const weight = this.featureWeights.surfaceTexture;
            totalWeight += weight;
            
            if (typeData.surfaceTexture && typeData.surfaceTexture.value) {
                if ((inputData.surfaceTexture === "TineBrush" || inputData.surfaceTexture === "Other") && 
                    typeData.surfaceTexture.value.includes("Required")) {
                    score += weight;
                } else if (inputData.surfaceTexture === "No") {
                    score -= weight; // Penalize if surface texture is required but not provided
                }
            }
        }
        
        // Maintenance
        if (inputData.maintenance) {
            const weight = this.featureWeights.maintenance;
            totalWeight += weight;
            
            if (typeData.maintenance) {
                if (typeData.maintenance.value) {
                    if ((inputData.maintenance === "Minimal" && typeData.maintenance.value.includes("Minimal")) ||
                        (inputData.maintenance === "Low" && typeData.maintenance.value.includes("Low")) ||
                        (inputData.maintenance === "Moderate" && typeData.maintenance.value.includes("Moderate")) ||
                        (inputData.maintenance === "High" && typeData.maintenance.value.includes("High"))) {
                        score += weight;
                    } else {
                        // Partial match based on maintenance level difference
                        const levels = ["Minimal", "Low", "Moderate", "High"];
                        const inputLevel = levels.indexOf(inputData.maintenance);
                        
                        if (typeData.maintenance.value.includes("Minimal")) {
                            const typeLevel = 0;
                            score += weight * (1 - Math.abs(inputLevel - typeLevel) / levels.length);
                        } else if (typeData.maintenance.value.includes("Low")) {
                            const typeLevel = 1;
                            score += weight * (1 - Math.abs(inputLevel - typeLevel) / levels.length);
                        } else if (typeData.maintenance.value.includes("Moderate")) {
                            const typeLevel = 2;
                            score += weight * (1 - Math.abs(inputLevel - typeLevel) / levels.length);
                        } else if (typeData.maintenance.value.includes("High")) {
                            const typeLevel = 3;
                            score += weight * (1 - Math.abs(inputLevel - typeLevel) / levels.length);
                        }
                    }
                } else if (typeData.maintenance.rural && typeData.maintenance.expwy) {
                    // Handle rural vs expressway maintenance
                    if ((inputData.maintenance === "Moderate" && typeData.maintenance.rural === "Moderate") ||
                        (inputData.maintenance === "Low" && typeData.maintenance.expwy === "Low")) {
                        score += weight;
                    } else {
                        score += weight * 0.5;
                    }
                }
            }
        }
        
        // Initial Cost
        if (inputData.initialCost) {
            const weight = this.featureWeights.initialCost;
            totalWeight += weight;
            
            if (typeData.initialCost) {
                if (typeData.initialCost.value) {
                    if ((inputData.initialCost === "High" && (typeData.initialCost.value.includes("High") || typeData.initialCost.value.includes("Higher"))) ||
                        (inputData.initialCost === "Moderate" && typeData.initialCost.value.includes("Moderate")) ||
                        (inputData.initialCost === "Low" && typeData.initialCost.value.includes("Low"))) {
                        score += weight;
                    } else {
                        // Partial match based on cost level difference
                        const levels = ["Low", "Moderate", "High"];
                        const inputLevel = levels.indexOf(inputData.initialCost);
                        
                        if (typeData.initialCost.value.includes("Low")) {
                            const typeLevel = 0;
                            score += weight * (1 - Math.abs(inputLevel - typeLevel) / levels.length);
                        } else if (typeData.initialCost.value.includes("Moderate")) {
                            const typeLevel = 1;
                            score += weight * (1 - Math.abs(inputLevel - typeLevel) / levels.length);
                        } else if (typeData.initialCost.value.includes("High") || typeData.initialCost.value.includes("Higher")) {
                            const typeLevel = 2;
                            score += weight * (1 - Math.abs(inputLevel - typeLevel) / levels.length);
                        }
                    }
                } else if (typeData.initialCost.rural && typeData.initialCost.expwy) {
                    // Handle rural vs expressway cost
                    if ((inputData.initialCost === "Moderate" && typeData.initialCost.rural === "Moderate") ||
                        (inputData.initialCost === "High" && typeData.initialCost.expwy === "High")) {
                        score += weight;
                    } else {
                        score += weight * 0.5;
                    }
                }
            }
        }
        
        // Not for Light Traffic (Heavy Traffic Only)
        if (inputData.notForLightTraffic) {
            const weight = this.featureWeights.notForLightTraffic;
            totalWeight += weight;
            
            if (typeData.notForLightTraffic) {
                if ((inputData.notForLightTraffic === "Yes" && typeData.notForLightTraffic.value === true) ||
                    (inputData.notForLightTraffic === "No" && typeData.notForLightTraffic.value === false)) {
                    score += weight;
            } else {
                    score -= weight * 0.5; // Penalize if there's a mismatch
                }
            }
        }
        
        // Environment factors (marine, utility lines, manual construction)
        if (typeData.environmentSuitability) {
            const weight = this.featureWeights.environmentFactors / 3; // Divide weight among three factors
            totalWeight += weight * 3;
            
            // Marine environment
            if (typeData.marineEnvironment && inputData.notForLightTraffic === "Yes") {
                if (typeData.marineEnvironment.value === false) {
                    score -= weight; // Penalize if not suitable for marine environment
            } else {
                    score += weight;
                }
            }
            
            // Utility lines
            if (typeData.utilityLines && inputData.notForLightTraffic === "Yes") {
                if (typeData.utilityLines.value === false) {
                    score -= weight; // Penalize if not suitable for areas with utility lines
            } else {
                    score += weight;
                }
            }
            
            // Manual construction
            if (typeData.manualConstruction && inputData.notForLightTraffic === "Yes") {
                if (typeData.manualConstruction.value === false) {
                    score -= weight; // Penalize if not suitable for manual construction
            } else {
                    score += weight;
                }
            }
        }
        
        // Calculate final weighted score (normalize by total weight applied)
        return totalWeight > 0 ? (score / totalWeight) * 100 : 50; // Default to 50 if no weights
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
        
        // Get construction guidelines if available from training system
        let constructionGuidelines = [];
        if (window.pavementTrainingSystem && window.pavementTrainingSystem.generateConstructionGuidelines) {
            constructionGuidelines = window.pavementTrainingSystem.generateConstructionGuidelines(pavementType, inputData);
        }
        
        // Generate lifecycle cost estimate
        const lifecycleCost = this.generateLifecycleCostEstimate(pavementType, inputData);
        
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
            ircReferenceCoverage: typeData.ircReferenceCoverage || 0,
            constructionGuidelines: constructionGuidelines,
            lifecycleCost: lifecycleCost
        };
    },
    
    // Generate lifecycle cost estimate for the recommended pavement type
    generateLifecycleCostEstimate: function(pavementType, inputData) {
        // Base costs in lakh rupees per km for 7m wide pavement (approximate values)
        const baseCosts = {
            jpcp: { initial: 125, maintenance: 0.5, majorRepair: 12 },
            jrcp: { initial: 135, maintenance: 0.6, majorRepair: 15 },
            crcp: { initial: 145, maintenance: 0.3, majorRepair: 8 },
            pcp: { initial: 110, maintenance: 0.8, majorRepair: 18 }
        };
        
        // Get design life
        let designLife = 20; // default
        if (inputData.designLife) {
            designLife = parseInt(inputData.designLife);
        } else if (pavementType === 'crcp') {
            designLife = 30;
        } else if (pavementType === 'pcp' && inputData.trafficVolume === '1') {
            designLife = 15;
        }
        
        // Traffic volume adjustments
        let trafficMultiplier = 1.0;
        if (inputData.trafficVolume === '1') { // Low traffic
            trafficMultiplier = 0.85;
        } else if (inputData.trafficVolume === '3') { // High traffic
            trafficMultiplier = 1.15;
        } else if (inputData.trafficVolume === '4') { // Very high traffic
            trafficMultiplier = 1.25;
        }
        
        // Environment adjustments
        let environmentMultiplier = 1.0;
        if (inputData.marineEnvironment === 'Yes') {
            environmentMultiplier = 1.15;
        }
        
        // Calculate adjusted costs
        const cost = baseCosts[pavementType];
        const initialCost = cost.initial * trafficMultiplier * environmentMultiplier;
        const annualMaintenance = cost.maintenance * (1 + (designLife / 100));
        
        // Calculate lifecycle maintenance costs
        let totalMaintenanceCost = 0;
        for (let year = 1; year <= designLife; year++) {
            // Add annual routine maintenance costs
            totalMaintenanceCost += annualMaintenance;
            
            // Add major repair costs every 8-12 years depending on pavement type
            let majorRepairInterval = (pavementType === 'crcp') ? 12 : 8;
            if (year % majorRepairInterval === 0 && year < designLife) {
                totalMaintenanceCost += cost.majorRepair;
            }
        }
        
        // Calculate lifecycle cost and cost per year
        const lifecycleCost = initialCost + totalMaintenanceCost;
        const annualCost = lifecycleCost / designLife;
        
        return {
            initialCost: Math.round(initialCost * 10) / 10,
            maintenanceCost: Math.round(totalMaintenanceCost * 10) / 10,
            totalLifecycleCost: Math.round(lifecycleCost * 10) / 10,
            annualCost: Math.round(annualCost * 10) / 10,
            designLife: designLife,
            unit: "lakh INR/km (7m wide pavement)",
            note: "Cost estimates are approximate and based on typical IRC standards. Actual costs may vary based on local conditions, material availability, and specific project requirements."
        };
    }
};

// Make the recommendation engine accessible globally
window.pavementRecommendations = pavementRecommendations; 