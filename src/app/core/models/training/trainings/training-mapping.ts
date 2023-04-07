import { AssetRegister } from "../../asset-management/asset-register/asset-register";
import { OrganizationIssues } from "../../compliance-management/compliance-mapping/compliance-mapping";
import { ComplianceRegister } from "../../compliance-management/compliance-register/compliance-register";
import { Incident } from "../../incident-management/incident/incident";
import { IndividualMeetings } from "../../mrm/meetings/meetings";
import { Products } from "../../organization/business_profile/business-products";
import { BusinessServices } from "../../organization/business_profile/business-services";
import { Trainings } from "./trainings.model";

export interface TrainingMapping {
    id: number;
    title: string;
    issues: OrganizationIssues[];
    products: Products[];
    assets: AssetRegister[];
    services:BusinessServices[];
    compliances:ComplianceRegister[];
    incidents:Incident[];
    meetings:IndividualMeetings[];
    // trainings:Trainings[];
}