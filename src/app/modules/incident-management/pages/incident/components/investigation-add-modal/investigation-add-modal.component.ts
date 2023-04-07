import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { IncidentDamageTypeService } from 'src/app/core/services/masters/incident-management/incident-damage-type/incident-damage-type.service';
import { IncidentDamageTypeMasterStore } from 'src/app/stores/masters/incident-management/incident-damage-type-master-store';
import { IncidentCategoriesService } from 'src/app/core/services/masters/incident-management/incident-categories/incident-categories.service';
import { IncidentCategoriesMasterStore } from 'src/app/stores/masters/incident-management/incident-categories-master-store';
import { IncidentSubCategoryService } from 'src/app/core/services/masters/incident-management/incident-sub-category/incident-sub-category.service';
import { IncidentSubCategoryMasterStore } from 'src/app/stores/masters/incident-management/incident-sub-category-master-store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { StakeholderService } from 'src/app/core/services/masters/organization/stakeholder/stakeholder.service';
import { StakeholdersStore } from 'src/app/stores/organization/stakeholders/stakeholders.store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { IncidentRootCauseService } from 'src/app/core/services/masters/incident-management/incident-root-cause/incident-root-cause.service';
import { IncidentRootCauseMasterStore } from 'src/app/stores/masters/incident-management/incident-root-cause-master-store';
import { IncidentDamageSeverityService } from 'src/app/core/services/masters/incident-management/incident-damage-severity/incident-damage-severity.service';
import { IncidentDamageSeverityMasterStore } from 'src/app/stores/masters/incident-management/incident-damage-severity-store';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';

declare var $: any;

@Component({
  selector: 'app-investigation-add-modal',
  templateUrl: './investigation-add-modal.component.html',
  styleUrls: ['./investigation-add-modal.component.scss']
})
export class InvestigationAddModalComponent implements OnInit {
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  

