// Fonction pour se déconnecter
function logout() {
  // Retirer le jeton du local storage
  localStorage.removeItem("jwtToken");
  // Recharger la page
  location.reload();
}

// Fonction pour vérifier si l'utilisateur est connecté
function checkLoggedIn() {
  // Vérifier si le jeton JWT existe dans le local storage
  if (localStorage.getItem("jwtToken")) {
    return true;
  } else {
    return false;
  }
}

// Fonction pour afficher la page de l'utilisateur connecté
function displayLoggedInPage() {
  // Modifier les éléments qui doivent être visibles ou cachés lorsque l'utilisateur est connecté
  const logoutButton = document.getElementById("logout");
  const loginButton = document.getElementById("login");
  const modalButton = document.querySelector(".modal-btn");
  const filterButton = document.querySelector(".btn-filter");
  const editButton = document.querySelector(".logo_projets");
  const modeEditionBar = document.querySelector(".mode_edition_bar");
  const logoUnderImg = document.querySelector(".logo_under_img");

  logoutButton.style.display = "block";
  loginButton.style.display = "none";
  modalButton.style.display = "block";
  filterButton.style.display = "none";
  editButton.style.display = "flex";
  modeEditionBar.style.display = "flex";
  logoUnderImg.style.display = "block";
}

// Fonction pour afficher la page de l'utilisateur non connecté
function displayLoggedOutPage() {
  // Modifier les éléments qui doivent être visibles ou cachés lorsque l'utilisateur n'est pas connecté
  const logoutButton = document.getElementById("logout");
  const loginButton = document.getElementById("login");
  const modalButton = document.querySelector(".modal-btn");
  const filterButton = document.querySelector(".btn-filter");
  const editButton = document.querySelector(".logo_projets");
  const modeEditionBar = document.querySelector(".mode_edition_bar");
  const logoUnderImg = document.querySelector(".logo_under_img");

  logoutButton.style.display = "none";
  loginButton.style.display = "block";
  modalButton.style.display = "none";
  filterButton.style.display = "flex";
  editButton.style.display = "none";
  modeEditionBar.style.display = "none";
  logoUnderImg.style.display = "none";
}



