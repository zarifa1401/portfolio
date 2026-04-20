const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const typingText = document.getElementById("typing-text");
const progressBar = document.getElementById("scroll-progress");
const revealItems = document.querySelectorAll(".reveal");
const skillBars = document.querySelectorAll(".skill-bar span");
const modal = document.getElementById("project-modal");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalPreview = document.getElementById("modal-preview");
const modalTags = document.getElementById("modal-tags");
const contactButton = document.getElementById("contact-button");

const projectData = {
  countries: {
    title: "Countries Explorer",
    description: "A country explorer app that lets users search countries, filter by region, sort by population, and switch themes in a responsive interface.",
    previewClass: "gradient-one",
    tags: ["Search", "Region Filters", "Sorting", "Theme Toggle"],
    previewMarkup: `
      <img class="modal-image" src="assets/countries-explorer-preview.svg" alt="Countries Explorer preview">
    `,
    repo: "https://github.com/zarifa1401/countries-explorer"
  },
  movies: {
    title: "Movie Watchlist",
    description: "A movie watchlist app where users can add titles, choose genres, track watched status, filter lists, and manage a simple summary of their movies.",
    previewClass: "gradient-two",
    tags: ["Add Movies", "Status Filters", "Summary Cards", "Dark UI"],
    previewMarkup: `
      <img class="modal-image" src="assets/movie-watchlist-preview.svg" alt="Movie Watchlist preview">
    `,
    repo: "https://github.com/zarifa1401/Movie-List"
  },
  proverbs: {
    title: "Afghan Proverbs",
    description: "A searchable collection of Afghan proverbs that presents English meaning, native text, and cultural context in a clean card-based layout.",
    previewClass: "gradient-three",
    tags: ["Search Interface", "Cards", "Bilingual Content", "Cultural Archive"],
    previewMarkup: `
      <img class="modal-image" src="assets/afghan-proverbs-preview.svg" alt="Afghan Proverbs preview">
    `,
    repo: "https://github.com/zarifa1401/Afghan-proverbs"
  }
};

const typingWords = [
  "a Frontend Developer.",
  "building modern UI.",
  "creating responsive websites.",
  "bringing interfaces to life."
];

let typingWordIndex = 0;
let typingCharIndex = 0;
let isDeleting = false;

function applySavedTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
  }
}

function toggleTheme() {
  body.classList.toggle("light-mode");
  const activeTheme = body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("portfolio-theme", activeTheme);
}

function toggleMenu() {
  const expanded = menuToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(expanded));
}

function closeMenu() {
  menuToggle.classList.remove("active");
  navMenu.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
}

function runTypingEffect() {
  const currentWord = typingWords[typingWordIndex];
  const displayedText = isDeleting
    ? currentWord.slice(0, typingCharIndex--)
    : currentWord.slice(0, typingCharIndex++);

  typingText.textContent = displayedText;

  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && typingCharIndex === currentWord.length + 1) {
    delay = 1300;
    isDeleting = true;
  } else if (isDeleting && typingCharIndex === 0) {
    isDeleting = false;
    typingWordIndex = (typingWordIndex + 1) % typingWords.length;
    delay = 300;
  }

  window.setTimeout(runTypingEffect, delay);
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function createRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");

      if (entry.target.id === "skills") {
        skillBars.forEach((bar) => {
          bar.style.width = bar.dataset.width;
        });
      }

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  revealItems.forEach((item) => observer.observe(item));
}

function openModal(projectKey) {
  const project = projectData[projectKey];
  if (!project) {
    return;
  }

  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalPreview.className = `modal-preview ${project.previewClass}`;
  modalPreview.innerHTML = project.previewMarkup;
  modalTags.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("") +
    `<a class="modal-repo" href="${project.repo}" target="_blank" rel="noreferrer">View Repository</a>`;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
}

function initProjectButtons() {
  document.querySelectorAll(".project-link").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.project));
  });
}

function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  const particles = [];
  const particleCount = 80;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35
    };
  }

  function populateParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push(createParticle());
    }
  }

  function particleColor() {
    return body.classList.contains("light-mode")
      ? "rgba(54, 102, 246, 0.35)"
      : "rgba(121, 168, 255, 0.4)";
  }

  function lineColor() {
    return body.classList.contains("light-mode")
      ? "rgba(14, 165, 164, 0.18)"
      : "rgba(91, 231, 196, 0.16)";
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor();
      ctx.fill();

      for (let j = index + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = lineColor();
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  populateParticles();
  animateParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    populateParticles();
  });
}

function initContactButton() {
  if (!contactButton) {
    return;
  }

  contactButton.addEventListener("click", () => {
    contactButton.textContent = "Thanks! Replace this with your real form or mail link.";
    contactButton.disabled = true;
  });
}

applySavedTheme();
runTypingEffect();
createRevealObserver();
updateScrollProgress();
initProjectButtons();
initParticles();
initContactButton();

themeToggle.addEventListener("click", toggleTheme);
menuToggle.addEventListener("click", toggleMenu);
window.addEventListener("scroll", updateScrollProgress);
modalOverlay.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});