  SubMenuItemStore = SubMenuItemStore;
  fileUploadPopupStore = fileUploadPopupStore;
  reactionDisposer: IReactionDisposer;
  fileUploadsArray = [];
  criteriaEmptyList = "common_nodata_title"
  investigationEmptyList : string = 'common_nodata_title'
  pipe = new DatePipe('en-US');
  controlObject = {
    type: null
  };
  witnessObject = {
    type: null
  };
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };
  AuthStore = AuthStore;
  checkListArray = [];
  imageData: any;
  form: FormGroup;
  formErrors: any;

  yes : boolean 
  no : boolean 

  nextButtonText = "Next";
  previousButtonText = "Previous";
  currentTab = 0;
  AppStore = AppStore;

  IncidentInvestigationStore = IncidentInvestigationStore
  IncidentStore = IncidentStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  IncidentDamageTypeMasterStore = IncidentDamageTypeMasterStore;
  IncidentCategoriesMasterStore = IncidentCategoriesMasterStore
  IncidentSubCategoryMasterStore = IncidentSubCategoryMasterStore;
  UsersStore = UsersStore
  StakeholderMasterStore = StakeholdersStore;
  SubsidiaryStore = SubsidiaryStore;
  DivisionMasterStore = DivisionMasterStore;
  DepartmentMasterStore = DepartmentMasterStore;
  SectionMasterStore = SectionMasterStore;
  SubSectionMasterStore = SubSectionMasterStore;
  IncidentRootCauseMasterStore = IncidentRootCauseMasterStore;
  IncidentDamageSeverityMasterStore = IncidentDamageSeverityMasterStore;


  constructor(private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private  _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _imageService: ImageServiceService,
    private _incidentFileService : IncidentFileService,
    private _incidentDamageTypesService: IncidentDamageTypeService,
    private _incidentCategoriesService: IncidentCategoriesService,
    private _incidentSubCategoryService: IncidentSubCategoryService,
    private _userService: UsersService,
    private _stakeholderService: StakeholderService,
    private _subsiadiaryService: SubsidiaryService,
    private _divisionService: DivisionService,
    private _departmentService: DepartmentService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _investigationService : InvestigationService,
    private _incidentRootCauseService: IncidentRootCauseService,
    private _incidentDamageSeverityService: IncidentDamageSeverityService,
    private _incidentService : IncidentService
  ) { }
  formObject = {
    0: ['title',
        'organization_ids',
        'incident_at',
        'location',
        'action'
        ],
    1: [],
    2: [],
    3: [],
    4: []

  }
  ngOnInit(): void {
   
    $(document).ready(function(){
      $("#startId,#startIdButton,#endId,#endIdButton").click(function(){
         $(".cdk-overlay-container").css({ "font-position": "fixed","z-index": "9999999"});
       });
     });
    AppStore.showDiscussion = false;
    AppStore.disableLoading();
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      setTimeout(() => {
        this.form.pristine;
      }, 250);
    });
    
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '/incident-management/incidents' }

    ]);
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
    }, 1000);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    window.addEventListener("scroll", this.scrollEvent, true);

     // form
     this.form = this._formBuilder.group({
      id : '',
     incident_id: [''],
     title: ['', [Validators.required]],
     description : [''],
     location : [''],
     incident_at: ['',[Validators.required]],
     incident_damage_type_id : [null],
     action : [''],
     reported_at : [''], 
     reported_by : [null],
     organization_ids : [[],[Validators.required]],
     division_ids : [],
     department_ids : [],
     section_ids : [],
     sub_section_ids : [[]],
     incident_type_ids : [[]],
     incident_stakeholder_ids : [[]],
     investigation_witness_user_ids : [],
     investigation_involved_user_ids : [],
     documents : [],
     investigation_witness_other_users : [],
     investigation_involved_other_users : [],
     incident_category_ids : [],
     incident_sub_category_ids : [],
     investigation_observations : [[]],
     investigation_points : [[]],
     investigation_recommendations : [[]],
     investigation_references : [[]],
     is_safe_work : '',
     incident_damage_severity_id : [[]],
     investigation_root_cause_ids : [[]],

   })
    this.resetForm()

    IncidentInvestigationStore.unsetInvestigationUsers()
		IncidentStore.otherInvolvedUserDetails = [];
		IncidentStore.otherWitnessUserDetails = [];
		IncidentInvestigationStore.unsetDocumentDetails();
		IncidentStore.unsetPoints();

    setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);
    if(IncidentInvestigationStore.editFlag && IncidentInvestigationStore.selectedInvestigationId){
        this.getInvestigationDetails(IncidentInvestigationStore.selectedInvestigationId);}
 }

 getInvestigationDetails(id) {
  IncidentInvestigationStore.clearDocumentDetails()
  this._investigationService.getItem(id).subscribe(res => {
    var evidenceDetails = res;
    if (evidenceDetails.documents.length > 0) {
      for (let evidence of evidenceDetails.documents) {
        let evidencePreviewUrl = this._incidentFileService.getThumbnailPreview('investigation-item', evidence.token);
        let evidenceDetail = {
          name: evidence.title,
          title: evidence.title,
          ext: evidence.ext,
          size: evidence.size,
          url: evidence.url,
          thumbnail_url: evidence.url,
          token: evidence.token,
          preview: evidencePreviewUrl,
          id: evidence.id,
        };
        this._investigationService.setDocumentDetails(evidenceDetail, evidencePreviewUrl);
      }
    }
    if(res){
      this.setIncidentItemDataForEdit()}

    this._utilityService.detectChanges(this._cdr);
  })
}
 setIncidentItemDataForEdit() {
   this.form.patchValue({
    id : IncidentInvestigationStore.selectedInvestigationId,
    incident_id : IncidentInvestigationStore.investigationItemDetails?.incident?.id,
    title: IncidentInvestigationStore.investigationItemDetails?.title ?IncidentInvestigationStore.investigationItemDetails?.title : '',
    description: IncidentInvestigationStore.investigationItemDetails?.description ? IncidentInvestigationStore.investigationItemDetails?.description : '',
    incident_at: IncidentInvestigationStore.investigationItemDetails?.incident_at ? new Date (IncidentInvestigationStore.investigationItemDetails?.incident_at) : '',
    reported_at: IncidentInvestigationStore.investigationItemDetails?.reported_at ? new Date (IncidentInvestigationStore.investigationItemDetails?.reported_at) : '',
    incident_damage_type_id: IncidentInvestigationStore.investigationItemDetails?.incident_damage_type ? IncidentInvestigationStore.investigationItemDetails?.incident_damage_type.id : null,
    action: IncidentInvestigationStore.investigationItemDetails?.action ? IncidentInvestigationStore.investigationItemDetails?.action : '',
    reported_by: IncidentInvestigationStore.investigationItemDetails?.reported_by ? IncidentInvestigationStore.investigationItemDetails?.reported_by : '',
    documents: IncidentStore.docDetails,
    incident_sub_category_ids: IncidentInvestigationStore.investigationItemDetails?.investigation_sub_categories.length>0 ? IncidentInvestigationStore.investigationItemDetails?.investigation_sub_categories[0].id  : null,
    incident_category_ids: IncidentInvestigationStore.investigationItemDetails?.investigation_categories.length>0 ? IncidentInvestigationStore.investigationItemDetails?.investigation_categories[0].id  : [],
    incident_stakeholder_ids: IncidentInvestigationStore.investigationItemDetails?.stakeholders.length>0 ? IncidentInvestigationStore.investigationItemDetails?.stakeholders[0].id : null,
    is_safe_work: IncidentInvestigationStore.investigationItemDetails?.is_safe_work ? 1 : 2 ,

    incident_witness_other_users: IncidentInvestigationStore.investigationItemDetails?.witness_other_users ? IncidentInvestigationStore.investigationItemDetails?.witness_other_users : [],
    incident_involved_other_users: IncidentInvestigationStore.investigationItemDetails?.involved_other_users ? IncidentInvestigationStore.investigationItemDetails?.involved_other_users  : [],
    investigation_witness_user_ids: IncidentInvestigationStore.involvedWitnessUserDetails ? IncidentInvestigationStore.involvedWitnessUserDetails : [],
    investigation_involved_user_ids: IncidentInvestigationStore.involvedOtherUserDetails ? IncidentInvestigationStore.involvedOtherUserDetails : [],

    // incident_witness_other_users: IncidentInvestigationStore.incident_witness_other_users ? this.getEditValue(incidentItem.incident_witness_other_users) : [],
    // incident_involved_other_users: IncidentInvestigationStore.incident_involved_other_users ? this.getEditValue(incidentItem.incident_involved_other_users) : [],
    // investigation_witness_user_ids: IncidentInvestigationStore.involvedWitnessUserDetails ? IncidentInvestigationStore.involvedWitnessUserDetails : [],
    // investigation_involved_user_ids: IncidentInvestigationStore.involvedOtherUserDetails ? IncidentInvestigationStore.involvedOtherUserDetails : [],
    sub_section_ids: IncidentInvestigationStore.investigationItemDetails?.sub_sections.length > 0 ? IncidentInvestigationStore.investigationItemDetails?.sub_sections[0].id : null,
    section_ids: IncidentInvestigationStore.investigationItemDetails?.sections.length > 0  ? IncidentInvestigationStore.investigationItemDetails?.sections[0].id : null,
    organization_ids: IncidentInvestigationStore.investigationItemDetails?.organizations.length > 0 ? IncidentInvestigationStore.investigationItemDetails?.organizations[0].id : null,
    division_ids: IncidentInvestigationStore.investigationItemDetails?.divisions.length > 0  ? IncidentInvestigationStore.investigationItemDetails?.divisions[0].id : null,
    department_ids: IncidentInvestigationStore.investigationItemDetails?.departments.length > 0  ? IncidentInvestigationStore.investigationItemDetails?.departments[0].id : null,
    location : IncidentInvestigationStore.investigationItemDetails?.location ? IncidentInvestigationStore.investigationItemDetails?.location : ''
  
   })
   IncidentStore.recommendations = this.getInvestigations(IncidentInvestigationStore.investigationItemDetails.recommendations) 
    IncidentStore.references = this.getInvestigations(IncidentInvestigationStore.investigationItemDetails.references) 
    IncidentStore.incidentInvestigations = this.getInvestigations(IncidentInvestigationStore.investigationItemDetails.points) 
    IncidentStore.significantObservations = this.getInvestigations(IncidentInvestigationStore.investigationItemDetails.observations) 
    if(IncidentInvestigationStore.investigationItemDetails.is_safe_work == 1){
      this.yes = true
    }else if (IncidentInvestigationStore.investigationItemDetails.is_safe_work == 2){
      this.no = true
    }
    this.getIncidentSubCategory()
  this._utilityService.detectChanges(this._cdr);
  this.getData()
}

  getData(){
    this.getDepartment();
    this.getSections()
    this.getDevisions()
    this.getOrganization();
    this.getIncidentCategory()
    this.getIncidentSubCategory();
    this.getIncidentType()
    this.getUsers()
    this.getInvolvedUsers()
    this.getRootCause()
    this.getDamageSeverityCause()

  }
  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._incidentFileService.getThumbnailPreview(type, token)
  }


  // Returns image url according to type and token
  createImageUrl(type, token) {
    return this._incidentFileService.getThumbnailPreview(type, token);
  }
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
 checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
}
checkAcceptFileTypes(type){
  return this._imageService.getAcceptFileTypes(type); 
}
getStringsFormatted(stringArray,characterLength,seperator){
  return this._helperService.getFormattedName(stringArray,characterLength,seperator);
}



