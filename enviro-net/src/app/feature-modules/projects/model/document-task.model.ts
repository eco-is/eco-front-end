import { DocumentProgress } from "./document-progress.model";
import { Task } from "./task.model";

export interface DocumentTask {
    documentId: number;
    projectId: number;
    version: number;
    projectName: string;
    documentName: string;
    progress: DocumentProgress;
    task: Task;
}
