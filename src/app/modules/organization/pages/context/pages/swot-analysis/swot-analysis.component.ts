import { Component, OnInit,ElementRef, ViewChild, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from "@angular/router";

import { SwotService } from "src/app/core/services/organization/context/swot-service/swot.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';

import { SwotStore } from "src/app/stores/organization/context/swot.store";
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AppStore } from 'src/app/stores/app.store';

declare var $: any;

@Component({
  selector: 'app-swot-analysis',
  templateUrl: './swot-analysis.component.html',
  styleUrls: ['./swot-analysis.component.scss']
})
export class SwotAnalysisComponent implements OnInit,OnDestroy {

  @ViewChild('viewMoreModal') viewMoreModal: ElementRef;

  SwotStore = SwotStore;
  IssueListStore = IssueListStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  selectedTypeDetails = {
    type: null,
    title: null,
    page: 'swot'
  };
  emptyMessage = "swot_no_data_found";
  closeEventSubscription: any = null;
  idleTimeoutSubscription: any;
  filterSubscription: any;

  constructor(private _swotService: SwotService, private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService, private _cdr: ChangeDetectorRef,
    private _router: Router, private _renderer2: Renderer2, private _rightSidebarFilterService: RightSidebarFilterService,
    private _helperService: HelperServiceService) { }

  ngOnInit() {

    RightSidebarLayoutStore.showFilter = true;
    AppStore.showDiscussion = false;
    // Subscribe to event to close view more modal
    this.closeEventSubscription = this._eventEmitterService.viewMorePopup.subscribe(res=>{
      this.closeViewMoreModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        if($(this.viewMoreModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.viewMoreModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.viewMoreModal.nativeElement,'overflow','auto');
        }
      }
    })

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.SwotStore.swotCategoryLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getSwotCategories();
    })

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'EXPORT_SWOT', submenuItem: {type: 'export_to_excel'}}
      ]
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel": 
            this._swotService.exportToExcel();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    SubMenuItemStore.setNoUserTab(true);

    RightSidebarLayoutStore.filterPageTag = 'swot';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'sub_section_ids',
      'section_ids',
      'issue_domain_ids',
      'issue_type_ids',
    ]);
    SwotStore.setInitialData();// Initialize Variables with empty data
    this.getSwotCategories();// Get Swot Categories
  }

  /**
   *  Get SWOT Categories
   *  Loop through items and Get Issues for individual categories
   */
  getSwotCategories(){
    this._swotService.getSwotCategories().subscribe(res=>{
      res.forEach(element => {
        this._swotService.getItems(element.title,element.id,5).subscribe(response=>{
          this._utilityService.detectChanges(this._cdr);
        })
      });
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // On Page Leave
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    SwotStore.unsetSwotList();
    this.closeEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    this._rightSidebarFilterService.resetFilter();
  }

  /**
   * View more button is clicked
   * @param type Type of SWOT
   * Opens view-more modal which displays issues of particular type
   */
  viewMore(swotTitle,swotId){
    this.selectedTypeDetails.type = swotId;
    this.selectedTypeDetails.title = swotTitle;
    this._swotService.getItems(swotTitle,swotId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    setTimeout(() => {
      $(this.viewMoreModal.nativeElement).modal('show');
    }, 100);
  }

  // Close view-more modal
  closeViewMoreModal(){
    SwotStore.setCurrentPageByItem(this.selectedTypeDetails.title,1);
    this._swotService.getItems(this.selectedTypeDetails.title,this.selectedTypeDetails.type,5).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    setTimeout(() => {
      $(this.viewMoreModal.nativeElement).modal('hide');
      this.selectedTypeDetails.type = null;
      this.selectedTypeDetails.title = null;
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  /**
   * Goto Issue Details
   * @param issueId Issue Id
   */
  gotoIssueDetails(issueId){
    IssueListStore.unsetIssueDetails();
    IssueListStore.setSelectedIssueId(issueId);
    this._router.navigateByUrl('/organization/issue-details/'+IssueListStore.selectedId)
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

}