// Lorsque le contenu du document est chargé
document.addEventListener("DOMContentLoaded", function () {
  if (checkLoggedIn()) {
    console.log('online')
    displayLoggedInPage();
  } else {
    displayLoggedOutPage();
  }


  // Ajouter un gestionnaire d'événement pour le clic sur le bouton de déconnexion
  document.querySelector("#logout").addEventListener("click", function (event) {
    // Empêcher le comportement par défaut du bouton (rechargement de la page)
    event.preventDefault();

    // Supprimer le jeton JWT du stockage local
    localStorage.removeItem("jwtToken");
    // Rediriger vers la page de connexion
    window.location.href = "loginpage.html";

  });


  function afficherGallery() {
    fetch('http://localhost:5678/api/works')
      .then((response) => response.json())
      .then((gallery) => {
        const galleryElement = document.querySelector(".gallery");
        const modalGalleryElement = document.querySelector("#modal1 .gallery-container");
        galleryElement.innerHTML = null
        modalGalleryElement.innerHTML = null
        gallery.forEach((work) => {
          const cardElement = document.createElement("figure");
          cardElement.dataset.categoryId = work.categoryId;
          cardElement.dataset.workId = work.id;

          const imageElement = document.createElement('img');
          imageElement.src = work.imageUrl;

          const nomElement = document.createElement("figcaption");
          nomElement.innerText = work.title;

          cardElement.appendChild(imageElement);
          cardElement.appendChild(nomElement);
          galleryElement.appendChild(cardElement);

          const cardElementModal = document.createElement("figure");
          cardElementModal.dataset.categoryId = work.categoryId;
          cardElementModal.dataset.workId = work.id;

          const imageElementModal = document.createElement('img');
          imageElementModal.src = work.imageUrl;

          const nomElementModal = document.createElement("figcaption");
          nomElementModal.innerText = "Editer";

          const iconElementModal = document.createElement("i");
          iconElementModal.classList.add("fa-solid", "fa-trash-can", "icon-modal");

          cardElementModal.appendChild(imageElementModal);
          cardElementModal.appendChild(nomElementModal);
          cardElementModal.appendChild(iconElementModal);
          modalGalleryElement.appendChild(cardElementModal);
        });


        // ---------- Suppression photos -------- //


        const deleteIconsModal = document.querySelectorAll(".icon-modal");
        deleteIconsModal.forEach((deleteIconModal) => {
          deleteIconModal.addEventListener("click", async () => {

            const workId = deleteIconModal.parentElement.dataset.workId;
            const monToken = localStorage.getItem("jwtToken");

            try {
              const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${monToken}`
                }
              });

              if (response.ok) {
                console.log("Œuvre supprimée avec succès !");
                deleteIconModal.parentElement.remove();
                afficherGallery();
                showAlert('image supprimée ! ')
                closeModal()
              } else {
                console.log("Erreur lors de la suppression de l'œuvre.");
              }
            } catch (error) {
              console.log("Une erreur s'est produite lors de la suppression de l'œuvre :", error);
            }
          });
        });
      })
      .catch((error) => {
        console.log("Une erreur s'est produite lors de la récupération de la galerie :", error);
      });
  }





  // Fonction pour afficher les catégories
  function afficherCategories() {
    // Effectuer une requête GET vers l'API pour récupérer les catégories
    fetch('http://localhost:5678/api/categories')
      .then((response) => response.json())
      .then((categories) => {
        const galleryfilters = document.querySelector(".btn-filter");
        const categoryInput = document.getElementById("categoryInput");

        galleryfilters.innerHTML = "";
        categoryInput.innerHTML = "";

        // Créer un bouton "Tous" pour afficher toutes les catégories
        const showAllButton = document.createElement('button');
        showAllButton.innerHTML = "Tous";
        showAllButton.dataset.categoryId = "all";
        galleryfilters.appendChild(showAllButton);

        // Parcourir chaque catégorie et créer un bouton de filtre pour l'afficher
        categories.forEach((category) => {
          const categoryButton = document.createElement('button');
          categoryButton.innerHTML = category.name;
          categoryButton.dataset.categoryId = category.id;

          galleryfilters.appendChild(categoryButton);

          // Créer une option de catégorie pour le menu déroulant
          const optionElement = document.createElement('option');
          optionElement.value = category.id;
          optionElement.innerHTML = category.name;

          categoryInput.appendChild(optionElement);
        });
      })
      .catch((error) => {
        console.log("Une erreur s'est produite lors de la récupération des catégories :", error);
      });
  }


  function filterObjects(categoryId) {
    const works = document.querySelectorAll(".gallery figure");
    works.forEach((work) => {
      work.classList.remove('hide'); // Réinitialise la visibilité de tous les éléments
      if (categoryId && categoryId !== "all" && categoryId !== work.dataset.categoryId) {
        work.classList.add('hide'); // Ajoute la classe 'hide' pour cacher les éléments non correspondants
      }
    });
  }

  // Appeler les fonctions pour afficher la galerie et les catégories
  afficherGallery();
  afficherCategories();

  // Sélectionner les filtres de galerie
  const galleryfilters = document.querySelector(".btn-filter");
  // Ajouter un gestionnaire d'événement pour le clic sur les filtres de galerie
  galleryfilters.addEventListener('click', (filter) => {
    const categoryId = filter.target.dataset.categoryId;
    // Appeler la fonction pour filtrer les objets en fonction de la catégorie sélectionnée
    filterObjects(categoryId);
  });

  // Sélectionner les flèches de retour
  const backArrows = document.querySelectorAll('.back-arrow');
  // Sélectionner les boutons modaux
  const modalBtns = document.querySelectorAll('.modal-btn');
  // Sélectionner les modales
  const modals = document.querySelectorAll('.modal');


  // Fonction pour ouvrir un modal
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
  }

  // Fonction pour fermer tous les modals
  function closeModal() {
    modals.forEach((modal) => {
      modal.style.display = 'none';
    });
  }



  // Ajouter un gestionnaire d'événement pour le clic sur les flèches de retour
  backArrows.forEach((arrow) => {
    arrow.addEventListener('click', (event) => {
      const targetModalId = event.target.getAttribute('data-modal');
      closeModal();
      openModal(targetModalId);
    });
  });

  // Ajouter un gestionnaire d'événement pour le clic sur les boutons modaux
  modalBtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const targetModalId = event.target.getAttribute('data-modal');
      closeModal();
      openModal(targetModalId);
    });
  });

  // Sélectionner les icônes de fermeture
  const closeIcons = document.querySelectorAll('.close');
  // Ajouter un gestionnaire d'événement pour le clic sur les icônes de fermeture
  closeIcons.forEach((icon) => {
    icon.addEventListener('click', closeModal);
  });

  // Ajouter un gestionnaire d'événement pour le clic en dehors de la modale pour la fermer
  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      closeModal();
    }
  });

 

  // Lorsque le contenu du document est chargé
  document.addEventListener("DOMContentLoaded", function () {
    // Récupérer le jeton JWT du stockage local
    const token = localStorage.getItem("jwtToken");

    // Sélectionner le lien de déconnexion
    const logoutLink = document.querySelector("#logoutLink");

    // Vérifier si un jeton est présent
    if (token) {
      // Afficher le lien de déconnexion
      logoutLink.style.display = "block";
    } else {
      // Cacher le lien de déconnexion
      logoutLink.style.display = "none";
    }

    // Ajouter un gestionnaire d'événement pour le clic sur le lien de déconnexion
    logoutLink.addEventListener("click", function () {
      // Supprimer le jeton JWT du stockage local
      localStorage.removeItem("jwtToken");
      // Recharger la page
      location.reload();
    });
  });

  // Sélectionner le bouton de connexion
  const loginBtn = document.querySelector("#login");
  // Gestionnaire d'événement pour le clic sur le bouton de connexion
  loginBtn.addEventListener("click", function () {
    // Vérifier si l'utilisateur est hors ligne
    if (!navigator.onLine) {
      // Action à effectuer lorsque le bouton "login" est cliqué en mode hors connexion
      window.location.href = "loginPage.html";
    }
  });
  const input = document.getElementById('file-input');
  const previewImg = document.getElementById('preview');
  
  input.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = function (e) {
      previewImg.src = e.target.result;
    };
  
    reader.readAsDataURL(file);
  });
  
  
  // ajouter photos //
  
  const titleInput = document.getElementById('titleInput');
  const categoryInput = document.getElementById('categoryInput');
  const fileInput = document.getElementById('file-input');
  const customFileUpload = document.querySelector('.custom-file-upload');
  const paragraph = document.querySelector('p');
  const previewContainer = document.getElementById('preview-container');
  
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
      customFileUpload.style.display = 'none';
      paragraph.style.display = 'none';
      previewContainer.style.display = 'block';
    } else {
      customFileUpload.style.display = 'block';
      paragraph.style.display = 'block';
      previewContainer.style.display = 'none';
    }
  });
  
  document.querySelector('#submit_work_button').addEventListener('click', function () {
    
    if (fileInput.files.length === 0 || titleInput.value.trim() === '' || categoryInput.value === '') {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('category', categoryInput.value);
  
    const monToken = localStorage.getItem("jwtToken");
  
    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + monToken
      },
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Une erreur s'est produite lors de l'envoi de la requête.");
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        showAlert('image ajoutée !')
        afficherGallery()
        closeModal()
      })
      .catch(error => {
        console.error("Une erreur s'est produite :", error.message);
      });
  });
  
  
  function showAlert(message) {
    const snackbar = document.getElementById("snackbar");
    snackbar.textContent = message;
    snackbar.classList.add("show");
  
    setTimeout(function () {
      snackbar.classList.remove("show");
    }, 3000);
  }
  
});






