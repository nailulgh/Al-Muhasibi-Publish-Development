/*
  SCRIPT.JS (Versi Final)
  File ini menangani semua fungsionalitas interaktif untuk seluruh situs.
*/

// Menjalankan semua fungsi setelah konten halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // 1. Inisialisasi Feather Icons
  try {
    feather.replace();
  } catch (e) {
    console.error("Feather Icons tidak dapat dimuat.", e);
  }

  // 2. Logika untuk Menu Mobile
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    const menuIcon = mobileMenuButton.querySelector("i");
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      const isHidden = mobileMenu.classList.contains("hidden");
      menuIcon.setAttribute("data-feather", isHidden ? "menu" : "x");
      feather.replace();
    });
  }

  // 3. Logika untuk Dark Mode Toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const sunIcon = document.getElementById("theme-toggle-sun");
    const moonIcon = document.getElementById("theme-toggle-moon");

    const applyTheme = (theme) => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        if (sunIcon) sunIcon.classList.remove("hidden");
        if (moonIcon) moonIcon.classList.add("hidden");
      } else {
        document.documentElement.classList.remove("dark");
        if (sunIcon) sunIcon.classList.add("hidden");
        if (moonIcon) moonIcon.classList.remove("hidden");
      }
    };

    const currentTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    applyTheme(currentTheme);

    themeToggle.addEventListener("click", () => {
      const newTheme = document.documentElement.classList.contains("dark")
        ? "light"
        : "dark";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    });
  }

  // 4. Inisialisasi Animasi Saat Scroll (AOS)
  try {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  } catch (e) {
    console.error("AOS tidak dapat dimuat.", e);
  }

  // 5. Efek Ripple pada Tombol
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const x = e.clientX - e.target.offsetLeft;
      const y = e.clientY - e.target.offsetTop;
      const ripples = document.createElement("span");
      ripples.classList.add("ripple");
      ripples.style.left = x + "px";
      ripples.style.top = y + "px";
      this.appendChild(ripples);
      setTimeout(() => {
        ripples.remove();
      }, 600);
    });
  });

  // 6. Penanganan Link Navigasi Aktif
  const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split("/").pop();
    const desktopLinks = document.querySelectorAll("#desktop-nav .nav-link");
    const mobileLinks = document.querySelectorAll(
      "#mobile-menu .nav-link-mobile"
    );

    const updateLinks = (links) => {
      links.forEach((link) => {
        const linkPage = link
          .getAttribute("href")
          .split("/")
          .pop()
          .split("#")[0];
        link.classList.remove("active");

        if (
          (currentPage === "" || currentPage === "index.html") &&
          (linkPage === "" || linkPage === "index.html")
        ) {
          link.classList.add("active");
        } else if (linkPage !== "" && linkPage === currentPage) {
          link.classList.add("active");
        }
      });
    };

    updateLinks(desktopLinks);
    updateLinks(mobileLinks);
  };
  setActiveNavLink();

  // 7. Logika untuk Tombol "Selengkapnya" dengan Animasi Elegan
  const togglePengurusBtn = document.getElementById("tombol-selengkapnya");
  const pengurusTambahan = document.getElementById("pengurus-tambahan");

  if (togglePengurusBtn && pengurusTambahan) {
    const btnSpan = togglePengurusBtn.querySelector("span");
    const btnIcon = togglePengurusBtn.querySelector("i");

    togglePengurusBtn.addEventListener("click", () => {
      const isExpanded =
        pengurusTambahan.style.maxHeight &&
        pengurusTambahan.style.maxHeight !== "0px";

      if (!isExpanded) {
        // Buka panel dengan animasi
        pengurusTambahan.style.maxHeight = pengurusTambahan.scrollHeight + "px";
        if (btnSpan) btnSpan.textContent = "Tutup";
        if (btnIcon) btnIcon.style.transform = "rotate(180deg)";
      } else {
        // Tutup panel dengan animasi
        pengurusTambahan.style.maxHeight = null;
        if (btnSpan) btnSpan.textContent = "Selengkapnya";
        if (btnIcon) btnIcon.style.transform = "rotate(0deg)";
      }
    });
  }
});
/* ... (kode document.addEventListener Anda di atas) ... */

// =======================================================
// FUNGSI BARU: Untuk membuka dan menutup modal pengurus
// =======================================================
const modal = document.getElementById("modal-pengurus");

function bukaModalPengurus(element) {
  if (!modal) return;

  // Ambil data dari atribut data-*
  const nama = element.dataset.nama;
  const jabatan = element.dataset.jabatan;
  const asal = element.dataset.asal;
  const jurusan = element.dataset.jurusan;
  const devisi = element.dataset.devisi;
  const foto = element.dataset.foto;

  // Masukkan data ke dalam elemen modal
  document.getElementById("modal-nama").textContent = nama;
  document.getElementById("modal-jabatan").textContent = jabatan;
  document.getElementById("modal-asal").textContent = asal;
  document.getElementById("modal-jurusan").textContent = jurusan;
  document.getElementById("modal-devisi").textContent = devisi;
  document.getElementById("modal-foto").src = foto;

  // Tampilkan modal
  modal.classList.add("active");
}

function tutupModalPengurus() {
  if (!modal) return;
  modal.classList.remove("active");
}

// Menutup modal saat mengklik area gelap di sekitarnya
if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      tutupModalPengurus();
    }
  });
}
