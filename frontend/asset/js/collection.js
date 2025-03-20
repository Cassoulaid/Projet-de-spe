document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si l'utilisateur est connecté
    if (!requireAuth()) return;
    
    // Charger la collection de l'utilisateur
    loadCollection();
    
    // Ajouter des gestionnaires d'événements pour les filtres
    setupFilters();
});

// Fonction pour charger la collection de l'utilisateur
async function loadCollection() {
    try {
        // Récupérer la collection depuis l'API
        const collectionData = await fetchAPI('/user/collection', {
            method: 'GET'
        });
        
        // Afficher les cartes
        displayCards(collectionData.cards);
        
        // Mettre à jour les statistiques
        updateCollectionStats(collectionData);
        
    } catch (error) {
        showMessage('message-container', error.message || 'Erreur lors du chargement de la collection', 'error');
    }
}

// Fonction pour afficher les cartes
function displayCards(cards) {
    const cardsContainer = document.getElementById('cards-container');
    
    if (!cardsContainer) return;
    
    // Vider le conteneur
    cardsContainer.innerHTML = '';
    
    if (cards.length === 0) {
        cardsContainer.innerHTML = '<p class="loading">Aucune carte dans votre collection. Achetez des bundles pour commencer !</p>';
        return;
    }
    
    // Créer un élément pour chaque carte
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card-item ${card.owned ? 'owned' : 'missing'}`;
        cardElement.dataset.owned = card.owned ? 'true' : 'false';
        
        cardElement.innerHTML = `
            <div class="card-image ${card.owned ? '' : 'missing'}">
                <!-- Remplacer par l'image réelle de la carte si disponible -->
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: ${getCardColor(card.rarity)};">
                    ${card.id}
                </div>
            </div>
            <div class="card-content">
                <div class="card-title">${card.name}</div>
                <div class="card-rarity ${card.rarity.toLowerCase()}">${card.rarity}</div>
            </div>
        `;
        
        cardsContainer.appendChild(cardElement);
    });
}

// Fonction pour obtenir la couleur de fond en fonction de la rareté
function getCardColor(rarity) {
    switch(rarity.toLowerCase()) {
        case 'common':
            return '#c0c0c0';
        case 'rare':
            return '#4a9de0';
        case 'epic':
            return '#9c27b0';
        case 'legendary':
            return '#ff9800';
        default:
            return '#c0c0c0';
    }
}

// Fonction pour mettre à jour les statistiques de la collection
function updateCollectionStats(collectionData) {
    const totalCards = document.getElementById('total-cards');
    const ownedCards = document.getElementById('owned-cards');
    const progress = document.getElementById('progress');
    
    if (totalCards) totalCards.textContent = collectionData.total || 0;
    if (ownedCards) ownedCards.textContent = collectionData.owned || 0;
    if (progress) {
        const progressPercentage = collectionData.total > 0 
            ? Math.round((collectionData.owned / collectionData.total) * 100) 
            : 0;
        progress.textContent = `${progressPercentage}%`;
    }
}

// Fonction pour configurer les filtres
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe 'active' de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe 'active' au bouton cliqué
            button.classList.add('active');
            
            // Appliquer le filtre
            const filter = button.dataset.filter;
            filterCards(filter);
        });
    });
}

// Fonction pour filtrer les cartes
function filterCards(filter) {
    const cardItems = document.querySelectorAll('.card-item');
    
    cardItems.forEach(card => {
        const isOwned = card.dataset.owned === 'true';
        
        switch (filter) {
            case 'all':
                card.style.display = 'block';
                break;
            case 'owned':
                card.style.display = isOwned ? 'block' : 'none';
                break;
            case 'missing':
                card.style.display = !isOwned ? 'block' : 'none';
                break;
        }
    });
}