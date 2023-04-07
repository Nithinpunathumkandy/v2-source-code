import { ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ActionPlansService } from 'src/app/core/services/mrm/action-plans/action-plans.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ActionPlansStore } from 'src/app/stores/mrm/action-plans/action-plans-store';
import { MRMDashboardStore } from 'src/app/stores/mrm/mrm-dashboard/mrm-dashboard-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-action-plans-list',
  templateUrl: './action-plans-list.component.html',
  styleUrls: ['./action-plans-list.component.scss']
})
export class ActionPlansListComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ActionPlansStore = ActionPlansStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;

  modalEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  fileUploadPopupSubscriptionEvent: any;
  popupControlMeetingsEventSubscription: any;

  actionPlansObject = {
    type: null,
    values: null,
    redirect:true
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  filterSubscription: Subscription = null;

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _meetingPlanFileService: MeetingPlanFileService,
    private _actionPlansService: ActionPlansService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit(): void {
 
    RightSidebarLayoutStore.filterPageTag = 'action_plan';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'responsible_user_ids',
      'meeting_action_plan_status_ids',
      'meeting_ids'
    ]);

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ActionPlansStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange();
    });

    AppStore.showDiscussion = false;

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'MEETING_ACTION_PLAN_LIST', submenuItem: { type: 'search' } },
        { activityName: null, submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_MEETING_ACTION_PLAN', submenuItem: { type: 'new_modal' } },
        // {activityName: 'GENERATE_MEETING_ACTION_PLAN_TEMPLATE', submenuItem: {type: 'template'}},
        { activityName: 'EXPORT_MEETING_ACTION_PLAN', submenuItem: { type: 'export_to_excel' } }
      ]

      this._helperService.checkSubMenuItemPermissions(100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_Action_plan' });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addActionPlan();
            }, 1000)
            break;
          case "template":
            this._actionPlansService.generateTemplate();
            break;
          case "export_to_excel":
            this._actionPlansService.exportToExcel();
            break;
          case "search":
            ActionPlansStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            ActionPlansStore.searchText = '';
            ActionPlansStore.loaded = false;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.addActionPlan();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.changeZIndex();
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    // for deleting/activating/deactivating using delete modal
    this.popupControlMeetingsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    this.pageChange();
    
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  pageChange(newPage: number = null) {
    console.log()
    if (newPage) ActionPlansStore.setCurrentPage(newPage);
    var additionalParams=''
    if (MRMDashboardStore.dashboardParameter) {
      additionalParams = MRMDashboardStore.dashboardParameter
    }
    this._actionPlansService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    // let parms=''
    // if (MRMDashboardStore.dashboardParam){
    //   parms=MRMDashboardStore.dashboardParam;
    // }
    // this._actionPlansService.getItems(false, parms).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addActionPlan() {
    ActionPlansStore.unsetIndividualActionPlansDetails()
    this.actionPlansObject.type = 'Add';
    this.actionPlansObject.values = null;
    ActionPlansStore.editFlag = false;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  getDetails(id) {
    this._router.navigateByUrl('mrm/meeting-action-plans/' + id);
    ActionPlansStore.setPath('/mrm/meeting-action-plans');
  }

  //edit start
  edit(id) {
    event.stopPropagation();
    ActionPlansStore.unsetDocumentDetails();
    this._actionPlansService.getItem(id).subscribe(res => {
      setTimeout(() => {
        if (res.documents.length > 0) {
          this.setDocuments(res.documents)
        }
      }, 200);
      let PlanDetails = res;
      if (res) {
        this.actionPlansObject.values = {
          id: PlanDetails.id,
          title: PlanDetails.title,
          responsible_user_id: PlanDetails.responsible,
          description: PlanDetails.description,
          meeting_id: PlanDetails.meeting,
          start_date: PlanDetails.start_date,
          target_date: PlanDetails.target_date,
          budget: PlanDetails.budget,
          completion: PlanDetails.completion,
          meeting_action_plan_watcher_ids: PlanDetails.meeting,
          documents: ''
        }

        this.actionPlansObject.type = 'Edit';
        ActionPlansStore.editFlag = true;
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }

    })
  }

  setDocuments(documents) {
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element.kh_document.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement,
            })
          }
        });
      }
      else {
        if (element && element.token) {
          var purl = this._meetingPlanFileService.getThumbnailPreview('action-plan', element.token);
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)
      }
    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    // this.enableScrollbar();
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  //end edit  

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteActionPlans(status);
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

  // delete function call
  deleteActionPlans(status: boolean) {
    if (status && this.popupObject.id) {

      this._actionPlansService.delete(this.popupObject.id).subscribe(resp => {
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

  openFormModal() {
    // this._router.navigateByUrl('mrm/meeting-action-plans/add-action-plans');
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    this.pageChange(ActionPlansStore?.currentPage); //it empty list add new date fix
    $(this.formModal.nativeElement).modal('hide');
    this.actionPlansObject.type = null;
    this.actionPlansObject.redirect = false;
  }

  // for sorting
  sortTitle(type: string) {
    this._actionPlansService.sortActionPlansList(type, null);
    this.pageChange();
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.style.height = '45px';
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    this.popupControlMeetingsEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
    // this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    ActionPlansStore.searchText = null;
    SubMenuItemStore.searchText = '';
    MRMDashboardStore.dashboardParam=null;
    
  }

}
