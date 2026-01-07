<template>
  <div class="home-view">
    <section class="etl-section">
      <EtlControls />
    </section>

    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Discover Environmental Datasets</h1>
        <p class="hero-subtitle">
          Search and explore environmental datasets using semantic search, natural language queries, and advanced filtering
        </p>

        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for datasets... (e.g., 'water quality data')"
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-button">
            Search
          </button>
        </div>

        <div class="search-examples">
          <p class="examples-label">Try searching for:</p>
          <div class="example-chips">
            <button
              v-for="example in exampleQueries"
              :key="example"
              @click="setExampleQuery(example)"
              class="example-chip"
            >
              {{ example }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <h2 class="section-title">Key Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3>Semantic Search</h3>
          <p>Find datasets using natural language queries powered by AI embeddings</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>Conversational Interface</h3>
          <p>Ask questions and get answers about datasets in plain English</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🗺️</div>
          <h3>Spatial & Temporal Filters</h3>
          <p>Filter by geographic extent and time periods</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Rich Metadata</h3>
          <p>Access comprehensive dataset information including quality and lineage</p>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ stats?.totalDatasets || '0' }}</div>
          <div class="stat-label">Datasets</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats?.totalProviders || '0' }}</div>
          <div class="stat-label">Data Providers</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">15+</div>
          <div class="stat-label">Categories</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-facing-decorator';
import { namespace } from '@/store/StoreDecorators';
import { Modules } from '@/store/StoreModuleTypes';
import { SearchMutationTypes } from '@/store/modules/semanticSearch/SemanticSearchTypes';
import { DatasetActionTypes, DiscoveryStats } from '@/store/modules/datasetMetadata/DatasetMetadataTypes';
import EtlControls from '@/components/EtlControls.vue';

const SemanticSearch = namespace(Modules.SemanticSearch);
const DatasetMetadata = namespace(Modules.DatasetMetadata);

@Component({
  name: 'HomeView',
  components: { EtlControls }
})
export default class HomeView extends Vue {
  // --- Local State ---
  private searchQuery: string = '';

  private exampleQueries: string[] = [
    'water quality datasets',
    'air pollution monitoring',
    'coastal erosion data',
    'climate change indicators'
  ];

  // --- Namespaced Mutations & Actions ---
  @SemanticSearch.Mutation(SearchMutationTypes.SET_QUERY) 
  public setQueryMutation!: (query: string) => void;

  @DatasetMetadata.Action(DatasetActionTypes.FETCH_STATS)
  public fetchStatsAction!: () => Promise<void>;

  @DatasetMetadata.State((s: any) => s.stats)
  public readonly stats!: DiscoveryStats | null;

  // --- Lifecycle Hooks ---
  public async mounted(): Promise<void> {
    await this.fetchStatsAction();
  }

  // --- Methods ---
  public handleSearch(): void {
    if (this.searchQuery.trim()) {
      this.setQueryMutation(this.searchQuery);
      this.$router.push('/search');
    }
  }

  public setExampleQuery(query: string): void {
    this.searchQuery = query;
    this.handleSearch();
  }
}
</script>

<style scoped>
.home-view {
  width: 100%;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #4a5568;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.search-box {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-button {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.search-examples {
  margin-top: 2rem;
}

.examples-label {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.75rem;
}

.example-chips {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.example-chip {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #667eea;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.example-chip:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.features-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #4a5568;
  line-height: 1.6;
}

.stats-section {
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.etl-section {
  margin: 0 0 2rem 0;
  display: flex;
  justify-content: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: #718096;
  font-weight: 500;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .search-box {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
