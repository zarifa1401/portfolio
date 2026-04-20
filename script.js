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
  nova: {
    title: "Nova Studio Landing Page",
    description: "A conversion-focused landing page for a creative agency, featuring layered gradients, scroll reveals, bold CTA placement, and a visual hierarchy designed to feel premium from the first screen.",
    previewClass: "gradient-one",
    tags: ["Hero Motion", "CTA Design", "Responsive Layout"],
    previewMarkup: `
      <div class="preview-ui preview-ui-site">
        <div class="preview-topbar">
          <span></span><span></span><span></span>
        </div>
        <div class="preview-hero">
          <div class="preview-copy">
            <strong>Nova Studio</strong>
            <p>Designing bold digital launches with clean visuals and smarter conversion paths.</p>
          </div>
          <div class="preview-panel"></div>
        </div>
      </div>
    `
  },
  pulse: {
    title: "Pulse Dashboard Concept",
    description: "A data dashboard interface concept that balances a dark visual system with clean card spacing, metric emphasis, and subtle interaction states for a professional SaaS feel.",
    previewClass: "gradient-two",
    tags: ["Dashboard UI", "Dark Theme", "Component Structure"],
    previewMarkup: `
      <div class="preview-ui preview-ui-dashboard">
        <div class="preview-columns">
          <div class="preview-sidebar"></div>
          <div class="preview-main">
            <div class="preview-metrics">
              <span></span><span></span><span></span>
            </div>
            <div class="preview-chart"></div>
          </div>
        </div>
      </div>
    `
  },
  motion: {
    title: "Motion Portfolio Template",
    description: "A portfolio template built around storytelling, hover transitions, reveal-on-scroll sections, and a high-end visual style suited for developers and designers.",
    previewClass: "gradient-three",
    tags: ["Portfolio UX", "Animations", "Scroll Experience"],
    previewMarkup: `
      <div class="preview-ui preview-ui-portfolio">
        <div class="preview-banner"></div>
        <div class="preview-cards">
          <span></span><span></span><span></span>
        </div>
      </div>
    `
  }
};

const typingWords = [
  "I am a Frontend Developer.",
  "I create modern UI experiences.",
  "I build responsive portfolio websites.",
  "I bring interfaces to life with motion."
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
  modalTags.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");
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
