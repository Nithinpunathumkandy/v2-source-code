import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import {AuditStore} from 'src/app/stores/internal-audit/audit/audit-store';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { Router } from '@angular/router';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { Subscription } from 'rxjs';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import {AuditProgramMasterStore} from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss']
})
export class AuditListComponent implements OnInit , OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('popup') popup: ElementRef;


  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuditStore = AuditStore;
  AuthStore = AuthStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupActive: boolean;
  activeIndex = null;
  informedActiveIndex = null;
  hover = false;
  filterSubscription: Subscription = null;
  popupControlAuditableEventSubscription: any;

  constructor( private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _humanCapitalService: HumanCapitalService,
    private _utilityService: UtilityService,
    private _router: Router,
    private _imageService:ImageServiceService,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _auditService: AuditService,
    private _rightSidebarFilterService: RightSidebarFilterService
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AuditStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "Looks like we don't have any items added here!", subtitle: 'Add an item if there is any. To add, simply tap the button below.', buttonText: 'New Audit'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_AUDIT', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_AUDIT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_AUDIT', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'import'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_AUDIT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.clearCommonFilePopupDocuments()
           this.gotoAddPlannedAUditPage();
            break;
          case "template":
            this._auditService.generateTemplate();
            break;
          case "export_to_excel":
            this._auditService.exportToExcel();
            break;
          case "search":
            AuditStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            AuditStore.loaded = false;
            AuditStore.searchText = null;
            this.pageChange(1);
            break;
            case "import":
              ImportItemStore.setTitle('import_audit');
              ImportItemStore.setImportFlag(true);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.gotoAddPlannedAUditPage();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._auditService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
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
   

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    // for deleting/activating/deactivating using delete modal
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // // setting submenu items
    // SubMenuItemStore.setSubMenuItems([
    //   {type:'new_modal'},
    //   { type: 'search' },
    //   { type: 'template' },
    //   { type: 'export_to_excel' ,path:'internal-audit' }

    // ]);
    RightSidebarLayoutStore.filterPageTag = 'audit';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      // 'audit_objective_ids',
      // 'audit_criteria_ids',
      'audit_plan_ids',
      'audit_program_ids',
      'audit_leader_ids'
    ]);


    this.pageChange(1);

  }

  pageChange(newPage: number = null) {
    if (newPage) AuditStore.setCurrentPage(newPage);
    this._auditService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }


  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  gotoAddPlannedAUditPage(){
    this.AuditStore.clearDocumentDetails();
    this.AuditStore.audit_id = null;
    this._router.navigateByUrl('/internal-audit/audits/add-planned-audit');
    this._utilityService.detectChanges(this._cdr);
  }

  gotoAuditDetails(id:number){
    this._router.navigateByUrl('/internal-audit/audits/'+id);
  }


   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditProgram(status)
        break;
    }

  }

  // editing

  editAudit(id:number){
    event.stopPropagation();
    AuditStore.audit_id=id
    this._auditService.getItem(id).subscribe(res=>{
      this._router.navigateByUrl('/internal-audit/audits/edit-planned-audit');
      this._utilityService.detectChanges(this._cdr)
    });
  }


  // delete function call
  deleteAuditProgram(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }
 
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Audit?';
    this.popupObject.subtitle = 'delete_audit_sub_title';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }



   // for sorting
   sortTitle(type: string) {
    // AuditStore.setCurrentPage(1);
    this._auditService.sortAuditList(type, SubMenuItemStore.searchText);
  }

  createImageUrl(token) {
   
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  gotoUserDetails(id){
    this._router.navigateByUrl('/human-capital/users/'+id);
  }
  

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlAuditableEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    SubMenuItemStore.searchText = '';
    AuditStore.searchText = '';
    AuditStore.clearAudits();
    AuditStore.unsetAuditForAuditProgram()
    AuditProgramMasterStore.clearAuditPrograms();
  }



}
