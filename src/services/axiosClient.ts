import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export class AxiosClientService {
  public axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false,
      timeout: 120000, // 120 seconds for local LLM processing
    });

    this.initializeResponseInterceptor();
  }

  private initializeResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        // Standardized logging for errors
        console.error(`API Error [${error.config?.url}]:`, error.response?.data || error.message);
        return Promise.reject(error);
      },
    );
  }
}

// Configuration strictly driven by environment variables with safety fallbacks
const DATA_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5133';
const AI_API_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8001';

if (import.meta.env.DEV) {
  console.log('🔌 UI Connecting to Data API at:', DATA_API_URL);
  console.log('🧠 UI Connecting to AI Service at:', AI_API_URL);
}

export const dataAxiosClient = new AxiosClientService(DATA_API_URL).axiosInstance;
export const pythonAxiosClient = new AxiosClientService(AI_API_URL).axiosInstance;

// Keep default export for backward compatibility if needed
export const axiosClient = dataAxiosClient;
