import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditCategoryService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-category/ms-audit-category.service';
import { MsAuditProgramsService } from 'src/app/core/services/ms-audit-management/ms-audit-programs/ms-audit-programs.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MsAuditCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-category-store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { DatePipe } from '@angular/common'

declare var $: any;
@Component({
  selector: 'app-ms-audit-programs-add',
  templateUrl: './ms-audit-programs-add.component.html',
  styleUrls: ['./ms-audit-programs-add.component.scss']
})
export class MsAuditProgramsAddComponent implements OnInit, OnDestroy  {
  @ViewChild('msAuditCategoryformModal', { static: true }) msAuditCategoryformModal: ElementRef;//MS audit -Master
  @Input('source') source: any;

  msAuditCategoryObject = {
    component: 'Master',
    type: null,
    values: null
  }
  
  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  name = '';
  numberOfAuditPlan=[
  {"title":1},
  {"title":2},
  {"title":3},
  {"title":4},
  {"title":5},
  {"title":6},
  {"title":7},
  {"title":8},
  {"title":9},
  {"title":10},
  {"title":11},
  {"title":12},
  {"title":13},
  {"title":14},
  {"title":15},
];
selectedAuditPlans=[];

  todayDate: any = new Date();

  AppStore = AppStore;
  AuthStore = AuthStore;
  UsersStore = UsersStore;
  MsAuditProgramsStore = MsAuditProgramsStore;
  MsAuditCategoryMasterStore = MsAuditCategoryMasterStore; //Master
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MsTypeStore=MsTypeStore;//*
  msAuditCategorySubscriptionEvent:any;
  errorValidation:boolean=false;
  SubMenuItemStore=SubMenuItemStore;
  deletedItems=[];

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _msAuditCategoryService: MsAuditCategoryService, //Master
    private _msAuditProgramsService: MsAuditProgramsService,
    private _imageService: ImageServiceService,
    private _userService: UsersService,
    public datepipe: DatePipe,
    private _msTypeService: MstypesService,//*
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    AppStore.disableLoading();

