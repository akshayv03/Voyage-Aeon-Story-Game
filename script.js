/**
 * Voyage Aeon Interactive Story Game
 *
 * A space-themed interactive story game featuring:
 * - Branching narrative with multiple endings
 * - Dynamic visual feedback based on player choices
 * - Audio integration with background music and sound effects
 * - Navigation system for revisiting previous scenes
 * - Progress tracking and detailed mission reports
 *
 * @author FBLA Project Team
 * @version 1.0
 */
class VoyageAeonStory {
    /**
     * Initialize the interactive story game
     * Sets up all game state variables and initializes core systems
     */
    constructor() {
        // Core game state variables
        this.currentScene = 'start';           // Current story scene identifier
        this.choices = [];                     // Array of player choice keys
        this.choiceDetails = [];               // Detailed choice information for reports
        this.musicPlaying = false;             // Background music state
        this.storyProgress = 0;                // Current progress (0-15)
        this.maxProgress = 15;                 // Maximum story progression steps
        this.finalEnding = '';                 // Final ending achievement name

        // Timer system variables
        this.missionStartTime = null;          // When the mission started (timestamp)
        this.missionEndTime = null;            // When the mission ended (timestamp)

        // Navigation system variables
        this.sceneHistory = [];                // Array of visited scene keys
        this.currentHistoryIndex = -1;         // Current position in scene history

        // Initialize all game systems
        this.initializeElements();             // Get DOM element references
        this.setupEventListeners();            // Attach event handlers
        this.loadStoryData();                  // Load story content and structure
        this.ensureActionScreenHidden();       // Hide action screen initially
        this.initializeMusic();                // Set up audio system
        this.initializeNavigation();           // Initialize navigation controls
    }

