/* ========================================
   NAVIGATION LOADER
   Dynamically loads navigation from config
   ======================================== */

(function() {
    // Determine which config to load based on page
    const isEEShop = window.location.pathname.includes('ee-business-shop');
    const isHub = window.location.pathname.includes('the-hub');
    const isEETeamPlan = window.location.pathname.includes('ee-team-plan');
    const isScouting = window.location.pathname.includes('football-scouting');
    let configFile = 'config/nav-config.json';

    if (isEEShop) {
        configFile = 'config/nav-case-study.json';
    } else if (isHub) {
        configFile = 'config/nav-hub.json';
    } else if (isEETeamPlan) {
        configFile = 'config/nav-ee-team-plan.json';
    } else if (isScouting) {
        configFile = 'config/nav-football-scouting.json';
    }

    // Load navigation config and render
    fetch(configFile)
        .then(response => response.json())
        .then(config => {
            renderNavigation(config);
        })
        .catch(error => {
            console.error('Error loading navigation:', error);
            // Fallback to basic navigation if config fails to load
        });

    function renderNavigation(config) {
        const nav = document.querySelector('nav .nav-container');
        if (!nav) return;

        // Build logo with two-tone color
        const logo = document.createElement('a');
        logo.href = config.logo.href;
        logo.className = 'logo';

        // Split "harrynicholas" into "harry" (black) and "nicholas" (green)
        // On mobile (<=768px), show "hn" instead
        const firstPart = document.createElement('span');
        firstPart.className = 'logo-first';
        firstPart.style.color = '#0a0a0a';

        const secondPart = document.createElement('span');
        secondPart.className = 'logo-second';
        secondPart.style.color = '#10b981';

        // Function to update logo text based on screen size
        function updateLogoText() {
            if (window.innerWidth <= 768) {
                firstPart.textContent = 'h';
                secondPart.textContent = 'n';
            } else {
                firstPart.textContent = 'harry';
                secondPart.textContent = 'nicholas';
            }
        }

        // Initial update
        updateLogoText();

        // Update on resize
        window.addEventListener('resize', updateLogoText);

        logo.appendChild(firstPart);
        logo.appendChild(secondPart);

        // Build navigation links container
        const navLinks = document.createElement('div');
        navLinks.className = 'nav-links';

        // Add navigation links
        config.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'nav-link';
            a.textContent = link.text;
            navLinks.appendChild(a);
        });

        // Build social icons
        const socialIcons = document.createElement('div');
        socialIcons.className = 'social-icons';

        config.social.forEach(social => {
            if (social.type === 'linkedin') {
                const img = document.createElement('img');
                img.src = social.icon;
                img.alt = social.alt;
                img.className = 'icon-24';
                img.style.cursor = 'pointer';
                img.onclick = () => window.open(social.url, '_blank');
                socialIcons.appendChild(img);
            } else if (social.type === 'email') {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('class', 'icon-24');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'currentColor');
                svg.setAttribute('stroke-width', '2');
                svg.style.cursor = 'pointer';
                 svg.onclick = () => window.open(social.url, '_blank');;

                const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path1.setAttribute('d', 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z');

                const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
                path2.setAttribute('points', '22,6 12,13 2,6');

                svg.appendChild(path1);
                svg.appendChild(path2);
                socialIcons.appendChild(svg);
            }
        });

        navLinks.appendChild(socialIcons);

        // Create sliding underline element
        const underline = document.createElement('div');
        underline.className = 'nav-underline';
        navLinks.appendChild(underline);

        // Clear existing navigation and add new
        nav.innerHTML = '';
        nav.appendChild(logo);
        nav.appendChild(navLinks);
    }
})();
