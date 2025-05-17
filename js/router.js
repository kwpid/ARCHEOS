class Router {
    constructor(routes) {
        this.routes = routes;
        this.contentDiv = document.getElementById('content');
        this.loadingScreen = document.getElementById('loading-screen');
        this.dataCache = new Map();
        
        // Handle initial route
        this.handleRoute();
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    async handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.routes[hash] || this.routes['/404'];
        
        // Show loading screen
        this.loadingScreen.classList.add('active');
        
        try {
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Load and render the page
            const content = await route();
            this.contentDiv.innerHTML = content;
            
            // Update active nav link
            this.updateActiveNavLink(hash);
        } catch (error) {
            console.error('Error loading route:', error);
            this.contentDiv.innerHTML = '<div class="error">Error loading page</div>';
        } finally {
            // Hide loading screen
            this.loadingScreen.classList.remove('active');
        }
    }

    updateActiveNavLink(hash) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current route link
        const activeLink = document.querySelector(`.nav-link[href="#${hash}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    async loadData(type, id) {
        const cacheKey = `${type}/${id}`;
        
        if (this.dataCache.has(cacheKey)) {
            return this.dataCache.get(cacheKey);
        }

        try {
            const response = await fetch(`data/${type}/${id}.json`);
            if (!response.ok) throw new Error('Data not found');
            
            const data = await response.json();
            this.dataCache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`Error loading ${type} data:`, error);
            throw error;
        }
    }

    async loadAllData(type) {
        try {
            const response = await fetch(`data/${type}/`);
            if (!response.ok) throw new Error('Directory not found');
            
            const files = await response.json();
            const data = await Promise.all(
                files
                    .filter(file => file.endsWith('.json') && file !== 'template.json')
                    .map(file => this.loadData(type, file.replace('.json', '')))
            );
            
            return data;
        } catch (error) {
            console.error(`Error loading ${type} directory:`, error);
            throw error;
        }
    }
}

// Page templates
const templates = {
    home: () => {
        const template = document.getElementById('home-template');
        return template.content.cloneNode(true);
    },
    
    planet: (data) => {
        const template = document.getElementById('planet-template');
        const clone = template.content.cloneNode(true);
        
        // Fill in the template with data
        clone.querySelector('.page-title').textContent = data.name;
        clone.querySelector('.classification').textContent = data.classification;
        clone.querySelector('.discovery-date').textContent = data.discoveryDate;
        clone.querySelector('.status').textContent = data.status;
        clone.querySelector('.status').classList.add(data.status.toLowerCase());
        clone.querySelector('.author').textContent = data.author;
        clone.querySelector('.description').textContent = data.description;
        
        return clone;
    }
};

// Define routes
const routes = {
    '/': () => templates.home(),
    '/planets': async () => {
        try {
            const planets = await router.loadAllData('planets');
            const planetsList = planets
                .map(planet => `
                    <div class="list-item">
                        <h3><a href="#/planet/${planet.name.toLowerCase().replace(/\s+/g, '-')}">${planet.name}</a></h3>
                        <span class="status ${planet.status.toLowerCase()}">${planet.status}</span>
                    </div>
                `).join('');
            return `<div class="page"><h1>Planets</h1><div class="list-container">${planetsList}</div></div>`;
        } catch (error) {
            return '<div class="error">Error loading planets</div>';
        }
    },
    '/planet/:id': async (id) => {
        try {
            const data = await router.loadData('planets', id);
            return templates.planet(data);
        } catch (error) {
            return '<div class="error">Planet not found</div>';
        }
    },
    '/species': async () => {
        try {
            const species = await router.loadAllData('species');
            const speciesList = species
                .map(species => `
                    <div class="list-item">
                        <h3><a href="#/species/${species.name.toLowerCase().replace(/\s+/g, '-')}">${species.name}</a></h3>
                        <span class="status ${species.status.toLowerCase()}">${species.status}</span>
                    </div>
                `).join('');
            return `<div class="page"><h1>Species</h1><div class="list-container">${speciesList}</div></div>`;
        } catch (error) {
            return '<div class="error">Error loading species</div>';
        }
    },
    '/events': async () => {
        try {
            const events = await router.loadAllData('events');
            const eventsList = events
                .map(event => `
                    <div class="list-item">
                        <h3><a href="#/event/${event.name.toLowerCase().replace(/\s+/g, '-')}">${event.name}</a></h3>
                        <span class="status ${event.status.toLowerCase()}">${event.status}</span>
                    </div>
                `).join('');
            return `<div class="page"><h1>Events</h1><div class="list-container">${eventsList}</div></div>`;
        } catch (error) {
            return '<div class="error">Error loading events</div>';
        }
    },
    '/404': () => '<div class="page"><h1>404 - Page Not Found</h1><p>The requested page does not exist.</p></div>'
};

// Initialize router
const router = new Router(routes); 