import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { AuditPlanScheduleService } from 'src/app/core/services/internal-audit/audit-plan-schedule/audit-plan-schedule.service';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { AvailableAuditorsService } from 'src/app/core/services/internal-audit/available-auditors/available-auditors.service';
import { CompetencyService } from 'src/app/core/services/masters/human-capital/competency/competency.service';
import { AuditCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-categories/audit-categories.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { AvailableAuditorsStore } from 'src/app/stores/internal-audit/available-auditors/available-auditors-store';
import { CompetencyMasterStore } from 'src/app/stores/masters/human-capital/competency-master.store';
import { AuditCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-categories-store';

@Component({
  selector: 'app-auditor-auditee-add-modal',
  templateUrl: './auditor-auditee-add-modal.component.html',
  styleUrls: ['./auditor-auditee-add-modal.component.scss']
})
export class AuditorAuditeeAddModalComponent implements OnInit , OnDestroy {
  @Input('source') CommonAuditorAuditeeAddSource: any;

  UsersStore = UsersStore;
  AuditStore = AuditStore;
  AvailableAuditorsStore = AvailableAuditorsStore; 
  CompetencyMasterStore = CompetencyMasterStore;
  AuditCategoryStore = AuditCategoryMasterStore;
  AppStore = AppStore;
  selectedIndex = null;
  formErrors: any;
  usersArray = [];
  competency_id = [];
  audit_categories_id = [];
  auditorsEmptyList = "No Auditors To Show";
  usersEmptyList = "No Users to Show";
  searchTerm;
  form: FormGroup;
  constructor(private _userService: UsersService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _competencyService: CompetencyService,
    private _auditCategoryService: AuditCategoriesService,
    private _availableAuditorsService: AvailableAuditorsService,
    private _auditPlanScheduleService: AuditPlanScheduleService,
    private _auditService:AuditService, 
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.form = new FormGroup({});
    // page change event
   if(this.CommonAuditorAuditeeAddSource.type=='auditee'){
    this.pageChange();} else {
      this.getAuditors();
    }
  }

  getAuditors(){
    let params = '&exclude='+this.CommonAuditorAuditeeAddSource?.values?.exclude_ids;
    this._availableAuditorsService.getAllItems(this.CommonAuditorAuditeeAddSource.values.audit_program_id,params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  pageChange(){
    let params = '?exclude='+this.CommonAuditorAuditeeAddSource?.values?.exclude_ids+'&department_ids='+this.CommonAuditorAuditeeAddSource?.values?.department_ids;
    this._userService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getCompetency(){
    this._competencyService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchCompetency(e){
    this._competencyService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAuditCategory(){
    this._auditCategoryService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchAuditCategories(e){
    this._auditCategoryService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  sortAuditors(){

    var params = '';
    if (this.competency_id) params = `&competency_ids=${this.competency_id}&exclude=`+this.CommonAuditorAuditeeAddSource.values.exclude_ids;
    if (this.audit_categories_id) {
      if (params)
        params = params + `&audit_category_ids=${this.audit_categories_id}&exclude=`+this.CommonAuditorAuditeeAddSource.values.exclude_ids;
      else
        params = `&audit_category_ids=${this.audit_categories_id}&exclude=`+this.CommonAuditorAuditeeAddSource.values.exclude_ids;
    }
    this._availableAuditorsService.getAllItems(this.CommonAuditorAuditeeAddSource.values.audit_program_id, params).subscribe(res => {
      if(res.length==0){
        this.auditorsEmptyList = "Your search did not match any auditor profiles. Please make sure the auditor name spelt correctly and try again";
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUsers(){

    if(this.CommonAuditorAuditeeAddSource.type=='auditee'){
    if (this.searchTerm) {
      let params = '&exclude='+this.CommonAuditorAuditeeAddSource?.values?.exclude_ids+'&department_ids='+this.CommonAuditorAuditeeAddSource?.values?.department_ids;
      this._userService.getAllItems(`?q=${this.searchTerm}`+params).subscribe(res => {
        if(res.data.length==0){
          this.usersEmptyList = "Your search did not match any user profiles. Please make sure the user name spelt correctly and try again";
        }
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.pageChange();
    }
  } else {
    
    if (this.searchTerm) {
      this._availableAuditorsService.getAllItems(this.CommonAuditorAuditeeAddSource.values.audit_program_id,`&q=${this.searchTerm}&exclude=`+this.CommonAuditorAuditeeAddSource.values.exclude_ids).subscribe(res => {
        if(res.length==0){
          this.auditorsEmptyList = "Your search did not match any auditor profiles. Please make sure the auditor name spelt correctly and try again";
        }
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.getAuditors();
    }
  }
  }

  clearSearchBar(){
    this.searchTerm = '';
    if(this.CommonAuditorAuditeeAddSource.type=='auditee'){
    this.pageChange();} else {
      this.getAuditors();
    }
  }

  getRespectiveAuditor(id:number){
    var pos = this.usersArray.findIndex(e => e == id);
    if (pos != -1){
    this.usersArray.splice(pos, 1);
     } else {
      this.usersArray.push(id);
     }
  }

  checkPresent(userId: number){

    var pos = this.usersArray.findIndex(e => e ==userId);
    if (pos != -1){
      return true;
       } else {
      return false;
       }
  }


   // cancel modal
   cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();



  }

  processingDataForSave(){
    var items = {
      "user_ids":this.usersArray
    }

    return items;
  }

  save(close: boolean = false){
   
    if(this.usersArray.length == 0){
      this._utilityService.showErrorMessage('Error!','Please Select One Auditor/Auditee Atleast');
    } else {

    this.formErrors = null;
    if (this.usersArray.length>0) {
      let save;
      AppStore.enableLoading();
  
        if(this.CommonAuditorAuditeeAddSource.type=='auditor' && this.CommonAuditorAuditeeAddSource.from=='audit_schedule'){
        save = this._auditService.addNewAuditors(this.CommonAuditorAuditeeAddSource.values.schedule_id,this.processingDataForSave());
        } 
        if(this.CommonAuditorAuditeeAddSource.type=='auditee' && this.CommonAuditorAuditeeAddSource.from=='audit_schedule') {
          save = this._auditService.addNewAuditees(this.CommonAuditorAuditeeAddSource.values.schedule_id,this.processingDataForSave());
        }

        if(this.CommonAuditorAuditeeAddSource.type=='auditor' && this.CommonAuditorAuditeeAddSource.from=='plan_schedule') {
          save = this._auditPlanScheduleService.addNewAuditors(this.CommonAuditorAuditeeAddSource.values.schedule_id,this.processingDataForSave());
        }
        if(this.CommonAuditorAuditeeAddSource.type=='auditee' && this.CommonAuditorAuditeeAddSource.from=='plan_schedule') {
          save = this._auditPlanScheduleService.addNewAuditees(this.CommonAuditorAuditeeAddSource.values.schedule_id,this.processingDataForSave());
        }

      save.subscribe((res: any) => {
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
   }
    
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  closeFormModal(){
    this._eventEmitterService.dismissAuditorsAuditeesAddModal();
    this.usersArray = [];
    this.pageChange();
  }

  ngOnDestroy(){
    this.usersArray = [];
  }



}
