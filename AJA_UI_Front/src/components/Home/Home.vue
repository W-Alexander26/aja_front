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
      <h2>Acerca de AJA</h2>
      <p>
        Dedicados a ofrecer productos digitales de primer nivel con un enfoque
        en la seguridad, el rendimiento y el diseño centrado en el usuario.
      </p>

      <div class="cards-container">
        <div class="card">
          <h3>Nuestra Misión</h3>
          <p>
            Empoderar a las empresas a través de tecnología innovadora, creando
            soluciones digitales que impulsen el crecimiento y el éxito.
          </p>
        </div>
        <div class="card">
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
      <h2>Nuestro Equipo</h2>
      <div class="team-grid">
        <div class="member">
          <div class="avatar">100 × 100</div>
          <h4>Alexander Aguilar</h4>
          <p>Founder & co-CEO</p>
        </div>
        <div class="member">
          <div class="avatar">100 × 100</div>
          <h4>Javier Vargas</h4>
          <p>CEO & Founder</p>
        </div>
        <div class="member">
          <div class="avatar">100 × 100</div>
          <h4>Alessandro Gonzalez</h4>
          <p>Founder & co-CEO</p>
        </div>
      </div>
    </section>

    <!-- CONTACTO -->
    <section class="contact-section" id="contact">
      <h2>Ponte en contacto</h2>
      <p>
        ¿Tienes un proyecto en mente? Nos encantaría saber de usted.
        Construyamos algo increíble juntos.
      </p>
      <div class="contact-info">
        <div><i class="fas fa-envelope"></i> ajacompany2025@gmail.com</div>
        <div><i class="fas fa-phone-alt"></i> +506 6472 1064</div>
      </div>
    </section>

    <ProjectsPortfolio />

    <!-- FOOTER -->
    <footer class="footer">© 2025 AJA. All rights reserved.</footer>
  </div>
</template>

<script>
import ProjectsPortfolio from "../Home/MostrarProyectos.vue";

export default {
  components: {
    ProjectsPortfolio,
  },
};
// No JS aún, solo HTML y estilos
</script>

<style scoped>
/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6); /* Fondo semitransparente */
  backdrop-filter: blur(10px); /* Aplica el desenfoque */
  padding: 16px 40px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 999;
}

.logo {
  font-size: 1.4rem;
  font-weight: bold;
  color: #3b82f6;
}

.contact-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #3b82f6;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.contact-button:hover {
  background-color: #2563eb;
}

/* General Page */
.home {
  font-family: Arial, sans-serif;
  background-color: #f6f9fc;
  color: #111827;
  text-align: center;
}

/* Intro */
/* .intro-section {
  padding: 80px 20px;
} */

.intro-section h1 {
  font-size: 3rem;
  color: #3b82f6;
  margin-bottom: 5vh;
}

.intro-section p {
  max-width: 600px;
  margin: 0 auto 60px;
  font-size: 1.1rem;
  color: #4b5563;
}

/* Acerca de */
/* .about-section {
  padding: 80px 20px;
} */

.about-section h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.about-section p {
  max-width: 600px;
  margin: 0 auto 12vh;
  color: #4b5563;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 10vw;
  flex-wrap: wrap;
  margin-bottom: 10vh;
}

.card {
  background-color: white;
  padding: 30px;
  max-width: 550px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.card h3 {
  margin-bottom: 10px;
}

.card p {
  color: #4b5563;
}

/* Equipo */
/* .team-section {
  padding: 80px 20px;
} */

.team-section h2 {
  font-size: 2.5rem;
  margin-bottom: 40px;
}

.team-grid {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.member {
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  background-color: #e5e7eb;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px;
  font-size: 0.9rem;
  border: 1px solid #cbd5e1;
}

.member h4 {
  margin-bottom: 4px;
}

.member p {
  color: #6b7280;
}

/* Contacto */
.contact-section {
  background-color: white;
  padding: 2vw 20px 2vw 5px;
}

.contact-section h2 {
  font-size: 2.5rem;
  margin-bottom: 40px;
}

.contact-section p {
  max-width: 18vw;
  margin: 0 auto 40px;
  color: #4b5563;
}

.contact-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
  font-size: 1rem;
}

/* Footer */
.footer {
  padding: 20px;
  font-size: 0.9rem;
  color: #9ca3af;
}

/* .intro-section,
.about-section,
.team-section,
.contact-section {
  padding: 60px 0; 
} */
</style>
