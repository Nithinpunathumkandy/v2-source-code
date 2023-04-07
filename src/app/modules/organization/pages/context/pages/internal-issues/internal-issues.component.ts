import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { Router } from "@angular/router";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuthStore } from 'src/app/stores/auth.store';

import { InternalissueService } from "src/app/core/services/organization/context/internal-issues-service/internalissue.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";

import { InternalIssueStore } from "src/app/stores/organization/context/internal-issue.store";
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";

import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

declare var $: any;

@Component({
  selector: 'app-internal-issues',
  templateUrl: './internal-issues.component.html',
  styleUrls: ['./internal-issues.component.scss']
})
export class InternalIssuesComponent implements OnInit,OnDestroy {

  @ViewChild('viewMoreModal') viewMoreModal: ElementRef;

  InternalIssueStore = InternalIssueStore;
  IssueListStore = IssueListStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  selectedTypeDetails = {
    type: null,
    title: null,
    page: 'internal_issue'
  };
  closeEventSubscription: any = null;
  idleTimeoutSubscription: any;
  filterSubscription: any;
  emptyMessage = "internal_issues_no_data_found";
  constructor(private _internalIssueService: InternalissueService, private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,private _router: Router,private _renderer2: Renderer2
    , private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit() {

    RightSidebarLayoutStore.showFilter = true;

    InternalIssueStore.unsetInternalIssueList();

    // Subscribe to Event Emitter Service to Close View More Modal
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
      this.InternalIssueStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange();
    })

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EXPORT_INTERNAL_ISSUES', submenuItem: {type: 'export_to_excel'}}
      ]
 
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel": 
            this._internalIssueService.exportToExcel();
  
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    SubMenuItemStore.setNoUserTab(true);

    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'export_to_excel' }
    // ]);
    RightSidebarLayoutStore.filterPageTag = 'internal_issue';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'issue_domain_ids',
      'issue_type_ids',
      'issue_category_ids',
     
    ]);

    this.pageChange(); // Get Issue Categories
  }

  /**
   * Get Issue Categories according to Page Change
   * Loop through items and get Issues according to type
   * @param currentPage Page Number
   */
  pageChange(currentPage:number = null){
    if(currentPage) InternalIssueStore.setIssueCategoryCurrentPage(currentPage);
    else InternalIssueStore.setIssueCategoryCurrentPage(1)
    this._internalIssueService.getIssueCategories().subscribe(res=>{
      res.data.forEach(element => {
        this._internalIssueService.getItems(element.id,element.title,true).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        });
      });
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // getInternalIssues(){
    // this._internalIssueService.getAllItems().subscribe(res=>{
    //   this._utilityService.detectChanges(this._cdr);
    // });
  // }

  /**
   * Open View More Modal
   * @param categoryId Category Id
   * @param categoryTitle Category Title
   */
  viewMore(categoryId,categoryTitle){
    this.selectedTypeDetails.type = categoryId;
    this.selectedTypeDetails.title = categoryTitle;
    InternalIssueStore.initializeInternalIssue();
    this._internalIssueService.getItems(this.selectedTypeDetails.type,this.selectedTypeDetails.title).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    setTimeout(() => {
      $(this.viewMoreModal.nativeElement).modal('show');
      //SwotStore.setSwotList(type,null);
    }, 100);
  }

  // Close View Mode Modal
  closeViewMoreModal(){
    this._internalIssueService.getItems(this.selectedTypeDetails.type,this.selectedTypeDetails.title,true).subscribe(res=>{
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
   * Check Position Odd or Even
   * To change style accordingly
   * @param position Array Index
   */
  checkPosition(position: number){
    var res = position%2;
    if(res == 0) return true;
    else return false;
  }

  /**
   * Get Color CSS
   * @param index Array Index
   */
  getColorStyle(index){
    return this._helperService.getColorClass(index);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    InternalIssueStore.unsetInternalIssueList();
    this.closeEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    this._rightSidebarFilterService.resetFilter();
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

  getNoDataSource(pos){
    var type:string = null;
    if(this.checkPosition(pos)) type = 'left';
    else type = 'right';
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

}
