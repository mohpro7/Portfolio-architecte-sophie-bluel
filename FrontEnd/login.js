document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire

        const email = document.getElementById("mail").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken", data.token); // Stocke le token dans le localStorage
                window.location.href = "index.html"; // Redirige vers la page d'accueil
            } else {
                errorMessage.textContent = "E-mail ou mot de passe incorrect.";
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            errorMessage.textContent = "Une erreur s'est produite. Veuillez réessayer.";
            errorMessage.style.display = "block";
        }
    });
});

