/*/
   Objet contenant les éléments du formulaire et les messages d'erreur
/*/
const element = {
  password: document.querySelector("#password"),
  email: document.querySelector("#email"),
  submit: document.querySelector("#submitUserInfo"),
  emailError: document.querySelector("#emailError"),
  passwordError: document.querySelector("#passwordError"),
  globalError: document.querySelector("#globalError"),
};

/*/ Fonction pour valider un email en utilisant une expression régulière /*/
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/*/ Événement pour le bouton de soumission du formulaire /*/
let boutonLogin = element.submit.addEventListener("click", (a) => {
  a.preventDefault();

  /*/ Réinitialisation des messages d'erreur /*/
  element.emailError.textContent = "";
  element.passwordError.textContent = "";
  element.globalError.textContent = "";

  /*/ Vérification de la présence de l'email /*/
  if (!element.email.value.trim()) {
    element.emailError.textContent = "Veuillez fournir un e-mail.";
    element.emailError.classList.add("error-message");
    return;
  }

  /*/ Vérification de la validité de l'email /*/
  if (!isValidEmail(element.email.value)) {
    element.emailError.textContent = "Veuillez fournir un e-mail valide.";
    element.emailError.classList.add("error-message");
    return;
  }

  /*/ Vérification de la présence du mot de passe /*/
  if (!element.password.value.trim()) {
    element.passwordError.textContent = "Mot de passe vide.";
    element.passwordError.classList.add("error-message");
    return;
  }

  /*/ Appel de l'API pour la connexion de l'utilisateur /*/
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: element.email.value,
      password: element.password.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      /*/ Gestion des réponses de l'API /*/
      if (data.message || data.error) {
        if (data.error === "Invalid email") {
          element.emailError.textContent = "L'e-mail est incorrect.";
        } else if (data.error === "Invalid password") {
          element.passwordError.textContent = "Le mot de passe est incorrect.";
        } else {
          element.globalError.textContent =
            "Erreur dans l'identifiant ou le mot de passe";
          element.globalError.classList.add("error-message");
        }
      } else {
        /*/ Stockage des informations de connexion et redirection /*/
        sessionStorage.setItem("Token", data.token);
        sessionStorage.setItem("isConnected", JSON.stringify(true));
        window.location.replace("index.html");
      }
    });
});
