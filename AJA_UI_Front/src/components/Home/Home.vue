<template>
  <div class="home">
    <!-- NAVBAR -->
    <header class="navbar">
      <div class="logo">
        <img src="../../assets/aja_logo.png" alt="Logo AJA" class="logo-img" />
      </div>
      <a href="#contact" class="contact-button">
        <i class="fas fa-envelope"></i>
        Contáctanos
      </a>
    </header>

    <!-- INTRO -->
    <section class="intro-section">
      <h1>Creando excelencia digital</h1>
      <p>
        Creamos experiencias web profesionales, seguras y hermosas. Explora
        nuestro trabajo para ver cómo podemos ayudarte.
      </p>
    </section>

    <!-- ACERCA DE -->
    <section class="about-section">
      <h2 class="scroll-animate">Acerca de AJA</h2>
      <p class="scroll-animate">
        Dedicados a ofrecer productos digitales de primer nivel con un enfoque
        en la seguridad, el rendimiento y el diseño centrado en el usuario.
      </p>

      <div class="cards-container">
        <div class="card scroll-animate-left">
          <h3>Nuestra Misión</h3>
          <p>
            Empoderar a las empresas a través de tecnología innovadora, creando
            soluciones digitales que impulsen el crecimiento y el éxito.
          </p>
        </div>
        <div class="card scroll-animate-right">
          <h3>Nuestra Visión</h3>
          <p>
            Ser una agencia digital líder reconocida por nuestra creatividad,
            confiabilidad y compromiso con la excelencia.
          </p>
        </div>
      </div>
    </section>

    <!-- EQUIPO -->
    <section class="team-section">
      <h2 class="scroll-animate">Nuestro Equipo</h2>
      <div class="team-grid">
        <div class="member scroll-animate-scale">
          <div class="avatar">100 × 100</div>
          <h4>Alexander Aguilar</h4>
          <p>Founder & co-CEO</p>
        </div>
        <div class="member scroll-animate-scale">
          <div class="avatar">100 × 100</div>
          <h4>Javier Vargas</h4>
          <p>CEO & Founder</p>
        </div>
        <div class="member scroll-animate-scale">
          <div class="avatar">100 × 100</div>
          <h4>Alessandro Gonzalez</h4>
          <p>Founder & co-CEO</p>
        </div>
      </div>
    </section>

    <!-- CONTACTO -->
    <section class="contact-section" id="contact">
      <h2 class="scroll-animate">Ponte en contacto</h2>
      <p class="scroll-animate">
        ¿Tienes un proyecto en mente? Nos encantaría saber de usted.
        Construyamos algo increíble juntos.
      </p>
      <div class="contact-info">
        <div class="scroll-animate">
          <i class="fas fa-envelope"></i> ajacompany2025@gmail.com
        </div>
        <div class="scroll-animate">
          <i class="fas fa-phone-alt"></i> +506 6472 1064
        </div>
      </div>
    </section>

    <ProjectsPortfolio />

    <!-- FOOTER -->
    <footer class="footer scroll-animate">
      © 2025 AJA. All rights reserved.
    </footer>
  </div>
</template>

<script>
import ProjectsPortfolio from "../Home/MostrarProyectos.vue";

export default {
  components: {
    ProjectsPortfolio,
  },
  mounted() {
    this.initScrollAnimations();
  },
  methods: {
    initScrollAnimations() {
      // Configurar el Intersection Observer
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      }, observerOptions);

      // Observar todos los elementos con clases de animación
      const animatedElements = document.querySelectorAll(
        ".scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale"
      );

      animatedElements.forEach((el) => {
        observer.observe(el);
      });
    },
  },
};
</script>

<!-- Home.vue -->
<style scoped>
/* =============================================
   1.  PALETA AJA Y VARIABLES GLOBALES
   ============================================= */
:global(:root) {
  /* BRAND SCALE */
  --brand-50: #eff6ff;
  --brand-100: #dbeafe;
  --brand-200: #bfdbfe;
  --brand-300: #93c5fd;
  --brand-400: #60a5fa; /* Light */
  --brand-500: #3b82f6; /* Primary */
  --brand-600: #2563eb; /* Hover / Dark */
  --brand-700: #1d4ed8;
  --brand-900: #0b1e47;

  /* UTILITARIOS */
  --accent-color: #fbbf24;
  --success-color: #10b981;

  --primary-color: var(--brand-500);
  --secondary-color: var(--brand-400);

  /* FONDOS */
  --bg-primary: #ffffff;
  --bg-secondary: var(--brand-50);
  --bg-dark: var(--brand-900);

  /* SOMBRAS & RADIOS */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --border-radius: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* GRADIENTES CONSISTENTES */
  --gradient-primary: linear-gradient(
    135deg,
    var(--brand-400) 0%,
    var(--brand-600) 100%
  );
  --gradient-secondary: linear-gradient(
    135deg,
    var(--brand-400) 0%,
    var(--brand-500) 50%,
    var(--brand-700) 100%
  );
  --gradient-tertiary: linear-gradient(
    135deg,
    var(--brand-500) 0%,
    var(--brand-600) 50%,
    var(--brand-700) 100%
  );

  /* TEXTOS */
  --text-primary: var(--brand-900);
  --text-secondary: #64748b;
}

/* =============================================
   2.  RESET BÁSICO
   ============================================= */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* =============================================
   3.  LAYOUT GENERAL
   ============================================= */
.home {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
}