involvedOthers(){
  let item =  IncidentStore.involvedOtherUserDetails.slice(0,2)
  return item
 }

 othersWitness(){
   let item = IncidentStore.involvedWitnessUserDetails.slice(0,2)
   return item
  }

  openOtherInvolvedPerson(){
    this.assignOtherUsers( IncidentStore.involvedOtherUserDetails);
   }
 
   openOthersWitnessModel(){
     this.assignOtherUsers(IncidentStore.involvedWitnessUserDetails);
 
   }
   closeassignOtherUsers(){
    //  $(this.othersPopup.nativeElement).modal('show');
   }
 
   assignOtherUsers(users){
     IncidentStore.setOthersItems(users)
     this._utilityService.detectChanges(this._cdr);
    //  $(this.othersPopup.nativeElement).modal('show');
   }   

// for getting incident type
getIncidentType() {
  this._incidentDamageTypesService.getItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })

}
searchIncidentType(e,patchValue:boolean = false){
  this._incidentDamageTypesService.getItems(false, '&q=' + e.term).subscribe((res) => {
    if(patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          // this.form.patchValue({ incident_damage_type_id: i });
          break;
        }
      }
      // _incidentDamageTypesService.lastIsertedId = null;
    }
    this._utilityService.detectChanges(this._cdr);
  });

}
incidentMaxDate(){
  let curDate = new Date();
  curDate.setDate(curDate.getDate()-1);
  return curDate;
}

