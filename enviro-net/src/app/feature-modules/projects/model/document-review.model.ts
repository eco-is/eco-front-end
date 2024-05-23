import { TeamMember } from "./team-member.model";

export interface DocumentReview {
    version: number;
    reviewDate: Date;
    reviewer: TeamMember;
    comment: string;
    isApproved: boolean;
}
