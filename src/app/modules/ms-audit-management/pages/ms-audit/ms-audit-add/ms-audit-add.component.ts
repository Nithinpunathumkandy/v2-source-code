import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MsAuditPlansService } from 'src/app/core/services/ms-audit-management/ms-audit-plans/ms-audit-plans.service';
import { MsAuditProgramsService } from 'src/app/core/services/ms-audit-management/ms-audit-programs/ms-audit-programs.service';
import { MsAuditService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $:any;
@Component({
  selector: 'app-ms-audit-add',
  templateUrl: './ms-audit-add.component.html',
  styleUrls: ['./ms-audit-add.component.scss']
})
export class MsAuditAddComponent implements OnInit {
  @ViewChild("auditorAdd") auditorAdd: ElementRef;
  @ViewChild("auditeesAdd") auditeesAdd: ElementRef;
  @Input('source') source: any;
  @Input('selectedMsAudit') selectedMsAuditData: any;//Ms audit base select from ms audit plan
  @Input('selectedProgram') selectedProgramData: any;//Program base Program select

  AppStore =AppStore;
  MsAuditStore = MsAuditStore;
  MsAuditPlansStore = MsAuditPlansStore;
  MsAuditProgramsStore = MsAuditProgramsStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  UsersStore = UsersStore;
  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  emptyMessage="no_data_found"
  aditorEmptyList="No Auditors Found";
  aditeeEmptyList="No Auditees Found";
  startDate:any = new Date();
  targetDate:any = new Date();
  disableMsAudit:boolean=false;
  showAuditPlanDetails: boolean = false;
  popupSubscriptionAddMsAuditor:any=null;
  popupSubscriptionAddMsAuditee:any=null;
  disableProgram:boolean=true;
  res_id

  constructor(
    private _msAuditPlanService: MsAuditPlansService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _humanCapitalService: HumanCapitalService,
    private _documentFileService: DocumentFileService,
		private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _msAuditService: MsAuditService,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _usersService: UsersService,
    private _msAuditProgramsService: MsAuditProgramsService,
  ) { }

  ngOnInit(): void {

      this.form = this._formBuilder.group({
        id: [''],
        title: [''],
        ms_audit_program_id: [null, [Validators.required]],
        ms_audit_plan_id: [null, [Validators.required]],
        start_date: ['',[Validators.required]],
        end_date: ['',[Validators.required]],
        opening_start_date: ['',[Validators.required]],
        participant_ids:[[],[Validators.required]],
        auditor_ids: [[]],
        auditee_ids: [[]]
      });

      this.popupSubscriptionAddMsAuditor = this._eventEmitterService.msAuditAdd.subscribe(res => {
        this.setAuditor(res);
        this.closeModelAuditor();
      })

      this.popupSubscriptionAddMsAuditee = this._eventEmitterService.msAuditeesAdd.subscribe(res => {
        this.setAuditees(res);
        this.closeModelAuditee();
      })

      if (this.source.type=='Edit') {
        this.setEditDetails();
      } 
  }

    setEditDetails() {
      this.searchMsAuditPlan({ term: MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.id})
      this.searchMsAuditProgram({ term: MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.ms_audit_program?.id})

      this.form.patchValue({
        id: MsAuditStore.individualMsAuditDetails?.id,
        title:MsAuditStore.individualMsAuditDetails?.title ? MsAuditStore.individualMsAuditDetails?.title : '',
        ms_audit_program_id: MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.ms_audit_program?.id ? this.auditProgram() : null,
        ms_audit_plan_id: MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.id ? MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.id : null,
        start_date: MsAuditStore.individualMsAuditDetails?.start_date ? new Date(MsAuditStore.individualMsAuditDetails?.start_date) : '',
        end_date: MsAuditStore.individualMsAuditDetails?.end_date ? new Date(MsAuditStore.individualMsAuditDetails?.end_date) : '',
        opening_start_date:MsAuditStore.individualMsAuditDetails?.opening_start_date ? new Date(MsAuditStore.individualMsAuditDetails?.opening_start_date) : '',
        auditor_ids: MsAuditStore.individualMsAuditDetails?.auditors ? MsAuditStore.individualMsAuditDetails?.auditors : '',
        auditee_ids: MsAuditStore.individualMsAuditDetails?.auditees ? MsAuditStore.individualMsAuditDetails?.auditees : '',
        participant_ids: MsAuditStore.individualMsAuditDetails?.opening_participants ? this._helperService.getArrayProcessed(MsAuditStore.individualMsAuditDetails?.opening_participants,false) : [],
      });
      if(this.form.value.ms_audit_plan_id){
        this._msAuditPlanService.getItem(this.form.value.ms_audit_plan_id).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        })
      } 
    }

    auditProgram(){
      return {
        id: MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.ms_audit_program?.id,
        ms_audit_program_title: MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.ms_audit_program?.title,
      }
    }

    getMsAuditProgram() {
      this._msAuditProgramsService.getItems(false).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }

    getMsAuditProgramClear(){
      this.form.patchValue({
        ms_audit_plan_id: null,
        title: '',
        start_date: '',
        end_date: '',
        auditor_ids: null,
        auditee_ids: null
      })
      MsAuditProgramsStore.unSetMsAuditPrograms();
      MsAuditPlansStore.unsetIndividualMsAuditPlansDetails();
    }

    searchMsAuditProgram(event) {
      this._msAuditProgramsService.getItems(true,'?q=' + event.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }

    removeAuditor(value){  
      let index = this.form.value.auditor_ids.findIndex(e=>e.id == value);
      if(index != -1)this.form.value.auditor_ids.splice(index, 1);
    }

    removeAuditee(value){  
      let index = this.form.value.auditee_ids.findIndex(e=>e.id == value);
      if(index != -1)this.form.value.auditee_ids.splice(index, 1);
    }

    addModelAuditor(){
      $(this.auditorAdd.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }

    closeModelAuditor(){
      $(this.auditorAdd.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }

    addModelAuditee(){
      $(this.auditeesAdd.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }

    closeModelAuditee(){
      $(this.auditeesAdd.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }

    // search Ms Audit Plan
    searchMsAuditPlan(e) {
      this._msAuditPlanService.searchMsAuditPlan('&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }

    getMsAuditPlan(params?) {
      if (this.form.value.ms_audit_program_id?.id) {
        params = params ? params + '&ms_audit_program_id=' + this.form.value.ms_audit_program_id?.id + '&is_not_audited=true' : '&ms_audit_program_id=' + this.form.value.ms_audit_program_id?.id + '&is_not_selected=true';
      
      this._msAuditPlanService.getItems(false,(params ? params : '')).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }else{
      this._msAuditPlanService.getItems(false,(params ? params : '')).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    }
    
    getMsAuditPlanClear(){
      MsAuditPlansStore.unsetIndividualMsAuditPlansDetails();
    }

    createImageUrl(type,token) {// user-defined
      if(type=='document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
      else
        return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

    getNoDataSource(type){
      let noDataSource = {
        noData: this.emptyMessage, border: false, imageAlign: type
      }
      return noDataSource;
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
    
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }

    getAuditPlanIndivitual(){
      
      this._msAuditPlanService.getItem(this.form.value.ms_audit_plan_id).subscribe(res => {
        if(this.form.value.ms_audit_plan_id){
          this.form.patchValue({
            title: MsAuditPlansStore.individualMsAuditPlansDetails?.title ? MsAuditPlansStore.individualMsAuditPlansDetails?.title : '',
            start_date: MsAuditPlansStore.individualMsAuditPlansDetails?.start_date ? this._helperService.processDate(MsAuditPlansStore.individualMsAuditPlansDetails?.start_date, 'split') : '',
            end_date: MsAuditPlansStore.individualMsAuditPlansDetails?.end_date ? this._helperService.processDate(MsAuditPlansStore.individualMsAuditPlansDetails?.end_date, 'split') : '',
            auditor_ids: MsAuditPlansStore.individualMsAuditPlansDetails?.auditors ? MsAuditPlansStore.individualMsAuditPlansDetails?.auditors : null,
            auditee_ids: MsAuditPlansStore.individualMsAuditPlansDetails?.auditees ? MsAuditPlansStore.individualMsAuditPlansDetails?.auditees : null
          })
        }
        this._utilityService.detectChanges(this._cdr);
      })
    }

    setAuditor(res){
      if(res){
        for(let i of res){
          i['is_auditor'] = true;
          }
        this.form.controls['auditor_ids'].setValue(this.form.value.auditor_ids.concat(res)); 
        this._utilityService.detectChanges(this._cdr);
      }
    }

    setAuditees(res){
      if(res){
        for(let i of res){
          i['is_auditor'] = true;
        }
        this.form.controls['auditee_ids'].setValue(this.form.value.auditee_ids.concat(res)); 
        this._utilityService.detectChanges(this._cdr);
      }
    }

    //Check uncheck 
    onAuditorChange(e,user) {
      let pos = this.form.value.auditor_ids.findIndex(e=>e.id == user.id);
      this.form.value.auditor_ids[pos]['is_auditor'] = e.target.checked;
    }

    onAuditeesChange(e,user) {
      let pos = this.form.value.auditee_ids.findIndex(e=>e.id == user.id);
      this.form.value.auditee_ids[pos]['is_auditor'] = e.target.checked;
    }

    getCreatedByPopupDetails(users, created?: string) {
      let userDetial: any = {};
      userDetial['first_name'] = users?.first_name;
      userDetial['last_name'] = users?.last_name;
      userDetial['designation'] = users?.designation;
      userDetial['image_token'] = users?.image?.token;
      userDetial['email'] = users?.email;
      userDetial['mobile'] = users?.mobile;
      userDetial['id'] = users?.id;
      userDetial['department'] = users?.department;
      userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
      userDetial['created_at'] = created ? created : null;
      return userDetial;

    }

    getAuditorPopupDetails(users) {
      let userDetial: any = {};
      userDetial['first_name'] = users?.first_name ? users?.first_name : '';
      userDetial['last_name'] = users?.last_name ? users?.last_name : '';
      userDetial['designation'] = users?.designation_id ? users?.designation_id : users?.designation;
      userDetial['image_token'] = users?.image_token ? users.image_token : users.image;
      userDetial['email'] = users?.email;
      userDetial['mobile'] = users?.mobile;
      userDetial['id'] = users?.id;
      userDetial['department'] = users?.department;
      userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

      return userDetial;
    }


    getSaveData() {
      
      this.saveData = {
        ms_audit_program_id:this.form.value.ms_audit_program_id ? this.form.value.ms_audit_program_id?.id : null,
        ms_audit_plan_id:this.form.value.ms_audit_plan_id? this.form.value.ms_audit_plan_id: null,
        title: this.form.value.title ? this.form.value.title : '',
        auditor_ids: this.form.value.auditor_ids? this._helperService.getArrayProcessed(this.form.value.auditor_ids, 'id') : [],
        auditee_ids: this.form.value.auditee_ids? this._helperService.getArrayProcessed(this.form.value.auditee_ids, 'id') : [],
        start_date: this.form.value.start_date ? this._helperService.passSaveFormatDate(this.form.value.start_date) : '',
        end_date: this.form.value.end_date ? this._helperService.passSaveFormatDate(this.form.value.end_date) : '',
        participant_ids:this.form.value.participant_ids.length?this._helperService.getArrayProcessed(this.form.value.participant_ids, 'id') : [],
        opening_start_date:this.form.value.opening_start_date ? this._helperService.passSaveFormatDate(this.form.value.opening_start_date) : '',
      }
      
    }

    getUsers() {
      var params = '';
      this._usersService.getAllItems(params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  
    searchUsers(e) {
      this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }

    getStringsFormatted(stringArray, characterLength, seperator) {
      return this._helperService.getFormattedName(stringArray, characterLength, seperator);
    }
  
    createImagePreview(type, token) {
      return this._imageService.getThumbnailPreview(type, token)
    }
  
    
    cancel() {
      this.closeFormModal();
    }

   

    closeFormModal() {
      AppStore.disableLoading();
      this.resetForm();
      this._eventEmitterService.dismissCommonModal();
    }

    resetForm() {
      this.form.reset();
      this.form.pristine;
      this.formErrors = null;
    }

    save(close: boolean = false) {
      this.formErrors = null;
      if (this.form.value) {

        let save;
        AppStore.enableLoading();

        this.getSaveData();

        if (this.form.value.id) {
          save = this._msAuditService.updateItem(this.form.value.id,this.saveData);
        } else {
          save = this._msAuditService.saveItem(this.saveData);
        }
        save.subscribe(
          (res: any) => {
            this.res_id = res.id;// assign id to variable;
            this.resetForm();
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
            if (close) {
              this.closeFormModal();
              this._router.navigateByUrl('/ms-audit-management/ms-audits/'+ res.id);
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
    }

    getButtonText(text) {
      return this._helperService.translateToUserLanguage(text);
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
          userDetails['department'] = users?.department;
          userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
          userDetails['created_at'] =created? created:null;
          userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
        }
      return userDetails;
    }

    ngOnDestroy(){
      this.popupSubscriptionAddMsAuditor.unsubscribe();
      this.popupSubscriptionAddMsAuditee.unsubscribe();
      MsAuditPlansStore.unsetIndividualMsAuditPlansDetails();
      MsAuditPlansStore.unSetMsAuditPlans();
    }

}
