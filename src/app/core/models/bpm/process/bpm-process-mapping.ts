import { AssetRegister } from "../../asset-management/asset-register/asset-register";
import { OrganizationIssues } from "../../compliance-management/compliance-mapping/compliance-mapping";
import { ComplianceRegister } from "../../compliance-management/compliance-register/compliance-register";
import { Incident } from "../../incident-management/incident/incident";
import { IndividualMeetings } from "../../mrm/meetings/meetings";
import { Products } from "../../organization/business_profile/business-products";
import { BusinessServices } from "../../organization/business_profile/business-services";
import { Trainings } from "../../training/trainings/trainings.model";
import { IndividualKpi } from "../../kpi-management/kpi/kpi";


export interface BpmProcessMapping {
    id: number;
    title: string;
    issues: OrganizationIssues[];
    products: Products[];
    processAssets: AssetRegister[];
    services:BusinessServices[];
    compliances:ComplianceRegister[];
    incidents:Incident[];
    mrm:IndividualMeetings[];
    trainings:Trainings[];
    kpis:IndividualKpi[];
    controls: any;

}