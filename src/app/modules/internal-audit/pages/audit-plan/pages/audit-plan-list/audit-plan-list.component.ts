import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import {AuditPlanStore} from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { Router } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-plan-list',
  templateUrl: './audit-plan-list.component.html',
  styleUrls: ['./audit-plan-list.component.scss']
})
export class AuditPlanListComponent implements OnInit , OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuditPlanStore = AuditPlanStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  
  filterSubscription: Subscription = null;
  popupControlAuditableEventSubscription: any;
  
  constructor(private _auditPlanService: AuditPlanService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _imageService:ImageServiceService, 
    private _router: Router,
    private _renderer2: Renderer2,
    private _rightSidebarFilterService: RightSidebarFilterService,
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AuditPlanStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_audit_plan'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_AUDIT_PLAN', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_AUDIT_PLAN_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_AUDIT_PLAN', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'import'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_AUDIT_PLAN')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.AuditPlanStore.clearDocumentDetails();
            this.clearCommonFilePopupDocuments();
            this.AuditProgramMasterStore.auditProgramId = null;
            this.AuditPlanStore.unSelectCriteria();
            this.AuditPlanStore.unSelectObjective();
            this.gotoAddPage();
            break;
          case "template":
            this._auditPlanService.generateTemplate();
            break;
          case "export_to_excel":
            this._auditPlanService.exportToExcel();
            break;
          case "search":
            AuditPlanStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
            case "refresh":
              AuditPlanStore.loaded=false;
              AuditPlanStore.searchText = null;
              this.pageChange(1);
              break;
              case "import":
                ImportItemStore.setTitle('import_audit_plan');
                ImportItemStore.setImportFlag(true);
                break;
          
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.gotoAddPage();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._auditPlanService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    //   { type: 'search' },
    //   {type:'new_modal'},
    //   { type: 'template' },
    //   { type: 'export_to_excel' ,path:'internal-audit' }

    // ]);
    RightSidebarLayoutStore.filterPageTag = 'audit_plans';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'audit_leader_ids',
      'audit_program_ids',
      'audit_plan_status_ids'
      // 'audit_plan_ids',
      // 'audit_objective_ids'
    ]);

    this.pageChange(1);

  }

  pageChange(newPage: number = null) {
    if (newPage) AuditPlanStore.setCurrentPage(newPage);
    this._auditPlanService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  gotoAddPage(){
    this._router.navigateByUrl('internal-audit/audit-plans/add-audit-plan');
  }

  // details page callig function
  gotToAuditPlanDetails(id:number){
    this._router.navigateByUrl(`/internal-audit/audit-plans/${id}`);
  }

   // Returns default image
   getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }



  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  // editing

  editAuditPlan(id:number){
    event.stopPropagation();
    AuditProgramMasterStore.auditProgramId = null;
    this._auditPlanService.getItem(id).subscribe(res=>{
      this._router.navigateByUrl('/internal-audit/audit-plans/edit-audit-plan');
      this._utilityService.detectChanges(this._cdr)
    });
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

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditPlan(status)
        break;

    }

  }

  // delete function call
  deleteAuditPlan(status: boolean) {
    if (status && this.popupObject.id) {
      this._auditPlanService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        // this.pageChange(1);
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
    this.popupObject.title = 'Delete Audit Plan?';
    this.popupObject.subtitle = 'audit_plan_delete_sub_tittle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }


  // for sorting
  sortTitle(type: string) {
    // AuditPlanStore.setCurrentPage(1);
    this._auditPlanService.sortAuditPlanlList(type, SubMenuItemStore.searchText);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditPlanStore.searchText = null;
    this.popupControlAuditableEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    SubMenuItemStore.searchText = '';
    AuditPlanStore.searchText = '';
    AuditPlanStore.unsetAuditPlan();
    AuditProgramMasterStore.clearAuditPrograms()
  }



}
