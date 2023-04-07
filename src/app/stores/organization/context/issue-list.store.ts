import { observable, action, computed } from "mobx-angular";
import { IssueList, IssueListResponse, IssueDetails, Issue } from 'src/app/core/models/organization/context/issue-list';

class Store {

    @observable
    private _issueList: IssueList[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: string = 'desc';

    @observable
    orderItem: string = 'organization_issues.created_at';

    @observable
    selectedIssueId: number

    @observable
    selectedIssue: IssueDetails;

    @observable
    selected_issue_loaded = false;

    @observable
    issue_form_modal: boolean = false;

    @observable
    issue_type_form_modal: boolean = false;

    @observable
    stakeholder_form_modal: boolean = false;

    @observable
    issue_category_form_modal: boolean = false;

    @observable
    issue_domain_form_modal: boolean = false;

    @observable
    processes_form_modal: boolean = false;

    @observable
    needs_expectation_form_modal: boolean = false;

    @observable
    issue_select_form_modal: boolean = false;

    @observable
    selectedMsTypes:any[] = [];

    @observable
    selectedStakeHolderType = null;

    selectedNeedsExpectations: any[] = [];

    @observable
    selectedIssueLists: IssueList [] = [];

    @observable
    multipleSelectionObject:Array<{allIssues:boolean, pageNumber: number}>;

    @observable // String to perform Search on
    searchText: string = '';

    @observable
    selectedIssuesList: any[] = [];

    @observable
    issuesToDisplay: any = [];

    @observable
  saveSelected: boolean = false;

    @action
    setIssueListDetails(response: IssueListResponse) {
        this._issueList = response.data;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.currentPage = response.current_page;
        //this.processIssueList();
        this.loaded = true;
    }

    @action
    processIssueList(){
        for(let i of this._issueList){
            if(i.hasOwnProperty('ms_types') && i.ms_types != ''){
                i['ms_types_list'] = i.ms_types.split(',');
            }
        }
    }

    @computed
    get issueListDetails(): IssueList[] {
        return this._issueList.slice();
    }

    getIssueListById(id: number): IssueList {
        return this._issueList.slice().find(e => e.id == id);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    unsetIssueList(){
        this._issueList = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setSelectedIssueId(id: number){
        this.selectedIssueId = id;
    }

    @computed
    get selectedId(): number{
        return this.selectedIssueId;
    }

    @action
    setIssueDetails(issue: IssueDetails){
        this.selectedIssue = issue;
        this.selected_issue_loaded = true;
    }

    @computed
    get selectedIssueData(): IssueDetails{
        return this.selectedIssue;
    }

    @action
    unsetIssueDetails(){
        this.selected_issue_loaded = false;
        this.selectedIssue = null;
        this.selectedNeedsExpectations = [];
    }

    @action
    selectMsType(msType){
        var pos = this.selectedMsTypes.findIndex( e=> e.id == msType.id);
        if(pos != -1){
          this.selectedMsTypes.splice(pos,1);
        }
        else{
          this.selectedMsTypes.push(msType);
        }
    }

    findSelectedMsTypes(msTypeId: number){
        return this.selectedMsTypes.findIndex( e=> e.id == msTypeId);
    }

    @action
    setSelectedIssueList(issue){
        var pos = this.selectedIssueLists.findIndex( e=> e.id == issue.id);
        if(pos != -1){
          this.selectedIssueLists.splice(pos,1);
        }
        else{
          this.selectedIssueLists.push(issue);
        }
    }

    @action
    unsetSelectedIssueList(){
        for(let i of this._issueList){
            i.checked = false;
        }
        this.selectedIssueLists = [];
    }

    @action
    setAllSelectedIssueList(){
        this.selectedIssueLists = [];
        for(let i of this._issueList){
            i.checked = true;
        }
        this.selectedIssueLists = this._issueList;
    }

    @action
    setStakeHolderType(stype){
        this.selectedStakeHolderType = stype;
    }

    getSelectedStakeholderType(){
        return this.selectedStakeHolderType;
    }

    @action
    newNeedsExpectations(need,stakeholder,edit:boolean = false){
        var returnValue: boolean = true;
        if(this.selectedNeedsExpectations.length == 0){
            let obj = { stakeholder: stakeholder.id, 
                stakeholder_title: stakeholder.title, 
                values : [need.id], 
                needs_title: [need.title],
                type : !(edit)?this.selectedStakeHolderType.title:stakeholder.stakeholder_type.title,
                active: true
            };
            this.selectedNeedsExpectations.push(obj);
        }
        else{
            var foundFlag = false;
            var foundPosition = null;
            this.selectedNeedsExpectations.forEach(element => {
                if(element.stakeholder == stakeholder.id){
                    foundPosition = this.selectedNeedsExpectations.findIndex(e => e.stakeholder == stakeholder.id);
                    var needFound = false;
                    for(let i of element.values){
                        if(i == need.id){
                            needFound = true;
                            break;
                        }
                    }
                    foundFlag = true;
                    if(!needFound){
                        element.values.push(need.id);
                        element.needs_title.push(need.title)
                        element.active = true;
                    }
                    else{
                        returnValue = false;
                    }
                    this.setNeedsAndExpectationsAccordion(foundPosition);
                }
            });
            if(!foundFlag){
                // let obj = { stakeholder: stakeholder, values : [need], type : this.selectedStakeHolderType.title };
                this.setNeedsAndExpectationsAccordion();
                let obj = { stakeholder: stakeholder.id, 
                    stakeholder_title: stakeholder.title, 
                    values : [need.id], 
                    needs_title: [need.title],
                    type : !(edit)?this.selectedStakeHolderType.title:stakeholder.stakeholder_type.title,
                    active: true
                };
                this.selectedNeedsExpectations.push(obj);
            }
        }
        return returnValue;
    }

    @action
    removeNeedsandExpectations(need,position){
        var needsPosition = this.selectedNeedsExpectations[position]['needs_title'].findIndex(e=>e == need);
        this.selectedNeedsExpectations[position]['needs_title'].splice(needsPosition,1);
        this.selectedNeedsExpectations[position]['values'].splice(needsPosition,1);
    }

    @action
    setNeedsAndExpectationsAccordion(position?:number){
        if(position != null){
            for(var i = 0; i < this.selectedNeedsExpectations.length; i++){
                if(i != position)
                    this.selectedNeedsExpectations[i].active = false;
                else
                    this.selectedNeedsExpectations[i].active = true;
            }
        }
        else{
            for(var i = 0; i < this.selectedNeedsExpectations.length; i++){
                this.selectedNeedsExpectations[i].active = false;
            }
        }
    }

    @action
    showhideNeedsExpectations(pos){
        if(pos < this.selectedNeedsExpectations.length){
            if(this.selectedNeedsExpectations[pos].hasOwnProperty('active')){
                if(this.selectedNeedsExpectations[pos].active == true){
                    this.selectedNeedsExpectations[pos]['active'] = false;
                }
                else{
                    this.selectedNeedsExpectations[pos]['active'] = true;    
                }
            }
            else{
                this.selectedNeedsExpectations[pos]['active'] = true;
            }
        }
        for(let i = 0; i < this.selectedNeedsExpectations.length; i++){
            if(i != pos)
                this.selectedNeedsExpectations[i]['active'] = false;
        }
    }

    /*adding issues to selection list */

    @action
    addSelectedIssues(issues){
        this.selectedIssuesList = issues;
    }

    unsetSelectedProcesses(){
        this.selectedIssuesList = [];
    }

    // @action
    // setSelectAllCheckBox(pageNumber: number):boolean{
    //     if(this.multipleSelectionObject && this.multipleSelectionObject.length > 0){
    //       var pos = this.multipleSelectionObject.findIndex(e=>e.pageNumber == pageNumber);
    //       if(pos == -1){ 
    //         this.multipleSelectionObject.push({allIssues: false, pageNumber: pageNumber});
    //         return false;
    //       }
    //       else {
    //         this.multipleSelectionObject[pos].allIssues = !this.multipleSelectionObject[pos].allIssues;
    //         return this.multipleSelectionObject[pos].allIssues;
    //       }
    //     }
    //     else{
    //       this.multipleSelectionObject = [{allIssues: true, pageNumber: pageNumber}];
    //       return true;
    //     }
    
    // }
    
    // @action
    // getSelectAllCheckBoxValue(pageNumber: number):boolean{
    //     if(this.multipleSelectionObject && this.multipleSelectionObject.length > 0){
    //         var pos = this.multipleSelectionObject.findIndex(e=>e.pageNumber == pageNumber);
    //         if(pos == -1) return false
    //         else return this.multipleSelectionObject[pos].allIssues;
    //     }
    //     else{
    //         return false;
    //     }
    // }
    
}

export const IssueListStore = new Store();