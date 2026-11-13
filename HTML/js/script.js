// Arquivo preparado para as interações do TripPlan.
// Nesta primeira versão, os formulários são apenas visuais.
// Depois vamos conectar as páginas ao Flask e ao banco SQLite.
document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
});