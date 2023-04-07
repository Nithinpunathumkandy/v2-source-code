import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ActionPlansStore } from 'src/app/stores/mrm/action-plans/action-plans-store';
import { ActionPlansService } from 'src/app/core/services/mrm/action-plans/action-plans.service';
// import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { Router } from '@angular/router';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

declare var $: any;
@Component({
  selector: 'app-action-plan',
  templateUrl: './action-plan.component.html',
  styleUrls: ['./action-plan.component.scss']
})
export class ActionPlanComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('actionPlanUpdate') actionPlanUpdate: ElementRef;
  @ViewChild('actionPlanHistory') actionPlanHistory: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  actionPlansObject = {
    type: null,
    values: null,
  }


  selectedMeeting: any = null;
  modalEventSubscription: any;
  modelEventSubscriptionUpdate: any;
  modelEventSubscriptionHistory: any;
  popupControlMeetingsEventSubscription: any;
  fileUploadPopupSubscriptionEvent: any;

  reactionDisposer: IReactionDisposer;
  ActionPlansStore = ActionPlansStore;
  MeetingsStore = MeetingsStore;
  MeetingPlanStore = MeetingPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();
  // actionPlanId: number;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    updateId: null,
  };

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _actionPlansService: ActionPlansService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _imageService: ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _humanCapitalService: HumanCapitalService,
    private _documentFileService: DocumentFileService,
    private _meetingPlanFileService: MeetingPlanFileService,
    private _meetingsService: MeetingsService,
  ) { }

  ngOnInit(): void {
    this.noData(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    RightSidebarLayoutStore.showFilter = false;

    this.reactionDisposer = autorun(() => {
      this.getSubmenu(false);

      

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addActionPlan();
            }, 200)
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        //MeetingsStore.setmeetingPlaninsideMeetingAddFlag();
        this.addActionPlan();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal(res);
    });

    this.modelEventSubscriptionUpdate = this._eventEmitterService.actionPlanUpadateModal.subscribe(res => {
      this.closeModelUpdate();
    });

    this.modelEventSubscriptionHistory = this._eventEmitterService.actionPlanHistoryModal.subscribe(res => {
      this.closeHistoryModal();
    });

    this.popupControlMeetingsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.changeZIndex();
    })

    // this.getActionPlans();
    this.meetingPlanGetMeetingItemId();

  }

  meetingPlanGetMeetingItemId() {

    this._meetingsService.meetingPlanGetMeetingItemId(MeetingPlanStore.meetingPlanId).subscribe(res => {
      let meetingId = res?.data[0]?.id;
      if (meetingId) {
        this.noData(true);
        this.getSubmenu(true);
        this.pageChange(1, meetingId);
      } else {
        this.noData(false);
        this.getSubmenu(false);
        ActionPlansStore.ActionPlansloadedList();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  pageChange(newPage: number = null, meetingId?) {
    if (newPage) ActionPlansStore.setCurrentPage(newPage);
    this._actionPlansService.getItems(false, `&meeting_ids=${meetingId}`).subscribe((res) => {
      if (res?.data[0]) {
        this.getActionPlan(res?.data[0]?.id);
      }

      this._utilityService.detectChanges(this._cdr);
    });
  }

  noData(value) {
    if (value) {
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_Action_plan' });
    } else {
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: null });
    }
  }

  getSubmenu(value) {

    var subMenuItems = [];
    if (value) {
      subMenuItems = [
        { activityName: 'CREATE_MEETING_ACTION_PLAN', submenuItem: { type: 'new_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];
    } else {
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];
    }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
  }

  sortTitle(type: string) {
    this._actionPlansService.sortActionPlansList(type, null);
    this.pageChange(null);
  }

  getDetails(id) {
    this._router.navigateByUrl('mrm/meeting-action-plans/' + id);
    ActionPlansStore.setPath(`/mrm/meeting-plans/${MeetingPlanStore.meetingPlanId}/meeting-plan-action-plan`);
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name: "meeting_plans",
      path: `/mrm/meeting-plans/${MeetingPlanStore.meetingPlanId}/meeting-plan-action-plan`
    });
  }

  // createImageUrl(token) {
  //   return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  // }


  // getActionPlans() {
  //   this._actionPlansService.getItems(false,`&meeting_ids=${MeetingsStore.meetingsId}`).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  // }
  addActionPlan() {

    this.selectedMeeting = {
      id: MeetingsStore?.allItems[0]?.id,
      title: MeetingsStore?.allItems[0]?.title,
      start: MeetingsStore?.allItems[0]?.start,
    }
    ActionPlansStore.unsetIndividualActionPlansDetails()
    this.actionPlansObject.type = 'Add';
    this.actionPlansObject.values = null;
    ActionPlansStore.editFlag = false;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  // addActionPlan() {
  //   ActionPlansStore.unsetIndividualActionPlansDetails()
  //   this.actionPlansObject.type = 'Add';
  //   this.actionPlansObject.values=null;
  //   ActionPlansStore.editFlag=false;
  //   this._utilityService.detectChanges(this._cdr);
  //   this.openFormModal();
  // }

  openFormModal() {
    setTimeout(() => {
      ($(this.formModal.nativeElement) as any).modal('show');
    }, 100);
  }

  closeFormModal(res) { //it empty list add new date fix
    ($(this.formModal.nativeElement) as any).modal('hide');
    this.actionPlansObject.type = null;
    // if (res=='save')
      this.meetingPlanGetMeetingItemId();
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  labelDot(data) {
    let str = data;
    let color = "";
    const myArr = str.split("-");
    color = myArr[0];
    return color;
  }

  getActionPlan(id: number) {
    ActionPlansStore.unsetIndividualActionPlansDetails();
    // this._actionPlansService.unsetSelectedItemDetails(); // Clear previous data from store
    this._actionPlansService.getItem(id).subscribe(res => {
      // this.actionPlanId = res.id;
      this._utilityService.detectChanges(this._cdr);
    })
    this._actionPlansService.setSelected(id);
  }

  getDaysRemaining() {

    let startDate = new Date(ActionPlansStore.individualActionPlansDetails?.target_date);

    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }
  getTotaldays() {
    let startDate = new Date(ActionPlansStore.individualActionPlansDetails?.start_date);
    let targetDate = new Date(ActionPlansStore.individualActionPlansDetails?.target_date);

    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;
    return this.Totaldays;

  }

  getEmployeePopupDetails(users, created?: string) { //user popup

    let userDetails: any = {};
    if (users) {
      userDetails['first_name'] = users?.first_name ? users?.first_name : users?.name;
      userDetails['last_name'] = users?.last_name;
      userDetails['image_token'] = users?.image?.token ? users?.image.token : users?.image_token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status_id ? users?.status_id : users?.status.id;
      userDetails['created_at'] = created ? created : null;
      userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    }
    return userDetails;
  }

  assignUserValues(user) {
    if (user) {
      var userInfoObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }

      userInfoObject.first_name = user?.first_name;
      userInfoObject.last_name = user?.last_name;
      if (user?.designation) {
        userInfoObject.designation = user?.designation;
      }
      if (user?.designation?.title) {
        userInfoObject.designation = user?.designation?.title;
      }
      if (user?.image?.token) {
        userInfoObject.image_token = user?.image.token
      }
      if (user?.image_token) {
        userInfoObject.image_token = user?.image_token
      }
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      if (user?.status?.id) {
        userInfoObject.status_id = user?.status.id
      }
      if (user?.status_id) {
        userInfoObject.status_id = user?.status_id
      }
      userInfoObject.department = null;
      return userInfoObject;
    }
  }

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;
  }

  editActionPlan() {
    if (ActionPlansStore.individualActionPlansDetails?.id) {
      this.actionPlansObject.values = {
        id: ActionPlansStore.individualActionPlansDetails?.id,
        title: ActionPlansStore.individualActionPlansDetails?.title,
        budget: ActionPlansStore.individualActionPlansDetails?.budget,
        meeting_id: ActionPlansStore.individualActionPlansDetails?.meeting,
        completion: ActionPlansStore.individualActionPlansDetails?.completion ? ActionPlansStore.individualActionPlansDetails?.completion : 0,
        start_date: ActionPlansStore.individualActionPlansDetails?.start_date,
        target_date: ActionPlansStore.individualActionPlansDetails?.target_date,
        description: ActionPlansStore.individualActionPlansDetails?.description,
        responsible_user_id: ActionPlansStore.individualActionPlansDetails?.responsible,
        meeting_action_plan_watcher_ids: ActionPlansStore.individualActionPlansDetails?.meeting,
      }

      this.actionPlansObject.type = 'Edit';
      ActionPlansStore.editFlag = true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }
  }

  addModelUpdate() {
    ActionPlansStore.action_plan_update = true;
    $(this.actionPlanUpdate.nativeElement).modal('show');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModelUpdate() {
    ActionPlansStore.action_plan_update = false;
    $(this.actionPlanUpdate.nativeElement).modal('hide');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    AppStore.showDiscussion = true;
    ActionPlansStore.unSetActionPlans();
    this.meetingPlanGetMeetingItemId();
  }

  openHistoryModal() {
    // this.historyPageChange(1);
    ActionPlansStore.action_plan_history = true;
    $(this.actionPlanHistory.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeHistoryModal() {
    ActionPlansStore.action_plan_history = false;
    $(this.actionPlanHistory.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    ActionPlansStore.unSetActionPlanHistory();
    AppStore.showDiscussion = true;
  }

  deleteActionPlan(id) {
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.title = 'Delete';
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // modal control event
  modalControl(status: boolean) {

    switch (this.popupObject.type) {
      case '': this.deleteActionPlans(status);
        break;
    }
  }

  // delete function call
  deleteActionPlans(status: boolean) {

    if (status && this.popupObject.id) {

      this._actionPlansService.delete(this.popupObject.id, `&meeting_ids=${MeetingsStore.meetingsId}`).subscribe(resp => {
            
        this._actionPlansService.getItems(false, `&meeting_ids=${MeetingsStore.meetingsId}`).subscribe((res) => {
          
          NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_Action_plan' });
          this._utilityService.detectChanges(this._cdr);
  
            if (res?.data[0]) {
              this.getActionPlan(res?.data[0]?.id);
              this.getSubmenu(res?.data[0]?.meeting_plan_id);
            }
          });
          
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl(`mrm/meeting-plans/${MeetingPlanStore.meetingPlanId}/meeting-plan-action-plan`);
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

  // kh-module base document
  viewDocument(type, documents, documentFile) {

    switch (type) {
      case "meeting-action-plan-update-document":
        this._meetingPlanFileService
          .getFilePreview(type, ActionPlansStore.individualActionPlansDetails.id, documentFile.id, documents.meeting_action_plan_update_id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;

      case "action-plan":
        this._meetingPlanFileService
          .getFilePreview(type, ActionPlansStore.individualActionPlansDetails.id, documentFile.id, documents.meeting_action_plan_update_id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;

      case "document-version":
        this._documentFileService
          .getFilePreview(type, documents.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;
    }
  }

  // kh-module base document
  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component = type;

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.updateId = document.meeting_action_plan_update_id;
      this.previewObject.componentId = ActionPlansStore.individualActionPlansDetails.id;

      this.previewObject.uploaded_user = ActionPlansStore.individualActionPlansDetails.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

   // Closes from preview
   closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }
  
  // kh-module base document- Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'meeting-action-plan-update-document')
      return this._meetingPlanFileService.getThumbnailPreview(type, token);
    else if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else if (type == 'action-plan')
      return this._meetingPlanFileService.getThumbnailPreview(type, token);
  }

  // kh-module base document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "meeting-action-plan-update-document":
        this._meetingPlanFileService.downloadFile(
          type,
          ActionPlansStore.individualActionPlansDetails.id,
          document.id,
          document.meeting_action_plan_update_id,
          document.title,
          document
        );
        break;
      case "action-plan":
        this._meetingPlanFileService.downloadFile(
          type,
          ActionPlansStore.individualActionPlansDetails.id,
          document.id,
          document.meeting_action_plan_update_id,
          document.title,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;
    }
  }

    // extension check function
    checkExtension(ext, extType) {
      return this._imageService.checkFileExtensions(ext, extType)
    }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ActionPlansStore.searchText = null;
    this.modalEventSubscription.unsubscribe();
    this.modelEventSubscriptionUpdate.unsubscribe();
    this.modelEventSubscriptionHistory.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    MeetingsStore.unSetMeetings();//meeting list
    ActionPlansStore.unSetActionPlans();//Action plan list
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
