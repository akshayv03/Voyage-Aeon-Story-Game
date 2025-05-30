// Interactive Story Game Logic
class VoyageAeonStory {
    constructor() {
        this.currentScene = 'start';
        this.choices = [];
        this.choiceDetails = []; // Store detailed choice information
        this.musicPlaying = false;
        this.storyProgress = 0;
        this.maxProgress = 15;
        this.finalEnding = '';
        this.gameStarted = false; // Track if game has actually started

        this.initializeElements();
        this.setupEventListeners();
        this.loadStoryData();
        this.ensureActionScreenHidden();
        this.initializeMusic(); // Start music immediately when game loads
    }

    initializeElements() {
        // Initialize all DOM elements with error checking
        this.storyText = document.getElementById('storyText');
        this.choicesContainer = document.getElementById('choicesContainer');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.gameOverText = document.getElementById('gameOverText');
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.typingSound = document.getElementById('typingSound');
        this.endSceneSound = document.getElementById('endSceneSound');
        this.musicToggle = document.getElementById('musicToggle');
        this.stopBtn = document.getElementById('stopBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.progressFill = document.getElementById('progressFill');
        this.pathIndicator = document.getElementById('pathIndicator');
        this.pathIcon = document.getElementById('pathIcon');
        this.pathText = document.getElementById('pathText');
        this.endingBadge = document.getElementById('endingBadge');
        this.endingIcon = document.getElementById('endingIcon');
        this.endingTitle = document.getElementById('endingTitle');
        this.actionScreen = document.getElementById('actionScreen');
        this.actionIcon = document.getElementById('actionIcon');
        this.actionText = document.getElementById('actionText');
        this.loadingProgress = document.getElementById('loadingProgress');
        this.storyContainer = document.getElementById('storyContainer');

        // Check if critical elements exist
        if (!this.storyText || !this.choicesContainer) {
            console.error('Critical game elements not found!');
            return false;
        }
        return true;
    }

    setupEventListeners() {
        this.stopBtn.addEventListener('click', () => this.stopStory());
        this.musicToggle.addEventListener('click', () => this.toggleMusic());
        this.restartBtn.addEventListener('click', () => this.restartStory());

        // Set initial music volume and properties with error checking
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3;
            this.backgroundMusic.loop = true;
        }

        // Set up typing sound properties with error checking
        if (this.typingSound) {
            this.typingSound.volume = 0.4; // Higher volume for typing sound prominence
            this.typingSound.loop = true;
        }

        // Set up end scene sound properties with error checking
        if (this.endSceneSound) {
            this.endSceneSound.volume = 0.7; // Higher volume for dramatic impact
            this.endSceneSound.loop = false; // Play once when game ends
        }

        // Store original background music volume for restoration
        this.originalMusicVolume = 0.3;

        // Add event listeners for music state management with error checking
        if (this.backgroundMusic) {
            this.backgroundMusic.addEventListener('ended', () => {
                // Ensure music loops even if loop attribute fails
                if (this.musicPlaying && this.backgroundMusic) {
                    this.backgroundMusic.currentTime = 0;
                    this.backgroundMusic.play().catch(() => {
                        // Handle play failure silently
                    });
                }
            });

            this.backgroundMusic.addEventListener('pause', () => {
                if (this.musicPlaying && this.backgroundMusic) {
                    // If music was paused but should be playing, restart it
                    setTimeout(() => {
                        if (this.musicPlaying && this.backgroundMusic) {
                            this.backgroundMusic.play().catch(() => {
                                // Handle play failure silently
                            });
                        }
                    }, 100);
                }
            });
        }
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
                    { text: "� Try to communicate first", next: "communicate" }
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

            dockStation: {
                text: `Your ship's docking clamps engage with the ancient station with a satisfying thunk. As you board,
                       emergency lighting flickers to life, revealing corridors lined with the same crystalline growths.

                       The crystals pulse in rhythm with your heartbeat, and you realize they're not just decorative -
                       they're some kind of organic technology, still alive after eons in space.`,
                choices: [
                    { text: "🔬 Study the living crystal technology", next: "crystalTechEnding" }
                ]
            },

            peacefulContact: {
                text: `You transmit universal peace symbols and mathematical sequences. The alien probe responds immediately,
                       projecting a holographic interface that adapts to your ship's systems.

                       Through the interface, an ancient AI consciousness speaks: "Greetings, young species. We have waited
                       long for others to find us. We offer you the gift of knowledge."`,
                choices: [
                    { text: "🎓 Accept the ancient knowledge", next: "knowledgeEnding" }
                ]
            },

            consultAI: {
                text: `Your AI companion processes the data for several minutes before responding:
                       "Captain, this civilization predates known galactic history. Their technology appears to be
                       based on consciousness itself - they've learned to merge mind and machine."

                       "I recommend extreme caution, but also... I sense an opportunity for unprecedented discovery."`,
                choices: [
                    { text: "🧠 Investigate the consciousness technology", next: "consciousnessEnding" }
                ]
            },

            scanCrystals: {
                text: `Your ship's sensors reveal that the crystalline formations are not just decorative - they're alive!
                       The crystals form a vast neural network spanning the entire station, pulsing with bio-electric energy.

                       As you scan deeper, the crystals begin to respond to your presence, their glow intensifying.
                       You realize they're trying to communicate with you.`,
                choices: [
                    { text: "🔬 Study the living crystal technology", next: "crystalTechEnding" }
                ]
            },

            hailStation: {
                text: `You broadcast on all frequencies, trying to make contact with the station. For long minutes, there's
                       only static. Then, suddenly, a response comes - not through your radio, but directly into your mind.

                       "Welcome, young traveler. We have been waiting for someone like you for millennia.
                       Will you accept our gift of knowledge?"`,
                choices: [
                    { text: "🎓 Accept the ancient knowledge", next: "knowledgeEnding" }
                ]
            },

            defensivePosture: {
                text: `Your shields flare to life just as the alien probe begins scanning your ship. The probe seems to
                       interpret your defensive stance as a sign of intelligence rather than hostility.

                       It projects a holographic message: "Caution is wisdom. We respect your prudence, young species.
                       We offer knowledge to those who show both courage and wisdom."`,
                choices: [
                    { text: "🎓 Accept the ancient knowledge", next: "knowledgeEnding" }
                ]
            },

            analyzeTech: {
                text: `Your ship's computers work overtime analyzing the probe's technology. The results are astounding -
                       this technology is based on principles of physics you've never seen before.

                       The probe seems pleased by your scientific curiosity and begins transmitting technical data
                       directly to your computers. You've just received the greatest scientific discovery in human history!`,
                choices: [
                    { text: "🎓 Accept the ancient knowledge", next: "knowledgeEnding" }
                ]
            },

            researchAncients: {
                text: `You dive deep into your ship's databases, cross-referencing the energy signatures with known
                       archaeological data. What you find sends chills down your spine.

                       This matches theoretical models of the "Precursors" - a mythical race that supposedly
                       seeded the galaxy with consciousness itself. If this is real, you've found the origin of all sentient life.`,
                choices: [
                    { text: "🧠 Investigate the consciousness technology", next: "consciousnessEnding" }
                ]
            },

            investigateEnergy: {
                text: `You direct your ship toward the energy source, following the readings deeper into space.
                       The energy signature leads you to what appears to be empty space, but your instruments detect
                       something impossible - a structure that exists partially outside normal dimensions.

                       As you approach, reality seems to bend around you. You're no longer just exploring space -
                       you're exploring the very fabric of consciousness itself.`,
                choices: [
                    { text: "🧠 Investigate the consciousness technology", next: "consciousnessEnding" }
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
            }
        };
    }

