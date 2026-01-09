# DSH Dataset Search & Discovery - UI Application

## Overview

The **DSH Dataset Search & Discovery UI** is a modern, enterprise-grade Vue 3 application that provides an intuitive interface for discovering and exploring environmental datasets. The application integrates with both the .NET Ingestion Hub and Python AI Search Service to deliver semantic search, conversational AI assistance, and comprehensive dataset exploration capabilities.

Key capabilities include:

- **Semantic Search**: Natural language queries powered by AI embeddings
- **Conversational Agent**: AI-powered chat interface for dataset discovery
- **Dataset Exploration**: Detailed views with metadata, relationships, and resources
- **ETL Management**: Administrative controls for dataset processing
- **Spatial Visualization**: Map-based dataset coverage display

---

## Requirements

| Component            | Specification                               |
| -------------------- | ------------------------------------------- |
| **Runtime**          | Node.js 18+                                 |
| **Package Manager**  | npm 9+ or yarn 1.22+                        |
| **Build Tool**       | Vite 5.4+                                   |
| **Framework**        | Vue 3.4+                                    |
| **Language**         | TypeScript 5.5+                             |
| **State Management** | Vuex 4.1+                                   |
| **Routing**          | Vue Router 4.2+                             |
| **HTTP Client**      | Axios 1.6+                                  |
| **Backend Services** | .NET API (port 5133), Python AI (port 8001) |

---

## Endpoints

The UI communicates with two backend services:

### Python AI Service (Port 8001) please confirm the port running

| Endpoint           | Method | Description                                             |
| ------------------ | ------ | ------------------------------------------------------- |
| `/search/semantic` | POST   | Performs semantic vector search across indexed datasets |
| `/agent/chat`      | POST   | Conversational AI agent for dataset discovery via RAG   |

### .NET Data API (Port 5133) please confirm the port running

| Endpoint                           | Method | Description                                      |
| ---------------------------------- | ------ | ------------------------------------------------ |
| `/api/Search?q={query}`            | GET    | Keyword-based search across dataset metadata     |
| `/api/Search/details/{identifier}` | GET    | Retrieves complete dataset information           |
| `/api/Search/stats`                | GET    | Returns catalog statistics (datasets, providers) |
| `/api/Etl/process-all`             | POST   | Triggers ETL processing for all datasets         |
| `/api/Etl/process/{identifier}`    | POST   | Triggers ETL processing for a specific dataset   |

---

## Functionalities

| Functionality            | Route              | Description                                                                                                                              |
| ------------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Home Dashboard**       | `/`                | Landing page with search interface, example queries, feature highlights, and system statistics (total datasets, providers, categories)   |
| **Semantic Search**      | `/search`          | Advanced search interface with natural language query support. Displays results ranked by semantic similarity with deduplication         |
| **Dataset Details**      | `/dataset/:id`     | Comprehensive dataset view showing metadata, geospatial data, relationships, supporting documents, data files, and download links        |
| **Map Visualization**    | `/map`             | Interactive map displaying dataset geographic coverage and spatial distribution using ArcGIS/Leaflet integration                         |
| **Conversational Agent** | Global (Chat Icon) | AI-powered chat assistant accessible from any page. Provides natural language dataset discovery with RAG-powered responses and citations |
| **ETL Controls**         | Home Page          | Administrative interface for triggering dataset processing (process all or individual datasets) with status monitoring                   |
| **Statistics Display**   | Home Page          | Real-time dashboard showing total datasets, data providers, and category counts retrieved from the .NET API                              |

### Key Features

- **Persistent Chat History**: Conversation state saved to localStorage
- **Dynamic Citation Parsing**: Automatically converts dataset citations in chat responses to clickable links
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Error Handling**: Comprehensive error messages with fallback to keyword search
- **State Management**: Centralized Vuex store with modular organization (search, datasets, chat, UI)

---

## License

This project is part of the DSH ETL Search & Discovery Platform.
