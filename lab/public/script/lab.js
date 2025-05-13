class Lab {
    constructor() {
        this.grid = document.getElementById('lab-grid');
        this.filters = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        this.experiments = [];

        this.init();
    }

    async init() {
        try {
            await this.loadExperiments();
            this.setupEventListeners();
            this.renderExperiments();
        } catch (error) {
            console.error('Lab initialization failed:', error);
            this.showErrorState();
        }
    }

    async loadExperiments() {
        try {
            const response = await fetch('public/data/experiments.json');

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            // Handle both array and object-with-experiments formats
            this.experiments = Array.isArray(data)
                ? data 
                : data?.experiments || [];

            if (!Array.isArray(this.experiments)) {
                throw new Error('Invalid data format: experiments must be an array');
            }

        } catch (error) {
            console.error('Failed to load experiments:', error);
            this.experiments = []; // Ensure it remains an array
            this.showErrorState();
            throw error; // Rethrow for init() to catch
        }
    }

    setupEventListeners() {
        this.filters.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilterClick(btn));
        });
    }

    handleFilterClick(btn) {
        this.filters.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderExperiments();
    }

    renderExperiments() {
        try {
            this.grid.innerHTML = '';

            if (!Array.isArray(this.experiments)) {
                throw new Error('Experiments data is not an array');
            }

            const filtered = this.applyFilter();
            this.displayExperiments(filtered);

        } catch (error) {
            console.error('Render failed:', error);
            this.showErrorState();
        }
    }

    applyFilter() {
        return this.currentFilter === 'all'
            ? [...this.experiments]
            : this.experiments.filter(exp => {
                // Handle missing tags property
                const tags = Array.isArray(exp?.tags) ? exp.tags : [];
                return tags.includes(this.currentFilter);
            });
    }

    displayExperiments(experiments) {
        if (!experiments.length) {
            this.grid.innerHTML = this.createEmptyState();
            return;
        }

        experiments.forEach(exp => {
            const card = this.createExperimentCard(exp);
            this.grid.appendChild(card);
        });
    }

    createExperimentCard(experiment) {
        const card = document.createElement('article');
        card.className = 'experiment-card';

        // Safely handle missing properties
        const status = experiment.status || '';
        const tags = Array.isArray(experiment.tags) ? experiment.tags : [];
        const tech = Array.isArray(experiment.tech) ? experiment.tech : [];

        card.innerHTML = `
            ${status ? `<span class="experiment-status">${status}</span>` : ''}
            <h3>${experiment.title || 'Untitled Experiment'}</h3>
            <p class="experiment-description">${experiment.description || 'No description provided'}</p>
            <div class="tech-stack">${this.createTechPills(tech)}</div>
            <div class="lab-links">${this.createLinks(experiment)}</div>
        `;

        return card;
    }

    createTechPills(tech) {
        return tech
            .map(t => `<span class="tech-pill">${t}</span>`)
            .join('');
    }

    createLinks(experiment) {
        const links = [];

        if (experiment.demoUrl) {
            links.push(`
                <a href="${experiment.demoUrl}" class="lab-link" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Demo
                </a>
            `);
        }

        if (experiment.repoUrl) {
            links.push(`
                <a href="${experiment.repoUrl}" class="lab-link" target="_blank">
                    <i class="fab fa-github"></i> Code
                </a>
            `);
        }

        return links.join('') || '<span class="no-links">No links available</span>';
    }

    createEmptyState() {
        return `
            <div class="experiment-card">
                <h3>LABORATORY EMPTY</h3>
                <p>No experiments matching current filters</p>
                <div class="tech-stack">
                    <span class="tech-pill">${this.currentFilter}</span>
                </div>
            </div>
        `;
    }

    showErrorState() {
        this.grid.innerHTML = `
            <div class="experiment-card">
                <h3>CRITICAL SYSTEM FAILURE</h3>
                <p>Experiments cannot be loaded. Emergency protocols activated.</p>
                <div class="tech-stack">
                    <span class="tech-pill">Error 0xDEADBEEF</span>
                </div>
            </div>
        `;
    }
}

// Initialize with safety checks
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('lab-grid')) {
        new Lab();
    } else {
        console.error('Lab grid container not found');
    }
});