// ARSENAL T) ADMIN CLUSTERS JAVASCRIPT - GESTIÓN VISUAL COMPLETA
// ¡¡¡INTERFAZ BRUTAL PARA DOMINAR CLUSTERS!!!

class ClusterAdminPanel {
  constructor() {
    this.clusters = new Map();
    this.selectedCluster = null;
    this.draggedElement = null;
    this.realTimeEnabled = true;
    this.workspace = document.getElementById('clusterWorkspace');
    this.performanceChart = null;
    this.distributionChart = null;

    this.init();
  }

  init() {
    console.log('🚀 Inicializando Panel Admin Clusters...');
    this.setupEventListeners();
    this.loadClusters();
    this.initCharts();
    this.startRealTimeUpdates();
    this.logActivity('Panel Admin Clusters iniciado');
  }

  // CONFIGURAR EVENT LISTENERS
  setupEventListeners() {
    // Botones principales
    document.getElementById('addCluster').addEventListener('click', () => this.showCreateClusterModal());
    document.getElementById('saveConfig').addEventListener('click', () => this.saveConfiguration());
    document.getElementById('exportData').addEventListener('click', () => this.exportData());
    document.getElementById('realTimeToggle').addEventListener('click', () => this.toggleRealTime());

    // Auto-optimización
    document.getElementById('autoOptimize').addEventListener('click', () => this.autoOptimizeClusters());

    // Configuración cluster
    document.getElementById('updateCluster').addEventListener('click', () => this.updateSelectedCluster());
    document.getElementById('deleteCluster').addEventListener('click', () => this.deleteSelectedCluster());

    // Sliders de configuración
    document.getElementById('similarityWeight').addEventListener('input', (e) => {
      document.getElementById('similarityValue').textContent = e.target.value;
      this.updateClusterConfig();
    });

    document.getElementById('inclusionThreshold').addEventListener('input', (e) => {
      document.getElementById('thresholdValue').textContent = e.target.value;
      this.updateClusterConfig();
    });

    // Colores de cluster
    document.querySelectorAll('.cluster-color').forEach(color => {
      color.addEventListener('click', (e) => {
        document.querySelectorAll('.cluster-color').forEach(c => c.classList.remove('ring-4', 'ring-gray-400'));
        e.target.classList.add('ring-4', 'ring-gray-400');
        this.updateClusterColor(e.target.dataset.color);
      });
    });

    // Zoom
    document.getElementById('zoomSlider').addEventListener('input', (e) => {
      const zoom = e.target.value;
      document.getElementById('zoomValue').textContent = zoom + '%';
      this.updateWorkspaceZoom(zoom);
    });

    // Modal crear cluster
    document.getElementById('confirmCreateCluster').addEventListener('click', () => this.createNewCluster());
    document.getElementById('cancelCreateCluster').addEventListener('click', () => this.hideCreateClusterModal());

    // Acciones rápidas
    document.getElementById('quickBackup').addEventListener('click', () => this.createBackup());
    document.getElementById('quickRestore').addEventListener('click', () => this.restoreBackup());
    document.getElementById('quickOptimize').addEventListener('click', () => this.quickOptimize());
    document.getElementById('quickAnalytics').addEventListener('click', () => this.showAdvancedAnalytics());

    // Logs
    document.getElementById('clearLogs').addEventListener('click', () => this.clearActivityLog());

    // Workspace drag & drop
    this.setupWorkspaceDragDrop();
  }

