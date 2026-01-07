<template>
  <div class="etl-panel">
    <h3 class="etl-title">ETL Controls</h3>

    <div class="etl-actions">
      <button
        class="etl-button primary"
        :disabled="isProcessingAll"
        @click="processAll"
      >
        {{ isProcessingAll ? 'Processing all…' : 'Process All Datasets' }}
      </button>
    </div>

    <div class="etl-row">
      <input
        v-model="identifier"
        class="etl-input"
        placeholder="Dataset identifier"
        :disabled="isProcessingOne"
      />
      <button
        class="etl-button"
        :disabled="isProcessingOne || !identifier"
        @click="processOne"
      >
        {{ isProcessingOne ? 'Processing…' : 'Process Identifier' }}
      </button>
    </div>

    <p v-if="validationMessage" class="etl-message warning">
      {{ validationMessage }}
    </p>
    <p v-if="processMessage" class="etl-message info">
      {{ processMessage }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { namespace } from '@/store/StoreDecorators';
import { Modules } from '@/store/StoreModuleTypes';
import { DatasetActionTypes, DatasetMutationTypes } from '@/store/modules/datasetMetadata/DatasetMetadataTypes';

const DatasetMetadata = namespace(Modules.DatasetMetadata);

@Component({ name: 'EtlControls' })
export default class EtlControls extends Vue {
  private identifier: string = '';

  @DatasetMetadata.State((s: any) => s.isProcessingAll) public readonly isProcessingAll!: boolean;
  @DatasetMetadata.State((s: any) => s.isProcessingOne) public readonly isProcessingOne!: boolean;
  @DatasetMetadata.State((s: any) => s.processMessage) public readonly processMessage!: string | null;
  @DatasetMetadata.State((s: any) => s.validationMessage) public readonly validationMessage!: string | null;

  @DatasetMetadata.Action(DatasetActionTypes.PROCESS_ALL) public processAllAction!: () => Promise<void>;
  @DatasetMetadata.Action(DatasetActionTypes.PROCESS_IDENTIFIER) public processIdentifierAction!: (id: string) => Promise<void>;
  @DatasetMetadata.Mutation(DatasetMutationTypes.SET_VALIDATION_MESSAGE) public setValidationMessage!: (msg: string | null) => void;

  public async processAll(): Promise<void> {
    this.setValidationMessage(null);
    await this.processAllAction();
  }

  public async processOne(): Promise<void> {
    if (!this.identifier) {
      this.setValidationMessage('Identifier is required.');
      return;
    }

    this.setValidationMessage(null);
    await this.processIdentifierAction(this.identifier);
  }
}
</script>

<style scoped>
.etl-panel {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  max-width: 520px;
}

.etl-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.etl-actions {
  margin-bottom: 1rem;
}

.etl-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.etl-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 0.95rem;
}

.etl-button {
  padding: 0.75rem 1.1rem;
  border: none;
  border-radius: 8px;
  background: #edf2f7;
  color: #2d3748;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.etl-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.etl-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.etl-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

.etl-message {
  margin: 0.25rem 0 0 0;
  font-size: 0.95rem;
}

.etl-message.warning {
  color: #b7791f;
}

.etl-message.info {
  color: #2b6cb0;
}
</style>

