<template>
  <div class="search-view">
    <div class="search-header">
      <h1 class="page-title">Scientific Data Discovery</h1>
      <p class="subtitle">Natural language search for scientific datasets</p>

      <div class="search-input-container">
        <input
          v-model="localQuery"
          type="text"
          placeholder="Search for datasets (e.g., water quality, climate data, coastal erosion...)"
          class="search-input"
          @keyup.enter="performSearch"
          data-cy="search-input"
        />
        <button @click="performSearch" class="search-btn" :disabled="isLoading" data-cy="search-button">
          {{ isLoading ? 'Searching...' : 'Search' }}
        </button>
      </div>
    </div>

    <div class="search-content">
      <main class="results-container">
        <div v-if="isLoading" class="loading-state">
          <div class="loader"></div>
          <p>Searching datasets...</p>
        </div>

        <div v-else-if="error" class="error-state" data-cy="search-error">
          <div class="error-icon">⚠️</div>
          <h3>Search Error</h3>
          <p>{{ error }}</p>
          <button @click="performSearch" class="retry-btn">Try Again</button>
        </div>

        <div v-else-if="results.length === 0 && query" class="empty-state" data-cy="search-empty-with-query">
          <div class="empty-icon">🔍</div>
          <h3>No Results Found</h3>
          <p>Try adjusting your search terms or use different keywords</p>
        </div>

        <div v-else-if="results.length === 0" class="empty-state" data-cy="search-empty">
          <div class="empty-icon">📊</div>
          <h3>Start Searching</h3>
          <p>Enter a query above to discover scientific datasets</p>
        </div>

        <div v-else class="results-list" data-cy="search-results">
          <div class="results-header">
            <p class="results-count">{{ totalCount }} {{ totalCount === 1 ? 'result' : 'results' }} found</p>
          </div>

          <div
            v-for="result in results"
            :key="result.identifier"
            class="result-card"
            @click="viewDataset(result.identifier)"
            data-cy="search-result-card"
          >
            <div class="result-header">
              <h3 class="result-title">{{ result.title }}</h3>
              <span class="result-score">{{ Math.round(result.score * 100) }}% match</span>
            </div>

            <p class="result-description">{{ result.description }}</p>

            <div class="result-footer">
              <span class="result-identifier">ID: {{ result.identifier }}</span>
            </div>
          </div>

          <div v-if="totalPages > 1" class="pagination-container" data-cy="search-pagination">
            <button 
              class="page-btn" 
              :disabled="currentPage === 1 || isLoading"
              @click="changePage(currentPage - 1)"
              data-cy="search-prev-page"
            >
              &laquo; Previous
            </button>
            <div class="page-info">
              Page {{ currentPage }} of {{ totalPages }}
            </div>
            <button 
              class="page-btn" 
              :disabled="currentPage === totalPages || isLoading"
              @click="changePage(currentPage + 1)"
              data-cy="search-next-page"
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-facing-decorator';
import { namespace } from '@/store/StoreDecorators';
import { Modules } from '@/store/StoreModuleTypes';
import { SearchMutationTypes, SearchActionTypes } from '@/store/modules/semanticSearch/SemanticSearchTypes';
import { SearchResultItem } from '@/models/index';
import { SearchState } from '@/store/modules/semanticSearch/SemanticSearchTypes';

const Search = namespace(Modules.SemanticSearch);

@Component({
  name: 'SearchView'
})
export default class SearchView extends Vue {
  // --- Local State ---
  private localQuery: string = '';

  // --- Namespaced State ---
  @Search.State((s: SearchState) => s.query) public readonly query!: string;
  @Search.State((s: SearchState) => s.results) public readonly results!: SearchResultItem[];
  @Search.State((s: SearchState) => s.isLoading) public readonly isLoading!: boolean;
  @Search.State((s: SearchState) => s.error) public readonly error!: string | null;
  @Search.State((s: SearchState) => s.totalCount) public readonly totalCount!: number;
  @Search.State((s: SearchState) => s.currentPage) public readonly currentPage!: number;
  @Search.State((s: SearchState) => s.totalPages) public readonly totalPages!: number;
  @Search.State((s: SearchState) => s.pageSize) public readonly pageSize!: number;

  // --- Namespaced Actions & Mutations ---
  @Search.Action(SearchActionTypes.PERFORM_SEARCH) 
  public performSearchAction!: (payload: { query?: string; page?: number }) => Promise<void>;

  @Search.Mutation(SearchMutationTypes.SET_QUERY) 
  public setQueryMutation!: (query: string) => void;

  // --- Lifecycle Hooks ---
  public mounted(): void {
    this.localQuery = this.query;
    if (this.query) {
      this.performSearch();
    }
  }

  // --- Methods ---
  public performSearch(): void {
    if (this.localQuery.trim()) {
      this.setQueryMutation(this.localQuery);
      this.performSearchAction({ query: this.localQuery, page: 1 });
    }
  }

  public changePage(page: number): void {
    this.performSearchAction({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public viewDataset(identifier: string): void {
    this.$router.push(`/dataset/${identifier}`);
  }
}
</script>

<style scoped>
.search-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-header {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  color: #718096;
  margin-bottom: 1.5rem;
}

.search-input-container {
  display: flex;
  gap: 1rem;
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
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.search-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-content {
  width: 100%;
}

.results-container {
  min-height: 400px;
}

.loading-state,
.error-state,
.empty-state {
  background: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
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

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-state h3,
.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.error-state p,
.empty-state p {
  color: #718096;
  margin-bottom: 1.5rem;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: white;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: #2563eb;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.results-count {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.result-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.result-card:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.result-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  flex: 1;
}

.result-score {
  padding: 0.375rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e40af;
  background: #dbeafe;
  border-radius: 12px;
  white-space: nowrap;
}

.result-description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.9375rem;
}

.result-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-identifier {
  font-size: 0.8125rem;
  color: #9ca3af;
  font-family: monospace;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.page-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: #3b82f6;
  background: transparent;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.page-btn:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #e2e8f0;
  color: #a0aec0;
}

.page-info {
  font-weight: 600;
  color: #4a5568;
}

@media (max-width: 640px) {
  .search-view {
    padding: 1rem;
  }

  .search-input-container {
    flex-direction: column;
  }

  .result-header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
