import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { KpiManagementFileService } from 'src/app/core/services/kpi-management/file-service/kpi-management-file.service';
import { ImprovementLansService } from 'src/app/core/services/kpi-management/improvement-plans/improvement-lans.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ImprovementPlansStore } from 'src/app/stores/kpi-management/improvement-plans/improvement-plans-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-improvement-plans-details',
  templateUrl: './improvement-plans-details.component.html',
  styleUrls: ['./improvement-plans-details.component.scss']
})
export class ImprovementPlansDetailsComponent implements OnInit, OnDestroy {
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('UpdateModal') UpdateModal: ElementRef;
  @ViewChild('HistoryModal') HistoryModal: ElementRef;
  @ViewChild ('filePreviewModal') filePreviewModal: ElementRef;//document
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('activityLogsModal') activityLogsModal: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ImprovementPlansStore = ImprovementPlansStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  modalEventSubscription: any;
  kpiActivityLogsSubscription: any;
  modelEventSubscriptionUpdate: any;
  modelEventSubscriptionHistory: any;
  popupControlEventSubscription: any;

  improvementPlanObject = {
    type:null,
    values: null,
  };

  daysDue:number=0;
  Totaldays:number=0;
  remainingDate:number=0;
  remainingDateGraph:number=0;
  todayDate:any = new Date();

  //document
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    updateId:null,
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  
  constructor(  
    private _router:Router,
    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _imageService:ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _improvementLansService: ImprovementLansService,
    private _kpiManagementFileService: KpiManagementFileService
  ) { }

