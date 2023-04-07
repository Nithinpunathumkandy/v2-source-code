import { Component, ElementRef, OnInit, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IReactionDisposer, autorun } from "mobx";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';

import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";
import { DivisionMasterStore } from "src/app/stores/masters/organization/division-store";
import { SectionMasterStore } from "src/app/stores/masters/organization/section-store";
import { SubSectionMasterStore } from "src/app/stores/masters/organization/sub-section-store";
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { DatePipe } from '@angular/common';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from 'src/app/shared/directives/upload-adapter';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { StrategyThemeService } from 'src/app/core/services/masters/strategy/strategic-theme/strategy-theme.service';
import { StrategyThemesPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-theme';
import { StrategicThemesMasterStore } from 'src/app/stores/masters/strategy/strategy-theme.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';


declare var $: any;

@Component({
  selector: 'app-add-strategy',
  templateUrl: './add-strategy.component.html',
  styleUrls: ['./add-strategy.component.scss']
})
export class AddStrategyComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('whiteSheetModal') whiteSheetModal: ElementRef;
  @ViewChild('noteModal') noteModal: ElementRef;
  @ViewChild('focusAreaModal') focusAreaModal: ElementRef;
  @ViewChild('strategyAreaModal') strategyAreaModal: ElementRef;
  @ViewChild('strategyKpiModal') strategyKpiModal: ElementRef;
  @ViewChild('strategyKpiDetailsModal') strategyKpiDetailsModal: ElementRef;
  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('addStrategyTheme') addStrategyTheme: ElementRef;
  @ViewChild('addReviewFrequency') addReviewFrequency: ElementRef;

  strategyEmptyList : string = 'common_nodata_title'
  StrategyStore = StrategyStore;
  StrategicThemesMasterStore = StrategicThemesMasterStore;
  OrganizationModulesStore = OrganizationModulesStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  UsersStore = UsersStore;
  SubMenuItemStore = SubMenuItemStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  AuthStore = AuthStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  fileUploadPopupStore = fileUploadPopupStore
  reactionDisposer: IReactionDisposer;
  strategyForm: FormGroup;
  currentTab = 0;
  selectedNoteTab = 0;
  selectedKpiItem = 0;
  confirmationEventSubscription: any = null;
  focusAreaModalEventSubscription: any = null;
  notesModalEventSubscription: any = null;
  strategyKpiModalEventSubscription: any = null;
  whiteSheetModalEventSubscription: any = null;
  objectiveModalEventSubscription: any = null;
  swot_availability:Boolean = false;
  pestel_availabale:Boolean = false;
  strategyKpiDetailsModalEventSubscription: any = null;
  strategyObjectiveModalEventSubscription: any = null;
  strategicThemesSubscriptionEvent : any = null;
  reviewFrequencySubscriptionEvent : any = null;
  formErrors : any
  selectedIndex = null;
  selectedObjectiveIndex = null;
  openThemeModal : boolean = false;
  openReviewFrequencyPopup : boolean = false;
  startDate;
  endDate;
  fileUploadsArray = [];
  nextButtonText = 'next';
  previousButtonText = "previous";
  confirmationObject = { 
    title: 'Cancel?',
    subtitle: 'common_cancel_subtitle',
    type: 'Cancel'
  };
  whiteSheetObject = {
    type: null,
    value: null
  }
  noteObject = {
    type: null,
    value: null,
    id:null
  }
  focusAreaObject = {
    type: null,
    department:[],
    value: null
  }
  strategyModalObject = {
    type: null,
    department:[],
    value: null
  }
  strategyKpiObject = {
    type: null,
    value: null
  }
  kpiDetailsObject = {
    type: null,
    value: null
  }

  deleteObjects = {
    id: null,
    title: '',
    type: '',
    subtitle:''
  };

  strategicThemesObject = {
    component: 'Master',
    values: null,
    type: null
  };

  reviewFrequencyObject = {
    id: null,
    value : null
  };

  is_save: boolean=false;

  formObject = {
    0:[
      'title',
      'start_date',
      'end_date',
      // 'organization_ids',
      // 'division_ids',
      // 'department_ids',
      // 'section_ids',
      // 'sub_section_ids',
      'review_user_ids'
    ],
    1:[
      
    ],
    2:[
      // 'focus_areas'
    ],
    3:[
      
    ],
    4:[
      
    ]
  }
 
  pipe = new DatePipe('en-US');
  
  description: any = '';
 
  selectedFocusAreaId: any;
  isNoteLoaded: boolean = false;
  isFocusArea: boolean = false;
  isObjectivesLoaded: boolean = false;
  selectedObjectiveIndexDetails = null;
  organisationChangesModalSubscription: any;
  openModelPopup: boolean;
  public Editor;
  public Config;
  fileUploadPopupSubscriptionEvent: any;
  constructor(private _renderer2: Renderer2, private _utilityService: UtilityService, private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef, private _router: Router, private _eventEmitterService: EventEmitterService, private _departmentService: DepartmentService,
    private _divisionService: DivisionService, private _sectionService: SectionService,
    private _strategicThemeService:StrategyThemeService,
    private _subSectionService: SubSectionService, private _subsidiaryService: SubsidiaryService,private _helperService: HelperServiceService,
    private _strategyService : StrategyService, private _http: HttpClient, private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService, private _usersService: UsersService,) { 
      this.Editor = myCkEditor;
     }
    
     public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
      { type: "close", path: "../" }
    ]);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    OrganizationalSettingsStore.isMultiple = true;


    this.strategyForm = this._formBuilder.group({
      title: ['',[Validators.required]],
      description: '',
      start_date: [null,[Validators.required]],
      end_date: [null,[Validators.required]],
      budget: [null,[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      accountable_user_id: [null],
      review_user_ids : [[],[Validators.required]],
      theme_ids:[[]],
      organization_ids: [[]],
      division_ids: [[]],
      department_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
      whitesheet: [null],
      is_default : [null],
      notes: [null],
      focus_areas: [null,[Validators.required]],
      objectives: [null],
      strategy_profile_status_id : [null]
    });

    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    this.strategyForm.controls['division_ids'].setValidators(Validators.required);
   if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    this.strategyForm.controls['section_ids'].setValidators(Validators.required);
  if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    this.strategyForm.controls['sub_section_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_department)
    this.strategyForm.controls['department_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
    this.strategyForm.controls['organization_ids'].setValidators(Validators.required);

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    setTimeout(() => {
      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);
    }, 250);


    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item=>{
      this.delete(item);
        })

    this.focusAreaModalEventSubscription = this._eventEmitterService.focusAreaModal.subscribe(item=>{
      this.closeFocusAreaModal();
      this.getFocusAreas()
    })
    this.notesModalEventSubscription = this._eventEmitterService.notesModal.subscribe(item=>{
      this.closeNoteModal();
      this.getStrategyNotes();
      this.selectedIndex = null
    })
    this.strategyKpiModalEventSubscription = this._eventEmitterService.strategyKpiModal.subscribe(item=>{
      this.closeStrategyKpiModal();
      this.getKpiList();
    })
    this.whiteSheetModalEventSubscription = this._eventEmitterService.whiteSheetModal.subscribe(item=>{
      this.closeWhiteSheetModal();
    })
    
    this.strategyKpiDetailsModalEventSubscription = this._eventEmitterService.strategyKpiDetailsModal.subscribe(item=>{
      this.closeStrategyKpiDetailsModal();
      
    })

     // for closing the modal
     this.strategicThemesSubscriptionEvent = this._eventEmitterService.strategicThemeModalControl.subscribe(res => {
      this.closeStrategyThemeModal();
    })

    this.reviewFrequencySubscriptionEvent = this._eventEmitterService.reviewFrequencyModal.subscribe(res => {
      this.closeReviewFrequencyPopup();
    })

    this.strategyObjectiveModalEventSubscription = this._eventEmitterService.strategyObjectiveModal.subscribe(item=>{
      if(this.strategyModalObject.type== "Edit"){
        // this.getObjectiveDetails(StrategyStore.objectiveId)
        this.selectObjectiveIndexChange(this.selectedObjectiveIndex, StrategyStore.objectiveId)
        this.closeStrategyModal();
        // this.selectedFocusAreaId = StrategyStore.focusAreaId
      }
      else{
        this.closeStrategyModal();
        // this.selectedFocusAreaId = StrategyStore.focusAreaId
        this.getObjectiveList();
      }
      
    })

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );
    
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      this.strategyForm.controls['division_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      this.strategyForm.controls['section_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      this.strategyForm.controls['sub_section_ids'].setValidators(Validators.required);

    if (this._router.url.indexOf('edit') != -1) {
      if (StrategyStore.induvalStrategyProfile){
        StrategyStore.clearDocumentDetails()
        this.setProfileDataForEdit();
      }
    }else{
       this.setInitialOrganizationLevels()
       StrategyStore.clearDocumentDetails()
    }

    this.getTheme();
    this.getUsers();
  }

  getFormattedDate(date){
    return this._helperService.processDate(date,'join');
  }

  setSelectedNotesTab(num){
    this.selectedNoteTab = num;
    this._utilityService.detectChanges(this._cdr);
  }

  selectKpiItem(pos,id){
    this.selectedFocusAreaId = id
    this.StrategyStore.selectedKpiItem = pos;
    StrategyStore.setFocusAreaId(id)
    this.getObjectiveList();
    this._utilityService.detectChanges(this._cdr);
  }

  setProfileDataForEdit(){
    if(StrategyStore.induvalStrategyProfile.image_token){
      let docUrl = this._strategyService.getThumbnailPreview('profile',StrategyStore.induvalStrategyProfile.image_token)
      let docDetails = {
        name : StrategyStore.induvalStrategyProfile.image_title ? StrategyStore.induvalStrategyProfile.image_title : '',
        ext : StrategyStore.induvalStrategyProfile.image_ext ? StrategyStore.induvalStrategyProfile.image_ext : '',
        size : StrategyStore.induvalStrategyProfile.image_size ? StrategyStore.induvalStrategyProfile.image_size : '',
        token : StrategyStore.induvalStrategyProfile.image_token ? StrategyStore.induvalStrategyProfile.image_token : '',
        url : StrategyStore.induvalStrategyProfile.image_url ? StrategyStore.induvalStrategyProfile.image_url : '',
        preview_url : StrategyStore.induvalStrategyProfile.image_url ? StrategyStore.induvalStrategyProfile.image_url : '',
        mime_type : null,
        is_new : false,
        title : null,
        thumbnail_url : StrategyStore.induvalStrategyProfile.image_url ? StrategyStore.induvalStrategyProfile.image_url : '',
        id : null,
        is_deleted : false,
        preview : docUrl,
      }
      StrategyStore.setDocumentDetails(docDetails,docUrl)
    }
    this.strategyForm.patchValue({
      title: StrategyStore.induvalStrategyProfile.title ? StrategyStore.induvalStrategyProfile.title : '',
      description: StrategyStore.induvalStrategyProfile?.description ? StrategyStore.induvalStrategyProfile?.description : '',
      is_default : StrategyStore.induvalStrategyProfile?.is_default == 1 ? true : false,
      start_date: StrategyStore.induvalStrategyProfile.start_date ? this._helperService.processDate( StrategyStore.induvalStrategyProfile.start_date,'split') : '',
      end_date: StrategyStore.induvalStrategyProfile.end_date  ? this._helperService.processDate(StrategyStore.induvalStrategyProfile.end_date,'split') : '',
      budget: StrategyStore.induvalStrategyProfile.budget ? StrategyStore.induvalStrategyProfile.budget : '',
      accountable_user_id: StrategyStore.induvalStrategyProfile?.accountable_user ? StrategyStore.induvalStrategyProfile?.accountable_user : null,
      review_user_ids: StrategyStore.induvalStrategyProfile?.review_users ? this.getData(StrategyStore.induvalStrategyProfile?.review_users) : [],
      theme_ids: this.getData(StrategyStore.induvalStrategyProfile?.themes),
      division_ids: this.getData(StrategyStore.induvalStrategyProfile.divisions),
      department_ids: this.getData(StrategyStore.induvalStrategyProfile.departments),
      section_ids: this.getData(StrategyStore.induvalStrategyProfile.sections),
      sub_section_ids: this.getData(StrategyStore.induvalStrategyProfile.sub_sections),
      organization_ids: this.getData(StrategyStore.induvalStrategyProfile.organizations),
      strategy_profile_status_id : StrategyStore.induvalStrategyProfile.strategy_profile_status ? StrategyStore.induvalStrategyProfile.strategy_profile_status.id : 1
    })
    this.description = StrategyStore.induvalStrategyProfile?.white_sheet ? StrategyStore.induvalStrategyProfile?.white_sheet : ''
    this._utilityService.detectChanges(this._cdr);
    
  }

  getData(value, user?) {
    let data = [];
    for(let i of value) {
      if (user)
      data.push(user == 'user' ? i.user : i.id);
      else
      data.push(i);
    }
    return data;
  }

  getValue(value,field?) {
    var returnValues = [];
    for (let i of value) {
      if (field)
        returnValues.push(i.id)
      else
        returnValues.push(i);
    }
    return returnValues;
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.designation?.title ? user.designation?.title  : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  setInitialOrganizationLevels(){
    let user= AuthStore.user
    user.first_name = user.name
    this.strategyForm.patchValue({
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
      department_ids:AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      section_ids:AuthStore?.user?.section ? [AuthStore?.user?.section] : [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
      organization_ids: AuthStore.user?.organization ? [AuthStore.user?.organization] : []
    });
    
    this._utilityService.detectChanges(this._cdr);
  }

  passSaveFormatDate(date){
   const fromdate = this.pipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
   return fromdate;
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  strategyProfileData(){
    let docData = {
      url: StrategyStore.docDetails ? StrategyStore.docDetails.url :null,
      name : StrategyStore.docDetails  ? StrategyStore.docDetails.name : null,
      size : StrategyStore.docDetails ?  StrategyStore.docDetails.size : null,
      ext : StrategyStore.docDetails ? StrategyStore.docDetails.ext :  null,
    }
    let saveData = {
      title: this.strategyForm.value.title ? this.strategyForm.value.title : '',
      description: this.strategyForm.value?.description ? this.strategyForm.value?.description : '',
      is_default : this.strategyForm.value.is_default ? 1 : 0,
      start_date: this.strategyForm.value.start_date ? this._helperService.processDate(this.strategyForm.value.start_date,'join') : '',
      end_date: this.strategyForm.value.end_date ? this._helperService.processDate(this.strategyForm.value.end_date,'join') : '',
      budget: this.strategyForm.value.budget ? this.strategyForm.value.budget : '',
      strategy_profile_status_id : this.strategyForm.value.strategy_profile_status_id ? this.strategyForm.value.strategy_profile_status_id : 1,  
      accountable_user_id : this.strategyForm.value.accountable_user_id ? this.strategyForm.value.accountable_user_id.id : null,
      theme_ids: this.getData(this.strategyForm.value.theme_ids,'id'),
      review_user_ids: this.strategyForm.value.review_user_ids ? this._helperService.getArrayProcessed(this.strategyForm.value.review_user_ids,'id') : [],
      organization_ids : this.strategyForm.value.organization_ids ? this._helperService.getArrayProcessed(this.strategyForm.value.organization_ids, 'id') : [AuthStore.user?.organization.id],
      division_ids : this.strategyForm.value.division_ids ? this._helperService.getArrayProcessed(this.strategyForm.value.division_ids, 'id') : [AuthStore.user?.division.id],
      department_ids : this.strategyForm.value.department_ids ? this._helperService.getArrayProcessed(this.strategyForm.value.department_ids, 'id') : [AuthStore.user?.department.id],
      section_ids : this.strategyForm.value.section_ids ? this._helperService.getArrayProcessed(this.strategyForm.value.section_ids, 'id') : [AuthStore.user?.section.id],
      sub_section_ids : this.strategyForm.value.sub_section_ids ? this._helperService.getArrayProcessed(this.strategyForm.value.sub_section_ids, 'id') : [AuthStore.user?.sub_section.id],
      image : docData
    };
    this._helperService.getArrayProcessed
   
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      delete saveData.organization_ids;
    }
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) {
      delete saveData.division_ids;
    }
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_department) {
      delete saveData.department_ids;
    }
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) {
      delete saveData.section_ids;
    }
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) {
      delete saveData.sub_section_ids;
    }
    console.log('saveData', saveData)
    return saveData
  }

  saveStrategyProfile(){
    this.formErrors = null;
    StrategyStore.start_date = this.strategyForm.value.start_date ;
    StrategyStore.end_date = this.strategyForm.value.end_date
    let save 
    if(this._router.url.indexOf('edit') != -1 || StrategyStore._strategyProfileId){
      save = this._strategyService.updateStrategyProfiles(this.strategyProfileData(),StrategyStore._strategyProfileId  );
    }else{
      save = this._strategyService.saveStrategyProfiles(this.strategyProfileData());

    }
     save.subscribe(res=>{
        if(res.id){
          StrategyStore.setSelectedId(res.id);
          StrategyStore._strategyProfileId = res.id
          this.getProfileDetails(res.id)
        }
        this.getStrategyNotes();
        if(this._router.url.indexOf('edit') != -1){
          this.description = StrategyStore.induvalStrategyProfile?.white_sheet ? StrategyStore.induvalStrategyProfile?.white_sheet : ''
        }
        this._utilityService.detectChanges(this._cdr);
        // this.strategyForm.reset();
     }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.currentTab = 0;
        this.nextButtonText = "save_next";
				this.previousButtonText = "previous";

				this.setIntialTab();
        this.showTab(this.currentTab);
				this._utilityService.detectChanges(this._cdr);
        // this._utilityService.showErrorMessage("error",err.error.message ) 
      }
        else if(err.status == 500 || err.status == 403){
          this._router.navigateByUrl('/strategy-management/strategy-profiles')
        }
        else if (err.status == 423) {
          this._utilityService.showErrorMessage("error",err.error.message ) 
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    })
     
  }

  getProfileDetails(id){
   this._strategyService.getItem(id).subscribe(res=>{this._utilityService.detectChanges(this._cdr);})
  }

  processWhiteSheet(){
    let data = {
      white_sheet : this.description ? this.description : ''
    }
    return data
  }

  saveStrategyWhiteShhet(){
    let save 
     save = this._strategyService.updateStrategyWhiteSheet(this.processWhiteSheet());
     save.subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
        // this.strategyForm.reset();
     })
     
  }

  MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' )
    .createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader, this._http );
    };
  }


  saveTabDetails(){
    if(this.currentTab==0){
      this.saveStrategyProfile();
    }
    if(this.currentTab==1 && this.description){
      this.saveStrategyWhiteShhet();
      
    }
    if(this.currentTab==2){
      // this.getObjectives(StrategyStore.focusAreaId)
      this.getObjectiveList();
    }   
    if(this.currentTab==3){
    }
  }

  // nextPrev(n,status:boolean=false) {
  //   this.is_save = status
  //   this.selectedObjectiveIndexDetails = null
  //    this.selectedObjectiveIndex = null
  //   var x: any = document.getElementsByClassName("tab");
  //   if (document.getElementsByClassName("step")[this.currentTab]) {
  //     document.getElementsByClassName("step")[this.currentTab].className +=
  //       " finish";
  //       if(this.currentTab==4 && n == 1){
  //         AppStore.enableLoading();
  //         setTimeout(() => {
  //           AppStore.disableLoading()
  //           this._router.navigateByUrl('strategy-management/strategy-profiles/'+StrategyStore._strategyProfileId)
  //         }, 1000);
  //       }
  //   }

  //   x[this.currentTab].style.display = "none";
  //   this.currentTab = this.currentTab + n;
  //   if (this.currentTab >= x.length) {
  //     this.currentTab =
  //       this.currentTab > 0 ? this.currentTab - n : this.currentTab;
  //     x[this.currentTab].style.display = "block";
  //     return false;
  //   }
  //   this.showTab(this.currentTab);
  // }

  nextPrev(n, status:boolean = false) {
    this.is_save = status
    this.selectedObjectiveIndexDetails = null
     this.selectedObjectiveIndex = null
		// This function will figure out which tab to display
		var x: any = document.getElementsByClassName("tab");
		// Exit the function if any field in the current tab is invalid:

		if (document.getElementsByClassName("step")[this.currentTab]) {
			document.getElementsByClassName("step")[this.currentTab].className += " finish";
		}

		// Hide the current tab:
		x[this.currentTab].style.display = "none";
		// Increase or decrease the current tab by 1:
		this.currentTab = this.currentTab + n;
		// }

		// if (n != -1) {
		// 	switch (this.currentTab) {

		// 		case 1:
		// 			this.submitForm();
		// 			break;
		// 		case 2:
		// 			if(AssetManagementSettingStore.assetManagementSettings?.is_asset_depreciation)
		// 			this.depreciationSubmitForm();
		// 			else
		// 			this.specificationSubmitForm();
		// 			break;
		// 		case 3:
		// 			if(AssetManagementSettingStore.assetManagementSettings?.is_asset_depreciation)
		// 			this.specificationSubmitForm();
		// 			else
		// 			this.documentSubmitForm();
		// 			break;
		// 		case 4:
		// 			AppStore.enableLoading();
    //       setTimeout(() => {
    //         AppStore.disableLoading()
    //         this._router.navigateByUrl('strategy-management/strategy-profiles/'+StrategyStore._strategyProfileId)
    //       }, 1000);
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// }

		// if you have reached the end of the assetForm...
		if (this.currentTab >= x.length) {
      AppStore.enableLoading();
      setTimeout(() => {
        AppStore.disableLoading()
        this._router.navigateByUrl('strategy-management/strategy-profiles/' + StrategyStore._strategyProfileId)
      }, 1000);
		
			this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
			x[this.currentTab].style.display = "block";
			return false;
		}
		// Otherwise, display the correct tab:
		this.showTab(this.currentTab, this.is_save);
	}

  showTab(n, is_save:boolean=false) {
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    if (this.currentTab == 4) {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
      if (document.getElementById("nextBtn"))
        document.getElementById("nextBtn").style.display = "none";
    } else {
      this.formatDateInputs();
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "inline";
      if (document.getElementById("nextBtn"))
        document.getElementById("nextBtn").style.display = "inline";
    }
    if (n == x.length - 1) {
      // this.saveDependencies();
      if (document.getElementById("nextBtn")) this.nextButtonText = "save";
    } else {

      if(n==0 || n < 4){
        if (document.getElementById("nextBtn")) this.nextButtonText = "save_next";
      }

      if(n==1 && this.is_save){
        this.saveStrategyProfile();
        if(this.formErrors != null){
          x[this.currentTab].style.display = "none";
          this.currentTab = this.currentTab - n;
          x[this.currentTab].style.display = "block";
        }
        else{
          this.isNoteLoaded = true
          StrategyStore.start_date = this.strategyForm.value.start_date ;
          StrategyStore.end_date = this.strategyForm.value.end_date
          if (document.getElementById("nextBtn")) this.nextButtonText = "save_next";
        }
        
      }
    
      if(n==2 && this.is_save ){
        if(this.description){
          this.saveStrategyWhiteShhet();
        }
        this.isFocusArea = true
        this.getFocusAreas();
        if (document.getElementById("nextBtn")) this.nextButtonText = "next";
        if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
      }
      if(n==3 && this.is_save){
        this.isObjectivesLoaded = true
        this.getObjectiveList();
        if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
      }
      if(this.currentTab==4 && this.is_save || n==4 && this.is_save){
        if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
      }
      // if (document.getElementById("nextBtn")) this.nextButtonText = "Save & Next";
    }
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

  // Setting Intial Tab

  setIntialTab() {
    var x: any = document.getElementsByClassName("tab");

    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
        this._renderer2.addClass(this.formSteps.nativeElement,'small');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
        this._renderer2.removeClass(this.formSteps.nativeElement,'small');
      }
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  checkFormObject(tabNumber?:number){
    var setValid = true;
    if(!tabNumber){
      if(this.formObject.hasOwnProperty(this.currentTab)){
        for(let i of this.formObject[this.currentTab]){
          if(!this.strategyForm.controls[i]?.valid){
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
            if(!this.strategyForm.controls[k]?.valid){
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

 
  calculateWeightage(){
    let sum = 0;
    for(let i of StrategyStore.focusAreas){
      sum = sum+parseInt(i.weightage);
    }
    return sum;
  }
  percentage(){
    let per = 0;
    
    for(let i of StrategyStore.focusAreas){
      per = per+parseInt(i.weightage)/100  
    }
    return per
  }

  focusAreas(focusAreaList){
    let data = focusAreaList
    if(focusAreaList.length > 1){
      data = data.sort((a,b)=>{return b.weightage - a.weightage  })
    }
    return data
  }

  caluculateObjectWeightage(){
    let sum = 0;
    if(StrategyStore.objectives?.length > 0){
      for(let i of StrategyStore.objectives){
        sum = sum+parseInt(i.weightage);
      }
    }
    return sum; 
  }



  openWhiteSheetModal(){
    this.whiteSheetObject.type = 'Add';
    $(this.whiteSheetModal.nativeElement).modal('show');
    // this._renderer2.addClass(this.whiteSheetModal.nativeElement,'show');
    this._renderer2.setStyle(this.whiteSheetModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.whiteSheetModal.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.noteModal.nativeElement,'overflow','auto');
  }

  closeWhiteSheetModal(){
    this.whiteSheetObject.type = null;
    // $(this.whiteSheetModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.whiteSheetModal.nativeElement,'show');
    this._renderer2.setStyle(this.whiteSheetModal.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  openNoteModal(){
    this.noteObject.type = 'Add';
    this.openNoteModalPopup()

  }

  openNoteModalPopup(){
    setTimeout(() => {
      $(this.noteModal.nativeElement).modal('show');
    }, 100);
    
    // this._renderer2.addClass(this.noteModal.nativeElement,'show');
    this._renderer2.setStyle(this.noteModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.noteModal.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.noteModal.nativeElement,'overflow','auto');
  }

  closeNoteModal(){
    this.noteObject.type = null;
    this.selectedNoteTab = 0;
    setTimeout(() => {
      $(this.noteModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.noteModal.nativeElement, 'show');
      this._renderer2.setStyle(this.noteModal.nativeElement, 'display', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
    
  }

  openFocusAreaModal(){
    this.focusAreaObject.type = 'Add';
    this.focusAreaObject.department = this._helperService.createParameterFromArray(this.strategyForm.get('department_ids').value)
    this.openFocusAreaModalPopup();
  }
  openFocusAreaModalPopup(){
    StrategyStore.totalFocusAreaWeightage = this.calculateWeightage()
    setTimeout(() => {
      $(this.focusAreaModal.nativeElement).modal('show');
    }, 100);
    
    // this._renderer2.addClass(this.focusAreaModal.nativeElement,'show');
    this._renderer2.setStyle(this.focusAreaModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.focusAreaModal.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.noteModal.nativeElement,'overflow','auto');
  }

  closeFocusAreaModal(){
    this.focusAreaObject.type = null;
    this.focusAreaObject.department= [];
    setTimeout(() => {
      $(this.focusAreaModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.focusAreaModal.nativeElement,'show');
    this._renderer2.setStyle(this.focusAreaModal.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    }, 200);
    
  }

  openStrategyModal(){
  this.strategyModalObject.type = 'Add';
  this.focusAreaObject.department = this._helperService.createParameterFromArray(this.strategyForm.get('department_ids').value)
  StrategyStore.remainingWeightage = 100 - this.caluculateObjectWeightage();

  this.openStrategyPopup()
  this._utilityService.detectChanges(this._cdr);

  }

  openStrategyPopup(){
    setTimeout(() => {
       $(this.strategyAreaModal.nativeElement).modal('show');
    }, 100);
    
    // this._renderer2.addClass(this.strategyAreaModal.nativeElement,'show');
    this._renderer2.setStyle(this.strategyAreaModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.strategyAreaModal.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.noteModal.nativeElement,'overflow','auto');
  }

  closeStrategyModal(){
    this.strategyModalObject.type = null;
    this.focusAreaObject.department = []

    setTimeout(() => {
      $(this.strategyAreaModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.strategyAreaModal.nativeElement,'show');
    this._renderer2.setStyle(this.strategyAreaModal.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    }, 200);
    
  }

openStrategyKpiModal(objective,ind?,){
  //  StrategyStore.setFocusAreaId(focusAreaId);
    StrategyStore.setObjectiveId(objective.id)
    StrategyStore.setObjectiveStartDate(objective.start_date);
    StrategyStore.setObjectiveEndDate(objective.end_date);
    this.strategyKpiObject.type = 'Add';
    this.openStrategyKpi()
}
  openStrategyKpi(){ 
    // if(ind) StrategyDemoStore.seletectedKpi = ind;
    setTimeout(() => {
      $(this.strategyKpiModal.nativeElement).modal('show');
    }, 100);
    
    // this._renderer2.addClass(this.strategyKpiModal.nativeElement,'show');
    this._renderer2.setStyle(this.strategyKpiModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.strategyKpiModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.strategyKpiModal.nativeElement,'z-index',99999);
  }

  closeStrategyKpiModal(){
    this.strategyKpiObject.type = null;

    setTimeout(() => {
      $(this.strategyKpiModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.strategyKpiModal.nativeElement,'show');
    this._renderer2.setStyle(this.strategyKpiModal.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    }, 200);
    
  }

  openStrategyKpiDetailsModal(id){
   if(id){
     this._strategyService.induvalKpi(id).subscribe(res=>{
      this.kpiDetailsObject.value = res;
      this.openStrategyKpiDetails()
     })
   }
  }

  openStrategyKpiDetails(){
    this.kpiDetailsObject.type = 'Add';
    $(this.strategyKpiDetailsModal.nativeElement).modal('show');
    // this._renderer2.addClass(this.strategyKpiDetailsModal.nativeElement,'show');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.noteModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement,'z-index',99999);
    this._utilityService.detectChanges(this._cdr);
    // $(this.strategyKpiDetailsModal.nativeElement).modal('show');
  }

  closeStrategyKpiDetailsModal(){
    this.kpiDetailsObject.type = null;
    this._renderer2.removeClass(this.strategyKpiDetailsModal.nativeElement,'show');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  descriptionChange(event){
    this.description = event.editor.getData()
    this._utilityService.detectChanges(this._cdr);
  }

  getStrategyNotes(){
    this._strategyService.strategyProfileNotsList().subscribe(res=>{
      let id 
      this.isNoteLoaded = false
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getNoteDetails(id){
    this._strategyService.getInduvalNote(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeStep(step){

    if(step > this.currentTab && this.checkFormObject(step)){
      let dif = step - this.currentTab;
      this.nextPrev(dif)
      this.changetab(step)
    }
    else if(step < this.currentTab){
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
      this.changetab(step)
    }  
  }

  changetab(step){
    if(step == 1){
      this.getStrategyNotes()
    }else if(step == 2){
      this.getFocusAreas()
    }else if(step == 3){
      this.getFocusAreas();
      this.getObjectiveList();
    }
  }

  editNotes(id){
    let notes 
    let noteArray = []
    this.noteObject.id = id
    this._strategyService.getInduvalNote(id).subscribe(res=>{
      notes = res;
      for (let i = 0; i < notes.category.length; i++) {
        notes.category[i].issue.forEach((element, index) => {
          element['issue_categories'] = notes.category[i].type;
          element['categoryId'] = notes.category[i].id;
        });
          for (let k = 0; k < notes.category[i].issue.length; k++) {
            if(notes.category[i].is_pestel == 1 || notes.category[i].is_swot == 1){
              noteArray.push(notes.category[i].issue[k])
            }
          }
        
      }
      this.noteObject.value = {
        title : notes.title,
        organization_issue_ids : noteArray
        
      }
      this.noteObject.type = 'edit'
      this.openNoteModalPopup();
      this._utilityService.detectChanges(this._cdr);

    })  }

    getFocusAreas(){
      this._strategyService.focusAreaList(true).subscribe(res=>{
        if(res.data.length > 0){
          StrategyStore.setFocusAreaId(res.data[0].id)
          this.selectedFocusAreaId = res.data[0].id
          this.strategyForm.patchValue({
            focus_areas : res.data[0]
          })
        }
        this.isFocusArea = false
      this._utilityService.detectChanges(this._cdr);
      })
    }


    editfocusArea(res){
      if(res){
        let areas  
        this._strategyService.induvalFocusArea(res.id).subscribe(res=>{
          areas = res;
          this.focusAreaObject.value = areas;
          this.focusAreaObject.department = this._helperService.createParameterFromArray(this.strategyForm.get('department_ids').value)
          this.focusAreaObject.type = "Edit"
          this.openFocusAreaModalPopup(); 
          this._utilityService.detectChanges(this._cdr);
        })
       
      }
    }

    getObjectives(id){
      this._strategyService.objectivesList(id,true).subscribe(res=>{
        this.isObjectivesLoaded = false;
        this.getKpiList()
        this._utilityService.detectChanges(this._cdr);
      })
    }

    editObjective(object){
      if(object){
        let obj
        StrategyStore.setObjectiveId(object.id)
        this._strategyService.induvalObjectives(object.id,this.selectedFocusAreaId).subscribe(res=>{
          obj = 
          this.strategyModalObject.value = res;
          this.strategyModalObject.type = "Edit";
          this.focusAreaObject.department = this._helperService.createParameterFromArray(this.strategyForm.get('department_ids').value)
          this.openStrategyPopup()
          this._utilityService.detectChanges(this._cdr);
        })
      }
    }

    selectedIndexChange(index,id){
      this.swot_availability = false
      this.pestel_availabale = false
      StrategyStore.setNoteId(id)
      if(this.selectedIndex == index){
        this.selectedIndex = null;
      } else{
        this.selectedIndex = index;
        this._utilityService.detectChanges(this._cdr);
      }
        this._strategyService.getInduvalNote(id).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
          if(res&&res.category.length!=0){
            StrategyStore.noteDetails.category.forEach(element => {
              if(element.is_swot&&element.is_swot==1){
                this.swot_availability = true;
              }
              if(element.is_pestel&&element.is_pestel==1){
                this.pestel_availabale = true
              }
            });
            this._utilityService.detectChanges(this._cdr);
          }
          this._utilityService.detectChanges(this._cdr);
        })
    }

    selectObjectiveIndexChange(index,id){
      StrategyStore.induvalObjectivesLoaded = false;
      StrategyStore.setObjectiveId(id)
      StrategyStore.setFocusAreaId(this.selectedFocusAreaId)
      if(this.selectedObjectiveIndex == index){
        this.selectedObjectiveIndex = null;
      }else{
        this.selectedObjectiveIndex = index
      }
      this.getObjectiveDetails(id)
      // this._strategyService.induvalObjectives(id,this.selectedFocusAreaId).subscribe(res=>{this._utilityService.detectChanges(this._cdr)})
      this.getKpiList();
    }

    selectObjectiveIndexChangeDetails(index,id){
      StrategyStore.setObjectiveId(id)
      // StrategyStore.setFocusAreaId(this.selectedFocusAreaId)
      if(this.selectedObjectiveIndexDetails == index){
        this.selectedObjectiveIndexDetails = null;
      }else{
        this.selectedObjectiveIndexDetails = index
      }
      this.getObjectiveDetails(id)
      // this._strategyService.induvalObjectives(id,this.selectedFocusAreaId).subscribe(res=>{this._utilityService.detectChanges(this._cdr)})
      this.getKpiList();
    }

    deleteProfileNotes(id){//delete
      this.deleteObjects.id = id;
      this.deleteObjects.title = 'notes';
      this.deleteObjects.type = '';
      this.deleteObjects.subtitle = "common_delete_subtitle"
     setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250);
    }

    deleteProfilFocusArea(id){//delete
      this.deleteObjects.id = id;
      this.deleteObjects.title = 'focusarea';
      this.deleteObjects.type = '';
      this.deleteObjects.subtitle = "sm_focusarea_delete_confirm_msg"
     setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250);
    }

    deleteProfileObjectives(id){//delete
      this.deleteObjects.id = id;
      this.deleteObjects.title = 'objective';
      this.deleteObjects.type = '';
      this.deleteObjects.subtitle = "sm_objective_delete_confirm_msg"
     setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250);
    }

    deleteProfileKpi(id){//delete
      this.deleteObjects.id = id;
      this.deleteObjects.title = 'kpi';
      this.deleteObjects.type = '';
      this.deleteObjects.subtitle = "common_delete_subtitle"
     setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250);
    }

    cancelClicked(){
      if(this.currentTab == 4){
        if(StrategyStore.lastPage == 'profile')
        this._router.navigateByUrl('/strategy-management/strategy-profiles')
        else if(StrategyStore.lastPage == 'details')
        this._router.navigateByUrl('strategy-management/strategy-profiles/' + StrategyStore._strategyProfileId);
      }
      else{
        this.deleteObjects.title = 'Cancel?';
      this.deleteObjects.type = 'Cancel';
      this.deleteObjects.subtitle = 'This action cannot be undone'
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('show');
      }, 100);
      this._utilityService.detectChanges(this._cdr);
      }
    }

    delete(status) {//delete
      let deleteId = [];
      let deleteData;
  
      if (status) {  
        switch(this.deleteObjects.title){
          case 'notes':
              if(this.deleteObjects.id)
                deleteData = this._strategyService.deleteNotes(this.deleteObjects.id);
            break;
          case 'focusarea':
            if(this.deleteObjects.id)
                deleteData = this._strategyService.deleteFocusArea(this.deleteObjects.id);
            break;
          case 'objective':
            if(this.deleteObjects.id)
              deleteData = this._strategyService.deleteObjective(this.deleteObjects.id);
            break;
            case 'kpi':
              if(this.deleteObjects.id)
              deleteData = this._strategyService.deleteKpi(this.deleteObjects.id);
            break;

            case 'Cancel?':
              setTimeout(() => {
                $(this.confirmationPopUp.nativeElement).modal('hide');
              }, 250);
                 this._router.navigateByUrl('/strategy-management/strategy-profiles')
            break;
        }
        if(this.deleteObjects.id){
          deleteData.subscribe(resp => {
            this.clearDeleteObject();
            if(this.deleteObjects.title == 'notes' || this.deleteObjects.title == 'closeNotes'){
              this.getStrategyNotes();

  
            }else if(this.deleteObjects.title == 'focusarea'|| this.deleteObjects.title == 'closeFocusarea'){
              this.getFocusAreas()
            }else if(this.deleteObjects.title == 'objective'|| this.deleteObjects.title == 'closeObjective'){
              // this.getObjectives(this.selectedFocusAreaId)
              this.getObjectiveList();
            }else if(this.deleteObjects.title == 'kpi'|| this.deleteObjects.title == 'closeKPI'){
              this.getKpiList()
            }
              this._utilityService.detectChanges(this._cdr);
            this.clearDeleteObject();
            
          });
          setTimeout(() => {
            $(this.confirmationPopUp.nativeElement).modal('hide');
          }, 100);
        }
       else{
        this.clearDeleteObject();
        setTimeout(() => {
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 100);
       }
       
      }
      else {
        this.clearDeleteObject();
        setTimeout(() => {
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 100);
      }

    
    }

    clearDeleteObject() {//delete
      this.deleteObjects.id = null;
    }

    getKpiList(){
      this._strategyService.getAllKpis(true).subscribe(res=>{this._utilityService.detectChanges(this._cdr);})
    }

    editKpi(objective,id){
      if(id){
        StrategyStore.setObjectiveStartDate(objective.start_date);
        StrategyStore.setObjectiveEndDate(objective.end_date);
        let areas  
        this._strategyService.induvalKpi(id).subscribe(res=>{
          areas = res;
          this.strategyKpiObject.value = areas;
          this.strategyKpiObject.type = "Edit"
          this.openStrategyKpi(); 
          this._utilityService.detectChanges(this._cdr);
        })
       
      }
    }

    getDescriptionLength() {
      var regex = /(<([^>]+)>)/gi;
      var result = this.description.replace(regex, "");
      return result.length;
    }

      // formating date

  formatDateInputs() {
    this.startDate = null;
    this.endDate = null;
    // converting start date
    if (this.strategyForm.value.start_date) {
      let tempstartdate = this.strategyForm.value.start_date;

      this.startDate = this._helperService.processDate(tempstartdate, 'join');

    }

    // converting end date
    if (this.strategyForm.value.end_date) {
      let tempenddate = this.strategyForm.value.end_date;

      this.endDate = this._helperService.processDate(tempenddate, 'join')

    }

  }

  getWeightageValid(){
    // let isWeightageValid 
    // if(this.currentTab == 2 && this.calculateWeightage() != 100){
    //   isWeightageValid = false
    // }else{
    //   isWeightageValid = true
    // }
    // return isWeightageValid;
    let isWeightageValid 
    if(OrganizationModulesStore.checkIndividualSubModule(3200,53001)){
      if(this.currentTab == 2 && this.calculateWeightage() != 100){
        isWeightageValid = false
      }else{
        isWeightageValid = true
      }
    }
    else{
      isWeightageValid = false
    }
    
    return isWeightageValid;
  }

  organisationChanges() {
    OrganizationalSettingsStore.isMultiple = true; 
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if(data){
      this.strategyForm.patchValue({
        division_ids: data.division_ids ? data.division_ids : [],
        department_ids:data.department_ids ? data.department_ids : [],
        section_ids:data.section_ids ? data.section_ids : [],
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        organization_ids: data.organization_ids ? data.organization_ids : []
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
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

      // Returns image url according to type and token
      createImageUrl(type, token) {
        if(type=='document-version' || type == 'user-profile-picture')
        return this._documentFileService.getThumbnailPreview(type, token);
         this._utilityService.detectChanges(this._cdr)
      }

   /**
     * removing document file from the selected list
     * @param token -image token
     */
    removeDocument(token) {
      StrategyStore.unsetDocumentDetails(token);
      // this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }
    // file change function
  
    onFileChange(event, type: string) {
      var selectedFiles: any[] = event.target.files;
      if (selectedFiles.length > 0) {
        var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
        // this.checkForFileUploadsScrollbar();
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
        StrategyStore.clearDocumentDetails()
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          var logo_url = reader.result;
    
          imageDetails['preview'] = logo_url;
          if (imageDetails != null)
            this._strategyService.setDocumentDetails(imageDetails, type);
          // this.checkForFileUploadsScrollbar();
          this._utilityService.detectChanges(this._cdr);
        }, false);
    
        if (image) {
          reader.readAsDataURL(image);
        }
      }
  

    checkAcceptFileTypes(type){
      return this._imageService.getAcceptFileTypes(type); 
    }
  


    createImagePreview(type, token) {
      return this._imageService.getThumbnailPreview(type, token)
    }
  
    // Returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }

    getStringsFormatted(stringArray,characterLength,seperator){
      return this._helperService.getFormattedName(stringArray,characterLength,seperator);
    }

  enableScrollbar(){
    if(fileUploadPopupStore.displayFiles.length >= 3 ){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  getUsers() {
    let params = '?department_ids=' +this._helperService.createParameterFromArray(this.strategyForm.get('department_ids').value)
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUsers(e) {   
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  searchTheme(e,patchValue:boolean=false){
    this._strategicThemeService.getItems(false,'&q=' + e.term).subscribe(
      (res: StrategyThemesPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let theme = this.strategyForm.value.theme_ids ? this.strategyForm.value.theme_ids : [];
						theme.push(i);
            this.strategyForm.patchValue({ theme_ids: theme });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getTheme(){
    this._strategicThemeService.getItems().subscribe(res =>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  strategyThemeAdd(){
    this.openThemeModal = true;
    this.strategicThemesObject.type = 'Add';
    // this._renderer2.addClass(this.addStrategyTheme.nativeElement,'show');
    // this._renderer2.setStyle(this.addStrategyTheme.nativeElement,'z-index','99999');
    // this._renderer2.setStyle(this.addStrategyTheme.nativeElement,'display','block');

    setTimeout(() => {
      $(this.addStrategyTheme.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.addStrategyTheme.nativeElement,'display','block');
    this._renderer2.setStyle(this.addStrategyTheme.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.addStrategyTheme.nativeElement,'overflow','auto');
    this._utilityService.detectChanges(this._cdr);
  }

  closeStrategyThemeModal(){
    this.openThemeModal = false;
    // this._renderer2.removeClass(this.addStrategyTheme.nativeElement,'show');
    // this._renderer2.setStyle(this.addStrategyTheme.nativeElement,'z-index','9999');
    // this._renderer2.setStyle(this.addStrategyTheme.nativeElement,'display','none');
    setTimeout(() => {
      $(this.addStrategyTheme.nativeElement).modal('hide');
    this._renderer2.removeClass(this.addStrategyTheme.nativeElement,'show');
    this._renderer2.setStyle(this.addStrategyTheme.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    }, 200);

    if (StrategicThemesMasterStore.lastInsertedId) {
      this.searchTheme({term: StrategicThemesMasterStore.lastInsertedId},true);
    }
    StrategicThemesMasterStore.lastInsertedId = null;
  }

  reviewFrequencyPopupOpen(id){
    this.openReviewFrequencyPopup = true;
    this.reviewFrequencyObject.id = id;
    this._renderer2.addClass(this.addReviewFrequency.nativeElement,'show');
    this._renderer2.setStyle(this.addReviewFrequency.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.addReviewFrequency.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeReviewFrequencyPopup(){
    this.openReviewFrequencyPopup = false;
    this._renderer2.removeClass(this.addReviewFrequency.nativeElement,'show');
    this._renderer2.setStyle(this.addReviewFrequency.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.addReviewFrequency.nativeElement,'display','none');
  }

  setDefaultProfile(event) {
    this.strategyForm.patchValue({
      is_default: event.target.checked
    })
  }

  getObjectiveList(){
    this._strategyService.getObjectiveList('?strategy_profile_ids='+StrategyStore.strategyProfileId).subscribe(res=>{
      this.isObjectivesLoaded = false;
      if(res.data?.length > 0) this.selectObjectiveIndexChange(0, res.data[0].id)
      this._utilityService.detectChanges(this._cdr);
    })
  }
  
  getObjectiveDetails(id){
    StrategyStore.setObjectiveId(id)
    this._strategyService.induvalObjectives(id, null).subscribe(res => { this._utilityService.detectChanges(this._cdr) })
    this.getKpiList();
  }

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.focusAreaModalEventSubscription.unsubscribe();
    this.strategyKpiModalEventSubscription.unsubscribe();
    this.notesModalEventSubscription.unsubscribe();
    this.strategyObjectiveModalEventSubscription.unsubscribe();
    this.confirmationEventSubscription.unsubscribe();
    this.strategyKpiDetailsModalEventSubscription.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
    StrategyStore._strategyProfileId = null;
    StrategyStore._noteId = null;
    StrategyStore._focusAreaId = null;
    StrategyStore._objectiveId = null;
    StrategyStore.currentTab = '';
    this.swot_availability = false
    this.pestel_availabale = false
    this.isNoteLoaded = false;
    this.isFocusArea = false
    this.isObjectivesLoaded = false
    StrategyStore.notesLoaded = false;
    StrategyStore.focusAreaLoaded = false;
    StrategyStore.objectivesLoaded = false;
    this.description = ''
    OrganizationalSettingsStore.isMultiple = true;




  }

}
