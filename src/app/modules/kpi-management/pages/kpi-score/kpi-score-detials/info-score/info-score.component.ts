import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { KpiManagementFileService } from 'src/app/core/services/kpi-management/file-service/kpi-management-file.service';
import { KpiScoreService } from 'src/app/core/services/kpi-management/kpi-score/kpi-score.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiScoreStore } from 'src/app/stores/kpi-management/kpi-score/kpi-score-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-info-score',
  templateUrl: './info-score.component.html',
  styleUrls: ['./info-score.component.scss']
})
export class InfoScoreComponent implements OnInit, OnDestroy {
  @ViewChild('review') review: ElementRef;
  @ViewChild('revert') revert: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('updateScoreModal') updateScoreModal: ElementRef;
  @ViewChild('activityLogsModal') activityLogsModal: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;//-document
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistoryModal') workflowHistoryModal: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  KpiScoreStore = KpiScoreStore;
  reactionDisposer: IReactionDisposer;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  hover = false;
  activeIndex = null;
  

  popupObject = {
    type: '',
    id: null,
    position: null,
    title:'',
    subtitle:''
  };

  ScorueObject={
    id:null
  }
  
  // -document
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  popupScorueObject:any;
  scoreModal:boolean=false;
  componeDistory:boolean=false;

  deleteEventSubscription: any;
  kpiActivityLogsSubscription:any;
  workflowEventSubscription: any;
  updateScoreEventSubscription:any;
  reviewSubmitEventSubscription:any;
  revertSubmitEventSubscription:any;
  workflowHistoryEventSubscription: any;

  constructor(
    private _renderer2: Renderer2,
    private _cdr:ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _kpiScoreService: KpiScoreService,
    private _imageService:ImageServiceService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
    private _kpiManagementFileService: KpiManagementFileService
  ) { }

