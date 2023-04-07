import { observable, action, computed } from "mobx-angular"
import { DashboardCount, DocumentByStatuses, DocumentByTypes, DocumentByDepartments, DocumentCRByStatuses , DocumentByPriority } from 'src/app/core/models/knowledge-hub/dashboard/kh-dashboard'

class Store {

    @observable
    private dashboardCounts: DashboardCount

    @observable
    private documentByStatuses: DocumentByStatuses[] = []

    @observable
    private documentByTypes: DocumentByTypes[] = []

    @observable
    private documentByDepartments: DocumentByDepartments[] = []

    @observable
    private documentByCRStatuses: DocumentCRByStatuses[] = []

    @observable
    private documentByPriority: DocumentByPriority[] = []

    @observable
    dashboard_loaded: boolean = false

    @action
    setDashboardCount(response: DashboardCount) {
        this.dashboardCounts = response
    }

    @computed
    get dashboardCount(): DashboardCount {
        return this.dashboardCounts
    }

    @action
    setDocumentByStatuses(response) {
        this.documentByStatuses = response
    }
    @action
    unSetDocumentByStatuses() {
        this.documentByStatuses = null
        this.dashboard_loaded = false
    }

    @computed
    get documentStatuses() {
        return this.documentByStatuses
    }

    @action
    setDocumentByTypes(response) {
        this.documentByTypes = response
    }

    @computed
    get documentTypes() {
        return this.documentByTypes
    }

    @action
    setDocumentByDepartment(response) {
        this.documentByDepartments = response
    }

    @computed
    get documentDepartment() {
        return this.documentByDepartments
    }

    @action
    setDocumentCRByStatuses(response) {
        this.documentByCRStatuses = response
    }

    @computed
    get documentCRStatuses() {
        return this.documentByCRStatuses
    }

    @action
    setDocumentByPriority(response) {
        this.documentByPriority = response
    }

    @computed
    get documentPriority() {
        return this.documentByPriority
    }

}

export const KhDashboardStore = new Store()