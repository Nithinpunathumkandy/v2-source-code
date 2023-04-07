import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { BaActionPlanService } from 'src/app/core/services/business-assessments/action-plans/ba-action-plan.service';
import { AssessmentsStore } from 'src/app/stores/business-assessments/assessments/assessments.store';
import { BAActionPlanStore } from 'src/app/stores/business-assessments/assessments/assessment-action-plan.store';
import { BusinessAssessmentService } from 'src/app/core/services/business-assessments/business-assessment-service/business-assessment.service';


declare var $: any;

@Component({
  selector: 'app-action-plans',
  templateUrl: './action-plans.component.html',
  styleUrls: ['./action-plans.component.scss']
})
export class ActionPlansComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('actionPlanModal') actionPlanModal: ElementRef
  @ViewChild('actionPlanUpdate') actionPlanUpdate: ElementRef;
  @ViewChild('actionPlanHistory') actionPlanHistory: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  actionPlansObject = {
    type: null,
    values: null,
  }


  //Giving component as checklist parent to dismiss properly in event emittor.
  //Type is given to handle different ways of handling action plan add/edit.
  actionPlanData={
    values:null,
    type:'submenu-edit'
  }


  selectedMeeting: any = null;
  modalEventSubscription: any;
  modelEventSubscriptionUpdate: any;
  modelEventSubscriptionHistory: any;
  popupControlMeetingsEventSubscription: any;
  fileUploadPopupSubscriptionEvent: any;


  actionPlanFormSubscription:any
  actionPlanStatusModalSubscription:any
  actionPlanHistoryModalSubscription:any;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  MeetingsStore = MeetingsStore;
  // BAActionPlanStore = BAActionPlanStore;
  BAActionPlanStore=BAActionPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();
  actionPlanId: number;

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
    private _router: Router,
    private _renderer2: Renderer2,
    private _sanitizer: DomSanitizer,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _baActionPlanService:BaActionPlanService,
    private _baFileService:BusinessAssessmentService
  ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {

      
      NoDataItemStore.setNoDataItems({ title: "actionplans_nodata_title" });

      var subMenuItems = [

        // {activityName: null, submenuItem: {type: 'new_modal'}},
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);

      // this.noData(true);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openActionPlanForm();
            }, 1000)
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        //MeetingsStore.setmeetingPlaninsideMeetingAddFlag();
        this.openActionPlanForm();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    });

    // this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {

    //   this.closeFormModal(res);
    // });

    // this.modelEventSubscriptionUpdate = this._eventEmitterService.actionPlanUpadateModal.subscribe(res => {
    //   this.closeModelUpdate();
    // });

    // this.modelEventSubscriptionHistory = this._eventEmitterService.actionPlanHistoryModal.subscribe(res => {
    //   this.closeHistoryModal();
    // });

    this.actionPlanFormSubscription=this._eventEmitterService.businessAssessmentActionPlanForm.subscribe(res=>{

      this.closeActionPlanForm()
    })

    this.actionPlanStatusModalSubscription=this._eventEmitterService.baActionPlanStatusModal.subscribe(res=>{

      this.clsoeActionPlanStatusUpdateModal()
    })

    this.actionPlanHistoryModalSubscription=this._eventEmitterService.baActionPlanHistoryModal.subscribe(res=>{

      this.closeHistoryModal()
    })


    this.popupControlMeetingsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.changeZIndex();
    })


    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    this.pageChange(1);
  }


  pageChange(newPage: number = null) {
    if (newPage) BAActionPlanStore.setCurrentPage(newPage);
    this._baActionPlanService.getItems(false, `business_assessment_ids=${AssessmentsStore.assessmentId}`).subscribe((res) => {
      if (res?.data[0]) {
        this.getActionPlan(res?.data[0]?.id);
      }
      setTimeout(() =>
        this._utilityService.detectChanges(this._cdr), 100)
    });

  }

  // noData(value) {
  //   if (value) {
  //     NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_Action_plan' });
  //   } else {
  //     NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: null });
  //   }
  // }


  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      }
    }
  }

  addActionPlan() {

    this.selectedMeeting = {
      id: MeetingsStore.individualMeetingsDetails?.id,
      title: MeetingsStore.individualMeetingsDetails?.title,
      start: MeetingsStore.individualMeetingsDetails?.start,
    }
    BAActionPlanStore.unsetBAACtionPlanDetails()
    this.actionPlansObject.type = 'Add';
    // BAActionPlanStore.editFlag = false;
    this.actionPlansObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      ($(this.formModal.nativeElement) as any).modal('show');
    }, 100);
  }

  closeFormModal(res) { //it empty list add new date fix
    ($(this.formModal.nativeElement) as any).modal('hide');
    this.actionPlansObject.type = null;
    // if (res=='save')
      this.pageChange(1);
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
    BAActionPlanStore.unsetBAACtionPlanDetails();
 // Clear previous data from store
    this._baActionPlanService.getItem(id).subscribe(res => {
      this.actionPlanId = res.id;
      this._utilityService.detectChanges(this._cdr);
    })
    this._baActionPlanService.setSelected(id);
  }

  getDaysRemaining() {

    let startDate = new Date(BAActionPlanStore.BAActionPlanDetails?.target_date);

    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }
  getTotaldays() {
    let startDate = new Date(BAActionPlanStore.BAActionPlanDetails?.start_date);
    let targetDate = new Date(BAActionPlanStore.BAActionPlanDetails?.target_date);

    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;
    return this.Totaldays;

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


  editActionPlan() {
    if (BAActionPlanStore.BAActionPlanDetails?.id) {
      this.actionPlanData.values = {
        id: BAActionPlanStore.BAActionPlanDetails?.id,
        title: BAActionPlanStore.BAActionPlanDetails?.title,
        start_date: this._helperService.processDate(BAActionPlanStore.BAActionPlanDetails.start_date,'split'),
        target_date: this._helperService.processDate(BAActionPlanStore.BAActionPlanDetails.start_date,'split'),
        description: BAActionPlanStore.BAActionPlanDetails?.description,
        responsible_user_id: BAActionPlanStore.BAActionPlanDetails?.responsible_users,
        checklistId:BAActionPlanStore.BAActionPlanDetails.business_assessment_document_content_checklist.id
      }
      this._utilityService.detectChanges(this._cdr);
      this.openActionPlanForm();
    }
  }


  // addModelUpdate() {
  //   BAActionPlanStore.actionPlanStatusUpdateModal = true;
  //   $(this.actionPlanUpdate.nativeElement).modal('show');
  //   this._utilityService.detectChanges(this._cdr);
  // }

  // closeModelUpdate() {
  //   BAActionPlanStore.actionPlanStatusUpdateModal = false;
  //   $(this.actionPlanUpdate.nativeElement).modal('hide');
  //   this._utilityService.detectChanges(this._cdr);
  //   AppStore.showDiscussion = true;
  //   BAActionPlanStore.unsetBAActionPlans();
  //   this.pageChange(1);
  // }
  openActionPlanForm(){
    BAActionPlanStore.actionPlanUpdateModal = true;
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'z-index', '99999'); 
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'display', 'block'); 
    $(this.actionPlanModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
   
    
  }
  
  closeActionPlanForm(){
  
    $(this.actionPlanModal.nativeElement).modal('hide');
    BAActionPlanStore.actionPlanUpdateModal = false;
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'z-index', '9999'); 
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'display', 'none'); 
    $('.modal-backdrop').remove();
    BAActionPlanStore.unsetBAActionPlans();
    this.pageChange(1);
  }

  openActionPlanStatusUpdateModal() {
    BAActionPlanStore.actionPlanStatusUpdateModal = true;
    $(this.actionPlanUpdate.nativeElement).modal('show');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  clsoeActionPlanStatusUpdateModal() {
    BAActionPlanStore.actionPlanStatusUpdateModal = false;
    $(this.actionPlanUpdate.nativeElement).modal('hide');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    AppStore.showDiscussion = true;
  }

  openHistoryModal(){

    BAActionPlanStore.actionPlanStatusHistoryModal = true;
     this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'z-index', '99999'); 
     this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'display', 'block'); 
     $(this.actionPlanHistory.nativeElement).modal('show');
     this._utilityService.detectChanges(this._cdr);
   }
 
   closeHistoryModal(){
 
     BAActionPlanStore.actionPlanStatusHistoryModal = false;
     $(this.actionPlanHistory.nativeElement).modal('hide');
     this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'z-index', '9999'); 
     this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'display', 'none'); 
     $('.modal-backdrop').remove();
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

      this._baActionPlanService.delete(this.popupObject.id, `business_assessment_ids=${AssessmentsStore.assessmentId}`).subscribe(resp => {
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

   // kh-module base document
   viewDocument(type, documents, documentFile) {

    switch (type) {
      case "business-assessment-action-plan":
        this._baFileService
          .getFilePreview(type, BAActionPlanStore.BAActionPlanDetails.id, documentFile.id, documents.meeting_action_plan_update_id)
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

      // case "action-plan":
        // this._meetingPlanFileService
        //   .getFilePreview(type, BAActionPlanStore.BAActionPlanDetails.id, documentFile.id, documents.meeting_action_plan_update_id)
        //   .subscribe((res) => {
        //     var resp: any = this._utilityService.getDownLoadLink(
        //       res,
        //       documents.title
        //     );
        //     this.openPreviewModal(type, resp, documentFile, documents);
        //   }),
        //   (error) => {
        //     if (error.status == 403) {
        //       this._utilityService.showErrorMessage(
        //         "Error",
        //         "Permission Denied"
        //       );
        //     } else {
        //       this._utilityService.showErrorMessage(
        //         "Error",
        //         "Unable to generate Preview"
        //       );
        //     }
        //   };
        // break;

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
      this.previewObject.componentId = BAActionPlanStore.BAActionPlanDetails.id;

      this.previewObject.uploaded_user = BAActionPlanStore.BAActionPlanDetails.created_by;
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
  // createImageUrl(type, token) {
  //   if (type == 'meeting-action-plan-update-document')
  //     return this._meetingPlanFileService.getThumbnailPreview(type, token);
  //   else if (type == 'document-version')
  //     return this._documentFileService.getThumbnailPreview(type, token);
  //   else if (type == 'action-plan')
  //     return this._meetingPlanFileService.getThumbnailPreview(type, token);
  // }

  // kh-module base document
  // downloadDocumentFile(type, document, docs?) {
  //   event.stopPropagation();
  //   switch (type) {
  //     case "meeting-action-plan-update-document":
  //       this._meetingPlanFileService.downloadFile(
  //         type,
  //         BAActionPlanStore.BAActionPlanDetails.id,
  //         document.id,
  //         document.meeting_action_plan_update_id,
  //         document.title,
  //         document
  //       );
  //       break;
  //     case "action-plan":
  //       this._meetingPlanFileService.downloadFile(
  //         type,
  //         BAActionPlanStore.BAActionPlanDetails.id,
  //         document.id,
  //         document.meeting_action_plan_update_id,
  //         document.title,
  //         document
  //       );
  //       break;
  //     case "document-version":
  //       this._documentFileService.downloadFile(
  //         type,
  //         document.document_id,
  //         docs.id,
  //         null,
  //         document.title,
  //         docs
  //       );
  //       break;
  //   }
  // }

    // extension check function
    checkExtension(ext, extType) {
      return this._imageService.checkFileExtensions(ext, extType)
    }



  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BAActionPlanStore.searchText = null;
    // this.modalEventSubscription.unsubscribe();
    // this.modelEventSubscriptionUpdate.unsubscribe();
    // this.modelEventSubscriptionHistory.unsubscribe();
    this.actionPlanFormSubscription.unsubscribe();
    this.actionPlanStatusModalSubscription.unsubscribe();
    this.actionPlanHistoryModalSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    BAActionPlanStore.unsetBAActionPlans();//action plan list
    MeetingsStore.unsetIndividualMeetingsDetails(); //meeting detials
  }


}