    this.form = this._formBuilder.group({
      id: [null],
      title: ["", [Validators.required]],
      ms_audit_category_id: [null, [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      ms_type_ids:[[],[Validators.required]],
      audit_leader:[null],
      no_of_audit_plan:[null,[Validators.required]]
    });
    this.getUsers();
    this.resetForm();

    // MS Audit categoy modal
    this.msAuditCategorySubscriptionEvent = this._eventEmitterService.msAuditCategory.subscribe(res => {
      this.closeMSAuditCategoryModalAdd();

      this.searchMsAuditCategory({ term: MsAuditCategoryMasterStore.LastInsertedId });
    });

    if (MsAuditProgramsStore.individualLoaded) {
      this.setEditDetails();
    }

    this.getMsAuditCategory();
  }

  setEditDetails() {
   
    this.form.patchValue({
      id: MsAuditProgramsStore.individualMsAuditProgramsDetails?.id,
      //no_of_audit_plan:MsAuditProgramsStore.individualMsAuditProgramsDetails?.no_of_audit_plan?{"title":MsAuditProgramsStore.individualMsAuditProgramsDetails?.no_of_audit_plan}:null,
      title: MsAuditProgramsStore.individualMsAuditProgramsDetails?.title ? MsAuditProgramsStore.individualMsAuditProgramsDetails?.title : '',
      ms_type_ids:MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_types.length?this.processMsTypeOrganizations(MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_types):[],
      ms_audit_category_id: MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_audit_category ? formatReturnData() : null,
      start_date:  MsAuditProgramsStore.individualMsAuditProgramsDetails?.start_date ? this._helperService.processDate(MsAuditProgramsStore.individualMsAuditProgramsDetails?.start_date, 'split') : '',
      end_date:  MsAuditProgramsStore.individualMsAuditProgramsDetails?.end_date ? this._helperService.processDate(MsAuditProgramsStore.individualMsAuditProgramsDetails?.end_date, 'split') : '',
      
    });
    if(MsAuditProgramsStore.individualMsAuditProgramsDetails.audit_plans.length)
    {
     
      this.patchSelectedPatchValue();
    }
    else
    {
      this.form.patchValue({
        no_of_audit_plan:null
      })
    }

    function formatReturnData(){
      return {
        id:MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_audit_category?.language[0]?.pivot?.ms_audit_category_id,
        title: MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_audit_category?.language[0]?.pivot?.title
      }
    }
  
  }

  patchSelectedPatchValue()
  {
    this.selectedAuditPlans=[];
    for(let i of MsAuditProgramsStore.individualMsAuditProgramsDetails.audit_plans)
    {
      if(i.is_preplan)
      {
        this.selectedAuditPlans.push(
          {
          "audit_plan":i.title,
          "audit_leader":i.lead_auditor,
          "is_deleted":false,
          "id":i.id,
          "audit_plan_start_date":this._helperService.processDate(i.start_date,'split'),
          "audit_plan_end_date":this._helperService.processDate(i.end_date,'split')
         }
          )
      }
     
    }
    this.form.patchValue({
      no_of_audit_plan:{"title":this.selectedAuditPlans.length}
    })
  }

 

  selectPlans(val)
  {

    if(this.form.value.no_of_audit_plan && this.form.value.ms_audit_category_id)
    {
      if(this.selectedAuditPlans.length==0)
      {

        this.processPlanArrray(this.form.value.no_of_audit_plan.title);
        
      }
      else if(this.selectedAuditPlans.length<this.form.value.no_of_audit_plan.title)
      {
        //console.log(this.form.value.no_of_audit_plan.title-this.selectedAuditPlans.length);
        this.processPlanArrray(this.form.value.no_of_audit_plan.title-this.selectedAuditPlans.length)
      }
      else{
        this.selectedAuditPlans.splice(0, this.selectedAuditPlans.length-this.form.value.no_of_audit_plan.title);
      }
      if(this.source.type=='Add')
      {
        this.attachPlanTitle();
      }
      if(this.source.type=='Edit' && val)
      {
        this.attachPlanTitle();
      }
      
      
      //this.patchAuditLeader();
    }
   
    
    //console.log(this.selectedAuditPlans)
    
  }

  changePlanName(item)
  {
    //new Date(item?.audit_plan_start_date).toLocaleString('en-US', { timeZone: AppStore.appTimeZone });
     //item.audit_plan='';
      if(item?.audit_plan_start_date && item?.audit_plan_end_date)
      {
        if(item.audit_plan.indexOf('-'))
        {
          let string=item.audit_plan.split('-').pop();
         item.audit_plan=this.form.value.ms_audit_category_id.title+'-'+this.getDateOnly(new Date(this._helperService.processDate(item?.audit_plan_start_date , 'join')).toLocaleString('en-US', { timeZone: AppStore.appTimeZone }))+'-'+this.getDateOnly(new Date(this._helperService.processDate(item?.audit_plan_end_date , 'join')).toLocaleString('en-US', { timeZone: AppStore.appTimeZone }));
        }
        else
        {
          item.audit_plan=this.form.value.ms_audit_category_id.title+'-'+this.getDateOnly(new Date(this._helperService.processDate(item?.audit_plan_start_date , 'join')).toLocaleString('en-US', { timeZone: AppStore.appTimeZone }))+'-'+this.getDateOnly(new Date(this._helperService.processDate(item?.audit_plan_end_date , 'join')).toLocaleString('en-US', { timeZone: AppStore.appTimeZone }));
        }
        
      }
  }

  getDateOnly(date)
  {
   
    if(date=='Invalid Date')
    {
      return '';
      
    }
    else
    {
      if(date.indexOf('-'))
    {
      date=this.datepipe.transform(date, OrganizationGeneralSettingsStore.organizationSettings?.date_format);
      let string=date.split(',');
      return string;
    }
    else
    {
      date=this.datepipe.transform(date, OrganizationGeneralSettingsStore.organizationSettings?.date_format);
      return date;
    }
    }
    
    
  }

  clearValue()
  {
    for(let i of this.selectedAuditPlans)
        {
          //console.log(this.form.value.ms_audit_category_id.title)
          i.audit_plan=null,
          i.audit_leader=null

        }
  }

  patchAuditLeader(val?)
  {
    this.form.patchValue({
      audit_leader:null
    })
    if(val)
    { 
      this.clearValue();
    }
    this._msAuditProgramsService.getTeams(this.form.value.ms_audit_category_id.id).subscribe(res => {
      if(res.length)
      {
        this.form.patchValue({
          audit_leader:res[0].team_lead
        })
      }
      else
      {
        this.form.patchValue({
          audit_leader:null
        })
      }
      this.selectPlans(val);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  attachPlanTitle()
  {
    for(let i of this.selectedAuditPlans)
        {
          console.log(this.form.value.ms_audit_category_id.title)
          console.log(i)
          i.audit_plan=this.form.value.ms_audit_category_id.title+'-'+this.getDateOnly(new Date(this._helperService.processDate(i?.audit_plan_start_date , 'join')).toLocaleString('en-US', { timeZone: AppStore.appTimeZone }))+'-'+this.getDateOnly(new Date(this._helperService.processDate(i?.audit_plan_end_date , 'join')).toLocaleString('en-US', { timeZone: AppStore.appTimeZone })),
          i.audit_leader=i.audit_leader?i.audit_leader:this.form.value.audit_leader
          //console.log(i.audit_plan)
        }
  }

  processPlanArrray(number)
  {
    for(let i=1;i<= number;i++)
        {
            this.selectedAuditPlans.push(
              {
              "audit_plan":this.form.value.ms_audit_category_id.title,
              "audit_leader":this.form.value.audit_leader,
              "is_new":true,
              "is_deleted":false,
              "audit_plan_start_date":null,
              "id":"",
              "audit_plan_end_date":null}
              )
        }
  }

  getNotDeletedItem(data)
  {
    this.deletedItems.push(data);
  }

  delete(index,item)
  {
    if(!item.id)
    {
      this.selectedAuditPlans.splice(index,1);
    }
    else{
      const index=this.selectedAuditPlans.findIndex(e=>e.id==item.id)
      if(index>-1)
      {
        //this.selectedAuditPlans[index]['is_deleted']=true;
        this.getNotDeletedItem(item);
        this.selectedAuditPlans.splice(index,1);
      }
    }
    this.form.patchValue({
      no_of_audit_plan:this.getNotDeletedvalue(),
     
    });
    this._utilityService.showSuccessMessage('success','preplan_deleted_successfully')
    
  }
  getNotDeletedvalue()
  {
    return {title:this.selectedAuditPlans.length};
  }

  // serach users
  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // getting users
  getUsers() {
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  

  processMsTypeOrganizations(data)
    {
      let processedMsTypes = [];
      if (data) {
        for (let i of data) {
          let msTypes = { id: i.id, ms_type_title: i.ms_type?.title, ms_type_version_title: i.ms_type_version?.title };
          processedMsTypes.push(msTypes);
        }
      }
      return processedMsTypes;
    }

  getMsAuditCategory() {
    this._msAuditCategoryService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMsAuditCategory(event) {
    this._msAuditCategoryService.getItems(true,'?q=' + event.term).subscribe(res => {
      for (let item of res.data) {
        if (MsAuditCategoryMasterStore.LastInsertedId == item.id) {
          this.form.patchValue({ 
            ms_audit_category_id:item,
          });
        }
      }

      this._utilityService.detectChanges(this._cdr);
    });
  }

  getMsType() {
    this._msTypeService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMsType(event) {
    this._msTypeService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

   //Modal
  msAuditCategoryModalAdd() {
    MsAuditProgramsStore.msAuditCategoryformModal=true; 
    this.msAuditCategoryObject.type = 'Add';
    this.msAuditCategoryObject.values = null;
    $(this.msAuditCategoryformModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.msAuditCategoryformModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.msAuditCategoryformModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.msAuditCategoryformModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  closeMSAuditCategoryModalAdd() {
    this.msAuditCategoryObject.type = '';
    this.msAuditCategoryObject.values = null;
    MsAuditProgramsStore.msAuditCategoryformModal=false; 
    $(this.msAuditCategoryformModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.msAuditCategoryformModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.msAuditCategoryformModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.msAuditCategoryformModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }
  //**modal

  createDateTimeValidator() {
    if (MsAuditProgramsStore.editFlag) 
      return this.todayDate;
    else 
      return this.form.value.start_date?this.form.value.start_date:this.todayDate;
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
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
  }

  closeFormModal(type, resId?) {
    AppStore.disableLoading();
    this.resetForm();

    if (resId) {
      this._router.navigateByUrl('ms-audit-management/ms-audit-programs/' + resId);
    }
    this._eventEmitterService.dismissCommonModal(type);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  getArrayIds(data)
  {
    let item=[];
    for(let i of data)
    {
      item.push(i.id);
    }
    return item;
  }

  getSaveData() {
    
    this.saveData = {
      ms_audit_category_id:this.form.value.ms_audit_category_id? this.form.value.ms_audit_category_id?.id: null,
      ms_type_ids:this.form.value.ms_type_ids? this.getArrayIds(this.form.value.ms_type_ids): [],
      title: this.form.value.title ? this.form.value.title : '',
      no_of_audit_plan:this.selectedAuditPlans.length,
      start_date: this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date, 'join') : '',
      end_date: this.form.value.end_date ? this._helperService.processDate(this.form.value.end_date, 'join') : '',
      ms_audit_plans:this.selectedAuditPlans.length?this.getPlandata(this.selectedAuditPlans):[]
    }

  }

  getPlandata(data)
  {
    let item=[]
    let countIndex=1;
    for(let i of data)
    {
      item.push({
        title:i.audit_plan,
        is_new:i.is_new?i.is_new:false,
        is_deleted:i.is_deleted?i.is_deleted:false,
        id:i.id,
        index:countIndex,
        lead_auditor_id:i.audit_leader.id,
        start_date:this._helperService.processDate(i.audit_plan_start_date, 'join'),
        end_date:this._helperService.processDate(i.audit_plan_end_date, 'join')
      })
      countIndex++;
    }
    if(this.deletedItems.length)
    {
      for(let i of this.deletedItems)
      {
        item.push({
          title:i.audit_plan,
          is_new:false,
          is_deleted:true,
          id:i.id,
          index:countIndex,
          lead_auditor_id:i.audit_leader.id,
          start_date:this._helperService.processDate(i.audit_plan_start_date, 'join'),
          end_date:this._helperService.processDate(i.audit_plan_end_date, 'join')
        })
        countIndex++;
      }
    }
    return item

  }

  checkValid()
  {
    let flag=true;
    if(this.selectedAuditPlans.length)
    {
      for(let i of this.selectedAuditPlans)
      {
        if(!i.audit_leader || !i.audit_plan_start_date || !i.audit_plan_end_date || !i.audit_plan)
        {
          flag=false;
        }
      }
    }
    else
    {
      flag=false;
    }
    return flag;
    
  }

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      
      this.errorValidation=false;
      this.getSaveData();
      if(this.checkStartDateAndEnddate())
      {
        AppStore.enableLoading();
        if (this.form.value.id) {
          save = this._msAuditProgramsService.updateItem(this.form.value.id,this.saveData);
        } else {
          save = this._msAuditProgramsService.saveItem(this.saveData);
        }
        save.subscribe(
          (res: any) => {
            
            this.deletedItems=[]
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
            if (close) this.closeFormModal('save', res.id);
            if(!close && this.source.type=='Add')
            {
              this.resetForm();
              this.selectedAuditPlans=[];
            }
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
      else{
        this.errorValidation=true;
      }
      //console.log(this.saveData)
      
    }
  }

  checkStartDateAndEnddate()
  {
    let flag=true;
    for(let i of this.saveData.ms_audit_plans)
    {
        const item=this.saveData.ms_audit_plans.find(e=>(e.start_date==i.start_date && e.end_date==i.end_date && e.index!=i.index))
        if(item)
        {
          flag=false;
        }
    }
    return flag;
  }

  ngOnDestroy(){
    this.msAuditCategorySubscriptionEvent.unsubscribe();
    
  }
}
