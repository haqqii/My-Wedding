# Wedding Invitation - Hilda & Reza

A beautiful, elegant digital wedding invitation website featuring a Gen Z aesthetic with sage green and dark purple themes.

## Features

- **Dark/Light Mode** - Toggle between themes with persistent user preference
- **Smooth Scroll Navigation** - Floating navigation bar with active section highlighting
- **RSVP & Guest Messages** - Form for guests to confirm attendance and leave wishes
- **Music Player** - Background music with scroll-following control button
- **Countdown Timer** - Real-time countdown to the wedding event
- **Save to Calendar** - Google Calendar integration for both Akad and Resepsi
- **PWA Support** - Installable as a mobile app
- **Offline Support** - Works without internet connection
- **Responsive Design** - Optimized for all screen sizes

## Events

- **Akad Nikah**: February 18, 2026 - Batakan Beach Club Village, Surabaya
- **Resepsi**: February 25, 2026 - Gedung Graha Widya Bhakti, Surabaya

## Tech Stack

- HTML5 / CSS3
- Tailwind CSS
- Vanilla JavaScript
- GSAP (Animations)
- Phosphor Icons
- Service Worker (PWA)

## Project Structure

```
├── index.html          # Main HTML file
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── css/
│   └── styles.css     # Custom styles
├── js/
│   └── main.js        # Main JavaScript
└── Assets/
    └── *.mp3          # Background music
```

## Getting Started

1. **Serve locally** (required for service worker):
   ```bash
   npx serve .
   ```
   Or use any local server (Live Server, http-server, etc.)

2. **Open in browser**:
   ```
   http://localhost:3000
   ```

3. **Customize**:
   - Edit `index.html` to update event details, dates, and locations
   - Replace audio files in `Assets/` folder
   - Update names and photos as needed

## Adding Guest Names

Send invitations with personalized names using URL parameters:
```
https://yoursite.com/?to=Guest%20Name
```

## Admin Panel

Access the admin panel to export RSVP data:
```
https://yoursite.com/?admin=true
```

## Customization

### Colors (in `css/styles.css`)
```css
:root {
    --bg-primary: #FAFAFE;     /* Light mode background */
    --text-primary: #3A4A3E;    /* Primary text */
    --accent-gradient: linear-gradient(135deg, #6B8E6B, #8B9E8B);  /* Sage green */
}
```

### Music
Replace the audio file path in `index.html`:
```html
<source src="Assets/YOUR_SONG.mp3" type="audio/mpeg">
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome for Android)

## License

This project is for personal use. Customize and enjoy!
