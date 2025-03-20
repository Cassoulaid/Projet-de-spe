// Constantes globales
const API_URL = 'http://localhost:3000'; // À remplacer par l'URL de votre API
const TOKEN_KEY = 'cardcollector_token';

// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
    return localStorage.getItem(TOKEN_KEY) !== null;
}

// Fonction pour obtenir le token d'authentification
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Fonction pour déconnecter l'utilisateur
function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = 'login.html';
}

// Fonction pour rediriger vers la page de connexion si non connecté
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Fonction pour initialiser la navigation en fonction du statut de connexion
function initNavigation() {
    const navElement = document.getElementById('main-nav');
    
    if (isLoggedIn()) {
        navElement.innerHTML = `
            <ul>
                <li><a href="account.html" class="${isCurrentPage('account') ? 'active' : ''}">Mon Compte</a></li>
                <li><a href="collection.html" class="${isCurrentPage('collection') ? 'active' : ''}">Collection</a></li>
                <li><a href="bundle.html" class="${isCurrentPage('bundle') ? 'active' : ''}">Bundles</a></li>
                <li><a href="#" id="logout-btn">Déconnexion</a></li>
            </ul>
        `;
        
        // Ajouter événement sur le bouton de déconnexion
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        navElement.innerHTML = `
            <ul>
                <li><a href="index.html" class="${isCurrentPage('index') ? 'active' : ''}">Accueil</a></li>
                <li><a href="login.html" class="${isCurrentPage('login') ? 'active' : ''}">Connexion</a></li>
                <li><a href="register.html" class="${isCurrentPage('register') ? 'active' : ''}">Inscription</a></li>
            </ul>
        `;
    }
}

// Fonction pour déterminer la page courante
function isCurrentPage(pageName) {
    const path = window.location.pathname;
    return path.includes(`${pageName}.html`);
}

// Fonction pour afficher un message
function showMessage(containerId, message, type) {
    const container = document.getElementById(containerId);
    if (container) {
        container.textContent = message;
        container.className = `message-container ${type}`;
    }
}

// Fonction pour effectuer des requêtes API
async function fetchAPI(endpoint, options = {}) {
    // Ajouter les en-têtes par défaut
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Ajouter le token si l'utilisateur est connecté
    if (isLoggedIn() && !endpoint.includes('/auth/')) {
        headers['Authorization'] = `Bearer ${getToken()}`;
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        // Vérifier si la réponse est un succès
        if (!response.ok) {
            if (response.status === 401) {
                // Si non autorisé, déconnecter l'utilisateur
                logout();
            }
            throw new Error(data.message || 'Une erreur est survenue');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Initialiser la navigation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    
    // Vérifier l'authentification pour les pages protégées
    const protectedPages = ['account', 'collection', 'bundle'];
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    
    if (protectedPages.includes(currentPage)) {
        requireAuth();
    }
});