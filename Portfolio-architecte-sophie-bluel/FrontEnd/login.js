//Cette ligne sélectionne l'élément du DOM avec l'ID "loginForm". Formulaire de connexion que l'utilisateur remplit
document.querySelector("#loginForm").addEventListener("submit", async function(event) { 
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  if (email && password) {
    const data = {
      email,
      password
    };

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();

        if (result.token) {
          localStorage.setItem("jwtToken", result.token);
          window.location.href = "index.html";
          
        } else {
          alert("Identifiants incorrects. Veuillez réessayer.");
        }
      } else {
        throw new Error("Une erreur est survenue lors de la connexion.");
      }
    } catch (error) {
      alert(error.message);
    }
  } else {
    alert("Veuillez remplir tous les champs.");
  }
});

















  



 

