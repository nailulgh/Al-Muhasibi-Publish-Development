// Mengambil elemen-elemen untuk animasi geser
const container = document.getElementById("container");
const signInForm = document.querySelector('.sign-in');


// Logika untuk Show/Hide Password
const togglePasswordButtons = document.querySelectorAll(".toggle-password");

togglePasswordButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Cari input password yang berada di dalam container yang sama
    const passwordInput = button.previousElementSibling;

    // Cek tipe input saat ini dan ubah
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Ganti ikon mata
    button.classList.toggle("fa-eye-slash");
    button.classList.toggle("fa-eye");
  });
});