  ngOnInit(): void {
    this.componeDistory=true;
    AppStore.showDiscussion = true;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"kpi_score",
        path:`/kpi-management/kpi-scores`
      });
    }
    
    this.reactionDisposer = autorun(() => {

      if (SubMenuItemStore.clikedSubMenuItem) {
        
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "update_modal":
              this.updateScoreOpenModal();
            break;
          case 'submit':
              this.submit();
            break;
          case 'revert':
              this.revertSubmitModal();
            break;
          case 'review':
              this.reviewSubmitModal();
            break;
          case 'workflow':
              this.workflowOpenModal();
            break;
          case 'history':
              this.workflowHistoryOpenModal();
            break;  
          break;
          case 'activity_log':
            this.activityLogsOpenModal();
          break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.kpiActivityLogsSubscription = this._eventEmitterService.kpiActivityLogsModal.subscribe(res => {
      this.activityLogsCloseModal();
    });

    this.updateScoreEventSubscription = this._eventEmitterService.updateScoreModal.subscribe(res => {
      this.updateCloseModal(res);
    });

    this.reviewSubmitEventSubscription = this._eventEmitterService.kpiScoreReviewSubmitModal.subscribe(res => {
      this.reviewSubmitCloseModal(res);
    });

    this.revertSubmitEventSubscription = this._eventEmitterService.kpiScoreRevertModal.subscribe(res => {
      this.revertSubmitCloseModal(res);
    });

    this.workflowEventSubscription = this._eventEmitterService.kpiWorkflowModal.subscribe(res => {
      this.workflowColseModal();
    });
    
    this.workflowHistoryEventSubscription = this._eventEmitterService.kpiWorkflowHistoryModal.subscribe(res => {
      this.workflowHistoryCloseModal();
    });


    setTimeout(() => {
      window.addEventListener('click', this.clickEvent, false);
      this._utilityService.detectChanges(this._cdr);
    }, 250);

    this.getDetials();
    this.getWorkFloWDetails();
  }

  getDetials(){
    this._kpiScoreService.getItem(KpiScoreStore.kpiScoreId).subscribe(res=>{
      if(KpiScoreStore.individualLoaded && this.componeDistory){
        this.setSubmenu();
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getWorkFloWDetails(){
    this._kpiScoreService.getWorkFlow(KpiScoreStore.kpiScoreId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

// submenu

  setSubmenu(){
    let subMenuItems;
    subMenuItems = [
      {activityName: null, submenuItem: { type: 'review',title:'Review' } },
      {activityName: null, submenuItem: {type:'revert',title:'Send Back'} },
      {activityName: null, submenuItem: { type: 'update_modal' } },
      {activityName:null, submenuItem: { type: 'activity_log' } },
      {activityName: null, submenuItem: {type: 'close',path: KpiScoreStore.path } },
    ]
    //1. kpi status approved (update) else (close)
    if(KpiScoreStore.individualKpiScoreDetails?.kpi_management_kpi?.kpi_management_status?.type=='approved'){
      //1. status (not-update, send-back) response users (updae, close) else (close)
      //2. status (in-review) review user (review,revert) else (close)
      //3. status (reviewed) work flow finshed (close)
      if(KpiScoreStore.individualKpiScoreDetails?.kpi_management_kpi_score_status?.type=='not-updated' || KpiScoreStore.individualKpiScoreDetails?.kpi_management_kpi_score_status?.type=='send-back'){
    
        if(this.workFlowResponsbleUsers()){
          subMenuItems = [
            {activityName: 'UPDATE_KPI_MANAGEMENT_KPI_SCORE', submenuItem: { type: 'update_modal' } },
            {activityName:null, submenuItem: {type: 'workflow',title : ''}},
            {activityName:null, submenuItem: {type: 'history',title : ''}},
            {activityName: 'KPI_MANAGEMENT_KPI_SCORE_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
            {activityName: null, submenuItem: {type: 'close',path: KpiScoreStore.path } },
          ]
        }else{
          subMenuItems = [
            {activityName:null, submenuItem: {type: 'workflow',title : ''}},
            {activityName:null, submenuItem: {type: 'history',title : ''}},
            {activityName: 'KPI_MANAGEMENT_KPI_SCORE_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
            {activityName: null, submenuItem: {type: 'close',path: KpiScoreStore.path } },
          ]
        }
      } else if(KpiScoreStore.individualKpiScoreDetails?.kpi_management_kpi_score_status?.type=='updated'){
        if(this.workFlowResponsbleUsers()){
          subMenuItems = [
            {activityName: 'UPDATE_KPI_MANAGEMENT_KPI_SCORE', submenuItem: { type: 'update_modal' } },
            {activityName:null,submenuItem:{type:'submit',title : ''}},
            {activityName:null, submenuItem: {type: 'workflow',title : ''}},
            {activityName:null, submenuItem: {type: 'history',title : ''}},
            {activityName: 'KPI_MANAGEMENT_KPI_SCORE_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
            {activityName: null, submenuItem: {type: 'close',path: KpiScoreStore.path } },
          ]
        }else{
          subMenuItems = [
            {activityName:null, submenuItem: {type: 'workflow',title : ''}},
            {activityName:null, submenuItem: {type: 'history',title : ''}},
            {activityName: 'KPI_MANAGEMENT_KPI_SCORE_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
            {activityName: null, submenuItem: {type: 'close',path: KpiScoreStore.path } },
          ]
        }
      } else if(KpiScoreStore.individualKpiScoreDetails?.kpi_management_kpi_score_status?.type=='in-review'){
      
        if(this.isUser()){
          subMenuItems = [
            {activityName: null, submenuItem: { type: 'review' } },
            {activityName: null, submenuItem: {type:'revert',title:'Send Back'} },
            {activityName:null, submenuItem: {type: 'workflow',title : ''}},
            {activityName:null, submenuItem: {type: 'history',title : ''}},
            {activityName: 'KPI_MANAGEMENT_KPI_SCORE_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
            {activityName: null, submenuItem: {type: 'close',path: KpiScoreStore.path } },
          ]
        }else{
          subMenuItems = [
            {activityName:null, submenuItem: {type: 'workflow',title : ''}},
            {activityName:null, submenuItem: {type: 'history',title : ''}},
            { activityName:'KPI_MANAGEMENT_KPI_SCORE_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
            {activityName: null, submenuItem: {type: 'close',path: KpiScoreStore.path } },
          ]
        }
      } else if(KpiScoreStore.individualKpiScoreDetails?.kpi_management_kpi_score_status?.type=='reviewed'){
        subMenuItems = [
          {activityName:null, submenuItem: {type: 'workflow',title : ''}},
          {activityName:null, submenuItem: {type: 'history',title : ''}},
          { activityName: 'KPI_MANAGEMENT_KPI_SCORE_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
          {activityName: null, submenuItem: {type: 'close',path: KpiScoreStore.path } },
        ]
      }
    }else{
      subMenuItems = [
        {activityName:null, submenuItem: {type: 'workflow',title : ''}},
        {activityName:null, submenuItem: {type: 'history',title : ''}},
        { activityName:'KPI_MANAGEMENT_KPI_SCORE_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
        {activityName: null, submenuItem: {type: 'close',path: KpiScoreStore.path } },
      ]
    }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
  }

  workFlowResponsbleUsers(){
    for (let i of KpiScoreStore.individualKpiScoreDetails?.kpi_management_kpi?.responsible_users) {

      if(i?.id==AuthStore.user.id){
        return true;
      }
    }

  }

  isUser() {
    if(KpiScoreStore?.individualLoaded){
      for (let i of KpiScoreStore?.workflowDetails) {
        if(i.level== KpiScoreStore.individualKpiScoreDetails?.next_review_user_level){
          var pos=i.kpi_workflow_item_users.findIndex(e=>e.id==AuthStore.user.id)
          if(pos!=-1)
            return true;
          else
            return false
        }
      }
    }
    else{
      return false;
    }
  }
  
  //** submenu*/


  getColorKey(colorCode?){
      var label_color = colorCode.split('-');
    return 'draft-tag-'+label_color[0]
  }

  getEmployeePopupDetails(users, created?: string) { //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }

  getNoDataSource(type){
    let noDataSource = {
      noData:"no_data_found", border: false, imageAlign: type
    }
    return noDataSource;
  }


  updateScoreOpenModal(){
    this.scoreModal=true;
    this.popupScorueObject=KpiScoreStore.individualKpiScoreDetails;
    setTimeout(() => {
      $(this.updateScoreModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  updateCloseModal(res){
    this.scoreModal=false;
    $(this.updateScoreModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.popupScorueObject=null;

    KpiScoreStore.individualLoaded=false;
    this.getDetials();
  }

  submit(){
    this.popupObject.id = KpiScoreStore.kpiScoreId;
    this.popupObject.type = 'submit';
    this.popupObject.subtitle="submit_kpi_score_for_review";
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  reviewSubmitModal(){
    this.popupScorueObject=KpiScoreStore.individualKpiScoreDetails;
    setTimeout(() => {
      $(this.review.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  reviewSubmitCloseModal(res){
    $(this.review.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    if(res){
      KpiScoreStore.individualLoaded=false;
      this.getDetials();
    }
  }

  revertSubmitModal(){
    this.popupScorueObject=KpiScoreStore.individualKpiScoreDetails;
    $(this.revert.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  revertSubmitCloseModal(res){
    setTimeout(() => {
      $(this.revert.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    },100);
    if(res){
      KpiScoreStore.individualLoaded=false;
      this.getDetials();
    }
  }

  workflowHistoryOpenModal(){
    KpiScoreStore.workflow_history_form_modal=true;
    setTimeout(() => {
      $(this.workflowHistoryModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  workflowHistoryCloseModal(){
    KpiScoreStore.workflow_history_form_modal=false;
    $(this.workflowHistoryModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  workflowOpenModal(){
    KpiScoreStore.workflow_form_modal=true;
    setTimeout(() => {
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  workflowColseModal(){
    KpiScoreStore.workflow_form_modal=false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
  }

  // Activity logs
  activityLogsOpenModal(){
    KpiScoreStore.activity_log_form_modal=true;
    setTimeout(() => {
      $(this.activityLogsModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  activityLogsCloseModal(){
    KpiScoreStore.activity_log_form_modal=false;
    $(this.activityLogsModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }
  // **Activity logs

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'submit': this.submitKpiScore(status);
        break;
      default:
      break;
    }
  }

  submitKpiScore(status){

    if (status && this.popupObject.id) {
      KpiScoreStore.individualLoaded=false;

      this._kpiScoreService.submit(this.popupObject.id).subscribe(res=>{
        this.getDetials();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        
        }, 500);
        this.clearDeleteObject();
        },(err: HttpErrorResponse)=>{
          KpiScoreStore.individualLoaded=true;
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  
  }

  clearDeleteObject(){//delete
    setTimeout(() => {
      this.popupObject.id = null;
      this.popupObject.type = '';
    }, 500);
  }

  // kh-module base document-document
  viewDocument(type, documents, documentFile) {
  
    switch (type) {
      case "kpi-score-document":
        this._kpiManagementFileService
          .getFilePreview(type, documents.kpi_management_kpi_score_id, documentFile.id)
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

  // kh-module base document- Returns image url according to type and token-document
  createImageUrl(type, token) {
    if(type=='kpi-score-document')
    return this._kpiManagementFileService.getThumbnailPreview(type, token);
    else
    return this._documentFileService.getThumbnailPreview(type, token);

  }

  // kh-module base document-document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "kpi-score-document":
        this._kpiManagementFileService.downloadFile(
          type,
          document.kpi_management_kpi_score_id,
          document.id,
          null,
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

  // kh-module base document-document
  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component=type;
  
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.kpi_management_kpi_score_id;
      
      this.previewObject.uploaded_user = KpiScoreStore.individualKpiScoreDetails?.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Closes from preview-document
  closePreviewModal(event) {
  $(this.filePreviewModal.nativeElement).modal("hide");
  this.previewObject.preview_url = "";
  this.previewObject.uploaded_user = null;
  this.previewObject.created_at = "";
  this.previewObject.file_details = null;
  this.previewObject.componentId = null;
  }

  // extension check function-document
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }  
  
  clickEvent = (event: any): void => {
    this.activeIndex = null;
    this.hover = false;
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.updateScoreEventSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.kpiActivityLogsSubscription.unsubscribe();
    this.reviewSubmitEventSubscription.unsubscribe();
    this.revertSubmitEventSubscription.unsubscribe();
    this.workflowEventSubscription.unsubscribe();
    this.workflowHistoryEventSubscription.unsubscribe();
    KpiScoreStore.unsetIndividualKpiScoreDetails();
    KpiScoreStore.setPath('../');
    this.componeDistory=false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
  }
}

