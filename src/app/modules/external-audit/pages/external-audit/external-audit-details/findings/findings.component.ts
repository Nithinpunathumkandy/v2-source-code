import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ExternalAuditMasterStore } from 'src/app/stores/external-audit/external-audit/external-audit-store';
import { FindingsService } from 'src/app/core/services/external-audit/findings/findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import {FindingMasterStore} from 'src/app/stores/external-audit/findings/findings-store';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss']
})
export class FindingsComponent implements OnInit , OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  FindingMasterStore = FindingMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };


  popupControlFindingsEventSubscription: any;
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  filterSubscription: Subscription = null;

  ExternalAuditMasterStore = ExternalAuditMasterStore;
  constructor(private _findingsService: FindingsService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _router:Router,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = true;

		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		  this.FindingMasterStore.loaded = false;
		  this.getFindings(1);
		})
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            FindingMasterStore.clearDocumentDetails();
            this.addFindings();
            break;
          case "search":
            FindingMasterStore.searchText   = SubMenuItemStore.searchText;
            this.getFindings();
            break;
          case "refresh":
            FindingMasterStore.loaded = false;
            FindingMasterStore.searchText = null;
            this.getFindings(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
        
      }
      if(NoDataItemStore.clikedNoDataItem){
         this.addFindings();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_findings'});
      

    // for deleting/activating/deactivating using delete modal
    this.popupControlFindingsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

   
    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'search' },
      { type: 'refresh' },
      {type:'new_modal'},
      { type: "close", path: "../" }

    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    FindingMasterStore.setOrderBy('desc');
    RightSidebarLayoutStore.filterPageTag = 'ea_findings';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  // 'organization_ids',
		  'division_ids',
		  'department_ids',
		  'section_ids',
		  'sub_section_ids',
		  'finding_category_ids',
      'risk_rating_ids',
      'impact_analysis_category_ids',
      'root_cause_category_ids',
      //'external_audit_ids',
      'finding_status_ids',
      // 'finding_corrective_action_status_ids',
      'root_cause_sub_category_ids'
		]);
    this.getFindings(1);

  }
 
  // calling respective findings
  getFindings(newPage: number = null){
    let params = `&external_audit_ids=${ExternalAuditMasterStore.auditId}`;
    if (newPage) FindingMasterStore.setCurrentPage(newPage);
    this._findingsService.getItems(false,params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  addFindings(){
    FindingMasterStore.clearDocumentDetails();
    this._router.navigateByUrl('external-audit/external-audit/add-ea-findings');
    this._utilityService.detectChanges(this._cdr);
  }
 
  //function for calling details page 
  getAuditFindingDetails(id:number){
    this._router.navigateByUrl('/external-audit/audit-findings/'+id);

  }
  

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteFindings(status)
        break;

    }

  }
  // for editing
  getAuditFinding(id: number){
    this._findingsService.getItem(id).subscribe(res=>{
      this._router.navigateByUrl('external-audit/external-audit/edit-findings');
      this._utilityService.detectChanges(this._cdr)
    });

  }

   // delete function call
   deleteFindings(status: boolean) {
    if (status && this.popupObject.id) {
      let params = `&external_audit_ids=${ExternalAuditMasterStore.auditId}`;
      this._findingsService.delete(this.popupObject.id, params).subscribe(resp => {
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
    this.popupObject.title = 'Delete Finding?';
    this.popupObject.subtitle = 'are_you_sure_to_delete_findings';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    this._findingsService.sortFindingslList(type, SubMenuItemStore.searchText);
  }
 
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlFindingsEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    FindingMasterStore.unsetFindings(); 
    this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }
}