    /**
     * Initialize all DOM element references
     * Gets references to all HTML elements needed for game functionality
     */
    initializeElements() {
        // Story display elements
        this.storyText = document.getElementById('storyText');
        this.choicesContainer = document.getElementById('choicesContainer');
        this.storyContainer = document.getElementById('storyContainer');

        // Game over screen elements
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.endingIcon = document.getElementById('endingIcon');
        this.endingTitle = document.getElementById('endingTitle');

        // Audio elements
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.typingSound = document.getElementById('typingSound');
        this.endSceneSound = document.getElementById('endSceneSound');

        // Control buttons
        this.musicToggle = document.getElementById('musicToggle');
        this.stopBtn = document.getElementById('stopBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.navigationControls = document.getElementById('navigationControls');

        // Help modal elements
        this.helpModal = document.getElementById('helpModal');
        this.closeHelpBtn = document.getElementById('closeHelpBtn');
        this.closeHelpFooterBtn = document.getElementById('closeHelpFooterBtn');
        this.helpOverlay = this.helpModal.querySelector('.help-overlay');

        // AI Assistant elements
        this.aiAssistantPanel = document.getElementById('aiAssistantPanel');
        this.aiPanelToggle = document.getElementById('aiPanelToggle');
        this.aiPanelContent = document.getElementById('aiPanelContent');
        this.minimizeAiBtn = document.getElementById('minimizeAiBtn');
        this.aiPanelMessages = document.getElementById('aiPanelMessages');
        this.aiPanelInput = document.getElementById('aiPanelInput');
        this.sendAiBtn = document.getElementById('sendAiBtn');
        this.quickActionBtns = document.querySelectorAll('.quick-action-btn');

        // Progress and visual feedback elements
        this.progressFill = document.getElementById('progressFill');
        this.milestones = document.querySelectorAll('.milestone');
        this.pathIcon = document.getElementById('pathIcon');
        this.pathText = document.getElementById('pathText');

        // Action screen elements for visual transitions
        this.actionScreen = document.getElementById('actionScreen');
        this.actionIcon = document.getElementById('actionIcon');
        this.actionText = document.getElementById('actionText');
        this.loadingProgress = document.getElementById('loadingProgress');
    }

    /**
     * Set up all event listeners and audio properties
     * Configures button click handlers and audio settings
     */
    setupEventListeners() {
        // Button event listeners
        this.stopBtn.addEventListener('click', () => this.stopStory());
        this.musicToggle.addEventListener('click', () => this.toggleMusic());
        this.restartBtn.addEventListener('click', () => this.restartStory());
        this.helpBtn.addEventListener('click', () => this.showHelp());
        this.prevBtn.addEventListener('click', () => this.navigatePrevious());
        this.nextBtn.addEventListener('click', () => this.navigateNext());

        // Help modal event listeners
        this.closeHelpBtn.addEventListener('click', () => this.hideHelp());
        this.closeHelpFooterBtn.addEventListener('click', () => this.hideHelp());
        this.helpOverlay.addEventListener('click', () => this.hideHelp());

        // AI Assistant event listeners
        this.aiPanelToggle.addEventListener('click', () => this.toggleAiPanel());
        this.minimizeAiBtn.addEventListener('click', () => this.hideAiPanel());
        this.sendAiBtn.addEventListener('click', () => this.sendAiMessage());
        this.aiPanelInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAiMessage();
            }
        });

        // Quick action buttons
        this.quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.handleQuickAction(question);
            });
        });

        // Keyboard event listeners
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Configure audio properties
        this.backgroundMusic.volume = 0.3;        // Background music at 30% volume
        this.backgroundMusic.loop = true;         // Loop background music continuously
        this.typingSound.volume = 0.4;            // Typing sound at 40% volume (louder than music)
        this.typingSound.loop = true;             // Loop typing sound while typing
        this.endSceneSound.volume = 0.7;          // End scene sound at 70% volume
        this.endSceneSound.loop = false;          // Play end scene sound once

        // Store original music volume for restoration after sound effects
        this.originalMusicVolume = 0.3;
    }

    loadStoryData() {
        this.storyData = {
            start: {
                text: `You're a space explorer who just detected a mysterious signal from deep space. Your ship's computer shows two options.`,
                choices: [
                    { text: "🚀 Investigate the signal immediately", next: "investigate" },
                    { text: "📡 Scan the area first for safety", next: "scan" }
                ]
            },

            investigate: {
                text: `You fly directly toward the signal and discover a massive alien space station. It's clearly ancient but still powered.`,
                choices: [
                    { text: "🔍 Board the station", next: "board" },
                    { text: "📡 Try to communicate first", next: "communicate" }
                ]
            },

            scan: {
                text: `Your scans reveal the signal comes from an advanced alien probe. It seems to be studying your ship.`,
                choices: [
                    { text: "🤝 Send a peaceful greeting", next: "peaceful" },
                    { text: "🛡️ Raise shields defensively", next: "defensive" }
                ]
            },

            board: {
                text: `Inside the station, you find living crystal technology that responds to your presence. The crystals glow brighter as you approach.

                       As you move deeper, you discover the station is vast - corridors stretch in multiple directions, each pulsing with different colored lights.`,
                choices: [
                    { text: "🔬 Study the crystal technology", next: "crystalStudy" },
                    { text: "🚶 Explore the blue-lit corridor", next: "blueCorridorExplore" }
                ]
            },

            crystalStudy: {
                text: `You approach the crystals carefully. As your hand nears them, they emit a harmonic frequency that resonates through your bones.

                       The crystals seem to be some form of organic computer, storing vast amounts of data. You realize they're trying to interface with your mind.`,
                choices: [
                    { text: "🧠 Allow the mental interface", next: "crystalInterface" },
                    { text: "📱 Use your scanner to study them safely", next: "crystalScan" }
                ]
            },

            blueCorridorExplore: {
                text: `The blue corridor leads to a massive chamber filled with floating holographic displays showing star maps of unknown galaxies.

                       In the center stands what appears to be a navigation console, still active after eons. Ancient symbols scroll across its surface.`,
                choices: [
                    { text: "🗺️ Examine the star maps", next: "starMapStudy" },
                    { text: "⚙️ Interact with the navigation console", next: "navigationConsole" }
                ]
            },

            crystalInterface: {
                text: `As you allow the mental connection, your consciousness expands beyond your physical form. You experience memories of the station's creators -

                       A race called the Zephyrians who transcended physical existence millennia ago. They left this station as a gift for younger species.`,
                choices: [
                    { text: "🎁 Accept their gift of knowledge", next: "zephyrianGift" },
                    { text: "❓ Ask about other stations like this", next: "stationNetwork" }
                ]
            },

            crystalScan: {
                text: `Your scanner reveals the crystals are composed of an unknown element that exists partially in normal space and partially in subspace.

                       The readings suggest they can manipulate space-time itself. This technology could revolutionize human understanding of physics.`,
                choices: [
                    { text: "📊 Download the scan data", next: "scientificDiscovery" },
                    { text: "🔬 Attempt to take a crystal sample", next: "crystalSample" }
                ]
            },

            communicate: {
                text: `The station responds! An ancient AI speaks directly into your mind, offering to share vast knowledge of the galaxy.`,
                choices: [
                    { text: "🎓 Accept the knowledge", next: "knowledgeEnding" },
                    { text: "🤔 Ask about their civilization first", next: "civilizationEnding" }
                ]
            },

            peaceful: {
                text: `The probe responds positively to your greeting and projects a holographic star map showing locations of other ancient sites.

                       The probe's AI speaks in harmonious tones: "We are pleased by your peaceful approach. We offer you a choice of gifts."`,
                choices: [
                    { text: "📍 Ask for coordinates to explore", next: "coordinateGift" },
                    { text: "🤖 Request to meet their creators", next: "creatorMeeting" }
                ]
            },

            coordinateGift: {
                text: `The probe downloads a comprehensive star map into your ship's navigation system. The map reveals dozens of ancient sites scattered across the galaxy.

                       Each site pulses with different colors, indicating various types of technology and knowledge waiting to be discovered.`,
                choices: [
                    { text: "🌌 Choose the nearest ancient library", next: "ancientLibrary" },
                    { text: "⚡ Head to an energy research station", next: "energyStation" }
                ]
            },

            creatorMeeting: {
                text: `The probe's hologram shifts, revealing the image of a graceful, ethereal being with luminous skin and eyes like stars.

                       "I am Lyra, last guardian of the Celestial Archive. We have waited eons for a species ready for our knowledge."`,
                choices: [
                    { text: "🎓 Ask about the Celestial Archive", next: "celestialArchive" },
                    { text: "🤝 Offer human knowledge in exchange", next: "knowledgeExchange" }
                ]
            },

            defensive: {
                text: `Your defensive posture impresses the probe. It recognizes you as a cautious but intelligent species.

                       The probe transmits: "Your caution shows wisdom. We respect those who protect themselves while remaining open to learning."`,
                choices: [
                    { text: "🛡️ Maintain defensive stance", next: "defensiveProtocol" },
                    { text: "🔄 Lower shields to show trust", next: "trustBuilding" }
                ]
            },

            defensiveProtocol: {
                text: `You maintain your shields while engaging in careful dialogue. The probe appreciates your measured approach.

                       It begins sharing defensive technologies and tactical knowledge, recognizing you as a potential guardian species.`,
                choices: [
                    { text: "⚔️ Accept guardian training", next: "guardianTraining" },
                    { text: "🔍 Study their defensive technology", next: "defensiveTech" }
                ]
            },

            trustBuilding: {
                text: `As you lower your shields, the probe's energy signature shifts to a warmer, more welcoming frequency.

                       "Trust is the foundation of all galactic cooperation. We offer you membership in the Galactic Peacekeepers."`,
                choices: [
                    { text: "🌟 Accept membership", next: "peacekeeperMembership" },
                    { text: "📚 Learn about the organization first", next: "peacekeeperInfo" }
                ]
            },



            crystalTechEnding: {
                text: `As you study the living crystals, they respond to your presence, sharing their knowledge directly
                       with your mind. You learn that they are a symbiotic species that merged with technology eons ago.

                       They offer to enhance your ship with their bio-tech, creating a vessel that can traverse
                       dimensions and communicate with any form of consciousness in the universe.
                       You have become the first human ambassador to the crystal collective!`,
                choices: []
            },

            knowledgeEnding: {
                text: `The ancient AI downloads vast libraries of knowledge into your ship's computers - star maps
                       of unexplored galaxies, technologies beyond current understanding, and the locations of other
                       ancient civilizations waiting to be discovered.

                       You return to human space not just as an explorer, but as a bridge between species.
                       Your mission has evolved from simple exploration to galactic diplomacy!`,
                choices: []
            },

            consciousnessEnding: {
                text: `You allow the ancient consciousness technology to interface with your mind. The experience
                       is overwhelming - you see the universe through the eyes of a million different species,
                       understand the true nature of space and time.

                       When the connection ends, you retain a fragment of this cosmic awareness.
                       You have transcended your human limitations and become something new - a cosmic consciousness
                       capable of guiding humanity to its next evolutionary step!`,
                choices: []
            },

            // New expanded story endings
            starMapStudy: {
                text: `The holographic star maps reveal the locations of twelve ancient civilizations, each with unique technologies and wisdom.

                       You realize you've discovered a galactic network of knowledge that could advance human civilization by millennia.
                       You have become the first human Galactic Cartographer!`,
                choices: []
            },

            navigationConsole: {
                text: `As you interact with the navigation console, it activates a hidden function - a galactic transportation network.

                       The station itself begins to move, carrying you to the center of the galaxy where the Council of Ancients awaits.
                       You have become humanity's first Galactic Navigator!`,
                choices: []
            },

            zephyrianGift: {
                text: `The Zephyrians bestow upon you their greatest gift - the ability to perceive and manipulate the quantum threads that connect all consciousness.

                       You return to human space with powers beyond imagination, becoming the first human Quantum Consciousness Weaver!`,
                choices: []
            },

            stationNetwork: {
                text: `The crystal interface reveals a vast network of similar stations throughout the galaxy, each containing different aspects of Zephyrian knowledge.

                       You are granted access to the entire network, becoming the Guardian of the Zephyrian Legacy!`,
                choices: []
            },

            scientificDiscovery: {
                text: `Your scientific analysis of the crystal technology leads to breakthrough discoveries in physics, consciousness, and space-time manipulation.

                       You return to human space as the greatest scientific mind of your generation, ushering in a new age of human advancement!`,
                choices: []
            },

            crystalSample: {
                text: `As you carefully extract a crystal sample, it bonds with your ship's systems, creating a hybrid bio-technological vessel.

                       Your ship becomes a living entity capable of traveling between dimensions. You have become the first Bio-Ship Pioneer!`,
                choices: []
            },

            ancientLibrary: {
                text: `The ancient library contains the collected knowledge of a thousand civilizations spanning millions of years.

                       You spend months absorbing this wisdom, returning to human space as the Keeper of Galactic Knowledge!`,
                choices: []
            },

            energyStation: {
                text: `The energy research station teaches you to harness the fundamental forces of the universe itself.

                       You master technologies that can power entire star systems, becoming humanity's first Cosmic Energy Engineer!`,
                choices: []
            },

            celestialArchive: {
                text: `Lyra guides you through the Celestial Archive, a repository of the universe's most profound secrets and beautiful art.

                       You become the first human inducted as a Celestial Archivist, guardian of cosmic beauty and wisdom!`,
                choices: []
            },

            knowledgeExchange: {
                text: `Your offer to share human knowledge delights Lyra. The cultural exchange that follows enriches both species immeasurably.

                       You establish the first Human-Celestial Embassy, becoming the Galactic Cultural Ambassador!`,
                choices: []
            },

            guardianTraining: {
                text: `You undergo intensive training in advanced defensive technologies and galactic peacekeeping protocols.

                       You emerge as the first human Galactic Guardian, protector of peaceful species throughout the galaxy!`,
                choices: []
            },

            defensiveTech: {
                text: `You master defensive technologies beyond human imagination - shields that can protect entire planets and weapons that disable rather than destroy.

                       You return as humanity's first Defensive Technology Specialist, ensuring Earth's protection for millennia!`,
                choices: []
            },

            peacekeeperMembership: {
                text: `You are formally inducted into the Galactic Peacekeepers, an ancient organization dedicated to maintaining harmony across the stars.

                       You become the first human Galactic Peacekeeper, with authority to mediate conflicts across the galaxy!`,
                choices: []
            },

            peacekeeperInfo: {
                text: `You learn about the Galactic Peacekeepers' noble mission to maintain balance and prevent conflicts between species.

                       Impressed by their wisdom, you accept a role as their first human liaison, becoming the Interspecies Diplomatic Coordinator!`,
                choices: []
            },

            civilizationEnding: {
                text: `The ancient AI shares the fascinating history of their civilization - the Ethereal Architects who built this station eons ago.

                       They were a peaceful species who transcended physical form to become pure consciousness, leaving behind these stations as gifts for younger civilizations. You learn about their philosophy, their technology, and their hope for the future of the galaxy.

                       You have become the first human Civilization Historian, keeper of ancient wisdom and cultural knowledge!`,
                choices: []
            }
        };
    }

    initializeMusic() {
        this.tryPlayMusic();

        // Try to play music when user first interacts with the page
        const startMusicOnInteraction = () => {
            if (!this.musicPlaying) {
                this.tryPlayMusic();
            }
            document.removeEventListener('click', startMusicOnInteraction);
        };

        document.addEventListener('click', startMusicOnInteraction);
    }

    startStory() {
        this.currentScene = 'start';
        this.storyProgress = 1;
        this.updateProgress();

        // Start the mission timer
        this.missionStartTime = Date.now();
        this.missionEndTime = null;

        // Reset navigation for new story
        this.sceneHistory = [];
        this.currentHistoryIndex = -1;

        this.displayScene('start');
        this.tryPlayMusic();
    }

    displayScene(sceneKey, addToHistory = true) {
        // Validate scene input
        const validationResult = this.validateScene(sceneKey);
        if (!validationResult.isValid) {
            console.error('Scene validation failed:', validationResult.error);
            this.showSceneValidationError(validationResult.error);
            return;
        }

        const scene = this.storyData[sceneKey];
        this.currentScene = sceneKey;

        // Add to history if this is a new scene (not navigation)
        if (addToHistory) {
            // Remove any scenes after current position (if user went back and chose different path)
            this.sceneHistory = this.sceneHistory.slice(0, this.currentHistoryIndex + 1);
            // Add new scene to history
            this.sceneHistory.push(sceneKey);
            this.currentHistoryIndex = this.sceneHistory.length - 1;
        }

        // Update navigation buttons
        this.updateNavigationButtons();

        // Update story text with typewriter effect
        this.typewriterEffect(scene.text);

        // Clear and populate choices
        setTimeout(() => {
            this.choicesContainer.innerHTML = '';

            if (scene.choices.length === 0) {
                // Story ending
                this.finalEnding = this.getEndingName(sceneKey);
                setTimeout(() => {
                    this.showGameOver();
                }, 3000);
            } else {
                scene.choices.forEach((choice, index) => {
                    setTimeout(() => {
                        const button = document.createElement('button');
                        button.className = 'choice-btn';
                        button.textContent = choice.text;
                        button.onclick = () => this.makeChoice(choice.next);
                        this.choicesContainer.appendChild(button);
                    }, index * 200);
                });
            }
        }, 1000);
    }

    typewriterEffect(text) {
        this.storyText.innerHTML = '';
        const paragraphs = text.split('\n\n');
        let paragraphIndex = 0;
        let isTyping = false;

        const typeParagraph = () => {
            if (paragraphIndex >= paragraphs.length) {
                // Stop typing sound when all text is done
                this.stopTypingSound();
                return;
            }

            const p = document.createElement('p');
            this.storyText.appendChild(p);

            const paragraph = paragraphs[paragraphIndex].trim();
            let charIndex = 0;

            // Start typing sound for this paragraph
            if (!isTyping) {
                this.startTypingSound();
                isTyping = true;
            }

            const typeChar = () => {
                if (charIndex < paragraph.length) {
                    p.textContent += paragraph[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 30);
                } else {
                    // Pause typing sound between paragraphs
                    this.stopTypingSound();
                    isTyping = false;
                    paragraphIndex++;
                    setTimeout(typeParagraph, 500);
                }
            };

            typeChar();
        };

        typeParagraph();
    }

    makeChoice(nextScene) {
        // Validate choice input
        const validationResult = this.validateChoice(nextScene);
        if (!validationResult.isValid) {
            console.error('Invalid choice attempted:', validationResult.error);
            this.showChoiceValidationError(validationResult.error);
            return;
        }

        // Store the choice with context
        const currentSceneData = this.storyData[this.currentScene];
        const chosenOption = currentSceneData.choices.find(choice => choice.next === nextScene);

        // Debug logging to help identify missing choices
        if (!chosenOption) {
            console.warn(`Warning: Could not find choice for nextScene "${nextScene}" in scene "${this.currentScene}"`);
            console.log('Available choices:', currentSceneData.choices);
        }

        this.choices.push(nextScene);
        this.choiceDetails.push({
            sceneKey: this.currentScene,
            sceneName: this.getSceneName(this.currentScene),
            choiceText: chosenOption ? chosenOption.text : `Choice leading to ${nextScene}`,
            choiceDescription: this.getChoiceDescription(nextScene),
            nextScene: nextScene
        });

        this.storyProgress++;
        this.updateProgress();
        this.updateVisualFeedback();

        // Show action screen before proceeding to next scene
        this.showActionScreen(chosenOption ? chosenOption.text : `Action for ${nextScene}`, nextScene);
    }

    /**
     * Validate choice selection
     * @param {string} nextScene - The scene key to validate
     * @returns {Object} - Validation result
     */
    validateChoice(nextScene) {
        // Syntactical validation
        if (!nextScene || typeof nextScene !== 'string') {
            return { isValid: false, error: 'Invalid choice: nextScene must be a non-empty string' };
        }

        if (nextScene.trim().length === 0) {
            return { isValid: false, error: 'Invalid choice: nextScene cannot be empty' };
        }

        // Semantic validation
        const currentSceneData = this.storyData[this.currentScene];
        if (!currentSceneData) {
            return { isValid: false, error: `Invalid game state: current scene "${this.currentScene}" not found` };
        }

        if (!currentSceneData.choices || !Array.isArray(currentSceneData.choices)) {
            return { isValid: false, error: `Invalid scene data: no choices available for scene "${this.currentScene}"` };
        }

        // Check if the choice is valid for current scene
        const validChoices = currentSceneData.choices.map(choice => choice.next);
        if (!validChoices.includes(nextScene)) {
            return {
                isValid: false,
                error: `Invalid choice: "${nextScene}" is not a valid option for scene "${this.currentScene}". Valid choices: ${validChoices.join(', ')}`
            };
        }

        // Check if target scene exists
        if (!this.storyData[nextScene]) {
            return { isValid: false, error: `Invalid choice: target scene "${nextScene}" does not exist in story data` };
        }

        // Check for game state consistency
        if (this.currentScene === nextScene) {
            return { isValid: false, error: 'Invalid choice: cannot transition to the same scene' };
        }

        return { isValid: true };
    }

    /**
     * Show choice validation error
     * @param {string} errorMessage - Error message to display
     */
    showChoiceValidationError(errorMessage) {
        // Log error for debugging
        console.error('Choice validation error:', errorMessage);

        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'choice-error-message';
        errorDiv.textContent = 'Something went wrong with your choice. Please try again.';
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 3000;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
        `;

        document.body.appendChild(errorDiv);

        // Remove error message after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    /**
     * Validate scene input
     * @param {string} sceneKey - The scene key to validate
     * @returns {Object} - Validation result
     */
    validateScene(sceneKey) {
        // Syntactical validation
        if (!sceneKey || typeof sceneKey !== 'string') {
            return { isValid: false, error: 'Invalid scene: sceneKey must be a non-empty string' };
        }

        if (sceneKey.trim().length === 0) {
            return { isValid: false, error: 'Invalid scene: sceneKey cannot be empty' };
        }

        // Semantic validation
        if (!this.storyData) {
            return { isValid: false, error: 'Invalid game state: story data not loaded' };
        }

        if (!this.storyData[sceneKey]) {
            return { isValid: false, error: `Invalid scene: scene "${sceneKey}" does not exist in story data` };
        }

        const scene = this.storyData[sceneKey];

        // Validate scene structure
        if (!scene.text || typeof scene.text !== 'string') {
            return { isValid: false, error: `Invalid scene data: scene "${sceneKey}" missing or invalid text property` };
        }

        if (!scene.choices || !Array.isArray(scene.choices)) {
            return { isValid: false, error: `Invalid scene data: scene "${sceneKey}" missing or invalid choices array` };
        }

        // Validate each choice in the scene
        for (let i = 0; i < scene.choices.length; i++) {
            const choice = scene.choices[i];
            if (!choice.text || typeof choice.text !== 'string') {
                return { isValid: false, error: `Invalid scene data: choice ${i} in scene "${sceneKey}" missing or invalid text` };
            }
            if (!choice.next || typeof choice.next !== 'string') {
                return { isValid: false, error: `Invalid scene data: choice ${i} in scene "${sceneKey}" missing or invalid next property` };
            }
        }

        return { isValid: true };
    }

    /**
     * Show scene validation error
     * @param {string} errorMessage - Error message to display
     */
    showSceneValidationError(errorMessage) {
        // Log error for debugging
        console.error('Scene validation error:', errorMessage);

        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'scene-error-message';
        errorDiv.textContent = 'There was an error loading the story. Please refresh the page and try again.';
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 100, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 3000;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 0 20px rgba(255, 100, 0, 0.5);
            max-width: 400px;
        `;

        document.body.appendChild(errorDiv);

        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    updateProgress() {
        const progressPercent = (this.storyProgress / this.maxProgress) * 100;
        const clampedPercent = Math.min(progressPercent, 100);

        // Update progress bar fill with smooth animation
        this.progressFill.style.width = `${clampedPercent}%`;

        // Update milestones
        this.updateMilestones();
    }

    /**
     * Update milestone indicators based on current progress
     * Highlights achieved milestones and shows current milestone
     */
    updateMilestones() {
        this.milestones.forEach(milestone => {
            const step = parseInt(milestone.getAttribute('data-step'));

            // Remove existing classes
            milestone.classList.remove('achieved', 'current');

            if (this.storyProgress > step) {
                // Milestone achieved
                milestone.classList.add('achieved');
            } else if (this.storyProgress === step) {
                // Current milestone
                milestone.classList.add('current');
                // Add achievement animation
                this.animateMilestoneAchievement(milestone);
            }
        });
    }

    /**
     * Animate milestone achievement with a special effect
     * @param {Element} milestone - The milestone element to animate
     */
    animateMilestoneAchievement(milestone) {
        // Create a temporary glow effect
        milestone.style.animation = 'none';
        setTimeout(() => {
            milestone.style.animation = 'milestonePulse 1s ease-in-out infinite';
        }, 10);

        // Add a brief scale animation for achievement
        const originalTransform = milestone.style.transform;
        milestone.style.transform = 'translateX(-50%) scale(2)';
        milestone.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

        setTimeout(() => {
            milestone.style.transform = originalTransform;
            milestone.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 300);
    }

    /**
     * Reset all milestones to their initial state
     * Removes all achievement and current classes
     */
    resetMilestones() {
        this.milestones.forEach(milestone => {
            milestone.classList.remove('achieved', 'current');
            milestone.style.animation = '';
            milestone.style.transform = '';
            milestone.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }

    updateVisualFeedback() {
        const pathType = this.getStoryPathType();
        const body = document.body;

        // Remove existing path classes
        body.classList.remove('explorer-path', 'diplomatic-path', 'scientist-path');

        // Add appropriate path class and update indicators
        if (pathType === 'Bold Explorer') {
            body.classList.add('explorer-path');
            this.pathIcon.textContent = '🚀';
            this.pathText.textContent = 'Bold Explorer Path';
        } else if (pathType === 'Diplomatic Pioneer') {
            body.classList.add('diplomatic-path');
            this.pathIcon.textContent = '🤝';
            this.pathText.textContent = 'Diplomatic Pioneer Path';
        } else if (pathType === 'Cautious Scientist') {
            body.classList.add('scientist-path');
            this.pathIcon.textContent = '🔬';
            this.pathText.textContent = 'Cautious Scientist Path';
        } else {
            this.pathIcon.textContent = '⚖️';
            this.pathText.textContent = 'Balanced Approach';
        }
    }

    tryPlayMusic() {
        if (!this.musicPlaying && this.backgroundMusic) {
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.volume = this.originalMusicVolume;

            this.backgroundMusic.play().then(() => {
                this.musicPlaying = true;
                this.musicToggle.textContent = '🔊 Music On';
            }).catch(() => {
                this.musicToggle.textContent = '🔇 Music Off';
            });
        }
    }

    toggleMusic() {
        if (this.musicPlaying) {
            this.backgroundMusic.pause();
            this.musicPlaying = false;
            this.musicToggle.textContent = '🔇 Music Off';
        } else {
            this.backgroundMusic.play().then(() => {
                this.musicPlaying = true;
                this.musicToggle.textContent = '🔊 Music On';
            }).catch(() => {
                this.musicToggle.textContent = '🔇 Music Off';
            });
        }
    }

    startTypingSound() {
        if (this.typingSound) {
            if (this.backgroundMusic && this.musicPlaying) {
                this.backgroundMusic.volume = 0.1; // Lower background music
            }
            this.typingSound.currentTime = 0;
            this.typingSound.play().catch(() => {});
        }
    }

    stopTypingSound() {
        if (this.typingSound) {
            this.typingSound.pause();
            this.typingSound.currentTime = 0;
            if (this.backgroundMusic && this.musicPlaying) {
                this.backgroundMusic.volume = this.originalMusicVolume; // Restore volume
            }
        }
    }

    playEndSceneSound() {
        if (this.endSceneSound) {
            if (this.backgroundMusic && this.musicPlaying) {
                this.backgroundMusic.volume = 0.1; // Lower background music
            }

            this.endSceneSound.currentTime = 0;
            this.endSceneSound.play().then(() => {
                const restoreMusic = () => {
                    if (this.backgroundMusic && this.musicPlaying) {
                        this.backgroundMusic.volume = this.originalMusicVolume;
                    }
                    this.endSceneSound.removeEventListener('ended', restoreMusic);
                };
                this.endSceneSound.addEventListener('ended', restoreMusic);
            }).catch(() => {
                setTimeout(() => {
                    if (this.backgroundMusic && this.musicPlaying) {
                        this.backgroundMusic.volume = this.originalMusicVolume;
                    }
                }, 3000);
            });
        }
    }

    stopStory() {
        // Stop any typing sounds when story is stopped
        this.stopTypingSound();
        this.finalEnding = 'Mission Terminated by User';

        // Record mission end time for stopped missions
        this.missionEndTime = Date.now();

        // Update the header to show mission stopped
        const endingTitle = document.getElementById('endingTitle');
        if (endingTitle) {
            endingTitle.textContent = 'Mission Terminated';
        }

        // Update the header text
        const gameOverHeader = document.querySelector('#gameOverScreen h2');
        if (gameOverHeader) {
            gameOverHeader.textContent = '🛑 Mission Stopped 🛑';
        }

        this.showGameOver();
    }

    showGameOver() {
        // Stop any typing sounds and play end scene sound
        this.stopTypingSound();
        this.playEndSceneSound();

        // Record mission end time
        this.missionEndTime = Date.now();

        // Set appropriate header text based on how the game ended
        const gameOverHeader = document.querySelector('#gameOverScreen h2');
        const endingTitle = document.getElementById('endingTitle');

        if (this.finalEnding === 'Mission Terminated by User') {
            // Game was stopped by user - keep the stopped message
            if (gameOverHeader) {
                gameOverHeader.textContent = '🛑 Mission Stopped 🛑';
            }
            if (endingTitle) {
                endingTitle.textContent = 'Mission Terminated';
            }
        } else {
            // Game ended naturally - show completion message
            if (gameOverHeader) {
                gameOverHeader.textContent = '🌟 Mission Complete! 🌟';
            }
            if (endingTitle) {
                endingTitle.textContent = 'Mission Accomplished';
            }
        }

        document.querySelector('.story-container').classList.add('hidden');
        this.gameOverScreen.classList.remove('hidden');
        this.storyProgress = this.maxProgress;
        this.updateProgress();
        this.updateEndingBadge();
        this.generateChoiceReport();

        // Hide navigation controls during game over
        this.updateNavigationButtons();
    }

    updateEndingBadge() {
        const endingIcons = {
            'Galactic Cartographer': '🗺️',
            'Galactic Navigator': '🧭',
            'Quantum Consciousness Weaver': '🧠',
            'Guardian of the Zephyrian Legacy': '💎',
            'Greatest Scientific Mind': '🔬',
            'Bio-Ship Pioneer': '🚀',
            'Keeper of Galactic Knowledge': '📚',
            'Cosmic Energy Engineer': '⚡',
            'Celestial Archivist': '🏛️',
            'Galactic Cultural Ambassador': '🤝',
            'Galactic Guardian': '🛡️',
            'Defensive Technology Specialist': '⚔️',
            'Galactic Peacekeeper': '🕊️',
            'Interspecies Diplomatic Coordinator': '🌟',
            'Crystal Technology Specialist': '💎',
            'Deep Space Explorer': '🚀',
            'Galactic Knowledge Keeper': '📖',
            'Civilization Historian': '📜',
            'Cosmic Cartographer': '🗺️',
            'Alien Ambassador': '👽',
            'Space Guardian': '🛡️',
            'Diplomatic Bridge Builder': '🌉',
            'Bio-Tech Symbiosis Pioneer': '🔬',
            'Cosmic Consciousness Transcendent': '🧠'
        };

        const icon = endingIcons[this.finalEnding] || '🏆';
        this.endingIcon.textContent = icon;
        this.endingTitle.textContent = this.finalEnding;
    }

    generateChoiceReport() {
        // Populate the new card-based layout instead of text report
        this.populateMissionCards();
    }

    populateMissionCards() {
        // Apply theme based on story path
        this.applyEndScreenTheme();

        // Populate Journey Choices
        const journeyChoices = document.getElementById('journeyChoices');
        journeyChoices.innerHTML = '';

        if (this.choiceDetails.length > 0) {
            this.choiceDetails.forEach((detail) => {
                const li = document.createElement('li');
                li.textContent = detail.choiceText;
                journeyChoices.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Mission ended early';
            journeyChoices.appendChild(li);
        }

        // Populate Mission Statistics
        // Count unique scenes visited (use sceneHistory length, which tracks actual scenes visited)
        const uniqueScenesVisited = this.sceneHistory.length;
        document.getElementById('scenesVisited').textContent = uniqueScenesVisited;
        document.getElementById('decisionsCount').textContent = this.choiceDetails.length;

        // Calculate real mission duration
        let durationText = '00:00';
        if (this.missionStartTime && this.missionEndTime) {
            const durationMs = this.missionEndTime - this.missionStartTime;
            const totalSeconds = Math.floor(durationMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            durationText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else if (this.missionStartTime) {
            // Mission is still ongoing, calculate current duration
            const durationMs = Date.now() - this.missionStartTime;
            const totalSeconds = Math.floor(durationMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            durationText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        document.getElementById('missionDuration').textContent = durationText;

        // Populate Mission Outcome
        document.getElementById('outcomeIcon').textContent = this.getEndingIcon();
        document.getElementById('outcomeTitle').textContent = this.finalEnding || 'Mission Incomplete';
        document.getElementById('outcomeDescription').textContent = this.getOutcomeDescription();

        // Populate Achievement Badges
        this.populateAchievementBadges();
    }

    applyEndScreenTheme() {
        const gameOverScreen = document.getElementById('gameOverScreen');
        const pathType = this.getStoryPathType();

        // Remove existing theme classes
        gameOverScreen.classList.remove('explorer-theme', 'diplomatic-theme', 'scientist-theme');

        // Apply theme based on story path
        if (pathType === 'Bold Explorer') {
            gameOverScreen.classList.add('explorer-theme');
        } else if (pathType === 'Diplomatic Pioneer') {
            gameOverScreen.classList.add('diplomatic-theme');
        } else if (pathType === 'Cautious Scientist') {
            gameOverScreen.classList.add('scientist-theme');
        }
    }

    getEndingIcon() {
        const endingIcons = {
            'Crystal Technology Specialist': '💎',
            'Deep Space Explorer': '🚀',
            'Galactic Knowledge Keeper': '📚',
            'Civilization Historian': '📜',
            'Cosmic Cartographer': '🗺️',
            'Alien Ambassador': '🤝',
            'Space Guardian': '🛡️',
            'Diplomatic Bridge Builder': '🌉',
            'Bio-Tech Symbiosis Pioneer': '🔬',
            'Cosmic Consciousness Transcendent': '🧠',
            'Galactic Cartographer': '🌌',
            'Galactic Navigator': '🧭',
            'Quantum Consciousness Weaver': '⚡',
            'Guardian of the Zephyrian Legacy': '👑',
            'Greatest Scientific Mind': '🔬',
            'Bio-Ship Pioneer': '🚢',
            'Keeper of Galactic Knowledge': '📖',
            'Cosmic Energy Engineer': '⚡',
            'Celestial Archivist': '📚',
            'Galactic Cultural Ambassador': '🌍',
            'Galactic Guardian': '🛡️',
            'Defensive Technology Specialist': '🔧',
            'Galactic Peacekeeper': '☮️',
            'Interspecies Diplomatic Coordinator': '🤝'
        };
        return endingIcons[this.finalEnding] || '🏆';
    }

    getOutcomeDescription() {
        if (!this.finalEnding || this.finalEnding.includes('Terminated')) {
            return 'Your mission was cut short, but every journey teaches us something valuable.';
        }

        const pathType = this.getStoryPathType();
        if (pathType === 'Bold Explorer') {
            return 'Your bold decisions led to extraordinary discoveries in the depths of space.';
        } else if (pathType === 'Diplomatic Pioneer') {
            return 'Your peaceful approach opened new pathways for interspecies cooperation.';
        } else if (pathType === 'Cautious Scientist') {
            return 'Your methodical approach ensured safe exploration while making significant discoveries.';
        } else {
            return 'Your balanced approach led to a successful and meaningful cosmic journey.';
        }
    }

    populateAchievementBadges() {
        const achievementBadges = document.getElementById('achievementBadges');
        achievementBadges.innerHTML = '';

        const achievements = this.generateAchievements().split('\n• ').slice(0, 4); // Limit to 4 badges

        achievements.forEach(achievement => {
            if (achievement.trim() && !achievement.includes('Mission Incomplete')) {
                const badge = document.createElement('div');
                badge.className = 'achievement-badge';

                // Extract icon and text from achievement string
                const match = achievement.match(/^(.+?)\s+"(.+?)"\s+-\s+(.+)$/);
                if (match) {
                    const [, icon, title, description] = match;
                    badge.innerHTML = `
                        <span class="badge-icon">${icon.trim()}</span>
                        <span class="badge-text">${title}</span>
                    `;
                    badge.title = description; // Tooltip with full description
                } else {
                    // Fallback for achievements that don't match the pattern
                    badge.innerHTML = `
                        <span class="badge-icon">🏆</span>
                        <span class="badge-text">${achievement.replace('• ', '').substring(0, 20)}...</span>
                    `;
                }

                achievementBadges.appendChild(badge);
            }
        });

        // If no achievements, show a default badge
        if (achievementBadges.children.length === 0) {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.innerHTML = `
                <span class="badge-icon">🚀</span>
                <span class="badge-text">Space Explorer</span>
            `;
            achievementBadges.appendChild(badge);
        }
    }

    getSceneName(sceneKey) {
        const sceneNames = {
            'start': 'Initial Signal Detection',
            'investigate': 'Direct Investigation',
            'scan': 'Cautious Scanning',
            'board': 'Station Boarding',
            'communicate': 'Communication Attempt',
            'peaceful': 'Peaceful Contact',
            'defensive': 'Defensive Posture',
            'crystalStudy': 'Crystal Technology Analysis',
            'blueCorridorExplore': 'Blue Corridor Exploration',
            'crystalInterface': 'Crystal Mental Interface',
            'crystalScan': 'Crystal Scientific Scanning',
            'starMapStudy': 'Holographic Star Map Study',
            'navigationConsole': 'Navigation Console Interaction',
            'coordinateGift': 'Coordinate Gift Reception',
            'creatorMeeting': 'Creator Meeting',
            'defensiveProtocol': 'Defensive Protocol Engagement',
            'trustBuilding': 'Trust Building Initiative',
            'crystalEnding': 'Crystal Technology Discovery',
            'exploreEnding': 'Deep Station Exploration',
            'knowledgeEnding': 'Ancient Knowledge Acquisition',
            'civilizationEnding': 'Civilization Inquiry',
            'explorerEnding': 'Explorer Coordinates Request',
            'meetingEnding': 'Creator Meeting Request',
            'guardianEnding': 'Guardian Stance',
            'trustEnding': 'Trust Building',
            'crystalTechEnding': 'Living Crystal Study',
            'consciousnessEnding': 'Consciousness Technology',
            'zephyrianGift': 'Zephyrian Gift Acceptance',
            'stationNetwork': 'Station Network Discovery',
            'scientificDiscovery': 'Scientific Breakthrough',
            'crystalSample': 'Crystal Sample Extraction',
            'ancientLibrary': 'Ancient Library Exploration',
            'energyStation': 'Energy Research Station',
            'celestialArchive': 'Celestial Archive Access',
            'knowledgeExchange': 'Knowledge Exchange Initiative',
            'guardianTraining': 'Guardian Training Program',
            'defensiveTech': 'Defensive Technology Study',
            'peacekeeperMembership': 'Peacekeeper Membership',
            'peacekeeperInfo': 'Peacekeeper Information'
        };
        return sceneNames[sceneKey] || sceneKey;
    }

    getEndingName(endingKey) {
        const endingNames = {
            'crystalEnding': 'Crystal Technology Specialist',
            'exploreEnding': 'Deep Space Explorer',
            'knowledgeEnding': 'Galactic Knowledge Keeper',
            'civilizationEnding': 'Civilization Historian',
            'explorerEnding': 'Cosmic Cartographer',
            'meetingEnding': 'Alien Ambassador',
            'guardianEnding': 'Space Guardian',
            'trustEnding': 'Diplomatic Bridge Builder',
            'crystalTechEnding': 'Bio-Tech Symbiosis Pioneer',
            'consciousnessEnding': 'Cosmic Consciousness Transcendent',
            'starMapStudy': 'Galactic Cartographer',
            'navigationConsole': 'Galactic Navigator',
            'zephyrianGift': 'Quantum Consciousness Weaver',
            'stationNetwork': 'Guardian of the Zephyrian Legacy',
            'scientificDiscovery': 'Greatest Scientific Mind',
            'crystalSample': 'Bio-Ship Pioneer',
            'ancientLibrary': 'Keeper of Galactic Knowledge',
            'energyStation': 'Cosmic Energy Engineer',
            'celestialArchive': 'Celestial Archivist',
            'knowledgeExchange': 'Galactic Cultural Ambassador',
            'guardianTraining': 'Galactic Guardian',
            'defensiveTech': 'Defensive Technology Specialist',
            'peacekeeperMembership': 'Galactic Peacekeeper',
            'peacekeeperInfo': 'Interspecies Diplomatic Coordinator'
        };
        return endingNames[endingKey] || 'Unknown Ending';
    }

    getChoiceDescription(choiceKey) {
        const descriptions = {
            'investigate': 'Chose immediate action over caution',
            'scan': 'Prioritized safety and analysis',
            'board': 'Decided to physically explore the station',
            'communicate': 'Attempted diplomatic first contact',
            'peaceful': 'Extended peaceful greetings',
            'defensive': 'Maintained protective protocols',
            'crystalStudy': 'Chose to study crystal technology',
            'blueCorridorExplore': 'Explored the mysterious blue corridor',
            'crystalInterface': 'Allowed mental interface with crystals',
            'crystalScan': 'Used scientific scanning approach',
            'starMapStudy': 'Examined ancient star maps',
            'navigationConsole': 'Interacted with navigation systems',
            'coordinateGift': 'Accepted coordinate gift',
            'creatorMeeting': 'Requested to meet the creators',
            'defensiveProtocol': 'Maintained defensive protocols',
            'trustBuilding': 'Chose to build trust',
            'zephyrianGift': 'Accepted the Zephyrian gift',
            'stationNetwork': 'Inquired about station network',
            'scientificDiscovery': 'Pursued scientific discovery',
            'crystalSample': 'Attempted to take crystal sample',
            'ancientLibrary': 'Chose to visit ancient library',
            'energyStation': 'Headed to energy research station',
            'celestialArchive': 'Asked about Celestial Archive',
            'knowledgeExchange': 'Offered knowledge exchange',
            'guardianTraining': 'Accepted guardian training',
            'defensiveTech': 'Studied defensive technology',
            'peacekeeperMembership': 'Accepted peacekeeper membership',
            'peacekeeperInfo': 'Learned about peacekeepers first',
            'crystalEnding': 'Focused on crystal technology research',
            'exploreEnding': 'Pursued deeper exploration',
            'knowledgeEnding': 'Accepted ancient wisdom',
            'civilizationEnding': 'Sought historical understanding',
            'explorerEnding': 'Requested exploration coordinates',
            'meetingEnding': 'Sought direct creator contact',
            'guardianEnding': 'Maintained defensive readiness',
            'trustEnding': 'Chose trust over caution',
            'crystalTechEnding': 'Studied living bio-technology',
            'consciousnessEnding': 'Explored consciousness merger'
        };
        return descriptions[choiceKey] || choiceKey;
    }

    getStoryPathType() {
        const choices = this.choices;
        if (choices.includes('investigate') || choices.includes('board')) {
            return 'Bold Explorer';
        } else if (choices.includes('communicate') || choices.includes('peaceful')) {
            return 'Diplomatic Pioneer';
        } else if (choices.includes('scan') || choices.includes('defensive')) {
            return 'Cautious Scientist';
        }
        return 'Balanced Approach';
    }

    generateStorySummary() {
        if (this.choiceDetails.length === 0) {
            return "Mission was terminated before any major decisions were made.";
        }

        let summary = "You began as a space explorer who detected a mysterious signal from deep space. ";

        // Analyze the path taken
        const pathType = this.getStoryPathType();
        if (pathType === 'Bold Explorer') {
            summary += "You chose the path of direct action, investigating signals immediately and taking bold risks. ";
        } else if (pathType === 'Diplomatic Pioneer') {
            summary += "You chose the diplomatic path, prioritizing communication and peaceful contact with alien entities. ";
        } else if (pathType === 'Cautious Scientist') {
            summary += "You chose the scientific approach, carefully analyzing situations before taking action. ";
        } else {
            summary += "You took a balanced approach, mixing caution with boldness as situations demanded. ";
        }

        // Add ending context
        if (this.finalEnding.includes('Crystal')) {
            summary += "Your journey led you to discover ancient crystal technology and form a symbiotic relationship with living bio-tech.";
        } else if (this.finalEnding.includes('Knowledge')) {
            summary += "Your mission culminated in receiving vast ancient knowledge that will benefit all of humanity.";
        } else if (this.finalEnding.includes('Consciousness')) {
            summary += "You achieved a transcendent state by merging with cosmic consciousness technology.";
        } else if (this.finalEnding.includes('Terminated')) {
            summary += "You chose to end the mission early, prioritizing safety over discovery.";
        } else {
            summary += "Your unique path led to an extraordinary outcome that will shape the future of space exploration.";
        }

        return summary;
    }

    getExplorationStyle() {
        const choices = this.choices;
        let riskCount = 0;
        let cautionCount = 0;

        choices.forEach(choice => {
            if (['investigate', 'board', 'exploreEnding'].includes(choice)) {
                riskCount++;
            } else if (['scan', 'defensive', 'communicate'].includes(choice)) {
                cautionCount++;
            }
        });

        if (riskCount > cautionCount) {
            return 'Risk-Taking Pioneer';
        } else if (cautionCount > riskCount) {
            return 'Methodical Researcher';
        } else {
            return 'Adaptive Explorer';
        }
    }

    getRiskLevel() {
        const choices = this.choices;
        const highRiskChoices = ['investigate', 'board', 'exploreEnding'];
        const riskChoices = choices.filter(choice => highRiskChoices.includes(choice));

        if (riskChoices.length >= 2) {
            return 'High Risk - Bold Adventurer';
        } else if (riskChoices.length === 1) {
            return 'Moderate Risk - Calculated Explorer';
        } else {
            return 'Low Risk - Safety-Conscious Scientist';
        }
    }

    generateAchievements() {
        let achievements = [];
        const choices = this.choices;

        // Path-based achievements
        if (this.getStoryPathType() === 'Bold Explorer') {
            achievements.push('🚀 "Fearless Pioneer" - Chose direct action over caution');
        }
        if (this.getStoryPathType() === 'Diplomatic Pioneer') {
            achievements.push('🤝 "Galactic Diplomat" - Prioritized peaceful communication');
        }
        if (this.getStoryPathType() === 'Cautious Scientist') {
            achievements.push('🔬 "Methodical Researcher" - Applied scientific approach');
        }

        // Specific choice achievements
        if (choices.includes('investigate')) {
            achievements.push('⚡ "Quick Decision Maker" - Investigated signal immediately');
        }
        if (choices.includes('communicate')) {
            achievements.push('📡 "First Contact Specialist" - Attempted alien communication');
        }
        if (choices.includes('peaceful')) {
            achievements.push('🕊️ "Peace Ambassador" - Extended peaceful greetings');
        }
        if (choices.includes('scan')) {
            achievements.push('🛡️ "Safety First" - Prioritized caution and analysis');
        }

        // Ending-based achievements
        if (this.finalEnding.includes('Crystal')) {
            achievements.push('💎 "Bio-Tech Symbiosis" - Merged with living crystal technology');
        }
        if (this.finalEnding.includes('Knowledge')) {
            achievements.push('📚 "Cosmic Scholar" - Acquired ancient galactic knowledge');
        }
        if (this.finalEnding.includes('Consciousness')) {
            achievements.push('🧠 "Transcendent Being" - Achieved cosmic consciousness');
        }

        // Completion achievements
        if (this.storyProgress >= this.maxProgress) {
            achievements.push('🏁 "Mission Complete" - Reached a story conclusion');
        }
        if (this.choiceDetails.length >= 3) {
            achievements.push('🎯 "Decision Master" - Made multiple critical choices');
        }

        return achievements.length > 0 ? achievements.join('\n• ') : '• Mission Incomplete - Try playing through to the end!';
    }

    generateFinalAssessment() {
        const pathType = this.getStoryPathType();
        const riskLevel = this.getRiskLevel();
        const choiceCount = this.choiceDetails.length;

        let assessment = "";

        if (this.finalEnding.includes('Terminated')) {
            assessment = "While your mission was cut short, you demonstrated good judgment in knowing when to prioritize safety. Sometimes the wisest choice is knowing when to stop.";
        } else if (choiceCount === 0) {
            assessment = "Your journey ended before any major decisions were made. Consider exploring the story further to discover the mysteries that await!";
        } else {
            // Positive assessment based on path
            if (pathType === 'Bold Explorer') {
                assessment = "Your bold and decisive approach led to remarkable discoveries. You have the courage needed for deep space exploration and aren't afraid to take calculated risks for the sake of knowledge.";
            } else if (pathType === 'Diplomatic Pioneer') {
                assessment = "Your diplomatic skills and peaceful approach opened doors that force never could. You have the wisdom to build bridges between species and create lasting alliances across the galaxy.";
            } else if (pathType === 'Cautious Scientist') {
                assessment = "Your methodical and scientific approach ensured safe exploration while still achieving significant discoveries. You balance curiosity with wisdom, making you an ideal deep space researcher.";
            } else {
                assessment = "Your balanced approach shows adaptability and good judgment. You know when to be bold and when to be cautious, making you a well-rounded space explorer.";
            }

            // Add risk assessment
            if (riskLevel.includes('High Risk')) {
                assessment += " Your willingness to take risks led to extraordinary outcomes that more cautious explorers might never achieve.";
            } else if (riskLevel.includes('Low Risk')) {
                assessment += " Your careful approach ensured your safety while still making meaningful discoveries.";
            }
        }

        return assessment;
    }

    restartStory() {
        this.currentScene = 'start';
        this.choices = [];
        this.choiceDetails = [];
        this.finalEnding = '';
        this.storyProgress = 0;
        this.updateProgress();

        // Reset timer
        this.missionStartTime = null;
        this.missionEndTime = null;

        // Reset milestones
        this.resetMilestones();

        // Reset navigation
        this.initializeNavigation();

        // Reset visual feedback
        document.body.classList.remove('explorer-path', 'diplomatic-path', 'scientist-path');
        this.pathIcon.textContent = '🚀';
        this.pathText.textContent = 'Ready for Mission';

        document.querySelector('.story-container').classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');

        this.storyText.innerHTML = `
            <p>Welcome to Voyage Aeon, where the mysteries of the cosmos await your discovery...</p>
            <p>Click "Begin Mission" to start your space adventure!</p>
        `;

        this.choicesContainer.innerHTML = `
            <button class="choice-btn" onclick="startStory()">🚀 Begin Mission</button>
        `;
    }



    showActionScreen(choiceText, nextScene) {
        // Check if this is the "Board the station" choice
        if (choiceText.includes("Board the station")) {
            this.showBoardingImage(nextScene);
            return;
        }

        // Check if this is the "Explore the blue-lit corridor" choice
        if (choiceText.includes("Explore the blue-lit corridor")) {
            this.showBlueCorridorImage(nextScene);
            return;
        }

        // Check if this is the "Scan the area first for safety" choice
        if (choiceText.includes("Scan the area first for safety")) {
            this.showScanAreaImage(nextScene);
            return;
        }

        // Check if this is the "Send a peaceful greeting" choice
        if (choiceText.includes("Send a peaceful greeting")) {
            this.showPeacefulGreetingImage(nextScene);
            return;
        }

        // Check if this is the "Raise shields defensively" choice
        if (choiceText.includes("Raise shields defensively")) {
            this.showRaiseShieldImage(nextScene);
            return;
        }

        // Check if this is the "Try to communicate first" choice
        console.log('Checking choice text:', choiceText);
        if (choiceText.includes("Try to communicate first")) {
            console.log('✅ Matched "Try to communicate first" - calling showCommunicateImage');
            this.showCommunicateImage(nextScene);
            return;
        }

        // Check if this is the "Accept the knowledge" choice
        if (choiceText.includes("Accept the knowledge")) {
            console.log('✅ Matched "Accept the knowledge" - calling showAcceptKnowledgeImage');
            this.showAcceptKnowledgeImage(nextScene);
            return;
        }

        // Check if this is the "Ask about their civilization first" choice
        if (choiceText.includes("Ask about their civilization first")) {
            console.log('✅ Matched "Ask about their civilization first" - calling showAskCivilizationImage');
            this.showAskCivilizationImage(nextScene);
            return;
        }

        // Check if this is the "Request to meet their creators" choice
        if (choiceText.includes("Request to meet their creators")) {
            console.log('✅ Matched "Request to meet their creators" - calling showMeetCreatorsImage');
            this.showMeetCreatorsImage(nextScene);
            return;
        }

        // Check if this is the "Offer human knowledge in exchange" choice
        if (choiceText.includes("Offer human knowledge in exchange")) {
            console.log('✅ Matched "Offer human knowledge in exchange" - calling showOfferKnowledgeImage');
            this.showOfferKnowledgeImage(nextScene);
            return;
        }

        // Check if this is the "Study the crystal technology" choice
        if (choiceText.includes("Study the crystal technology")) {
            console.log('✅ Matched "Study the crystal technology" - calling showCrystalStudyImage');
            this.showCrystalStudyImage(nextScene);
            return;
        }

        // Get action details based on the choice
        const actionData = this.getActionData(choiceText);

        // Set up the action screen
        this.actionIcon.textContent = actionData.icon;
        this.actionText.textContent = actionData.text;

        // Apply theme based on current path
        const pathType = this.getStoryPathType();
        this.actionScreen.classList.remove('explorer-action', 'diplomatic-action', 'scientist-action');
        if (pathType === 'Bold Explorer') {
            this.actionScreen.classList.add('explorer-action');
        } else if (pathType === 'Diplomatic Pioneer') {
            this.actionScreen.classList.add('diplomatic-action');
        } else if (pathType === 'Cautious Scientist') {
            this.actionScreen.classList.add('scientist-action');
        }

        // Hide story container and show action screen
        this.storyContainer.classList.add('hidden');
        this.actionScreen.style.display = 'flex';
        this.actionScreen.classList.remove('hidden');

        // Animate the loading bar
        this.animateLoadingBar(() => {
            // After animation completes, hide action screen and show next scene
            this.actionScreen.style.display = 'none';
            this.actionScreen.classList.add('hidden');
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        });
    }

    showBoardingImage(nextScene) {
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for your image
        const imagePaths = [
            'images/AstronautBoardingAlienSpaceStation.png',
            './images/AstronautBoardingAlienSpaceStation.png',
            'AstronautBoardingAlienSpaceStation.png',
            './AstronautBoardingAlienSpaceStation.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, show fallback
                console.log('All image paths failed, showing fallback');
                const fallbackText = document.createElement('div');
                fallbackText.style.cssText = `
                    color: #00d4ff;
                    font-size: 3em;
                    text-align: center;
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
                `;
                fallbackText.textContent = '🚀 Boarding Station...';
                imageOverlay.appendChild(fallbackText);
            }
        };

        image.onload = () => {
            console.log(`✅ Image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    showBlueCorridorImage(nextScene) {
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for your blue corridor image
        const imagePaths = [
            'images/AstronautWalkingDownTheBlue-litCooridor.png',
            './images/AstronautWalkingDownTheBlue-litCooridor.png',
            'AstronautWalkingDownTheBlue-litCooridor.png',
            './AstronautWalkingDownTheBlue-litCooridor.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying blue corridor path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, show fallback
                console.log('All blue corridor image paths failed, showing fallback');
                const fallbackText = document.createElement('div');
                fallbackText.style.cssText = `
                    color: #00d4ff;
                    font-size: 3em;
                    text-align: center;
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
                `;
                fallbackText.textContent = '🚶 Exploring Blue Corridor...';
                imageOverlay.appendChild(fallbackText);
            }
        };

        image.onload = () => {
            console.log(`✅ Blue corridor image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load blue corridor image: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    showScanAreaImage(nextScene) {
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for your scan area image
        const imagePaths = [
            'images/AstronautScanTheAreaFirstForSafety.png',
            './images/AstronautScanTheAreaFirstForSafety.png',
            'AstronautScanTheAreaFirstForSafety.png',
            './AstronautScanTheAreaFirstForSafety.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying scan area path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, show fallback
                console.log('All scan area image paths failed, showing fallback');
                const fallbackText = document.createElement('div');
                fallbackText.style.cssText = `
                    color: #00d4ff;
                    font-size: 3em;
                    text-align: center;
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
                `;
                fallbackText.textContent = '📡 Scanning Area...';
                imageOverlay.appendChild(fallbackText);
            }
        };

        image.onload = () => {
            console.log(`✅ Scan area image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load scan area image: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    showPeacefulGreetingImage(nextScene) {
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for your peaceful greeting image
        const imagePaths = [
            'images/AstronautSendingPeacefulGreeting.png',
            './images/AstronautSendingPeacefulGreeting.png',
            'AstronautSendingPeacefulGreeting.png',
            './AstronautSendingPeacefulGreeting.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying peaceful greeting path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, show fallback
                console.log('All peaceful greeting image paths failed, showing fallback');
                const fallbackText = document.createElement('div');
                fallbackText.style.cssText = `
                    color: #00d4ff;
                    font-size: 3em;
                    text-align: center;
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
                `;
                fallbackText.textContent = '🤝 Sending Peaceful Greeting...';
                imageOverlay.appendChild(fallbackText);
            }
        };

        image.onload = () => {
            console.log(`✅ Peaceful greeting image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load peaceful greeting image: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    showRaiseShieldImage(nextScene) {
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for your raise shield image
        const imagePaths = [
            'images/AstronautRaiseShield.png',
            './images/AstronautRaiseShield.png',
            'AstronautRaiseShield.png',
            './AstronautRaiseShield.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying raise shield path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, show fallback
                console.log('All raise shield image paths failed, showing fallback');
                const fallbackText = document.createElement('div');
                fallbackText.style.cssText = `
                    color: #00d4ff;
                    font-size: 3em;
                    text-align: center;
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
                `;
                fallbackText.textContent = '🛡️ Raising Shields...';
                imageOverlay.appendChild(fallbackText);
            }
        };

        image.onload = () => {
            console.log(`✅ Raise shield image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load raise shield image: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    showCommunicateImage(nextScene) {
        console.log('🚀 showCommunicateImage called with nextScene:', nextScene);
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for your communicate image
        const imagePaths = [
            'images/AstronautTryToCommunicateToAnAlienSpaceShip.png',
            './images/AstronautTryToCommunicateToAnAlienSpaceShip.png',
            'AstronautTryToCommunicateToAnAlienSpaceShip.png',
            './AstronautTryToCommunicateToAnAlienSpaceShip.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying communicate path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, show fallback
                console.log('All communicate image paths failed, showing fallback');
                const fallbackText = document.createElement('div');
                fallbackText.style.cssText = `
                    color: #00d4ff;
                    font-size: 3em;
                    text-align: center;
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
                `;
                fallbackText.textContent = '📡 Trying to Communicate...';
                imageOverlay.appendChild(fallbackText);
            }
        };

        image.onload = () => {
            console.log(`✅ Communicate image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load communicate image: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    showAcceptKnowledgeImage(nextScene) {
        console.log('🚀 showAcceptKnowledgeImage called with nextScene:', nextScene);
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for your accept knowledge image
        const imagePaths = [
            'images/AstronautAcceptTheknowledge.png',
            './images/AstronautAcceptTheknowledge.png',
            'AstronautAcceptTheknowledge.png',
            './AstronautAcceptTheknowledge.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying accept knowledge path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, show fallback
                console.log('All accept knowledge image paths failed, showing fallback');
                const fallbackText = document.createElement('div');
                fallbackText.style.cssText = `
                    color: #00d4ff;
                    font-size: 3em;
                    text-align: center;
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
                `;
                fallbackText.textContent = '🎓 Accepting Knowledge...';
                imageOverlay.appendChild(fallbackText);
            }
        };

        image.onload = () => {
            console.log(`✅ Accept knowledge image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load accept knowledge image: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    showAskCivilizationImage(nextScene) {
        console.log('🚀 showAskCivilizationImage called with nextScene:', nextScene);
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for your ask civilization image
        const imagePaths = [
            'images/AstronautAskAboutTheirCivilization First.png',
            './images/AstronautAskAboutTheirCivilization First.png',
            'AstronautAskAboutTheirCivilization First.png',
            './AstronautAskAboutTheirCivilization First.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying ask civilization path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, show fallback
                console.log('All ask civilization image paths failed, showing fallback');
                const fallbackText = document.createElement('div');
                fallbackText.style.cssText = `
                    color: #00d4ff;
                    font-size: 3em;
                    text-align: center;
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
                `;
                fallbackText.textContent = '🤔 Asking About Civilization...';
                imageOverlay.appendChild(fallbackText);
            }
        };

        image.onload = () => {
            console.log(`✅ Ask civilization image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load ask civilization image: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    showMeetCreatorsImage(nextScene) {
        console.log('🚀 showMeetCreatorsImage called with nextScene:', nextScene);
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for the meet creators image
        const imagePaths = [
            'images/AstronautRequestToMeetTheirCreators.png',
            './images/AstronautRequestToMeetTheirCreators.png',
            'AstronautRequestToMeetTheirCreators.png',
            './AstronautRequestToMeetTheirCreators.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying meet creators path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, just proceed without showing anything (image only, no fallback text)
                console.log('All meet creators image paths failed, proceeding without image');
                setTimeout(() => {
                    document.body.removeChild(imageOverlay);
                    this.storyContainer.classList.remove('hidden');
                    this.displayScene(nextScene);
                }, 3000);
                return;
            }
        };

        image.onload = () => {
            console.log(`✅ Meet creators image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load meet creators image: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    showOfferKnowledgeImage(nextScene) {
        console.log('🚀 showOfferKnowledgeImage called with nextScene:', nextScene);
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for the offer knowledge image
        const imagePaths = [
            'images/AstronautOfferHumanknowledgeInExchange.png',
            './images/AstronautOfferHumanknowledgeInExchange.png',
            'AstronautOfferHumanknowledgeInExchange.png',
            './AstronautOfferHumanknowledgeInExchange.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying offer knowledge path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, just proceed without showing anything (image only, no fallback text)
                console.log('All offer knowledge image paths failed, proceeding without image');
                setTimeout(() => {
                    document.body.removeChild(imageOverlay);
                    this.storyContainer.classList.remove('hidden');
                    this.displayScene(nextScene);
                }, 3000);
                return;
            }
        };

        image.onload = () => {
            console.log(`✅ Offer knowledge image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load offer knowledge image: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    showCrystalStudyImage(nextScene) {
        // Create a full-screen image overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Create the image element
        const image = document.createElement('img');
        // Try multiple possible file paths for your crystal study image
        const imagePaths = [
            'images/AstronautStudyTheCrystalTechnology.png',
            './images/AstronautStudyTheCrystalTechnology.png',
            'AstronautStudyTheCrystalTechnology.png',
            './AstronautStudyTheCrystalTechnology.png'
        ];

        let currentPathIndex = 0;

        // Function to try the next image path
        const tryNextPath = () => {
            currentPathIndex++;
            if (currentPathIndex < imagePaths.length) {
                console.log(`Trying crystal study path ${currentPathIndex + 1}: ${imagePaths[currentPathIndex]}`);
                image.src = imagePaths[currentPathIndex];
            } else {
                // All paths failed, just proceed without showing anything (image only, no fallback text)
                console.log('All crystal study image paths failed, proceeding without image');
                setTimeout(() => {
                    document.body.removeChild(imageOverlay);
                    this.storyContainer.classList.remove('hidden');
                    this.displayScene(nextScene);
                }, 3000);
                return;
            }
        };

        image.onload = () => {
            console.log(`✅ Crystal study image loaded successfully from: ${image.src}`);
        };

        image.onerror = () => {
            console.log(`❌ Failed to load crystal study image: ${image.src}`);
            tryNextPath();
        };

        image.src = imagePaths[0]; // Start with the first path

        image.style.cssText = `
            width: 90vw;
            height: 90vh;
            max-width: 1200px;
            max-height: 800px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        `;

        imageOverlay.appendChild(image);
        document.body.appendChild(imageOverlay);

        // Hide story container
        this.storyContainer.classList.add('hidden');

        // Show the image for 3 seconds, then proceed to next scene
        setTimeout(() => {
            // Remove the overlay and show the next scene
            document.body.removeChild(imageOverlay);
            this.storyContainer.classList.remove('hidden');
            this.displayScene(nextScene);
        }, 3000); // Show for exactly 3 seconds
    }

    getActionData(choiceText) {
        // Define action animations based on choice text and scene
        const actionMappings = {
            // Investigation actions
            'Investigate the signal immediately': {
                icon: '🔍',
                text: 'Scanning signal frequency...\nAnalyzing alien transmission...\nLocking onto coordinates...'
            },
            'Scan the area first for safety': {
                icon: '📡',
                text: 'Deploying sensor array...\nScanning for threats...\nAnalyzing environmental data...'
            },

            // Boarding and exploration actions
            'Board the station': {
                icon: '🚀',
                text: 'Docking with alien station...\nExtending boarding tube...\nEntering unknown structure...'
            },
            'Try to communicate first': {
                icon: '📡',
                text: 'Opening communication channels...\nTransmitting peaceful signals...\nWaiting for response...'
            },

            // Peaceful contact actions
            'Send a peaceful greeting': {
                icon: '🤝',
                text: 'Broadcasting universal peace symbols...\nTransmitting mathematical sequences...\nExtending diplomatic protocols...'
            },
            'Raise shields defensively': {
                icon: '🛡️',
                text: 'Activating defensive systems...\nRaising energy shields...\nPreparing evasive maneuvers...'
            },

            // Crystal and technology actions
            'Study the crystal technology': {
                icon: '🔬',
                text: 'Analyzing crystal structure...\nScanning energy patterns...\nDetecting bio-signatures...'
            },
            'Allow the mental interface': {
                icon: '🧠',
                text: 'Establishing neural connection...\nSynchronizing brainwaves...\nMerging consciousness...'
            },
            'Use your scanner to study them safely': {
                icon: '📱',
                text: 'Activating quantum scanner...\nAnalyzing molecular structure...\nRecording data patterns...'
            },

            // Navigation and exploration
            'Explore the blue-lit corridor': {
                icon: '🚶',
                text: 'Walking through alien corridors...\nFollowing the blue light...\nDiscovering new chambers...'
            },
            'Examine the star maps': {
                icon: '🗺️',
                text: 'Analyzing holographic displays...\nMapping galactic coordinates...\nDecoding navigation data...'
            },
            'Interact with the navigation console': {
                icon: '⚙️',
                text: 'Interfacing with alien technology...\nActivating control systems...\nInitializing navigation protocols...'
            },

            // Diplomatic actions
            'Ask for coordinates to explore': {
                icon: '📍',
                text: 'Requesting exploration data...\nDownloading star charts...\nReceiving galactic coordinates...'
            },
            'Request to meet their creators': {
                icon: '🤖',
                text: 'Transmitting meeting request...\nEstablishing diplomatic contact...\nWaiting for creator response...'
            },

            // Guardian and defensive actions
            'Maintain defensive stance': {
                icon: '🛡️',
                text: 'Holding defensive position...\nMonitoring threat levels...\nMaintaining shield integrity...'
            },
            'Lower shields to show trust': {
                icon: '🔄',
                text: 'Powering down weapons...\nLowering defensive barriers...\nSignaling peaceful intent...'
            },

            // Advanced choices
            'Accept their gift of knowledge': {
                icon: '🎁',
                text: 'Receiving ancient wisdom...\nDownloading cosmic knowledge...\nIntegrating new understanding...'
            },
            'Accept guardian training': {
                icon: '⚔️',
                text: 'Beginning training protocols...\nLearning defensive techniques...\nMastering guardian skills...'
            },
            'Accept membership': {
                icon: '🌟',
                text: 'Joining galactic organization...\nReceiving membership credentials...\nAccessing restricted knowledge...'
            }
        };

        // Find matching action or use default
        if (actionMappings[choiceText]) {
            return actionMappings[choiceText];
        }

        // Default action for unmatched choices
        return {
            icon: '⚡',
            text: 'Executing command...\nProcessing decision...\nContinuing mission...'
        };
    }

    animateLoadingBar(callback) {
        let progress = 0;
        const actionTexts = this.actionText.textContent.split('\n');
        let currentTextIndex = 0;

        // Start typing sound for action screen
        this.startTypingSound();

        const interval = setInterval(() => {
            progress += 2;
            this.loadingProgress.style.width = `${progress}%`;

            // Update text at specific progress points with typing sound
            if (progress >= 33 && currentTextIndex === 0) {
                this.actionText.textContent = actionTexts[1] || actionTexts[0];
                currentTextIndex = 1;
                // Brief typing sound for text change
                this.startTypingSound();
                setTimeout(() => this.stopTypingSound(), 300);
            } else if (progress >= 66 && currentTextIndex === 1) {
                this.actionText.textContent = actionTexts[2] || actionTexts[1] || actionTexts[0];
                currentTextIndex = 2;
                // Brief typing sound for text change
                this.startTypingSound();
                setTimeout(() => this.stopTypingSound(), 300);
            }

            if (progress >= 100) {
                clearInterval(interval);
                this.loadingProgress.style.width = '0%';
                // Stop typing sound when action is complete
                this.stopTypingSound();
                setTimeout(callback, 500); // Brief pause before continuing
            }
        }, 50); // Update every 50ms for smooth animation
    }

    ensureActionScreenHidden() {
        // Make sure action screen is hidden when game initializes
        if (this.actionScreen) {
            this.actionScreen.style.display = 'none';
            this.actionScreen.classList.add('hidden');
        }
        if (this.storyContainer) {
            this.storyContainer.classList.remove('hidden');
        }
        if (this.gameOverScreen) {
            this.gameOverScreen.classList.add('hidden');
        }
    }

    shareResults() {
        const shareText = `🚀 I just completed Voyage Aeon!

🎯 Final Outcome: ${this.finalEnding}
📊 Decisions Made: ${this.choiceDetails.length}
🛤️ Path Type: ${this.getStoryPathType()}
⚡ Risk Level: ${this.getRiskLevel()}

Play your own space adventure at: ${window.location.href}

#VoyageAeon #SpaceAdventure #InteractiveStory`;

        if (navigator.share) {
            navigator.share({
                title: 'Voyage Aeon - Mission Complete!',
                text: shareText,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Results copied to clipboard! Share your adventure with friends!');
            }).catch(() => {
                // Final fallback: show in alert
                alert('Share your results:\n\n' + shareText);
            });
        }
    }

    viewStats() {
        const totalEndings = 18; // Total number of possible endings
        const completionRate = Math.round((this.storyProgress / this.maxProgress) * 100);

        let statsText = `📊 VOYAGE AEON STATISTICS\n`;
        statsText += `═══════════════════════════════\n\n`;
        statsText += `🎯 Current Mission:\n`;
        statsText += `• Ending Achieved: ${this.finalEnding}\n`;
        statsText += `• Completion Rate: ${completionRate}%\n`;
        statsText += `• Decisions Made: ${this.choiceDetails.length}\n`;
        statsText += `• Story Path: ${this.getStoryPathType()}\n`;
        statsText += `• Risk Assessment: ${this.getRiskLevel()}\n\n`;

        statsText += `🌌 Game Information:\n`;
        statsText += `• Total Possible Endings: ${totalEndings}\n`;
        statsText += `• Story Scenes: ${Object.keys(this.storyData).length}\n`;
        statsText += `• Maximum Story Length: ${this.maxProgress} stages\n\n`;

        statsText += `🏆 Mission Summary:\n`;
        this.choiceDetails.forEach((choice, index) => {
            statsText += `${index + 1}. ${choice.text}\n`;
        });

        alert(statsText);
    }

    // Navigation Methods
    updateNavigationButtons() {
        // Show navigation controls only during active story (not at start or game over)
        if (this.currentScene === 'start' || this.sceneHistory.length === 0) {
            this.navigationControls.style.display = 'none';
            return;
        }

        // Check if we're in game over state
        if (this.gameOverScreen && !this.gameOverScreen.classList.contains('hidden')) {
            this.navigationControls.style.display = 'none';
            return;
        }

        this.navigationControls.style.display = 'flex';

        // Update Previous button
        this.prevBtn.disabled = this.currentHistoryIndex <= 0;

        // Update Next button - disabled if we're at the end of history or if current scene has choices
        const currentScene = this.storyData[this.currentScene];
        const hasChoices = currentScene && currentScene.choices && currentScene.choices.length > 0;
        const isAtEndOfHistory = this.currentHistoryIndex >= this.sceneHistory.length - 1;

        this.nextBtn.disabled = isAtEndOfHistory || hasChoices;
    }

    navigatePrevious() {
        if (this.currentHistoryIndex > 0) {
            this.currentHistoryIndex--;
            const previousScene = this.sceneHistory[this.currentHistoryIndex];
            this.displayScene(previousScene, false); // Don't add to history
        }
    }

    navigateNext() {
        if (this.currentHistoryIndex < this.sceneHistory.length - 1) {
            this.currentHistoryIndex++;
            const nextScene = this.sceneHistory[this.currentHistoryIndex];
            this.displayScene(nextScene, false); // Don't add to history
        }
    }

    initializeNavigation() {
        // Initialize navigation state
        this.sceneHistory = [];
        this.currentHistoryIndex = -1;
        this.updateNavigationButtons();
    }

    /**
     * Show the help modal
     * Displays comprehensive game instructions and controls
     */
    showHelp() {
        this.helpModal.classList.remove('hidden');
        // Focus on the close button for accessibility
        setTimeout(() => {
            this.closeHelpBtn.focus();
        }, 100);
    }

    /**
     * Hide the help modal
     * Closes the help modal and returns focus to the help button
     */
    hideHelp() {
        this.helpModal.classList.add('hidden');
        // Return focus to help button for accessibility
        this.helpBtn.focus();
    }

    /**
     * Handle keyboard events
     * Provides keyboard shortcuts for game controls
     */
    handleKeyPress(event) {
        // Close help modal with Escape key
        if (event.key === 'Escape' && !this.helpModal.classList.contains('hidden')) {
            this.hideHelp();
            event.preventDefault();
        }
        // Close AI panel with Escape key
        if (event.key === 'Escape' && this.aiAssistantPanel.classList.contains('expanded')) {
            this.hideAiPanel();
            event.preventDefault();
        }
    }

    /**
     * Toggle the AI assistant panel
     * Shows or hides the side panel
     */
    toggleAiPanel() {
        if (this.aiAssistantPanel.classList.contains('expanded')) {
            this.hideAiPanel();
        } else {
            this.showAiPanel();
        }
    }

    /**
     * Show the AI assistant panel
     * Displays the side panel interface
     */
    showAiPanel() {
        this.aiAssistantPanel.classList.add('expanded');
        // Focus on the input for accessibility
        setTimeout(() => {
            this.aiPanelInput.focus();
        }, 300);
    }

    /**
     * Hide the AI assistant panel
     * Closes the side panel interface
     */
    hideAiPanel() {
        this.aiAssistantPanel.classList.remove('expanded');
        // Return focus to toggle button for accessibility
        this.aiPanelToggle.focus();
    }

    /**
     * Handle quick action button clicks
     * Processes predefined questions from quick action buttons
     */
    handleQuickAction(question) {
        // Add user message to chat
        this.addAiMessage(question, 'user');
        // Get and add bot response
        const response = this.getChatbotResponse(question);
        setTimeout(() => {
            this.addAiMessage(response, 'bot');
        }, 500);
    }

    /**
     * Send an AI message from the input field
     * Processes user input and generates AI response
     */
    sendAiMessage() {
        const message = this.aiPanelInput.value.trim();

        // Comprehensive input validation
        const validationResult = this.validateChatInput(message);
        if (!validationResult.isValid) {
            this.showInputValidationError(validationResult.error);
            return;
        }

        // Add user message to chat
        this.addAiMessage(message, 'user');

        // Clear input
        this.aiPanelInput.value = '';

        // Get and add bot response
        const response = this.getChatbotResponse(message);
        setTimeout(() => {
            this.addAiMessage(response, 'bot');
        }, 500);
    }

    /**
     * Comprehensive input validation for chat messages
     * Validates both syntactical and semantic aspects
     * @param {string} input - The user input to validate
     * @returns {Object} - Validation result with isValid flag and error message
     */
    validateChatInput(input) {
        // Syntactical validation
        if (!input || typeof input !== 'string') {
            return { isValid: false, error: 'Please enter a message.' };
        }

        if (input.length === 0) {
            return { isValid: false, error: 'Message cannot be empty.' };
        }

        if (input.length > 200) {
            return { isValid: false, error: 'Message too long. Please keep it under 200 characters.' };
        }

        // Check for only whitespace
        if (input.replace(/\s/g, '').length === 0) {
            return { isValid: false, error: 'Message cannot contain only spaces.' };
        }

        // Semantic validation
        const sanitizedInput = this.sanitizeInput(input);
        if (sanitizedInput !== input) {
            return { isValid: false, error: 'Message contains invalid characters. Please use only letters, numbers, and basic punctuation.' };
        }

        // Check for spam patterns (repeated characters)
        if (this.detectSpamPattern(input)) {
            return { isValid: false, error: 'Please avoid repetitive text patterns.' };
        }

        // Check for appropriate content (basic profanity filter)
        if (this.containsInappropriateContent(input)) {
            return { isValid: false, error: 'Please keep your message appropriate for all audiences.' };
        }

        // Rate limiting check
        if (this.isRateLimited()) {
            return { isValid: false, error: 'Please wait a moment before sending another message.' };
        }

        return { isValid: true };
    }

    /**
     * Sanitize user input by removing potentially harmful characters
     * @param {string} input - Raw user input
     * @returns {string} - Sanitized input
     */
    sanitizeInput(input) {
        // Allow letters, numbers, spaces, and basic punctuation
        return input.replace(/[^a-zA-Z0-9\s.,!?'"()-]/g, '');
    }

    /**
     * Detect spam patterns in user input
     * @param {string} input - User input to check
     * @returns {boolean} - True if spam pattern detected
     */
    detectSpamPattern(input) {
        // Check for repeated characters (more than 4 in a row)
        if (/(.)\1{4,}/.test(input)) {
            return true;
        }

        // Check for repeated words
        const words = input.toLowerCase().split(/\s+/);
        const wordCount = {};
        for (const word of words) {
            if (word.length > 2) {
                wordCount[word] = (wordCount[word] || 0) + 1;
                if (wordCount[word] > 3) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Basic content filter for inappropriate language
     * @param {string} input - User input to check
     * @returns {boolean} - True if inappropriate content detected
     */
    containsInappropriateContent(input) {
        // Basic list of inappropriate words (you can expand this)
        const inappropriateWords = ['spam', 'test123', 'aaaa', 'bbbb'];
        const lowerInput = input.toLowerCase();

        return inappropriateWords.some(word => lowerInput.includes(word));
    }

    /**
     * Check if user is sending messages too quickly (rate limiting)
     * @returns {boolean} - True if rate limited
     */
    isRateLimited() {
        const now = Date.now();
        const timeWindow = 2000; // 2 seconds between messages

        if (!this.lastMessageTime) {
            this.lastMessageTime = now;
            return false;
        }

        if (now - this.lastMessageTime < timeWindow) {
            return true;
        }

        this.lastMessageTime = now;
        return false;
    }

    /**
     * Show input validation error to user
     * @param {string} errorMessage - Error message to display
     */
    showInputValidationError(errorMessage) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = `
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.3);
            color: #ff6b6b;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 0.8em;
            margin: 5px 0;
            animation: fadeInOut 3s ease-in-out;
        `;

        // Add error message above input
        const inputArea = document.querySelector('.ai-panel-input-area');
        inputArea.insertBefore(errorDiv, inputArea.firstChild);

        // Remove error message after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);

        // Add CSS animation for error message
        if (!document.querySelector('#errorAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'errorAnimationStyle';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(-10px); }
                    20% { opacity: 1; transform: translateY(0); }
                    80% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Add a message to the AI panel interface
     * @param {string} message - The message content
     * @param {string} sender - Either 'user' or 'bot'
     */
    addAiMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '🤖' : '👨‍🚀';

        const content = document.createElement('div');
        content.className = 'message-content';

        // Handle HTML content for bot messages
        if (sender === 'bot' && message.includes('<')) {
            content.innerHTML = message;
        } else {
            content.textContent = message;
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.aiPanelMessages.appendChild(messageDiv);

        // Scroll to bottom
        this.aiPanelMessages.scrollTop = this.aiPanelMessages.scrollHeight;
    }

    /**
     * Download mission report as a text file
     * Generates a comprehensive report and triggers download
     */
    downloadReport() {
        const report = this.generateDownloadableReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Voyage_Aeon_Mission_Report_${this.getCurrentTimestamp()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Generate a comprehensive downloadable mission report
     * @returns {string} - Formatted text report
     */
    generateDownloadableReport() {
        const timestamp = new Date().toLocaleString();
        const duration = this.getMissionDurationText();
        const pathType = this.getStoryPathType();
        const achievements = this.generateAchievements();

        let report = '';
        report += '═══════════════════════════════════════════════════════════════\n';
        report += '                    VOYAGE AEON - MISSION REPORT                    \n';
        report += '═══════════════════════════════════════════════════════════════\n\n';

        // Mission Header
        report += `📅 Mission Date: ${timestamp}\n`;
        report += `🚀 Commander: Space Explorer\n`;
        report += `🎯 Mission Status: ${this.finalEnding || 'Incomplete'}\n`;
        report += `⏱️  Mission Duration: ${duration}\n`;
        report += `🛤️  Story Path: ${pathType}\n\n`;

        // Mission Outcome
        report += '═══════════════════════════════════════════════════════════════\n';
        report += '                        MISSION OUTCOME                         \n';
        report += '═══════════════════════════════════════════════════════════════\n\n';

        if (this.finalEnding) {
            report += `🏆 Final Achievement: ${this.finalEnding}\n\n`;
            report += `📖 Mission Summary:\n`;
            report += `${this.getOutcomeDescription()}\n\n`;
        } else {
            report += `⚠️  Mission Status: Terminated Early\n`;
            report += `📖 Mission Summary: Mission was stopped before completion.\n\n`;
        }

        // Journey Details
        report += '═══════════════════════════════════════════════════════════════\n';
        report += '                       JOURNEY DETAILS                          \n';
        report += '═══════════════════════════════════════════════════════════════\n\n';

        report += `📊 Mission Statistics:\n`;
        report += `   • Scenes Visited: ${this.sceneHistory.length}\n`;
        report += `   • Decisions Made: ${this.choiceDetails.length}\n`;
        report += `   • Mission Duration: ${duration}\n`;
        report += `   • Story Path Type: ${pathType}\n\n`;

        // Choice History
        if (this.choiceDetails.length > 0) {
            report += `🛤️  Your Cosmic Journey:\n`;
            this.choiceDetails.forEach((detail, index) => {
                report += `   ${index + 1}. ${detail.choiceText}\n`;
            });
            report += '\n';
        }

        // Achievements
        report += '═══════════════════════════════════════════════════════════════\n';
        report += '                         ACHIEVEMENTS                           \n';
        report += '═══════════════════════════════════════════════════════════════\n\n';

        if (achievements && !achievements.includes('Mission Incomplete')) {
            const achievementList = achievements.split('\n• ').filter(a => a.trim());
            achievementList.forEach(achievement => {
                if (achievement.trim()) {
                    report += `🏆 ${achievement.replace('• ', '')}\n`;
                }
            });
        } else {
            report += `🚀 Space Explorer - Embarked on a cosmic journey\n`;
        }

        report += '\n';

        // Footer
        report += '═══════════════════════════════════════════════════════════════\n';
        report += '                    END OF MISSION REPORT                       \n';
        report += '═══════════════════════════════════════════════════════════════\n\n';

        report += `Generated by Voyage Aeon Interactive Story Game\n`;
        report += `Report Date: ${timestamp}\n`;
        report += `\nThank you for exploring the cosmos! 🌌\n`;

        return report;
    }

    /**
     * Get current timestamp for filename
     * @returns {string} - Formatted timestamp
     */
    getCurrentTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}`;
    }

    /**
     * Get mission duration as formatted text
     * @returns {string} - Duration in MM:SS format
     */
    getMissionDurationText() {
        if (this.missionStartTime && this.missionEndTime) {
            const durationMs = this.missionEndTime - this.missionStartTime;
            const totalSeconds = Math.floor(durationMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else if (this.missionStartTime) {
            const durationMs = Date.now() - this.missionStartTime;
            const totalSeconds = Math.floor(durationMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return '00:00';
    }

    /**
     * Generate chatbot responses based on user input
     * @param {string} input - User's question or message
     * @returns {string} - Bot's response
     */
    getChatbotResponse(input) {
        const lowerInput = input.toLowerCase();

        // Game controls and mechanics
        if (lowerInput.includes('how') && (lowerInput.includes('play') || lowerInput.includes('game'))) {
            return `🎮 <strong>How to Play Voyage Aeon:</strong><br><br>
                    1. <strong>Read the story</strong> - Each scene describes your space adventure<br>
                    2. <strong>Make choices</strong> - Select one of two options to shape your journey<br>
                    3. <strong>Explore paths</strong> - Your decisions lead to different storylines<br>
                    4. <strong>Reach endings</strong> - Complete your mission to see your cosmic destiny!<br><br>
                    💡 <em>Tip: Try different choices to discover all 15+ unique endings!</em>`;
        }

        if (lowerInput.includes('control') || lowerInput.includes('button')) {
            return `⚙️ <strong>Game Controls:</strong><br><br>
                    🛑 <strong>Stop Mission</strong> - End current game early<br>
                    🎵 <strong>Music Toggle</strong> - Turn background music on/off<br>
                    🔄 <strong>Restart</strong> - Begin a new adventure<br>
                    ❓ <strong>Help</strong> - View detailed game guide<br>
                    ◀▶ <strong>Navigation</strong> - Go back/forward through scenes<br><br>
                    ⌨️ <strong>Keyboard:</strong> Press Escape to close modals`;
        }

        // Story paths and choices
        if (lowerInput.includes('path') || lowerInput.includes('story') || lowerInput.includes('choice')) {
            return `🛤️ <strong>Story Paths in Voyage Aeon:</strong><br><br>
                    🚀 <strong>Bold Explorer</strong> - Take direct action, investigate immediately<br>
                    🤝 <strong>Diplomatic Pioneer</strong> - Prioritize communication and peace<br>
                    🔬 <strong>Cautious Scientist</strong> - Analyze carefully before acting<br><br>
                    Each path leads to different encounters, technologies, and endings!<br>
                    Your choices determine which cosmic destiny awaits you.`;
        }

        // Achievements and endings
        if (lowerInput.includes('achievement') || lowerInput.includes('ending') || lowerInput.includes('unlock')) {
            return `🏆 <strong>Achievements & Endings:</strong><br><br>
                    📊 <strong>15+ Unique Endings</strong> based on your choices<br>
                    🎯 <strong>Path Achievements</strong> - Fearless Pioneer, Galactic Diplomat, etc.<br>
                    ⚡ <strong>Choice Achievements</strong> - Quick Decision Maker, Peace Ambassador<br>
                    💎 <strong>Ending Achievements</strong> - Bio-Tech Symbiosis, Cosmic Scholar<br><br>
                    💡 <em>Try different story paths to unlock all achievements!</em>`;
        }

        // Navigation help
        if (lowerInput.includes('navigation') || lowerInput.includes('back') || lowerInput.includes('previous')) {
            return `🧭 <strong>Navigation System:</strong><br><br>
                    ◀ <strong>Previous</strong> - Go back to earlier scenes you've visited<br>
                    ▶ <strong>Next</strong> - Move forward if you've been there before<br>
                    📊 <strong>Progress Bar</strong> - Shows your journey completion<br>
                    🎯 <strong>Milestones</strong> - Track major story achievements<br><br>
                    💡 <em>Navigation arrows appear at screen corners during gameplay!</em>`;
        }

        // Music and audio
        if (lowerInput.includes('music') || lowerInput.includes('sound') || lowerInput.includes('audio')) {
            return `🎵 <strong>Audio Features:</strong><br><br>
                    🎼 <strong>Background Music</strong> - Immersive sci-fi soundtrack<br>
                    ⌨️ <strong>Typing Sounds</strong> - Realistic text effects<br>
                    🎬 <strong>Action Sounds</strong> - Audio feedback for choices<br>
                    🏁 <strong>End Scene Audio</strong> - Special completion sounds<br><br>
                    🔊 Use the Music Toggle button to control audio!`;
        }

        // Current game state help
        if (lowerInput.includes('stuck') || lowerInput.includes('help') || lowerInput.includes('what') && lowerInput.includes('do')) {
            const currentScene = this.currentScene;
            if (currentScene === 'start') {
                return `🚀 <strong>Ready to Begin!</strong><br><br>
                        Click "Begin Mission" to start your space adventure!<br>
                        You'll detect a mysterious signal and need to decide how to respond.`;
            } else {
                return `🎯 <strong>Current Situation:</strong><br><br>
                        You're in the middle of your cosmic journey! Read the story text carefully and choose one of the two options presented.<br><br>
                        💡 <em>Each choice shapes your destiny - there are no wrong answers, only different adventures!</em>`;
            }
        }

        // Tips and strategies
        if (lowerInput.includes('tip') || lowerInput.includes('strategy') || lowerInput.includes('advice')) {
            return `💡 <strong>Pro Tips for Space Explorers:</strong><br><br>
                    📖 <strong>Read Carefully</strong> - Story details hint at choice consequences<br>
                    🔄 <strong>Experiment</strong> - Try different paths to see all content<br>
                    🧭 <strong>Use Navigation</strong> - Go back to explore alternative choices<br>
                    🎯 <strong>Collect Achievements</strong> - Each playthrough can unlock new ones<br>
                    🎵 <strong>Enjoy the Journey</strong> - Focus on the story and immersion!`;
        }

        // Default responses for unrecognized input
        const defaultResponses = [
            `🤖 I'm here to help with your space adventure! Try asking about:<br>
             • Game controls and how to play<br>
             • Story paths and choices<br>
             • Achievements and endings<br>
             • Navigation and tips`,

            `🌌 Interesting question! I can help you with:<br>
             • Understanding game mechanics<br>
             • Exploring different story paths<br>
             • Getting achievement tips<br>
             • Learning about controls`,

            `🚀 I'm your AI assistant for this cosmic journey! Ask me about:<br>
             • How to play the game<br>
             • What the different buttons do<br>
             • Story paths and endings<br>
             • Tips for exploration`
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }


}

// Initialize the game
let game;

// Global functions for HTML onclick events
function startStory() {
    game.startStory();
}

function restartStory() {
    game.restartStory();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Force hide action screen immediately
    const actionScreen = document.getElementById('actionScreen');
    if (actionScreen) {
        actionScreen.style.display = 'none';
        actionScreen.classList.add('hidden');
    }

    // Show story container
    const storyContainer = document.getElementById('storyContainer');
    if (storyContainer) {
        storyContainer.style.display = 'block';
        storyContainer.classList.remove('hidden');
    }

    game = new VoyageAeonStory();

    // Additional music initialization after a short delay
    setTimeout(() => {
        if (game && !game.musicPlaying) {
            game.tryPlayMusic();
        }
    }, 1000);
});