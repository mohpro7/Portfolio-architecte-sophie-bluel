// fonction pour recuperer les données de l'api
async function fetchWorks() {
    console.log("fetchWorks is called");
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4'
            }
        }); // recupere les donne via l'api et utilise le token
        const data = await response.json(); // Attend la conversion de la réponse en JSON
        displayWorks(data); // Appelle une fonction pour traiter et afficher les données
        generateCategoryMenu(data); // Génère le menu de catégories et ajoute le filtrage
        console.log(data);

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

function generateCategoryMenu(data) {
    const menu = document.querySelector('#category-menu');
    menu.innerHTML = '';
    const categories = [
        { name: 'Tous', filter: data },
        { name: 'Objets', filter: data.filter(work => work.category.name === 'Objets') },
        { name: 'Appartements', filter: data.filter(work => work.category.name === 'Appartements') },
        { name: 'Hotels & restaurants', filter: data.filter(work => work.category.name === 'Hotels & restaurants') }
    ];
    categories.forEach(category => {
        const categoryButton = document.createElement('li');
        categoryButton.textContent = category.name;
        categoryButton.addEventListener('click', () => {
            displayWorks(category.filter);
        });
        menu.appendChild(categoryButton);
    });
}

fetchWorks();  // Ceci appelle la fonction dès que le script est exécuté