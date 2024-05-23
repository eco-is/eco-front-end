import { DocumentProgress } from "./document-progress.model";

export interface DocumentVersions {
    projectName: string;
    documentName: string;
    versions: number[];
    progress: DocumentProgress;
}
