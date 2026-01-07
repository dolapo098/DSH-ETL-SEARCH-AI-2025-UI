<template>
  <div class="resource-manager">
    <h3 class="section-title">Dataset Resources</h3>

    <div v-if="!dataFiles || dataFiles.length === 0" class="no-data">
      <p>No data files available for this dataset</p>
    </div>

    <div v-else class="resources-list">
      <div
        v-for="file in dataFiles"
        :key="file.dataFileID"
        class="resource-card"
      >
        <div class="resource-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>

        <div class="resource-content">
          <h4 class="resource-title">{{ file.title || 'Untitled File' }}</h4>
          <p v-if="file.description" class="resource-description">{{ file.description }}</p>

          <div class="resource-meta">
            <span v-if="file.fileType" class="meta-badge">{{ file.fileType }}</span>
            <span v-if="file.type" class="meta-badge type">{{ file.type }}</span>
          </div>
        </div>

        <div class="resource-actions">
          <a
            v-if="file.downloadUrl"
            :href="file.downloadUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="download-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download
          </a>
          <span v-else class="no-download">Not available</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-facing-decorator';
import { DataFileDto } from '@/models/dto.types';

@Component({
  name: 'ResourceManager'
})
export default class ResourceManager extends Vue {
  @Prop({ default: () => [] })
  public dataFiles!: DataFileDto[];
}
</script>

<style scoped>
.resource-manager {
  padding: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.no-data {
  text-align: center;
  padding: 3rem 1rem;
  color: #718096;
  background: #f7fafc;
  border-radius: 8px;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-card {
  display: flex;
  align-items: start;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s;
}

.resource-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.resource-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dbeafe;
  border-radius: 8px;
  color: #3b82f6;
}

.resource-icon svg {
  width: 24px;
  height: 24px;
}

.resource-content {
  flex: 1;
  min-width: 0;
}

.resource-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.resource-description {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.resource-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.meta-badge {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e40af;
  background: #dbeafe;
  border-radius: 12px;
}

.meta-badge.type {
  color: #065f46;
  background: #d1fae5;
}

.resource-actions {
  flex-shrink: 0;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.download-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.download-btn svg {
  width: 16px;
  height: 16px;
}

.no-download {
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
}

@media (max-width: 640px) {
  .resource-card {
    flex-direction: column;
  }

  .resource-actions {
    width: 100%;
  }

  .download-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
