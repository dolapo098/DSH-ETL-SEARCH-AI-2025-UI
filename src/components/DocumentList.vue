<template>
  <div class="document-list">
    <h3 class="section-title">Supporting Documents</h3>
    <p class="section-subtitle">Documents used by the AI for search and analysis</p>

    <div v-if="!supportingDocuments || supportingDocuments.length === 0" class="no-data">
      <p>No supporting documents available for this dataset</p>
    </div>

    <div v-else class="documents-grid">
      <div
        v-for="doc in supportingDocuments"
        :key="doc.supportingDocumentID"
        class="document-card"
      >
        <div class="document-header">
          <div class="document-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <span v-if="doc.documentType" class="document-type">{{ doc.documentType }}</span>
        </div>

        <div class="document-content">
          <h4 class="document-title">{{ doc.title || 'Untitled Document' }}</h4>
        </div>

        <div class="document-actions">
          <a
            v-if="doc.downloadUrl"
            :href="doc.downloadUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="view-btn"
          >
            View Document
          </a>
          <span v-else class="no-link">Not available</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-facing-decorator';
import { SupportingDocumentDto } from '@/models/dto.types';

@Component({
  name: 'DocumentList'
})
export default class DocumentList extends Vue {
  @Prop({ default: () => [] })
  public supportingDocuments!: SupportingDocumentDto[];
}
</script>

<style scoped>
.document-list {
  padding: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1.5rem;
}

.no-data {
  text-align: center;
  padding: 3rem 1rem;
  color: #718096;
  background: #f7fafc;
  border-radius: 8px;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.document-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s;
}

.document-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.document-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef3c7;
  border-radius: 8px;
  color: #d97706;
}

.document-icon svg {
  width: 20px;
  height: 20px;
}

.document-type {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #d97706;
  background: #fef3c7;
  border-radius: 12px;
  text-transform: uppercase;
}

.document-content {
  flex: 1;
  margin-bottom: 1rem;
}

.document-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  line-height: 1.4;
}

.document-actions {
  display: flex;
  align-items: center;
}

.view-btn {
  flex: 1;
  display: block;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
}

.view-btn:hover {
  background: #3b82f6;
  color: white;
}

.no-link {
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
}

@media (max-width: 640px) {
  .documents-grid {
    grid-template-columns: 1fr;
  }
}
</style>
