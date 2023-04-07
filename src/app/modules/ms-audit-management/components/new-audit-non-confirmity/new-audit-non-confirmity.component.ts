import { type } from '@amcharts/amcharts4/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { MsAuditFindingCaTypesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-finding-ca-types/ms-audit-finding-ca-types.service';
import { MsAuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit-check-list/ms-audit-check-list.service';
import { AuditNonConfirmityService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MSAuditFindingCATypesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-ca-types-store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { MsAuditDocumetsVersionStore } from 'src/app/stores/ms-audit-management/ms-audit-documets-version/ms-audit-version-documents.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { MsAuditFindingCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-categories-store';
import { MsAuditFindingCategoriesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-finding-categories/ms-audit-finding-categories.service';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
declare var $: any;

@Component({
  selector: 'app-new-audit-non-confirmity',
  templateUrl: './new-audit-non-confirmity.component.html',
  styleUrls: ['./new-audit-non-confirmity.component.scss']
})
export class NewAuditNonConfirmityComponent implements OnInit {
  @Input('source') nonConformitySource
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;

  fileUploadPopupStore = fileUploadPopupStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MsAuditDocumetsVersionStore = MsAuditDocumetsVersionStore;
  AuditNonConfirmityStore = AuditNonConfirmityStore;
  MSAuditFindingCATypesMasterStore = MSAuditFindingCATypesMasterStore;
  MsAuditFindingCategoryMasterStore=MsAuditFindingCategoryMasterStore;
  MsAuditSchedulesStore=MsAuditSchedulesStore;
  AppStore = AppStore;
  UsersStore = UsersStore
  fileUploadPopupSubscriptionEvent: any;
  msAuditFindingCategorySubscriptionEvent:any;
  form: FormGroup;
  formErrors: any;
  corrections  = [];
  correctiveActions  = [];
  selectedIndex: any = null;
  is_correction_exist: boolean = false;
  is_action_exist: boolean = false;
  selectedMsTypePos: any = 0;
  emptyTier = 'no data found'
  correction : any = '';
  correctiveAction : any = '';
  selectedMstpyes: any = [];
  selectedDocIds: any = [];

  msAuditFindingCategoryObject = {
    component: 'Master',
    type: null,
    values: null
  }

  constructor(private _eventEmitterService: EventEmitterService,
    private _msAuditFindingCategoriesService: MsAuditFindingCategoriesService,
    private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _msAuditNonConformityService : AuditNonConfirmityService,
    private _helperService: HelperServiceService,
    private _msAuditCheckListService : MsAuditCheckListService,
    private _msAuditFindingCaTypesService: MsAuditFindingCaTypesService,
    private _msAuditSchedulesService: MsAuditSchedulesService,
    private _router: Router,
    ) { }

  ngOnInit(): void {

      this.form = this._formBuilder.group({
        id: null,
        ms_audit_id : null,
        title : [null,[Validators.required]],
       // date: [null,[Validators.required]],
        description : [''],
        //target_date : [null,[Validators.required]],
        ms_audit_schedule_id:[null],
        //rca_description : '',
        //preventive_action : '',
        effectiveness : '',
        //responsible_user_ids : null,
        //agreed_date :  '',
        //ms_audit_finding_corrective_action_type_id : [null,[Validators.required]],
        ms_audit_finding_category_id:[null,[Validators.required]],
        reason : null,
      });

      this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
        this.enableScrollbar();
      })

      this.msAuditFindingCategorySubscriptionEvent = this._eventEmitterService.msAuditFindingCategory.subscribe(res=>{
        this.closeFindingCategoryModal();
      })

      if(this.nonConformitySource.type == 'Edit'){
        this.setEditData()
      }
      if(this.nonConformitySource.component== 'submenu')
      {
        this.form.controls["ms_audit_schedule_id"].setValidators([Validators.required]);
      }
      else
      {
        this.form.controls["ms_audit_schedule_id"].clearValidators();
      }
      this.form.get("ms_audit_schedule_id").updateValueAndValidity();
      this.getMsDocumentVersionsList()
      this.getUsers();
      //this.geFindingsType();
  }

  getSchedule(newPage: number = null) {
    if (newPage) MsAuditSchedulesStore.setCurrentPage(newPage);
    this._msAuditSchedulesService.getItems(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchSchedule(event)
  {
    this._msAuditSchedulesService.getItems(true,'?q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  

    setEditData(){
      if(this.nonConformitySource.value){
        let caType = {
          title : this.nonConformitySource.value.ms_audit_finding_corrective_action_type ? this.nonConformitySource.value.ms_audit_finding_corrective_action_type?.language[0]?.pivot?.title : null,
          id: this.nonConformitySource.value.ms_audit_finding_corrective_action_type ? this.nonConformitySource.value.ms_audit_finding_corrective_action_type?.id : null,
          type : this.nonConformitySource.value.ms_audit_finding_corrective_action_type ? this.nonConformitySource.value.ms_audit_finding_corrective_action_type?.type : null,
        } 
        this.searchFindingCategory({term :this.nonConformitySource?.value?.ms_audit_finding_category?.language[0] ? this.nonConformitySource.value.ms_audit_finding_category?.language[0].pivot.ms_audit_finding_category_id : ''},true)
        this.form.patchValue({
          ms_audit_schedule_id:this.nonConformitySource.value?.ms_audit_schedule?this.nonConformitySource.value?.ms_audit_schedule:null,
          title : this.nonConformitySource.value.title ? this.nonConformitySource.value.title : '',
          description : this.nonConformitySource.value.description ? this.nonConformitySource.value.description : '',
          date : this.nonConformitySource.value.date ? this._helperService.processDate(this.nonConformitySource.value.date,'split') : '',
          target_date : this.nonConformitySource.value.agreed_date ? this._helperService.processDate(this.nonConformitySource.value.agreed_date,'split') : '',
          rca_description : this.nonConformitySource.value.ms_audit_finding_root_cause_analysis ? this.nonConformitySource.value.ms_audit_finding_root_cause_analysis?.description : '',
          responsible_user_ids : this.nonConformitySource.value.responsible_users ? this.nonConformitySource.value.responsible_users[0]  : [],
          //ms_audit_finding_corrective_action_type_id : caType ? caType : null,
          reason : this.nonConformitySource.value.reason ? this.nonConformitySource.value.reason : null,
          preventive_action: this.nonConformitySource.value.preventive_action ? this.nonConformitySource.value.preventive_action : null,
          ms_audit_finding_category_id:this.nonConformitySource.value?.ms_audit_finding_category?.language[0]?.pivot?.ms_audit_finding_category_id ? this.nonConformitySource.value.ms_audit_finding_category.language[0].pivot.ms_audit_finding_category_id : null,
        });
        this.corrections =  this.setMultipledata(this.nonConformitySource.value.ms_audit_finding_corrections)
        this.correctiveActions =  this.setMultipledata(this.nonConformitySource.value.ms_audit_finding_corrective_actions)
        this.setEditDataChecked()
      } 
    }

    searchFindingCategory(e,patchValue:boolean = false) {
      this._msAuditFindingCategoriesService.getItems(false,'&q=' + e.term).subscribe(res => {
        if(patchValue){
          for(let i of res.data){
            if(i.id == e.term){
              
              this.form.patchValue({ ms_audit_finding_category_id: i.id });
              break;
            }
          }
        }

        this._utilityService.detectChanges(this._cdr);
      })
    }

    getFindingCategory() {
      let params=''
      this._msAuditFindingCategoriesService.getItems(false,params,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }

    setEditDataChecked(){
      this.nonConformitySource.value.ms_audit_finding_ms_type_organizations.map(data=>{
        let obj = {
          id : data.document_id ? data.document_id : null,
          ms_type_organization_id : data.ms_type_organization_id ? data.ms_type_organization_id : null
        }
        for(let docData of data.document_version_contents){
          AuditNonConfirmityStore.getOrganisationMsTypeData(docData,obj);
        }
      })
    }

    checkMstypeRequired(){
      return AuditNonConfirmityStore.selectedMstpyes?.length == 0? true : false
      // if(this.nonConformitySource?.component != 'submenu'){
      //   return AuditNonConfirmityStore.selectedMstpyes?.length == 0? true : false
      // }else{
      //   return false
      // }
    }

    setMultipledata(mulData){
      let returnData = []
      let obj = null
    if(mulData.length > 0){
    for(let data of mulData){
      obj = {
        title : data.title ? data.title : '',
        id : data.id ? data.id : null
      }
      returnData.push(obj)
    }
    }
    return returnData
    }

    enableScrollbar() {
      if (fileUploadPopupStore.displayFiles.length >= 3) {
        $(this.uploadArea.nativeElement).mCustomScrollbar();
      }
      else {
        $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    }

    checkExtension(ext, extType) {
      return this._imageService.checkFileExtensions(ext, extType)
    }

    addCorrections(){
      if(this.correction){ 
        let data = {
          title : this.correction
        }
        if(this.corrections.length > 0){
          let pos = this.corrections.findIndex(e => e.title == this.correction )
          if(pos != -1){
            this.is_correction_exist = true
          }else{
            this.corrections.push(data)
            this.correction = ''
            this.is_correction_exist = false
          }
        }else {
          this.corrections.push(data)
          this.correction = ''
          this.is_correction_exist = false
        }
      }
    }

    deleteCorrection(correction){
      if(this.corrections.length > 0){
        let pos = this.corrections.findIndex(e => e.title == correction.title)
        if(pos != -1){
          this.corrections.splice(pos,1)
        }
      }
    }

  addNewFindingCategories()
    {
  this.msAuditFindingCategoryObject.type = 'Add';
  this.msAuditFindingCategoryObject.values = null; // for clearing the value
  this._utilityService.detectChanges(this._cdr);
  this.openFormFindingCategoriesModal();
}
openFormFindingCategoriesModal()
{
  this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
  this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
  $(this.formModal.nativeElement).modal('show');
  this._utilityService.detectChanges(this._cdr);
}

closeFindingCategoryModal(){
  $(this.formModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
  this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
  $('.modal-backdrop').remove();
  this.msAuditFindingCategoryObject.type = null;
  if(MsAuditFindingCategoryMasterStore.lastInsertedId)
  {
    this.searchFindingCategory({term : MsAuditFindingCategoryMasterStore.lastInsertedId},true)
  }
  

}

    addCorrectiveAction(){
      if(this.correctiveAction){
        let data = {
          title : this.correctiveAction
        }  
        if(this.correctiveActions.length > 0){
          let pos = this.correctiveActions.findIndex(e => e.title == this.correctiveAction )
          if(pos != -1){
            this.is_action_exist = true
          }else{
            this.correctiveActions.push(data)
            this.correctiveAction = ''
            this.is_action_exist = false
          }
        }else {
          this.correctiveActions.push(data)
          this.is_action_exist = false;
          this.correctiveAction = ''
        }
      }
    }

      deleteCorrectiveAction(action){
      if(this.correctiveActions.length > 0){
        let pos = this.correctiveActions.findIndex(e => e.title == action.title)
        if(pos != -1){
          this.correctiveActions.splice(pos,1)
        }
      }
    }
   
    getMsDocumentVersionsList(){
      let params = ''
      params = '?is_ms_type=true&is_not_master_document_list&is_all=true'
      this._msAuditCheckListService.getMsDocumentVersionItems(true,params,true).subscribe(res=>{
        if(res){
          let version_id = res[0]?.document_version_id;
          if(version_id)
          {
            this.getMsDocumentVersionDetails(version_id)
          }
         
          
        }
        this._utilityService.detectChanges(this._cdr)
      })
    }

    // mstype document version details
    getMsDocumentVersionDetails(id){
      MsAuditDocumetsVersionStore.individualLoaded = false;
      this._msAuditCheckListService.getDocumentVersionContents(id).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr)
      })
    }

    selectedIndexChange(index){
      if(this.selectedIndex == index){
        this.selectedIndex = null;
      } else{
        this.selectedIndex = index;
        this._utilityService.detectChanges(this._cdr);
      }
    }

  generateIdforString(id: number) {
    return `id${id.toString()}`;

  }
  changeDocumetVersion(data) {
    MsAuditDocumetsVersionStore.setSelectedDocuments(data)
  }

  checkSelectedStatuss(data,type) {
    var pos = null;
    if(this.selectedDocIds.length > 0){
      let kpos =  this.selectedDocIds.findIndex(e=> e == data.id)
      if(kpos != -1)
      return true;
      else return false; 
    }
  }

  childClick(data,type,loopType){
    AuditNonConfirmityStore.getOrganisationMsTypeData(data,type,"all")
    }

  getOrganisationMsTypeData(data,type,loopType){
    AuditNonConfirmityStore.getOrganisationMsTypeData(data,type)
  }

  processDataForSave(){
    let saveData = {
      ms_audit_schedule_id :this.nonConformitySource?.component != 'submenu' ? MsAuditSchedulesStore?.msAuditSchedulesId : this.form.value.ms_audit_schedule_id.id,
      title : this.form.value.title ? this.form.value.title : '',
      description : this.form.value.description ? this.form.value.description : '',
     // date : this.form.value.date ? this._helperService.processDate(this.form.value.date,'join') : '',
      //target_date : this.form.value.target_date ? this._helperService.processDate(this.form.value.target_date,'join') : '',
      rca_description : this.form.value.rca_description ? this.form.value.rca_description : '',
      preventive_action : this.form.value.preventive_action ? this.form.value.preventive_action : '',
      responsible_user_ids : this.form.value.responsible_user_ids ? [this.form.value.responsible_user_ids.id] : '',
      corrections : this.corrections ? this.corrections : [],
      corrective_actions : this.correctiveActions ? this.correctiveActions : [],
      ms_type_organizations : AuditNonConfirmityStore.selectedMstpyes ? AuditNonConfirmityStore.selectedMstpyes : [],
      rca_description_id : null,
      reason : this.form.value.reason ? this.form.value.reason : null,
      ms_audit_finding_category_id:this.form.value.ms_audit_finding_category_id ? this.form.value.ms_audit_finding_category_id : null,
      //ms_audit_finding_corrective_action_type_id : this.form.value.ms_audit_finding_corrective_action_type_id ? this.form.value.ms_audit_finding_corrective_action_type_id.id : null
    }
    if (this.nonConformitySource.type == 'Edit') {
      saveData.rca_description_id = this.nonConformitySource.value?.ms_audit_finding_root_cause_analysis ? this.nonConformitySource.value?.ms_audit_finding_root_cause_analysis?.id : null
      } 
    
    return saveData
  }

  save(close: boolean = false) {
    let save;
    AppStore.enableLoading();

    if (this.nonConformitySource.type == 'Edit') {
      save = this._msAuditNonConformityService.updateNonConfirmity(this.processDataForSave(),this.nonConformitySource.value.id);
    } else {
      save = this._msAuditNonConformityService.saveNonConfirmity(this.processDataForSave());
    }

    save.subscribe((res: any) => {
        this.resetForm();
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.cancel(res?.id);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
        this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }

  

  geFindingsType(){
    this._msAuditFindingCaTypesService.getItems(false,null,true).subscribe((res) => {
      if(MSAuditFindingCATypesMasterStore?.allItems.length > 0){
        MSAuditFindingCATypesMasterStore?.allItems.filter(type => type.type == 'internal-audit').map((data,index)=>{
          if(this.nonConformitySource.component != 'submenu'){
            this.form.patchValue({
              ms_audit_finding_corrective_action_type_id : data
            })
            
          }else {
            this.form.controls['ms_audit_finding_corrective_action_type_id'].setValidators([Validators.required])
            this.form.controls['reason'].setValidators([Validators.required])
            MSAuditFindingCATypesMasterStore?.allItems.splice(index,1)
          }
        
        })
      }
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  getUsers() {
    this._usersService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUers(e) {   
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    return isWordThere.every(all_words);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.corrections = [];
    this.correctiveActions = [];
    this.selectedIndex = null;
    this.selectedMsTypePos = 0;
    this.clearCommonFilePopupDocuments();
    AppStore.disableLoading();
    AuditNonConfirmityStore.unSetData()
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }


  selectedmsType(pos,id){
    this.selectedMsTypePos = pos;
    this.getMsDocumentVersionDetails(id)
    this._utilityService.detectChanges(this._cdr);
  }

  isUser(){
    if(this.nonConformitySource.type == 'Edit' && this.form.value?.responsible_user_ids ){
      if (this.form.value?.responsible_user_ids?.id == AuthStore.user.id){
        return true;
      }
      else{
        return false
      }
    }else return false
  }

  changeType(){
    if(this.form.value?.ms_audit_finding_corrective_action_type_id?.type=='general')
    {this.form.controls['reason'].setValidators(Validators.required)}
  }

  cancel(resId?:number){
    this.resetForm()
    if (resId && this.nonConformitySource?.component == 'submenu') {
      this._router.navigateByUrl('ms-audit-management/non-conformities/' + resId);

      // if(this.brudCrubAndCloseButtonScoure){
      //   MsAuditPlansStore.setPath(this.brudCrubAndCloseButtonScoure?.path);
      //   BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
      //   BreadCrumbMenuItemStore.makeEmpty();
      //   BreadCrumbMenuItemStore.addBreadCrumbMenu({
      //     name:this.brudCrubAndCloseButtonScoure?.name,
      //     path:this.brudCrubAndCloseButtonScoure?.path
      //   });
      // }
      
    }
    this._eventEmitterService.dismissAuditNonConfirmityModal()
    }
  
  ngOnDestroy(){
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.msAuditFindingCategorySubscriptionEvent.unsubscribe();
    MsAuditDocumetsVersionStore.individualLoaded = false
  }
}
