/* ═══════════════════════════════════════════════════════════════════════════
   IBU INFRASTRUCTURE & CYBERSECURITY SPECIALIST - INTERVIEW PREPARATION
   Main JavaScript - Interactive Functionality
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE KEYS
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
    PROGRESS: 'ibu_interview_progress',
    BOOKMARKS: 'ibu_interview_bookmarks',
    CHECKLIST: 'ibu_interview_checklist',
    EXPANDED_QUESTIONS: 'ibu_interview_expanded'
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE DATA - All pages with their metadata
// ─────────────────────────────────────────────────────────────────────────────
const PAGES = [
    { id: 'index', title: 'Dashboard', icon: '🏠', file: 'index.html', section: 'overview' },
    { id: 'cybersecurity-fundamentals', title: 'Cybersecurity Fundamentals', icon: '🛡️', file: 'pages/cybersecurity-fundamentals.html', section: 'security' },
    { id: 'incident-response', title: 'Incident Response', icon: '🚨', file: 'pages/incident-response.html', section: 'security' },
    { id: 'endpoint-protection', title: 'Endpoint Protection', icon: '💻', file: 'pages/endpoint-protection.html', section: 'infrastructure' },
    { id: 'microsoft-365', title: 'Microsoft 365 Admin', icon: '☁️', file: 'pages/microsoft-365.html', section: 'infrastructure' },
    { id: 'network-infrastructure', title: 'Network Infrastructure', icon: '🌐', file: 'pages/network-infrastructure.html', section: 'infrastructure' },
    { id: 'backup-dr', title: 'Backup & Disaster Recovery', icon: '💾', file: 'pages/backup-dr.html', section: 'infrastructure' },
    { id: 'telephony', title: 'Telephony & Communications', icon: '📞', file: 'pages/telephony.html', section: 'infrastructure' },
    { id: 'vulnerability-management', title: 'Vulnerability Management', icon: '🔍', file: 'pages/vulnerability-management.html', section: 'security' },
    { id: 'identity-access', title: 'Identity & Access Management', icon: '🔐', file: 'pages/identity-access.html', section: 'security' },
    { id: 'dlp-compliance', title: 'DLP & Compliance', icon: '📋', file: 'pages/dlp-compliance.html', section: 'security' },
    { id: 'security-awareness', title: 'Security Awareness', icon: '🎓', file: 'pages/security-awareness.html', section: 'security' },
    { id: 'behavioral-interview', title: 'Behavioral Interview', icon: '🗣️', file: 'pages/behavioral-interview.html', section: 'interview' },
    { id: 'scenario-exercises', title: 'Scenario Exercises', icon: '📝', file: 'pages/scenario-exercises.html', section: 'interview' },
    { id: 'thirty-sixty-ninety', title: '30-60-90 Day Plan', icon: '📅', file: 'pages/thirty-sixty-ninety.html', section: 'interview' }
];

const SECTIONS = {
    overview: 'Overview',
    security: 'Security & Compliance',
    infrastructure: 'Infrastructure',
    interview: 'Interview Prep'
};

// ─────────────────────────────────────────────────────────────────────────────
// STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
class AppState {
    constructor() {
        this.progress = this.loadProgress();
        this.bookmarks = this.loadBookmarks();
        this.checklist = this.loadChecklist();
        this.expandedQuestions = this.loadExpandedQuestions();
    }

    // Progress
    loadProgress() {
        const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        return saved ? JSON.parse(saved) : {};
    }

    saveProgress() {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(this.progress));
    }

    setPageProgress(pageId, percentage) {
        this.progress[pageId] = percentage;
        this.saveProgress();
        this.updateProgressUI();
    }

    getPageProgress(pageId) {
        return this.progress[pageId] || 0;
    }

    getTotalProgress() {
        const pages = PAGES.filter(p => p.id !== 'index');
        if (pages.length === 0) return 0;
        const total = pages.reduce((sum, page) => sum + (this.progress[page.id] || 0), 0);
        return Math.round(total / pages.length);
    }

    // Bookmarks
    loadBookmarks() {
        const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
        return saved ? JSON.parse(saved) : [];
    }

    saveBookmarks() {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(this.bookmarks));
    }

    addBookmark(pageId, questionId, questionText) {
        const bookmark = { pageId, questionId, questionText, timestamp: Date.now() };
        if (!this.bookmarks.find(b => b.pageId === pageId && b.questionId === questionId)) {
            this.bookmarks.push(bookmark);
            this.saveBookmarks();
        }
    }

    removeBookmark(pageId, questionId) {
        this.bookmarks = this.bookmarks.filter(b => !(b.pageId === pageId && b.questionId === questionId));
        this.saveBookmarks();
    }

    isBookmarked(pageId, questionId) {
        return this.bookmarks.some(b => b.pageId === pageId && b.questionId === questionId);
    }

    // Checklist
    loadChecklist() {
        const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
        return saved ? JSON.parse(saved) : {};
    }

    saveChecklist() {
        localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(this.checklist));
    }

    toggleChecklistItem(itemId) {
        this.checklist[itemId] = !this.checklist[itemId];
        this.saveChecklist();
    }

    isChecked(itemId) {
        return this.checklist[itemId] || false;
    }

    // Expanded Questions
    loadExpandedQuestions() {
        const saved = localStorage.getItem(STORAGE_KEYS.EXPANDED_QUESTIONS);
        return saved ? JSON.parse(saved) : {};
    }

    saveExpandedQuestions() {
        localStorage.setItem(STORAGE_KEYS.EXPANDED_QUESTIONS, JSON.stringify(this.expandedQuestions));
    }

    toggleQuestionExpanded(questionId) {
        this.expandedQuestions[questionId] = !this.expandedQuestions[questionId];
        this.saveExpandedQuestions();
    }

    isQuestionExpanded(questionId) {
        return this.expandedQuestions[questionId] || false;
    }

    // UI Updates
    updateProgressUI() {
        const totalProgress = this.getTotalProgress();
        const progressFill = document.querySelector('.progress-bar-fill');
        const progressText = document.querySelector('.progress-label span:last-child');
        
        if (progressFill) {
            progressFill.style.width = `${totalProgress}%`;
        }
        if (progressText) {
            progressText.textContent = `${totalProgress}%`;
        }

        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            const pageId = item.dataset.page;
            if (pageId) {
                const progress = this.getPageProgress(pageId);
                const statusEl = item.querySelector('.nav-status');
                if (statusEl) {
                    if (progress === 100) {
                        statusEl.textContent = '✓';
                        statusEl.className = 'nav-status complete';
                    } else if (progress > 0) {
                        statusEl.textContent = `${progress}%`;
                        statusEl.className = 'nav-status in-progress';
                    } else {
                        statusEl.textContent = '';
                        statusEl.className = 'nav-status';
                    }
                }
            }
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH FUNCTIONALITY
// ─────────────────────────────────────────────────────────────────────────────
class SearchEngine {
    constructor() {
        this.searchIndex = [];
        this.modal = null;
        this.input = null;
        this.results = null;
    }

    init() {
        this.createModal();
        this.buildIndex();
        this.attachEvents();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.id = 'searchModal';
        modal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-modal-header">
                    <input type="text" class="search-modal-input" id="searchInput" placeholder="Search questions, topics, commands..." autocomplete="off">
                </div>
                <div class="search-results" id="searchResults">
                    <p style="color: var(--text-muted); text-align: center; padding: 2rem;">Type to search...</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        this.modal = modal;
        this.input = document.getElementById('searchInput');
        this.results = document.getElementById('searchResults');
    }

    buildIndex() {
        // Build search index from all question cards on current page
        document.querySelectorAll('.question-card').forEach((card, index) => {
            const questionText = card.querySelector('.question-title span:last-child')?.textContent || '';
            const contentText = card.querySelector('.question-content')?.textContent || '';
            const pageTitle = document.querySelector('h1')?.textContent || '';
            
            this.searchIndex.push({
                id: card.id || `q${index}`,
                question: questionText,
                content: contentText.substring(0, 500),
                page: pageTitle,
                element: card
            });
        });
    }

    search(query) {
        if (!query || query.length < 2) {
            return [];
        }

        const queryLower = query.toLowerCase();
        const results = this.searchIndex.filter(item => {
            return item.question.toLowerCase().includes(queryLower) ||
                   item.content.toLowerCase().includes(queryLower);
        });

        return results.slice(0, 10);
    }

    displayResults(results) {
        if (results.length === 0) {
            this.results.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No results found</p>';
            return;
        }

        this.results.innerHTML = results.map(result => `
            <div class="search-result-item" data-id="${result.id}">
                <div class="search-result-category">${result.page}</div>
                <div class="search-result-title">${this.highlightMatch(result.question, this.input.value)}</div>
                <div class="search-result-excerpt">${this.getExcerpt(result.content, this.input.value)}</div>
            </div>
        `).join('');

        // Attach click handlers
        this.results.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                this.navigateToResult(id);
            });
        });
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: var(--cyan-glow); color: var(--cyan);">$1</mark>');
    }

    getExcerpt(content, query) {
        const queryLower = query.toLowerCase();
        const index = content.toLowerCase().indexOf(queryLower);
        if (index === -1) return content.substring(0, 100) + '...';
        
        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + query.length + 50);
        let excerpt = content.substring(start, end);
        
        if (start > 0) excerpt = '...' + excerpt;
        if (end < content.length) excerpt = excerpt + '...';
        
        return this.highlightMatch(excerpt, query);
    }

    navigateToResult(id) {
        this.close();
        const element = document.getElementById(id) || document.querySelector(`[data-id="${id}"]`);
        if (element) {
            // Expand the question
            const header = element.querySelector('.question-header');
            const content = element.querySelector('.question-content');
            if (header && content) {
                header.classList.add('expanded');
                content.classList.add('show');
            }
            
            // Scroll to element
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = 'borderGlow 1s ease-in-out 3';
        }
    }

    open() {
        this.modal.classList.add('show');
        this.input.focus();
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('show');
        this.input.value = '';
        this.results.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Type to search...</p>';
        document.body.style.overflow = '';
    }

    attachEvents() {
        // Open search with keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.open();
            }
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.close();
            }
        });

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Search on input
        this.input.addEventListener('input', (e) => {
            const results = this.search(e.target.value);
            this.displayResults(results);
        });

        // Sidebar search box
        const sidebarSearch = document.querySelector('.search-box input');
        if (sidebarSearch) {
            sidebarSearch.addEventListener('focus', () => {
                this.open();
            });
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKMARKS PANEL
// ─────────────────────────────────────────────────────────────────────────────
class BookmarksPanel {
    constructor(appState) {
        this.state = appState;
        this.panel = null;
    }

    init() {
        this.createPanel();
        this.attachEvents();
    }

    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'bookmarks-panel';
        panel.id = 'bookmarksPanel';
        panel.innerHTML = `
            <div class="bookmarks-header">
                <span class="bookmarks-title">📌 Bookmarked Questions</span>
                <button class="bookmarks-close" id="closeBookmarks">×</button>
            </div>
            <div class="bookmarks-list" id="bookmarksList"></div>
        `;
        document.body.appendChild(panel);
        this.panel = panel;
        this.updateList();
    }

    updateList() {
        const list = document.getElementById('bookmarksList');
        if (!list) return;

        const bookmarks = this.state.bookmarks;
        
        if (bookmarks.length === 0) {
            list.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No bookmarks yet.<br>Click the bookmark icon on any question to save it.</p>';
            return;
        }

        list.innerHTML = bookmarks.map(b => {
            const page = PAGES.find(p => p.id === b.pageId);
            return `
                <div class="bookmark-item" data-page="${b.pageId}" data-question="${b.questionId}">
                    <div class="bookmark-page">${page?.icon || '📄'} ${page?.title || b.pageId}</div>
                    <div class="bookmark-question">${b.questionText.substring(0, 80)}${b.questionText.length > 80 ? '...' : ''}</div>
                </div>
            `;
        }).join('');

        // Attach click handlers
        list.querySelectorAll('.bookmark-item').forEach(item => {
            item.addEventListener('click', () => {
                const pageId = item.dataset.page;
                const questionId = item.dataset.question;
                this.navigateToBookmark(pageId, questionId);
            });
        });
    }

    navigateToBookmark(pageId, questionId) {
        const currentPage = this.getCurrentPageId();
        if (currentPage === pageId) {
            // Same page - scroll to question
            const element = document.getElementById(questionId);
            if (element) {
                const header = element.querySelector('.question-header');
                const content = element.querySelector('.question-content');
                if (header && content) {
                    header.classList.add('expanded');
                    content.classList.add('show');
                }
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            this.close();
        } else {
            // Different page - navigate
            const page = PAGES.find(p => p.id === pageId);
            if (page) {
                const baseUrl = window.location.href.includes('/pages/') ? '../' : '';
                window.location.href = `${baseUrl}${page.file}#${questionId}`;
            }
        }
    }

    getCurrentPageId() {
        const path = window.location.pathname;
        const page = PAGES.find(p => path.includes(p.file) || (p.id === 'index' && (path.endsWith('/') || path.endsWith('index.html'))));
        return page?.id || 'index';
    }

    open() {
        this.panel.classList.add('show');
        this.updateList();
    }

    close() {
        this.panel.classList.remove('show');
    }

    toggle() {
        if (this.panel.classList.contains('show')) {
            this.close();
        } else {
            this.open();
        }
    }

    attachEvents() {
        document.getElementById('closeBookmarks')?.addEventListener('click', () => this.close());
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.panel.classList.contains('show') &&
                !this.panel.contains(e.target) &&
                !e.target.closest('#bookmarksBtn')) {
                this.close();
            }
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION CARDS
// ─────────────────────────────────────────────────────────────────────────────
class QuestionCards {
    constructor(appState) {
        this.state = appState;
    }

    init() {
        this.attachEvents();
        this.restoreState();
    }

    attachEvents() {
        document.querySelectorAll('.question-card').forEach(card => {
            const header = card.querySelector('.question-header');
            const content = card.querySelector('.question-content');
            const toggle = card.querySelector('.question-toggle');
            const bookmarkBtn = card.querySelector('.bookmark-btn');
            const questionId = card.id;
            const questionText = card.querySelector('.question-title span:last-child')?.textContent || '';

            // Toggle expand/collapse
            if (header && content) {
                header.addEventListener('click', (e) => {
                    if (e.target.closest('.question-actions')) return;
                    
                    header.classList.toggle('expanded');
                    content.classList.toggle('show');
                    
                    if (questionId) {
                        this.state.toggleQuestionExpanded(questionId);
                    }
                });
            }

            // Bookmark button
            if (bookmarkBtn && questionId) {
                const pageId = this.getCurrentPageId();
                
                // Set initial state
                if (this.state.isBookmarked(pageId, questionId)) {
                    bookmarkBtn.classList.add('bookmarked');
                }

                bookmarkBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    if (this.state.isBookmarked(pageId, questionId)) {
                        this.state.removeBookmark(pageId, questionId);
                        bookmarkBtn.classList.remove('bookmarked');
                    } else {
                        this.state.addBookmark(pageId, questionId, questionText);
                        bookmarkBtn.classList.add('bookmarked');
                    }
                });
            }
        });
    }

    restoreState() {
        document.querySelectorAll('.question-card').forEach(card => {
            const questionId = card.id;
            if (questionId && this.state.isQuestionExpanded(questionId)) {
                const header = card.querySelector('.question-header');
                const content = card.querySelector('.question-content');
                if (header && content) {
                    header.classList.add('expanded');
                    content.classList.add('show');
                }
            }
        });

        // Handle URL hash
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const element = document.getElementById(targetId);
            if (element) {
                const header = element.querySelector('.question-header');
                const content = element.querySelector('.question-content');
                if (header && content) {
                    header.classList.add('expanded');
                    content.classList.add('show');
                }
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }

    getCurrentPageId() {
        const path = window.location.pathname;
        const page = PAGES.find(p => path.includes(p.file) || (p.id === 'index' && (path.endsWith('/') || path.endsWith('index.html'))));
        return page?.id || 'index';
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKLIST
// ─────────────────────────────────────────────────────────────────────────────
class Checklist {
    constructor(appState) {
        this.state = appState;
    }

    init() {
        this.attachEvents();
        this.restoreState();
    }

    attachEvents() {
        document.querySelectorAll('.checklist-item').forEach(item => {
            const itemId = item.dataset.id;
            if (itemId) {
                item.addEventListener('click', () => {
                    this.state.toggleChecklistItem(itemId);
                    item.classList.toggle('checked');
                    this.updateChecklistProgress();
                });
            }
        });
    }

    restoreState() {
        document.querySelectorAll('.checklist-item').forEach(item => {
            const itemId = item.dataset.id;
            if (itemId && this.state.isChecked(itemId)) {
                item.classList.add('checked');
            }
        });
        this.updateChecklistProgress();
    }

    updateChecklistProgress() {
        const items = document.querySelectorAll('.checklist-item');
        const checked = document.querySelectorAll('.checklist-item.checked');
        const progressEl = document.querySelector('.checklist-progress');
        
        if (progressEl && items.length > 0) {
            const percentage = Math.round((checked.length / items.length) * 100);
            progressEl.textContent = `${checked.length}/${items.length} (${percentage}%)`;
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// CODE BLOCKS
// ─────────────────────────────────────────────────────────────────────────────
class CodeBlocks {
    init() {
        document.querySelectorAll('.code-block-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                const codeBlock = btn.closest('.code-block');
                const code = codeBlock.querySelector('code')?.textContent || '';
                
                navigator.clipboard.writeText(code).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    btn.style.color = 'var(--green)';
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.color = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            });
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────
class Navigation {
    constructor(appState) {
        this.state = appState;
    }

    init() {
        this.highlightCurrentPage();
        this.attachEvents();
    }

    highlightCurrentPage() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-item').forEach(item => {
            const pageId = item.dataset.page;
            const page = PAGES.find(p => p.id === pageId);
            
            if (page) {
                const isActive = currentPath.includes(page.file) || 
                    (page.id === 'index' && (currentPath.endsWith('/') || currentPath.endsWith('index.html')));
                
                if (isActive) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });
    }

    attachEvents() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.overlay');

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay?.classList.toggle('show');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar?.classList.remove('open');
                overlay.classList.remove('show');
            });
        }

        // Nav item clicks
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const pageId = item.dataset.page;
                const page = PAGES.find(p => p.id === pageId);
                if (page) {
                    const baseUrl = window.location.href.includes('/pages/') ? '../' : '';
                    window.location.href = `${baseUrl}${page.file}`;
                }
            });
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────────────────────
class Tabs {
    init() {
        document.querySelectorAll('.tabs').forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.tab');
            const contents = tabContainer.parentElement.querySelectorAll('.tab-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetId = tab.dataset.tab;

                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    // Update visible content
                    contents.forEach(content => {
                        if (content.id === targetId) {
                            content.classList.add('active');
                        } else {
                            content.classList.remove('active');
                        }
                    });
                });
            });
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS TRACKING
// ─────────────────────────────────────────────────────────────────────────────
class ProgressTracker {
    constructor(appState) {
        this.state = appState;
    }

    init() {
        this.calculatePageProgress();
        this.attachScrollListener();
    }

    calculatePageProgress() {
        const pageId = this.getCurrentPageId();
        const questions = document.querySelectorAll('.question-card');
        
        if (questions.length === 0) return;

        // Calculate progress based on expanded questions
        const expanded = document.querySelectorAll('.question-header.expanded');
        const progress = Math.round((expanded.length / questions.length) * 100);
        
        this.state.setPageProgress(pageId, progress);
    }

    attachScrollListener() {
        // Update progress as user reads
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateReadProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateReadProgress() {
        const pageId = this.getCurrentPageId();
        const contentBody = document.querySelector('.content-body');
        if (!contentBody) return;

        const scrollTop = window.scrollY;
        const docHeight = contentBody.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 100;

        // Combine with question expansion progress
        const questions = document.querySelectorAll('.question-card');
        const expanded = document.querySelectorAll('.question-header.expanded');
        const expandProgress = questions.length > 0 ? (expanded.length / questions.length) * 100 : 100;
        
        // Weight: 30% scroll, 70% expanded questions
        const totalProgress = Math.round(scrollPercent * 0.3 + expandProgress * 0.7);
        
        this.state.setPageProgress(pageId, Math.min(totalProgress, 100));
    }

    getCurrentPageId() {
        const path = window.location.pathname;
        const page = PAGES.find(p => path.includes(p.file) || (p.id === 'index' && (path.endsWith('/') || path.endsWith('index.html'))));
        return page?.id || 'index';
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Initialize state
    const appState = new AppState();
    
    // Initialize components
    const search = new SearchEngine();
    const bookmarks = new BookmarksPanel(appState);
    const questionCards = new QuestionCards(appState);
    const checklist = new Checklist(appState);
    const codeBlocks = new CodeBlocks();
    const navigation = new Navigation(appState);
    const tabs = new Tabs();
    const progressTracker = new ProgressTracker(appState);

    search.init();
    bookmarks.init();
    questionCards.init();
    checklist.init();
    codeBlocks.init();
    navigation.init();
    tabs.init();
    progressTracker.init();

    // Update progress UI
    appState.updateProgressUI();

    // Global functions for buttons
    window.openSearch = () => search.open();
    window.toggleBookmarks = () => bookmarks.toggle();

    // Expose for header buttons
    const searchBtn = document.getElementById('searchBtn');
    const bookmarksBtn = document.getElementById('bookmarksBtn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => search.open());
    }
    if (bookmarksBtn) {
        bookmarksBtn.addEventListener('click', () => bookmarks.toggle());
    }

    console.log('IBU Interview Preparation loaded successfully!');
});

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.color = 'var(--green)';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.color = '';
        }, 2000);
    });
}

function printPage() {
    // Expand all questions before printing
    document.querySelectorAll('.question-content').forEach(content => {
        content.classList.add('show');
    });
    document.querySelectorAll('.question-header').forEach(header => {
        header.classList.add('expanded');
    });
    window.print();
}

function toggleAllQuestions(expand) {
    document.querySelectorAll('.question-card').forEach(card => {
        const header = card.querySelector('.question-header');
        const content = card.querySelector('.question-content');
        if (header && content) {
            if (expand) {
                header.classList.add('expanded');
                content.classList.add('show');
            } else {
                header.classList.remove('expanded');
                content.classList.remove('show');
            }
        }
    });
}
