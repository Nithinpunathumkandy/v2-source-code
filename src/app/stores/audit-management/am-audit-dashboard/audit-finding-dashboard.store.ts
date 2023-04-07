import { action, computed, observable } from "mobx";
import { AMAuditCount, AmAuditFindingCountByStatuses, AmAuditProgramCountByCategory, AmAuditFindingCountByDepartments, AmAnnualPlanCountByAuditors, AmAnnualPlanCountByDepartments, AmAnnualPlanCountByYears, AmAuditCorrectiveActionCountByStatuses, AuditStatuses, FindingCount } from "src/app/core/models/audit-management/am-audit-dashboard/am-audit-dashboard";

class Store {

    @observable
    _findingsCount: FindingCount

    @observable
    _findingCountByStatuses: AmAuditFindingCountByStatuses[] = []

    @observable
    _programCountByCategory: AmAuditProgramCountByCategory[] = []

    @observable
    _findingCountByDepartments: AmAuditFindingCountByDepartments[] = []

    @observable
    _findingCountByYears: AmAuditFindingCountByDepartments[] = []

    @observable
    _annualPlanCountByAuditors: AmAnnualPlanCountByAuditors[] = []

    @observable
    _annualPlanCountByDepartments: AmAnnualPlanCountByDepartments[] = []

    @observable
    _anualPlanCountByYears: AmAnnualPlanCountByYears[] = []

    @observable
    _caCountByStatuses: AmAuditCorrectiveActionCountByStatuses[] = []

    @observable
    _auditStatuses: AuditStatuses[] = []

    @observable
    _auditPlan

    @observable
    _findingRiskRating: AuditStatuses[] = []

    @observable
    _auditDepartment: AuditStatuses[] = []

    @observable
    _correctiveAction: AuditStatuses[] = []

    @observable
    _impactAnalysis: AuditStatuses[] = []

    @observable
    dashboardParam: string = null;

    @observable
    _topFindings

    @observable
    commonLoader: boolean = false

    @observable
    loaded: boolean = false

    @action
    setFindingsCount(res: FindingCount) {
        this.commonLoader = true
        this._findingsCount = res
    }

    @computed
    get findingsCount(): FindingCount {
        return this._findingsCount
    }

    @action
    setProgramCountByCategory(res: AmAuditProgramCountByCategory[]) {
        this.commonLoader = true
        this._programCountByCategory = res
    }

    @computed
    get programCountByCategory() {
        return this._programCountByCategory
    }

    @action
    setFindingCountByStatuses(res: AmAuditFindingCountByStatuses[]) {
        this.commonLoader = true
        this._findingCountByStatuses = res
    }

    @computed
    get findingCountByStatuses() {
        return this._findingCountByStatuses
    }

    @action
    setFindingCountByDepartments(res: AmAuditFindingCountByDepartments[]) {
        this.commonLoader = true
        this._findingCountByDepartments = res
    }

    @computed
    get findingCountByDepartments() {
        return this._findingCountByDepartments
    }

    @action
    setFindingCountByYears(res: AmAuditFindingCountByDepartments[]) {
        this.commonLoader = true
        this._findingCountByYears = res
    }

    @computed
    get findingCountByYears() {
        return this._findingCountByYears
    }

    @action
    setPlanCountByAuditors(res: AmAnnualPlanCountByAuditors[]) {
        this.commonLoader = true
        this._annualPlanCountByAuditors = res
    }

    @computed
    get planCountByAuditors(): AmAnnualPlanCountByAuditors[] {
        return this._annualPlanCountByAuditors
    }

    @action
    setPlanCountByDepartments(res: AmAnnualPlanCountByDepartments[]) {
        this.commonLoader = true
        this._annualPlanCountByDepartments = res
    }

    @computed
    get planCountByDepartments(): AmAnnualPlanCountByDepartments[] {
        return this._annualPlanCountByDepartments
    }

    @action
    setPlanCountByYears(res: AmAnnualPlanCountByYears[]) {
        this.commonLoader = true
        this._anualPlanCountByYears = res
    }

    @computed
    get planCountByYears() {
        return this._anualPlanCountByYears
    }

    @action
    setCorrectiveActionCountByStatuses(res: AmAuditCorrectiveActionCountByStatuses[]) {
        this.commonLoader = true
        this._caCountByStatuses = res
    }

    @computed
    get caCountByStatuses(): AmAuditCorrectiveActionCountByStatuses[] {
        return this._caCountByStatuses
    }

    @action
    setDashboardParam(param: string) {
        this.commonLoader = true
        this.dashboardParam = param
    }

    @action
    unsetDashboardParam() {
        this.dashboardParam = null;
    }

    @computed
    get DashboardParameter() {
        return this.dashboardParam;
    }

    @action
    setAuditStatuses(res: AuditStatuses[]) {
        this.commonLoader = true
        this._auditStatuses = res
    }

    @computed
    get getAuditStatuses(): AuditStatuses[] {
        return this._auditStatuses
    }

    @action
    setAuditPlan(res) {
        this.commonLoader = true
        this._auditPlan = res
    }

    @computed
    get getAuditPlan() {
        return this._auditPlan
    }

    @action
    setFindingRiskRating(res: AuditStatuses[]) {
        this.commonLoader = true
        this._findingRiskRating = res
    }

    @computed
    get getFindingRiskRating(): AuditStatuses[] {
        return this._findingRiskRating
    }

    @action
    setAuditDepartment(res: AuditStatuses[]) {
        this.commonLoader = true
        this._auditDepartment = res
    }

    @computed
    get getAuditDepartment(): AuditStatuses[] {
        return this._auditDepartment
    }

    @action
    setCorrectiveAction(res) {
        this.commonLoader = true
        this._correctiveAction = res
    }

    @computed
    get getCorrectiveAction() {
        return this._correctiveAction
    }

    @action
    setImpactAnalysis(res) {
        this.commonLoader = true
        this._impactAnalysis = res
    }

    @computed
    get getImpactAnalysis() {
        return this._impactAnalysis
    }

    @action
    setTopFindings(res){
        this.loaded = true
        this._topFindings = res
    }

    @computed
    get getTopFindings(){
        return this._topFindings
    }

    @action
    unsetDashboardData() {
        this.commonLoader = false
        this._findingsCount = null
        this._caCountByStatuses = []
        this._anualPlanCountByYears = []
        this._annualPlanCountByDepartments = []
        this._annualPlanCountByAuditors = []
        this._findingCountByDepartments = []
        this._findingCountByStatuses = []
        this._programCountByCategory = []
    }

}
export const AuditFindingDashboardStore = new Store();