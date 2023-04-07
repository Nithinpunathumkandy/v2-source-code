import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ReportStore} from 'src/app/stores/mrm/meeting-report/meeting-report.store';
import { MeetingReportService } from 'src/app/core/services/mrm/meeting-report/meeting-report.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-meeting-reports-list',
  templateUrl: './meeting-reports-list.component.html',
  styleUrls: ['./meeting-reports-list.component.scss']
})
export class MeetingReportsListComponent implements OnInit,OnDestroy {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


  reportObject = {
    type:null,
    values: null,
  }

  
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };


  
  filterSubscription: Subscription = null;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  ReportStore = ReportStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  modalEventSubscription: any;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;
  popupControlMeetingsEventSubscription: any;
  
  constructor(
    private _renderer2: Renderer2,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _helperService: HelperServiceService,
    private _reportService: MeetingReportService,
    private _humanCapitalService: HumanCapitalService,
    private _rightSidebarFilterService: RightSidebarFilterService
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.filterPageTag = 'meeting_list';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'meeting_ids'
    ]);
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      ReportStore.reportsLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange();
    });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MEETING_ACTION_PLAN_LIST', submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_MEETING_ACTION_PLAN', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_MEETING_ACTION_PLAN_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_MEETING_ACTION_PLAN', submenuItem: {type: 'export_to_excel'}}
      ]
      
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_report'});
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {   
          case "new_modal":
            setTimeout(() => {
              this.addReport();
            }, 1000)
            break;
          case "template":
            this._reportService.generateTemplate();
            break;
          case "export_to_excel":
            this._reportService.exportToExcel();
            break;
          case "search":
            ReportStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            ReportStore.searchText = '';
            ReportStore.reportsLoaded = false;
            this.pageChange(1);
          break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addReport();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });

    this.popupControlMeetingsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
    
     this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    this.pageChange(1)
    
  }
  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  pageChange(newPage: number = null) {
    if (newPage) ReportStore.setCurrentPage(newPage);
    this._reportService.getItems(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  addReport(){
    this.reportObject.type = 'Add';
    this.reportObject.values=null;
    ReportStore.editFlag=false;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteReport(status);
        break;
    }
  }

  // for delete
  delete(id: number) {
   event.stopPropagation();

    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }


  deleteReport(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._reportService.delete(this.popupObject.id).subscribe(resp => {
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


  clearPopupObject() {
    this.popupObject.id = null;
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    this.pageChange(1); 
    $(this.formModal.nativeElement).modal('hide');
    this.reportObject.type = null;
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
  gotoDetailsPage(id) {

    this._router.navigateByUrl('mrm/meeting-reports/' + id);
    // this._router.navigateByUrl('mrm/meeting-reports/'+id);
  }

  //edit start
  edit(data) {
    event.stopPropagation();

    this._reportService.getItem(data.id).subscribe(res => {

      if (res) {
        this.reportObject.values = {
          id:data.id,
          meeting_id: data.meeting_id,
          title: data.title ,
          meeting_report_template_id: data.meeting_report_template_id,
          meeting_report_template_title: data.meeting_report_template_title,
        }
        this.reportObject.type = 'Edit';
        ReportStore.editFlag=true;
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }
      
    })
  }
//end edit  

getTimezoneFormatted(time){
  return this._helperService.timeZoneFormatted(time);
}

   // for sorting
   sortTitle(type: string) {
    this._reportService.sortMeetingReport(type, null);
    this.pageChange();
  }

ngOnDestroy() {
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  // this._rightSidebarFilterService.resetFilter();
  this.filterSubscription.unsubscribe();
  this.popupControlMeetingsEventSubscription.unsubscribe()
  this.modalEventSubscription.unsubscribe()
  this.networkFailureSubscription.unsubscribe();
  this.idleTimeoutSubscription.unsubscribe();
  RightSidebarLayoutStore.showFilter = false;
  ReportStore.searchText=null;
  SubMenuItemStore.searchText = '';
  ReportStore.unsetMeetingReportsList();//Report list
  BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
}
}
