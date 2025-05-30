# 🚀 Voyage Aeon - Interactive Space Adventure

An immersive interactive story game set in the depths of space, where your choices shape the narrative and determine your cosmic destiny.

## 🌟 Features

- **Interactive Storytelling**: Make choices that affect the story's direction
- **Space/Sci-Fi Theme**: Explore alien civilizations, ancient technologies, and cosmic mysteries
- **Stop Button**: End the story at any point with the "Stop Mission" button
- **Background Music**: Space-themed ambient music (when audio files are added)
- **Multiple Endings**: Different story paths lead to unique conclusions
- **Responsive Design**: Works on desktop and mobile devices
- **Progress Tracking**: Visual progress bar shows your journey through the story

## 🎮 How to Play

1. Open `index.html` in a web browser
2. Click "Begin Mission" to start your space adventure
3. Read the story text as it appears with a typewriter effect
4. Choose from the available options to progress the story
5. Use the "Stop Mission" button to end the story at any time
6. Toggle music on/off with the audio button
7. Restart the adventure with the restart button

## 🎵 Adding Background Music

The game is designed to play space-themed ambient music. To add music:

1. Download royalty-free space/sci-fi ambient music from sources like:
   - [Pixabay](https://pixabay.com/music/search/sci-fi/)
   - [Freesound.org](https://freesound.org)
   - [YouTube Audio Library](https://studio.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw/music)

2. Convert to both MP3 and OGG formats for browser compatibility

3. Rename files to `space-ambience.mp3` and `space-ambience.ogg`

4. Place both files in the `audio/` directory

5. Refresh the page and enjoy atmospheric space audio!

## 🛠️ Technical Details

### Files Structure
```
├── index.html          # Main HTML file
├── script.js           # Game logic and story content
├── style.css           # Styling and space theme
├── audio/              # Audio files directory
│   └── README.md       # Instructions for adding music
└── README.md           # This file
```

### Story Paths
The game features multiple branching storylines:
- **Direct Approach**: Investigate mysterious signals head-on
- **Asteroid Field**: Navigate through dangerous space debris
- **Long Range Scan**: Take a cautious, scientific approach

Each path leads to different encounters and endings:
- Crystal Technology Ending
- Ancient Knowledge Ending
- Consciousness Technology Ending

### Key Features Implementation
- **Stop Button**: Implemented via `stopStory()` method
- **Background Music**: HTML5 audio with loop functionality
- **Choice System**: Dynamic button generation based on story data
- **Progress Bar**: Visual feedback showing story completion
- **Typewriter Effect**: Animated text display for immersion

## 🚀 Running the Game

### Option 1: Simple File Opening
- Open `index.html` directly in a web browser

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js serve
npx serve .

# Using any other local server
```

Then visit `http://localhost:8000` (or appropriate port)

## 🎨 Customization

### Changing the Story
Edit the `storyData` object in `script.js` to modify:
- Story text and scenarios
- Choice options and paths
- Ending conditions

### Styling
Modify `style.css` to change:
- Color scheme and theme
- Layout and typography
- Button styles and animations

### Audio
Replace audio files in the `audio/` directory to change background music

## 🌌 Story Theme

Voyage Aeon takes you on a journey through space where you encounter:
- Ancient alien civilizations
- Mysterious space stations
- Advanced AI consciousness
- Living crystal technology
- Cosmic mysteries and discoveries

Your choices determine whether you become a galactic diplomat, a consciousness explorer, or a bridge between species.

## 📱 Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🔧 Development

Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and ease of modification.

## 📄 License

This project is open source. Audio files should be sourced according to their respective licenses.
