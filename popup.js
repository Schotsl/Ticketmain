document.addEventListener('DOMContentLoaded', function () {
  const img = document.getElementById("ticketmain_img");
  const body = document.getElementById("ticketmain_body");

  img.addEventListener("click", () => {
    img.classList.toggle('disabled');
    body.classList.toggle('disabled');
  });
});