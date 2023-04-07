import { observable, action, computed } from "mobx-angular";
import { SubMenuItem, CustomDate } from 'src/app/core/models/general/sub-menu.model';

class Store {

    @observable
    subMenuItems: SubMenuItem[];

    @observable
    startEndDate: CustomDate = {} as CustomDate;

    @observable
    clikedSubMenuItem: SubMenuItem = null;

    filterDateObject: any;

    @observable
    start: any;

    @observable
    end: any;

    @observable
    no_user_tab: boolean = false;

    @observable
    userGridSystem: boolean =false;

    @observable
    exportClicked: boolean = false;

    @observable
    importClicked: boolean = false;

    @observable
    cancelClicked: boolean = false;

    @observable
    gotoIncidentClicked: boolean = false;

    @observable
    templateClicked: boolean = false;
    
    @observable
    publishClicked:boolean=false;

    @observable
    markAuditClicked:boolean=false;

    @observable
    markCompletedClicked:boolean=false;

    @observable
    unmarkAuditClicked:boolean=false;

    @observable
    closeRiskClicked:boolean=false;

    @observable
    closeTreatmentClicked:boolean=false;
    
    @observable
    closeClicked:boolean=false;

    @observable
    applyToUsersClicked:boolean=false;
    
    @observable
    acceptClicked:boolean=false

    @observable
    dateFilterClicked: boolean = false;

    @observable
    searchText: string = '';

    @observable
    datefilterValue: string = '';

    @observable
    submitClicked: boolean = false;

    @observable
    approveClicked: boolean = false;

    @observable
    revertClicked: boolean = false;

    @observable
    gridTitle='list_view';

    @action
    setNoUserTab(status: boolean) {
        this.no_user_tab = status;
    }

    @action
    setSubMenuItems(items: SubMenuItem[]) {
        this.subMenuItems = items;
    }

    @action
    setCustomDate(items: any) {
        this.startEndDate = items;
    }

    @action
    unsetCustomDate() {
        this.startEndDate = {} as CustomDate;
    }

    @action
    addSubMenu(item){
        var pos = this.subMenuItems.findIndex(e=>e.type == item.type);
        if(pos == -1) this.subMenuItems.push(item);
        // console.log(this.subMenuItems);
    }

    @action
    removeSubMenu(type){
        var pos = this.subMenuItems.findIndex(e=>e.type == type);
        if(pos != -1) this.subMenuItems.splice(pos,1);
        // console.log(this.subMenuItems);
    }

    @action
    makeEmpty() {
        this.subMenuItems = [];
        this.submitClicked = false;
        this.approveClicked = false;
        this.revertClicked = false;
        this.exportClicked = false;
        this.importClicked = false;
    }

    @action
    setClickedSubMenuItem(item: SubMenuItem) {
        this.clikedSubMenuItem = item;
    }

    @action
    unSetClickedSubMenuItem() {
        this.clikedSubMenuItem = null;
    }

    @action
    setSearchText(searchText){
        this.searchText = searchText;
    }

    @action
    setDatefilterValue(datefilterValue){
        this.datefilterValue = datefilterValue;
    }

    @action
    unsetDatefilterValue(){
        this.datefilterValue = '';
    }

    @computed
    get DatefilterValue(): any {
        return this.datefilterValue;
    }

    @computed
    get getStartEndDate(): any {
        return this.startEndDate;
    }

    @action
    unsetSearchText(){
        this.searchText = '';
    }
}

export const SubMenuItemStore = new Store();