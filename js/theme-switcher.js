/**
 * THEME SWITCHER (Developer Tool)
 * Allows instant toggling of Color Themes and Font Pairings.
 */

(function() {
    const root = document.documentElement;
    const container = document.getElementById('theme-switcher-root');

    if (!container) return;

    // Configuration
    const themes = [
        { id: 'default', name: 'Default (Onyx)' },
        { id: 'gold-luxury', name: 'Gold Luxury' },
        { id: 'midnight-blue', name: 'Midnight Blue' },
        { id: 'pure-light', name: 'Pure Light' },
        { id: 'forest-calm', name: 'Forest Calm' }
    ];

    const fonts = [
        { id: 'default', name: 'Default (Oswald/Manrope)' },
        { id: 'serif-elegant', name: 'Elegant (Playfair/Inter)' },
        { id: 'modern-tech', name: 'Tech (Syncopate/Manrope)' }
    ];

    // Create UI
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-switcher';
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-switcher__toggle';
    toggleBtn.textContent = '🎨 Theme';
    toggleBtn.onclick = () => wrapper.classList.toggle('active');

    // Theme Selector
    const themeTitle = document.createElement('h4');
    themeTitle.textContent = 'Color Theme';
    
    const themeSelect = document.createElement('select');
    themes.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name;
        themeSelect.appendChild(opt);
    });

    themeSelect.onchange = (e) => {
        const val = e.target.value;
        if (val === 'default') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', val);
        }
    };

    // Font Selector
    const fontTitle = document.createElement('h4');
    fontTitle.textContent = 'Typography';
    
    const fontSelect = document.createElement('select');
    fonts.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = f.name;
        fontSelect.appendChild(opt);
    });

    fontSelect.onchange = (e) => {
        const val = e.target.value;
        if (val === 'default') {
            root.removeAttribute('data-font');
        } else {
            root.setAttribute('data-font', val);
        }
    };

    // Assemble
    wrapper.appendChild(toggleBtn);
    wrapper.appendChild(themeTitle);
    wrapper.appendChild(themeSelect);
    wrapper.appendChild(fontTitle);
    wrapper.appendChild(fontSelect);
    
    container.appendChild(wrapper);

})();
