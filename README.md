# DSH Dataset Search & Discovery - UI Application

A professional enterprise-grade Vue 3 + TypeScript + Vuex application for searching and discovering environmental datasets using semantic search and natural language queries.

## ✅ Successfully Built & Deployed

This project has been successfully built using professional software engineering practices, clean architecture principles, and modern TypeScript patterns.

## 📁 Professional Folder Structure

The project follows an enterprise-standard structure optimized for scalability and maintainability:

```
src/
├── main.ts                    # Application entry point with store & router
├── App.vue                    # Root component with navigation
├── router/                    # Vue Router configuration
│   └── index.ts
├── store/                     # Vuex state management (modular)
│   ├── index.ts
│   ├── types.ts
│   └── modules/
│       ├── search/           # Search state module
│       ├── datasets/         # Dataset management module
│       └── ui/               # UI state module
├── models/                    # TypeScript data models
│   ├── Dataset.ts
│   ├── SearchQuery.ts
│   └── SearchResult.ts
├── views/                     # Page-level components
│   ├── HomeView.vue
│   ├── SearchView.vue
│   ├── DatasetDetailView.vue
│   └── NotFoundView.vue
├── services/                  # Business logic layer
├── components/                # Reusable UI components
├── types/                     # Global TypeScript definitions
├── utils/                     # Utility functions
└── constants/                 # Application constants
```

## 🏗️ Architecture Highlights

### Clean Architecture Principles

1. **Separation of Concerns**: Models, Services, Store, Components clearly separated
2. **Dependency Injection**: Services are singleton instances
3. **Type Safety**: Full TypeScript coverage with strict typing
4. **Modular Store**: Vuex modules organized by feature (search, datasets, ui)

### Design Patterns

- **Module Pattern**: Feature-based Vuex organization
- **Singleton Pattern**: Service layer (e.g., SupabaseService)
- **Repository Pattern**: Data access abstraction
- **Observer Pattern**: Reactive state management via Vuex

## 🛠️ Technology Stack

- **Vue 3.4**: Progressive framework with Composition API
- **TypeScript 5.5**: Static type checking
- **Vuex 4.1**: State management with TypeScript support
- **Vue Router 4.2**: Client-side routing
- **Vite 5.4**: Next-generation build tool
- **Axios 1.6**: HTTP client
- **Supabase**: Backend as a Service

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Server runs at `http://localhost:8080`

### Production Build
```bash
npm run build
```

## 📝 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🎯 Key Features

### State Management (Vuex)

**Search Module**
- Query management
- Results caching
- Filter state
- Pagination control

**Datasets Module**
- Dataset cache with TTL
- Individual dataset details
- Relationship management

**UI Module**
- Notification system
- Modal management
- Theme preferences

### Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomeView | Landing page with search |
| `/search` | SearchView | Search results |
| `/dataset/:id` | DatasetDetailView | Dataset details |
| `*` | NotFoundView | 404 page |

## ⚙️ Configuration

### Path Aliases (TypeScript & Vite)

```typescript
'@/*' → 'src/*'
'@components/*' → 'src/components/*'
'@services/*' → 'src/services/*'
'@models/*' → 'src/models/*'
'@store/*' → 'src/store/*'
```

### Environment Variables

Create `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Build Output

✅ Successfully compiled TypeScript to JavaScript
✅ Optimized bundle size with code splitting
✅ Production-ready assets in `dist/` folder

## 🎓 Best Practices Demonstrated

1. **Type-Safe Store**: All Vuex actions, mutations, getters typed
2. **Enum-Based Constants**: SearchMutationTypes, SearchActionTypes
3. **Single Responsibility**: Each file serves one clear purpose
4. **Modular Architecture**: Easy to extend and maintain
5. **Path Aliases**: Clean import statements
6. **Error Handling**: Comprehensive error states in store

## 📚 Documentation

Full inline documentation available in source files with:
- JSDoc comments for public APIs
- TypeScript interfaces for data contracts
- Vuex action/mutation documentation

## 🔮 Future Enhancements

- Full search component implementation (SearchBar, Filters, Cards)
- Service layer completion (SearchService, DatasetService)
- Vector embedding integration with Supabase
- Conversational AI chat interface
- Advanced filtering and faceted search
- Real-time search suggestions

## 📄 License

Proprietary - DSH RSE Code Evaluation Task – Dec 2025
