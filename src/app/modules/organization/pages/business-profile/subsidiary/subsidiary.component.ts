import { Component, OnInit, ChangeDetectionStrategy,ViewChild,ElementRef, ChangeDetectorRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { AuthStore } from 'src/app/stores/auth.store';

import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";

import { AppStore } from 'src/app/stores/app.store';
import { Subsidiary } from 'src/app/core/models/organization/business_profile/subsidiary/subsidiary';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";

import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import * as introJs from 'intro.js/intro.js'; // importing introjs library

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-subsidiary',
  templateUrl: './subsidiary.component.html',
  styleUrls: ['./subsidiary.component.scss']
})
export class SubsidiaryComponent implements OnInit,OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  SubsidiaryStore = SubsidiaryStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  UsersStore = UsersStore;
  subscription: any;
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  emptyMessage = "no_data_found"
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: '',
    component: 'subsidiary-download-file',
    componentId: null
  }

  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  deleteObject = { 
    title: 'Delete Subsidiary?',
    subtitle: 'are_you_sure_delete',
    id: null,
    position: null,
    type: ''
  };

  introButtonSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#new_modal',
      intro: 'Add New Subsidiary',
      position: 'bottom'
    },
    {
      element: '#template',
      intro: 'Download Template',
      position: 'bottom'
    },
    {
      element: '#export_to_excel',
      intro: 'Export Subsidiary List',
      position: 'bottom'
    },
  ]

  constructor(private _utilityService: UtilityService, private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef, private _renderer2: Renderer2,
    private _formBuilder: FormBuilder, private _subsidiaryService: SubsidiaryService,
    private _imageService: ImageServiceService, private _sanitizer: DomSanitizer, 
    private _organizationFileService: OrganizationfileService, private _eventEmitterService: EventEmitterService,
    private _usersService: UsersService,private _humanCapitalService: HumanCapitalService,) { }

  ngOnInit() {

    RightSidebarLayoutStore.showFilter = false;
    SubsidiaryStore.clearSubsidiaryList();
    //Event Emitter from Subsidiary Service Subscription
    this.subscription = this._subsidiaryService.itemChange.subscribe(item=>{
      this.viewSubsidiaryDetails(item, false);
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item=>{
      switch(this.deleteObject.type){
        case '': this.delete(item);
                  break;
        case 'Activate': this.activateSubsidiary(item);
                  break;
        case 'Deactivate': this.deactivateSubsidiary(item);
                  break;
      }
      // this.delete(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res=>{
      this.showIntro();
    })

    NoDataItemStore.setNoDataItems({title: "subsidiary_nodata_title", subtitle: 'subsidiary_nodata_subtitle', buttonText: 'new_subsidiary_button'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = []
      if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
        subMenuItems = [
          {activityName: 'CREATE_SUBSIDIARY', submenuItem: {type: 'new_modal'}},
          // {activityName: 'GENERATE_SUBSIDIARY_TEMPLATE', submenuItem: {type: 'template'}},
          {activityName: 'EXPORT_SUBSIDIARY', submenuItem: {type: 'export_to_excel'}}
        ]
        this._helperService.checkSubMenuItemPermissions(100,subMenuItems);
      }
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_SUBSIDIARY')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }

      if(AuthStore.userPermissionsLoaded){
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems,this.introSteps);
      }

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewSubsidiary();
            }, 1000);
            break;
          case "template": 
              //this._subsidiaryService.generateTemplate();
              var fileDetails = {
                ext: 'xlsx',
                title: 'subsidiary_template',
                size: null
              };
              this._organizationFileService.downloadFile('subsidiary-template',null,null,fileDetails.title,fileDetails);
              break;
          case "export_to_excel": 
              //this._subsidiaryService.exportToExcel();
              var fileDetails = {
                ext: 'xlsx',
                title: 'subsidiaries',
                size: null
              };
              this._organizationFileService.downloadFile('subsidiary-export',null,null,fileDetails.title,fileDetails);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addNewSubsidiary();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    this.form = this._formBuilder.group({
      id: '',
      title: ['', [Validators.required, Validators.maxLength(500)]],
      image: '',
      description: [''],
      establish_date: null,
      employee_count: '',
      phone: [''],
      subsidiary_head_id: [null],
      email: ['',[Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      brochures: '',
      facebook: ['',[Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      twitter: ['',[Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      instagram: ['',[Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      skype: '',
      linkedin: ['',[Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      youtube: ['',[Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]]
    });

    SubMenuItemStore.setNoUserTab(true);
    // Fetching Subsidiary's
    this._subsidiaryService.getAllItems(true,'&status=all',false).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });

  }


  showIntro(){
    var intro:any = introJs();
    intro.setOptions({
      steps: this.introSteps,
      showBullets: true,
      showButtons: true,
      exitOnOverlayClick: true,
      keyboardNavigation: true,
      nextLabel: 'Next',
      prevLabel: 'Back',
      doneLabel: 'Done',
      nextToDone: true,
      hidePrev: true,
    });
    intro.start();
  }


  addNewSubsidiary(){
    this.resetFormDetails();
     this.form.patchValue({
      establish_date: this._helperService.getTodaysDateObject()
    })
    SubsidiaryStore.addOrEditFlag = false;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }


  //Open Modal to add Subsidiary
  openFormModal(){
    AppStore.disableLoading();
    $(this.formModal.nativeElement).modal('show');
  }

  /**
   * Close Form Modal and Reset Form details
   */
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    this.resetFormDetails();
    AppStore.disableLoading();
    this._utilityService.scrollToTop();
  }

  //Reset Form Object and also clear image and brochure details from store
  resetFormDetails(){
    //SubsidiaryStore.preview_url = '';
    this.SubsidiaryStore.clearBrochureDetails();
    this._subsidiaryService.setFileDetails(null,'','logo');
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.fileUploadsArray = [];
  }

  // Get Details of selected Subsidiary
  viewSubsidiaryDetails(subsidiaryId,clear = true){
    if(clear) this._subsidiaryService.setFileDetails(null,'','logo');
    SubsidiaryStore.unsetSelectedSubsidiaryDetails();
    this._subsidiaryService.getItem(subsidiaryId,true).subscribe(res=>{
      res['view_more'] = false;
      if(res.brouchures.length > 0){
        var brochureList = [];
        for(let brochures of res.brouchures){
          let brochurePreviewUrl = this._organizationFileService.getThumbnailPreview('organization-brochure',brochures.token);
          let brochureDetails = {
              name: brochures.title, 
              title: brochures.title,
              ext: brochures.ext,
              size: brochures.size,
              url: brochures.url,
              thumbnail_url: brochures.url,
              token: brochures.token,
              preview: brochurePreviewUrl,
              id: brochures.id,
              organization_id: brochures.organization_id
          };
          brochureList.push(brochureDetails);
        }
        this._subsidiaryService.setBrochureDetailsInSelectedSubsidiary(brochureList);
      }
      this._utilityService.detectChanges(this._cdr);
    });
    this._subsidiaryService.setSelected(subsidiaryId);
  }

  // Returns Image Url according to token
  createImageUrl(token){
    return this._organizationFileService.getThumbnailPreview('organization-logo',token,160,262);
  }

  // Close Form Modal to Add/Edit Subsidiary
  cancel() {
    this.closeFormModal();
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    else if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
  }

  /**
   * Delete subsidiary - Alert Prompted
   * @param subsidiaryId Id of subdidiary
   * @param position Index of subsidiary in Subsidiary List
   */
  deleteSubsidiary(subsidiaryId:number, position: number){
    this.deleteObject.id = subsidiaryId;
    this.deleteObject.position = position;
    this.deleteObject.type = '';
    this.deleteObject.title = 'Delete Subsidiary?';
    this.deleteObject.subtitle = 'are_you_sure_delete';
    $(this.deletePopup.nativeElement).modal('show');
  }

  delete(status){
    if(status && this.deleteObject.id && this.deleteObject.type == ''){
      this._subsidiaryService.deleteItem(this.deleteObject.id,this.deleteObject.position).subscribe(resp=>{
        setTimeout(() => {
          this.closeConfirmationPopUp();
        }, 500);
        this.clearDeleteObject();
      },(error=>{
        if(error.status == 405 && SubsidiaryStore.getSubsidiaryById(this.deleteObject.id).status_id == AppStore.activeStatusId){
          this.closeConfirmationPopUp();
          this.deleteObject.type = 'Deactivate';
          this.deleteObject.title = 'Deactivate Subsidiary?';
          this.deleteObject.subtitle = error.error?.message ? error.error?.message : 'are_you_sure_deactivate' ;
          setTimeout(() => {
            $(this.deletePopup.nativeElement).modal('show');
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else{
          this.closeConfirmationPopUp();
          this.clearDeleteObject();
        }
      })
      );
    }
    else{
      if(status){
        this.deactivateSubsidiary(status);
      }
      else{
        this.closeConfirmationPopUp();
        this.clearDeleteObject();
      }

    }
  }

  activateSubsidiary(status){
    if(status && this.deleteObject.id){
      this._subsidiaryService.activateItem(this.deleteObject.id, this.deleteObject.position).subscribe(resp=>{
        this.clearDeleteObject();
        setTimeout(() => {
          this.closeConfirmationPopUp();
        }, 500);
      },(error=>{
        // console.log(error);
      }));
    }
    else{
      this.closeConfirmationPopUp();
      this.clearDeleteObject();
    }
  }

  deactivateSubsidiary(status){
    if(status && this.deleteObject.id){
      this._subsidiaryService.deactivateItem(this.deleteObject.id, this.deleteObject.position).subscribe(resp=>{
        this.clearDeleteObject();
        setTimeout(() => {
          this.closeConfirmationPopUp();
        }, 500);
      },(error=>{
        // console.log(error);
      }));
    }
    else{
      this.closeConfirmationPopUp();
      this.clearDeleteObject();
    }
  }

  activate(id:number, position: number){
    this.deleteObject.id = id;
    this.deleteObject.type = 'Activate';
    this.deleteObject.title = 'Activate Subsidiary?';
    this.deleteObject.position = position;
    this.deleteObject.subtitle = 'are_you_sure_activate' ;
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 500);
  }

  deactivate(id:number, position: number){
    this.deleteObject.id = id;
    this.deleteObject.type = 'Deactivate';
    this.deleteObject.title = 'Dectivate Subsidiary?';
    this.deleteObject.position = position;
    this.deleteObject.subtitle = 'are_you_sure_deactivate' ;
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 500);
  }

  clearDeleteObject(){
    this.deleteObject.id = null;
    this.deleteObject.position = null;
  }

  closeConfirmationPopUp(){
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // Returns default image url
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  assignUserValues(user){
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
  
    userInfoObject.first_name = user?.first_name;
    userInfoObject.last_name = user?.last_name;
    userInfoObject.designation = user?.designation;
    userInfoObject.image_token = user?.image.token;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status_id
    userInfoObject.department = null;
     return userInfoObject;
  }
  }

  getDefaultImagez(type){
    return this._imageService.getDefaultImageUrl(type)
  }

  /**
   * Edit subsidiary
   * @param subsidiaryId Id of subsidiary
   */
  editSubsidiary(subsidiaryId: number){
    this.resetFormDetails();
    SubsidiaryStore.addOrEditFlag = true;
    this._subsidiaryService.getItem(subsidiaryId).subscribe(res=>{ 
      var subsidiaryDetails = res;
      //this.resetFormDetails();
      if(subsidiaryDetails.image.token){
        var logoPreviewUrl = this._organizationFileService.getThumbnailPreview('organization-logo',subsidiaryDetails.image.token);
        var logoDetails = {
                          name: subsidiaryDetails.image.title, 
                          ext: subsidiaryDetails.image.ext,
                          size: subsidiaryDetails.image.size,
                          url: subsidiaryDetails.image.url,
                          token: subsidiaryDetails.image.token,
                          preview: logoPreviewUrl,
                          thumbnail_url: subsidiaryDetails.image.url
                      };
        this._subsidiaryService.setFileDetails(logoDetails,logoPreviewUrl,'logo');
      }
      if(subsidiaryDetails.brouchures.length > 0){
        for(let brochures of subsidiaryDetails.brouchures){
          let brochurePreviewUrl = this._organizationFileService.getThumbnailPreview('organization-brochure',brochures.token);
          let brochureDetails = {
              name: brochures.title, 
              ext: brochures.ext,
              size: brochures.size,
              url: brochures.url,
              thumbnail_url: brochures.url,
              token: brochures.token,
              preview: brochurePreviewUrl,
              id: brochures.id,
              organization_id: brochures.organization_id
          };
          this._subsidiaryService.setFileDetails(brochureDetails,brochurePreviewUrl,'brochure');
        }
        this.checkForFileUploadsScrollbar();
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this.form.setValue({
          id: subsidiaryDetails.id ? subsidiaryDetails.id : '',
          title: subsidiaryDetails.title ? subsidiaryDetails.title : '',
          image:'',
          description: subsidiaryDetails.description ? subsidiaryDetails.description : '',
          establish_date: subsidiaryDetails.establish_date ? this._helperService.processDate(subsidiaryDetails.establish_date,'split') : null,
          employee_count: subsidiaryDetails.employee_count ? subsidiaryDetails.employee_count : '',
          phone: subsidiaryDetails.phone ? subsidiaryDetails.phone : '',
          email: subsidiaryDetails.email ? subsidiaryDetails.email : '',
          brochures: '',
          facebook: subsidiaryDetails.organization_sns?.facebook ? subsidiaryDetails.organization_sns.facebook : '',
          twitter: subsidiaryDetails.organization_sns?.twitter ? subsidiaryDetails.organization_sns.twitter : '',
          instagram: subsidiaryDetails.organization_sns?.instagram ? subsidiaryDetails.organization_sns.instagram : '',
          skype: subsidiaryDetails.organization_sns?.skype ? subsidiaryDetails.organization_sns.skype : '',
          linkedin: subsidiaryDetails.organization_sns?.linkedin ? subsidiaryDetails.organization_sns.linkedin : '',
          youtube: subsidiaryDetails.organization_sns?.youtube ? subsidiaryDetails.organization_sns.youtube : '',
          subsidiary_head_id: subsidiaryDetails.subsidiary_head ? subsidiaryDetails.subsidiary_head.id : null
        });
        if(subsidiaryDetails.subsidiary_head) this.searchUsers({term: subsidiaryDetails.subsidiary_head.id});
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }, 500);
      setTimeout(() => this.titleInput.nativeElement.focus(), 150);
    });
  }

  /**
   * Function to save new or update a subsidary
   * @param close parameter that checks whether to close modal automatically
   */
  save(close:boolean=false){ 
    this.formErrors = null;
    let count = 0;
    var items:Subsidiary[] = this.SubsidiaryStore.subsidiaryList;
    count = items.length;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      let tempdate = this.form.value.establish_date;
      this.form.value.establish_date = this._helperService.processDate(tempdate,'join');
      this.form.value.image = this._subsidiaryService.getFileDetails('logo');
      this.form.value.brochures = this._subsidiaryService.getBrochures();
      if (this.form.value.id) {
        save = this._subsidiaryService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._subsidiaryService.saveItem(this.form.value,count == 0 ? 0 : count+1);
      }
      save.subscribe((res: any) => {
        // console.log(this._subsidiaryService.getFileDetails('logo'));
        AppStore.disableLoading();
        if (!this.form.value.id)
          this.resetFormDetails();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if(err.status == 403 || err.status == 500){
          this.closeFormModal();
        }
        else{
          this._utilityService.showErrorMessage('error', "something_went_wrong_try_again");
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // On Component leave
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.subscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    this._subsidiaryService.makeSelectedEmpty();
    this._subsidiaryService.clearSubsidiaryList();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.introButtonSubscriptionEvent.unsubscribe();
  }

  /**
   * File selection and upload
   * @param event Selected Files - multiple files
   * @param type type of file - logo or brochure
   */
  onFileChange(event,type:string){
    var selectedFiles:any[] =  event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles,type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles,elem=>{
        const file = elem;
        if(this._imageService.validateFile(file,type)){
          const formData = new FormData();
          formData.append('file',file);
          var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
          this._imageService.uploadImageWithProgress(formData,typeParams) // Upload file to temporary storage
          .subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if(uploadEvent.loaded){
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress,file);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                if(type != 'brochure') $("#file").val('');
                else $("#myfile").val('');
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null,file,true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{ //Generate preview url using thumbnail url returns blob
                  this.createImageFromBlob(prew,temp,type); // Convert blob to base64 string
                },(error)=>{
                  if(type != 'brochure') $("#file").val('');
                  else $("#myfile").val('');
                  this.assignFileUploadProgress(null,file,true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          },(error)=>{
            if(type != 'brochure') $("#file").val('');
            else $("#myfile").val('');
            let errorMessage = "";
            if(error.error?.errors?.hasOwnProperty('file'))
              errorMessage = error.error.errors.file;
            else errorMessage = 'file_upload_failed';
            this._utilityService.showErrorMessage('failed', errorMessage);
            this.assignFileUploadProgress(null,file,true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          if(type != 'brochure') $("#file").val('');
          else $("#myfile").val('');
          this.assignFileUploadProgress(null,file,true);
        }
      });
    }
  }

  /**
   * 
   * @param progress File Upload Progress
   * @param file Selected File
   * @param success Boolean value whether file upload success 
   */
  assignFileUploadProgress(progress,file,success = false){
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress,file,success,temporaryFileUploadsArray);
  }

  // Check if logo is being uploaded
  checkLogoIsUploading(){
    return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
  }

  // Check any upload process is going on
  checkFileIsUploading(){
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files,type){
    var result = this._helperService.addItemsToFileUploadProgressArray(files,type,this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  /**
   * Convert Blob file to base64 string
   * @param image blob file 
   * @param fileDetails other details of file 
   * @param type type of file - logo of brochure
   */
  createImageFromBlob(image: Blob,fileDetails,type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      fileDetails['preview'] = logo_url;
      if(fileDetails != null){
        this._subsidiaryService.setFileDetails(fileDetails,logo_url,type);
      }
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
  }

  // Returns todays date for ngbDate Pickeer
  getTodaysDateObject(){
    return this._helperService.getTodaysDateObject();
  }

  /**
   * Returns whether file extension is of imgage, pdf, document or etc..
   * @param ext File extension
   * @param extType Type - image,pdf,doc etc..
   */
  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  getUsers() {
    this._usersService
      .getAllItems()
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  // search users
  searchUsers(e) {
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
}

  /**
   * Deletes a brochure
   * @param token Token of brochure
   */
  removeBrochure(token){
    SubsidiaryStore.unsetFileDetails('brochure',token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Download a particular brochure
   * @param downloadItem Details of item to be downloaded
   * @param subsidiaryId Subsidiary Id
   */
  downloadBrochures(downloadItem,subsidiaryId){
    event.stopPropagation();
    this._organizationFileService.downloadFile('subsidiary-download-file',subsidiaryId,downloadItem.id,downloadItem.title,downloadItem);
  }

  /**
   * Download all brochures as zip
   * @param subsidiaryId 
   */
  downloadAllBrochures(subsidiaryId){
    this._organizationFileService.downloadFile('subsidiary-download-all', subsidiaryId, null, SubsidiaryStore.selectedSubsidiaryDetails.title+'-brochures');
  }

  /**
   * View brochure
   * @param brochureItem Details of brochure
   * @param id Subsidiary Id
   */
  viewBrochureItem(brochureItem,id){
    this._organizationFileService.getFilePreview('subsidiary-preview',id,brochureItem.id).subscribe(res=>{
      var resp:any = this._utilityService.getDownLoadLink(res,brochureItem.name);
      this.openPreviewModal(resp,brochureItem,id);
    }),(error=>{
      if(error.status == 403){
        this._utilityService.showErrorMessage('error','permission_denied');
      }
      else{
        this.openPreviewModal(null,brochureItem,id);
      }
    });
  }

  // Opens brochure preview
  openPreviewModal(filePreview,fileDetails,subsidiaryId){
    var previewItem = null;
    if(filePreview)
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.preview_url = previewItem;
    this.previewObject.file_details = fileDetails;
    this.previewObject.componentId = subsidiaryId;
    this.previewObject.uploaded_user = this._subsidiaryService.getSelectedSubsidiaryDetails().updated_by ? this._subsidiaryService.getSelectedSubsidiaryDetails().updated_by : null;
    this.previewObject.created_at = this._subsidiaryService.getSelectedSubsidiaryDetails().created_at ? this._subsidiaryService.getSelectedSubsidiaryDetails().created_at : '';
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close brochure preview
  closePreviewModal(event){
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.preview_url = '';
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = '';
  }

  // Sets view more flag for subsidiary description
  viewDescription(type,subsidiary){
    if(type == 'more')
      subsidiary.view_more = true;
    else{
      subsidiary.view_more = false;
      this._utilityService.scrollToTop();
    }
    this._utilityService.detectChanges(this._cdr);
  }

  // Returns trimmed subsidiary description
  getDescriptionContent(subsidiary){
    var descriptionContent = subsidiary.description.substring(0,1500);
    return descriptionContent;
  }

  checkForFileUploadsScrollbar(){
    if(SubsidiaryStore.getBrochureDetails.length >= 5 || (this.fileUploadsArray.length > 5 && SubsidiaryStore.getBrochureDetails.length < 5) || ((this._helperService.checkFileisUploadedCount(this.fileUploadsArray) + SubsidiaryStore.getBrochureDetails.length)) >= 5){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
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

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event.key == 'Escape' || event.code == 'Escape'){
        this.cancel();
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
