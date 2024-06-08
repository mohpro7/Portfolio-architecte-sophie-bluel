document.addEventListener('DOMContentLoaded', () =>{
    const fileInput = document.getElementById('file-input');
    const fileButton = document.querySelector('.custom-input-file');
    const buttonModal = document.getElementById('modal-btn');
    const modalContainer = document.getElementById('modal-container');
    const closeModal = document.querySelector('.close-modal');
    const modal1 = document.getElementById('modal-1');
    const modal2 = document.getElementById('modal-2');
    const btnModal1 = document.querySelector('.btn-add-picture-modal-1');
    const backModal = document.querySelector('.back');
    
    function openModal1() {
        modalContainer.style.display = 'flex';
        modal1.style.display = 'block';
        modal2.style.display = 'none';
        backModal.style.display = 'none'
    };

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
            deleteIcon.addEventListener('click', () => deleteImage(work.id)); // le click sur la poubelle lance la fonction delet

            
            figure.appendChild(image);
            figure.appendChild(deleteIcon);
            modalPicture.appendChild(figure);

        });
    }

    buttonModal.addEventListener('click', async () => {
        openModal1();
        const works = await fetchWorks();
        displayWorksInModal(works);
    })

    btnModal1.addEventListener('click', () => {
        modal1.style.display = 'none';
        modal2.style.display = 'block';
        backModal.style.display = 'flex'
    });

    backModal.addEventListener('click', openModal1);

    closeModal.addEventListener('click', () => {
        modalContainer.style.display = 'none';
    });

    fileButton.addEventListener('click', () => {
        fileInput.click();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            modalContainer.style.display = 'none';
        }
    });

    async function deleteImage(workId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
            try {
                const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                    method: 'DELETE'
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete the work');
                }
    
                // Suppression réussie, rafraîchir la liste des œuvres
                const works = await fetchWorks();
                displayWorksInModal(works);
            } catch (error) {
                console.error('Error deleting work:', error);
                alert('Une erreur est survenue lors de la suppression de l\'œuvre.');
            }
        }
    }

});
