import { ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ViewChild } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MeetingReportTemplatesService } from 'src/app/core/services/mrm/meeting-report-templates/meeting-report-templates.service';
import { MeetingReportTemeplates } from 'src/app/stores/mrm/meeting-report-templates/meeting-report-templates';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-meeting-report-templates-list',
  templateUrl: './meeting-report-templates-list.component.html',
  styleUrls: ['./meeting-report-templates-list.component.scss']
})
export class MeetingReportTemplatesListComponent implements OnInit, OnDestroy {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  MeetingReportTemeplates = MeetingReportTemeplates;
  RightSidebarLayoutStore=RightSidebarLayoutStore
  modalEventSubscription: any;
  deleteEventSubscription: any;
  ModalStyleSubscriptionEvent: any;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;

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

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _meetingPlanFileService:MeetingPlanFileService,
    private _meetingReportTemplatesService:MeetingReportTemplatesService
    ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = false;

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_MEETING_REPORT_TEMPLATE', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_MEETING_REPORT_TEMPLATE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_MEETING_REPORT_TEMPLATE', submenuItem: {type: 'export_to_excel' } }
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'add_new_template'});

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
                  this.addReportTemplates();
            break;
          case "refresh":
              MeetingReportTemeplates.unsetMeetingReportTemplatesList();
              this.pageChange(1);
            break;
          case "search":
              MeetingReportTemeplates.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "template":
            this._meetingReportTemplatesService.generateTemplate();
            break;
          case "export_to_excel":
            this._meetingReportTemplatesService.exportToExcel();
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            MeetingReportTemeplates.searchText = '';
            MeetingReportTemeplates.loaded = false;
            this.pageChange(1);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.reportObject.type = 'Add'
        this.reportObject.values=null
        this.openFormModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

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

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal()
    });

    this.ModalStyleSubscriptionEvent = this._eventEmitterService.ModalStyle.subscribe(res => {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    })

    SubMenuItemStore.setNoUserTab(true);
    this.pageChange(1);
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  pageChange(newPage: number = null) {
    if (newPage) MeetingReportTemeplates.setCurrentPage(newPage);
    this._meetingReportTemplatesService.getItems().subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
  }

  getDetails(id){
    this._router.navigateByUrl('mrm/meeting-report-templates/'+id);
  }

  addReportTemplates(){
    setTimeout(() => {
      this.reportObject.type = 'Add'
      MeetingReportTemeplates.editFlag=true;
      this.reportObject.values=null
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }, 1000);
  }

  getEmployeePopupDetails(users, created?:string){
    let userDetial: any = {};

    userDetial['first_name'] = users?.created_by_first_name;
    userDetial['last_name'] = users?.created_by_last_name;
    userDetial['designation'] = users?.created_by_designation;
    userDetial['image_token'] = users?.created_by_image_token;
    userDetial['department'] = users?.created_by_department;
    // userDetial['email'] = users?.email;
    // userDetial['mobile'] = users?.mobile;
    // userDetial['id'] = users?.id;
    // userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
    
    return userDetial;
  }
  
//edit start
  edit(id) {
    event.stopPropagation();
    this._meetingReportTemplatesService.getItem(id).subscribe(res => {
      var workFlowDetails = res;
      this.reportObject.values = {
        id: workFlowDetails.id,
        title:workFlowDetails.title ,
      }

      this.reportObject.type = 'Edit';
      MeetingReportTemeplates.editFlag=false;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal()
    })
  }
//end edit  

  sortTitle(type: string) {
    this._meetingReportTemplatesService.sortMeetingReportTemplatesList(type, null);
    this.pageChange();
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

  closeConfirmationPopup(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteReportTemplates(status);
        break;
      case 'Activate': this.activateReportTemplates(status);
        break;
      case 'Deactivate': this.deactivateReportTemplates(status);
        break;
    }
  }

  deleteReportTemplates(status: boolean) {

    if (status && this.popupObject.id) {
      this._meetingReportTemplatesService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      },(error=>{
             
        if(error.status == 405 && MeetingReportTemeplates.getMeetingReportTemplatesById(this.popupObject.id).status_id == AppStore.activeStatusId){
          let id = this.popupObject.id;
          this.closeConfirmationPopup();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivateConfirm(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else{
          this.closeConfirmationPopup();
          this.clearPopupObject();
        }

      })
      );
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.type = '';
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
  }

  activateReportTemplates(status: boolean) {
    if (status && this.popupObject.id) {
      this._meetingReportTemplatesService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopup();
      this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  deactivateReportTemplates(status: boolean) {
    if (status && this.popupObject.id) {
      this._meetingReportTemplatesService.deactivate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }
  

  deleteConfirm(id: number,status) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.title='Delete Control?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.type='Activate';
    this.popupObject.title = 'Activate Control?';
    this.popupObject.subtitle = 'common_activate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.type='Deactivate';
    this.popupObject.title = 'Deactivate Control?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
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

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  createPrevImageUrl(type, token) {//doc
    return this._meetingPlanFileService.getThumbnailPreview(type, token);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    SubMenuItemStore.searchText = null;
    MeetingReportTemeplates.searchText =null;
    this.deleteEventSubscription.unsubscribe();
    this.modalEventSubscription.unsubscribe();
    this.ModalStyleSubscriptionEvent.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
		SubMenuItemStore.searchText = '';
    MeetingReportTemeplates.unsetMeetingReportTemplatesList();
  }

}
