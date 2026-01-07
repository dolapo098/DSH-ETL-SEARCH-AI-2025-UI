<template>
  <div class="map-view">
    <div class="map-header">
      <h1 class="map-title">Dataset Coverage Map</h1>
      <p class="map-subtitle">Explore geographic extent of environmental datasets</p>
    </div>

    <div class="map-controls">
      <div class="filter-group">
        <label class="filter-label">Filter by Status:</label>
        <div class="filter-buttons">
          <button
            :class="['filter-btn', { active: statusFilter === 'all' }]"
            @click="statusFilter = 'all'"
          >
            All
          </button>
          <button
            :class="['filter-btn', { active: statusFilter === 'onGoing' }]"
            @click="statusFilter = 'onGoing'"
          >
            Ongoing
          </button>
          <button
            :class="['filter-btn', { active: statusFilter === 'completed' }]"
            @click="statusFilter = 'completed'"
          >
            Completed
          </button>
        </div>
      </div>

      <div class="legend">
        <div class="legend-item">
          <span class="legend-color ongoing"></span>
          <span>Ongoing</span>
        </div>
        <div class="legend-item">
          <span class="legend-color completed"></span>
          <span>Completed</span>
        </div>
      </div>
    </div>

    <div class="map-container">
      <div ref="mapElement" class="map"></div>
    </div>

    <div class="dataset-info">
      <p class="info-text">
        Showing <strong>{{ filteredDatasets.length }}</strong> of <strong>{{ allDatasets.length }}</strong> datasets
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-facing-decorator';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import { mockDatasetMetadata, mockDatasetGeospatialData } from '@/models/mockData';

@Component({
  name: 'MapView'
})
export default class MapViewComponent extends Vue {
  declare $refs: {
    mapElement: HTMLElement;
  };

  private mapView: MapView | null = null;
  private graphicsLayer: GraphicsLayer | null = null;
  statusFilter: 'all' | 'onGoing' | 'completed' = 'all';

  get allDatasets() {
    return mockDatasetGeospatialData.map(geo => {
      const metadata = mockDatasetMetadata.find(m => m.datasetMetadataID === geo.datasetMetadataID);
      return {
        ...geo,
        title: metadata?.title || 'Unknown Dataset',
        datasetID: metadata?.datasetID || ''
      };
    });
  }

  get filteredDatasets() {
    if (this.statusFilter === 'all') {
      return this.allDatasets;
    }
    return this.allDatasets.filter(d => d.status === this.statusFilter);
  }

  mounted(): void {
    this.initMap();
  }

  @Watch('statusFilter')
  onStatusFilterChange(): void {
    this.updateMapLayers();
  }

  private getColorByStatus(status: string | null): string {
    return status === 'completed' ? '#10b981' : '#3b82f6';
  }

  private initMap(): void {
    const mapElement = this.$refs.mapElement;
    if (!mapElement) return;

    const map = new Map({
      basemap: 'streets-vector'
    });

    this.mapView = new MapView({
      container: mapElement as HTMLDivElement,
      map: map,
      center: [-95, 40],
      zoom: 3
    });

    this.graphicsLayer = new GraphicsLayer();
    map.add(this.graphicsLayer);

    this.updateMapLayers();
  }

  private updateMapLayers(): void {
    if (!this.mapView || !this.graphicsLayer) return;

    this.graphicsLayer.removeAll();

    this.filteredDatasets.forEach(dataset => {
      const polygon = new Polygon({
        rings: [[
          [dataset.westBoundLongitude, dataset.northBoundLatitude],
          [dataset.eastBoundLongitude, dataset.northBoundLatitude],
          [dataset.eastBoundLongitude, dataset.southBoundLatitude],
          [dataset.westBoundLongitude, dataset.southBoundLatitude],
          [dataset.westBoundLongitude, dataset.northBoundLatitude]
        ]]
      });

      const color = this.getColorByStatus(dataset.status);

      const fillSymbol = new SimpleFillSymbol({
        color: [
          parseInt(color.slice(1, 3), 16),
          parseInt(color.slice(3, 5), 16),
          parseInt(color.slice(5, 7), 16),
          0.3
        ],
        outline: new SimpleLineSymbol({
          color: color,
          width: 2
        })
      });

      const popupTemplate = new PopupTemplate({
        title: dataset.title,
        content: `
          <div class="dataset-popup">
            <p><strong>File ID:</strong> ${dataset.fileIdentifier}</p>
            <p><strong>Status:</strong> <span class="status-badge ${dataset.status}">${dataset.status}</span></p>
            <p><strong>Contact:</strong> ${dataset.contact || 'N/A'}</p>
            <p><strong>Temporal Extent:</strong><br/>
              ${dataset.temporalExtentStart ? new Date(dataset.temporalExtentStart).toLocaleDateString() : 'N/A'} -
              ${dataset.temporalExtentEnd ? new Date(dataset.temporalExtentEnd).toLocaleDateString() : 'N/A'}
            </p>
            <p><strong>Standard:</strong> ${dataset.metadataStandard || 'N/A'} ${dataset.standardVersion || ''}</p>
            ${dataset.abstract ? `<p class="abstract">${dataset.abstract}</p>` : ''}
          </div>
        `
      });

      const graphic = new Graphic({
        geometry: polygon,
        symbol: fillSymbol,
        popupTemplate: popupTemplate
      });

      this.graphicsLayer!.add(graphic);
    });
  }
}
</script>

<style scoped>
.map-view {
  width: 100%;
}

.map-header {
  text-align: center;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.map-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.map-subtitle {
  font-size: 1.125rem;
  color: #4a5568;
}

.map-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-label {
  font-weight: 600;
  color: #1a202c;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.filter-btn.active {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.legend {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
}

.legend-color {
  width: 24px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid currentColor;
}

.legend-color.ongoing {
  background-color: rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}

.legend-color.completed {
  background-color: rgba(16, 185, 129, 0.3);
  border-color: #10b981;
}

.map-container {
  width: 100%;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  background: white;
}

.map {
  width: 100%;
  height: 100%;
}

.dataset-info {
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.info-text {
  color: #4a5568;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .map-title {
    font-size: 2rem;
  }

  .map-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .map-container {
    height: 400px;
  }

  .filter-buttons {
    flex-wrap: wrap;
  }
}
</style>

<style>
.dataset-popup {
  padding: 1rem;
  min-width: 280px;
  max-width: 350px;
}

.dataset-popup p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.5;
}

.dataset-popup strong {
  color: #1a202c;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.onGoing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.abstract {
  margin-top: 0.75rem !important;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  font-style: italic;
  max-height: 100px;
  overflow-y: auto;
}
</style>
