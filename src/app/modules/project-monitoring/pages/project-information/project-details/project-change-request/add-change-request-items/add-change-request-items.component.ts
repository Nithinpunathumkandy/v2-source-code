import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ProjectBudgetService } from 'src/app/core/services/project-monitoring/project-budget/project-budget.service';
import { ProjectChangeRequestService } from 'src/app/core/services/project-monitoring/project-change-request/project-change-request.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { ProjectTeamService } from 'src/app/core/services/project-monitoring/project-team/project-team.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { BudgetStore } from 'src/app/stores/project-monitoring/project-budget-store';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { ProjectTeamStore } from 'src/app/stores/project-monitoring/project-team-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-add-change-request-items',
  templateUrl: './add-change-request-items.component.html',
  styleUrls: ['./add-change-request-items.component.scss']
})
export class AddChangeRequestItemsComponent implements OnInit,OnDestroy {
  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('editBar') editBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('budget', {static: true}) budget: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  
  ProjectMonitoringStore = ProjectMonitoringStore;
  ProjectChangeRequestStore = ProjectChangeRequestStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ProjectTeamStore = ProjectTeamStore
  UsersStore = UsersStore
  AppStore = AppStore
  is_duration = false;
  is_teams = false;
  is_scopeofwork = false;
  is_budget = false;
  is_delivarables = false;
  nextButtonText = 'next';
  previousButtonText = "previous";
  noDataSourceInscope = {
    noData: "No in scope added", border: false
  }

  noDataSourceOutScope = {
    noData: "No out scope added", border: false
  }
  noDataSourceAssumption = {
    noData: "No assumption added", border: false
  }

  noDataSourceDeliverables = {
    noData: "No Deliverables added", border: false
  }