getIncidentCategory(){
  this._incidentCategoriesService.getItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}

searchIncidentCategory(e,patchValue:boolean = false){
  this._incidentCategoriesService.getItems(false, '&q=' + e.term).subscribe((res) => {
    if(patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          this.form.patchValue({ incident_category_ids: i.id });
          break;
        }
      }
      // _incidentDamageTypesService.lastIsertedId = null;
    }
    this._utilityService.detectChanges(this._cdr);
  });
}

searchIncidentSubCategory(e,patchValue:boolean = false){
  let params =''
  if(this.form.get('incident_sub_category_ids').value){
     params = '&incident_sub_category_ids=' + this.form.get('incident_sub_category_ids').value.id;
    this._incidentSubCategoryService.getItems(false, '&q=' + e.term+params).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue({ incident_sub_category_ids: i });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
}

getIncidentSubCategory(){
  let params =''
  if(this.form.value.incident_category_ids){
     params = '&incident_category_ids=' + this.form.value.incident_category_ids;
     this._incidentSubCategoryService.getItems(false,params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  else{this.form.patchValue({
    incident_sub_category_ids : null
  })}
}

searchReportedBy(e) {
  if(this.form.value.department_ids){
    let params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
  this._userService.searchUsers('?q=' + e.term+params).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}
}

getUsers(){
  var params = '';
  this._userService.getAllItems(params).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  })
}


searchInvolved(e){
  this._stakeholderService.getItems(false,'&q='+e.term)
  .subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  })
}