    initializeMusic() {
        // Try to start music immediately when the page loads
        // This provides ambient music from the very beginning
        this.tryPlayMusic();

        // Also try to play music when user first interacts with the page
        const startMusicOnInteraction = () => {
            if (!this.musicPlaying) {
                this.tryPlayMusic();
            }
            // Remove the event listeners after first interaction
            document.removeEventListener('click', startMusicOnInteraction);
            document.removeEventListener('keydown', startMusicOnInteraction);
            document.removeEventListener('touchstart', startMusicOnInteraction);
        };

        // Add event listeners for user interaction
        document.addEventListener('click', startMusicOnInteraction);
        document.addEventListener('keydown', startMusicOnInteraction);
        document.addEventListener('touchstart', startMusicOnInteraction);
    }

    startStory() {
        this.gameStarted = true;
        this.currentScene = 'start';
        this.storyProgress = 1;
        this.updateProgress();
        this.displayScene('start');
        this.tryPlayMusic();
    }

    displayScene(sceneKey) {
        const scene = this.storyData[sceneKey];
        if (!scene) {
            console.error('No scene found for key:', sceneKey);
            return;
        }

        this.currentScene = sceneKey;

        // Update story text with typewriter effect
        this.typewriterEffect(scene.text);

        // Clear and populate choices
        setTimeout(() => {
            if (!this.choicesContainer) {
                console.error('choicesContainer not found!');
                return;
            }

            this.choicesContainer.innerHTML = '';

            if (scene.choices.length === 0) {
                // Story ending - capture the final ending
                this.finalEnding = this.getEndingName(sceneKey);
                // Delay showing game over to let final text finish typing
                setTimeout(() => {
                    this.showGameOver();
                }, 3000); // Wait 3 seconds for dramatic effect
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
        // Store the choice with context
        const currentSceneData = this.storyData[this.currentScene];
        const chosenOption = currentSceneData.choices.find(choice => choice.next === nextScene);

        this.choices.push(nextScene);
        this.choiceDetails.push({
            sceneKey: this.currentScene,
            sceneName: this.getSceneName(this.currentScene),
            choiceText: chosenOption ? chosenOption.text : 'Unknown choice',
            choiceDescription: this.getChoiceDescription(nextScene),
            nextScene: nextScene
        });

        this.storyProgress++;
        this.updateProgress();
        this.updateVisualFeedback();

        // Show action screen before proceeding to next scene
        this.showActionScreen(chosenOption ? chosenOption.text : 'Unknown action', nextScene);
    }

    updateProgress() {
        const progressPercent = (this.storyProgress / this.maxProgress) * 100;
        this.progressFill.style.width = `${Math.min(progressPercent, 100)}%`;
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
            try {
                // Ensure music is ready to play with correct volume
                this.backgroundMusic.currentTime = 0;
                this.backgroundMusic.volume = this.originalMusicVolume;

                this.backgroundMusic.play().then(() => {
                    // Music started successfully
                    this.musicPlaying = true;
                    if (this.musicToggle) {
                        this.musicToggle.textContent = '🔊 Music On';
                    }
                }).catch(_e => {
                    // Music autoplay prevented by browser - this is normal
                    // Music will start when user interacts with the page
                    if (this.musicToggle) {
                        this.musicToggle.textContent = '🔇 Music Off';
                    }
                });
            } catch (error) {
                console.log('Music play error:', error);
                if (this.musicToggle) {
                    this.musicToggle.textContent = '🔇 Music Off';
                }
            }
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
            }).catch(_e => {
                // Handle play failure
                this.musicToggle.textContent = '🔇 Music Off';
            });
        }
    }

