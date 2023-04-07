import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { Router } from "@angular/router";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

import { PestleService } from "src/app/core/services/organization/context/pestle-service/pestle.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';

import { PestleStore } from "src/app/stores/organization/context/pestle.store";
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

declare var $: any;

@Component({
  selector: 'app-pestle-analysis',
  templateUrl: './pestle-analysis.component.html',
  styleUrls: ['./pestle-analysis.component.scss']
})
export class PestleAnalysisComponent implements OnInit,OnDestroy {

  @ViewChild('viewMoreModal') viewMoreModal: ElementRef;

  PestleStore = PestleStore;
  IssueListStore = IssueListStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  selectedTypeDetails = {
    type: null,
    title: null,
    page: 'pestle'
  };
  emptyMessage = "pestel_no_data_found";
  closeEventSubscription: any = null;
  idleTimeoutSubscription: any;
  filterSubscription: any;

  constructor(private _pestleService: PestleService, private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService, private _cdr: ChangeDetectorRef,
    private _router: Router, private _renderer2: Renderer2, 
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _helperService: HelperServiceService) { }

  ngOnInit() {

    RightSidebarLayoutStore.showFilter = true;

    this._utilityService.scrollToTop(); // Scroll to top of page

    // Event Subscription for View More Pop up Close
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
      this.PestleStore.pestelCategoryLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getPestleCategories();
    })

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EXPORT_PESTEL', submenuItem: {type: 'export_to_excel'}}
      ]
 
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel": 
            this._pestleService.exportToExcel();
          
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
    RightSidebarLayoutStore.filterPageTag = 'pestle';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'issue_domain_ids',
      'issue_type_ids',
  
      // 'is_internal',
      // 'is_external',
    ]);

    PestleStore.setInitialData(); // Sets initial data

    this.getPestleCategories(); // Get PESTEL Categories
  }

  /**
   * Get PESTEL Categories
   * Loop through each item and get issues by id
   */
  getPestleCategories(){
    this._pestleService.getPestleCategories().subscribe(res=>{
      res.forEach(element => {
        this._pestleService.getItems(element.title,element.id,5).subscribe(response=>{
          this._utilityService.detectChanges(this._cdr);
        })
      });
      this._utilityService.detectChanges(this._cdr);
    })
  }

  /*getPestleAnalysis(){
    this._pestleService.getItems('political',5).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    this._pestleService.getItems('economical',5).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    this._pestleService.getItems('social',5).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    this._pestleService.getItems('technological',5).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    this._pestleService.getItems('environmental',5).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    this._pestleService.getItems('legal',5).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }*/

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    PestleStore.unsetPestleList();
    this.closeEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    this._rightSidebarFilterService.resetFilter();
  }

  /**
   * View more items
   * @param pestelTitle Pestel Category Title 
   * @param pestelId Pestel Category Id
   */
  viewMore(pestelTitle,pestelId){
    this.selectedTypeDetails.type = pestelId;
    this.selectedTypeDetails.title = pestelTitle
    this._pestleService.getItems(pestelTitle,pestelId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    setTimeout(() => {
      $(this.viewMoreModal.nativeElement).modal('show');
    }, 100);
  }

  // Close view more modal
  closeViewMoreModal(){
    PestleStore.setCurrentPageByItem(this.selectedTypeDetails.title,1);
    this._pestleService.getItems(this.selectedTypeDetails.title,this.selectedTypeDetails.type,5).subscribe(res=>{
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
