import { Component, OnInit, ChangeDetectionStrategy,ViewChild,ElementRef, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';

import { AppStore } from 'src/app/stores/app.store';

import { BranchService } from "src/app/core/services/organization/business_profile/branches/branch.service";
import { BranchesStore } from "src/app/stores/organization/business_profile/branches/branches.store";

import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";

import { Branch } from 'src/app/core/models/organization/business_profile/branches/branches';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";

import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import * as introJs from 'intro.js/intro.js'; // importing introjs library

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit,OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  UsersStore = UsersStore;

  BranchesStore = BranchesStore;
  SubsidiaryStore = SubsidiaryStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

  logoUploaded = false;
  subscription: any;
  fileUploadProgress = 0;
  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  filterSubscription: any;

  userInfoObject = []

  deleteObject = { 
    title: 'Delete Branch?',
    subtitle: 'are_you_sure_delete',
    id: null,
    position: null,
    type: ''
  };

  introButtonSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#new_modal',
      intro: 'Add New Branch',
      position: 'bottom'
    },
    {
      element: '#template',
      intro: 'Download Template',
      position: 'bottom'
    },
    {
      element: '#export_to_excel',
      intro: 'Export Branch List',
      position: 'bottom'
    },
  ]

  constructor(private _utilityService: UtilityService, private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef, private _imageService: ImageServiceService,
    private _formBuilder: FormBuilder, private _branchService: BranchService, private _subsidiaryService: SubsidiaryService,
    private _organizationFileService: OrganizationfileService, private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2, private _rightSidebarFilterService: RightSidebarFilterService,
    private _humanCapitalService: HumanCapitalService,
    private _usersService: UsersService,) { }

  ngOnInit() {
    RightSidebarLayoutStore.showFilter = true;

    // Subscribe Event Emitter from BranchService
    this.subscription = this._branchService.itemChange.subscribe(item=>{
      this.viewBranchDetails(item);
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item=>{
      switch(this.deleteObject.type){
        case '': this.delete(item);
                  break;
        case 'Activate': this.activateBranch(item);
                  break;
        case 'Deactivate': this.deactivateBranch(item);
                  break;
      }
    })

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.getBranches();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res=>{
      this.showIntro();
    })

    NoDataItemStore.setNoDataItems({title: "branch_nodata_title", subtitle: 'branch_nodata_subtitle', buttonText: 'new_branch_button'});
    
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CREATE_BRANCH', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_BRANCH_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_BRANCH', submenuItem: {type: 'export_to_excel'}}
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_BRANCH')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }

      if(AuthStore.userPermissionsLoaded){
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems,this.introSteps);
      }
 
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addBranch();
            }, 1000);
            break;
          case "template": 
              var fileDetails = {
                ext: 'xlsx',
                title: 'branch_template',
                size: null
              };
              this._organizationFileService.downloadFile('branches-template',null,null,fileDetails.title,fileDetails);
              break;
          case "export_to_excel": 
          this._branchService.exportToExcel();
              // var fileDetails = {
              //   ext: 'xlsx',
              //   title: 'branches',
              //   size: null
              // };
              // this._organizationFileService.downloadFile('branches-export',null,null,fileDetails.title,fileDetails);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addBranch();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    this.form = this._formBuilder.group({
      id: '',
      title: ['', [Validators.required, Validators.maxLength(500)]],
      description: [''],
      establish_date: null,
      branch_manager_id: null,
      employees_count: '',
      phone: ['',[Validators.pattern("^[0-9]*$")]],
      email: ['',[Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      organization_id: ['', [Validators.required]],
      image: '',
      address: ''
    });

    SubMenuItemStore.setNoUserTab(true);

    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids'
    ]);

    // Get All Branches
    this.getBranches();

    this.getSubsidiary();

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


  getBranches(){
    this._branchService.getAllItems(true,'?access_all=true&status=all').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addBranch(){
    this.resetFormDetails();
    BranchesStore.addOrEditFlag = false;
    this._branchService.setImageDetails(null,'','logo');
    this._utilityService.detectChanges(this._cdr);
    this.getSubsidiary();
    this.openFormModal();
  }

  getSubsidiary(){
    // Get Subsidarys
    this._subsidiaryService.getAllItems(false,null,true).subscribe((res:any)=>{
      if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
        this.form.patchValue({organization_id:res.data[0].id});
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchSubsidiary(e){
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
      this._subsidiaryService.searchSubsidiary(`?q=${e.term}&is_full_list=true`).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Open Modal to Add/Edit Branch
  openFormModal(){
    BranchesStore.logo_preview_available = false;
    $(this.formModal.nativeElement).modal('show');
  }

  // Close Modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.resetFormDetails();
    this._utilityService.scrollToTop();
  }

  cancel() {
    this.closeFormModal();
  }

  // Reset Form Details
  resetFormDetails(){
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this._branchService.setImageDetails(null,'','logo');
    AppStore.disableLoading();
  }

  // Get Branch Details
  viewBranchDetails(branchId){
    this._branchService.unsetSelectedBranchDetails(); // Clear previous data from store
    this._branchService.getItem(branchId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    this._branchService.setSelected(branchId);
  }

  // Returns Image Url for branch logo by token
  createImageUrl(token){
    return this._organizationFileService.getThumbnailPreview('branch-logo',token,160,262);
  }

  /**
   * Delete branch after confirmation alert
   * @param branchId Branch Id
   * @param position Position in Branches List
   */
  deleteBranch(branchId:number, position: number){
    this.deleteObject.id = branchId;
    this.deleteObject.position = position;
    this.deleteObject.type = '';
    this.deleteObject.title = 'Delete Branch?';
    this.deleteObject.subtitle = 'are_you_sure_delete';
    $(this.deletePopup.nativeElement).modal('show');
  }

  delete(status){
    if(status && this.deleteObject.id && this.deleteObject.type == ''){
      this._branchService.deleteItem(this.deleteObject.id,this.deleteObject.position).subscribe(resp=>{
        setTimeout(() => {
          this.closeConfirmationPopUp();
        }, 500);
        this.clearDeleteObject();
      },(error=>{
        if(error.status == 405 && BranchesStore.getBranchById(this.deleteObject.id).status_id == AppStore.activeStatusId){
          this.closeConfirmationPopUp();
          this.deleteObject.type = 'Deactivate';
          this.deleteObject.title = 'Deactivate Branch?';
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
      }));
    }
    else{
      if(status){
        this.deactivateBranch(status);
      }
      else{
        this.closeConfirmationPopUp();
        this.clearDeleteObject();
      }

    }
  }

  activateBranch(status){
    if(status && this.deleteObject.id){
      this._branchService.activateItem(this.deleteObject.id, this.deleteObject.position).subscribe(resp=>{
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

  deactivateBranch(status){
    if(status && this.deleteObject.id){
      this._branchService.deactivateItem(this.deleteObject.id, this.deleteObject.position).subscribe(resp=>{
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
    this.deleteObject.title = 'Activate Branch?';
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
    this.deleteObject.title = 'Dectivate Branch?';
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

  /**
   * Edit Branch Details
   * @param branchId Branch Id
   */
  editBranch(branchId: number){
    this._branchService.setImageDetails(null,'','logo');
    BranchesStore.addOrEditFlag = true;
    this._branchService.getItem(branchId).subscribe(res=>{
      var branchDetails = res;
      this.resetFormDetails();
      if(branchDetails.image.token){
        var purl = this._organizationFileService.getThumbnailPreview('branch-logo',branchDetails.image.token);
        var lDetails = {
                          name: branchDetails.image.title, 
                          ext: branchDetails.image.ext,
                          size: branchDetails.image.size,
                          url: branchDetails.image.url,
                          token: branchDetails.image.token,
                          preview: purl,
                          thumbnail_url: branchDetails.image.url
                      };
        this._branchService.setImageDetails(lDetails,purl,'logo');
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this.form.setValue({
          id: branchDetails.id ? branchDetails.id : '',
          title: branchDetails.title ? branchDetails.title : '',
          organization_id: branchDetails.organization.id ? branchDetails.organization.id : '',
          description: branchDetails.description ? branchDetails.description : '',
          establish_date: branchDetails.establish_date ? this._helperService.processDate(branchDetails.establish_date,'split') : null,
          branch_manager_id: branchDetails.branch_manager ? branchDetails.branch_manager : '',
          employees_count: branchDetails.employees_count ? branchDetails.employees_count : '',
          phone: branchDetails.phone ? branchDetails.phone : '',
          email: branchDetails.email ? branchDetails.email : '',
          image: '',
          address: branchDetails.address ? branchDetails.address : ''
        });
        this._utilityService.detectChanges(this._cdr);
        this.getSubsidiary();
        this.openFormModal();
      }, 500);
    });
  }

  createSaveData() {
    let saveData = this.form.value;
    saveData['branch_manager_id'] = this.form.value.branch_manager_id ?
    this.form.value.branch_manager_id.id : null;
    return saveData;
  }
  
  /**
   * Save or update branch
   * @param close checks whether to close modal or not
   */
  save(close:boolean=false){
    this.formErrors = null;
    let count = 0;
    var items:Branch[] = this.BranchesStore.branchDetails;
    count = items.length;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      let tempdate = this.form.value.establish_date;
      this.form.value.establish_date = this._helperService.processDate(tempdate,'join');
      this.form.value.image = this._branchService.getImageDetails('logo');
      if (this.form.value.id) {
       save = this._branchService.updateItem(this.form.value.id, this.createSaveData());
      } else {
        save = this._branchService.saveItem(this.createSaveData(),count == 0 ? 0 : count+1);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.form.value.id)
          this.resetFormDetails();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if(err.status == 403 || err.status == 500){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }


  /**
   * File selection
   * @param event Selected Files
   * @param type Type - Logo or Brochure
   */
  onFileChange(event,type:string){
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if(this._imageService.validateFile(file,type)){
        const formData = new FormData();
        formData.append('file',file);
        if(type == 'logo') BranchesStore.logo_preview_available = true;
        this._utilityService.detectChanges(this._cdr);
        var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
        this._imageService.uploadImageWithProgress(formData,typeParams)
        .subscribe((res: HttpEvent<any>) => {
          let uploadEvent: any = res;
          switch (uploadEvent.type) {
            case HttpEventType.UploadProgress:
              // Compute and show the % done;
              if(uploadEvent.loaded)
                this.fileUploadProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
              this._utilityService.detectChanges(this._cdr);
              break;
            case HttpEventType.Response:
              $("#file").val('');
              let temp: any = uploadEvent['body'];
              temp['is_new'] = true;
              this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{
                if(type == 'logo'){
                  this.logoUploaded = true;
                  BranchesStore.logo_preview_available = false;
                }
                this.createImageFromBlob(prew,temp,type);
              },(error)=>{
                $("#file").val('');
                BranchesStore.logo_preview_available = false;
                this._utilityService.detectChanges(this._cdr);
              })
          }
        },(error)=>{
          $("#file").val('');
          let errorMessage = "";
          if(error.error?.errors?.hasOwnProperty('file'))
            errorMessage = error.error.errors.file;
          else errorMessage = 'file_upload_failed';
          this._utilityService.showErrorMessage('failed', errorMessage);
          BranchesStore.logo_preview_available = false;
          this.fileUploadProgress = 0;
          this._utilityService.detectChanges(this._cdr);
        })
      }
      else{
        $("#file").val('');
      }
    }
  }

  // Create Base64 image strig from blob
  createImageFromBlob(image: Blob,imageDetails,type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if(imageDetails != null){
        imageDetails['preview'] = logo_url;
        this._branchService.setImageDetails(imageDetails,logo_url,type);
      }
      this._utilityService.detectChanges(this._cdr);
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
  }

  /**
   * @param ext File Extension
   * @param extType Type of file to check - image or doc or pdf...
   */
  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }

  // Returns default image url
  getDefaultImage(){
    return this._imageService.getDefaultImageUrl('general')
  }

  // Returns todays date as object ngbDatePicker
  getTodaysDateObject(){
    return this._helperService.getTodaysDateObject();
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  // Sets Description to view more
  viewDescription(type,branch){
    if(type == 'more')
      branch.view_more = true;
    else{
      branch.view_more = false;
      this._utilityService.scrollToTop();
    }
    this._utilityService.detectChanges(this._cdr);
  }

  // Returns trimmed description content
  getDescriptionContent(branch){
    var descriptionContent = branch.description.substring(0,1500);
    return descriptionContent;
  }

  closeConfirmationPopUp(){
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  getDefaultImagez(type){
    return this._imageService.getDefaultImageUrl(type)
  }

  getUsers() {
    let params = ''
    if(this.form.value.organization_id){
      params = '?organization_ids='+(this.form.value.organization_id ? this.form.value.organization_id : '')      
    this._usersService
      .getAllItems(params)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      UsersStore.setAllUsers([]);
    }
  }

  // search users
  searchUsers(e) {
    let params = ''
    if(this.form.value.organization_id){
      params = '?organization_ids='+(this.form.value.organization_id ? this.form.value.organization_id : '')      
      this._usersService.searchUsers(params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      UsersStore.setAllUsers([]);
    }
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

  // On Page Leave
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.subscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    this._branchService.makeSelectedEmpty();
    this._branchService.unsetSelectedBranchDetails();
    this._branchService.clearBranchList();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.introButtonSubscriptionEvent.unsubscribe();
  }

}
