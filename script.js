// AI Cancer Detection & Analysis System

class CancerDetectionSystem {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.cancerDatabase = this.initializeCancerDatabase();
        this.symptomPatterns = this.initializeSymptomPatterns();
        this.riskFactors = this.initializeRiskFactors();
        this.sendWelcomeMessage();
    }

    initializeElements() {
        this.sendButton = document.getElementById('send-button');
        this.messageInput = document.getElementById('message-input');
        this.chatMessages = document.getElementById('chat-messages');
        this.riskAssessmentBtn = document.getElementById('risk-assessment-btn');
        this.imageAnalysisBtn = document.getElementById('image-analysis-btn');
        this.imageUpload = document.getElementById('image-upload');
        this.imagePreview = document.getElementById('image-preview');
        this.symptomCheckerBtn = document.getElementById('symptom-checker-btn');
        this.healthTrackerBtn = document.getElementById('health-tracker-btn');
        this.riskModal = document.getElementById('risk-modal');
        this.riskForm = document.getElementById('risk-form');
        this.closeModal = document.querySelector('.close');
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleMessage();
        });
        
        this.riskAssessmentBtn.addEventListener('click', () => this.openRiskAssessment());
        this.imageAnalysisBtn.addEventListener('click', () => this.imageUpload.click());
        this.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        this.symptomCheckerBtn.addEventListener('click', () => this.startSymptomChecker());
        this.healthTrackerBtn.addEventListener('click', () => this.showHealthTracker());
        
        this.closeModal.addEventListener('click', () => this.closeRiskModal());
        this.riskForm.addEventListener('submit', (e) => this.handleRiskAssessment(e));
        
        window.addEventListener('click', (e) => {
            if (e.target === this.riskModal) this.closeRiskModal();
        });
    }

    initializeCancerDatabase() {
        return {
            symptoms: {
                "breast": ["lump in breast", "breast pain", "nipple discharge", "skin changes", "breast swelling"],
                "lung": ["persistent cough", "shortness of breath", "chest pain", "coughing blood", "hoarseness"],
                "colorectal": ["blood in stool", "abdominal pain", "changes in bowel habits", "weight loss", "fatigue"],
                "prostate": ["difficulty urinating", "blood in urine", "pelvic pain", "erectile dysfunction"],
                "skin": ["new moles", "changing moles", "unusual skin growths", "non-healing sores"],
                "cervical": ["abnormal bleeding", "pelvic pain", "pain during intercourse"],
                "ovarian": ["abdominal bloating", "pelvic pain", "urinary urgency", "loss of appetite"],
                "pancreatic": ["abdominal pain", "unexplained weight loss", "jaundice", "new diabetes"],
                "kidney": ["blood in urine", "flank pain", "abdominal mass", "high blood pressure"],
                "liver": ["abdominal pain", "jaundice", "unexplained weight loss", "fatigue"]
            },
            riskFactors: {
                "age": "Risk increases with age, especially after 50",
                "smoking": "Significantly increases risk for lung, bladder, and other cancers",
                "family_history": "Genetic predisposition increases risk",
                "obesity": "Linked to various cancer types",
                "alcohol": "Increases risk for liver, breast, and other cancers",
                "sun_exposure": "Primary risk factor for skin cancer"
            }
        };
    }

    initializeSymptomPatterns() {
        return {
            urgent: [
                "blood in stool", "coughing blood", "severe weight loss", "persistent fever",
                "severe abdominal pain", "difficulty swallowing", "severe headaches"
            ],
            concerning: [
                "persistent cough", "unusual lumps", "changes in moles", "persistent fatigue",
                "unexplained weight loss", "changes in bowel habits", "persistent pain"
            ]
        };
    }

    initializeRiskFactors() {
        return {
            age: { low: [0, 40], moderate: [40, 60], high: [60, 120] },
            smoking: { never: 0, former: 2, current: 4 },
            family_history: { none: 0, distant: 1, close: 3, multiple: 5 },
            alcohol: { none: 0, moderate: 1, heavy: 3 }
        };
    }

    sendWelcomeMessage() {
        this.addMessage(
            "Welcome to the AI Cancer Detection System! I'm equipped with advanced algorithms to help with:\n\n" +
            "• Cancer risk assessment\n" +
            "• Symptom analysis and detection\n" +
            "• Medical image analysis\n" +
            "• Health tracking and monitoring\n" +
            "• Prevention recommendations\n\n" +
            "IMPORTANT: This system provides information and analysis for educational purposes. Always consult healthcare professionals for medical advice.\n\n" +
            "How can I assist you today?", 
            'system'
        );
    }

    handleMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';

        // Analyze message and provide appropriate response
        setTimeout(() => {
            this.processMessage(message);
        }, 1000);
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for urgent symptoms
        const urgentSymptoms = this.symptomPatterns.urgent.filter(symptom => 
            lowerMessage.includes(symptom)
        );
        
        if (urgentSymptoms.length > 0) {
            this.handleUrgentSymptoms(urgentSymptoms);
            return;
        }

        // Check for concerning symptoms
        const concerningSymptoms = this.symptomPatterns.concerning.filter(symptom => 
            lowerMessage.includes(symptom)
        );
        
        if (concerningSymptoms.length > 0) {
            this.analyzeConcerningSymptoms(concerningSymptoms, message);
            return;
        }

        // Check for cancer type questions
        const cancerTypes = Object.keys(this.cancerDatabase.symptoms);
        const mentionedCancer = cancerTypes.find(type => lowerMessage.includes(type));
        
        if (mentionedCancer) {
            this.provideCancerInfo(mentionedCancer);
            return;
        }

        // Default responses based on keywords
        this.provideGeneralResponse(lowerMessage);
    }

    handleUrgentSymptoms(symptoms) {
        this.addMessage(
            `URGENT ALERT: You've mentioned symptoms that require immediate medical attention:\n\n` +
            `• ${symptoms.join('\n• ')}\n\n` +
            `Please seek immediate medical care or contact emergency services. These symptoms can indicate serious conditions requiring prompt evaluation.\n\n` +
            `Emergency contacts:\n` +
            `• Emergency: 911\n` +
            `• Poison Control: 1-800-222-1222\n` +
            `• Cancer Information: 1-800-4-CANCER`,
            'alert'
        );
    }

    analyzeConcerningSymptoms(symptoms, originalMessage) {
        // Perform symptom analysis
        const analysis = this.performSymptomAnalysis(symptoms, originalMessage);
        
        this.addMessage(
            `SYMPTOM ANALYSIS RESULTS:\n\n` +
            `Detected symptoms: ${symptoms.join(', ')}\n\n` +
            `${analysis.assessment}\n\n` +
            `Recommendations:\n${analysis.recommendations}\n\n` +
            `This analysis is for informational purposes only. Please consult a healthcare provider for proper evaluation.`,
            'bot'
        );
    }

    performSymptomAnalysis(symptoms, message) {
        const cancerTypes = [];
        const recommendations = [];

        // Check which cancer types match the symptoms
        Object.entries(this.cancerDatabase.symptoms).forEach(([cancerType, cancerSymptoms]) => {
            const matches = symptoms.filter(symptom => 
                cancerSymptoms.some(cs => cs.includes(symptom) || symptom.includes(cs))
            );
            if (matches.length > 0) {
                cancerTypes.push({ type: cancerType, matches: matches.length });
            }
        });

        // Sort by relevance
        cancerTypes.sort((a, b) => b.matches - a.matches);

        let assessment = "";
        if (cancerTypes.length > 0) {
            assessment = `Possible areas of concern: ${cancerTypes.slice(0, 3).map(ct => ct.type).join(', ')} cancer screening may be warranted.`;
            recommendations.push("• Schedule appointment with primary care physician");
            recommendations.push("• Consider relevant cancer screening tests");
            recommendations.push("• Keep symptom diary with dates and severity");
        } else {
            assessment = "Symptoms noted. While not specifically matching common cancer patterns, medical evaluation is still recommended.";
            recommendations.push("• Consult healthcare provider for evaluation");
            recommendations.push("• Monitor symptoms and note any changes");
        }

        recommendations.push("• Maintain healthy lifestyle habits");
        recommendations.push("• Consider stress management if applicable");

        return {
            assessment,
            recommendations: recommendations.join('\n')
        };
    }

    provideCancerInfo(cancerType) {
        const symptoms = this.cancerDatabase.symptoms[cancerType];
        this.addMessage(
            `${cancerType.toUpperCase()} CANCER INFORMATION:\n\n` +
            `Common symptoms include:\n• ${symptoms.join('\n• ')}\n\n` +
            `Early detection is crucial for better outcomes.\n\n` +
            `Would you like me to perform a risk assessment or analyze specific symptoms you're experiencing?`,
            'bot'
        );
    }

    provideGeneralResponse(message) {
        let response = "";
        
        if (message.includes('prevent') || message.includes('avoid')) {
            response = "CANCER PREVENTION STRATEGIES:\n\n" +
                "• Maintain healthy diet rich in fruits and vegetables\n" +
                "• Exercise regularly (150+ minutes/week)\n" +
                "• Avoid tobacco products completely\n" +
                "• Limit alcohol consumption\n" +
                "• Protect skin from UV radiation\n" +
                "• Get recommended vaccinations (HPV, Hepatitis B)\n" +
                "• Maintain healthy weight\n" +
                "• Follow screening guidelines\n" +
                "• Manage stress effectively";
        } else if (message.includes('screen') || message.includes('test')) {
            response = "CANCER SCREENING GUIDELINES:\n\n" +
                "• Mammograms: Women 50-74 (every 2 years)\n" +
                "• Colonoscopy: Adults 45-75 (every 10 years)\n" +
                "• Pap test: Women 21-65 (every 3 years)\n" +
                "• Skin checks: Annual full-body examination\n" +
                "• Lung CT: High-risk smokers 50-80\n\n" +
                "Consult your doctor about personalized screening schedule.";
        } else if (message.includes('treatment') || message.includes('therapy')) {
            response = "CANCER TREATMENT OPTIONS:\n\n" +
                "Modern cancer treatment is personalized and may include:\n\n" +
                "• Surgery (tumor removal)\n" +
                "• Chemotherapy (medication therapy)\n" +
                "• Radiation therapy (targeted radiation)\n" +
                "• Immunotherapy (immune system enhancement)\n" +
                "• Targeted therapy (precision medicine)\n" +
                "• Hormone therapy (hormone-sensitive cancers)\n\n" +
                "Treatment plans are tailored to each patient's specific situation.";
        } else {
            response = "I'm here to help with cancer detection and analysis. You can:\n\n" +
                "• Ask about specific symptoms\n" +
                "• Request risk assessment\n" +
                "• Upload medical images for analysis\n" +
                "• Learn about prevention strategies\n" +
                "• Get screening information\n\n" +
                "What would you like to know more about?";
        }
        
        this.addMessage(response, 'bot');
    }

    openRiskAssessment() {
        this.riskModal.style.display = 'block';
    }

    closeRiskModal() {
        this.riskModal.style.display = 'none';
    }

    handleRiskAssessment(e) {
        e.preventDefault();
        
        const formData = new FormData(this.riskForm);
        const data = {
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            familyHistory: formData.get('family-history'),
            smoking: formData.get('smoking'),
            alcohol: formData.get('alcohol')
        };

        const riskScore = this.calculateRiskScore(data);
        this.displayRiskResults(riskScore, data);
        this.closeRiskModal();
    }

    calculateRiskScore(data) {
        let score = 0;
        
        // Age scoring
        if (data.age < 40) score += 1;
        else if (data.age < 60) score += 3;
        else score += 5;
        
        // Family history
        const familyScores = { 'none': 0, 'distant': 1, 'close': 3, 'multiple': 5 };
        score += familyScores[data.familyHistory] || 0;
        
        // Smoking
        const smokingScores = { 'never': 0, 'former': 2, 'current': 4 };
        score += smokingScores[data.smoking] || 0;
        
        // Alcohol
        const alcoholScores = { 'none': 0, 'moderate': 1, 'heavy': 3 };
        score += alcoholScores[data.alcohol] || 0;

        return {
            total: score,
            level: score <= 4 ? 'low' : score <= 8 ? 'moderate' : 'high'
        };
    }

    displayRiskResults(riskScore, data) {
        const riskMessages = {
            'low': {
                message: "Your cancer risk assessment indicates a LOW risk profile.",
                color: 'success',
                recommendations: [
                    "Continue healthy lifestyle habits",
                    "Follow standard screening guidelines",
                    "Annual check-ups with healthcare provider"
                ]
            },
            'moderate': {
                message: "Your cancer risk assessment indicates a MODERATE risk profile.",
                color: 'system',
                recommendations: [
                    "Discuss enhanced screening with your doctor",
                    "Consider lifestyle modifications",
                    "More frequent health monitoring",
                    "Genetic counseling if family history is significant"
                ]
            },
            'high': {
                message: "Your cancer risk assessment indicates a HIGH risk profile.",
                color: 'alert',
                recommendations: [
                    "Consult oncologist or high-risk clinic",
                    "Enhanced screening protocols needed",
                    "Consider genetic testing",
                    "Immediate lifestyle interventions",
                    "Regular specialized monitoring"
                ]
            }
        };

        const result = riskMessages[riskScore.level];
        
        this.addMessage(
            `CANCER RISK ASSESSMENT RESULTS:\n\n` +
            `${result.message}\n` +
            `Risk Score: ${riskScore.total}/12\n\n` +
            `Personalized Recommendations:\n` +
            `${result.recommendations.map(r => `• ${r}`).join('\n')}\n\n` +
            `This assessment is based on general risk factors. Consult healthcare professionals for comprehensive evaluation.`,
            result.color
        );
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.addMessage("Please upload a valid image file.", 'alert');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            
            this.imagePreview.innerHTML = '';
            this.imagePreview.appendChild(img);
            
            // Simulate image analysis
            setTimeout(() => {
                this.performImageAnalysis(file.name);
            }, 2000);
        };
        
        reader.readAsDataURL(file);
        this.addMessage("Image uploaded successfully. Analyzing...", 'system');
    }

    performImageAnalysis(filename) {
        // Simulate AI analysis results
        const analysisResults = [
            {
                finding: "No suspicious lesions detected",
                confidence: 85,
                recommendation: "Continue regular monitoring"
            },
            {
                finding: "Irregular pigmentation noted",
                confidence: 72,
                recommendation: "Recommend dermatologist evaluation"
            },
            {
                finding: "Asymmetrical features detected",
                confidence: 68,
                recommendation: "Further medical assessment advised"
            }
        ];
        
        // Random result for demo
        const result = analysisResults[Math.floor(Math.random() * analysisResults.length)];
        
        this.addMessage(
            `IMAGE ANALYSIS COMPLETE:\n\n` +
            `File: ${filename}\n` +
            `AI Confidence: ${result.confidence}%\n\n` +
            `Analysis Results:\n${result.finding}\n\n` +
            `Recommendation: ${result.recommendation}\n\n` +
            `This AI analysis is for screening purposes only. Professional medical evaluation is essential for accurate diagnosis.`,
            result.confidence > 75 ? 'success' : 'system'
        );
    }

    startSymptomChecker() {
        this.addMessage(
            "INTERACTIVE SYMPTOM CHECKER\n\n" +
            "Please describe your symptoms in detail. Include:\n\n" +
            "• Duration (how long you've had them)\n" +
            "• Severity (mild, moderate, severe)\n" +
            "• Location (where in your body)\n" +
            "• Any triggering factors\n" +
            "• Associated symptoms\n\n" +
            "I'll analyze your symptoms and provide guidance on next steps.",
            'system'
        );
    }

    showHealthTracker() {
        this.addMessage(
            "HEALTH TRACKING DASHBOARD\n\n" +
            "Track important health metrics:\n\n" +
            "Screening History:\n" +
            "• Last mammogram: [Not recorded]\n" +
            "• Last colonoscopy: [Not recorded]\n" +
            "• Last skin check: [Not recorded]\n\n" +
            "Risk Factors:\n" +
            "• BMI: [Calculate needed]\n" +
            "• Smoking status: [Not recorded]\n" +
            "• Family history: [Update needed]\n\n" +
            "Upcoming Reminders:\n" +
            "• Schedule annual check-up\n" +
            "• Review screening schedule\n\n" +
            "Would you like to update any of these metrics?",
            'system'
        );
    }

    addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        this.chatMessages.appendChild(messageElement);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CancerDetectionSystem();
});
