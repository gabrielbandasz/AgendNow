function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (usuario === "admin" && senha === "1234") {
    alert("Login bem-sucedido!");
  } else {
    alert("Usuário ou senha inválidos!");
  }
}

document.querySelector(".login-btn").addEventListener("click", (e) => {
  e.preventDefault(); // evita ação padrão (ex: reloading)
  login();
});

// Alternância de tema (mantém seu código original)
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  const btn = document.getElementById("toggle-theme");
  btn.textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙";
});