getInvolvedUsers(){
  // let params = '?department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
  this._stakeholderService.getAllItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });

}


    // for searching organization

    searchOrganization(event) {
      if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
        this._subsiadiaryService.searchSubsidiary('?is_full_list=true&q='+event.term).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        })
      }
  
    }

    getOrganization(){
      this._subsiadiaryService.getAllItems(false).subscribe((res:any)=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }

    getDevisions(){
      this._divisionService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  
    searchDivision(event) {
        this._divisionService.getItems(false,'&q='+event.term).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        });
    }
  
    searchDepartment(e,patchValue:boolean = false){
      this._departmentService.getItems(false,'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  
    getDepartment(){
        var params = '';
       
      this._departmentService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
  
    }

    getSections(){
      this._sectionService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
   
    }
  
    searchSections(e,patchValue:boolean = false){
        var params = '';
        this._sectionService.getItems(false,'&q='+e.term).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        });
    
      }

      searchSubSections(e,patchValue:boolean = false){
        var params = '';
        this._subSectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        });
    }
  
  
    getSubSections(){
        var params = ''    
      this._subSectionService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
   /**
 * 
 * @param progress File Upload Progress
 * @param file Selected File
 * @param success Boolean value whether file upload success 
 */
    assignFileUploadProgress(progress, file, success = false) {

      let temporaryFileUploadsArray = this.fileUploadsArray;
      this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
    }
  
    /**
     * 
     * @param files Selected files array
     * @param type type of selected files - logo or brochure
     */
    addItemsToFileUploadProgressArray(files, type) {
      var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
      this.fileUploadsArray = result.fileUploadsArray;
      return result.files;
    }
  
  
    /**
     * removing document file from the selected list
     * @param token -image token
     */
    removeDocument(token) {
      IncidentInvestigationStore.unsetDocumentDetails(token);
      this.checkForFileUploadsScrollbar();
      for (let i = 0; i < this.form.value.documents.length; i++) {
        if( token == this.form.value.documents[i].token ){
          this.form.value.documents.splice(i,1)
        }
        
      }
      this._utilityService.detectChanges(this._cdr);
    }
    // file change function
    onFileChange(event, type: string) {
      var selectedFiles: any[] = event.target.files;
      if (selectedFiles.length > 0) {
        var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
        this.checkForFileUploadsScrollbar();
        Array.prototype.forEach.call(temporaryFiles, elem => {
          const file = elem;
          if (this._imageService.validateFile(file, type)) {
            const formData = new FormData();
            formData.append('file', file);
            var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
            this._imageService.uploadImageWithProgress(formData, typeParams) // Upload file to temporary storage
              .subscribe((res: HttpEvent<any>) => {
                let uploadEvent: any = res;
                switch (uploadEvent.type) {
                  case HttpEventType.UploadProgress:
                    // Compute and show the % done;
                    if (uploadEvent.loaded) {
                      let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                      this.assignFileUploadProgress(upProgress, file);
                    }
                    $("#file").val('');
                    this._utilityService.detectChanges(this._cdr);
                    break;
                  case HttpEventType.Response:
                    //return event;
                    let temp: any = uploadEvent['body'];
                    temp['is_new'] = true;
                    this.assignFileUploadProgress(null, file, true);
                    this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
                      this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                    }, (error) => {
                      this.assignFileUploadProgress(null, file, true);
                      this._utilityService.detectChanges(this._cdr);
                    })
                }
              }, (error) => {
                this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
                this.assignFileUploadProgress(null, file, true);
                this._utilityService.detectChanges(this._cdr);
              })
          }
          else {
            this.assignFileUploadProgress(null, file, true);
          }
        });
      }
    }

      // imageblob function
      createImageFromBlob(image: Blob, imageDetails, type) {
        this.imageData = imageDetails
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          var logo_url = reader.result;
    
          imageDetails['preview'] = logo_url;
          if (imageDetails != null)
            this._investigationService.setDocumentDetails(imageDetails, type);
            this.form.value.documents.push(this.imageData)
          this.checkForFileUploadsScrollbar();
          this._utilityService.detectChanges(this._cdr);
        }, false);
    
        if (image) {
          reader.readAsDataURL(image);
        }
      }
  
        // scrollbar function
    checkForFileUploadsScrollbar() {
  
      if (this.form.value.documents.length > 5 || this.fileUploadsArray.length > 5) {
        $(this.uploadArea.nativeElement).mCustomScrollbar();
      }
      else {
        if(this.form.value.documents.length > 0) $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    }
  

//chekBox Change    
    onCheckboxChange1(e) {
      if (e.target.checked == true) {
        this.yes = true
        this.no = false
        this.form.patchValue({
          is_safe_work: 1
        })
        this._utilityService.detectChanges(this._cdr)
  
      }
    }
    onCheckboxChange2(e){
      if(e.target.checked == true){
        this.no = true
        this.yes = false
        this.form.patchValue({
          is_safe_work: 0
  
        })
        this._utilityService.detectChanges(this._cdr)
  
      }
    }

    addInvestigationPoint() {
      if (this.form.value.investigation_points) {
        IncidentStore.investigationsDes.push(this.form.value.investigation_points);
      }
      this.form.patchValue({
        investigation_points: null
      })
      this._utilityService.detectChanges(this._cdr);
    }

    removeInvestigation(index) {
      IncidentStore.investigationsDes.splice(index, 1);
    }

    
    addRecommendationsPoint() {
      if (this.form.value.investigation_recommendations) {
        IncidentStore.recommendationsDes.push(this.form.value.investigation_recommendations);
      }
      this.form.patchValue({
        investigation_recommendations: null
      })
      this._utilityService.detectChanges(this._cdr);
    }

    removeRecommendations(index) {
      IncidentStore.recommendationsDes.splice(index, 1);
    }

    
  getRootCause() {
    this._incidentRootCauseService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchRootCause(e,patchValue:boolean = false){
    this._incidentRootCauseService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            // this.form.patchValue({ id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addObservationsPoint() {
    if (this.form.value.investigation_observations) {
      IncidentStore.significantObservationsDes.push(this.form.value.investigation_observations);
    }
    this.form.patchValue({
      investigation_observations: null
    })
    this._utilityService.detectChanges(this._cdr);
  }

  removeObservations(index) {
    IncidentStore.significantObservationsDes.splice(index, 1);
  }

  addReferencesPoint() {
    if (this.form.value.investigation_references) {
      IncidentStore.referencesDes.push(this.form.value.investigation_references);
    }
    this.form.patchValue({
      investigation_references: null
    })
    this._utilityService.detectChanges(this._cdr);
  }

  removeReference(index) {
    IncidentStore.referencesDes.splice(index, 1);
  }

  getDamageSeverityCause() {
    this._incidentDamageSeverityService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  searchDamageSeverity(e,patchValue:boolean = false){
    this._incidentDamageSeverityService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            // this.form.patchValue({ id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  deleteOtherInvovedPerson(user){
    for (let i = 0; i < IncidentInvestigationStore.involvedOtherUserDetails.length; i++) {
       if(user == IncidentInvestigationStore.involvedOtherUserDetails[i].first_name){
        IncidentInvestigationStore.involvedOtherUserDetails.splice(i,1)
       }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  deleteOthersInvovedPersons(user){
    for (let i = 0; i < IncidentStore.involvedOtherUserDetails.length; i++) {
       if(user == IncidentStore.involvedOtherUserDetails[i].name){
        IncidentStore.involvedOtherUserDetails.splice(i,1)
       }
    }
    this._utilityService.detectChanges(this._cdr);
  }
  deleteOthersWitnessPersons(user){
    for (let i = 0; i < IncidentStore.involvedWitnessUserDetails.length; i++) {
       if(user == IncidentStore.involvedWitnessUserDetails[i].name){
        IncidentStore.involvedWitnessUserDetails.splice(i,1)
       }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  deleteOtherWitnessPerson(user){
    // 
    for (let i = 0; i < IncidentInvestigationStore.involvedWitnessUserDetails.length; i++) {
       if(user == IncidentInvestigationStore.involvedWitnessUserDetails[i].first_name){
        IncidentInvestigationStore.involvedWitnessUserDetails.splice(i,1)
       }
    }
    this._utilityService.detectChanges(this._cdr);
  }


  // for user previrews
  assignUserValues(user) {
    if(user){
    var userInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }

    userInfoObject.first_name = user?.first_name?user?.first_name:user?.user?.first_name;
    userInfoObject.last_name = user?.last_name?user?.last_name:user?.user?.last_name;
    userInfoObject.designation = user?.designation_title ? user?.designation_title: user?.designation ? user?.designation: user?.user?.designation ? user?.user?.designation?.title: null;
    userInfoObject.image_token = user?.image_token ? user?.image_token : user?.image ? user?.image?.token : user?.user ? user?.user?.image_token:null;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status_id
    userInfoObject.department = user?.department? user?.department: user?.user?.department?.title ? user?.user?.department?.title: null;
     return userInfoObject;
  }
  }

  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i.id );
    }
    return returnValues;
  }
  getInvestigations(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i.description);
    }
    return returnValues;
  }
  passSaveFormatDate(date)
  {
   const fromdate = this.pipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
   return fromdate;
  }


  processDataForSave(){
    
    let saveData = {
      id : this.form.value.id ? this.form.value.id : '',
      incident_id: IncidentStore.selectedId ? IncidentStore.selectedId: '', 
      title: this.form.value.title ? this.form.value.title : '',
      description:  this.form.value.description ?  this.form.value.description : '',
      location: this.form.value.location ? this.form.value.location : '',
      incident_at: this.form.value.incident_at? this.passSaveFormatDate(this.form.value.incident_at) : '',
      reported_at: this.form.value.reported_at ? this.passSaveFormatDate(this.form.value.reported_at) : '',
      incident_damage_type_id: this.form.value.incident_damage_type_id ? this.form.value.incident_damage_type_id : null,
      action: this.form.value.action ? this.form.value.action : '',
      reported_by: this.form.value.reported_by ? this.form.value.reported_by.id : '',
      documents: this.form.value.documents,
      incident_sub_category_ids: this.form.value.incident_sub_category_ids ? [this.form.value.incident_sub_category_ids] : [],
      incident_category_ids: this.form.value.incident_category_ids ? [this.form.value.incident_category_ids] : [],
      incident_stakeholder_ids : this.form.value.incident_stakeholder_ids? [this.form.value.incident_stakeholder_ids] : [],
      // incident_witness_other_users: IncidentStore.involvedWitnessUserDetails ? IncidentStore.involvedWitnessUserDetails : [],
      investigation_witness_other_users: IncidentStore.involvedOtherUserDetails ? IncidentStore.involvedWitnessUserDetails : [],
      investigation_involved_other_users: IncidentStore.involvedOtherUserDetails ? IncidentStore.involvedOtherUserDetails : [],
      investigation_witness_user_ids: IncidentInvestigationStore.involvedWitnessUserDetails ? this.getEditValue(IncidentInvestigationStore.involvedWitnessUserDetails) : [],
      investigation_involved_user_ids: IncidentInvestigationStore.involvedOtherUserDetails ? this.getEditValue(IncidentInvestigationStore.involvedOtherUserDetails) : [],
      sub_section_ids: this.form.value.sub_section_ids ? [this.form.value.sub_section_ids] : [],
      section_ids: this.form.value.section_ids ? [this.form.value.section_ids] : [],
      organization_ids: this.form.value.organization_ids ? [this.form.value.organization_ids] : [],
      division_ids: this.form.value.division_ids ? [this.form.value.division_ids] : [],
      department_ids: this.form.value.department_ids ? [this.form.value.department_ids] : [],
      investigation_observations : IncidentStore.significantObservationsDes ,
      investigation_points : IncidentStore.investigationsDes,
      investigation_recommendations : IncidentStore.recommendationsDes,
      investigation_references : IncidentStore.referencesDes,
      is_safe_work : '1',
      incident_damage_severity_id : this.form.value.incident_damage_severity_id ? this.form.value.incident_damage_severity_id.id : null,
      investigation_root_cause_ids: this.form.value.investigation_root_cause_ids ? this.getEditValue(this.form.value.investigation_root_cause_ids) : []
    };
    
    return saveData;
  }
  sumbitInvestigation(){
    let save;

    AppStore.enableLoading();


    if(IncidentInvestigationStore.editFlag){
      save = this._incidentService.updateInvestigation(this.form.value.id, this.processDataForSave());
    }else{
      save = this._incidentService.saveInvestigation(this.processDataForSave());

    }

        save.subscribe((res: any) => {

          this.resetForm();
          $("#file").val('');
          AppStore.disableLoading();
          if(IncidentInvestigationStore.editFlag){
            IncidentInvestigationStore.setSelectedInvestigationId(IncidentInvestigationStore.selectedId)
            this._investigationService.getItem(IncidentInvestigationStore.selectedId).subscribe()

          }else{
            IncidentInvestigationStore.setSelectedInvestigationId(res.id)
            this._investigationService.getItem(res.id).subscribe()

          }
          this.cancelClicked();
          // if(this._router.url.indexOf('incident-investigations') != -1){
          //   this._router.navigateByUrl('/incident-management/incident-investigations/'+res.id)
          // }else{
          //   this._router.navigateByUrl('/incident-management/'+IncidentStore.selectedId+'/investigation')

          // }
          this._utilityService.detectChanges(this._cdr);


          // this._router.navigateByUrl('/incident-management/incidents')
          
        },(err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else if(err.status == 500 || err.status == 403){
            this.cancelClicked();
          }
    
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
    
    
        })
     
  }




  // Setting Intial Tab
  setIntialTab() {
    var x: any = document.getElementsByClassName("tab");

    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();

  }


  changeStep(step) {
    if (step > this.currentTab && this.checkFormObject(step)) {
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if (step < this.currentTab) {
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }
  }

  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.form.controls[i].valid) {
            setValid = false;
            break;
          }
        }
      }
    }
    else {
      for (var i = 0; i < tabNumber; i++) {
        if (this.formObject.hasOwnProperty(i)) {
          for (let k of this.formObject[i]) {
            if (!this.form.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }
    }

    return setValid;
  }

  cancelClicked() {
    this._router.navigateByUrl('incident-management/incidents');
  }
  
  nextPrev(n) {
    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    // if (n == 1 && !validateForm()) return false;

    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className +=
        " finish";
    }

    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    if (IncidentStore.tabHides == true) {
      if (this.currentTab == 0 && n > 0) this.currentTab = 3;
      else if (this.currentTab == 3 && n < 0) this.currentTab = 0;
      else this.currentTab = this.currentTab + n;
    } else {
      this.currentTab = this.currentTab + n;
    }

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.sumbitInvestigation();
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }

  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "inline";
    }

    if (n == x.length - 1) {

      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
      // document.getElementById("nextBtn").innerHTML = "Save";
    } else {
      if (document.getElementById("nextBtn")) this.nextButtonText = "Next";
      //document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n);
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i,
      x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  // scroll event
  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.formSteps.nativeElement, 'small');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  };

  
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    window.removeEventListener('scroll', this.scrollEvent);

  }


}