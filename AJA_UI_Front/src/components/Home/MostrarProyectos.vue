<template>
   <div id="app">
        <div class="container">
            <div class="header">
                <h1 class="titulo-de-proyectoss">Nuestros Proyectos</h1>
                <p>Explora nuestra colección de sitios web y aplicaciones desarrolladas</p>
            </div>

            <div class="projects-grid">
                <div 
                    v-for="project in projects" 
                    :key="project.id" 
                    class="project-card"
                >
                    <div class="project-preview">
                        <div class="browser-header">
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                        </div>
                        <div class="preview-content">
                            <div class="preview-icon">📁</div>
                            <small>Vista previa</small>
                        </div>
                    </div>
                    
                    <div class="project-info">
                        <div class="project-header">
                            <div>
                                <div class="project-title">{{ project.nombre }}</div>
                                <div class="project-type">{{ project.descripcion }}</div>
                            </div>
                            <span 
                                class="status-badge"
                                :class="project.estado === true ? 'status-active' : 'status-maintenance'"
                            >
                                {{ project.estado === true ? 'Activo' : 'Mantenimiento' }}
                            </span>
                        </div>
                        
                        <p class="project-description">{{ project.descripcion }}</p>
                        
                        <!-- <div class="project-tags">
                            <span 
                                v-for="tag in project.tags" 
                                :key="tag" 
                                class="tag"
                            >
                                {{ tag }}
                            </span>
                        </div> -->
                        
                        <div class="project-actions">
                            <a 
                                :href="project.link" 
                                target="_blank" 
                                class="btn btn-primary"
                            >
                                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" />
                                    <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
                                </svg>
                                Visitar Sitio
                            </a>
                            <button 
                                class="btn btn-secondary" 
                                @click="openPreview(project)"
                            >
                                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                    <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A11.8 11.8 0 0110 2c4.257 0 7.893 2.66 9.336 6.41.147.381.147.804 0 1.186A11.8 11.8 0 0110 18c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                </svg>
                                Vista Previa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para vista previa con carrusel -->
        <Transition name="fade">
            <div v-if="showModal" class="modal" @click="closeModal">
                <div class="modal-content" @click.stop>
                    <div class="modal-header">
                        <h3 class="modal-title">{{ selectedProject?.nombre }}</h3>
                        <button class="close-btn" @click="closeModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="carousel-container" v-if="selectedProject">
                            <!-- Slides del carrusel -->
                            <div 
                                v-for="(image, index) in selectedProject.archivos" 
                                :key="index"
                                class="carousel-slide"
                                :class="{ active: index === currentSlide }"
                            >
                            <div class="carousel-wrapper">
                                <img class="carousel-image" :src=image alt="imagen">
                            </div>
                                <!-- <div class="image-info">
                                    <h4>{{ image }}</h4>
                                    <p>{{ image }}</p>
                                </div> -->
                            </div>
                            
                            <!-- Controles del carrusel (solo si hay más de 1 imagen) -->
                            <template v-if="selectedProject.archivos.length > 1">
                                <button class="carousel-nav carousel-prev" @click="prevSlide">‹</button>
                                <button class="carousel-nav carousel-next" @click="nextSlide">›</button>
                                
                                <div class="carousel-counter">
                                    {{ currentSlide + 1 }} / {{ selectedProject.archivos.length }}
                                </div>
                                
                                <div class="carousel-indicators">
                                    <div 
                                        v-for="(image, index) in selectedProject.images"
                                        :key="index"
                                        class="carousel-dot"
                                        :class="{ active: index === currentSlide }"
                                        @click="goToSlide(index)"
                                    ></div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { obtener } from '../Services/service';
import Cookies from 'js-cookie';

