document.addEventListener('DOMContentLoaded', () =>{
    const fileInput = document.getElementById('file-input');
    const fileButton = document.querySelector('.custom-input-file');
    const buttonModal = document.getElementById('modal-btn');
    const modalContainer = document.getElementById('modal-container');
    const closeModal = document.querySelector('.close-modal');



    buttonModal.addEventListener('click', () => {
        modalContainer.style.display = 'flex';
    });

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

});