  budgetObject = {
    id : null,
    type : null,
    value : null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  
  reactionDisposer: IReactionDisposer;

  currentTab = 0;
  startDate = null;
  formErrors :any;
  endDate = null;
  durationJustification
  inScope;
  outScope
  assumption
  deliverable
  inScopes = [];
  outScopes = [];
  assumptions = [];
  deliverables = [];
  showForm: boolean = false;
  formObject = {
    }

    selectedFormTabs = [
      {
      value : 0,
      show : false,
      title : 'duration'
    },
    {
      value : 1,
      show : false,
      title : 'teams'
    },
    {
      value : 2,
      show : false,
      title : 'scope-of-work'
    },
    {
      value : 3,
      show : false,
      title : 'budget'
    },
    {
      value : 4,
      show : false,
      title : 'delivarables'
    },
  ]
  project_manager_id: any;
  assistant_manager_ids: any;
  member_ids: any[];
  projectBudgetEventSubscrion: any;
  selectedMangers: any = [];
  selectedMembers: any = [];
  budgetJustification: any;
  deliverableJustification: any;
  scopeJustification: any;
  teamsJustification: any;
  popupControlEventSubscription: any;

  constructor( private _renderer2: Renderer2,
    private _changeRequestService: ProjectChangeRequestService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _usersService: UsersService,
    private _router: Router, private _imageService: ImageServiceService, private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService, private _humanCapitalService: HumanCapitalService,
    private _projectService : ProjectMonitoringService,private _activatedRouter: ActivatedRoute,
    private _projectTeamService : ProjectTeamService,private _projectBudgetService : ProjectBudgetService,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      this._helperService.checkSubMenuItemPermissions(600,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    if (this._router.url.indexOf('edit') != -1) {
      if (ProjectChangeRequestStore.individualChangeRequestItem){
        this.setRequestDataForEdit();
        this.setEditDataForTeams();
        this.setEditDataForScope();
        this.setEditDataforBudget();
        this.setDeliverables();
      }
    }
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
      this.selectedTabs()
      //  this.startForm(); 
    }, 1000);

    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      ProjectMonitoringStore.setSelectedProjectId(id)
      this.getIndividualProfileInformation(id)
      this.getProjectManagers();
      this.getProjectAssistantManagers();
      this.getProjectMembers();
      this.getScopes();
      this.getBudgets();
      this.getDeliverables()
    });

    this.projectBudgetEventSubscrion = this._eventEmitterService.projectChangeReqBudgetModal.subscribe(item => {
      this.closeNewBudget()
    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // this.showForm = true;
 
  }

  setRequestDataForEdit(){
    
     if(ProjectChangeRequestStore.individualChangeRequestItem.durations){
      this.startDate = ProjectChangeRequestStore.individualChangeRequestItem.durations ?  this._helperService.processDate(ProjectChangeRequestStore.individualChangeRequestItem.durations.start_date,'split') : '';
      this.endDate = ProjectChangeRequestStore.individualChangeRequestItem.durations ? this._helperService.processDate(ProjectChangeRequestStore.individualChangeRequestItem.durations.end_date,'split') : '';
      this.durationJustification = ProjectChangeRequestStore.individualChangeRequestItem.durations.justification ? ProjectChangeRequestStore.individualChangeRequestItem.durations.justification : ''
     }
      
  }

  setEditDataForTeams(){
    if(ProjectChangeRequestStore.individualChangeRequestItem.project_manager){
      this.project_manager_id = ProjectChangeRequestStore.individualChangeRequestItem.project_manager ? ProjectChangeRequestStore.individualChangeRequestItem.project_manager.user : null;
      this.assistant_manager_ids = ProjectChangeRequestStore.individualChangeRequestItem?.associate_manager ? this.getUserData(ProjectChangeRequestStore.individualChangeRequestItem.associate_manager) : [];
      this.member_ids = ProjectChangeRequestStore.individualChangeRequestItem.members ? this.getUserData(ProjectChangeRequestStore.individualChangeRequestItem.members) : [] ;
      this.teamsJustification = ProjectChangeRequestStore.individualChangeRequestItem.team_justification ? ProjectChangeRequestStore.individualChangeRequestItem.team_justification : ''
    }
    
  }

  setEditDataForScope(){
    if(ProjectChangeRequestStore.individualChangeRequestItem.scopes.length >0){
      for(let data of ProjectChangeRequestStore.individualChangeRequestItem.scopes){
        if(data.scope_type =='in_scope'){
          let obj = {
            title : data.title,
            type : data.type,
            scope_type : 'in_scope'
  
          }
           this.inScopes.push(obj)
        }else if(data.scope_type == 'out_scope'){
          let obj = {
            title : data.title,
            type : data.type,
            scope_type : 'out_scope'
  
          }
           this.outScopes.push(obj)
        }else if(data.scope_type =="assumption") {
          let obj = {
            title : data.title,
            type : data.type,
            scope_type : 'assumption'
          }
          this.assumptions.push(obj)
  
        }
      }
    }
   this.scopeJustification = ProjectChangeRequestStore.individualChangeRequestItem.scope_justification ? ProjectChangeRequestStore.individualChangeRequestItem.scope_justification : ''
  }

  setEditDataforBudget(){
    if(ProjectChangeRequestStore.individualChangeRequestItem.budgets.length > 0){
      for(let data of ProjectChangeRequestStore.individualChangeRequestItem.budgets){
        // if(data.type != 'deleted'){
          let obj = {
            year : data.year,
            amount : data.existing_amount,
            newAmount : data.new_amount,
            type : data.type? data.type : ''
          }
          ProjectChangeRequestStore.setBudgets(obj)
        // }
      }
      this.budgetJustification = ProjectChangeRequestStore.individualChangeRequestItem.budgets[0].justification ? ProjectChangeRequestStore.individualChangeRequestItem.budgets[0].justification : '' 
      this._utilityService.detectChanges(this._cdr);

    }
  }

  setDeliverables(){
    if(ProjectChangeRequestStore.individualChangeRequestItem.deliverables.length > 0){
      for(let data of ProjectChangeRequestStore.individualChangeRequestItem.deliverables){
        this.deliverables.push(data.title)
     }
     this.deliverableJustification = ProjectChangeRequestStore.individualChangeRequestItem.deliverables[0].justification ? ProjectChangeRequestStore.individualChangeRequestItem.deliverables[0].justification : ''
    }
    
  }

  getUserData(value) {
    let data = [];
    for(let i of value) {
      if(i.type != "deleted"){
        data.push(i.users);
      }
    }
    return data;
  }


  selectedTabs(){
    ProjectChangeRequestStore.selectedTabs.map(data=>{
      if(data.type == 'duration'){
        this.is_duration = true
      }else if(data.type == 'teams'){
        this.is_teams = true      
      }else if(data.type == 'scope-of-work'){
        this.is_scopeofwork = true
      }else if(data.type == 'budget'){
        this.is_budget = true
      }else if(data.type == 'delivarables'){
        this.is_delivarables = true
      }
      let pos = this.selectedFormTabs.findIndex(e=>e.title == data.type)
      if(pos != -1){
        let n = 1
        this.selectedFormTabs[pos].value = n
        this.selectedFormTabs[pos].show = true
      }
    })
    setTimeout(() => {
      this.currentTab = 0
      this.startForm()
      this.showForm = true;
      this._utilityService.detectChanges(this._cdr);
    }, 1000);
 
    this._utilityService.detectChanges(this._cdr);

  }


  getDeliverables(){
    this._projectService.getDeliverables().subscribe(res=>{
      if(this._router.url.indexOf('add') != -1 ||  ProjectChangeRequestStore.individualChangeRequestItem.deliverables.length == 0){
      this.populateDeliverables()
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  populateDeliverables(){
    if(ProjectMonitoringStore.deliverables.length > 0){
      for(let data of ProjectMonitoringStore.deliverables){
         this.deliverables.push(data.title)
      }
    } 
  }

  getIndividualProfileInformation(id){
    this._projectService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getScopes(){
    this._projectService.getScopes().subscribe(res=>{
      if(this._router.url.indexOf('add') != -1 || ProjectChangeRequestStore.individualChangeRequestItem.scopes.length == 0){
        this.getPopulateScopes()
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBudgets(){
    this._projectBudgetService.getItems().subscribe(res=>{
      if(this._router.url.indexOf('add') != -1 ||  ProjectChangeRequestStore.individualChangeRequestItem.budgets.length == 0){
      this.populateBudget()
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  populateBudget(){
    if(BudgetStore.allItems.length > 0){
      for(let data of BudgetStore.allItems){
        let obj = {
          year : data.year,
          amount : data.amount,
          newAmount : 0
        }
        ProjectChangeRequestStore.setBudgets(obj)
      }
      this._utilityService.detectChanges(this._cdr);

    }
  }

  

  getProjectManagers(){
    this._projectTeamService.getProjectManagers(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectAssistantManagers(){
    this._projectTeamService.getProjectAssistantManagers(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectMembers(){
    this._projectTeamService.getProjectMembers(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      if(this._router.url.indexOf('add') != -1 || !ProjectChangeRequestStore.individualChangeRequestItem.project_manager){
        this.getPopulateTeamData()
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  deleteIn(data){
  let pos = this.inScopes.findIndex(e=>e.title == data.title)

  if(pos !=-1 && data.type !='new'){
    this.inScopes[pos].type = 'deleted'
  }else if(pos !=-1 && data.type =='new'){
    this.inScopes.splice(pos,1)
  }
  }
  deleteOut(data){
    let pos = this.outScopes.findIndex(e=>e.title == data.title)
    if(pos !=-1 && data.type !='new'){
      this.outScopes[pos].type = 'deleted'
    }else if(pos !=-1 && data.type =='new'){
      this.outScopes.splice(pos,1)
    }
    }
    deleteAssumption(data){
      let pos = this.assumptions.findIndex(e=>e.title == data.title)
      if(pos !=-1 && data.type !='new'){
        this.assumptions[pos].type = 'deleted'
      }else if(pos !=-1 && data.type =='new'){
        this.assumptions.splice(pos,1)
      }
      }

      deleteDelivarables(del){
        let pos = this.deliverables.findIndex(e=>e == del)
        if(pos !=-1){
          this.deliverables.splice(pos,1)
        }
      }

  getPopulateScopes(){
    for(let data of ProjectMonitoringStore.scopeOfWorks){
      if(data.type =='in_scope'){
        let obj = {
          title : data.title,
          type : 'existing',
          scope_type : 'in_scope'

        }
         this.inScopes.push(obj)
      }else if(data.type == 'out_scope'){
        let obj = {
          title : data.title,
          type : 'existing',
          scope_type : 'out_scope'

        }
         this.outScopes.push(obj)
      }else if(data.type =="assumption") {
        let obj = {
          title : data.title,
          type : 'existing',
          scope_type : 'assumption'
        }
        this.assumptions.push(obj)

      }
    }
  }

  getPopulateTeamData() {
    
      this.project_manager_id = this.ProjectTeamStore.projectManagers?.project_manager ? this.ProjectTeamStore.projectManagers?.project_manager : null;
      this.assistant_manager_ids = this.ProjectTeamStore.projectAssistantManagers?.project_assistant_managers ? this.getData(this.ProjectTeamStore.projectAssistantManagers?.project_assistant_managers) : [];
      this.member_ids = this.ProjectTeamStore.projectMembers?.project_members ? this.getData(this.ProjectTeamStore.projectMembers?.project_members) : []  
  }

  getData(value) {
    let data = [];
    for(let i of value) {
      data.push(i);
    }
    return data;
  }


  startForm(){
    this.showTab(this.currentTab);
    this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
    window.addEventListener('scroll',this.scrollEvent,true);
    //Function Call to Get All Initial Data
    // this.getAllData();
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.formSteps.nativeElement,'small');
        this._renderer2.addClass(this.editBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.formSteps.nativeElement,'small');
        this._renderer2.removeClass(this.editBar.nativeElement,'affix');
      }
    }
  }

  /*-------------------------- Functions to handle step form Starts Here -----------------------------------------------*/

  showTab(n) {
    // This function will display the specified tab of the form...
    var x:any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
     }
    if (n == (x.length - 1)) {
      
      //console.log(this.displayForm);
      if (document.getElementById("nextBtn")) {
        //document.getElementById("nextBtn").innerHTML = "Save";
        this.nextButtonText = "save";
      }
      // console.log(this.selectedUsers);
    } else {
      if (document.getElementById("nextBtn")){
        // document.getElementById("nextBtn").innerHTML = "Next";
        this.nextButtonText = "next";
      }
    }
   

    //... and run a function that will display the correct step indicator:
    this._utilityService.scrollToTop();
    this.fixStepIndicator(n);
  }
  
  nextPrev(n) {
    // This function will figure out which tab to display
    var x:any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
  
    // if (n == 1 && !validateForm()) return false;
  
    document.getElementsByClassName("step")[this.currentTab].className += " finish";
  
    // Hide the current tab:
    x[this.currentTab].style.display = "none";


  if (x[this.currentTab].id == 'duration' && this.endDate && n==1){
    this.changeSecondtStepForm()
  }
  if (x[this.currentTab].id == 'teams' && n==1){
    this.changeRequestTeamChange(n)
  }
  if (x[this.currentTab].id == 'scope' && n==1){
    this.changeRequestScopeOfWork()
  }
  if (x[this.currentTab].id == 'budget' && ProjectChangeRequestStore.budgets.length > 0 && n==1){
    this.changeRequestBudgetChange()
  }
  if (x[this.currentTab].id == 'deliverables' && n==1){
    this.changeRequestDelivarbles()
}
    // Increase or decrease the current tab by 1:
    
      this.currentTab = this.currentTab + n;
    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      this._router.navigateByUrl(`/project-monitoring/projects/${ProjectMonitoringStore.selectedProjectId}/project-change-request/${ProjectChangeRequestStore.selectedId}`)
      // ... the form gets submitted:

      //document.getElementById("regForm").submit();
      // this.createIssueSaveData();
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      // this.createIssue();
      return false;
    }
    
    // Otherwise, display the correct tab:
    
      this.showTab(this.currentTab);
    
  }

 


  
  validateForm() {
    // This function deals with validation of the form fields
    var x:any, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[this.currentTab].getElementsByTagName("input");
  
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
      // If a field is empty...
      if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }
    return valid; // return the valid status
  }
  
  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  setInitialTab(){
    var x:any = document.getElementsByClassName("tab");
    for(var i = 0; i < x.length; i++){
      if(!OrganizationGeneralSettingsStore.organizationSettings?.is_ms_type){
        if(i == 1) x[i].style.display = "block";
        else x[i].style.display = "none";
      }else{
        if(i == 0) x[i].style.display = "block";
        else x[i].style.display = "none";
      }
      
    }
  }

  /*-------------------------- Functions to handle step form Ends Here-----------------------------------------------*/


  addBudgets(){
    this.budgetObject.type = 'Add';
    this.openNewBudget();
  }

  openNewBudget(){
    setTimeout(() => {
      $(this.budget.nativeElement).modal('show');
    }, 100);
    // this._renderer2.addClass(this.deliverables.nativeElement,'show');
    this._renderer2.setStyle(this.budget.nativeElement,'display','block');
    this._renderer2.setStyle(this.budget.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.budget.nativeElement,'z-index',99999);
  }

  closeNewBudget(){
   console.log(ProjectChangeRequestStore.budgets)
    setTimeout(() => {
      // $(this.outComes.nativeElement).modal('hide');
      this.budgetObject.type = null;
      this.budgetObject.value = null;
      $(this.budget.nativeElement).modal('hide');
      this._renderer2.removeClass(this.budget.nativeElement,'show');
      this._renderer2.setStyle(this.budget.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  addInscope(){
    if(this.inScope){
      let obj = {
        scope_type : 'in_scope',
        type : 'new',
        title : this.inScope
      }
      this.inScopes.push(obj)
      this.inScope = ''
    }
  }

  addOutScope(){
    if(this.outScope){
      let obj = {
        scope_type : 'out_scope',
        type : 'new',
        title : this.outScope
      }
      this.outScopes.push(obj)
      this.outScope = ''
    }
  }

  addAssumption(){
    if(this.assumption){
      let obj = {
        scope_type : 'assumption',
        type : 'new',
        title : this.assumption
      }
      this.assumptions.push(obj)
      this.assumption = ''
    }
  }

  addNewDeliverables(){
    if(this.deliverable){
      this.deliverables.push(this.deliverable)
      this.deliverable = ''
    }
  }

  changeStep(step){
    if(step > this.currentTab && this.checkFormObject(step)){
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if(step < this.currentTab){
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }  
  }

  checkFormObject(tabNumber?:number){
    var setValid = true;

    return setValid;
  }

  changeSecondtStepForm(){
    let obj = {
      type : 'existing',
      start_date : this._helperService.processDate(this.startDate,'join'),
      end_date : this._helperService.processDate(this.endDate,'join'),
      justification : this.durationJustification ? this.durationJustification : null
    }
    this._changeRequestService.saveDuration(obj,ProjectChangeRequestStore.selectedId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr); 
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
        // this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }


  getManagers(){
    let obj
    for(let data of this.assistant_manager_ids){
      let pos = this.ProjectTeamStore.projectAssistantManagers?.project_assistant_managers.findIndex(e=>e.id == data.id)
         obj = {
          id : data.id,
        }

      this.selectedMangers.push(data.id)  
    }
  }
  getMembers(){
    let obj
    for(let data of this.member_ids){
      let kpos  = this.ProjectTeamStore.projectMembers?.project_members.findIndex(e=>e.id == data.id)
         obj = {
          id : data.id,
        }
       
      this.selectedMembers.push(data.id)  
    }
  }


  getBudgetData(){
    let data = []
   if(ProjectChangeRequestStore.budgets.length > 0) {
     for(let amt of ProjectChangeRequestStore.budgets){
       if(amt.type != 'deleted'){
        let pos = BudgetStore.allItems.findIndex(e=>e.year ==  amt.year)
        let obj
        if(pos != -1){
          obj = {
            year : amt.year,
            new_amount : amt.newAmount,
            existing_amount :  BudgetStore.allItems[pos].amount
           }
         }else {
          obj = {
            year : amt.year,
            new_amount : amt.newAmount,
            existing_amount : 0
           }
         }
         
         data.push(obj)
       }
      
     }
   }
   return data
  }

  changeRequestBudgetChange(){
    let obj = {
      budgets : this.getBudgetData(),
      justification : this.budgetJustification
    }
    this._changeRequestService.saveBudget(obj,ProjectChangeRequestStore.selectedId).subscribe(res=>{
      
      this._utilityService.detectChanges(this._cdr); 
    },(err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
        //  this.cancel();;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    })
  }

  changeRequestDelivarbles(){
    let obj = {
      titles : this.deliverables,
      justification : this.deliverableJustification ? this.deliverableJustification : null
    }
    this._changeRequestService.saveDelivarables(obj,ProjectChangeRequestStore.selectedId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr); 
    },(err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
        //  this.cancel();;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    })
  }


  changeRequestTeamChange(n:number){
    this.getManagers();
    this.getMembers();
    let obj = {
      project_manager_id : this.project_manager_id.id,
      assistant_project_managers_ids : this.selectedMangers,
      project_members_ids : this.selectedMembers,
      justification : this.teamsJustification
    }
    this._changeRequestService.saveTeam(obj,ProjectChangeRequestStore.selectedId).subscribe(res=>{
      this.selectedMangers = [];
      this.selectedMembers = [];
      this.formErrors = null
      this._utilityService.detectChanges(this._cdr); 

    },(err: HttpErrorResponse) => {
      if (err.status == 422) {
      this.selectedMangers = [];
      this.selectedMembers = [];
        this.formErrors = err.error.errors;
        this.nextPrev(-1)
      }
      else if (err.status == 500 || err.status == 403) {
        // this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getScopesValue(){
    let selectedScopes = []
    if(this.inScopes.length > 0){
      for(let data of this.inScopes){
         selectedScopes.push(data)
      }
    }
    if(this.outScopes.length > 0){
      for(let data of this.outScopes){
         selectedScopes.push(data)
      }
    }
    if(this.assumptions.length > 0){
      for(let data of this.assumptions){
         selectedScopes.push(data)
      }
    }

    return selectedScopes
    
  }

  changeRequestScopeOfWork(){
    let obj = {
      scopes : this.getScopesValue(),
      justification : this.scopeJustification

    }
    this._changeRequestService.saveScopeOfWork(obj,ProjectChangeRequestStore.selectedId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr); 

    },(err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
        // this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }


  getUsers() {
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchUers(e) {   
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }   

  customSearchFn(term: string, item: any) { 
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  getTabNumerScope(){
    let number 
    if(this.is_duration && this.is_teams && this.is_scopeofwork){
      number = 3
    }else if (!this.is_duration && this.is_teams && this.is_scopeofwork ){
      number = 2
    }else if (this.is_duration && !this.is_teams && this.is_scopeofwork){
      number = 2
    }else if (!this.is_duration && !this.is_teams && this.is_scopeofwork){
      number = 1
    }
    return number
  }
  getTabNumberOfBudget(){
    let number 
    if(this.is_duration && this.is_teams && this.is_scopeofwork && this.is_budget){
      number = 4
    }else if (!this.is_duration && this.is_teams && this.is_scopeofwork && this.is_budget ){
      number = 3
    }else if (this.is_duration && !this.is_teams && this.is_scopeofwork && this.is_budget){
      number = 3
    }else if (this.is_duration && this.is_teams && !this.is_scopeofwork && this.is_budget){
      number = 3
    }else if (!this.is_duration && !this.is_teams && this.is_scopeofwork && this.is_budget){
      number = 2
    }else if (!this.is_duration && this.is_teams && !this.is_scopeofwork && this.is_budget){
      number = 2
    }else if (this.is_duration && !this.is_teams && !this.is_scopeofwork && this.is_budget){
      number = 2
    }else if (!this.is_duration && !this.is_teams && !this.is_scopeofwork && this.is_budget){
      number = 1
    }
    return number
  }


  getTabNumberOfDelivarables(){
    let number 
    if(this.is_duration && this.is_teams && this.is_scopeofwork && this.is_budget && this.is_delivarables){
      number = 5
    }else if (!this.is_duration && this.is_teams && this.is_scopeofwork && this.is_budget  && this.is_delivarables ){
      number = 4
    }else if (this.is_duration && !this.is_teams && this.is_scopeofwork && this.is_budget && this.is_delivarables){
      number = 4
    }else if (this.is_duration && this.is_teams && !this.is_scopeofwork && this.is_budget && this.is_delivarables){
      number = 4
    }else if (this.is_duration && this.is_teams && this.is_scopeofwork && !this.is_budget && this.is_delivarables){
      number = 4
    }else if (!this.is_duration && ! this.is_teams && this.is_scopeofwork && this.is_budget && this.is_delivarables){
      number = 3
    }else if (this.is_duration && !this.is_teams && !this.is_scopeofwork && this.is_budget && this.is_delivarables){
      number = 3
    }else if (this.is_duration && this.is_teams && !this.is_scopeofwork && !this.is_budget && this.is_delivarables){
      number = 3
    }else if (!this.is_duration && this.is_teams && this.is_scopeofwork && !this.is_budget && this.is_delivarables){
      number = 3
    }else if (!this.is_duration && this.is_teams && !this.is_scopeofwork && this.is_budget && this.is_delivarables){
      number = 3
    }else if (this.is_duration && !this.is_teams && this.is_scopeofwork && !this.is_budget && this.is_delivarables){
      number = 3
    }else if (!this.is_duration && !this.is_teams && !this.is_scopeofwork && this.is_budget && this.is_delivarables){
      number = 2
    }else if (this.is_duration && !this.is_teams && !this.is_scopeofwork && !this.is_budget && this.is_delivarables){
      number = 2
    }else if (!this.is_duration && this.is_teams && !this.is_scopeofwork && !this.is_budget && this.is_delivarables){
      number = 2
    }else if (!this.is_duration && !this.is_teams && this.is_scopeofwork && !this.is_budget && this.is_delivarables){
      number = 2
    }else if (!this.is_duration && !this.is_teams && !this.is_scopeofwork && !this.is_budget && this.is_delivarables){
      number = 1
    }
    return number
  }

  validateItems(){
    
    var x:any = document.getElementsByClassName("tab");
    if(x.length > 0){
      if (x[this.currentTab].id == 'duration'){
        if(this.startDate && this.endDate && this.durationJustification){
          return false
        }else {
          return true
        }
      }
      if (x[this.currentTab].id == 'teams'){
        if(this.project_manager_id && this.assistant_manager_ids.length > 0 && this.member_ids.length >0 && this.teamsJustification){
          return false
        }else {
          return true
        }
      }
      if (x[this.currentTab].id == 'scope'){
        if(this.inScopes.length > 0 && this.outScopes.length > 0 && this.assumptions.length > 0 && this.scopeJustification ){
          return false
        }else {
          return true
        }
  
      }
      if (x[this.currentTab].id == 'budget'){
        if(ProjectChangeRequestStore.budgets.length > 0 && this.budgetJustification){
          return false
        }else {
          return true
        }
  
      }
      if (x[this.currentTab].id == 'deliverables'){
        if(this.deliverables.length > 0 && this.deliverableJustification){
          return false
        }else {
          return true
        }
  
    }
    }
   
  }

    // for delete
    delete(item) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = item;
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'Corresponding payment of that year will be removed from budget';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }
    cancelClicked(){
      // this._router.navigateByUrl('/incident-management/incidents')
      this.popupObject.title = 'Cancel?';
      this.popupObject.type = 'Cancel';
      this.popupObject.subtitle = 'This action cannot be undone'
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('show');
      }, 100);
      this._utilityService.detectChanges(this._cdr);
  
    }

    clearPopupObject() {
      this.popupObject.id = null;
    }

       // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'are_you_sure': this.deleteBudgets(status)
        break;
        case 'Cancel': 
        setTimeout(() => {
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 250);
           this._router.navigateByUrl('project-monitoring/projects/'+ProjectMonitoringStore.selectedProjectId+'/change-request')
      break;
        break;
    
    }


  }


  deleteBudgets(status){
    if(status && ProjectChangeRequestStore.budgets.length > 0 ){
       let pos = ProjectChangeRequestStore.budgets.findIndex(e=> e.year == this.popupObject.id.year)
       if(pos != -1){
        ProjectChangeRequestStore.budgets[pos].type = 'deleted'
       }
       this._utilityService.detectChanges(this._cdr);
    } else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.projectBudgetEventSubscrion.unsubscribe()
    ProjectChangeRequestStore.selectedTabs = []
    ProjectChangeRequestStore._budgets = [];
    this.deliverables = [];
    this.formErrors = null
    this.popupControlEventSubscription.unsubscribe();
  }
}
