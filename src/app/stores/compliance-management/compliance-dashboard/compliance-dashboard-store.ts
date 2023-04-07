import { ComplianceByProducts, ComplianceChartDetails, ComplianceCount, ComplianceRequirementType, ComplianceStatusCountByStatus, LevelOfCompliance, SlaByProducts, SlaContractByCategory, SlaContractChartDetails, SlaContractDocumentStatus } from "src/app/core/models/compliance-management/compliance-dashboard/compliance-dashboard";
import { observable, action, computed } from "mobx-angular";
class Store {


    @observable
    private _complianceCountDetails: ComplianceCount;

    @observable
    private _complianceStatusCountByStatus: ComplianceStatusCountByStatus[] = [];

    @observable
    private _slaContractByCategory: SlaContractByCategory[] = [];

    
    @observable
    private _slaContractDocumentStatus: SlaContractDocumentStatus[] = [];

    @observable
    private _complianceRequirementType: ComplianceRequirementType[] = [];

    @observable
    private _complianceChartDetails: ComplianceChartDetails[] = [];

    @observable
    private _slaContractChartDetails: SlaContractChartDetails[] = [];

    @observable
    private _levelOfCompliance: LevelOfCompliance[] = [];

    @observable
    private _complianceByProducts: ComplianceByProducts[] = [];

    @observable
    private _slaByProducts: SlaByProducts[] = [];

    @observable
    dashboardLoaded: boolean = false;

    @observable
    dashboardParam: string = null;

    @action
    setComplianceCountDetails(response: ComplianceCount) {
        this._complianceCountDetails = response; 
    }

    @action
    setComplianceStatusCountByStatus(response: ComplianceStatusCountByStatus[]) {
        this._complianceStatusCountByStatus = response;
    }

    @action
    setSlaContractByCategory(response: SlaContractByCategory[]) {
        this._slaContractByCategory = response;
    }

    @action
    setSlaContractDocumentStatus(response: SlaContractDocumentStatus[]) {
        this._slaContractDocumentStatus = response;
    }

    @action
    setComplianceRequirementType(response: ComplianceRequirementType[]) {
        this._complianceRequirementType = response;
    }

    @action
    setComplianceChartDetails(response: ComplianceChartDetails[]) {
        this._complianceChartDetails = response;
    }

    @action
    setSlaContractChartDetails(response: SlaContractChartDetails[]) {
        this._slaContractChartDetails = response;
    }

    @action
    setLevelOfCompliance(response: LevelOfCompliance[]) {
        this._levelOfCompliance = response;
    }

    @action
    setCompliaceByProducts(respose: ComplianceByProducts[]){
        this._complianceByProducts = respose;
    }

    @action
    setSlaByProducts(response: SlaByProducts[]){
        this._slaByProducts = response;
    }

    @computed
    get complianceByProducts(): ComplianceByProducts[]{
        return this._complianceByProducts;
    }

    @computed
    get slaByProducts(): SlaByProducts[]{
        return this._slaByProducts;
    }

    @computed
    get ComplianceCount():ComplianceCount{
        return this._complianceCountDetails;
    }

    @computed
    get ComplianceStatusCountByStatus():ComplianceStatusCountByStatus[]{
        return this._complianceStatusCountByStatus.slice();
    }

    @computed
    get SlaContractByCategory():SlaContractByCategory[]{
        return this._slaContractByCategory.slice();
    }

    @computed
    get SlaContractDocumentStatus():SlaContractDocumentStatus[]{
        return this._slaContractDocumentStatus.slice();
    }

    @computed
    get ComplianceRequirementType():ComplianceRequirementType[]{
        return this._complianceRequirementType.slice();
    }

    @computed
    get ComplianceChartDetails():ComplianceChartDetails[]{
        return this._complianceChartDetails.slice();
    }

    @computed
    get SlaContractChartDetails():SlaContractChartDetails[]{
        return this._slaContractChartDetails.slice();
    }

    @computed
    get LevelOfCompliance():LevelOfCompliance[]{
        return this._levelOfCompliance.slice();
    }

    @action
    setDashboardParam(param:string){
        this.dashboardParam = param
    }

    @computed
    get dashboardParameter(){
        return this.dashboardParam;
    }

    @action
    unsetDashboardParam() {
        this.dashboardParam = null;
    }


}

export const ComplianceDashboardStore = new Store();