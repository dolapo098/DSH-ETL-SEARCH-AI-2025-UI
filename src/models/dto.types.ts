export class SearchResultItem {
  identifier: string = '';
  title: string = '';
  description: string = '';
  score: number = 0;

  constructor(data?: Partial<SearchResultItem>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class DatasetMetadataResultDto {
  datasetMetadataID: number = 0;
  datasetID: string = '';
  fileIdentifier: string = '';
  title: string | null = null;
  description: string | null = null;
  publicationDate: string = '';
  metaDataDate: string = '';
  createdAt: string = '';
  updatedAt: string | null = null;

  constructor(data?: Partial<DatasetMetadataResultDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class DatasetGeospatialDataDto {
  datasetGeospatialDataID: number = 0;
  abstract: string | null = null;
  temporalExtentStart: string | null = null;
  temporalExtentEnd: string | null = null;
  boundingBox: string | null = null;
  contact: string | null = null;
  metadataStandard: string | null = null;
  standardVersion: string | null = null;
  status: string | null = null;

  constructor(data?: Partial<DatasetGeospatialDataDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class DataFileDto {
  dataFileID: number = 0;
  title: string | null = null;
  description: string | null = null;
  type: string | null = null;
  fileType: string | null = null;
  downloadUrl: string | null = null;

  constructor(data?: Partial<DataFileDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class SupportingDocumentDto {
  supportingDocumentID: number = 0;
  title: string | null = null;
  downloadUrl: string | null = null;
  documentType: string | null = null;

  constructor(data?: Partial<SupportingDocumentDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class DatasetRelationshipDto {
  datasetRelationshipID: number = 0;
  datasetID: string = '';
  relationshipType: string | null = null;
  relationshipUri: string | null = null;

  constructor(data?: Partial<DatasetRelationshipDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class RawMetadataDocumentDto {
  metadataDocumentID: number = 0;
  documentType: string = '';
  rawDocument: string = '';

  constructor(data?: Partial<RawMetadataDocumentDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class DiscoveryStatsDto {
  totalDatasets: number = 0;
  totalProviders: number = 0;

  constructor(data?: Partial<DiscoveryStatsDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class ProcessResultDto {
  isSuccess: boolean = true;
  message: string = '';
  filePath?: string | null;
  error?: string | null;

  constructor(data?: Partial<ProcessResultDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class DatasetFullDetailsDto {
  datasetMetadata: DatasetMetadataResultDto;
  geospatialData: DatasetGeospatialDataDto | null = null;
  dataFiles: DataFileDto[] = [];
  supportingDocuments: SupportingDocumentDto[] = [];
  relationships: DatasetRelationshipDto[] = [];
  rawDocuments: RawMetadataDocumentDto[] = [];

  constructor(data?: Partial<DatasetFullDetailsDto>) {
    this.datasetMetadata = new DatasetMetadataResultDto();
    if (data) {
      if (data.datasetMetadata) {
        this.datasetMetadata = new DatasetMetadataResultDto(data.datasetMetadata);
      }
      if (data.geospatialData) {
        this.geospatialData = new DatasetGeospatialDataDto(data.geospatialData);
      }
      if (data.dataFiles) {
        this.dataFiles = data.dataFiles.map(f => new DataFileDto(f));
      }
      if (data.supportingDocuments) {
        this.supportingDocuments = data.supportingDocuments.map(d => new SupportingDocumentDto(d));
      }
      if (data.relationships) {
        this.relationships = data.relationships.map(r => new DatasetRelationshipDto(r));
      }
      if (data.rawDocuments) {
        this.rawDocuments = data.rawDocuments.map(rd => new RawMetadataDocumentDto(rd));
      }
    }
  }
}
