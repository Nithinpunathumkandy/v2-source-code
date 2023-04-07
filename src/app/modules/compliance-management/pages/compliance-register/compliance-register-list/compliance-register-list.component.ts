import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ComplianceRegisterService } from 'src/app/core/services/compliance-management/compliance-register/compliance-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ComplianceDashboardStore } from 'src/app/stores/compliance-management/compliance-dashboard/compliance-dashboard-store';


declare var $: any;

@Component({
  selector: 'app-compliance-register-list',
  templateUrl: './compliance-register-list.component.html',
  styleUrls: ['./compliance-register-list.component.scss']
})
export class ComplianceRegisterListComponent implements OnInit ,OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  reactionDisposer: IReactionDisposer;

  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ComplianceRegisterStore = ComplianceRegisterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  mailConfirmationData = 'share_compliance_register_message';

  complianceRegisterObject = {
    type:null,
    values: null,
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  modalEventSubscription:any;
  focusComplianceRegisterEvent:any
  popupControlEventSubscription:any;
  filterSubscription: Subscription = null;

  constructor(private _imageService:ImageServiceService,
              private _helperService:HelperServiceService,
              private _complianceRegisterService:ComplianceRegisterService,
              private _cdr:ChangeDetectorRef,
              private _utilityService:UtilityService,
              private _eventEmitterService:EventEmitterService,
              private _router:Router,
              private _rightSidebarFilterService: RightSidebarFilterService,
              private _renderer2:Renderer2) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ComplianceRegisterStore.loaded = false;
      this.pageChange(1);
    })
    
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_compliance_register_item'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'refresh'}},
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: 'CREATE_COMPLIANCE_REGISTER', submenuItem: {type: 'new_modal'}},
        // {activityName: 'COMPLIANCE_REGISTER_TEMPLATE', submenuItem: {type: 'template'}},
        // {activityName: 'IMPORT_COMPLIANCE_REGISTER', submenuItem: {type: 'import'}},
        {activityName: 'EXPORT_COMPLIANCE_REGISTER', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_COMPLIANCE_REGISTER', submenuItem: {type: 'share'}},

      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_COMPLIANCE_REGISTER')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);

    if (SubMenuItemStore.clikedSubMenuItem) {

      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case 'refresh':
          ComplianceRegisterStore.unsetComplianceRegisterList();
          this.pageChange(1); 
          break
        case "new_modal":
         
          ComplianceRegisterStore.clearDocumentDetails();// clear document details
            this.addComplianceRegisterItem();
          break;
        case "template":
          this._complianceRegisterService.generateTemplate();
          break;
        case "export_to_excel":
          this._complianceRegisterService.exportToExcel();
          break;
        case "search":
          ComplianceRegisterStore.searchText = SubMenuItemStore.searchText;
          this.pageChange(1);
          break;
        case "share":
            ShareItemStore.setTitle('share_compliance_register');
            ShareItemStore.formErrors = {};
            break;
        case "import":
            ImportItemStore.setTitle('import_compliance_register');
            ImportItemStore.setImportFlag(true);
            break;
        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    }

    if(NoDataItemStore.clikedNoDataItem){
      this.addComplianceRegisterItem();
     NoDataItemStore.unSetClickedNoDataItem();
   }
   if(ShareItemStore.shareData){
    this._complianceRegisterService.shareData(ShareItemStore.shareData).subscribe(res=>{
        ShareItemStore.unsetShareData();
        ShareItemStore.setTitle('');
        ShareItemStore.unsetData();
        $('.modal-backdrop').remove();
        document.body.classList.remove('modal-open');
        setTimeout(() => {
          $(this.mailConfirmationPopup.nativeElement).modal('show');              
        }, 200);
    },(error)=>{
      if(error.status == 422){
        ShareItemStore.processFormErrors(error.error.errors);
      }
      ShareItemStore.unsetShareData();
      this._utilityService.detectChanges(this._cdr);
      $('.modal-backdrop').remove();
    });
  }
  if(ImportItemStore.importClicked){
    ImportItemStore.importClicked = false;
    this._complianceRegisterService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
      ImportItemStore.unsetFileDetails();
      ImportItemStore.setTitle('');
      ImportItemStore.setImportFlag(false);
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    },(error)=>{
      if(error.status == 422){
        ImportItemStore.processFormErrors(error.error.errors);
      }
      else if(error.status == 500 || error.status == 403){
        ImportItemStore.unsetFileDetails();
        ImportItemStore.setImportFlag(false);
        $('.modal-backdrop').remove();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }
  })
  this.modalEventSubscription = this._eventEmitterService.addComplianceRegister.subscribe(res => {
    this.closeFormModal();
  });

  this.focusComplianceRegisterEvent = this._eventEmitterService.complianceRegisterFocusControl.subscribe(res => {
    this.ModalComplianceRegisterFocusFix();
  })

  this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.modalControl(item);
  })

  setTimeout(() => {
    this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
    window.addEventListener('scroll',this.scrollEvent,true);
  }, 1000);

  RightSidebarLayoutStore.filterPageTag = 'compliance_register';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'document_compliance_document_type_ids',
      'document_compliance_area_ids',
      'document_compliance_section_ids',
      'compliance_status_ids',
      // 'region_ids',
      // 'country_ids'
    ]);


    // setting submenu items
    this.pageChange()

  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  pageChange(newPage: number = null) {
    if (newPage) ComplianceRegisterStore.setCurrentPage(newPage);
    var additionalParams=''
      if (ComplianceDashboardStore.dashboardParameter) {
        additionalParams = ComplianceDashboardStore.dashboardParameter
      }
      this._complianceRegisterService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  ModalComplianceRegisterFocusFix() {
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
    // Returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }

    addComplianceRegisterItem(){
      this.complianceRegisterObject.type = 'Add';
      this.complianceRegisterObject.values=null;
      this.ComplianceRegisterStore.clearDocumentDetails();
       this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
      }

      // for opening modal
  openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.complianceRegisterObject.type = null;
    this.pageChange();
  } 
  
  gotoComplianceRegisterDetails(id){

    ComplianceRegisterStore.unsetComplianceRegisterDetails();
    if (AuthStore.getActivityPermission(100, 'COMPLIANCE_REGISTER_DETAILS')) {
    this._router.navigateByUrl('/compliance-management/compliance-registers/'+id);
    }
  }

  sortTitle(type: string) {
    this._complianceRegisterService.sortComplianceRegisterList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

    // for delete
    delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'compliance_reg_delete_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }
  
      // for popup object clearing
      clearPopupObject() {
        this.popupObject.id = null;
      }
  
     // modal control event
     modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case 'are_you_sure': this.deleteComplianceRegister(status)
          break;
      }
  
    }
  
    // delete function call
    deleteComplianceRegister(status: boolean) {
      if (status && this.popupObject.id) {
        this._complianceRegisterService.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.clearPopupObject();
          this.pageChange(1);
        });
      }
      else {
        this.clearPopupObject();
      }
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
      this.pageChange();
    }


   //edit start
   editComplianceRegister(id) {
    event.stopPropagation();

    this._complianceRegisterService.getEditItem(id).subscribe(res => {
      this.ComplianceRegisterStore.clearDocumentDetails();
      let ActionDetails = res;
      if(res){
        this.complianceRegisterObject.values = {
          id: ActionDetails.id,
          title: ActionDetails.title,
          compliance_area_ids: ActionDetails.compliance_areas,
          compliance_section_ids: ActionDetails.compliance_sections,
          compliance_document_type_ids: ActionDetails.compliance_document_types,
          compliance_frequency_id: ActionDetails.compliance_frequency,
          comment: ActionDetails.comment,
          compliance_source: ActionDetails.compliance_source,
          responsible_user_ids: ActionDetails.compliance_responsible_users,
          description: ActionDetails.description,
          organizations: ActionDetails.organizations,
          divisions: ActionDetails.divisions,
          departments: ActionDetails.departments,
          sections: ActionDetails.sections,
          sub_sections: ActionDetails.sub_sections,
          issue_date: ActionDetails.versions[0].issue_date,
          expiry_date: ActionDetails.versions[0].expiry_date,
          sa1:ActionDetails.sa1,
          sa2: ActionDetails.sa2,
          branches: ActionDetails.branches,
          review_user: ActionDetails.review_user
        }
        if(ActionDetails.versions.length > 0){
          for(let brochures of ActionDetails.versions){
            if(brochures.token){
              let brochurePreviewUrl = this._complianceRegisterService.getThumbnailPreview('organization-brochure',brochures.token);
              let brochureDetails = {
                  name: brochures.title, 
                  ext: brochures.ext,
                  size: brochures.size,
                  url: brochures.url,
                  thumbnail_url: brochures.url,
                  token: brochures.token,
                  preview_url: brochurePreviewUrl,
                  id: brochures.id
              };
              this._complianceRegisterService.setDocumentDetails(brochureDetails,brochurePreviewUrl);
            }
          }
        }
        this.complianceRegisterObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }
      
    })
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    this.focusComplianceRegisterEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    ComplianceRegisterStore.searchText = null;
    SubMenuItemStore.searchText = '';
    ComplianceRegisterStore.unsetComplianceRegisterList();
    // BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }
}

