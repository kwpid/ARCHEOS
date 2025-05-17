import { planets } from './data/planets.js';
import { species } from './data/species.js';
import { events } from './data/events.js';

class Router {
    constructor(routes) {
        this.routes = routes;
        this.contentDiv = document.getElementById('content');
        this.loadingScreen = document.getElementById('loading-screen');
        
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
    '/planets': () => {
        const planetsList = Object.entries(planets)
            .map(([id, planet]) => `
                <div class="list-item">
                    <h3><a href="#/planet/${id}">${planet.name}</a></h3>
                    <span class="status ${planet.status.toLowerCase()}">${planet.status}</span>
                </div>
            `).join('');
        return `<div class="page"><h1>Planets</h1><div class="list-container">${planetsList}</div></div>`;
    },
    '/planet/:id': (id) => {
        const data = planets[id];
        if (!data) return '<div class="error">Planet not found</div>';
        return templates.planet(data);
    },
    '/species': () => {
        const speciesList = Object.entries(species)
            .map(([id, species]) => `
                <div class="list-item">
                    <h3><a href="#/species/${id}">${species.name}</a></h3>
                    <span class="status ${species.status.toLowerCase()}">${species.status}</span>
                </div>
            `).join('');
        return `<div class="page"><h1>Species</h1><div class="list-container">${speciesList}</div></div>`;
    },
    '/events': () => {
        const eventsList = Object.entries(events)
            .map(([id, event]) => `
                <div class="list-item">
                    <h3><a href="#/event/${id}">${event.name}</a></h3>
                    <span class="status ${event.status.toLowerCase()}">${event.status}</span>
                </div>
            `).join('');
        return `<div class="page"><h1>Events</h1><div class="list-container">${eventsList}</div></div>`;
    },
    '/404': () => '<div class="page"><h1>404 - Page Not Found</h1><p>The requested page does not exist.</p></div>'
};

// Initialize router
const router = new Router(routes); 