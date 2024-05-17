import { DocumentProgress } from "./document-progress.model";
import { TeamMember } from "./team-member.model";

export interface Document {
    documentId: number; 
    projectId: number;
    name: string;
    progress: DocumentProgress;  
    writers?: TeamMember[];
    reviewers?: TeamMember[];
}