/* =============================================
   4.  NAVBAR
   ============================================= */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  /* 1️⃣  Fondo semitransparente */
  background: rgba(255, 255, 255, 0.65); /* <‑‑ alfa ≈ 65 % */

  /* 2️⃣  Desenfoque */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px); /* Safari / iOS */

  /* 3️⃣  Detalles existentes */
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  transition: var(--transition);
}
.navbar:hover {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-lg);
}
.logo-img {
  height: 45px;
  width: auto;
  transition: var(--transition);
}
.logo-img:hover {
  transform: scale(1.05);
}

.contact-button {
  background: var(--gradient-primary);
  color: #fff;
  padding: 12px 24px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}
.contact-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}
.contact-button:hover::before {
  left: 100%;
}
.contact-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* =============================================
   5.  HERO / INTRO
   ============================================= */
.intro-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: var(--gradient-primary);
  color: #fff;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}
.intro-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(59, 130, 246, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(59, 130, 246, 0.2) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 40%,
      rgba(96, 165, 250, 0.2) 0%,
      transparent 50%
    );
  animation: float 20s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(1deg);
  }
  66% {
    transform: translateY(-20px) rotate(-1deg);
  }
}
.intro-section h1 {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: slideInUp 1s ease-out;
}
.intro-section p {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  max-width: 600px;
  opacity: 0.9;
  animation: slideInUp 1s ease-out 0.2s both;
}
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =============================================
   6.  SCROLL ANIMATIONS (GENÉRICAS)
   ============================================= */
.scroll-animate,
.scroll-animate-left,
.scroll-animate-right,
.scroll-animate-scale {
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.scroll-animate {
  transform: translateY(50px);
}
.scroll-animate-left {
  transform: translateX(-50px);
}
.scroll-animate-right {
  transform: translateX(50px);
}
.scroll-animate-scale {
  transform: scale(0.8);
}

.scroll-animate.animate-in,
.scroll-animate-left.animate-in,
.scroll-animate-right.animate-in,
.scroll-animate-scale.animate-in {
  opacity: 1;
  transform: none;
}

/* Stagger  */
.scroll-animate:nth-child(1) {
  transition-delay: 0.1s;
}
.scroll-animate:nth-child(2) {
  transition-delay: 0.2s;
}
.scroll-animate:nth-child(3) {
  transition-delay: 0.3s;
}
.scroll-animate:nth-child(4) {
  transition-delay: 0.4s;
}
.scroll-animate:nth-child(5) {
  transition-delay: 0.5s;
}

/* =============================================
   7.  ABOUT
   ============================================= */
.about-section {
  padding: 5rem 2rem;
  background: var(--bg-secondary);
  text-align: center;
}
.about-section h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.about-section > p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.8;
}
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}
.card {
  background: #fff;
  padding: 2.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
}
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-secondary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.card:hover::before {
  transform: scaleX(1);
}
.card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-xl);
}
.card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.card p {
  color: var(--text-secondary);
  line-height: 1.7;
}

/* =============================================
   8.  TEAM
   ============================================= */
.team-section {
  padding: 5rem 2rem;
  background: #fff;
  text-align: center;
}
.team-section h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 3rem;
  background: var(--gradient-tertiary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}
.member {
  background: #fff;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
}
.member::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 4px;
  background: var(--gradient-primary);
  transition: width 0.3s ease;
}
.member:hover::before {
  width: 100%;
}
.member:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}
.avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-secondary);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
  transition: var(--transition);
}
.avatar::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}
.member:hover .avatar::before {
  transform: translateX(100%);
}
.member h4 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.member p {
  color: var(--text-secondary);
  font-weight: 500;
}

/* =============================================
   9.  CONTACT
   ============================================= */
.contact-section {
  padding: 5rem 2rem;
  background: var(--bg-dark);
  color: #fff;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.contact-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
      circle at 25% 25%,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 70%
    ),
    radial-gradient(
      circle at 75% 75%,
      rgba(96, 165, 250, 0.1) 0%,
      transparent 70%
    );
}
.contact-section h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}
.contact-section > p {
  font-size: 1.2rem;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.8;
  position: relative;
  z-index: 1;
}
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.contact-info > div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: var(--transition);
}
.contact-info > div:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}
.contact-info i {
  font-size: 1.2rem;
  color: var(--brand-400);
}

/* =============================================
   10.  FOOTER
   ============================================= */
.footer {
  background: #000;
  color: #fff;
  text-align: center;
  padding: 2rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* =============================================
   11.  RESPONSIVE
   ============================================= */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  .contact-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  .intro-section {
    padding: 1rem;
  }
  .about-section,
  .team-section,
  .contact-section {
    padding: 3rem 1rem;
  }
  .cards-container,
  .team-grid {
    gap: 1.5rem;
  }
  .card,
  .member {
    padding: 1.5rem;
  }
}
@media (max-width: 480px) {
  .contact-info {
    flex-direction: column;
  }
  .contact-info > div {
    justify-content: flex-start;
  }
}

/* =============================================
   12.  EXTRAS (Animaciones, Accesibilidad)
   ============================================= */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
.logo-img {
  animation: pulse 3s ease-in-out infinite;
}

.intro-section {
  background-attachment: fixed;
}
html {
  scroll-behavior: smooth;
}

/* reduces‑motion override */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .scroll-animate,
  .scroll-animate-left,
  .scroll-animate-right,
  .scroll-animate-scale {
    opacity: 1 !important;
    transform: none !important;
  }
}

/* focus rings */
.contact-button:focus,
.card:focus,
.member:focus {
  outline: 2px solid var(--brand-500);
  outline-offset: 2px;
}
</style>
