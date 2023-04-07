import { observable, action, computed } from "mobx-angular"
import { DashboardCount, DocumentByStatuses, DocumentByTypes, DocumentByDepartments, DocumentCRByStatuses , DocumentByPriority } from 'src/app/core/models/knowledge-hub/dashboard/kh-dashboard'
import { EventBudgetByYears, EventStatuses , MilestoneMonth, TaskCount } from 'src/app/core/models/event-monitoring/event-dashboard/event-dashboard'

class Store {

    @observable
    private eventStatuses: EventStatuses[]

    @observable
    private eventTaskCount: TaskCount

    @observable
    private eventCountList: TaskCount

    @observable
    private eventTaskByStatuses: EventStatuses[] = []

    @observable
    private eventByDepartments: EventStatuses[] = []

    @observable
    private eventTypes: EventStatuses[] = []

    @observable
    private eventYears: EventStatuses[] = []

    @observable
    private milestoneMonths: MilestoneMonth[] = []

    @observable
    private milestoneDepartments: MilestoneMonth[] = []

    @observable
    private budgetDepartments:EventStatuses[] = []

    @observable
    private budgetYears:EventBudgetByYears[] = []

    @observable
    private closureStatuses:EventStatuses[] = []

    @observable
    private closureDepartments:EventStatuses[] = []

    @observable
    private crStatuses:EventStatuses[] = []

    @observable
    private crDepartments:EventStatuses[] = []

    @observable
    dashboard_loaded: boolean = false
    
    @observable
    dashboardParam: string = null;
    
    @action
    setEventByStatuses(response: EventStatuses[]) {
        this.eventStatuses = response
    }

    @computed
    get dashboardCount(): EventStatuses[] {
        return this.eventStatuses
    }

    @action
    setTaskCount(response:TaskCount) {
        this.eventTaskCount = response
    }

    @computed
    get taskCount():TaskCount{
        return this.eventTaskCount
    }

    @action
    setEventCount(response:TaskCount) {
        this.eventCountList = response
    }

    @computed
    get eventCount():TaskCount{
        return this.eventCountList
    }

    @action
    setTaskByStatuses(response:EventStatuses[]) {
        this.eventTaskByStatuses = response
    }

    @computed
    get taskByStatuses():EventStatuses[] {
        return this.eventTaskByStatuses
    }

    @action
    setEventByDepartments(response:EventStatuses[]) {
        this.eventByDepartments = response
    }

    @computed
    get eventDepartments():EventStatuses[] {
        return this.eventByDepartments
    }

    @action
    setEventByTypes(response:EventStatuses[]) {
        this.eventTypes = response
    }

    @computed
    get eventByTypes():EventStatuses[] {
        return this.eventTypes
    }

    @action
    setEventByYears(response) {
        this.eventYears = response
    }

    @computed
    get eventByYears() {
        return this.eventYears
    }

    @action
    setMilestoneByMonths(response) {
        this.milestoneMonths = response
    }

    @computed
    get milestoneByMonths() {
        return this.milestoneMonths
    }

    @action
    setMilestoneByDepartments(response) {
        this.milestoneDepartments = response
    }

    @computed
    get milestoneByDepartments() {
        return this.milestoneDepartments
    }

    @action
    setEventClosureByStatuses(response:EventStatuses[]) {
        this.closureStatuses = response
    }

    @computed
    get eventClosureByStatuses():EventStatuses[] {
        return this.closureStatuses
    }

    @action
    setEventClosureByDepartments(response:EventStatuses[]) {
        this.closureDepartments = response
    }

    @computed
    get eventClosureByDepartments():EventStatuses[] {
        return this.closureDepartments
    }

    @action
    setEventCRByStatuses(response:EventStatuses[]) {
        this.crStatuses = response
    }

    @computed
    get eventCRByStatuses():EventStatuses[] {
        return this.crStatuses
    }

    @action
    setEventCRByDepartments(response:EventStatuses[]) {
        this.crDepartments = response
    }

    @computed
    get eventCRByDepartments():EventStatuses[] {
        return this.crDepartments
    }

    @action
    setEventBudgetByDepartments(response) {
        this.budgetDepartments = response
    }

    @computed
    get budgetByDepartments() {
        return this.budgetDepartments
    }

    @action
    setEventBudgetByYears(response) {
        this.budgetYears = response
    }

    @computed
    get budgetByYears() {
        return this.budgetYears
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

export const EventDashboardStore = new Store()