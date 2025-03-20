document.addEventListener('DOMContentLoaded', () => {
    // Gestionnaire pour le formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Gestionnaire pour le formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Fonction pour gérer la soumission du formulaire de connexion
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // Désactiver le bouton pendant la requête
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        
        // Appel API pour la connexion
        const response = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        // Stocker le token et rediriger
        if (response.token) {
            localStorage.setItem(TOKEN_KEY, response.token);
            showMessage('message-container', 'Connexion réussie. Redirection...', 'success');
            
            // Rediriger vers la page du compte
            setTimeout(() => {
                window.location.href = 'account.html';
            }, 1000);
        }
    } catch (error) {
        showMessage('message-container', error.message || 'Échec de la connexion', 'error');
    } finally {
        // Réactiver le bouton
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = false;
    }
}

// Fonction pour gérer la soumission du formulaire d'inscription
async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
        showMessage('message-container', 'Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    try {
        // Désactiver le bouton pendant la requête
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        
        // Appel API pour l'inscription
        const response = await fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        // Afficher un message de succès et rediriger vers la page de connexion
        if (response.success) {
            showMessage('message-container', 'Inscription réussie ! Vous allez être redirigé vers la page de connexion.', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    } catch (error) {
        showMessage('message-container', error.message || 'Échec de l\'inscription', 'error');
    } finally {
        // Réactiver le bouton
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = false;
    }
}