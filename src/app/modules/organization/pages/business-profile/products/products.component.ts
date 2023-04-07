import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';

import { OrganizationproductsService } from "src/app/core/services/organization/business_profile/products/organizationproducts.service";
import { BusinessProductsStore } from "src/app/stores/organization/business_profile/business-products.store";
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { DomSanitizer } from '@angular/platform-browser';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Image } from 'src/app/core/models/image.model';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";

import { ProductCategoryMasterStore } from 'src/app/stores/masters/organization/product-category-store';
import { ProductCategoryService } from 'src/app/core/services/masters/organization/product-category/product-category.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import * as introJs from 'intro.js/intro.js'; // importing introjs library

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit,OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('categoryFormModal') categoryFormModal: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  BusinessProductsStore = BusinessProductsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ProductCategoryMasterStore = ProductCategoryMasterStore;
  productSubscriptionEvent: any = null;
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  previewObject = {
    preview_url: null,
    uploaded_user: null,
    created_at: '',
    component: 'products-download-file',
    componentId: null,
    file_details: null,
 }

 deleteEventSubscription: any;
 idleTimeoutSubscription: any;
 filterSubscription: any;
 networkFailureSubscription: any;

  deleteObject = { 
    type: '',
    title: 'Delete Product?',
    subtitle: 'are_you_sure_delete',
    id: null
  };

  productCategoryObject = {
    component: 'Organization',
    values: null,
    type: null
  };

  uploadFilesResult: Image[] = [];

  introButtonSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#new_modal',
      intro: 'Add New Product',
      position: 'bottom'
    },
    {
      element: '#template',
      intro: 'Download Template',
      position: 'bottom'
    },
    {
      element: '#export_to_excel',
      intro: 'Export Product List',
      position: 'bottom'
    },
  ]

  constructor(private _utilityService: UtilityService, private _organizationFileService: OrganizationfileService,
    private _cdr: ChangeDetectorRef, private _renderer2: Renderer2,
    private _formBuilder: FormBuilder, private _orgProductsService: OrganizationproductsService,
     private _imageService: ImageServiceService, private _eventEmitterService: EventEmitterService,
     private _sanitizer: DomSanitizer, private _helperService: HelperServiceService,
     private _rightSidebarFilterService: RightSidebarFilterService, private _productCategoryService: ProductCategoryService) { }

  ngOnInit() {

    // RightSidebarLayoutStore.showFilter = true;
    setTimeout(() => {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }, 100);

    NoDataItemStore.setNoDataItems({title: "products_nodata_title", subtitle: 'product_nodata_subtitle', buttonText: 'product_new_button'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CREATE_PRODUCT', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_PRODUCT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_PRODUCT', submenuItem: {type: 'export_to_excel'}}
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_PRODUCT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
 
      if(AuthStore.userPermissionsLoaded){
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems,this.introSteps);
      }

      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        // console.log(SubMenuItemStore.clikedSubMenuItem);
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.createNewProduct();
            }, 1000);
            break;
          case "template": 
              //this._orgProductsService.generateTemplate();
              var fileDetails = {
                ext: 'xlsx',
                title: 'product_template',
                size: null
              };
              this._organizationFileService.downloadFile('products-template',null,null,fileDetails.title,fileDetails);
              break;
          case "export_to_excel": 
              this._orgProductsService.exportToExcel();
              // var fileDetails = {
              //   ext: 'xlsx',
              //   title: 'products',
              //   size: null
              // };
              // this._organizationFileService.downloadFile('products-export',null,null,fileDetails.title,fileDetails);
              break;
          case "search":
              //console.log(SubMenuItemStore.searchText);
              this.searchProduct(SubMenuItemStore.searchText);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.createNewProduct();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res=>{
      this.showIntro();
    })

    this.productSubscriptionEvent = this._eventEmitterService.productCategoryMasterControl.subscribe(res=>{
      this.closeCategoryModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item=>{
      this.delete(item);
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

    // this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
    //   this.pageChange();
    // })

    this.form = this._formBuilder.group({
      id: '',
      title: ['', [Validators.required, Validators.maxLength(500)]],
      sub_title: ['', Validators.maxLength(500)],
      product_category_id: ['', Validators.required],
      description: [''],
      image: '',
      catalogues: ''
    });

    SubMenuItemStore.setNoUserTab(true);

    // this._rightSidebarFilterService.setFiltersForCurrentPage([
    //   'product_category_id'
    // ]);

    this.pageChange();
    this.getProductCategories();

    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 300);

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



  pageChange(newPage: number = null){
    if (newPage) BusinessProductsStore.setCurrentPage(newPage);
    this._orgProductsService.getAllItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  createNewProduct(){
    this.resetFormDetails();
    AppStore.disableLoading();
    this.BusinessProductsStore.addOrEditFlag = false;
    this._orgProductsService.setImageDetails(null,'','logo');
    this.BusinessProductsStore.clearBrochureDetails();
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  searchProduct(term){
    BusinessProductsStore.setCurrentPage(1);
    this._orgProductsService.getAllItems(true,`q=${term}`).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  openFormModal(){
    $(this.formModal.nativeElement).modal('show');
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.resetFormDetails();
    this._utilityService.scrollToTop();
  }

  // Returns image url according to type and token
  createImageUrl(type,token,h?:number,w?:number){
    return this._organizationFileService.getThumbnailPreview(type,token,h,w);
  }

  cancel() {
    this.closeFormModal();
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
    if($(this.categoryFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.categoryFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.categoryFormModal.nativeElement,'overflow','auto');
    }
  }

  // Reset Form Details
  resetFormDetails(){
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.fileUploadsArray = [];
    this._orgProductsService.setImageDetails(null,'','logo');
    this.BusinessProductsStore.clearBrochureDetails();
  }

  /**
   * save or update product
   * @param close boolean value
   */
  save(close:boolean=false){ 
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      this.form.value.image = this._orgProductsService.getSelectedImageDetails('logo');
      this.form.value.catalogues = this._orgProductsService.getBrochures();
      AppStore.enableLoading();
      if (this.form.value.id) {
       save = this._orgProductsService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._orgProductsService.saveItem(this.form.value);
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
    BusinessProductsStore.unsetAllData();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.productSubscriptionEvent.unsubscribe();
    // this.filterSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.introButtonSubscriptionEvent.unsubscribe();
  }

  // Open Modal to add Product Category
  addProductCategory(){
    // BusinessProductsStore.add_category_modal = true;
    this.productCategoryObject.type = 'Add';
    // $(this.categoryFormModal.nativeElement).modal('show');
    this._renderer2.addClass(this.categoryFormModal.nativeElement,'show');
      this._renderer2.setStyle(this.categoryFormModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal to add Product Category
  closeCategoryModal(){
    // BusinessProductsStore.add_category_modal = false;
    setTimeout(() => {
      // $(this.categoryFormModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.categoryFormModal.nativeElement,'show');
      this._renderer2.setStyle(this.categoryFormModal.nativeElement,'display','none');
      this.productCategoryObject.type = null;
      if(ProductCategoryMasterStore.lastInsertedId) {
        this.form.patchValue({product_category_id:ProductCategoryMasterStore.lastInsertedId});
        this.searchProductCategory({term: ProductCategoryMasterStore.lastInsertedId})
      }
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','999999');
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  // Edit Product Details
  editProduct(productId){
    this.BusinessProductsStore.addOrEditFlag = true;
    this.resetFormDetails();
    this._orgProductsService.getItem(productId).subscribe(res=>{
      var productDetails = res;
      if(productDetails.image.token){
        var previewUrl = this._organizationFileService.getThumbnailPreview('product-image',productDetails.image.token);
        var logoDetails = {
                          name: productDetails.image.title, 
                          ext: productDetails.image.ext,
                          size: productDetails.image.size,
                          url: productDetails.image.url,
                          token: productDetails.image.token,
                          preview: previewUrl,
                          thumbnail_url: productDetails.image.url
                      };
        this._orgProductsService.setImageDetails(logoDetails,previewUrl,'logo');
      }
      if(productDetails.catelogues.length > 0){
        for(let i of productDetails.catelogues){
          let brochurePreviewUrl = this._organizationFileService.getThumbnailPreview('product-catelogue',i.token);
          let brochureDetails = {
              id: i.id,
              name: i.title, 
              ext: i.ext,
              size: i.size,
              url: i.url,
              thumbnail_url: i.url,
              token: i.token,
              preview: brochurePreviewUrl,
          };
          this._orgProductsService.setImageDetails(brochureDetails,brochurePreviewUrl,'brochure');
        }
        this.checkForFileUploadsScrollbar();
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this.form.setValue({
          id: res.id ? res.id : '',
          title: res.title ? res.title : '',
          sub_title: res.sub_title ? res.sub_title : '',
          description: res.description ? res.description : '',
          product_category_id: res.product_category ? res.product_category.id : '',
          image: '',
          catalogues: ''
        });
        this.searchProductCategory({term: res.product_category.id});
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }, 500);
    });
  }

  // Delete Product after Confirmation
  deleteProduct(productId){
    this.deleteObject.id = productId;
    $(this.deletePopup.nativeElement).modal('show');

  }

  delete(status){
    if(status && this.deleteObject.id){
      this._orgProductsService.deleteItem(this.deleteObject.id).subscribe(resp=>{
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 200);
        this.clearDeleteObject();
      });
    }
    else{
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  clearDeleteObject(){
    this.deleteObject.id = null;
  }

  // Handles File Changes
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
          this._imageService.uploadImageWithProgress(formData,typeParams)
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
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{
                    this.createImageFromBlob(prew,temp,type);
                
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
      })
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
   * @param imageDetails other details of file 
   * @param type type of file - logo of brochure
   */
  createImageFromBlob(image: Blob,imageDetails,type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if(imageDetails){
        imageDetails['preview'] = logo_url;
        this._orgProductsService.setImageDetails(imageDetails,logo_url,type);
      }
      this.checkForFileUploadsScrollbar();
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

  // Returns default image url
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  /**
   * Download catalogue
   * @param productId Product Id
   * @param catelogueItem Product Catalogue Details
   */
  downloadCatalogue(productId,catelogueItem){
    event.stopPropagation();
    this._organizationFileService.downloadFile('products-download-file',productId,catelogueItem.id,catelogueItem.title,catelogueItem);
  }

  /**
   * View Catalogue
   * @param product Product Details
   * @param catelogueItem Catalogue Details
   */
  viewCatalogue(product,catelogueItem){
    this._organizationFileService.getFilePreview('products-preview',product.id,catelogueItem.id).subscribe(res=>{
      var resp:any = this._utilityService.getDownLoadLink(res,catelogueItem.title);
      this.openPreviewModal(resp,catelogueItem,product);
    }),(error=>{
      if(error.status == 403){
          this._utilityService.showErrorMessage('error','permission_denied');
      }
      else{
          this._utilityService.showErrorMessage('error','unable_generate_preview');
      }
    });
  }

  // Download all catalogues as zip file
  downloadAllCatelogues(productId,productTitle){
    this._organizationFileService.downloadFile('products-download-all',productId, null, productTitle+'-catelogues');
  }

  /**
   * Remove particular catalogue based on token
   * @param token Token of catalogue
   */
  removeBrochure(token){
    BusinessProductsStore.unsetFileDetails('brochure',token);
    this._utilityService.detectChanges(this._cdr);
  }

  // Search Product Categoru
  searchProductCategory(e){
    this._productCategoryService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Get Product Category
  getProductCategories(){
    this._productCategoryService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDescriptionContent(p){
    var descriptionContent = p.description.substring(0,650);
    return descriptionContent;
  }

  viewDescription(type,product){
    if(type == 'more')
      product.view_more = true;
    else
      product.view_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  /**
    * Sets details of brochure in preview object and opens preview
    * @param filePreview download url of the file
    * @param cataloguedetails details of the brochure
    * @param productDetails details the the corresponding product
    */
   openPreviewModal(filePreview,cataloguedetails,productDetails){
    let previewItem = null;
    let userDetails = {
      first_name : productDetails.created_by_first_name ? productDetails.created_by_first_name  : '',
      last_name : productDetails.created_by_last_name ? productDetails.created_by_last_name : '',
      designation : productDetails.created_by_designation ? productDetails.created_by_designation : '',
    }
    if(filePreview){
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = cataloguedetails;
      this.previewObject.componentId = productDetails.id;
      this.previewObject.uploaded_user = userDetails ? userDetails : null ;
      this.previewObject.created_at = productDetails.created_at;
      $(this.filePreviewModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Closes from preview
  closePreviewModal(event){
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.preview_url = '';
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = '';
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

  checkForFileUploadsScrollbar(){
    if(BusinessProductsStore.getBrochureDetails.length >= 5 || (this.fileUploadsArray.length > 5 && BusinessProductsStore.getBrochureDetails.length < 5) || ((this._helperService.checkFileisUploadedCount(this.fileUploadsArray) + BusinessProductsStore.getBrochureDetails.length) >= 5)){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event.key == 'Escape' || event.code == 'Escape'){
      if($(this.categoryFormModal.nativeElement).hasClass('show')){
        this.closeCategoryModal();
      }
      else{
        this.cancel();
      }
    }
  }

}