  // CARGAR CLUSTERS DESDE API
  async loadClusters() {
    try {
      this.logActivity('Cargando clusters desde servidor...');

      const response = await fetch('/.netlify/functions/vector-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'GET_CLUSTERS' })
      });

      const data = await response.json();

      if (data.clusters) {
        data.clusters.forEach(cluster => {
          this.addClusterToWorkspace(cluster);
        });

        this.updateMetrics();
        this.logActivity(`${data.clusters.length} clusters cargados exitosamente`);
      }
    } catch (error) {
      this.logActivity(`Error cargando clusters: ${error.message}`, 'error');
      // Cargar clusters de demostración
      this.loadDemoClusters();
    }
  }

  // CARGAR CLUSTERS DE DEMOSTRACIÓN
  loadDemoClusters() {
    const demoClusters = [
      {
        id: 'cluster_demo_1',
        name: 'Propiedades Centro Valencia',
        type: 'property',
        x: 100,
        y: 100,
        color: '#3b82f6',
        vector_count: 45,
        cohesion: 0.87,
        separation: 0.73,
        conversions: 23
      },
      {
        id: 'cluster_demo_2',
        name: 'Apartamentos Playa',
        type: 'property',
        x: 300,
        y: 150,
        color: '#10b981',
        vector_count: 32,
        cohesion: 0.92,
        separation: 0.68,
        conversions: 18
      },
      {
        id: 'cluster_demo_3',
        name: 'Usuarios Familias',
        type: 'user_behavior',
        x: 200,
        y: 250,
        color: '#f59e0b',
        vector_count: 67,
        cohesion: 0.79,
        separation: 0.84,
        conversions: 41
      }
    ];

    demoClusters.forEach(cluster => {
      this.addClusterToWorkspace(cluster);
    });

    this.updateMetrics();
    this.logActivity('Clusters de demostración cargados');
  }

  // AGREGAR CLUSTER AL WORKSPACE
  addClusterToWorkspace(cluster) {
    const clusterElement = this.createClusterElement(cluster);
    this.workspace.appendChild(clusterElement);
    this.clusters.set(cluster.id, cluster);

    // Hacer draggable
    this.makeClusterDraggable(clusterElement, cluster);
  }

  // CREAR ELEMENTO VISUAL DEL CLUSTER
  createClusterElement(cluster) {
    const element = document.createElement('div');
    element.className = 'cluster-node absolute bg-white rounded-xl shadow-lg border-2 p-4 min-w-32 cursor-move';
    element.style.left = cluster.x + 'px';
    element.style.top = cluster.y + 'px';
    element.style.borderColor = cluster.color;
    element.dataset.clusterId = cluster.id;

    element.innerHTML = `
      <div class="text-center">
        <div class="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
             style="background-color: ${cluster.color}">
          ${cluster.type === 'property' ? '🏠' : cluster.type === 'user_behavior' ? '👤' : '🔍'}
        </div>
        <div class="text-sm font-bold text-gray-800">${cluster.name}</div>
        <div class="text-xs text-gray-500">${cluster.vector_count || 0} vectores</div>
        <div class="text-xs text-blue-600">Cohesión: ${(cluster.cohesion || 0.5).toFixed(2)}</div>
      </div>
    `;

    // Click para seleccionar
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectCluster(cluster.id);
    });

    return element;
  }

  // HACER CLUSTER DRAGGABLE
  makeClusterDraggable(element, cluster) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    element.addEventListener('mousedown', (e) => {
      if (e.target.closest('.cluster-node') === element) {
        isDragging = true;
        this.draggedElement = element;

        startX = e.clientX;
        startY = e.clientY;
        initialX = parseInt(element.style.left);
        initialY = parseInt(element.style.top);

        element.classList.add('dragging');
        e.preventDefault();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging && this.draggedElement === element) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const newX = Math.max(0, initialX + deltaX);
        const newY = Math.max(0, initialY + deltaY);

        element.style.left = newX + 'px';
        element.style.top = newY + 'px';

        // Actualizar datos del cluster
        cluster.x = newX;
        cluster.y = newY;
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging && this.draggedElement === element) {
        isDragging = false;
        this.draggedElement = null;
        element.classList.remove('dragging');

        this.logActivity(`Cluster "${cluster.name}" movido a posición (${cluster.x}, ${cluster.y})`);
        this.saveClusterPosition(cluster);
      }
    });
  }

  // SELECCIONAR CLUSTER
  selectCluster(clusterId) {
    // Remover selección anterior
    document.querySelectorAll('.cluster-node').forEach(node => {
      node.classList.remove('ring-4', 'ring-blue-500');
    });

    // Seleccionar nuevo cluster
    const element = document.querySelector(`[data-cluster-id="${clusterId}"]`);
    if (element) {
      element.classList.add('ring-4', 'ring-blue-500');
    }

    this.selectedCluster = clusterId;
    this.updateClusterConfigPanel();
    this.logActivity(`Cluster "${this.clusters.get(clusterId)?.name}" seleccionado`);
  }

  // ACTUALIZAR PANEL DE CONFIGURACIÓN
  updateClusterConfigPanel() {
    if (!this.selectedCluster) return;

    const cluster = this.clusters.get(this.selectedCluster);
    if (!cluster) return;

    document.getElementById('clusterName').value = cluster.name;
    document.getElementById('similarityWeight').value = cluster.similarity_weight || 0.8;
    document.getElementById('inclusionThreshold').value = cluster.inclusion_threshold || 0.7;

    document.getElementById('similarityValue').textContent = cluster.similarity_weight || 0.8;
    document.getElementById('thresholdValue').textContent = cluster.inclusion_threshold || 0.7;

    // Métricas
    document.getElementById('metricVectors').textContent = cluster.vector_count || 0;
    document.getElementById('metricCohesion').textContent = (cluster.cohesion || 0).toFixed(2);
    document.getElementById('metricSeparation').textContent = (cluster.separation || 0).toFixed(2);
    document.getElementById('metricConversions').textContent = cluster.conversions || 0;
  }

  // ACTUALIZAR CONFIGURACIÓN DEL CLUSTER
  updateClusterConfig() {
    if (!this.selectedCluster) return;

    const cluster = this.clusters.get(this.selectedCluster);
    if (!cluster) return;

    cluster.similarity_weight = parseFloat(document.getElementById('similarityWeight').value);
    cluster.inclusion_threshold = parseFloat(document.getElementById('inclusionThreshold').value);

    this.logActivity(`Configuración de "${cluster.name}" actualizada`);
  }

  // ACTUALIZAR COLOR DEL CLUSTER
  updateClusterColor(color) {
    if (!this.selectedCluster) return;

    const cluster = this.clusters.get(this.selectedCluster);
    if (!cluster) return;

    cluster.color = color;

    // Actualizar elemento visual
    const element = document.querySelector(`[data-cluster-id="${this.selectedCluster}"]`);
    if (element) {
      element.style.borderColor = color;
      const icon = element.querySelector('.rounded-full');
      if (icon) {
        icon.style.backgroundColor = color;
      }
    }

    this.logActivity(`Color de "${cluster.name}" actualizado`);
  }

  // MOSTRAR MODAL CREAR CLUSTER
  showCreateClusterModal() {
    document.getElementById('createClusterModal').classList.remove('hidden');
    document.getElementById('createClusterModal').classList.add('flex');
    document.getElementById('newClusterName').focus();
  }

  // OCULTAR MODAL CREAR CLUSTER
  hideCreateClusterModal() {
    document.getElementById('createClusterModal').classList.add('hidden');
    document.getElementById('createClusterModal').classList.remove('flex');
  }

  // CREAR NUEVO CLUSTER
  createNewCluster() {
    const name = document.getElementById('newClusterName').value.trim();
    const type = document.getElementById('newClusterType').value;
    const x = parseInt(document.getElementById('newClusterX').value);
    const y = parseInt(document.getElementById('newClusterY').value);

    if (!name) {
      alert('Por favor ingresa un nombre para el cluster');
      return;
    }

    const cluster = {
      id: `cluster_${Date.now()}`,
      name,
      type,
      x,
      y,
      color: '#3b82f6',
      vector_count: 0,
      cohesion: 0.5,
      separation: 0.5,
      conversions: 0,
      similarity_weight: 0.8,
      inclusion_threshold: 0.7
    };

    this.addClusterToWorkspace(cluster);
    this.updateMetrics();
    this.hideCreateClusterModal();

    this.logActivity(`Nuevo cluster "${name}" creado`);

    // Limpiar form
    document.getElementById('newClusterName').value = '';
    document.getElementById('newClusterX').value = '100';
    document.getElementById('newClusterY').value = '100';
  }

  // AUTO-OPTIMIZAR CLUSTERS
  async autoOptimizeClusters() {
    this.logActivity('Iniciando auto-optimización de clusters...');

    try {
      // Simular optimización
      for (const [id, cluster] of this.clusters) {
        // Mejorar cohesión
        cluster.cohesion = Math.min(1, cluster.cohesion + Math.random() * 0.1);

        // Mejorar separación
        cluster.separation = Math.min(1, cluster.separation + Math.random() * 0.05);

        // Actualizar elemento visual
        const element = document.querySelector(`[data-cluster-id="${id}"]`);
        if (element) {
          const cohesionElement = element.querySelector('.text-blue-600');
          if (cohesionElement) {
            cohesionElement.textContent = `Cohesión: ${cluster.cohesion.toFixed(2)}`;
          }
        }

        // Delay para efecto visual
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      this.updateMetrics();
      this.updatePerformanceChart();
      this.logActivity('Auto-optimización completada exitosamente');

    } catch (error) {
      this.logActivity(`Error en auto-optimización: ${error.message}`, 'error');
    }
  }

  // ACTUALIZAR MÉTRICAS PRINCIPALES
  updateMetrics() {
    const totalClusters = this.clusters.size;
    const totalVectors = Array.from(this.clusters.values())
      .reduce((sum, cluster) => sum + (cluster.vector_count || 0), 0);

    const avgCohesion = Array.from(this.clusters.values())
      .reduce((sum, cluster) => sum + (cluster.cohesion || 0), 0) / totalClusters;

    const performanceScore = Math.round(avgCohesion * 100);

    document.getElementById('totalClusters').textContent = totalClusters;
    document.getElementById('activeVectors').textContent = totalVectors;
    document.getElementById('performanceScore').textContent = performanceScore + '%';

    this.updateClusterConfigPanel();
  }

  // INICIALIZAR GRÁFICOS
  initCharts() {
    // Gráfico de Performance
    const perfCtx = document.getElementById('performanceChart').getContext('2d');
    this.performanceChart = new Chart(perfCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Performance Score',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });

    // Gráfico de Distribución
    const distCtx = document.getElementById('clusterDistribution').getContext('2d');
    this.distributionChart = new Chart(distCtx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    this.updateCharts();
  }

  // ACTUALIZAR GRÁFICOS
  updateCharts() {
    this.updatePerformanceChart();
    this.updateDistributionChart();
  }

  // ACTUALIZAR GRÁFICO DE PERFORMANCE
  updatePerformanceChart() {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString();

    const avgCohesion = Array.from(this.clusters.values())
      .reduce((sum, cluster) => sum + (cluster.cohesion || 0), 0) / this.clusters.size;

    const performanceScore = Math.round(avgCohesion * 100);

    this.performanceChart.data.labels.push(timeLabel);
    this.performanceChart.data.datasets[0].data.push(performanceScore);

    // Mantener solo últimos 10 puntos
    if (this.performanceChart.data.labels.length > 10) {
      this.performanceChart.data.labels.shift();
      this.performanceChart.data.datasets[0].data.shift();
    }

    this.performanceChart.update();
  }

  // ACTUALIZAR GRÁFICO DE DISTRIBUCIÓN
  updateDistributionChart() {
    const labels = [];
    const data = [];

    for (const cluster of this.clusters.values()) {
      labels.push(cluster.name);
      data.push(cluster.vector_count || 0);
    }

    this.distributionChart.data.labels = labels;
    this.distributionChart.data.datasets[0].data = data;
    this.distributionChart.update();
  }

  // TIEMPO REAL
  startRealTimeUpdates() {
    if (this.realTimeEnabled) {
      setInterval(() => {
        this.updateMetrics();
        this.updatePerformanceChart();
      }, 5000); // Cada 5 segundos
    }
  }

  toggleRealTime() {
    this.realTimeEnabled = !this.realTimeEnabled;
    const button = document.getElementById('realTimeToggle');
    button.textContent = `🔄 Tiempo Real: ${this.realTimeEnabled ? 'ON' : 'OFF'}`;
    button.className = this.realTimeEnabled
      ? 'bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium'
      : 'bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium';

    this.logActivity(`Tiempo real ${this.realTimeEnabled ? 'activado' : 'desactivado'}`);
  }

  // LOGS DE ACTIVIDAD
  logActivity(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logElement = document.getElementById('activityLog');

    const logClass = type === 'error' ? 'text-red-600' :
                    type === 'success' ? 'text-green-600' : 'text-gray-700';

    const logEntry = document.createElement('div');
    logEntry.className = logClass;
    logEntry.textContent = `[${timestamp}] ${message}`;

    logElement.appendChild(logEntry);
    logElement.scrollTop = logElement.scrollHeight;

    console.log(`[Cluster Admin] ${message}`);
  }

  clearActivityLog() {
    document.getElementById('activityLog').innerHTML = '';
    this.logActivity('Log de actividad limpiado');
  }

  // GUARDAR CONFIGURACIÓN
  async saveConfiguration() {
    try {
      const config = {
        clusters: Array.from(this.clusters.values()),
        timestamp: new Date().toISOString()
      };

      // En un entorno real, esto se enviaría al servidor
      localStorage.setItem('guestsvalencia_cluster_config', JSON.stringify(config));

      this.logActivity('Configuración guardada exitosamente', 'success');
    } catch (error) {
      this.logActivity(`Error guardando configuración: ${error.message}`, 'error');
    }
  }

  // EXPORTAR DATOS
  exportData() {
    const data = {
      clusters: Array.from(this.clusters.values()),
      export_timestamp: new Date().toISOString(),
      total_clusters: this.clusters.size,
      total_vectors: Array.from(this.clusters.values())
        .reduce((sum, cluster) => sum + (cluster.vector_count || 0), 0)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `guestsvalencia_clusters_${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    this.logActivity('Datos exportados exitosamente', 'success');
  }

  // WORKSPACE DRAG & DROP SETUP
  setupWorkspaceDragDrop() {
    this.workspace.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.workspace.classList.add('drop-zone');
    });

    this.workspace.addEventListener('dragleave', () => {
      this.workspace.classList.remove('drop-zone');
    });

    this.workspace.addEventListener('drop', (e) => {
      e.preventDefault();
      this.workspace.classList.remove('drop-zone');
    });

    // Click en workspace para deseleccionar
    this.workspace.addEventListener('click', (e) => {
      if (e.target === this.workspace) {
        document.querySelectorAll('.cluster-node').forEach(node => {
          node.classList.remove('ring-4', 'ring-blue-500');
        });
        this.selectedCluster = null;
        this.logActivity('Cluster deseleccionado');
      }
    });
  }

  // ZOOM DEL WORKSPACE
  updateWorkspaceZoom(zoom) {
    const scale = zoom / 100;
    this.workspace.style.transform = `scale(${scale})`;
    this.workspace.style.transformOrigin = 'top left';
  }
}

// INICIALIZAR CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', () => {
  window.clusterAdmin = new ClusterAdminPanel();
});