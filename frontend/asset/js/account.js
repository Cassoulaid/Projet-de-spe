document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si l'utilisateur est connecté
    if (!requireAuth()) return;
    
    // Charger les informations du profil utilisateur
    loadUserProfile();
});

// Fonction pour charger les informations du profil utilisateur
async function loadUserProfile() {
    try {
        // Récupérer les informations du profil depuis l'API
        const userData = await fetchAPI('/user/profile', {
            method: 'GET'
        });
        
        // Mettre à jour l'affichage des informations utilisateur
        updateUserInfo(userData);
        
    } catch (error) {
        showMessage('message-container', error.message || 'Erreur lors du chargement du profil', 'error');
    }
}

// Fonction pour mettre à jour l'affichage des informations utilisateur
function updateUserInfo(userData) {
    const userInfoElement = document.getElementById('user-info');
    const userStatsElement = document.getElementById('user-stats');
    
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <h2>Informations personnelles</h2>
            <p><strong>Email :</strong> ${userData.email}</p>
            <p class="kidcoin-balance"><strong>Solde Kidcoin :</strong> ${userData.kidcoin_balance}</p>
            <p><strong>Membre depuis :</strong> ${formatDate(userData.created_at)}</p>
        `;
    }
    
    if (userStatsElement && userData.stats) {
        userStatsElement.innerHTML = `
            <p><strong>Nombre total de cartes :</strong> ${userData.stats.total_cards || 0}</p>
            <p><strong>Cartes différentes :</strong> ${userData.stats.unique_cards || 0}</p>
            <p><strong>Bundles achetés :</strong> ${userData.stats.bundles_opened || 0}</p>
            <p><strong>Progression de la collection :</strong> ${userData.stats.collection_completion || 0}%</p>
        `;
    }
}

// Fonction utilitaire pour formater une date
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}