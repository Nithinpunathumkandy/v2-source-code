import { Component, OnInit, ChangeDetectionStrategy,ViewChild,ElementRef, ChangeDetectorRef, Renderer2, HostListener } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';

import { OrganizationCustomersService } from "src/app/core/services/organization/business_profile/organization-customers/organization-customers.service";
import { BusinessCustomersStore } from "src/app/stores/organization/business_profile/business-customers.store";
import { HttpErrorResponse, HttpEventType, HttpEvent } from '@angular/common/http';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";

import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import * as introJs from 'intro.js/intro.js'; // importing introjs library
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  AuthStore = AuthStore;

  BusinessCustomersStore = BusinessCustomersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  logoUploaded = false;
  fileUploadProgress = 0;

  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  deleteObject = { 
    title: 'Delete Customer?',
    subtitle: 'delete_customer_subtitle',
    id: null,
    type: ''
  };

  introButtonSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#search_bar',
      intro: 'Customer Search',
      position: 'bottom'
    },
    {
      element: '#new_modal',
      intro: 'Add New Customer',
      position: 'bottom'
    },
    {
      element: '#template',
      intro: 'Download Template',
      position: 'bottom'
    },
    {
      element: '#export_to_excel',
      intro: 'Export Customer List',
      position: 'bottom'
    } 
  ]

  constructor(private _utilityService: UtilityService, private _organizationFileService: OrganizationfileService,
    private _cdr: ChangeDetectorRef, private _imageService: ImageServiceService,
    private _formBuilder: FormBuilder, private _organizationCustomerService: OrganizationCustomersService,
    private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2,
    private _helperService: HelperServiceService) { }

  ngOnInit() {

    RightSidebarLayoutStore.showFilter = false;

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item=>{
      switch(this.deleteObject.type){
        case '': this.delete(item);
                  break;
        case 'Activate': this.activateCustomer(item);
                  break;
        case 'Deactivate': this.deactivateCustomer(item);
                  break;
      }
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

    SubMenuItemStore.searchText = '';
    BusinessCustomersStore.searchText = '';

    NoDataItemStore.setNoDataItems({title: "customer_nodata_title", subtitle: 'customer_nodata_subtitle', buttonText: 'new_customer_button'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CUSTOMER_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: { type: 'refresh'}},
        {activityName: 'CREATE_CUSTOMER', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_CUSTOMER_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_CUSTOMER', submenuItem: {type: 'export_to_excel'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_CUSTOMER')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
 
      if(AuthStore.userPermissionsLoaded){
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems,this.introSteps);
      }

      this._helperService.checkSubMenuItemPermissions(300,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        // console.log(SubMenuItemStore.clikedSubMenuItem);
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.createNewCustomer();
            }, 1000);
            break;
          case "template": 
              //this._organizationCustomerService.generateTemplate();
              var fileDetails = {
                ext: 'xlsx',
                title: 'customer_template',
                size: null
              };
              this._organizationFileService.downloadFile('customers-template',null,null,fileDetails.title,fileDetails);
              break;
          case "export_to_excel": 
              //this._organizationCustomerService.exportToExcel();
              var fileDetails = {
                ext: 'xlsx',
                title: 'customers',
                size: null
              };
              this._organizationFileService.downloadFile('customers-export',null,null,fileDetails.title,fileDetails);
              break;
            case "refresh":
              BusinessCustomersStore.unsetAllData();
              this.pageChange(1);
              break;
          case "search":
            BusinessCustomersStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.createNewCustomer();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    // Create Form Object
    this.form = this._formBuilder.group({
      id:'',
      title: ['', [Validators.required, Validators.maxLength(500)]],
      image:'',
      mobile:[''],
      email:['',[Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      website:['',[Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      contact_person: '',
      contact_person_role: '',
      contact_person_number:[''],
      contact_person_email: ['',[Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      address: ['']
    });

    SubMenuItemStore.setNoUserTab(true);

    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res=>{
      this.showIntro();
    })

    this.pageChange(1);

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
  // Get Customers
  pageChange(newPage: number = null) {
    if (newPage) BusinessCustomersStore.setCurrentPage(newPage);
    this._organizationCustomerService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 250));
  }

  createNewCustomer(){
    this.resetFormDetails();
    this._organizationCustomerService.setFileDetails(null,'','logo');
    this.BusinessCustomersStore.addOrEditFlag = false;
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  // Returns Image Url by token
  createImageUrl(token){
    return this._organizationFileService.getThumbnailPreview('customer-logo',token);
  }

  // Open Modal to Add/Edit Customer
  openFormModal(){
    $(this.formModal.nativeElement).modal('show');
  }

  // Closes Modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.resetFormDetails();
  }

  // Reset Form Details
  resetFormDetails(){
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this._organizationCustomerService.setFileDetails(null,'','logo');
  }

  cancel() {
    this.closeFormModal();
  }

  // Save/ Update Customer Details
  save(close:boolean=false){ 
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      this.form.value.image = this._organizationCustomerService.getFileDetails('logo');
      AppStore.enableLoading();
      if (this.form.value.id) {
       save = this._organizationCustomerService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._organizationCustomerService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.form.value.id)
          this.resetFormDetails();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 250);
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

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BusinessCustomersStore.unsetAllData();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    BusinessCustomersStore.searchText = '';
    this.introButtonSubscriptionEvent.unsubscribe();
  }

  // Edit Customer Details
  editCustomer(customerId){
    this.BusinessCustomersStore.addOrEditFlag = true;
    this.resetFormDetails();
    this._organizationCustomerService.getItem(customerId).subscribe(res=>{
      if(res.hasOwnProperty('image_token') && res.image_token){
        var previewUrl = this._organizationFileService.getThumbnailPreview('customer-logo',res.image_token);
        var logoDetails = {
                          name: res['image_title'], 
                          ext: res['image_ext'],
                          size: res['image_size'],
                          url: res['image_url'],
                          token: res['image_token'],
                          preview: previewUrl,
                          thumbnail_url: res['image_url']
                      };
        this._organizationCustomerService.setFileDetails(logoDetails,previewUrl,'logo');
      } 
      AppStore.disableLoading();
      setTimeout(() => {
        // Assign Values to form
        this.form.setValue({
          id: res.id ? res.id : '',
          title: res.title ? res.title : '',
          image: '',
          mobile: res.mobile ? res.mobile : '',
          email: res.email ? res.email : '',
          website: res.website ? res.website : '',
          contact_person: res.contact_person ? res.contact_person : '',
          contact_person_role: res.contact_person_role ? res.contact_person_role : '',
          contact_person_number: res.contact_person_number ? res.contact_person_number : '',
          address: res.address ? res.address : '',
          contact_person_email: res.contact_person_email ? res.contact_person_email : ''
        });
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }, 500);
    })
  }

  // Delete Customer after confirmation
  deleteCustomer(customerId){
    this.deleteObject.id = customerId;
    this.deleteObject.type = '';
    this.deleteObject.title = 'Delete Customer?';
    this.deleteObject.subtitle = 'delete_customer_subtitle';
    $(this.deletePopup.nativeElement).modal('show');

  }

  delete(status){
    if(status && this.deleteObject.id && this.deleteObject.type == ''){
      this._organizationCustomerService.deleteItem(this.deleteObject.id).subscribe(resp=>{
        setTimeout(() => {
          this.closeConfirmationPopup();
        }, 200);
        this.clearDeleteObject();
      },(error=>{
        if(error.status == 405 && BusinessCustomersStore.getCustomerById(this.deleteObject.id).status_id == AppStore.activeStatusId){
          this.closeConfirmationPopup();
          this.deleteObject.type = 'Deactivate';
          this.deleteObject.title = 'Deactivate Customer?';
          this.deleteObject.subtitle = error.error?.message ? error.error?.message : 'deactivate_customer_subtitle' ;
          setTimeout(() => {
            $(this.deletePopup.nativeElement).modal('show');
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else{
          this.closeConfirmationPopup();
          this.clearDeleteObject();
        }
      }));
    }
    else{
      if(status){
        // this._organizationCustomerService.deactivateItem(this.deleteObject.id).subscribe(resp=>{
        //   setTimeout(() => {
        //     this.closeConfirmationPopup();
        //   }, 500);
        //   this.clearDeleteObject();
        // },(error=>{
        //   console.log(error);
        // }));
        this.deactivateCustomer(status)
      }
      else{
        this.closeConfirmationPopup();
        this.clearDeleteObject();
      }

    }
  }

  activateCustomer(status){
    if(status && this.deleteObject.id){
      this._organizationCustomerService.activateItem(this.deleteObject.id).subscribe(resp=>{
        this.clearDeleteObject();
        setTimeout(() => {
          this.closeConfirmationPopup();
        }, 500);
      },(error=>{
        // console.log(error);
      }));
    }
    else{
      this.closeConfirmationPopup();
      this.clearDeleteObject();
    }
  }

  deactivateCustomer(status){
    if(status && this.deleteObject.id){
      this._organizationCustomerService.deactivateItem(this.deleteObject.id).subscribe(resp=>{
        this.clearDeleteObject();
        setTimeout(() => {
          this.closeConfirmationPopup();
        }, 500);
      },(error=>{
        // console.log(error);
      }));
    }
    else{
      this.closeConfirmationPopup();
      this.clearDeleteObject();
    }
  }

  activate(id:number){
    this.deleteObject.id = id;
    this.deleteObject.type = 'Activate';
    this.deleteObject.title = 'Activate Customer?';
    this.deleteObject.subtitle = 'activate_customer_subtitle' ;
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 500);
  }

  deactivate(id:number){
    this.deleteObject.id = id;
    this.deleteObject.type = 'Deactivate';
    this.deleteObject.title = 'Dectivate Customer?';
    this.deleteObject.subtitle = 'deactivate_customer_subtitle' ;
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 500);
  }

  closeConfirmationPopup(){
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject(){
    this.deleteObject.id = null;
    // this.deleteObject.type = '';
    // this.deleteObject.title = 'Delete Customer?';
    // this.deleteObject.subtitle = 'This action cannot be undone';
  }

  onFileChange(event,type:string){
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if(this._imageService.validateFile(file,type)){
        const formData = new FormData();
        formData.append('file',file);
        if(type == 'logo') BusinessCustomersStore.logo_preview_available = true;
        var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
        this._imageService.uploadImageWithProgress(formData,typeParams)
        .subscribe((res: HttpEvent<any>) => {
          let uploadEvent: any = res;
          // console.log(uploadEvent.type);
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
                BusinessCustomersStore.logo_preview_available = false;
              }
              this.createImageFromBlob(prew,temp,type);
            },(error)=>{
              $("#file").val('');
              BusinessCustomersStore.logo_preview_available = false;
              this._utilityService.detectChanges(this._cdr);
            })
          }
        },(error)=>{
          $("#file").val('');
          BusinessCustomersStore.logo_preview_available = false;
          this.fileUploadProgress = 0;
          let errorMessage = "";
          if(error.error?.errors?.hasOwnProperty('file'))
            errorMessage = error.error.errors.file;
          else errorMessage = 'file_upload_failed';
          this._utilityService.showErrorMessage('failed', errorMessage);
          this._utilityService.detectChanges(this._cdr);
        })
      }
      else{
        $("#file").val('');
      }
    }
  }

  createImageFromBlob(image: Blob,imageDetails,type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;
      this._organizationCustomerService.setFileDetails(imageDetails,logo_url,type);
      this._utilityService.detectChanges(this._cdr);
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
  }

  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }

  getDefaultImage(){
    return this._imageService.getDefaultImageUrl('general');
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event.key == 'Escape' || event.code == 'Escape'){
        this.cancel();
    }
  }

}
