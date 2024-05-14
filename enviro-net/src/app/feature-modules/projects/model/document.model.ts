import { DocumentProgress } from "./document-progress.model";

export interface Document {
    documentId: number; 
    projectId: number;
    name: string;
    progress: DocumentProgress;    
}
