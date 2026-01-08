<template>
  <div class="connectivity-web" data-cy="connectivity-web">
    <h3 class="section-title">Dataset Relationships</h3>
    <p class="section-subtitle">Scientific connections and related research</p>

    <div v-if="!relationships || relationships.length === 0" class="no-data" data-cy="connectivity-empty">
      <p>No relationships found for this dataset</p>
    </div>

    <div v-else class="relationships-container" data-cy="connectivity-container">
      <div class="relationships-list">
        <div
          v-for="rel in relationships"
          :key="rel.datasetRelationshipID"
          class="relationship-card"
          data-cy="relationship-card"
        >
          <div class="relationship-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>

          <div class="relationship-content">
            <div class="relationship-header">
              <span v-if="rel.relationshipType" class="relationship-type">{{ rel.relationshipType }}</span>
            </div>

            <div class="relationship-body">
              <p class="relationship-id">Dataset ID: {{ rel.datasetID }}</p>
              <a
                v-if="rel.relationshipUri"
                :href="rel.relationshipUri"
                target="_blank"
                rel="noopener noreferrer"
                class="relationship-link"
              >
                {{ rel.relationshipUri }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="relationship-summary">
        <h4>Relationship Summary</h4>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-value">{{ relationships.length }}</span>
            <span class="stat-label">Total Relationships</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ uniqueTypes.length }}</span>
            <span class="stat-label">Relationship Types</span>
          </div>
        </div>

        <div v-if="uniqueTypes.length > 0" class="types-list">
          <h5>Types:</h5>
          <div class="types-badges">
            <span
              v-for="(type, index) in uniqueTypes"
              :key="index"
              class="type-badge"
            >
              {{ type }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-facing-decorator';
import { DatasetRelationshipDto } from '@/models/dto.types';

@Component({
  name: 'ConnectivityWeb'
})
export default class ConnectivityWeb extends Vue {
  @Prop({ default: () => [] })
  public readonly relationships!: DatasetRelationshipDto[];

  public get uniqueTypes(): string[] {
    const types = this.relationships
      .map(r => r.relationshipType)
      .filter((type): type is string => type !== null && type !== undefined);
    return [...new Set(types)];
  }
}
</script>

<style scoped>
.connectivity-web {
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

.relationships-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.relationships-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.relationship-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s;
}

.relationship-card:hover {
  border-color: #8b5cf6;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
}

.relationship-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ede9fe;
  border-radius: 8px;
  color: #8b5cf6;
}

.relationship-icon svg {
  width: 20px;
  height: 20px;
}

.relationship-content {
  flex: 1;
  min-width: 0;
}

.relationship-header {
  margin-bottom: 0.75rem;
}

.relationship-type {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #7c3aed;
  background: #ede9fe;
  border-radius: 12px;
  text-transform: capitalize;
}

.relationship-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.relationship-id {
  font-size: 0.875rem;
  color: #4a5568;
  font-family: monospace;
}

.relationship-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
  word-break: break-all;
  transition: color 0.3s;
}

.relationship-link:hover {
  color: #2563eb;
}

.relationship-link svg {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.relationship-summary {
  background: white;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 1rem;
}

.relationship-summary h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
}

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #8b5cf6;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 600;
  text-align: center;
}

.types-list h5 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.75rem;
}

.types-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.type-badge {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #7c3aed;
  background: #f5f3ff;
  border: 1px solid #ede9fe;
  border-radius: 6px;
  text-align: center;
  text-transform: capitalize;
}

@media (max-width: 768px) {
  .relationships-container {
    grid-template-columns: 1fr;
  }

  .relationship-summary {
    position: static;
  }
}
</style>