  ngOnInit(): void {
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; 
      ImprovementPlansStore.setImprovementPlansId(id);
      this.getDetails(id);
    })
    
    AppStore.showDiscussion = true;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"improvement_plans",
        path:`/kpi-management/improvement-plans`
      });
    }

    this.reactionDisposer = autorun(() => {
      
      this.subMenu();

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "go_to_kpi":
            this.gotoKpiPage();
          break;
          case "edit_modal":
              this.getEdit();
            break;
          case "delete":
            this.delete(ImprovementPlansStore.ImprovementPlansId);
          break;
          case 'activity_log':
            this.activityLogsOpenModal();
          break;
          case "update_modal":
            this.openModelUpdate();
          break;
          case 'history':
            this.openModalHistory();
          break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.kpiActivityLogsSubscription = this._eventEmitterService.kpiActivityLogsModal.subscribe(res => {
      this.activityLogsCloseModal();
    });

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });

    this.modelEventSubscriptionHistory = this._eventEmitterService.kpiImprovementPlansHistoryModal.subscribe(res => {
      this.closeModalHistory();
    });

    this.modelEventSubscriptionUpdate = this._eventEmitterService.kpiImprovementPlansUpadateModal.subscribe(res => {
      this.closeModelUpdate();
    });
    
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });
  }

  getDetails(id){
    this._improvementLansService.getItem(id).subscribe(res => {
      
      this.subMenu();
      this.getDatesRemaining();
      this.daysRemainingGraph();
    this._utilityService.detectChanges(this._cdr);
    });
  }

  subMenu(){

    let subMenuItems= [];
    if(ImprovementPlansStore.individualImprovementPlansDetails?.improvement_plan_status?.type=="closed"){
      subMenuItems = [
        { submenuItem: { type: 'go_to_kpi' }},
        { activityName: 'KM_KPI_IMPROVEMENT_PLAN_UPDATE_LIST', submenuItem: { type: 'history' } },
        { activityName: 'KM_KPI_IMPROVEMENT_PLAN_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
        { activityName: null, submenuItem: { type: 'close',path:ImprovementPlansStore.path} },
      ];
    }else if (ImprovementPlansStore.individualImprovementPlansDetails?.improvement_plan_status?.type=="resolved"){
      if(this.workFlowResponsbleUsers()){
        subMenuItems = [
          { submenuItem: { type: 'go_to_kpi' }},
          { activityName: 'CREATE_KM_KPI_IMPROVEMENT_PLAN_UPDATE', submenuItem: { type: 'update_modal' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
          { activityName: null, submenuItem: { type: 'close',path:ImprovementPlansStore.path} },
        ];
      }else{
        subMenuItems = [
          { submenuItem: { type: 'go_to_kpi' }},
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
          { activityName: null, submenuItem: { type: 'close',path:ImprovementPlansStore.path} },
        ];
      }
    }else if (ImprovementPlansStore.individualImprovementPlansDetails?.improvement_plan_status?.type=="wip") {
      if(this.workFlowResponsbleUsers()){
        subMenuItems = [
          { submenuItem: { type: 'go_to_kpi' }},
          { activityName: 'CREATE_KM_KPI_IMPROVEMENT_PLAN_UPDATE', submenuItem: { type: 'update_modal' } },
          { activityName: 'UPDATE_KM_KPI_IMPROVEMENT_PLAN', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_KM_KPI_IMPROVEMENT_PLAN', submenuItem: { type: 'delete' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
          { activityName: null, submenuItem: { type: 'close',path:ImprovementPlansStore.path} },
        ];
      }else{
        subMenuItems = [
          { submenuItem: { type: 'go_to_kpi' }},
          { activityName: 'UPDATE_KM_KPI_IMPROVEMENT_PLAN', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_KM_KPI_IMPROVEMENT_PLAN', submenuItem: { type: 'delete' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
          { activityName: null, submenuItem: { type: 'close',path:ImprovementPlansStore.path} },
        ];
      }
    }else{
      if(this.workFlowResponsbleUsers()){
        subMenuItems = [
          { submenuItem: { type: 'go_to_kpi' }},
          { activityName: 'CREATE_KM_KPI_IMPROVEMENT_PLAN_UPDATE', submenuItem: { type: 'update_modal' } },
          { activityName: 'UPDATE_KM_KPI_IMPROVEMENT_PLAN', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_KM_KPI_IMPROVEMENT_PLAN', submenuItem: { type: 'delete' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
          { activityName: null, submenuItem: { type: 'close',path:ImprovementPlansStore.path} },
        ];
      }else{
        subMenuItems = [
          { submenuItem: { type: 'go_to_kpi' }},
          { activityName: 'UPDATE_KM_KPI_IMPROVEMENT_PLAN', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_KM_KPI_IMPROVEMENT_PLAN', submenuItem: { type: 'delete' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: 'KM_KPI_IMPROVEMENT_PLAN_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
          { activityName: null, submenuItem: { type: 'close',path:ImprovementPlansStore.path} },
        ];
      }
    }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
  }

  workFlowResponsbleUsers(){     
      if(ImprovementPlansStore.individualImprovementPlansDetails?.responsible_user?.id==AuthStore.user.id){
        return true;
      }
  }

  gotoKpiPage(){
    this._router.navigateByUrl('kpi-management/kpis/'+ ImprovementPlansStore.individualImprovementPlansDetails?.kpi_management_kpi_id);
  }

  getColorKey(type){
    let label_color;
    if(type='kpi')
      label_color =  ImprovementPlansStore.individualImprovementPlansDetails?.kpi_management_kpi?.kpi_management_status?.label.split('-');
    
    return 'draft-tag-'+label_color[0];
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  daysRemainingGraph(){
    let startDate = new Date(ImprovementPlansStore.individualImprovementPlansDetails?.start_date);
    let targetDate = new Date(ImprovementPlansStore.individualImprovementPlansDetails?.target_date);

    let days = Math.floor((startDate.getTime() - targetDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays=Math.abs(days)+1;

    if(this.getDatesRemaining()==0){
      this.remainingDateGraph = Math.floor((targetDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
      if(this.remainingDateGraph>=0){
        this.remainingDateGraph=this.remainingDateGraph+1;
        this.getDueDates(this.remainingDateGraph, this.Totaldays);
      }
      else
        this.remainingDateGraph=0;
    }else{
      this.remainingDateGraph=0;
    }
    
  }

  getDueDates(remainingDate, Totalday){
    if(remainingDate == Totalday)
      this.daysDue=0
      else
      this.daysDue=(Totalday-remainingDate)-1;
  }

  getDatesRemaining(){

    let startDate = new Date(ImprovementPlansStore.individualImprovementPlansDetails?.start_date);

    this.remainingDate = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if(this.remainingDate>=0)
      this.remainingDate=this.remainingDate+1;
    else
      this.remainingDate=0;
    
    return this.remainingDate;
  }

// Edit
  getEdit() {
    if(ImprovementPlansStore.individualImprovementPlansDetails?.id){
      this.improvementPlanObject.type = 'Edit';
      ImprovementPlansStore.editFlag=true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }  
  }
//**Edit

//delete
  delete(id){
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.title='Delete';
    this.popupObject.subtitle = 'improvement_plan_delete_subtitle';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
    
  }

  // modal control event
  modalControl(status: boolean) {

    switch (this.popupObject.type) {
      case '': this.deleteItem(status);
        break;
    }
  }

  // delete function call
  deleteItem(status: boolean) {
    
    if (status && this.popupObject.id) {

      this._improvementLansService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('kpi-management/improvement-plans');
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

  //**delete
  //Update progress Modal
  openModelUpdate(){
    ImprovementPlansStore.update_modal_form=true;
    setTimeout(() => {
      $(this.UpdateModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.UpdateModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.UpdateModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.UpdateModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }  

  closeModelUpdate(){
    this.getDetails(ImprovementPlansStore.ImprovementPlansId);
    ImprovementPlansStore.update_modal_form=false;
    $(this.UpdateModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.UpdateModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.UpdateModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.UpdateModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    AppStore.showDiscussion = true;
  }
   //**Update progress Modal

  //History
  openModalHistory(){
    ImprovementPlansStore.history_modal_form=true;
    setTimeout(() => {
      $(this.HistoryModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.HistoryModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.HistoryModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.HistoryModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  closeModalHistory(){
    ImprovementPlansStore.history_modal_form=false;
    $(this.HistoryModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.HistoryModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.HistoryModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.HistoryModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    AppStore.showDiscussion = true;
  }
  //**History

  // Activity logs
  activityLogsOpenModal(){
    ImprovementPlansStore.activity_log_form_modal=true;
    setTimeout(() => {
      $(this.activityLogsModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  activityLogsCloseModal(){
    ImprovementPlansStore.activity_log_form_modal=false;
    $(this.activityLogsModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }
  // **Activity logs

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
    this.getDetails(ImprovementPlansStore.ImprovementPlansId);
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.improvementPlanObject.type = null;
    AppStore.showDiscussion = true;
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
        // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
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

  //document
  // kh-module base document-document
  viewDocument(type, documents, documentFile) {
  
    switch (type) {
      case "improvement-plans-document":
        this._kpiManagementFileService
          .getFilePreview(type, documents.kpi_management_kpi_improvement_plan_id, documentFile.id)
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

      case "improvement-plans-update-document":
        this._kpiManagementFileService
          .getFilePreview(type, ImprovementPlansStore.ImprovementPlansId, documentFile.id, documents.kpi_management_kpi_improvement_plan_update_id)
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
    if(type=='improvement-plans-update-document')
      return this._kpiManagementFileService.getThumbnailPreview(type, token);
    else if(type=='improvement-plans-document')
      return this._kpiManagementFileService.getThumbnailPreview(type, token);
    else
      return this._documentFileService.getThumbnailPreview(type, token);
  }
  
  // kh-module base document-document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "improvement-plans-document":
        this._kpiManagementFileService.downloadFile(
          type,
          document.kpi_management_kpi_improvement_plan_id,
          document.id,
          null,
          document.title,
          document
        );
        break;
      case "improvement-plans-update-document":
        this._kpiManagementFileService.downloadFile(
          type,
          ImprovementPlansStore.ImprovementPlansId,
          document.id,
          document.kpi_management_kpi_improvement_plan_update_id,
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
      if(type=="improvement-plans-update-document"){
        this.previewObject.updateId = document.kpi_management_kpi_improvement_plan_update_id;
        this.previewObject.componentId = ImprovementPlansStore.ImprovementPlansId;
      }else{
        this.previewObject.componentId = document.kpi_management_kpi_improvement_plan_id;
      }
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      
      this.previewObject.uploaded_user = ImprovementPlansStore.individualImprovementPlansDetails?.created_by;
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
//**document

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ImprovementPlansStore.unsetIndividualImprovementPlansDetails();
    ImprovementPlansStore.setPath('../');
    this.modalEventSubscription.unsubscribe();
    this.kpiActivityLogsSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.modelEventSubscriptionUpdate.unsubscribe();
    this.modelEventSubscriptionHistory.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
  }
}
