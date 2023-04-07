import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ElementRef, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import {FindingMasterStore} from 'src/app/stores/external-audit/findings/findings-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { FindingsService } from 'src/app/core/services/external-audit/findings/findings.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { ExternalAuditMasterStore } from 'src/app/stores/external-audit/external-audit/external-audit-store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { AppStore } from 'src/app/stores/app.store';
import { CorrectiveActionMasterStore } from 'src/app/stores/external-audit/corrective-action/corrective-action-store';
import { EADashboardStore } from 'src/app/stores/external-audit/ea-dashboard/ea-dashboard-store';


declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-finding-list',
  templateUrl: './audit-finding-list.component.html',
  styleUrls: ['./audit-finding-list.component.scss']
})
export class AuditFindingListComponent implements OnInit , OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  FindingMasterStore = FindingMasterStore;
  CorrectiveActionMasterStore = CorrectiveActionMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  EADashboardStore=EADashboardStore
  NoDataItemStore = NoDataItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  ExternalAuditMasterStore = ExternalAuditMasterStore;
  popupControlFindingsEventSubscription: any;
	filterSubscription: Subscription = null;


  constructor(private _findingsService:FindingsService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _router:Router,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {
		RightSidebarLayoutStore.showFilter = true;

		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		  this.FindingMasterStore.loaded = false;
		  this.pageChange(1);
		})
    
    this.reactionDisposer = autorun(() => {

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_audit_findings'});

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "new_modal":
            ExternalAuditMasterStore.auditId = null;
            this.newAuditFindings();
            break;
          case "template":
            this._findingsService.generateTemplate();
            break;
          case "export_to_excel":
            this._findingsService.exportToExcel();
            break;
          case "search":
            FindingMasterStore.searchText   = SubMenuItemStore.searchText;
            this.pageChange();
            break;
          case "refresh":
            FindingMasterStore.loaded = false;
            FindingMasterStore.searchText = null;
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_findings');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.newAuditFindings();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._findingsService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlFindingsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

   
    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'search' },
      { type: 'refresh'},
      {type:'new_modal'},
      { type: 'template' },
      { type: 'export_to_excel' },
      { type: 'import' ,path:'external-audit'}      

    ]);
    RightSidebarLayoutStore.filterPageTag = 'ea_findings';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  // 'organization_ids',
		 
		  'department_ids',
		  'finding_category_ids',
      'risk_rating_ids',
      'impact_analysis_category_ids',
      'root_cause_category_ids',
      'external_audit_ids',
      'finding_status_ids',
      // 'finding_corrective_action_status_ids',
      'root_cause_sub_category_ids'
		]);
    this.pageChange(1);

  }

  pageChange(newPage: number = null) {
    if (newPage) FindingMasterStore.setCurrentPage(newPage);
    this._findingsService.getItems(false,EADashboardStore.filterParams ? EADashboardStore.filterParams : null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  newAuditFindings(){
    this.gotoAddPage();
    this.FindingMasterStore.clearDocumentDetails();
  }

  gotoAddPage(){
    ExternalAuditMasterStore.auditId = null;
    this._router.navigateByUrl('/external-audit/audit-findings/add-findings');
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

  //edit function

  getAuditFinding(id: number){
    event.stopPropagation();
    ExternalAuditMasterStore.auditId = null;
    FindingMasterStore.auditFindingId=id
    //this._findingsService.getItem(id).subscribe(res=>{
      this._router.navigateByUrl('/external-audit/audit-findings/edit-findings');
      //this._utilityService.detectChanges(this._cdr)
    //});

  }

  //function for calling details page 
  getAuditFindingDetails(id:number){
    CorrectiveActionMasterStore.unsetSelectedItemDetails();
    CorrectiveActionMasterStore.unsetAllCorrectiveActions();
    this._router.navigateByUrl('/external-audit/audit-findings/'+id);

  }


   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteFindings(status)
        break;

    }

  }

   // delete function call
   deleteFindings(status: boolean) {
    if (status && this.popupObject.id) {
      this._findingsService.delete(this.popupObject.id).subscribe(resp => {
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
  }

   // for delete
   delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Finding?';
    this.popupObject.subtitle = 'delete_ea_audit_finding';
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    FindingMasterStore.setCurrentPage(1);
    this._findingsService.sortFindingslList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  
  
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlFindingsEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    FindingMasterStore.setCurrentPage(1);
    FindingMasterStore.unsetFindings();
    EADashboardStore.unSetFilterParams();
  }
}