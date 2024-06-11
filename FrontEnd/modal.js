document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const fileButton = document.querySelector('.custom-input-file');
    const buttonOpenRemoveModal = document.getElementById('modal-btn');
    const modalContainer = document.getElementById('modal-container');
    const closeModal = document.querySelector('.close-modal');
    const modalAddFile = document.getElementById('modal-add-file');
    const modalRemoveFile = document.getElementById('modal-remove-file');
    const btnModalAddFile = document.querySelector('.btn-add-picture-modal-remove-file');
    const backModal = document.querySelector('.back');
    const titleInput = document.getElementById('assign-title');
    const form = document.getElementById('image-form');

    //fermeture de la modal//
    closeModal.addEventListener('click', () => {
        modalContainer.style.display = 'none';
    });

//**** Gestion de la remove modale ****//

        //ouverture de la remove modal//
    buttonOpenRemoveModal.addEventListener('click', async () => {
        openModalRemoveFile();
        const works = await fetchWorks();
        displayWorksInModal(works);
    });
    
        //affichage de la remove modal//
    function openModalRemoveFile() {
        modalContainer.style.display = 'flex';
        modalRemoveFile.style.display = 'block';
        modalAddFile.style.display = 'none';
        backModal.style.display = 'none';
    }

    
            //affichage des images//
    function displayWorksInModal(works) {
        const modalPicture = document.querySelector('.remove-picture');
        modalPicture.innerHTML = '';

        works.forEach(work => {
            const figure = document.createElement('figure');

            const image = document.createElement('img');
            image.src = work.imageUrl;
            image.alt = `Image de ${work.title}`;

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-solid', 'fa-trash-can');
            deleteIcon.addEventListener('click', () => {
                console.log('Deleting image with ID:', work.id);
                deleteImage(work.id);
            });

            figure.appendChild(image);
            figure.appendChild(deleteIcon);
            modalPicture.appendChild(figure);
        });
    }

            //fonction poour supprimer image//
    async function deleteImage(workId) {
        let authToken = localStorage.getItem('authToken');
        console.log('Initial auth token:', authToken);
        try {
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Failed to delete the work:', errorMessage);
                throw new Error(errorMessage);
            }

            const works = await fetchWorks();
            displayWorksInModal(works);
        } catch (error) {
            console.error('Error deleting work:', error);
            alert('Une erreur est survenue lors de la suppression de l\'œuvre.');
        }
    }

// **** Gestion de la add file modal ****/

        //ouverture de la add file modal//
    btnModalAddFile.addEventListener('click', () => {
        modalRemoveFile.style.display = 'none';
        modalAddFile.style.display = 'block';
        backModal.style.display = 'flex';
    });

        //retour vers remove modal//
    backModal.addEventListener('click', openModalRemoveFile);

        //verifie que les champs sont bien remplie//
    function validateForm(event) {
        if (!titleInput.value) {
            event.preventDefault();
            alert('Veuillez entrer un titre');
            titleInput.focus();
        }
    }

    form.addEventListener('submit', validateForm);

        //transforme la button en input file//
    fileButton.addEventListener('click', () => {
        fileInput.click();
    });

            //affiche un apercu de limage telecharger en local dans la modal//
    fileInput.addEventListener('change', function() {
        const file = this.files[0]; // contient le fichier téléchargé
        if (file) {
            const reader = new FileReader(); // objet JavaScript qui permet de lire le fichier de manière asynchrone
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block'; // rend l'image visible
            };
            reader.readAsDataURL(file); // Commence la lecture du fichier au format URL
        }
    });


        //modifie le comportement par default evite le rechargement de la page verifie que les champs sont remplie et envoi les fichier a lapi//
    document.getElementById('image-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const fileInput = document.getElementById('file-input');
        const titleInput = document.getElementById('assign-title');
        const categorySelect = document.getElementById('assign-categorie');

        if (fileInput.files.length === 0) {
            alert('Veuillez sélectionner une image.');
            return;
        }

        if (titleInput.value.trim() === "") {
            alert('Veuillez entrer un titre.');
            return;
        }
        if (categorySelect.value.trim() === "") {
            alert('Veuillez sélectionner une catégorie.');
            return;
        }

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', categorySelect.value);

        try {
            const authToken = localStorage.getItem('authToken');
            console.log('Initial auth token:', authToken);
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Failed to upload image:', errorMessage);
                throw new Error('Failed to upload image');
            }

            const works = await fetchWorks();
            displayWorks(works);

            fileInput.value = '';
            titleInput.value = '';
            categorySelect.value = '';

            modalContainer.style.display = 'none';

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Une erreur est survenue lors de l\'upload de l\'image.');
        }
    });

    async function fetchWorks() {
        console.log("fetchWorks is called");
        try {
            const response = await fetch('http://localhost:5678/api/works');
            const data = await response.json();
            displayWorks(data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayWorks(data) {
        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = '';

        for (let i = 0; i < data.length; i++) {
            const work = data[i];

            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = `Image de ${work.title}`;

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = work.title;

            gallery.appendChild(figure);
            figure.appendChild(img);
            figure.appendChild(figcaption);
        }
    }

    async function fetchCategories() {
        try {
            const response = await fetch("http://localhost:5678/api/categories");
            const categories = await response.json();
            generateCategoryMenu(categories);
            populateCategorySelect(categories);
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    function populateCategorySelect(categories) {
        const select = document.getElementById('assign-categorie');
        select.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    }

    function generateCategoryMenu(categories) {
        const menu = document.querySelector('#category-menu');
        menu.innerHTML = '';

        const allButton = document.createElement('li');
        allButton.textContent = 'Tous';
        allButton.addEventListener('click', async () => {
            const works = await fetchWorks();
            displayWorks(works);
        });
        menu.appendChild(allButton);

        for (const category of categories) {
            const categoryButton = document.createElement('li');
            categoryButton.textContent = category.name;

            categoryButton.addEventListener('click', async () => {
                const works = await fetchWorks();
                const filteredWorks = works.filter(work => work.categoryId === category.id);
                displayWorks(filteredWorks);
            });

            menu.appendChild(categoryButton);
        }
    }

    fetchWorks();
    fetchCategories();

    function verifiLogin() {
        const authToken = localStorage.getItem('authToken');
        console.log('VerifiLogin - authToken:', authToken);
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

    window.verifiLogin = verifiLogin;

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        verifiLogin();
    });

    verifiLogin();
});
