<template>
  <section class="team-section">
    <h2 class="scroll-animate">Nuestro Equipo</h2>

    <p v-if="loading">Cargando equipo…</p>
    <p v-else-if="filteredUsers.length === 0">
      Aún no hay miembros visibles.
    </p>

    <div v-else class="team-grid">
      <div
        v-for="u in filteredUsers"
        :key="u.id"
        class="member scroll-animate-scale"
      >
        <!-- AVATAR -->
        <div class="avatar">
          <img v-if="isValidUrl(u.img)" :src="u.img" :alt="u.username" />
          <span v-else>{{ u.siglas || getInitials(u.username) }}</span>
        </div>

        <div class="member-info">
          <h4>{{ u.username }}</h4>
          <p class="puesto">{{ u.puestos || 'Miembro del equipo' }}</p>
        </div>

        <!-- SKILLS con diseño mejorado -->
        <div class="skills-container">
          <div v-if="u.skills && u.skills.length" class="skills-content">
            <h5 class="skills-title">
              <span class="skills-icon"></span>
              Skills
            </h5>
            <div class="skills-tags">
              <span 
                v-for="(skill, index) in u.skills" 
                :key="index"
                class="skill-tag"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                {{ skill }}
              </span>
            </div>
          </div>
          <div v-else class="no-skills">
            <span class="no-skills-text">Especialista versátil</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { obtener } from '@/components/Services/service';

export default {
  name: 'TeamSection',
  data() {
    return {
      users: [],
      loading: true,
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((u) => u.mostrar && u.activos);
    },
  },
  methods: {
    async obtener() {
      try {
        const res = await obtener(
          import.meta.env.VITE_API_AUTH,
          'api/users',
          'data',
        );
        const data = Array.isArray(res) ? res : res.data ?? [];
        this.users = data
          .filter((u) => u.activos && u.mostrar)
          .sort((a, b) => (a.displayOrder ?? 99999) - (b.displayOrder ?? 99999));
      } catch (err) {
        console.error('Error cargando usuarios:', err);
      } finally {
        this.loading = false;
      }
    },
    getInitials(name = '') {
      return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
    },
    isValidUrl(str) {
      if (!str || typeof str !== 'string') return false;
      try {
        const u = new URL(str);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch {
        return false;
      }
    },
  },
  mounted() {
    this.obtener();
  },
};
</script>

<style>
/* =============================================
   TEAM SECTION
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

/* ==== CARD con estructura mejorada ==== */
.member {
  background: #fff;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 300px;
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

.team-section .member:hover::before { 
  width: 100%; 
}

.team-section .member:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

/* ==== AVATAR ==== */
.avatar {
  width: 90px;
  height: 90px;
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
  transition: var(--transition, all .25s ease);
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.member:hover .avatar::before { 
  transform: translateX(100%); 
}

/* ==== INFORMACIÓN BÁSICA ==== */
.member-info {
  flex-shrink: 0;
  margin-bottom: 1.5rem;
}

.member h4 {
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.puesto {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0;
}

/* ==== CONTENEDOR DE SKILLS ==== */
.skills-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: auto;
}

.skills-content {
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.4s ease;
  max-height: 0;
  overflow: hidden;
  visibility: hidden;
}

.team-section .member:hover .skills-content {
  opacity: 1 !important;
  transform: translateY(0) !important;
  max-height: 200px !important;
  visibility: visible !important;
}

/* ==== TÍTULO DE SKILLS ==== */
.skills-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #4a5568;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.skills-icon {
  font-size: 1rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: pulse 2s infinite;
}

/* ==== TAGS DE SKILLS ==== */
.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  align-items: flex-start;
  min-height: 60px;
}

.skill-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  animation: skillAppear 0.5s ease forwards;
  position: relative;
  overflow: hidden;
}

.skill-tag::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s ease;
}

.member:hover .skill-tag {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.member:hover .skill-tag::before {
  left: 100%;
}

/* ==== ESTADO SIN SKILLS ==== */
.no-skills {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.4s ease;
  max-height: 0;
  overflow: hidden;
  visibility: hidden;
}

.team-section .member:hover .no-skills {
  opacity: 1 !important;
  transform: translateY(0) !important;
  max-height: 200px !important;
  visibility: visible !important;
}

.no-skills-text {
  color: var(--text-secondary);
  font-style: italic;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  background: #f7fafc;
  transition: all 0.3s ease;
}

.member:hover .no-skills-text {
  border-color: #cbd5e0;
  background: #edf2f7;
  transform: scale(1.02);
}

/* =============================================
   ANIMACIONES
   ============================================= */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes skillAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* =============================================
   RESPONSIVE
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
  .team-section {
    padding: 3rem 1rem;
  }
  .footer-section {
    padding: 3rem 1rem 2rem;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 400px;
  }
  
  .member {
    padding: 1.5rem;
    min-height: 320px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .skills-tags {
    gap: 0.4rem;
  }
  
  .skill-tag {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
  }
  
  .contact-info {
    max-width: 100%;
  }
  .contact-info > div {
    padding: 1rem 1.5rem;
    justify-content: flex-start;
  }
  .social-icons a {
    animation: none !important;
  }
  .contact-info > div::before {
    display: none;
  }
}

@media (max-width: 480px) {
  .skills-tags {
    min-height: 80px;
  }
  
  .member {
    min-height: 340px;
  }
}
</style>