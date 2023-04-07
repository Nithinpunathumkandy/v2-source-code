import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { autorun,IReactionDisposer } from 'mobx';
import { EventChangeRequestStore } from "src/app/stores/event-monitoring/events/event-change-request-store";
import { EventsStore } from "src/app/stores/event-monitoring/events/event.store";
import { EventsService } from "src/app/core/services/event-monitoring/events/events.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventChangeRequestItemsStore } from 'src/app/stores/masters/event-monitoring/event-change-request-items.store';
import { EventChangeRequestService } from 'src/app/core/services/event-monitoring/event-change-request/event-change-request.service';
import { DatePipe } from '@angular/common';
import { EventBudgetService } from 'src/app/core/services/event-monitoring/event-budget/event-budget.service';
import { BudgetStore } from 'src/app/stores/event-monitoring/event-budget-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { StatusService } from 'src/app/core/services/masters/event-monitoring/status.service';
import { StatusMasterStore } from 'src/app/stores/masters/event-monitoring/status-store';
import { Status } from 'src/app/core/models/masters/event-monitoring/status';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';

declare var $:any;
@Component({
  selector: 'app-new-event-change-request',
  templateUrl: './new-event-change-request.component.html',
  styleUrls: ['./new-event-change-request.component.scss']
})
export class NewEventChangeRequestComponent implements OnInit {
  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('editBar') editBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('budget', {static: true}) budget: ElementRef;
  @ViewChild('newScope', {static: true}) newScope: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  pipe = new DatePipe('en-US');
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore
  StatusMasterStore = StatusMasterStore
  UsersStore = UsersStore;
  AppStore = AppStore;
  nextButtonText = 'next';
  previousButtonText = "previous";
  form: FormGroup;
  currentTab = 0;
  startDate = null;
  formErrors :any;
  endDate = null;
  is_duration = false;
  is_status = false;
  is_scopeofwork = false;
  is_budget = false;
  durationJustification;
  budgetJustification
  inScope
  outScope
  assumption
  inScopes = [];
  outScopes = [];
  assumptions = [];
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
    event_type:''
  };
  newBudgetObject = {
    id : null,
    type : null,
    value : null
  }
  budgetObject = {
    id : null,
    type : null,
    value : null
  }
  selectedFormTabs = [
    {
      value: 0,
      show: false,
      title: 'duration'
    },
    {
      value: 1,
      show: false,
      title: 'teams'
    },
    {
      value: 2,
      show: false,
      title: 'scope-of-work'
    },
    {
      value: 3,
      show: false,
      title: 'budget'
    },
  ]
  formObject = {
    0: [
      'new_start_date',
      'new_end_date',
      'justification_event_date'
    ],
    1: [
      'justification_event_budget'
    ],
    2:[
      'justification_event_scope'
    ],
    3:[
      'new_event_status_id',
      'justification_event_status'
    ]
  }
  noDataSourceInscope = {
    noData: "No in scope added", border: false
  }

  noDataSourceOutScope = {
    noData: "No out scope added", border: false
  }
  noDataSourceAssumption = {
    noData: "No assumption added", border: false
  }
  newScopeObject = {
    id : null,
    type : null,
    scopeType : '',
    value : null
  }
  fileUploadType
  showForm: boolean = false;
  selectedSection = 'scope';
  EventChangeRequestStore = EventChangeRequestStore;
  eventBudgetEventSubscrion
  EventsStore = EventsStore;
  popupControlEventSubscription: any;
  eventScopeEventSubscrion: any;
  fileUploadPopupSubscriptionEvent: any;
  durationFiles=[];
  statusFiles=[];
  budgetFiles=[];
  scopeFiles=[];
  allowedStatus: Status[] = []
  editFlag: boolean = false;
  constructor( private _renderer2: Renderer2,
    private _utilityService: UtilityService, private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _router: Router, private _imageService: ImageServiceService, private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,private _activatedRouter: ActivatedRoute,
    private _documentFileService: DocumentFileService, private _eventChangeRequestService: EventChangeRequestService,
    private _fileUploadPopupService: FileUploadPopupService, private _eventBudgetService : EventBudgetService,
    private _eventsService: EventsService, private _statusService: StatusService, private _eventFileService: EventFileServiceService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      if(NoDataItemStore.clikedNoDataItem){
        this.openSelectPopup();   
        NoDataItemStore.unSetClickedNoDataItem();
     }
     var subMenuItems = [];
     if(EventChangeRequestStore?.changeRequestChoosedSubmenu)
     {
      subMenuItems.push({activityName: null, submenuItem: {type: 'close',path:'/event-monitoring/event-change-requests'}});
     }
     else
     {
      subMenuItems.push({activityName: null, submenuItem: {type: 'close',path:'../'}});
     }
      // var subMenuItems = [
      //   {activityName: null, submenuItem: {type: 'close',path:'../'}},
      // ]
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
    this.form = this._formBuilder.group({
      new_start_date:['',[Validators.required]],
      new_end_date:['',[Validators.required]],
      existing_start_date:[''],
      existing_end_date:[''],
      justification_event_date:['',[Validators.required]],
      documents:[],
      justification_event_budget:['',[Validators.required]],
      justification_event_scope:['',[Validators.required]],
      new_event_status_id:[null,[Validators.required]],
      justification_event_status:['',[Validators.required]],
    })
    this._activatedRouter.params.subscribe(res=>{
      if(res.hasOwnProperty('id')){
        this.getEventDetails(res.id);
        this.getBudgets();
      }
    })
    if (this._router.url.indexOf('edit') != -1) {
      this.editFlag = true;
      if (EventChangeRequestStore.individualChangeRequestItem && ( EventChangeRequestStore.eventBudgetSelected
        || EventChangeRequestStore.eventDateSelected || EventChangeRequestStore.eventStatusSelected)){
        this.setRequestDataForEdit();
        this.setEditDataforBudget();
        //this.setEditDataforScope();
        this.setEditDataforStatus();
      }
      else{
        this._router.navigateByUrl('/event-monitoring/event-change-requests');
      }
    }
    this.eventBudgetEventSubscrion = this._eventEmitterService.EventChangeReqProjectBudgetModal.subscribe(item => {
      this.closeNewBudget()
    });
    this.eventScopeEventSubscrion = this._eventEmitterService.eventCRScopeModal.subscribe(item => {
      this.closeNewScope()
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.closeFileUploadModal();
    });
    setTimeout(() => {
      this.showTab(this.currentTab);
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 100);
    this.getStatuses()
    setTimeout(() => {
      this.selectedTabs() 
    }, 1000);
  }

  openSelectPopup() {
    switch (this.selectedSection) {
      case 'scope': this.openNewScopeModal(this.selectedSection); break;
      case 'exclusion': this.openNewScopeModal(this.selectedSection); break;
      case 'assumption': this.openNewScopeModal(this.selectedSection); break;
    }
  }

  getEventDetails(id){
    this._eventsService.getItem(id).subscribe(res=>{
      if(this._router.url.indexOf('edit') == -1 || EventChangeRequestStore.eventScopeSelected)
      {
        this.setEditDataforScope();
      }
        //this.setEventScopes(res.event_scopes);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setEventScopes(scopes){
    for(let i of scopes){
      if(i.type =='scope'){
        let obj = {
          id:i.id,
          title : i.title,
          type : 'existing',
          scope_type : 'scope', 
          is_deleted:0
        }
        this.inScopes.push(obj)
      }else if(i.type == 'exclusion'){
        let obj = {
          id:i.id,
          title : i.title,
          type : 'existing',
          scope_type : 'exclusion',
          is_deleted:0
        }
         this.outScopes.push(obj)
      }else if(i.type =="assumption") {
        let obj = {
          id:i.id,
          title : i.title,
          type : 'existing',
          scope_type : 'assumption',
          is_deleted:0
        }
        this.assumptions.push(obj)

      }
    }
  }

  getBudgets(){
    this._eventBudgetService.getItems().subscribe(res=>{
      if(this._router.url.indexOf('add') != -1 ||  EventChangeRequestStore.individualChangeRequestItem?.event_budget?.length == 0){
      this.populateBudget()
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStatuses(){
    this.allowedStatus = [];
    this._statusService.getItems(false,null).subscribe(res => {
      this.allowedStatus.push(res.data.find(e => e.type == 'cancelled'));
      this.allowedStatus.push(res.data.find(e => e.type == 'postponed'));
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  populateBudget(){
    if(BudgetStore.allItems.length > 0){
      for(let data of BudgetStore.allItems){
        let obj = {
          year : data.year,
          amount : data.amount,
          newAmount : 0,
          status: 'existing'
        }
        EventChangeRequestStore.setBudgets(obj)
      }
      this._utilityService.detectChanges(this._cdr);

    }
  }

  setRequestDataForEdit(){
    if(EventChangeRequestStore.individualChangeRequestItem.event_date){
      this.form.patchValue({
        new_start_date:EventChangeRequestStore.individualChangeRequestItem.event_date ?  new Date(EventChangeRequestStore.individualChangeRequestItem.event_date.new_start_date) : '',
        new_end_date:EventChangeRequestStore.individualChangeRequestItem.event_date ? new Date(EventChangeRequestStore.individualChangeRequestItem.event_date.new_end_date) : '',
        justification_event_date:EventChangeRequestStore.individualChangeRequestItem.event_date.justification ? EventChangeRequestStore.individualChangeRequestItem.event_date.justification : ''
      })
      // this.durationFiles = EventChangeRequestStore.individualChangeRequestItem.event_date.documents;
      if(EventChangeRequestStore.individualChangeRequestItem.event_date && EventChangeRequestStore.individualChangeRequestItem.event_date.documents.length > 0){
        this.durationFiles = this.setDocuments(EventChangeRequestStore.individualChangeRequestItem.event_date.documents,'event-date',true);
      }
      else{
        this.durationFiles = [];
      }
     }
  }

  setEditDataforStatus(){
    if(EventChangeRequestStore.individualChangeRequestItem.event_status){
      this.form.patchValue({
        new_event_status_id:EventChangeRequestStore.individualChangeRequestItem?.event_status?.new_event_status_id,
        justification_event_status:EventChangeRequestStore.individualChangeRequestItem?.event_status?.justification
      })
      // this.statusFiles = EventChangeRequestStore.individualChangeRequestItem.event_status.documents;
      if(EventChangeRequestStore.individualChangeRequestItem.event_status && EventChangeRequestStore.individualChangeRequestItem.event_status.documents.length > 0){
        this.statusFiles = this.setDocuments(EventChangeRequestStore.individualChangeRequestItem.event_status.documents,'event-status',true);
      }
      else{
        this.statusFiles = [];
      }
    }
  }

  setEditDataforBudget(){
    if(EventChangeRequestStore.individualChangeRequestItem.event_budget.length > 0){
      for(let data of EventChangeRequestStore.individualChangeRequestItem.event_budget){
          let obj = {
            year : data.year,
            amount : data.existing_amount,
            newAmount : data.new_amount,
            type : data.type? data.type : '',
            status: EventChangeRequestStore.individualChangeRequestItem.event.event_budgets.findIndex(e=>e.year == data.year) != -1 ? 'existing' : 'cr'
          }
          EventChangeRequestStore.setBudgets(obj)
      }
      this.form.patchValue({
        justification_event_budget:EventChangeRequestStore.individualChangeRequestItem.event_budget[0].justification ? EventChangeRequestStore.individualChangeRequestItem.event_budget[0].justification : ''
      }) 
      let budgetItemsCount = EventChangeRequestStore.individualChangeRequestItem.event_budget.length;
      // this.budgetFiles = EventChangeRequestStore.individualChangeRequestItem.event_budget[budgetItemsCount -1].documents;

      if(budgetItemsCount > 0 && EventChangeRequestStore.individualChangeRequestItem.event_budget[budgetItemsCount -1].documents.length > 0){
        this.budgetFiles = this.setDocuments(EventChangeRequestStore.individualChangeRequestItem.event_budget[budgetItemsCount -1].documents,'event-budget',true);
      }
      else{
        this.budgetFiles = [];
      }
      //console.log(EventChangeRequestStore.budgets);
      this._utilityService.detectChanges(this._cdr);
    }
  }

  setEditDataforScope(){
    if(EventChangeRequestStore?.individualChangeRequestItem?.event_scope?.length==0 || !EventChangeRequestStore?.individualChangeRequestItem)
    {
      //console.log(EventsStore.eventDetails);
      if(EventsStore.eventDetails.event_scopes)
      {
        this.setEventScopes(EventsStore.eventDetails.event_scopes);
      }
      
    }
    else{
      if(EventChangeRequestStore?.individualChangeRequestItem?.event_scope?.length > 0){
        EventChangeRequestStore.scopeOfWorks = EventChangeRequestStore.individualChangeRequestItem.event_scope;
        if(EventChangeRequestStore.individualChangeRequestItem.event_scope.length >0){
          for(let data of EventChangeRequestStore.individualChangeRequestItem.event_scope){
            
            if(data.scope_type =='scope'){
              let obj = {
                id:data.id,
                title : data.title,
                type : data.type,
                scope_type : 'scope', 
                is_deleted: data.is_deleted
              }
               this.inScopes.push(obj)
            }else if(data.scope_type == 'exclusion'){
              let obj = {
                id:data.id,
                title : data.title,
                type : data.type,
                scope_type : 'exclusion',
                is_deleted: data.is_deleted
              }
               this.outScopes.push(obj)
            }else if(data.scope_type =="assumption") {
              let obj = {
                id:data.id,
                title : data.title,
                type : data.type,
                scope_type : 'assumption',
                is_deleted: data.is_deleted
              }
              this.assumptions.push(obj)
      
            }
          }
        }
        let scopeItemsCount = EventChangeRequestStore.individualChangeRequestItem.event_scope.length;
        this.form.patchValue({
          justification_event_scope:EventChangeRequestStore.individualChangeRequestItem.event_scope[scopeItemsCount-1].justification ? EventChangeRequestStore.individualChangeRequestItem.event_scope[0].justification : ''
        }) 
        // this.scopeFiles = EventChangeRequestStore.individualChangeRequestItem.event_scope[scopeItemsCount-1].documents;
        
        if(scopeItemsCount > 0 && EventChangeRequestStore.individualChangeRequestItem.event_scope[scopeItemsCount-1].documents.length > 0){
          this.scopeFiles = this.setDocuments(EventChangeRequestStore.individualChangeRequestItem.event_scope[scopeItemsCount-1].documents,'event-scope',true);
        }
        else{
          this.scopeFiles = [];
        }
        
        this._utilityService.detectChanges(this._cdr);
  
      }
    }
    
  }

  addInscope(){
    if(this.inScope){
      let obj = {
        scope_type : 'scope',
        type : 'new',
        title : this.inScope,
        is_deleted:0
      }
      this.inScopes.push(obj)
      this.inScope = ''
    }
  }

  addOutScope(){
    if(this.outScope){
      let obj = {
        scope_type : 'exclusion',
        type : 'new',
        title : this.outScope,
        is_deleted:0
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
        title : this.assumption,
        is_deleted:0
      }
      this.assumptions.push(obj)
      this.assumption = ''
    }
  }

  editScope(type,scope){
    this.newScopeObject.type =  "Edit"
    this.newScopeObject.scopeType =  type
    this.newScopeObject.value =  scope

    this.openNewScope()

  }

  getNewAmountTotal(){
    let amount = 0
    if(EventChangeRequestStore.budgets.length > 0){
      for(let data of EventChangeRequestStore.budgets){
        if(data.type != 'deleted'){
          amount = amount + Number(data.newAmount)
        }
      }
    }
    return amount
  }

  getExistingTotal(){
    let amount = 0
    // if(EventChangeRequestStore.individualChangeRequestItem?.event_budget.length > 0){
    //   for(let data of EventChangeRequestStore.individualChangeRequestItem?.event_budget){
    //     if(data.type != 'deleted')
    //       amount = amount + Number(data.existing_amount)
    //   }
    // }
    if(EventChangeRequestStore.budgets.length > 0){
      for(let data of EventChangeRequestStore.budgets){
        if(data.type != 'deleted'){
          amount = amount + Number(data.amount)
        }
      }
    }
    return amount
  }

  deleteIn(data) {
    
    let pos = this.inScopes.findIndex(e => e.title == data.title)
    if (data?.id) {
      if (pos != -1 &&  this.inScopes[pos].type=='existing') {
        this.inScopes[pos].is_deleted = 1
        //this.inScopes[pos].type = 'deleted'
      }
      else {
        this.inScopes.splice(pos, 1)
      }
    } 
    else
    {
      this.inScopes.splice(pos, 1)
    }
  }

  deleteOut(data) {
    let pos = this.outScopes.findIndex(e => e.title == data.title)
    if (data?.id) {
      if (pos != -1 &&  this.outScopes[pos].type=='existing') {
        this.outScopes[pos].is_deleted = 1
        //this.outScopes[pos].type = 'deleted'
      }
      else  {
        this.outScopes.splice(pos, 1)
      }
    } 
    else{
      this.outScopes.splice(pos, 1)
    }
  }

  deleteAssumption(data) {
    let pos = this.assumptions.findIndex(e => e.title == data.title)
    if (data?.id) {
      if (pos != -1 &&  this.assumptions[pos].type=='existing') {
        this.assumptions[pos].is_deleted = 1
        //this.assumptions[pos].type = 'deleted'
      }
      else {
        this.assumptions.splice(pos, 1)
      }
    } 
    else{
      this.assumptions.splice(pos, 1)
    }
  }

  openNewScopeModal(type) {
    this.newScopeObject.type = "Add"
    this.newScopeObject.scopeType = type
    this.openNewScope();
  }

  openNewScope(){
    setTimeout(() => {
      $(this.newScope.nativeElement).modal('show');
    }, 100);
    // this._renderer2.addClass(this.newScope.nativeElement,'show');
    this._renderer2.setStyle(this.newScope.nativeElement,'display','block');
    this._renderer2.setStyle(this.newScope.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newScope.nativeElement,'z-index',99999);
  }

  closeNewScope(){
   
    setTimeout(() => {
      this.newScopeObject.type = null;
      this.newScopeObject.value = null;
      $(this.newScope.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newScope.nativeElement,'show');
      this._renderer2.setStyle(this.newScope.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  nodataCheck(inScope){
    let nodata = true;
    if(inScope){
      for(let data of inScope){
        if(data.scope_type == 'scope'){
          nodata = false
        }else{
          NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "Add In scope" });

        }
      }
    }
    return nodata
  }
  nodataCheckOutScope(inScope){
    let nodata = true;
    if(inScope){
      for(let data of inScope){
        if(data.scope_type == 'exclusion'){
          nodata = false
        }else{
          NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "Add Exclusion" });

        }
      }
    }   
    return nodata
  }
  nodataCheckAssumption(inScope){
    let nodata = true;
    if(inScope){
      for(let data of inScope){
        if(data.scope_type == 'assumption'){
          nodata = false
        }else{
          NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "Add Assumption" });

        }
      }
    }   
    return nodata
  }

  gotoSection(type) {
    this.selectedSection = type;
    switch (type) {
      case 'scope':
        NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_scope" });
        break;
      case 'exclusion':

        NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_exclusion" });

        break;
      case 'assumption':
        NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_assumption" });
        break;
    }
  }

  selectedTabs(){
   if(EventChangeRequestStore.selectedTabs.length)
   {
      EventChangeRequestStore.selectedTabs.map(data=>{
        if(data.type == 'event-date'){
          this.is_duration = true
        }else if(data.type == 'event-status'){
          this.is_status = true      
        }else if(data.type == 'event-scope'){
          this.is_scopeofwork = true
        }else if(data.type == 'event-budget'){
          this.is_budget = true
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
   }
   else{
    this._router.navigateByUrl('/event-monitoring/event-change-requests');
   }
   
 
    this._utilityService.detectChanges(this._cdr);

  }

  startForm(){
    this.showTab(this.currentTab);
    this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
    window.addEventListener('scroll',this.scrollEvent,true);
  }

  MaxDate() {
    let curDate = new Date();
    curDate.setDate(curDate.getDate());
    return curDate;
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

  openFileUploadModal(type) {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      this.fileUploadType = type;
      this.setorUsetFiles(true,type);
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  setorUsetFiles(setOrUnset,type){
    if(setOrUnset){
      this.clearAttachments()
      switch(type){
        case 'duration': this.processDocuments(this.durationFiles,'event-date');
              break;
        case 'scope': this.processDocuments(this.scopeFiles,'event-scope');
              break;
        case 'budget': this.processDocuments(this.budgetFiles,'event-budget');
              break;    
        case 'status': this.processDocuments(this.statusFiles,'event-status');
              break;                 
      }
    }
    else this.clearAttachments()
  }

  processDocuments(documents,type){
    this.clearAttachments()
		let khDocuments = [];
    let systemFiles = [];
    documents.forEach(element=>{
      // if(!element.is_deleted){
        if(element.document_id || element.is_kh_document){
          khDocuments.push({
            ...element,
            'is_kh_document': true,
          })
          fileUploadPopupStore.setUpdateFileArray({
            'updateId': element.id,
            ...element
          })
        }
        else{
          if (element && element.token) {
            var purl = '';
            if(element.is_new){
              purl = element.preview;
            }
            else{
              purl = this._eventFileService.getThumbnailPreview(type, element.token);
            }
            var lDetails = {
              title: element.title ? element.title : element.name,
              name: element.title ? element.title : element.name,
              ext: element.ext,
              size: element.size,
              url: element.url,
              token: element.token,
              thumbnail_url: element.thumbnail_url,
              preview: purl,
              id: element.id,
              'is_kh_document': false,
            }
            if(element.is_new) lDetails['is_new'] = true;
            systemFiles.push(lDetails);
            this._fileUploadPopupService.setSystemFile(lDetails, purl)
          }
        }
      // }
    })
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  setDocuments(documents,type,setorunset?) {
    this.clearAttachments()
		let khDocuments = [];
    let systemFiles = [];
		documents.forEach(element => {
			if (element.document_id) {
				element.kh_document.versions.forEach(innerElement => {
					if (innerElement.is_latest) {
						khDocuments.push({
							...innerElement,
							'is_kh_document': true,
						})
						fileUploadPopupStore.setUpdateFileArray({
							'updateId': element.id,
							...innerElement
						})
					}
				});
			}
			else {
				if (element && element.token) {
					var purl = this._eventFileService.getThumbnailPreview(type, element.token)
					var lDetails = {
            title: element.title ? element.title : element.name,
						name: element.title ? element.title : element.name,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: element.id,
						'is_kh_document': false,
            // 'verificationId':element.verificationId
					}
          systemFiles.push(lDetails);
				}
				if(!setorunset) this._fileUploadPopupService.setSystemFile(lDetails, purl)
			}
		});
    if(!setorunset){
      fileUploadPopupStore.setKHFile(khDocuments)
      let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
      fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    }
    else{
      let allDocuments = [...khDocuments, ...systemFiles]
      return allDocuments;
    }
	}

  clearAttachments(){
    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = false;
      // if(this.fileUploadType=='duration'){
      //   fileUploadPopupStore.displayFiles.forEach(elem=>{
      //     this.durationFiles.push(elem)
      //   })
        
      // }
      // else if(this.fileUploadType=='status'){
      //   fileUploadPopupStore.displayFiles.forEach(elem=>{
      //     this.statusFiles.push(elem)
      //   })
      // }
      // else if(this.fileUploadType=='budget'){
      //   fileUploadPopupStore.displayFiles.forEach(elem=>{
      //     this.budgetFiles.push(elem)
      //   })
      // }
      // else if(this.fileUploadType=='scope'){
      //   fileUploadPopupStore.displayFiles.forEach(elem=>{
      //     this.scopeFiles.push(elem)
      //   })
      // }
      switch(this.fileUploadType){
        case 'duration': this.durationFiles = fileUploadPopupStore.displayFiles;
                          break;
        case 'status': this.statusFiles = fileUploadPopupStore.displayFiles;
                          break;
        case 'budget': this.budgetFiles = fileUploadPopupStore.displayFiles;
                          break;
        case 'scope': this.scopeFiles = fileUploadPopupStore.displayFiles;
                          break;
      }
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this.clearAttachments()
        this.fileUploadType = ''
        this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.event_type) {
      case 'budget': this.deleteBudgets(status)
        break;
      case 'Cancel': 
        setTimeout(() => {
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 250);
        if(EventsStore.selectedEventId)this._router.navigateByUrl('event-monitoring/events/'+EventsStore.selectedEventId+'/change-request')
        else this._router.navigateByUrl('event-monitoring/events')
        break;
    }
  }

  deleteBudgets(status){
    //console.log(this.popupObject.id.year)
    if(status && EventChangeRequestStore.budgets.length > 0 ){
       let pos = EventChangeRequestStore.budgets.findIndex(e=> e.year == this.popupObject.id.year);
       //let epos = EventsStore.eventDetails.event_budgets.findIndex(e => e.year == this.popupObject.id.year);
       if(pos != -1 && EventChangeRequestStore.budgets[pos].status=='existing'){
        EventChangeRequestStore.budgets[pos].type = 'deleted';
       }
       else
       {
         
        EventChangeRequestStore.budgets.splice(pos,1);
       }
       //console.log(EventChangeRequestStore.budgets);
       this._utilityService.detectChanges(this._cdr);
    } else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    // else
      // return this._incidentFileService.getThumbnailPreview(type, token);
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  removeDocument(doc,type) {
    // if (doc.hasOwnProperty('is_kh_document')) {
    //   if (!doc['is_kh_document']) {
    //     fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    //   }
    //   else {
    //     fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
    //   }
    // }
    // else {
    //   fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    // }
    switch(type){
      case 'duration': 
              let dpos = this.durationFiles.findIndex(e =>e.token == doc.token);
              // if (this.durationFiles[dpos].hasOwnProperty('is_new')) {   
              //   this.durationFiles.splice(dpos,1);
              // }
              // else {               
              //     this.durationFiles[dpos]['is_deleted'] = true;
              // }
              this.durationFiles.splice(dpos,1);
              break;
        case 'scope': 
              let spos = this.scopeFiles.findIndex(e =>e.token == doc.token);
              // if (this.scopeFiles[spos].hasOwnProperty('is_new')) {   
              //   this.scopeFiles.splice(spos,1);
              // }
              // else {               
              //     this.scopeFiles[spos]['is_deleted'] = true;
              // }
              this.scopeFiles.splice(spos,1);
              break;
        case 'budget': 
              // if(doc.hasOwnProperty('is_kh_document')){
              //   if(!doc['is_kh_document']){
              //     fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
              //   }
              //   else{
              //     fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
              //   }
              // }
              // else{
              //   fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
              // }
              let bpos = this.budgetFiles.findIndex(e =>e.token == doc.token);
              // if (this.budgetFiles[bpos].hasOwnProperty('is_new')) {   
              //   this.budgetFiles.splice(bpos,1);
              // }
              // else {               
              //     this.budgetFiles[bpos]['is_deleted'] = true;
              // }
              this.budgetFiles.splice(bpos,1);
              break;    
        case 'status': 
              let pos = this.statusFiles.findIndex(e =>e.token == doc.token);
              // if (this.statusFiles[pos].hasOwnProperty('is_new')) {   
              //   this.statusFiles.splice(pos,1);
              // }
              // else {               
              //     this.statusFiles[pos]['is_deleted'] = true;
              // }
              this.statusFiles.splice(pos,1);
              break;   
    }
    this._utilityService.detectChanges(this._cdr);
  }

  addBudgets(){
    this.budgetObject.type = 'Add';
    this.openNewBudget();
  }

  openNewBudget(){
    setTimeout(() => {
      $(this.budget.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.budget.nativeElement,'display','block');
    this._renderer2.setStyle(this.budget.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.budget.nativeElement,'z-index',99999);
  }

  closeNewBudget(){
    setTimeout(() => {
      this.budgetObject.type = null;
      this.budgetObject.value = null;
      $(this.budget.nativeElement).modal('hide');
      this._renderer2.removeClass(this.budget.nativeElement,'show');
      this._renderer2.setStyle(this.budget.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  delete(item) {
   
    if(item.type != ''){
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = item;
      this.popupObject.event_type = 'budget'
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'em_cr_budget_delete_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    else{
      let pos = EventChangeRequestStore.budgets.findIndex(e => e.year == item.year);
      if(pos != -1) EventChangeRequestStore.budgets.splice(pos,1);
    }
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  getTabNumerScope(){
    let number 
    if(this.is_duration && this.is_status && this.is_scopeofwork){
      number = 3
    }else if (!this.is_duration && this.is_status && this.is_scopeofwork ){
      number = 2
    }else if (this.is_duration && !this.is_status && this.is_scopeofwork){
      number = 2
    }else if (!this.is_duration && !this.is_status && this.is_scopeofwork){
      number = 1
    }
    return number
  }
  getTabNumberOfBudget(){
    let number 
    if(this.is_duration && this.is_status && this.is_scopeofwork && this.is_budget){
      number = 4
    }else if (!this.is_duration && this.is_status && this.is_scopeofwork && this.is_budget ){
      number = 3
    }else if (this.is_duration && this.is_status && this.is_scopeofwork && !this.is_budget){
      number = 3
    }else if (this.is_duration && this.is_status && !this.is_scopeofwork && this.is_budget){
      number = 3
    }else if (!this.is_duration && this.is_status && this.is_scopeofwork && !this.is_budget){
      number = 2
    }else if (!this.is_duration && this.is_status && !this.is_scopeofwork && this.is_budget){
      number = 2
    }else if (this.is_duration && this.is_status && !this.is_scopeofwork && !this.is_budget){
      number = 2
    }else if (!this.is_duration && this.is_status && !this.is_scopeofwork && !this.is_budget){
      number = 1
    }
    return number
  }


  getTabNumberOfDelivarables(){
    let number 
    if(this.is_duration && this.is_status && this.is_scopeofwork && this.is_budget){
      number = 5
    }else if (!this.is_duration && this.is_status && this.is_scopeofwork && this.is_budget  ){
      number = 4
    }else if (this.is_duration && !this.is_status && this.is_scopeofwork && this.is_budget){
      number = 4
    }else if (this.is_duration && this.is_status && !this.is_scopeofwork && this.is_budget){
      number = 4
    }else if (this.is_duration && this.is_status && this.is_scopeofwork && !this.is_budget){
      number = 4
    }else if (!this.is_duration && ! this.is_status && this.is_scopeofwork && this.is_budget){
      number = 3
    }else if (this.is_duration && !this.is_status && !this.is_scopeofwork && this.is_budget){
      number = 3
    }else if (this.is_duration && this.is_status && !this.is_scopeofwork && !this.is_budget){
      number = 3
    }else if (!this.is_duration && this.is_status && this.is_scopeofwork && !this.is_budget){
      number = 3
    }else if (!this.is_duration && this.is_status && !this.is_scopeofwork && this.is_budget){
      number = 3
    }else if (this.is_duration && !this.is_status && this.is_scopeofwork && !this.is_budget){
      number = 3
    }else if (!this.is_duration && !this.is_status && !this.is_scopeofwork && this.is_budget){
      number = 2
    }else if (this.is_duration && !this.is_status && !this.is_scopeofwork && !this.is_budget){
      number = 2
    }else if (!this.is_duration && this.is_status && !this.is_scopeofwork && !this.is_budget){
      number = 2
    }else if (!this.is_duration && !this.is_status && this.is_scopeofwork && !this.is_budget){
      number = 2
    }else if (!this.is_duration && !this.is_status && !this.is_scopeofwork && !this.is_budget){
      number = 1
    }
    return number
  }

  saveDuration(step,htmlElement){
    this.setorUsetFiles(true,'duration');
    let obj = {
      existing_start_date : this._helperService.processDate(EventsStore.eventDetails?.start_date,'join'),
      existing_end_date : this._helperService.processDate(EventsStore.eventDetails?.end_date,'join'),
      new_start_date : this.form.value.new_start_date?this._helperService.passSaveFormatDate(this.form.value.new_start_date):'',
      new_end_date : this.form.value.new_end_date?this._helperService.passSaveFormatDate(this.form.value.new_end_date):'',
      justification : this.form.value.justification_event_date ? this.form.value.justification_event_date : null,
      documents:this.editFlag ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(this.durationFiles, 'save')
    }
    this._eventChangeRequestService.saveDuration(obj,EventChangeRequestStore.selectedCRId).subscribe(res=>{
      this.updateCurrentTab(step,htmlElement);
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

  getBudgetData(){
    let data = []
   if(EventChangeRequestStore.budgets.length > 0) {
     for(let amt of EventChangeRequestStore.budgets){
      //  if(amt.type != 'deleted'){
        let pos = BudgetStore.allItems.findIndex(e=>e.year ==  amt.year)
        let obj
        if(pos != -1){
          if(amt.type != 'deleted'){
            obj = {
              year : amt.year,
              new_amount : amt.newAmount,
              existing_amount :  BudgetStore.allItems[pos].amount
             }
          }
          else{
            obj = {
              year : amt.year,
              new_amount : BudgetStore.allItems[pos].amount,
              existing_amount :  BudgetStore.allItems[pos].amount,
              is_deleted:1
             }
          }
         }else {
           if(amt.type != 'deleted'){
            obj = {
              year : amt.year,
              new_amount : amt.newAmount,
              existing_amount : 0
             }
           }
           else{
            obj = {
              year : amt.year,
              new_amount : amt.newAmount,
              existing_amount : 0,
              is_deleted: 1
             }
           }
          
         }
         
         data.push(obj)
      //  }
      
     }
   }
   return data
  }

  changeRequestBudgetChange(step,htmlElement){
    this.setorUsetFiles(true,'budget');
    let obj = {
      budgets : this.getBudgetData(),
      justification : this.form.value.justification_event_budget,
      documents:this.editFlag ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(this.durationFiles, 'save')
    }
    this._eventChangeRequestService.saveBudget(obj,EventChangeRequestStore.selectedCRId).subscribe(res=>{
      this.updateCurrentTab(step,htmlElement);
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

  changeRequestScopeOfWork(step,htmlElement){
    this.setorUsetFiles(true,'scope');
    let obj = {
      scopes : this.getScopesValue(),
      justification : this.form.value.justification_event_scope,
      documents:this.editFlag ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(this.durationFiles, 'save')
    }
    this._eventChangeRequestService.saveScope(obj,EventChangeRequestStore.selectedCRId).subscribe(res=>{
      this.updateCurrentTab(step,htmlElement);
      this._utilityService.detectChanges(this._cdr); 
    },(err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){

        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
    })
  }

  changeRequestStatusChange(step,htmlElement) {
    this.setorUsetFiles(true,'status');
    let obj = {
      old_event_status_id:EventsStore.eventDetails?.event_status?.id,
      new_event_status_id: this.form.value.new_event_status_id,
      justification: this.form.value.justification_event_status,
      documents:this.editFlag ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(this.durationFiles, 'save')
    }
    this._eventChangeRequestService.saveStatus(obj, EventChangeRequestStore.selectedCRId).subscribe(res => {
      this.updateCurrentTab(step,htmlElement);
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {

      }
      AppStore.disableLoading();
    })
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
    if (n == x.length - 1) {
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
      if (document.getElementById("saveBtn")) document.getElementById("saveBtn").style.display = "none";
    } else {
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save & Next";
      if (document.getElementById("saveBtn")) document.getElementById("saveBtn").style.display = "inline";
    }
    //... and run a function that will display the correct step indicator:
    this._utilityService.scrollToTop();
    this.fixStepIndicator(n);
  }
  
  nextPrev(n,is_save:boolean=false) {
    // This function will figure out which tab to display
    var x:any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    // if (n == 1 && !validateForm()) return false;
    document.getElementsByClassName("step")[this.currentTab].className += " finish";
    // Hide the current tab:
    // x[this.currentTab].style.display = "none"; - for testing
    // Increase or decrease the current tab by 1:
    if (x[this.currentTab].id == 'duration' && n==1 && is_save){
      this.saveDuration(n,x)
    }
    if (x[this.currentTab].id == 'status' && n==1 && is_save){
      this.changeRequestStatusChange(n,x)
    }
    if (x[this.currentTab].id == 'scope' && n==1 && is_save){
      this.changeRequestScopeOfWork(n,x)
    }
    if (x[this.currentTab].id == 'budget' && n==1 && is_save){
      this.changeRequestBudgetChange(n,x)
    }
    if(!is_save){
      this.updateCurrentTab(n,x);
    }
  }

  updateCurrentTab(n,htmlElement){
    htmlElement[this.currentTab].style.display = "none";
    this.currentTab = this.currentTab + n;
    // if you have reached the end of the form...
    if (this.currentTab >= htmlElement.length) {
      if(EventChangeRequestStore.selectedCRId) this._router.navigateByUrl(`/event-monitoring/events/${EventsStore.selectedEventId}/change-request/${EventChangeRequestStore.selectedCRId}`)
      else this._router.navigateByUrl(`/event-monitoring/events/${EventsStore.selectedEventId}/change-request`)
      // ... the form gets submitted:
      //document.getElementById("regForm").submit();
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      htmlElement[this.currentTab].style.display = "block";
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

  validateItems() {

    var x: any = document.getElementsByClassName("tab");
    if (x.length > 0) {
      if (x[this.currentTab].id == 'duration') {
        if (this.form.value.new_start_date && this.form.value.new_end_date && this.form.value.justification_event_date) {
          return false
        } else {
          return true
        }
      }
      if (x[this.currentTab].id == 'scope') {
        if (this.inScopes.length > 0 && this.outScopes.length > 0 && this.assumptions.length > 0 && this.form.value.justification_event_scope) {
          return false
        } else {
          return true
        }

      }
      if (x[this.currentTab].id == 'budget') {
        if (EventChangeRequestStore.budgets.length > 0 && this.form.value.justification_event_budget) {
          return false
        } else {
          return true
        }
      }
      if (x[this.currentTab].id == 'status') {
        if (this.form.value.new_event_status_id && this.form.value.justification_event_status) {
          return false
        } else {
          return true
        }
      }
    }
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

  checkFormObject(tabNumber?:number){
    var setValid = true;
    if(!tabNumber){
      if(this.formObject.hasOwnProperty(this.currentTab)){
        for(let i of this.formObject[this.currentTab]){
          if(!this.form.controls[i].valid){
            setValid = false;
            break;
          }
        }
      }
    }
    else{
      for(var i = 0; i < tabNumber; i++){
        if(this.formObject.hasOwnProperty(i)){
          for(let k of this.formObject[i]){
            if(!this.form.controls[k].valid){
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }
  /*-------------------------- Functions to handle step form Ends Here-----------------------------------------------*/

  changeStep(step,stepsArray){
    let valid: boolean = false;
    if(stepsArray.length == 0) valid = true;
    for(let i of stepsArray){
      switch(i){
        case 'duration': if(!this.is_duration)
                          valid = true;
                        else{
                          valid = this.checkFormObject(0);
                        }
                        break;
        case 'budget': if(!this.is_budget)
                        valid = true;
                      else{
                        valid = this.checkFormObject(0);
                        if(this.EventChangeRequestStore.budgets.length == 0){
                          valid = false;
                        }
                      }
                      break;
      case 'scope': if(!this.is_scopeofwork)
                      valid = true;
                    else{
                      valid = this.checkFormObject(0);
                    }
                    break;
        default: break;
      }
    }
    if(valid){
      if(step > this.currentTab){
        let dif = step - this.currentTab;
        this.nextPrev(dif)
      }
      else if(step < this.currentTab){
        let dif = this.currentTab - step;
        this.nextPrev(-dif);
      }  
    }
  }


  cancelClicked() {
    this.popupObject.type = 'Cancel';
    this.popupObject.title = 'Cancel?';
    this.popupObject.event_type = 'Cancel';
    this.popupObject.subtitle = 'This action cannot be undone';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  cancelRequest(status) {
    if (status) {
      this._router.navigateByUrl(AppStore.previousUrl ? AppStore.previousUrl : '/event-monitoring/event-change-requests');
      this.clearConfirmationObject();
    }
    else {
      this.clearConfirmationObject();
    }
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }

  clearConfirmationObject(){
    this.popupObject.type = null;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.eventBudgetEventSubscrion.unsubscribe()
    this.popupControlEventSubscription.unsubscribe()
    this.eventScopeEventSubscrion.unsubscribe()
    SubMenuItemStore.makeEmpty();
    EventChangeRequestStore.selectedTabs = []
    EventChangeRequestStore.unSetBudgets()
    EventChangeRequestStore.unsetDetails()
    this.formErrors = null
  }

}