export default {
  name: 'ProjectsPortfolio',
  data() {
    return {
      projects: ""
    }
  },
 methods: {
    async obtenerProyectos(){
        const token = Cookies.get('UTC');
        const url = import.meta.env.VITE_API_BACK;
        const proyectos = await obtener(url, 'proyectos', {}, token)
        this.projects = proyectos;
        console.log(proyectos);
    
    },  
  },
  mounted (){

    this.obtenerProyectos()
  },

    
  
  emits: [
    'project-visit',
    'project-preview',
    'refresh-projects',
    'custom-action'
  ],
  
  setup(props, { emit }) {
    // Estado del modal y carrusel
    const showModal = ref(false)
    const selectedProject = ref(null)
    const currentSlide = ref(0)
    
    // Métodos para el modal
    const openPreview = (project) => {
        console.log("dldll");
        
        console.log(project);
        
      selectedProject.value = project      
      currentSlide.value = 0
      showModal.value = true
      document.body.style.overflow = 'hidden'
      emit('project-preview', project)
    }
    
    const closeModal = () => {
      showModal.value = false
      selectedProject.value = null
      currentSlide.value = 0
      document.body.style.overflow = 'auto'
    }
    
    // Métodos del carrusel
    const nextSlide = () => {
      if (selectedProject.value && currentSlide.value < selectedProject.value.archivos.length - 1) {
        currentSlide.value++
      } else {
        currentSlide.value = 0
      }
    }
    
    const prevSlide = () => {
      if (selectedProject.value && currentSlide.value > 0) {
        currentSlide.value--
      } else if (selectedProject.value) {
        currentSlide.value = selectedProject.value.archivos.length - 1
      }
    }
    
    const goToSlide = (index) => {
      currentSlide.value = index
    }
    
    // Métodos utilitarios
    const getStatusClass = (status) => {
      const statusMap = {
        'active': 'status-active',
        'maintenance': 'status-maintenance',
        'disabled': 'status-disabled',
        'draft': 'status-draft'
      }
      return statusMap[status] || 'status-default'
    }
    
    const getStatusText = (status) => {
      const statusMap = {
        'active': 'Activo',
        'maintenance': 'Mantenimiento',
        'disabled': 'Deshabilitado',
        'draft': 'Borrador'
      }
      return statusMap[status] || status
    }
    
    const isImageUrl = (src) => {
      return typeof src === 'string' && (
        src.startsWith('http') || 
        src.startsWith('/') || 
        src.startsWith('data:image')
      )
    }
    
    const handleImageError = (event) => {
      console.warn('Error cargando imagen:', event.target.src)
      event.target.style.display = 'none'
    }
    
    // Handlers de eventos
    const handleVisitClick = (project) => {
      emit('project-visit', project)
    }
    
    const refreshProjects = () => {
      emit('refresh-projects')
    }
    
    // Manejo de teclado
    const handleKeydown = (event) => {
      if (!showModal.value) return
      
      if (event.key === 'Escape') {
        closeModal()
      } else if (event.key === 'ArrowLeft' && selectedProject.value && selectedProject.value.archivos.length > 1) {
        prevSlide()
      } else if (event.key === 'ArrowRight' && selectedProject.value && selectedProject.value.archivos.length > 1) {
        nextSlide()
      }
    }
    
    // Lifecycle hooks
    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
      // Limpiar el overflow del body al desmontar
      document.body.style.overflow = 'auto'
    })
    
    // Watchers
    watch(() => props.projects, (newProjects) => {
      // Cerrar modal si el proyecto seleccionado ya no existe
      if (selectedProject.value && !newProjects.find(p => p.id === selectedProject.value.id)) {
        closeModal()
      }
    }, { deep: true })


    return {
      // Estado
      showModal,
      selectedProject,
      currentSlide,
      
      // Métodos del modal
      openPreview,
      closeModal,
      
      // Métodos del carrusel
      nextSlide,
      prevSlide,
      goToSlide,
      
      // Métodos utilitarios
      getStatusClass,
      getStatusText,
      isImageUrl,
      handleImageError,
      
      // Handlers
      handleVisitClick,
      refreshProjects
    }
  }
}
</script>

<style scoped>
  .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 60px;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 12px;
        }

        .header p {
            font-size: 1.1rem;
            color: #64748b;
            max-width: 600px;
            margin: 0 auto;
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 32px;
        }

        .project-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }

        .project-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
            border-color: #3b82f6;
        }

        .project-preview {
            height: 200px;
            background: #f1f5f9;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }

        .browser-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 36px;
            background: white;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            padding: 0 16px;
            gap: 8px;
        }

        .browser-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #cbd5e1;
        }

        .preview-content {
            margin-top: 36px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: calc(100% - 36px);
            color: #64748b;
        }

        .preview-icon {
            font-size: 2.5rem;
            margin-bottom: 8px;
        }
        

        .project-info {
            padding: 24px;
        }

        .project-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }

        .project-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
            text-align: left;
        }

        .project-type {
            font-size: 0.875rem;
            color: #64748b;
        }

        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-active {
            background: #dcfce7;
            color: #166534;
        }

        .status-maintenance {
            background: #fef3c7;
            color: #92400e;
        }

        .project-description {
            color: #64748b;
            margin-bottom: 20px;
            font-size: 0.95rem;
        }

        .project-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 24px;
        }

        .tag {
            background: #eff6ff;
            color: #1d4ed8;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .project-actions {
            display: flex;
            gap: 12px;
        }

        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border: none;
            cursor: pointer;
        }

        .btn-primary {
            background: #3b82f6;
            color: white;
        }

        .btn-primary:hover {
            background: #2563eb;
        }

        .btn-secondary {
            background: white;
            color: #3b82f6;
            border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
            background: #f8fafc;
            border-color: #3b82f6;
        }

        .icon {
            width: 16px;
            height: 16px;
        }

        .modal {
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            width: 90%;
            max-width: 900px;
            height: 80%;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
            background: white;
            padding: 20px 24px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1e293b;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: #64748b;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .close-btn:hover {
            background: #f1f5f9;
            color: #1e293b;
        }

        .modal-body {
            height: calc(100% - 81px);
            padding: 0;
        }

        .carousel-container {
            position: relative;
            height: 100%;
            overflow: hidden;
        }

        .carousel-slide {
            width: 100%;
            height: 100%;
            position: relative;
            display: none;
        }

        .carousel-slide.active {
            display: block;
        }

        .carousel-wrapper {
            width: 100%;
            height: 100%;
            background: #f1f5f9;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .carousel-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain; /* o cover, depende de lo que quieras */
        }


        .carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.9);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #3b82f6;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .carousel-nav:hover {
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .carousel-prev {
            left: 20px;
        }

        .carousel-next {
            right: 20px;
        }

        .carousel-indicators {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
        }

        .carousel-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .carousel-dot.active {
            background: white;
            transform: scale(1.2);
        }

        .carousel-counter {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .image-info {
            position: absolute;
            bottom: 60px;
            left: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
        }

        .image-info h4 {
            margin: 0 0 4px 0;
            font-size: 1rem;
        }

        .image-info p {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .titulo-de-proyectoss{
            font-family:Verdana, Geneva, Tahoma, sans-serif;
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px 16px;
            }

            .header h1 {
                font-size: 2rem;
            }

            .projects-grid {
                grid-template-columns: 1fr;
                gap: 24px;
            }

            .project-actions {
                flex-direction: column;
            }

            .modal-content {
                width: 95%;
                height: 85%;
            }
        }

        .fade-enter-active, .fade-leave-active {
            transition: opacity 0.3s ease;
        }

        .fade-enter-from, .fade-leave-to {
            opacity: 0;
        }
</style>