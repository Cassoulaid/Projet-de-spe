document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si l'utilisateur est connecté
    if (!requireAuth()) return;
    
    // Charger les informations de l'utilisateur (solde)
    loadUserBalance();
    
    // Configurer le bouton d'achat de bundle
    const buyButton = document.getElementById('buy-bundle');
    if (buyButton) {
        buyButton.addEventListener('click', handleBundlePurchase);
    }
    
    // Configurer le bouton de réinitialisation
    const resetButton = document.getElementById('reset-bundle');
    if (resetButton) {
        resetButton.addEventListener('click', resetBundleView);
    }
});

// Fonction pour charger le solde de l'utilisateur
async function loadUserBalance() {
    try {
        // Récupérer les informations du profil pour obtenir le solde
        const userData = await fetchAPI('/user/profile', {
            method: 'GET'
        });
        
        // Mettre à jour l'affichage du solde
        const balanceElement = document.getElementById('user-balance');
        if (balanceElement) {
            balanceElement.textContent = userData.kidcoin_balance;
        }
        
    } catch (error) {
        showMessage('message-container', error.message || 'Erreur lors du chargement du solde', 'error');
    }
}

// Fonction pour gérer l'achat et l'ouverture d'un bundle
async function handleBundlePurchase() {
    try {
        // Désactiver le bouton pendant la requête
        const buyButton = document.getElementById('buy-bundle');
        if (buyButton) buyButton.disabled = true;
        
        // Effacer les messages précédents
        showMessage('message-container', '', '');
        
        // Appel API pour ouvrir un bundle
        const response = await fetchAPI('/bundle/open', {
            method: 'POST'
        });
        
        // Afficher les cartes obtenues
        if (response.cards && response.cards.length > 0) {
            displayBundleResults(response.cards);
            
            // Mettre à jour le solde après l'achat
            if (response.new_balance !== undefined) {
                const balanceElement = document.getElementById('user-balance');
                if (balanceElement) {
                    balanceElement.textContent = response.new_balance;
                }
            }
            
            showMessage('message-container', 'Bundle ouvert avec succès !', 'success');
        }
        
    } catch (error) {
        showMessage('message-container', error.message || 'Erreur lors de l\'ouverture du bundle', 'error');
    } finally {
        // Réactiver le bouton
        const buyButton = document.getElementById('buy-bundle');
        if (buyButton) buyButton.disabled = false;
    }
}

// Fonction pour afficher les résultats de l'ouverture d'un bundle
function displayBundleResults(cards) {
    const resultContainer = document.getElementById('bundle-result');
    const cardsResultContainer = document.getElementById('cards-result');
    
    if (!resultContainer || !cardsResultContainer) return;
    
    // Vider le conteneur des cartes
    cardsResultContainer.innerHTML = '';
    
    // Créer un élément pour chaque carte obtenue
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-item';
        
        cardElement.innerHTML = `
            <div class="card-image">
                <!-- Remplacer par l'image réelle de la carte si disponible -->
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: ${getCardColor(card.rarity)};">
                    ${card.id}
                </div>
            </div>
            <div class="card-content">
                <div class="card-title">${card.name}</div>
                <div class="card-rarity ${card.rarity.toLowerCase()}">${card.rarity}</div>
                <div style="margin-top: 5px; font-size: 0.8rem;">
                    ${card.is_new ? '<span style="color: #28a745;">NOUVELLE !</span>' : '<span>Déjà possédée</span>'}
                </div>
            </div>
        `;
        
        cardsResultContainer.appendChild(cardElement);
    });
    
    // Afficher le conteneur des résultats
    resultContainer.classList.remove('hidden');
    
    // Masquer temporairement les informations du bundle
    const bundleInfo = document.querySelector('.bundle-info');
    if (bundleInfo) {
        bundleInfo.style.display = 'none';
    }
}

// Fonction pour réinitialiser la vue du bundle
function resetBundleView() {
    // Masquer le conteneur des résultats
    const resultContainer = document.getElementById('bundle-result');
    if (resultContainer) {
        resultContainer.classList.add('hidden');
    }
    
    // Afficher les informations du bundle
    const bundleInfo = document.querySelector('.bundle-info');
    if (bundleInfo) {
        bundleInfo.style.display = 'flex';
    }
    
    // Effacer les messages
    showMessage('message-container', '', '');
}

// Fonction pour obtenir la couleur de fond en fonction de la rareté (dupliquée de collection.js)
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