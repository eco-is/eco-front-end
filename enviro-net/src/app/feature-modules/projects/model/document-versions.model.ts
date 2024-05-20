import { DocumentProgress } from "./document-progress.model";

export interface DocumentVersions {
    documentName: string;
    versions: number[];
    progress: DocumentProgress;
}
