import { dataAxiosClient, pythonAxiosClient } from './axiosClient';
import { 
  SearchResultItem, 
  DatasetFullDetailsDto,
  DatasetMetadataResultDto,
  ProcessResultDto 
} from '../models/dto.types';

/**
 * Service for managing dataset discovery and semantic search.
 * Connects to both .NET Core (Data) and Python (AI) backends.
 */
export class DatasetService {
  /**
   * Performs a semantic search directly via the Python AI Service.
   * Division of Labor: AI handles the semantic vector search.
   * Endpoint: POST http://127.0.0.1:8000/search/semantic
   */
  public async searchDatasets(query: string, page: number = 1, pageSize: number = 10): Promise<{ results: SearchResultItem[], totalCount: number }> {
    try {
      const offset = (page - 1) * pageSize;
      const response = await pythonAxiosClient.post<{ results: any[], total_count: number }>(
        '/search/semantic',
        { 
          query: query,
          limit: pageSize,
          offset: offset
        }
      );
      
      // Map to our frontend model
      const results = response.data.results.map(r => new SearchResultItem({
        identifier: r.identifier,
        title: r.title,
        description: r.description,
        score: r.score
      }));

      return {
        results,
        totalCount: response.data.total_count
      };
    } catch (error: any) {
      throw error.response?.data || error.message || 'Failed to perform semantic search';
    }
  }

  /**
   * Fetches detailed information for a dataset from the .NET Core API.
   * Endpoint: GET http://localhost:5133/api/Search/details/{identifier}
   */
  public async getDatasetByIdentifier(identifier: string): Promise<DatasetFullDetailsDto> {
    try {
      const response = await dataAxiosClient.get<DatasetFullDetailsDto>(
        `/api/Search/details/${identifier}`
      );
      return new DatasetFullDetailsDto(response.data);
    } catch (error: any) {
      throw error.response?.data || error.message || 'Failed to fetch dataset details';
    }
  }

  /**
   * Fallback Keyword search from .NET Core API.
   * Endpoint: GET http://localhost:5133/api/Search?q={query}
   */
  public async getDatasetsByKeyword(query: string): Promise<DatasetMetadataResultDto[]> {
    try {
      const response = await dataAxiosClient.get<DatasetMetadataResultDto[]>(
        `/api/Search`,
        { params: { q: query } }
      );
      return response.data.map(d => new DatasetMetadataResultDto(d));
    } catch (error: any) {
      throw error.response?.data || error.message || 'Failed to fetch datasets';
    }
  }
  /**
   * Fetches statistics from the .NET Core API.
   * Endpoint: GET http://localhost:5133/api/Search/stats
   */
  public async getStats(): Promise<{ totalDatasets: number, totalProviders: number }> {
    try {
      const response = await dataAxiosClient.get<{ totalDatasets: number, totalProviders: number }>(
        '/api/Search/stats'
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message || 'Failed to fetch statistics';
    }
  }

  /**
   * Triggers ETL processing for all datasets.
   * Endpoint: POST http://localhost:5133/api/Etl/process-all
   */
  public async processAllDatasets(): Promise<ProcessResultDto> {
    try {
      const response = await dataAxiosClient.post<ProcessResultDto>(
        '/api/Etl/process-all'
      );
      return new ProcessResultDto(response.data);
    } catch (error: any) {
      throw error.response?.data || error.message || 'Failed to start processing all datasets';
    }
  }

  /**
   * Triggers ETL processing for a specific dataset identifier.
   * Endpoint: POST http://localhost:5133/api/Etl/process/{identifier}
   */
  public async processDataset(identifier: string): Promise<ProcessResultDto> {
    try {
      const response = await dataAxiosClient.post<ProcessResultDto>(
        `/api/Etl/process/${identifier}`
      );
      return new ProcessResultDto(response.data);
    } catch (error: any) {
      throw error.response?.data || error.message || 'Failed to start processing this dataset';
    }
  }
}

export const datasetService = new DatasetService();

