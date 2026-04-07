/**
 * Types defining the structure of our modular knowledge node data payload.
 */

export interface ActualData {
  topic: string;
  heading: string;
  paragraph: string;
}

export interface DataSectionData {
  tags: string[];
  summary: string;
  actualData: ActualData;
}

export interface LinkSectionData {
  // To be implemented in the next phase
  links?: string[];
}

export interface KnowledgeNodeData extends Record<string, unknown> {
  entityId: string;
  dataSection: DataSectionData;
  linkSection?: LinkSectionData;
  size?: 'sm' | 'default';
}
