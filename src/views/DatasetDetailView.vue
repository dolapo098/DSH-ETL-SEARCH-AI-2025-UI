<template>
  <div class="dataset-detail-view">
    <div v-if="isLoading" class="loading-container">
      <div class="loader"></div>
      <p>Loading dataset details...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h2>Error Loading Dataset</h2>
      <p>{{ error }}</p>
      <button @click="goToSearch" class="back-btn">Back to Search</button>
    </div>

    <div v-else-if="dataset" class="dataset-content">
      <div class="breadcrumb">
        <router-link to="/">Home</router-link>
        <span class="separator">›</span>
        <router-link to="/search">Search</router-link>
        <span class="separator">›</span>
        <span class="current">{{ dataset.datasetMetadata.title || 'Dataset Details' }}</span>
      </div>

      <div class="dataset-header">
        <div class="header-content">
          <h1 class="dataset-title">{{ dataset.datasetMetadata.title || 'Untitled Dataset' }}</h1>
          <p v-if="dataset.datasetMetadata.description" class="dataset-description">
            {{ dataset.datasetMetadata.description }}
          </p>
        </div>

        <div class="metadata-summary">
          <div class="summary-item">
            <span class="summary-label">Published</span>
            <span class="summary-value">{{ formatDate(dataset.datasetMetadata.publicationDate) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">File ID</span>
            <span class="summary-value">{{ dataset.datasetMetadata.fileIdentifier }}</span>
          </div>
        </div>
      </div>

      <div class="tabs-container">
        <div class="tabs-header">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
            <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
          </button>
        </div>

        <div class="tab-content">
          <div v-show="activeTab === 'geospatial'" class="tab-panel">
            <GeospatialMapper :geospatialData="dataset.geospatialData" />
          </div>

          <div v-show="activeTab === 'resources'" class="tab-panel">
            <ResourceManager :dataFiles="dataset.dataFiles" />
          </div>

          <div v-show="activeTab === 'documents'" class="tab-panel">
            <DocumentList :supportingDocuments="dataset.supportingDocuments" />
          </div>

          <div v-show="activeTab === 'relationships'" class="tab-panel">
            <ConnectivityWeb :relationships="dataset.relationships" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-facing-decorator';
import GeospatialMapper from '@/components/GeospatialMapper.vue';
import ResourceManager from '@/components/ResourceManager.vue';
import DocumentList from '@/components/DocumentList.vue';
import ConnectivityWeb from '@/components/ConnectivityWeb.vue';
import type { DatasetFullDetailsDto } from '@/models/dto.types';

@Component({
  name: 'DatasetDetailView',
  components: {
    GeospatialMapper,
    ResourceManager,
    DocumentList,
    ConnectivityWeb
  }
})
export default class DatasetDetailView extends Vue {
  activeTab = 'geospatial';
  dataset: DatasetFullDetailsDto | null = null;

  get identifier(): string {
    return this.$route.params.id as string;
  }

  get isLoading(): boolean {
    return this.$store.state.datasets.isLoading;
  }

  get error(): string | null {
    return this.$store.state.datasets.error;
  }

  get tabs() {
    return [
      {
        id: 'geospatial',
        label: 'Geospatial',
        icon: '🗺️'
      },
      {
        id: 'resources',
        label: 'Resources',
        icon: '📁',
        count: this.dataset?.dataFiles.length || 0
      },
      {
        id: 'documents',
        label: 'Documents',
        icon: '📄',
        count: this.dataset?.supportingDocuments.length || 0
      },
      {
        id: 'relationships',
        label: 'Relationships',
        icon: '🔗',
        count: this.dataset?.relationships.length || 0
      }
    ];
  }

  async mounted(): Promise<void> {
    await this.loadDataset();
  }

  async loadDataset(): Promise<void> {
    const result = await this.$store.dispatch('datasets/FETCH_DATASET', this.identifier);
    if (result) {
      this.dataset = result;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goToSearch(): void {
    this.$router.push('/search');
  }
}
</script>

<style scoped>
.dataset-detail-view {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-container,
.error-container {
  background: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-container h2 {
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.error-container p {
  color: #718096;
  margin-bottom: 1.5rem;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: white;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #2563eb;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1.5rem;
}

.breadcrumb a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #2563eb;
}

.separator {
  color: #cbd5e0;
}

.current {
  color: #1a202c;
  font-weight: 500;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dataset-header {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.header-content {
  margin-bottom: 1.5rem;
}

.dataset-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.dataset-description {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.6;
}

.metadata-summary {
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 0.875rem;
  color: #1a202c;
  font-weight: 500;
  font-family: monospace;
}

.tabs-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  background: #f7fafc;
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  color: #718096;
  font-weight: 500;
  font-size: 0.9375rem;
}

.tab-button:hover {
  background: #edf2f7;
  color: #3b82f6;
}

.tab-button.active {
  background: white;
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-icon {
  font-size: 1.25rem;
}

.tab-label {
  font-weight: 600;
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
}

.tab-button.active .tab-count {
  background: #3b82f6;
  color: white;
}

.tab-content {
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .dataset-detail-view {
    padding: 1rem;
  }

  .tabs-header {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1 1 50%;
    font-size: 0.875rem;
  }

  .tab-icon {
    font-size: 1rem;
  }

  .dataset-title {
    font-size: 1.5rem;
  }

  .metadata-summary {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
