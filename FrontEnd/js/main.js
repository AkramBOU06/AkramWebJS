/*/ Ensemble de travaux déjà affichés /*/
const displayedProjects = new Set();

/*/ Container pour les images de la galerie /*/
const imagesContainer = document.querySelector(".gallery");

/*/ Fonction pour créer une figure de travail /*/
function createWorkFigure(work) {
  const figure = document.createElement("figure");
  const figureCaption = document.createElement("figcaption");
  const figureImage = document.createElement("img");

  figureImage.src = work.imageUrl;
  figureImage.alt = work.title;
  figureCaption.innerHTML = work.title;
  figure.setAttribute("data-id", work.id);
  figure.setAttribute("category-id", work.categoryId);

  figure.appendChild(figureImage);
  figure.appendChild(figureCaption);

  return figure;
}

/*/ Récupérer les travaux depuis l'API et les afficher /*/
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((work) => {
      if (!displayedProjects.has(work.id)) {
        const figure = createWorkFigure(work);
        imagesContainer.appendChild(figure);
        displayedProjects.add(work.id);
      }
    });
  })
  .catch((error) => {
    console.error('Une erreur s\'est produite lors de la récupération des travaux:', error);
  });

/*/ Fonction pour filtrer les travaux par catégorie /*/
function filterWorksByCategory(categoryId) {
  const elements = document.querySelectorAll("div.gallery figure");
  elements.forEach((element) => {
    const elementCategoryId = element.getAttribute("category-id");
    if (categoryId === "all" || elementCategoryId === categoryId) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
}

/*/ Supprimer la sélection du bouton lors de la fermeture de la fenêtre /*/
window.onbeforeunload = function () {
  sessionStorage.removeItem("boutonSelectionne");
};

/*/ Récupérer les catégories depuis l'API et les afficher dans une liste déroulante /*/
const selectCategory = document.getElementById("modal-photo-category");

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((category) => {
      const categoryOption = document.createElement("option");
      const categoryLabel = document.createElement("label");

      categoryOption.setAttribute("value", category.id);
      categoryLabel.innerHTML = category.name;

      selectCategory.appendChild(categoryOption);
      categoryOption.appendChild(categoryLabel);

      /*/ Créer un bouton pour chaque catégorie /*/
      const button = document.createElement("button");
      button.setAttribute("type", "button");
      button.setAttribute("class", "bouton-css");
      button.innerText = category.name;
      button.setAttribute("category-id", category.id);
      button.addEventListener("click", function () {
        /*/ Retirer la classe "selected" de tous les boutons /*/
        document.querySelectorAll(".bouton-css").forEach((btn) => {
          btn.classList.remove("selected");
        });
        /*/ Ajouter la classe "selected" au bouton cliqué /*/
        this.classList.add("selected");
        /*/ Filtrer les travaux par catégorie /*/
        const categoryId = this.getAttribute("category-id");
        filterWorksByCategory(categoryId);
      });
      document.querySelector(".filtre").appendChild(button);
    });
  })
  .catch((error) => {
    console.error("Une erreur s'est produite lors de la récupération des catégories:", error);
  });

/*/ Gérer l'état de connexion de l'utilisateur /*/
const loginStatus = document.getElementById("login");
const logoutStatus = document.getElementById("logout");
const adminStatus = document.getElementById("admin-logged");
const figureModify = document.getElementById("figure-modify");
const description = document.getElementById("figure-modify-a");
const portfolioModify = document.getElementById("portfolio-l-modify");
const filtreModify = document.querySelector(".filtre");

if (JSON.parse(sessionStorage.getItem("isConnected"))) {
  loginStatus.style.display = "none";
  logoutStatus.style.display = "block";
  adminStatus.style.display = "flex";
  figureModify.style.display = "flex";
  portfolioModify.style.display = "flex";
  filtreModify.style.display = "none";
  description.style.display = "flex";
} else {
  loginStatus.style.display = "block";
  logoutStatus.style.display = "none";
  adminStatus.style.display = "none";
  figureModify.style.display = "none";
  portfolioModify.style.display = "none";
  filtreModify.style.display = "flex";
  description.style.display = "none";
}

/*/ Gérer la déconnexion de l'utilisateur /*/
logoutStatus.addEventListener("click", (event) => {
  event.preventDefault();
  sessionStorage.removeItem("Token");
  sessionStorage.removeItem("isConnected");
  window.location.replace("index.html");
});

/*/ Ajouter un événement sur le bouton "Tous" pour afficher tous les travaux /*/
const allButton = document.getElementById("btnTous");
allButton.addEventListener("click", function () {
  document.querySelectorAll(".bouton-css").forEach((btn) => {
    btn.classList.remove("selected");
  });
  this.classList.add("selected");
  sessionStorage.setItem("boutonSelectionne", "btnTous");
  filterWorksByCategory("all");
});

/*/ Supprimer la sélection du bouton lors de la fermeture de la fenêtre /*/
window.onbeforeunload = function () {
  sessionStorage.removeItem("boutonSelectionne");
};