    startTypingSound() {
        // Start typing sound effect and lower background music
        if (this.typingSound) {
            // Lower background music volume when typing
            if (this.backgroundMusic && this.musicPlaying) {
                this.fadeBackgroundMusic(0.1, 200); // Fade to 10% volume quickly
            }

            this.typingSound.currentTime = 0;
            this.typingSound.play().catch(_e => {
                // Handle play failure silently
            });
        }
    }

    stopTypingSound() {
        // Stop typing sound effect and restore background music volume
        if (this.typingSound) {
            this.typingSound.pause();
            this.typingSound.currentTime = 0;

            // Restore background music volume when typing stops
            if (this.backgroundMusic && this.musicPlaying) {
                this.fadeBackgroundMusic(this.originalMusicVolume, 500); // Fade back to normal volume
            }
        }
    }

    fadeBackgroundMusic(targetVolume, duration = 1000) {
        // Fade background music to target volume over specified duration
        if (!this.backgroundMusic || !this.musicPlaying) return;

        const startVolume = this.backgroundMusic.volume;
        const volumeChange = targetVolume - startVolume;
        const steps = 20; // Number of fade steps
        const stepDuration = duration / steps;
        const stepChange = volumeChange / steps;

        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            const newVolume = startVolume + (stepChange * currentStep);
            this.backgroundMusic.volume = Math.max(0, Math.min(1, newVolume));

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                this.backgroundMusic.volume = targetVolume;
            }
        }, stepDuration);
    }

    playEndSceneSound() {
        // Play end scene sound effect with background music ducking
        if (this.endSceneSound) {
            // Fade background music down for dramatic effect
            this.fadeBackgroundMusic(0.1, 500); // Fade to 10% volume over 0.5 seconds

            this.endSceneSound.currentTime = 0;
            this.endSceneSound.play().then(() => {
                // Set up event listener to restore background music when end sound finishes
                const restoreMusic = () => {
                    this.fadeBackgroundMusic(this.originalMusicVolume, 1000); // Fade back to normal over 1 second
                    this.endSceneSound.removeEventListener('ended', restoreMusic);
                };
                this.endSceneSound.addEventListener('ended', restoreMusic);
            }).catch(_e => {
                // Handle play failure silently - restore music anyway
                setTimeout(() => {
                    this.fadeBackgroundMusic(this.originalMusicVolume, 1000);
                }, 3000); // Restore after 3 seconds if sound fails to play
            });
        }
    }

    stopStory() {
        // Stop any typing sounds when story is stopped
        this.stopTypingSound();
        this.finalEnding = 'Mission Terminated by User';
        this.gameOverText.textContent = 'Story stopped by user. Thanks for playing!';
        this.showGameOver();
    }

    showGameOver() {
        // Stop any typing sounds and play end scene sound
        this.stopTypingSound();
        this.playEndSceneSound();

        document.querySelector('.story-container').classList.add('hidden');
        this.gameOverScreen.classList.remove('hidden');
        this.storyProgress = this.maxProgress;
        this.updateProgress();
        this.updateEndingBadge();
        this.generateChoiceReport();
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
        if (this.choiceDetails.length > 0 || this.finalEnding) {
            const originalText = this.gameOverText.textContent;

            // Create comprehensive and presentable report
            let report = `\n\n═══════════════════════════════════════\n`;
            report += `📊 VOYAGE AEON - MISSION REPORT\n`;
            report += `═══════════════════════════════════════\n\n`;

            // Mission Summary
            report += `🎯 MISSION OUTCOME\n`;
            report += `${this.finalEnding}\n\n`;

            // Story Summary
            report += `📖 STORY SUMMARY\n`;
            report += `${this.generateStorySummary()}\n\n`;

            // Detailed Choice Analysis
            if (this.choiceDetails.length > 0) {
                report += `🛤️ DETAILED CHOICE ANALYSIS\n`;
                report += `─────────────────────────────\n`;

                this.choiceDetails.forEach((detail, index) => {
                    report += `\n${index + 1}. DECISION POINT: ${detail.sceneName}\n`;
                    report += `   🎯 Your Choice: ${detail.choiceText}\n`;
                    report += `   📝 What Happened: ${detail.choiceDescription}\n`;
                    report += `   🔄 Led To: ${this.getSceneName(detail.nextScene)}\n`;
                    if (index < this.choiceDetails.length - 1) {
                        report += `   ⬇️ THEN...\n`;
                    }
                });
            }

            // Mission Statistics
            report += `\n\n📊 MISSION STATISTICS\n`;
            report += `─────────────────────\n`;
            report += `• Total Decisions Made: ${this.choiceDetails.length}\n`;
            report += `• Primary Approach: ${this.getStoryPathType()}\n`;
            report += `• Mission Progress: ${this.storyProgress}/${this.maxProgress} stages completed\n`;
            report += `• Exploration Style: ${this.getExplorationStyle()}\n`;
            report += `• Risk Level: ${this.getRiskLevel()}\n`;

            // Achievement Summary
            report += `\n🏆 ACHIEVEMENTS UNLOCKED\n`;
            report += `─────────────────────────\n`;
            report += this.generateAchievements();

            // Final Assessment
            report += `\n\n🌟 FINAL ASSESSMENT\n`;
            report += `─────────────────────\n`;
            report += this.generateFinalAssessment();

            report += `\n\n═══════════════════════════════════════\n`;
            report += `Thank you for playing Voyage Aeon!\n`;
            report += `═══════════════════════════════════════`;

            this.gameOverText.textContent = originalText + report;
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
        const totalEndings = 24; // Total number of possible endings
        const completionRate = Math.round((this.storyProgress / this.maxProgress) * 100);

        let statsText = `📊 VOYAGE AEON STATISTICS\n`;
        statsText += `═══════════════════════════════\n\n`;
        statsText += `🎯 Current Mission:\n`;
        statsText += `• Ending Achieved: ${this.finalEnding}\n`;
        statsText += `• Completion Rate: ${completionRate}%\n`;
        statsText += `• Decisions Made: ${this.choiceDetails.length}\n`;
        statsText += `• Story Path: ${this.getStoryPathType()}\n`;
        statsText += `• Exploration Style: ${this.getExplorationStyle()}\n`;
        statsText += `• Risk Assessment: ${this.getRiskLevel()}\n\n`;

        statsText += `🌌 Game Information:\n`;
        statsText += `• Total Possible Endings: ${totalEndings}\n`;
        statsText += `• Story Scenes: ${Object.keys(this.storyData).length}\n`;
        statsText += `• Maximum Story Length: ${this.maxProgress} stages\n\n`;

        statsText += `🏆 Achievements Unlocked:\n`;
        const achievements = this.generateAchievements().split('\n• ');
        achievements.forEach(achievement => {
            if (achievement.trim()) {
                statsText += `• ${achievement}\n`;
            }
        });

        alert(statsText);
    }

    showActionScreen(choiceText, nextScene) {
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

    restartStory() {
        // Stop any typing sounds when restarting
        this.stopTypingSound();

        // Reset all game state
        this.currentScene = 'start';
        this.choices = [];
        this.choiceDetails = [];
        this.storyProgress = 0;
        this.finalEnding = '';
        this.gameStarted = false;

        // Reset UI elements
        this.ensureActionScreenHidden();
        this.updateProgress();

        // Reset story text and choices to initial state
        this.storyText.innerHTML = `
            <p>Welcome to Voyage Aeon, where the mysteries of the cosmos await your discovery...</p>
            <p>Click "Begin Mission" to start your space adventure!</p>
        `;
        this.choicesContainer.innerHTML = `
            <button class="choice-btn" onclick="startStory()">🚀 Begin Mission</button>
        `;

        // Reset path indicator
        this.pathIcon.textContent = '🚀';
        this.pathText.textContent = 'Ready for Mission';

        // Remove any path classes from body
        document.body.classList.remove('explorer-path', 'diplomatic-path', 'scientist-path');

        // Ensure music continues playing during restart and restore volume
        if (this.musicPlaying) {
            this.backgroundMusic.volume = this.originalMusicVolume;
            this.tryPlayMusic();
        }
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
