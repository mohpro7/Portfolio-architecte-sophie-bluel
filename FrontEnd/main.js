document.addEventListener('DOMContentLoaded', function() {
    verifiLogin(); // Appelle la fonction pour vérifier si on est connecter ou non
});

// fonction pour recuperer les données de l'api
async function fetchWorks() {
    console.log("fetchWorks is called");
    try {
        const response = await fetch('http://localhost:5678/api/works') ; // recupere les donne via l'api 
        const data = await response.json(); // Attend la conversion de la réponse en JSON
        displayWorks(data); // Appelle une fonction pour traiter et afficher les données
        console.log(data);

        return data;

    } catch (error) {
        console.error('Error fetching data:', error); // Affiche les erreurs s'il y en a
    }
}


// fonction pour afficher les element sur la page
function displayWorks(data) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; //supprime les données existante

    for (let i = 0; i < data.length; i++) {
        const work = data[i]; //itteration dans le tableau contenant les donné pour la galeri

        // Création de l'élément figure pour chaque travail
        const figure = document.createElement('figure');

        // Ajout de l'image
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = `Image de ${work.title}`;

        //Ajout de la légende
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title; //ajout de la legende a l'image

        //insertion des element dans le DOM
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
        
    }

}

// Fonction pour récupérer les catégories via l'API
async function fetchCategories() {
    try {
        const response = await fetch ("http://localhost:5678/api/categories");
        const categories = await response.json();
        console.log(categories);
        generateCategoryMenu(categories);

        return categories;
    } catch (error) {
        console.error('error fetching categories', error);
    }  
}

// Fonction pour générer le menu des catégories
function generateCategoryMenu(categories) {
    const menu = document.querySelector('#category-menu');
    menu.innerHTML = '';
    
    const allButton = document.createElement('li');
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', async () => {
        const works = await fetchWorks()
        displayWorks(works); // Afficher tous les travaux
    });    
    menu.appendChild(allButton);

    for (const category of categories) {    
    const categoryButton = document.createElement('li');
    categoryButton.textContent = category.name;

    // Attachement du gestionnaire d'événements
    categoryButton.addEventListener('click', async () => {
        const works = await fetchWorks();

        // filtre les objet en fontion de leur Id qui a ete stocker dans les bouton implicitement lors de la creation de ladventlistner
        const filteredWorks = works.filter(work => work.categoryId === category.id); 
        displayWorks(filteredWorks);
    });

    menu.appendChild(categoryButton);
    }
   }

fetchWorks();  // Ceci appelle la fonction dès que le script est exécuté
fetchCategories();

function verifiLogin() {
    const authToken = localStorage.getItem('authToken');
    const displayBtn = document.getElementById('modal-btn');
    const iconModifier = document.querySelector('.fa-pen-to-square');
    if (!authToken) {
        console.log("aucun token");
        displayBtn.style.display = 'none';
        iconModifier.style.display = 'none';
    } else {
        console.log("token trouvé");
        displayBtn.style.display = 'block';
        iconModifier.style.display = 'block';
    }
}