import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { MsAuditModesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-modes/ms-audit-modes.service';
//import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { MsAuditPlansService } from 'src/app/core/services/ms-audit-management/ms-audit-plans/ms-audit-plans.service';
import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MsAuditModesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-modes-store';
//import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { autorun } from 'mobx';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $: any;

@Component({
  selector: 'app-ms-audit-schedules-add',
  templateUrl: './ms-audit-schedules-add.component.html',
  styleUrls: ['./ms-audit-schedules-add.component.scss']
})
export class MsAuditSchedulesAddComponent implements OnInit, OnDestroy  {

  @Input('source') source: any;
  @Input('selectedPlan') selectedPlanData: any;//Plan base Plan select
  @Input('brudCrubAndCloseButtonScoure') brudCrubAndCloseButtonScoure: any;
  @ViewChild('processFormModal') processFormModal: ElementRef;

  modalObject = {
    component : 'audit_schedule',
    department_id:''
  }
  
  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  name = '';

  todayDate: any = new Date();
  minDate: any = new Date();
  maxDate: any = new Date();
  disablePlan:boolean=true;
  planDepartment:any;
  AppStore = AppStore;
  UsersStore = UsersStore;
  reactionDisposer: IReactionDisposer;
  MsAuditPlansStore = MsAuditPlansStore;//** module
  //DepartmentMasterStore = DepartmentMasterStore;
  MsAuditSchedulesStore = MsAuditSchedulesStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MsAuditModesMasterStore = MsAuditModesMasterStore;
  ProcessStore = ProcessStore;//*mapping
  ProcessesSelectSubscription: any = null; //modal mapping process
  NoDataItemStore=NoDataItemStore;
  OrganizationModulesStore=OrganizationModulesStore;
  compareAuditorAndAuditee=true;

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    //private _departmentService: DepartmentService,//*master
    private _eventEmitterService: EventEmitterService,
    private _msAuditPlansService: MsAuditPlansService,//* module
    private _msAuditSchedulesService: MsAuditSchedulesService,
    private _msAuditModesService: MsAuditModesService,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit(): void {
  // console.log(this.source)
    NoDataItemStore.unsetNoDataItems();
    this.checkNoDataProcess()
    
    this.reactionDisposer = autorun(() => {

    if(NoDataItemStore.clikedNoDataItem){
      this.selectProcesses();
      NoDataItemStore.unSetClickedNoDataItem();
    }
    });

    AppStore.showDiscussion = false;
    AppStore.disableLoading();

    this.form = this._formBuilder.group({
      id: [null],
      ms_audit_plan_id: [null, [Validators.required]],
      title:['',[Validators.required]],
      description:[''],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      department_id: [null, [Validators.required]],
      // lead_auditee_id: [null, [Validators.required]],
      auditor_ids:[[], [Validators.required]],
      auditee_ids: [[], [Validators.required]],
     // process_id : [null, [Validators.required]],
      ms_audit_mode_id:[null, [Validators.required]],
    });

    this.resetForm();

    //MsAuditPlansStore.unsetIndividualMsAuditPlansDetails();

    if (MsAuditSchedulesStore.individualLoaded) {
      this.setEditDetails();
    }
 
    if (this.selectedPlanData) {//program detials inside audit plan add automatic select program and set heading
      this.disablePlan=true;
      this.form.patchValue({
        'ms_audit_plan_id':this.selectedPlanData,
      })

      MsAuditPlansStore.setMsAuditPlansId(this.selectedPlanData?.id);
      this.getPlanDetails();
    }else{
      this.disablePlan=true;
    }

    // this.form.get('ms_audit_plan_id').valueChanges.subscribe(val => {// prv ms_audit_plan title set title
    //   if (val?.id) {
    //     MsAuditPlansStore.setMsAuditPlansId(val?.id);
    //     this.getPlanDetails();
    //   } 
    // });

    this.ProcessesSelectSubscription = this._eventEmitterService.modalChange.subscribe(item => {
      this.closeProcesses();
    });

    this.getMsAuditPlan();
  }

  checkNoDataProcess()
  {
    setTimeout(() => {
      if(this.form.value.department_id?.id)
      {
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_process",subtitle:"add_procedure_subtitle",buttonText:"add_procedure"});
      }
      else
      {
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_process",subtitle:"add_procedure_subtitle"});
      }
      this._utilityService.detectChanges(this._cdr);
    }, 1500);
    
  }

  getPlanDetails(){
    this._msAuditPlansService.getItem(this.form.value.ms_audit_plan_id.id).subscribe(res => {
      this.minDate=new Date(MsAuditPlansStore.individualMsAuditPlansDetails?.start_date); 
      this.maxDate=new Date(MsAuditPlansStore.individualMsAuditPlansDetails?.end_date);
      this.planDepartment=res?.department;
     if(this.source.type=='Add')
     {
      this.form.patchValue({
        start_date:  new Date(MsAuditPlansStore.individualMsAuditPlansDetails?.start_date),
        end_date:new Date(MsAuditPlansStore.individualMsAuditPlansDetails?.end_date),
        ms_audit_mode_id: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_mode  ? this.MsAuditPlanMode(): null,
 
       })
     }
      
    this._utilityService.detectChanges(this._cdr);
    });
  }

  setEditDetails() {
    //console.log("hi");
    setProcesses(MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.processes);
    MsAuditPlansStore.setMsAuditPlansId(MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.id);
   
    this.form.patchValue({
      id: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.id,
      title: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.title,
      ms_audit_mode_id: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.ms_audit_mode  ? this.MsAuditMode(): null,
      ms_audit_plan_id: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details ? MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details : null,
      description:MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.description ? MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.description : '',
      start_date: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.start_date ? new Date( MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.start_date) : '',
      end_date: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.end_date ? new Date( MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.end_date) : '',
      department_id:  MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.department ? MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.department: null,
      // lead_auditee_id:  MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.lead_auditee?  MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.lead_auditee : null,
      auditee_ids:   MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditees.length?  this.getAuditorsAndAditeesAll( MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditees) : [],
      auditor_ids: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditors.length?  this.getAuditorsAndAditeesAll( MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditors) : [],
      //process_id : MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.process ? MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.process : null
    });
    this.getPlanDetails();
    //console.log(this.form.value);

    

    function setProcesses(items) {
      ProcessStore.selectedProcessesList = [];
      let processItem = items;
      for (let i of processItem) {
        i['process_group_title'] = i.title;
        i['department'] = i.department?.title;
        i['process_category_title'] = i.process_category?.title;
        ProcessStore.selectedProcessesList.push(i);
      }
    }
  }

  MsAuditMode(){
    return {
      id: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.ms_audit_mode?.language[0]?.pivot?.ms_audit_mode_id,
      title: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.ms_audit_mode?.language[0]?.pivot?.title
    }
  }

  MsAuditPlanMode()
  {
    return {
      id: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_mode?.language[0]?.pivot?.ms_audit_mode_id,
      title: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_mode?.language[0]?.pivot?.title
    }
  }

  checkDatePast(date)
  { 
    if(new Date()>new Date(date))
    {
      return true
    }
    else
    {
      return false;
    }
  }

  getAuditorsAndAditeesAll(data)
  {
    let item=[];
    for(let i of data)
    {
      item.push(i.user);
    }
    return item
  }

  getMsAuditPlan() {
    this._msAuditPlansService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMsAuditPlan(event) {
    this._msAuditPlansService.getItems(true,'?q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  selectDepartment()
  {
    // console.log(this.form.value.department_id)
    if(this.form.value.department_id)
    {
        this.form.patchValue({
          title:this.form.value.department_id.title,
          auditee_ids:[]
        })
      
      //this.checkNoDataProcess();
      this._utilityService.detectChanges(this._cdr);
    }
    // else
    // {
    //   this.checkNoDataProcess();
    // }
    this.checkNoDataProcess();
  }

  getUsers() {
    if(this.form.value.department_id)
    {
      var params = '?department_ids='+this.form.value.department_id.id;
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
    }
    
  }

  searchUsers(e) {
    if(this.form.value.department_id)
    {
      var params = '&department_ids='+this.form.value.department_id.id;
      this._usersService.searchUsers('?q=' +e.term+params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
   
  }

  minEndDateTimeValidator(){
    return this.form.value.start_date?new Date(this.form.value.start_date):this.minDate;
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  createImageUrl(token) {// user-defined
    return this._imageService.getThumbnailPreview('user-profile-picture', token)
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  searchListclickValueClear(event) {
    return event.searchTerm = '';
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

  cancel() {
    this.closeFormModal('cancel');
   // NoDataItemStore.unsetNoDataItems();
  }

  selectProcesses() {
    ProcessStore.processes_form_modal = true;
    this.modalObject.department_id=this.form.value.department_id?.id;
    setTimeout(() => {
      $(this.processFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeProcesses() {
    ProcessStore.processes_form_modal = false;
    this.modalObject.department_id=null;
    $(this.processFormModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal(type, resId?) {
    AppStore.disableLoading();
    this.resetForm();

    if (resId) {
      this._router.navigateByUrl('ms-audit-management/ms-audit-schedules/' + resId);

      if(this.brudCrubAndCloseButtonScoure){
        MsAuditSchedulesStore.setPath(this.brudCrubAndCloseButtonScoure?.path);
        BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
        BreadCrumbMenuItemStore.makeEmpty();
        BreadCrumbMenuItemStore.addBreadCrumbMenu({
          name:this.brudCrubAndCloseButtonScoure?.name,
          path:this.brudCrubAndCloseButtonScoure?.path
        });
      }

    }
    this._eventEmitterService.dismissCommonModal(type);
  }

  resetForm() {
    // this.form.reset();
    // this.form.pristine;
    if(this.source.type=='Add')
    {
      this.form.patchValue({
        id:null,
        title:null,
        description:null,
        department_id:null,
        auditor_ids:[],
        auditee_ids:[],
        ms_audit_mode_id:null
      })
    }
    
    this.formErrors = null;
    ProcessStore.selectedProcessesList = [];
    // this.form.patchValue({
    //   'ms_audit_plan_id':this.selectedPlanData? this.selectedPlanData : null,
    // })

    //MsAuditPlansStore.unsetIndividualMsAuditPlansDetails();
  }

  getMsAuditModes() {
    this._msAuditModesService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  customFormValidaters(){
    if(ProcessStore.selectedProcessesList.length>0)
    return false
    else
    return true;
    //ProcessStore.selectedProcessesList.length>0 && this.form.value.checklists.length>0 ? return false :  true
  }

  searchMsAuditModes(event) {
    this._msAuditModesService.getItems(true,'?q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  
  getEmployeePopupDetails(users, created?: string) { //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }

  getSaveData() {
    
    this.saveData = {
      ms_audit_plan_id:this.form.value.ms_audit_plan_id? this.form.value.ms_audit_plan_id?.id: null,
      title:this.form.value.title? this.form.value.title: null,
      description: this.form.value.description? this.form.value.description: '', 
      start_date: this.form.value.start_date ? this._helperService.passSaveFormatDate(this.form.value.start_date) : '',
      end_date: this.form.value.end_date ? this._helperService.passSaveFormatDate(this.form.value.end_date) : '',
      department_id:this.form.value.department_id? this.form.value.department_id?.id: null,
      // lead_auditee_id:this.form.value.lead_auditee_id? this.form.value.lead_auditee_id?.id: null,
      auditees: this.form.value.auditee_ids? this.checkdataModeAuditee(this.form.value.auditee_ids): [],
      process_id : this.form.value.process_id ? this.form.value.process_id?.id : null,
      ms_audit_mode_id: this.form.value.ms_audit_mode_id ? this.form.value.ms_audit_mode_id.id: null,
      auditors:this.form.value.auditor_ids? this.checkdataModeAuditores(this.form.value.auditor_ids) : [],
      process_ids: ProcessStore.selectedProcessesList ? this._helperService.getArrayProcessed(ProcessStore.selectedProcessesList, 'id') : [],
    }

  }

  checkdataModeAuditee(data)
  {
    let item=[];
    let deletedItem=[];
    if(this.source.type=='Add')
    {
       for(let i of data)
       {
        item.push({user_id:i.id,is_new:true})
       } 
    }
    else
    {
  
        for(let i of data)
          {
              let dataItem=MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditees.find(e=>e.user.id==i.id);
              if(dataItem)
              {
                
                item.push({user_id:i.id});
              }
              else{
                item.push({user_id:i.id,is_new :true});
              }
          }
     
       deletedItem=this.getDeletedItemAuditee(data);
       
    }
    //console.log(item)
    if(deletedItem?.length)
    {
     for(let i of deletedItem)
     {
      item.push(i);
     }

    }

    return item;
  }

  checkdataModeAuditores(data)
  {
    let item=[]
    let deletedItem;
    if(this.source.type=='Add')
    {
       for(let i of data)
       {
        item.push({user_id:i.id,is_new:true})
       } 
    }
    else
    {
        for(let i of data)
          {
              let dataItem=MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditors.find(e=>e.user.id==i.id);
              
              if(dataItem)
              {
                
                item.push({user_id:i.id});
              }
              else{
                item.push({user_id:i.id,is_new :true});
              }
          }
          deletedItem=this.getDeletedItemAuditors(data);

    }
    if(deletedItem?.length)
    {
     for(let i of deletedItem)
     {
      item.push(i);
     }

    }
    return item
  }

  getDeletedItemAuditors(data)
  {
    let item=[]
    for(let i of MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditors)
       {
        let dataItem=data.find(e=>e.id==i.user.id);
          if(dataItem==undefined)
          {
            item.push({user_id:i.user.id,is_deleted :true});
          }
    
       }
      return item;
  }


  getDeletedItemAuditee(data)
  {
    let item=[]
    for(let i of MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditees)
       {
          let dataItem=data.find(e=>e.id==i.user.id);
          //console.log(dataItem)
          if(dataItem==undefined)
          {
            item.push({user_id:i.user.id,is_deleted :true});
          }
    
       }
       //console.log(item)
      return item;
  }
  

  save(close: boolean = false) {
    if (this.form.value ) {

      let save;
      AppStore.enableLoading()
      this.getSaveData();
      if(this.checkAuditeeorAuditors(this.saveData))
      {
        if (this.form.value.id) {
          save = this._msAuditSchedulesService.updateItem(this.form.value.id,this.saveData);
        } else {
          save = this._msAuditSchedulesService.saveItem(this.saveData);
        }
        save.subscribe(
          (res: any) => {
            this.resetForm();
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
            if (close) this.closeFormModal('save', res.id);
          },
          (err: HttpErrorResponse) => {
            AppStore.disableLoading();
            if (err.status == 422) {
              this.formErrors = err.error.errors;
            } else {
              this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
            }
            this._utilityService.detectChanges(this._cdr);
          }
        );
      }
      else
      {
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      }
      
    }
  }
  checkAuditeeorAuditors(data)
  {
    //console.log(data)
    let item=true;
    this.compareAuditorAndAuditee=true;
     if(data.auditees.length&&data.auditors.length)
     {
      for(let i of data.auditors)
      {
        const index=data.auditees.findIndex(e=>e.user_id==i.user_id && (!e?.is_deleted && !i?.is_deleted));
        if(index>-1)
        {
          item=false;
          this.compareAuditorAndAuditee=false;
          break;
        }
      }
     } 
     return item;
  }
  deleteProcesses(item){
    const index = ProcessStore.selectedProcessesList.indexOf(item);
    if (index > -1) {
      ProcessStore.selectedProcessesList.splice(index, 1); 
    }
  }

  ngOnDestroy(){
    //MsAuditPlansStore.unSetMsAuditPlans();
    NoDataItemStore.unsetNoDataItems();
    if (this.reactionDisposer) this.reactionDisposer();
    this.ProcessesSelectSubscription.unsubscribe();
  }
}
