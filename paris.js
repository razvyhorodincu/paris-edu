function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    const target = document.getElementById(pageId);
    if (target) {
        target.style.display = 'block';
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


function setActiveNavByUrl() {
    const currentPath = window.location.pathname.split('/').pop();

    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
} //navigation

function setupSearchBox() {
    const searchInput = document.querySelector('.nav-search-input');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();

        document.querySelectorAll('.cards .card').forEach(card => {
            const title =
                card.querySelector('h3')?.textContent.toLowerCase() || '';

            card.style.display =
                query && !title.includes(query) ? 'none' : '';
        });
    });
} //search


function setupImageModal() {
    document.addEventListener('click', (e) => {
        if (
            e.target.tagName === 'IMG' &&
            e.target.closest('.gallery')
        ) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                cursor: zoom-out;
            `;
            const img = document.createElement('img');
            img.src = e.target.src;
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            img.style.borderRadius = '15px';
            modal.appendChild(img);
            modal.addEventListener('click', () => {
                modal.remove();
            });
            document.body.appendChild(modal);
        }
    });
} // zoom


function setupReviews() {
    document.querySelectorAll('.review-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name =
                this.querySelector('.reviewer-name').value.trim();

            const text =
                this.querySelector('.review-text').value.trim();

            const rating =
                this.querySelector('input[type="radio"]:checked')
                    ?.value || 0;

            const stars =
                '★'.repeat(rating) +
                '☆'.repeat(5 - rating);

            const review = document.createElement('div');

            review.className = 'review';

            review.innerHTML = `
                <blockquote>« ${text} »</blockquote>
                <p>— ${name} ${stars}</p>
            `;

            this.parentElement.insertBefore(review, this);

            this.reset();
        });
    });
} // review


let langBtn;
let langMenu;
let langButtons = [];

async function loadLanguage(lang) {
    const response = await fetch(`./languages/${lang}.json`);

    if (!response.ok) {
        throw new Error(`Language file not found: ${lang}`);
    }

    const translations = await response.json();

    document.documentElement.lang = lang;
    localStorage.setItem('siteLang', lang);

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (translations[key]) {
            el.placeholder = translations[key];
        }
    });

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;
        if (!translations[key]) return;

        const tag = element.tagName;

        if (tag === 'INPUT' || tag === 'BUTTON' || tag === 'TEXTAREA' || tag === 'SELECT') {
            element.value = translations[key];
            return;
        }

        // If element has no element children, safe to set textContent
        const hasElementChildren = Array.from(element.childNodes).some(n => n.nodeType === 1);
        if (!hasElementChildren) {
            element.textContent = translations[key];
            return;
        }

        // If it has child elements (e.g. a label wrapping an <input>), replace or add a text node
        let replaced = false;
        for (let node of element.childNodes) {
            if (node.nodeType === 3) { // text node
                node.nodeValue = translations[key];
                replaced = true;
                break;
            }
        }

        if (!replaced) {
            element.appendChild(document.createTextNode(translations[key]));
        }
    });
}

function setupLanguageSwitcher() {
    langBtn = document.querySelector('.lang-btn');
    langMenu = document.querySelector('.lang-menu');
    langButtons = Array.from(document.querySelectorAll('.lang-menu button'));

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            if (langMenu) langMenu.classList.toggle('show');
        });
    }

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const l = btn.dataset.lang;
            if (l) loadLanguage(l);

            if (langMenu) langMenu.classList.remove('show');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-dropdown')) {
            langMenu?.classList.remove('show');
        }
    });

    const savedLang = localStorage.getItem('siteLang') || 'fr-FR';
    loadLanguage(savedLang).catch(() => {
    });
}


const accessibilityBtn =
    document.querySelector('.accessibility-btn');

const accessibilityMenu =
    document.querySelector('.accessibility-menu');

function setupAccessibility() {

    // Toggle menu
    if (accessibilityBtn) {
        accessibilityBtn.addEventListener('click', () => {
            accessibilityMenu.classList.toggle('show');
        });
    }

    // Close menu outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.accessibility-dropdown')) {
            accessibilityMenu?.classList.remove('show');
        }
    });

    // High contrast mode
    document
        .getElementById('toggle-high-contrast')
        ?.addEventListener('click', () => {

            const isContrast =
                document.body.style.filter === 'contrast(1.5)';

            document.body.style.filter =
                isContrast ? 'contrast(1)' : 'contrast(1.5)';

            localStorage.setItem(
                'accessibility_contrast',
                document.body.style.filter
            );

            accessibilityMenu.classList.remove('show');
        });

    
    document
        .getElementById('toggle-large-text')
        ?.addEventListener('click', () => {

            const isLarge =
                document.body.style.fontSize === '22px';

            document.body.style.fontSize =
                isLarge ? '16px' : '22px';

            localStorage.setItem(
                'accessibility_large_text',
                isLarge ? 'false' : 'true'
            );

            accessibilityMenu.classList.remove('show');
        });

    document
        .getElementById('toggle-dyslexia-font')
        ?.addEventListener('click', () => {

            const existingFont =
                document.getElementById('dyslexia-font');

            if (existingFont) {
                existingFont.remove();

                document.body.style.fontFamily = '';

                localStorage.setItem(
                    'accessibility_dyslexia',
                    'false'
                );

            } else {
                const link = document.createElement('link');

                link.id = 'dyslexia-font';
                link.rel = 'stylesheet';

                link.href =
                    'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap';

                document.head.appendChild(link);

                document.body.style.fontFamily =
                    '"Atkinson Hyperlegible", sans-serif';

                localStorage.setItem(
                    'accessibility_dyslexia',
                    'true'
                );
            }

            accessibilityMenu.classList.remove('show');
        });

    // Reset accessibility settings
    document
        .getElementById('reset-accessibility')
        ?.addEventListener('click', () => {

            document.body.style.filter = 'contrast(1)';
            document.body.style.fontSize = '16px';
            document.body.style.fontFamily = '';

            document
                .getElementById('dyslexia-font')
                ?.remove();

            localStorage.removeItem('accessibility_contrast');
            localStorage.removeItem('accessibility_large_text');
            localStorage.removeItem('accessibility_dyslexia');

            accessibilityMenu.classList.remove('show');
        });
}

function loadAccessibilitySettings() {

    // Contrast
    const contrast =
        localStorage.getItem('accessibility_contrast');

    if (contrast) {
        document.body.style.filter = contrast;
    }

    // Large text
    if (
        localStorage.getItem('accessibility_large_text') === 'true'
    ) {
        document.body.style.fontSize = '18px';
    }

    // Dyslexia font
    if (
        localStorage.getItem('accessibility_dyslexia') === 'true'
    ) {
        const link = document.createElement('link');

        link.id = 'dyslexia-font';
        link.rel = 'stylesheet';

        link.href =
            'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap';

        document.head.appendChild(link);

        document.body.style.fontFamily =
            '"Atkinson Hyperlegible", sans-serif';
    }
}


document.addEventListener('DOMContentLoaded', () => {

    // Navigation
    setActiveNavByUrl();

    // Features
    setupImageModal();
    setupReviews();
    setupSearchBox();

    // Language system
    setupLanguageSwitcher();

    // Accessibility
    setupAccessibility();
    loadAccessibilitySettings();
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("fieldset").forEach(fs => {
    const labels = Array.from(fs.querySelectorAll("label"));

    // shuffle
    for (let i = labels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [labels[i], labels[j]] = [labels[j], labels[i]];
    }
    labels.forEach(label => fs.appendChild(label));
  });
});
