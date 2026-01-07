<template>
  <div class="geospatial-mapper">
    <h3 class="section-title">Geographic Extent</h3>

    <div v-if="!boundingBox" class="no-data">
      <p>No geospatial data available for this dataset</p>
    </div>

    <div v-else class="map-container">
      <div ref="mapElement" class="map"></div>

      <div class="coordinates-info">
        <h4>Bounding Box Coordinates</h4>
        <div class="coordinates-grid">
          <div class="coord-item">
            <span class="coord-label">West:</span>
            <span class="coord-value">{{ parsedBox.west }}°</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">East:</span>
            <span class="coord-value">{{ parsedBox.east }}°</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">South:</span>
            <span class="coord-value">{{ parsedBox.south }}°</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">North:</span>
            <span class="coord-value">{{ parsedBox.north }}°</span>
          </div>
        </div>
      </div>

      <div v-if="geospatialData?.abstract" class="abstract-section">
        <h4>Abstract</h4>
        <p>{{ geospatialData.abstract }}</p>
      </div>

      <div v-if="geospatialData?.temporalExtentStart && geospatialData?.temporalExtentEnd" class="temporal-section">
        <h4>Temporal Extent</h4>
        <div class="temporal-range">
          <span>{{ formatDate(geospatialData.temporalExtentStart) }}</span>
          <span class="separator">to</span>
          <span>{{ formatDate(geospatialData.temporalExtentEnd) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-facing-decorator';
import { DatasetGeospatialDataDto } from '@/models/dto.types';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

@Component({
  name: 'GeospatialMapper'
})
export default class GeospatialMapper extends Vue {
  @Prop({ default: null })
  geospatialData!: DatasetGeospatialDataDto | null;

  declare $refs: {
    mapElement: HTMLDivElement;
  };

  private mapView: MapView | null = null;

  get boundingBox(): string | null | undefined {
    return this.geospatialData?.boundingBox;
  }

  get parsedBox(): { west: number; east: number; south: number; north: number } {
    if (!this.boundingBox) {
      return { west: 0, east: 0, south: 0, north: 0 };
    }

    try {
      const box = JSON.parse(this.boundingBox);
      return {
        west: box.west || box.westBoundLongitude || 0,
        east: box.east || box.eastBoundLongitude || 0,
        south: box.south || box.southBoundLatitude || 0,
        north: box.north || box.northBoundLatitude || 0
      };
    } catch (e) {
      console.error('Failed to parse bounding box:', e);
      return { west: 0, east: 0, south: 0, north: 0 };
    }
  }

  mounted(): void {
    if (this.boundingBox) {
      this.initializeMap();
    }
  }

  @Watch('boundingBox')
  onBoundingBoxChange(newVal: string | null | undefined): void {
    if (newVal && !this.mapView) {
      this.initializeMap();
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private async initializeMap(): Promise<void> {
    const mapElement = this.$refs.mapElement;
    if (!mapElement || !this.boundingBox) return;

    const box = this.parsedBox;

    const webMap = new WebMap({
      basemap: 'topo-vector'
    });

    this.mapView = new MapView({
      container: mapElement,
      map: webMap,
      center: [(box.west + box.east) / 2, (box.south + box.north) / 2],
      zoom: 4
    });

    const graphicsLayer = new GraphicsLayer();
    webMap.add(graphicsLayer);

    const polygon = {
      type: 'polygon',
      rings: [
        [
          [box.west, box.north],
          [box.east, box.north],
          [box.east, box.south],
          [box.west, box.south],
          [box.west, box.north]
        ]
      ]
    };

    const fillSymbol = {
      type: 'simple-fill',
      color: [59, 130, 246, 0.3],
      outline: {
        color: [59, 130, 246, 1],
        width: 2
      }
    };

    const polygonGraphic = new Graphic({
      geometry: polygon as any,
      symbol: fillSymbol as any
    });

    graphicsLayer.add(polygonGraphic);

    await this.mapView.goTo({
      target: polygonGraphic,
      zoom: 4
    });
  }
}
</script>

<style scoped>
.geospatial-mapper {
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

.map-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.map {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.coordinates-info {
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.coordinates-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
}

.coordinates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.coord-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
}

.coord-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.coord-value {
  font-size: 0.875rem;
  color: #1a202c;
  font-weight: 600;
  font-family: monospace;
}

.abstract-section,
.temporal-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.abstract-section h4,
.temporal-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.75rem;
}

.abstract-section p {
  color: #4a5568;
  line-height: 1.6;
}

.temporal-range {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9375rem;
  color: #1a202c;
  font-weight: 500;
}

.separator {
  color: #718096;
  font-weight: 400;
}

@media (max-width: 640px) {
  .coordinates-grid {
    grid-template-columns: 1fr;
  }
}
</style>
