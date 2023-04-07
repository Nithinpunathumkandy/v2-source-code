import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from "@angular/router";
import { AuthStore } from 'src/app/stores/auth.store';

import { ExternalissueService } from "src/app/core/services/organization/context/external-issues-service/externalissue.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";

import { ExternalIssueStore } from "src/app/stores/organization/context/external-issue.store";
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";

import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { string, type } from '@amcharts/amcharts4/core';

declare var $: any;

@Component({
  selector: 'app-external-issues',
  templateUrl: './external-issues.component.html',
  styleUrls: ['./external-issues.component.scss']
})
export class ExternalIssuesComponent implements OnInit,OnDestroy {

  @ViewChild('viewMoreModal') viewMoreModal: ElementRef;
  ExternalIssueStore = ExternalIssueStore;
  IssueListStore = IssueListStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  selectedTypeDetails = {
    type: null,
    title: null,
    page: 'external_issue'
  };
  closeEventSubscription: any = null;
  idleTimeoutSubscription: any;
  filterSubscription: any;
  emptyMessage = "external_issues_no_data_found";
  constructor(private _externalIssueService: ExternalissueService, private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService, private _router: Router,
    private _organizationFileService: OrganizationfileService, private _renderer2: Renderer2,
    private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit() {

    RightSidebarLayoutStore.showFilter = true;

    ExternalIssueStore.unsetExternalIssueList();

    // Event Subscription from Event Service to Close View More Modal
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
      this.ExternalIssueStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange();
    })

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EXPORT_EXTERNAL_ISSUES', submenuItem: {type: 'export_to_excel'}}
      ]
 
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel": 
            this._externalIssueService.exportToExcel();
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
    RightSidebarLayoutStore.filterPageTag = 'external_issue';
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

    this.pageChange(); // Page Change of Issue Categories
  }

  /**
   * Get Issue Categories
   * For each item get external issues
   * @param currentPage Page No
   */
  pageChange(currentPage:number = null){
    if(currentPage) ExternalIssueStore.setIssueCategoryCurrentPage(currentPage);
    else ExternalIssueStore.setIssueCategoryCurrentPage(1)
    this._externalIssueService.getIssueCategories().subscribe(res=>{
      res.data.forEach(element => {
        this._externalIssueService.getItems(element.id,element.title,true).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        });
      });
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // getInternalIssues(){
    // this._externalIssueService.getAllItems().subscribe(res=>{
    //   this._utilityService.detectChanges(this._cdr);
    // });
  // }

  /**
   * Open View More Modal
   * @param categoryId Issue Category Id
   * @param categoryTitle Issue Category Title
   */
  viewMore(categoryId,categoryTitle){
    this.selectedTypeDetails.type = categoryId;
    this.selectedTypeDetails.title = categoryTitle;
    ExternalIssueStore.initializeExternalIssue();
    this._externalIssueService.getItems(this.selectedTypeDetails.type,this.selectedTypeDetails.title).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    setTimeout(() => {
      $(this.viewMoreModal.nativeElement).modal('show');
    }, 100);
  }

  // Close View More Modal
  closeViewMoreModal(){
    this._externalIssueService.getItems(this.selectedTypeDetails.type,this.selectedTypeDetails.title,true).subscribe(res=>{
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
   * Returns Array Position True or False
   * To change style accordingly
   * @param position Array Index
   */
  checkPosition(position: number){
    var res = position%2;
    if(res == 0) return true;
    else return false;
  }

  /**
   * Returns Class for Color
   * @param index Array Index
   */
  getColorStyle(index){
    return this._helperService.getColorClass(index);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ExternalIssueStore.unsetExternalIssueList();
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
