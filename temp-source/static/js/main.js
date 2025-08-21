// Theme Toggle Functionality
class ThemeToggle {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.updateThemeIcon();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }
    
    updateThemeIcon() {
        if (this.currentTheme === 'dark') {
            this.themeIcon.className = 'fas fa-sun';
        } else {
            this.themeIcon.className = 'fas fa-moon';
        }
    }
}

// Search Functionality
class SearchModal {
    constructor() {
        this.searchBtn = document.getElementById('search-btn');
        this.searchModal = document.getElementById('search-modal');
        this.searchInput = document.getElementById('search-input');
        this.searchClose = document.getElementById('search-close');
        this.searchResults = document.getElementById('search-results');
        this.searchData = [];
        
        this.init();
    }
    
    init() {
        this.loadSearchData();
        this.bindEvents();
    }
    
    async loadSearchData() {
        try {
            const response = await fetch('/index.json');
            this.searchData = await response.json();
        } catch (error) {
            console.error('Error loading search data:', error);
        }
    }
    
    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.openModal());
        this.searchClose.addEventListener('click', () => this.closeModal());
        this.searchModal.addEventListener('click', (e) => {
            if (e.target === this.searchModal) this.closeModal();
        });
        
        this.searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.searchModal.classList.contains('search-modal--active')) {
                this.closeModal();
            }
        });
    }
    
    openModal() {
        this.searchModal.classList.add('search-modal--active');
        document.body.classList.add('modal-open');
        setTimeout(() => this.searchInput.focus(), 100);
    }
    
    closeModal() {
        this.searchModal.classList.remove('search-modal--active');
        document.body.classList.remove('modal-open');
        this.searchInput.value = '';
        this.searchResults.innerHTML = '<p class="search-modal__placeholder">Mulai mengetik untuk mencari artikel...</p>';
    }
    
    performSearch(query) {
        if (!query.trim()) {
            this.searchResults.innerHTML = '<p class="search-modal__placeholder">Mulai mengetik untuk mencari artikel...</p>';
            return;
        }
        
        const results = this.searchData.filter(post => {
            const searchText = `${post.title} ${post.content} ${post.summary}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });
        
        this.displayResults(results, query);
    }
    
    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<p class="search-modal__no-results">Tidak ada hasil yang ditemukan.</p>';
            return;
        }
        
        const resultsHTML = results.map(post => {
            const highlightedTitle = this.highlightText(post.title, query);
            const highlightedSummary = this.highlightText(post.summary || '', query);
            
            return `
                <div class="search-result">
                    <h3 class="search-result__title">
                        <a href="${post.permalink}">${highlightedTitle}</a>
                    </h3>
                    <p class="search-result__summary">${highlightedSummary}</p>
                    <div class="search-result__meta">
                        <time>${new Date(post.date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</time>
                        ${post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        this.searchResults.innerHTML = resultsHTML;
    }
    
    highlightText(text, query) {
        if (!text || !query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
}

// Mobile Navigation
class MobileNav {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        
        this.init();
    }
    
    init() {
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('nav__menu--active');
        this.navToggle.classList.toggle('nav__toggle--active');
    }
    
    closeMenu() {
        this.navMenu.classList.remove('nav__menu--active');
        this.navToggle.classList.remove('nav__toggle--active');
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Reading Progress Bar
class ReadingProgress {
    constructor() {
        this.progressBar = this.createProgressBar();
        this.init();
    }
    
    createProgressBar() {
        const bar = document.createElement('div');
        bar.className = 'reading-progress';
        document.body.appendChild(bar);
        return bar;
    }
    
    init() {
        if (document.querySelector('.post__content')) {
            window.addEventListener('scroll', () => this.updateProgress());
        }
    }
    
    updateProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        this.progressBar.style.width = scrolled + '%';
    }
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll listener for header
    window.addEventListener('scroll', handleHeaderScroll);
    new ThemeToggle();
    new SearchModal();
    new MobileNav();
    new ReadingProgress();
    initSmoothScrolling();
    
    // Add loading animation removal
    document.body.classList.add('loaded');
});
