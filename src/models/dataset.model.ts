export interface DatasetMetadata {
  datasetMetadataID: number;
  datasetID: string;
  fileIdentifier: string;
  title: string | null;
  description: string | null;
  publicationDate: string;
  metaDataDate: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface DatasetGeospatialData {
  datasetGeospatialDataID: number;
  datasetMetadataID: number;
  fileIdentifier: string;
  abstract: string | null;
  temporalExtentStart: string | null;
  temporalExtentEnd: string | null;
  westBoundLongitude: number;
  eastBoundLongitude: number;
  southBoundLatitude: number;
  northBoundLatitude: number;
  contact: string | null;
  metadataStandard: string | null;
  standardVersion: string | null;
  status: string | null;
}

export interface DataFile {
  dataFileID: number;
  datasetMetadataID: number;
  fileIdentifier: string;
  title: string | null;
  description: string | null;
  type: string | null;
  fileType: string | null;
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface SupportingDocument {
  supportingDocumentID: number;
  datasetMetadataID: number;
  fileIdentifier: string;
  title: string | null;
  description: string | null;
  type: string | null;
  documentType: string | null;
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface DatasetSupportingDocumentQueue {
  datasetSupportingDocumentQueueID: number;
  datasetMetadataID: number;
  processedTitleForEmbedding: boolean;
  processedAbstractForEmbedding: boolean;
  processedSupportingDocsForEmbedding: boolean;
  isProcessing: boolean;
  createdAt: string;
  updatedAt: string | null;
  lastUpdatedAt: string | null;
}

export interface DatasetRelationship {
  datasetRelationshipID: number;
  datasetMetadataID: number;
  datasetID: string;
  relationshipType: string;
  relationshipUri: string | null;
}

export interface Dataset {
  id: string;
  fileIdentifier: string;
  title: string;
  abstract: string;
  metadataDate: Date;
  resourceType: string;
  topicCategories: string[];
  keywords: Keyword[];
  geographicExtent?: GeographicExtent;
  temporalExtent?: TemporalExtent;
  pointOfContact?: Contact;
  distributionFormats: DistributionFormat[];
  onlineResources: OnlineResource[];
  dataQuality?: DataQuality;
  lineage?: string;
  spatialResolution?: string;
  accessConstraints?: string[];
  useConstraints?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Keyword {
  value: string;
  vocabulary?: string;
}

export interface GeographicExtent {
  westBoundLongitude: number;
  eastBoundLongitude: number;
  southBoundLatitude: number;
  northBoundLatitude: number;
  description?: string;
}

export interface TemporalExtent {
  startDate: Date;
  endDate?: Date;
}

export interface Contact {
  organizationName: string;
  individualName?: string;
  positionName?: string;
  role: string;
  email?: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  deliveryPoint?: string;
  city?: string;
  administrativeArea?: string;
  postalCode?: string;
  country?: string;
}

export interface DistributionFormat {
  name: string;
  version?: string;
}

export interface OnlineResource {
  url: string;
  protocol?: string;
  name?: string;
  description?: string;
  function?: 'download' | 'information' | 'offlineAccess' | 'order' | 'search' | 'fileAccess';
}

export interface DataQuality {
  scope: string;
  lineage?: string;
}
