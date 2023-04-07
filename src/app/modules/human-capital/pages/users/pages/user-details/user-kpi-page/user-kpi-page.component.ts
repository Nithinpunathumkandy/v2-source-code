import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef,Renderer2, OnDestroy} from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserKpiStore } from 'src/app/stores/human-capital/users/user-kpi.store';
import { UserKpiService } from 'src/app/core/services/human-capital/user/user-kpi/user-kpi.service';
import { UserKpi } from 'src/app/core/models/human-capital/users/user-kpi';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { HttpErrorResponse} from '@angular/common/http';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { UnitService } from 'src/app/core/services/masters/human-capital/unit/unit.service';
import { KpiService } from 'src/app/core/services/masters/human-capital/kpi/kpi.service';
import { KpiMasterStore } from 'src/app/stores/masters/human-capital/kpi-master.store'
import { KpiCategoryService } from 'src/app/core/services/masters/human-capital/kpi-category/kpi-category.service';
import { KpiCategoryMasterStore } from 'src/app/stores/masters/human-capital/kpi-category-master.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { UnitMasterStore } from 'src/app/stores/masters/human-capital/unit-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;


@Component({
  selector: 'app-user-kpi-page',
  templateUrl: './user-kpi-page.component.html',
  styleUrls: ['./user-kpi-page.component.scss']
})
export class UserKpiPageComponent implements OnInit,OnDestroy {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('kpiModal') kpiModal: ElementRef;
  @ViewChild('unitModal') unitModal: ElementRef;
  @ViewChild('kpiCategoryModal') kpiCategoryModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UserKpiStore = UserKpiStore;
  UsersStore = UsersStore;
  KpiMasterStore = KpiMasterStore;
  UnitMasterStore = UnitMasterStore;
  KpiCategoryMasterStore = KpiCategoryMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadProgress = 0;
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  previewObject = {
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  }
  deleteObject = {
    id: null,
    position: null,
    type:'',
    subtitle:''
  };
  deleteEventSubscription: any;
  public currentIndex = null;
  AuthStore = AuthStore;
  kpiEventSubscription:any;
  unitEventSubscription:any;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;


  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _userKpiService: UserKpiService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _unitService: UnitService,
    private _kpiService: KpiService,
    private _kpiCategoryService: KpiCategoryService,
    private _renderer2:Renderer2,) { }

  ngOnInit() {
    NoDataItemStore.setNoDataItems({title: "kpi_nodata_title", subtitle: 'kpi_nodata_subtitle',buttonText: 'add_new_kpi'});

    this.reactionDisposer = autorun(() => {
      
      this.setSubMenu()
      
      if(!AuthStore.getActivityPermission(100,'CREATE_USER_KPI')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
     

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.form.pristine;
              this.formErrors = null;
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;
          case "template":

            var fileDetails = {
              ext: 'xlsx',
              title: 'KpiTemplate.xlsx',
              size: null
            };
            this._humanCapitalService.downloadFile('kpi-template', null, null, fileDetails.title, null, fileDetails);
            break;
          case "export_to_excel":

            var fileDetails = {
              ext: 'xlsx',
              title: 'kpis.xlsx',
              size: null
            };
            this._humanCapitalService.downloadFile('kpi-export', null, null, fileDetails.title, null, fileDetails);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewKpi();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      

    })
    this._kpiCategoryService.getItems().subscribe();
    this.getProcess();
    this.getKpi();
    this.getUnit();

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.kpiEventSubscription = this._eventEmitterService.userKpiControl.subscribe(res => {
      this.closeKpiModal();
    })

    this.unitEventSubscription = this._eventEmitterService.humanCapitalUnitControl.subscribe(res => {
      this.closeUnitModal();
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


    this.form = this._formBuilder.group({
      id: [''],
      process_id: [null, [Validators.required]],
      kpi_id: [null, [Validators.required]],
      target: ['', [Validators.required]],
      unit_id: [null, [Validators.required]],

    });

    SubMenuItemStore.setNoUserTab(true);

    this.pageChange(1);

  }

  public setSubMenu(){
    var items = [
      {activityName: 'CREATE_USER_KPI', submenuItem: {type: 'new_modal'}},
      {activityName: 'EXPORT_USER_KPI', submenuItem: {type: 'export_to_excel'}},
      {activityName: null, submenuItem: {type: 'close',path:'/human-capital/users'}}
    ]
    if(UserKpiStore.loaded && UserKpiStore.userKpiDetails.length == 0){
     items.splice(1,1)
    }
    this._helperService.checkSubMenuItemPermissions(200,items);
  }   

  pageChange(newPage: number = null) {
    if (newPage) UserKpiStore.setCurrentPage(newPage);
    this._userKpiService.getItems().subscribe(() => {

      if (UserKpiStore.loaded && UserKpiStore.userKpiDetails.length > 0) {
        this.getUserKpi(UserKpiStore.userKpiDetails[0].id, 0, true);
      }
      
      this._utilityService.detectChanges(this._cdr);

    });
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    else if($(this.kpiModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.kpiModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.kpiModal.nativeElement,'overflow','auto');
    }
    else if($(this.unitModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.unitModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.unitModal.nativeElement,'overflow','auto');
    }
    else if($(this.kpiCategoryModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.kpiCategoryModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.kpiCategoryModal.nativeElement,'overflow','auto');
    }
  }

  addNewKpi(){
    this.form.reset();
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  } 

  openFormModal() {
    this.currentIndex = null;
    this.formErrors = null;
    AppStore.disableLoading();
    
    $(this.formModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
  }

  closeFormModal() {
    UserKpiStore.clearDocumentDetails();
    this.fileUploadsArray = [];
    this.form.reset();
    this.form.markAsPristine();
    setTimeout(() => {

      $(this.formModal.nativeElement).modal('hide');
      
      this._utilityService.detectChanges(this._cdr);

    }, 300);
  }

  cancel() {
    this.closeFormModal();
    this.form.reset();
    this.form.markAsPristine();
  }

  save(close: boolean = false) {
    this.formErrors = null;
    this.form.patchValue({
      documents: UserKpiStore.kpiDetails
    })
    if (this.form.value.kpi_id) {
      let kpidata = this.form.value.kpi_id;
      this.form.value.kpi_id = kpidata.id;
    }
    let save;
    AppStore.enableLoading();
    if (this.form.value.id) {
      save = this._userKpiService.updateItem(this.form.value.id, this.form.value);
    } else {
      let saveData = {
        process_id: this.form.value.process_id ? this.form.value.process_id : '',
        kpi_id: this.form.value.kpi_id ? this.form.value.kpi_id : '',
        target: this.form.value.target ? this.form.value.target : '',
        unit_id: this.form.value.unit_id ? this.form.value.unit_id : '',
      }
      save = this._userKpiService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (!this.form.value.id){
        this.form.reset();
      }
      
      setTimeout(() => {

        if (close) {
          this.closeFormModal();

        }
      }, 300);


    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
      }
      else if (err.status == 403 || err.status == 500) {
        this.closeFormModal();
        AppStore.disableLoading();
      }
    });

  }

  getKpi() {
    this._kpiService.getKpis().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchKpi(e) {
    this._kpiService.searchKpi('&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }



  getUserKpi(id: number, index: number, initial: boolean = false) {

    UserKpiStore.unsetIndiviudalKpiDetails();
    for (let i = 0; i < UserKpiStore.userKpiDetails.length; i++) {
      if (UserKpiStore.userKpiDetails[i].is_accordion_active == false && i == index || initial) {
        this._userKpiService.getItem(id).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        })
        break;
      }
    }
    this.UserKpiStore.setKpiListAccordion(index);

  }

  delete(status) {
    if (status && this.deleteObject.id) {

      this._userKpiService.delete(this.deleteObject.id, this.deleteObject.position).subscribe(resp => {


        if (this.deleteObject.position == 0) {
          this._userKpiService.getItems(false, UserKpiStore.userKpiDetails[0].id).subscribe(res => {

            this._utilityService.detectChanges(this._cdr);
          });
        }

        this.clearDeleteObject();
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  openUnitModal() {
    this.formErrors = null;
    AppStore.disableLoading();
    $(this.unitModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.unitModal.nativeElement, 'z-index', '9999999');
  }


  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.position = null;
    this.deleteObject.type='';
    this.deleteObject.subtitle='';

  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  /**
    * Returns whether file extension is of imgage, pdf, document or etc..
    * @param ext File extension
    * @param extType Type - image,pdf,doc etc..
    */
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }



  editKpi(id, index) {

    this.form.reset();
    this.form.markAsPristine();
    this.UserKpiStore.clearDocumentDetails();
    this._userKpiService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {

        if (UserKpiStore.loaded) {

          const userKpi: UserKpi = UserKpiStore.userKpiById;


          //set form value
          if (userKpi.documents && userKpi.documents.length > 0) {
            for (let i of userKpi.documents) {
              let docurl = this._humanCapitalService.getThumbnailPreview('user-kpis', i.token);
              let docDetails = {
                created_at: i.created_at,
                created_by: i.created_by,
                updated_at: i.updated_at,
                updated_by: i.updated_by,
                name: i.title,
                ext: i.ext,
                size: i.size,
                url: i.url,
                thumbnail_url: i.url,
                token: i.token,
                preview: docurl,
                id: i.id,
                user_kpi_id: i.user_kpi_id

              };
              this._userKpiService.setDocumentDetails(docDetails, docurl, 'kpi-document');
            }

          }
          this.form.patchValue({
            user_id: UsersStore.user_id,
            id: userKpi.id,
            process_id: userKpi.process ? userKpi.process.id : null,
            // description: userKpi.description,
            kpi_id: userKpi.kpi ? userKpi.kpi : null,
            target: userKpi.target,
            unit_id: userKpi.unit ? userKpi.unit.id : null,
            // documents: ''

          });

          this.openFormModal();
          this.currentIndex = index;

        }
      }, 300);

      this._utilityService.detectChanges(this._cdr);
    });
  }

 
  
  deleteKpi(id: number, position: number) {
    this.deleteObject.id = id;
    this.deleteObject.position = position;
    this.deleteObject.type='Delete';
    this.deleteObject.subtitle='are_you_sure_delete'

    $(this.deletePopup.nativeElement).modal('show');
  }

  kpiSelected(kpiId){
    if(kpiId){
      this.form.patchValue({
        target: kpiId.target
      })
    }
    else{
      this.form.controls['target'].reset();
    }
    this._utilityService.detectChanges(this._cdr);
  }


  viewDocument(document) {
    this._humanCapitalService.getFilePreview('user-kpi', UsersStore.user_id, document.id, document.kpi_id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, document.title);
      this.openPreviewModal(resp, document);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('Error', 'Permission Denied');
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
      }
    });
  }

  downloadDocument(kpi_id, filename, doc_id, doc) {
    this._humanCapitalService.downloadFile('user-kpi-documents', UsersStore.user_id, kpi_id, filename, doc_id, doc);
  }


  /**
   * opening the preview model
   * @param filePreview -get response of file preview
   * @param itemDetails -certificate details
   */
  openPreviewModal(filePreview, itemDetails) {

    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'user-kpi-documents';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = UserKpiStore?.individualKpiDetails?.created_by;
    this.previewObject.uploaded_user['image_token']=UserKpiStore?.individualKpiDetails?.created_by?.image?.token;
    this.previewObject.created_at = UserKpiStore?.individualKpiDetails?.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);

  }

  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }

  gotoEvaluation() {
    this._router.navigateByUrl('/human-capital/users/' + UsersStore.user_id + '/performance-evaluation');
  }

  getProcess() {
    this._userKpiService.getProcess('?access_all=true&is_full_list=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchProcess(e) {
    this._userKpiService.searchProcess('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getUnit() {
    this._unitService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUnit(e) {
    this._unitService.searchItem('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openKpiModal() {
    this.formErrors = null;
    AppStore.disableLoading();

    $(this.kpiModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.kpiModal.nativeElement, 'z-index', '9999999');
  }


  closeKpiModal() {
    
    $(this.kpiModal.nativeElement).modal('hide');
    // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999999');
    if(KpiMasterStore.lastInsertedId){
      this._kpiService.searchKpi('?q=' + KpiMasterStore.lastInsertedId).subscribe(res => {
        this.form.patchValue({
          kpi_id: KpiMasterStore.lastInsertedId,
        })
        this._utilityService.detectChanges(this._cdr);
      })

    }


  }

  closeUnitModal() {

    $(this.unitModal.nativeElement).modal('hide');
    if(UnitMasterStore.lastInsertedId){
      this._unitService.searchItem('?q=' + UnitMasterStore.lastInsertedId).subscribe(res => {
        this.form.patchValue({
          unit_id: UnitMasterStore.lastInsertedId
        })
        this._utilityService.detectChanges(this._cdr);
      })

    }

  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.kpiEventSubscription.unsubscribe();
    this.unitEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
