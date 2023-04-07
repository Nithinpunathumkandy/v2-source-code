import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import{ ExternalAuditMasterStore } from 'src/app/stores/external-audit/external-audit/external-audit-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ExternalAuditService } from 'src/app/core/services/external-audit/external-audit/external-audit.service';
import { Router } from '@angular/router';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EADashboardStore } from 'src/app/stores/external-audit/ea-dashboard/ea-dashboard-store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-external-audit-list',
  templateUrl: './external-audit-list.component.html',
  styleUrls: ['./external-audit-list.component.scss']
})
export class ExternalAuditListComponent implements OnInit , OnDestroy{
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  ExternalAuditMasterStore = ExternalAuditMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  EADashboardStore=EADashboardStore;
  AppStore = AppStore;
  NoDataItemStore = NoDataItemStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  popupControlExternalAuditEventSubscription: any;
  filterSubscription: Subscription = null;
  
  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _externalAuditService: ExternalAuditService,
    private _renderer2: Renderer2,
    private _router:Router,
    private _cdr: ChangeDetectorRef, private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		  this.ExternalAuditMasterStore.loaded = false;
      this._utilityService.detectChanges(this._cdr)
		  this.pageChange(1);
		})
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EXTERNAL_AUDIT_LIST', submenuItem: { type: 'search' }},
        {activityName:null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_EXTERNAL_AUDIT', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_EXTERNAL_AUDIT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_EXTERNAL_AUDIT', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_EXTERNAL_AUDIT', submenuItem: {type: 'import'}}
      ]
      this._helperService.checkSubMenuItemPermissions(1700, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_external_audit'});

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createNewExternalAudit();
            break;
          case "template":
            this._externalAuditService.generateTemplate();
            break;
          case "export_to_excel":
            this._externalAuditService.exportToExcel();
            break;
          case "search":
            ExternalAuditMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange();
            break;
          case "refresh":
            ExternalAuditMasterStore.loaded = false;
            ExternalAuditMasterStore.searchText = null;
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
        this.createNewExternalAudit();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._externalAuditService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);


    // for deleting/activating/deactivating using delete modal
    this.popupControlExternalAuditEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

   
    // // setting submenu items
    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'search' },
    //   { type: 'new_modal' },
    //   { type: 'template' },
    //   { type: 'export_to_excel' ,path:'external-audit' }

    // ]);
    // ExternalAuditMasterStore.setOrderBy('asc');

    RightSidebarLayoutStore.filterPageTag = 'ea_audit';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  //'organization_ids',
		  //'division_ids',
		  //'department_ids',
		  //'section_ids',
		  //'sub_section_ids',
		  'external_audit_type_ids',
      'responsible_user_ids',
		]);
    this.pageChange(1);
    
  }

  pageChange(newPage: number = null) {
    if (newPage) ExternalAuditMasterStore.setCurrentPage(newPage);
    this._externalAuditService.getItems(false,EADashboardStore.filterParams ? EADashboardStore.filterParams : null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createNewExternalAudit(){
    this.ExternalAuditMasterStore.clearDocumentDetails();
    this.ExternalAuditMasterStore._msType = [];
    this.ExternalAuditMasterStore._responsibleUser =[];
    this.gotoAddPage();
   
  }

  gotoAddPage(){
    this._router.navigateByUrl('/external-audit/external-audit/add-external-audit');
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

  getAuditDetails(id:number){
    this._router.navigateByUrl('/external-audit/external-audit/'+id);

  }


  //edit function

  editExternalAudit(externalAudit){
    event.stopPropagation();
    ExternalAuditMasterStore.setAuditId(externalAudit.id)
    this._externalAuditService.getItem(externalAudit.id).subscribe(res=>{
      this._router.navigateByUrl('/external-audit/external-audit/edit-external-audit');
      this._utilityService.detectChanges(this._cdr)
    });

  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteExternalAudit(status)
        break;

    }

  }


  // delete function call
  deleteExternalAudit(status: boolean) {
    if (status && this.popupObject.id) {

      this._externalAuditService.delete(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Delete External Audit?';
    this.popupObject.subtitle = 'are_you_sure_to_delete_audit';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    ExternalAuditMasterStore.setCurrentPage(1);
    this._externalAuditService.sortExternalAuditlList(type, SubMenuItemStore.searchText);
  }

  
  
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ExternalAuditMasterStore.searchText = '';
    this.popupControlExternalAuditEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.searchText = '';
    ExternalAuditMasterStore.searchText = '';
    ExternalAuditMasterStore.loaded=false;
    this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    ExternalAuditMasterStore.unsetExternalAudit();
    EADashboardStore.unSetFilterParams();
  }

}
