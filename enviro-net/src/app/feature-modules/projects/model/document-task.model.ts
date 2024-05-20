import { DocumentProgress } from "./document-progress.model";

export interface DocumentTask {
    documentId: number;
    projectId: number;
    name: string;
    progress: DocumentProgress;
    task: number;
}
