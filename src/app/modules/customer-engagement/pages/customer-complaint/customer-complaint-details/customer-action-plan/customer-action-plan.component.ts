import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { autorun, IReactionDisposer } from 'mobx';
import { CustomerComplaintActionPlanService } from 'src/app/core/services/customer-satisfaction/customer-complaint-action-plan/customer-complaint-action-plan.service';
import { CustomerComplaintService } from 'src/app/core/services/customer-satisfaction/customer-complaint/customer-complaint.service';
import { CustomerEngagementFileServiceService } from 'src/app/core/services/customer-satisfaction/customer-engagement-file-service/customer-engagement-file-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CustomerComplaintActionPlanStore } from 'src/app/stores/customer-engagement/customer-complaint-action-plans/customer-complaint-action-plans-store';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any

@Component({
  selector: 'app-customer-action-plan',
  templateUrl: './customer-action-plan.component.html',
  styleUrls: ['./customer-action-plan.component.scss']
})
export class CustomerActionPlanComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('UpdateCAformModal', { static: true }) UpdateCAformModal: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;

  selectedIndex = null;
  noDataMessage = "no_action_plan_to_show";
  modalEventSubscription: any;
  popupControlEventSubscription: any;
  PreviewSubscriptionEvent : any;
  fileUploadPopupSubscriptionEvent :any;
  updateSubscriptionEvent : any;
  historySubscriptionEvent : any;
  reactionDisposer: IReactionDisposer;
  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null

  }

  caUpdateObject = {
    component: '',
    values: null,
    type: null
  };

  watcherDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  customerComplaintActionPLanObject = {
    type: null,
    values: null,
    page: false
  }

  previewObject = {
    fid: null,
    ca_id: null,
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null,
    componentId: null,
    type: null
  };

  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();

  AuthStore = AuthStore;
  AppStore = AppStore;
  CustomerComplaintActionPlanStore = CustomerComplaintActionPlanStore;
  CustomerComplaintStore = CustomerComplaintStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  constructor(
    private _imageService: ImageServiceService,
    private _customerComplaintActionPlanService: CustomerComplaintActionPlanService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _helperService: HelperServiceService,
    private _sanitizer: DomSanitizer,
    private _fileService: CustomerEngagementFileServiceService
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_customer_complaint_action_plan' });
    CustomerComplaintActionPlanStore.complaintActionPlanId = null;
    this.getActionPlan(1);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {

      if (NoDataItemStore.clikedNoDataItem) {
        this.addCustomerComplaintActionPlan();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      var subMenuItems = [
        { activityName: 'CREATE_CUSTOMER_COMPLAINT_ACTION_PLAN', submenuItem: { type: 'new_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_CUSTOMER_COMPLAINT_ACTION_PLAN')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addCustomerComplaintActionPlan();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.modalEventSubscription = this._eventEmitterService.addCustomerComplaintActionPlanModal.subscribe(res => {
      this.closeFormModal();
    });

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.PreviewSubscriptionEvent = this._eventEmitterService.customerCorrectiveACtionPreviewModal.subscribe(res => {
      this.closePreviewModal();
      this.changeZIndex();
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.changeZIndex();
    })

    this.updateSubscriptionEvent = this._eventEmitterService.caResolveModalControl.subscribe(res => {
      this.closeUpdateModal();
    })

    this.historySubscriptionEvent = this._eventEmitterService.cahistoryModalControl.subscribe(res => {
      this.closeHistoryModal();
    })

  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteCustomerComplaintActionPlan(status)
        break;
    }

  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_customer_complaint_action_plan';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteCustomerComplaintActionPlan(status: boolean) {
    if (status && this.popupObject.id) {
      this._customerComplaintActionPlanService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.getActionPlan();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
    // this.getActionPlan();
  }

  editCustomerComplaintActionPlan(id) {
    event.stopPropagation();
    CustomerComplaintActionPlanStore.setSubMenuHide(true);
    this.customerComplaintActionPLanObject.page = true;
    // CustomerComplaintStore.pageTagName = 'Type'
    this._customerComplaintActionPlanService.getItem(id).subscribe(res => {
      if (res) {
        this.customerComplaintActionPLanObject.values = res;
        this.customerComplaintActionPLanObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }
    })
  }

  closeFormModal() {
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    let pageNumber = this.customerComplaintActionPLanObject.type == 'Add' ? CustomerComplaintActionPlanStore.last_page : CustomerComplaintActionPlanStore.currentPage;
    this.getActionPlan(pageNumber, true);
    CustomerComplaintActionPlanStore.unsetIndivitualCustomerComplaintActionPlan();
    if (CustomerComplaintActionPlanStore.complaintActionPlanId) {
      this.getActionPlanDetails(CustomerComplaintActionPlanStore.complaintActionPlanId);
    }
    this.customerComplaintActionPLanObject.type = null;
    this._eventEmitterService.dismissCustomerComplaint()
    this._utilityService.detectChanges(this._cdr);
  }

  openFormModal() {
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }


  addCustomerComplaintActionPlan() {
    CustomerComplaintActionPlanStore.setSubMenuHide(true);
    this.customerComplaintActionPLanObject.page = true;
    this.customerComplaintActionPLanObject.type = 'Add';
    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);
  }

  getActionPlan(newPage: number = null, closeModal: boolean = false) {
    if (newPage) CustomerComplaintActionPlanStore.setCurrentPage(newPage);
    if (closeModal) CustomerComplaintActionPlanStore.orderItem = null;
    this._customerComplaintActionPlanService.getItems(false, '&limit=8&customer_complaint_ids=' + CustomerComplaintStore.selectedCustomerComplaintId)
      .subscribe(res => {
        if (CustomerComplaintActionPlanStore.allItems.length > 0 && !closeModal) {
          this.getActionPlanDetails(CustomerComplaintActionPlanStore.allItems[0].id);
        }
        this._utilityService.detectChanges(this._cdr);
      })
    // setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getActionPlanDetails(id: number) {
    CustomerComplaintActionPlanStore.complaintActionPlanId = id;
    CustomerComplaintActionPlanStore.unsetIndivitualCustomerComplaintActionPlan();
    this._customerComplaintActionPlanService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setSelectedActionPlanId(id: number){
    CustomerComplaintActionPlanStore.complaintActionPlanId = id;
    this._utilityService.detectChanges(this._cdr);
  }

  getPopupDetails(details) {
    this.userDetailObject.id = details.id;
    this.userDetailObject.first_name = details.first_name;
    this.userDetailObject.last_name = details.last_name;
    this.userDetailObject.designation = details.designation;
    this.userDetailObject.image_token = details.image.token;
    this.userDetailObject.email = details.email;
    this.userDetailObject.mobile = details.mobile;
    this.userDetailObject.department = details.department ? details.department : null;
    this.userDetailObject.status_id = details.status.id ? details.status.id : 1;

    return this.userDetailObject;
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
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
      userInfoObject.designation = user?.designation;
      userInfoObject.image_token = user?.image.token;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      userInfoObject.status_id = user?.status.id
      userInfoObject.department = user?.department;
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

  getCreatedByFromList(){
    let userDetial: any = {};
    userDetial['first_name'] = CustomerComplaintActionPlanStore?.getCustomerComplaintActionPlanById(CustomerComplaintActionPlanStore.complaintActionPlanId)?.created_by_first_name;
    userDetial['last_name'] = CustomerComplaintActionPlanStore?.getCustomerComplaintActionPlanById(CustomerComplaintActionPlanStore.complaintActionPlanId)?.created_by_last_name;
    userDetial['designation'] = CustomerComplaintActionPlanStore?.getCustomerComplaintActionPlanById(CustomerComplaintActionPlanStore.complaintActionPlanId)?.created_by_designation;
    userDetial['image_token'] = CustomerComplaintActionPlanStore?.getCustomerComplaintActionPlanById(CustomerComplaintActionPlanStore.complaintActionPlanId)?.created_by_image_token;
    userDetial['id'] = CustomerComplaintActionPlanStore?.getCustomerComplaintActionPlanById(CustomerComplaintActionPlanStore.complaintActionPlanId)?.id;
    userDetial['department'] = CustomerComplaintActionPlanStore?.getCustomerComplaintActionPlanById(CustomerComplaintActionPlanStore.complaintActionPlanId)?.created_by_department;
    userDetial['created_at'] = CustomerComplaintActionPlanStore?.getCustomerComplaintActionPlanById(CustomerComplaintActionPlanStore.complaintActionPlanId)?.created_at;
    return userDetial;
  }

  // Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token)
    }
    else
      return this._fileService.getThumbnailPreview(type, token);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  viewAttachments(type, document, khDocuments?) {
    switch (type) {
      case "corrective-action":
        this._fileService.getFilePreview(type, null, document.customer_complaint_action_plan_id, document.id).subscribe(res => {
          var resp: any = this._utilityService.getDownLoadLink(res, document.title);
          this.openPreviewModal(type, resp, document, document);
        }), (error => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage('Error', 'permission_denied');
          }
          else {
            this._utilityService.showErrorMessage('Error', 'unable_to_generate_preview');
          }
        });
        break;

      case "document-version":
        this._documentFileService.getFilePreview(type, document.document_id, khDocuments.id).subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(res, document.title);
          this.openPreviewModal(type, resp, khDocuments, document);
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

  openPreviewModal(type, filePreview, itemDetails, document) {
    let uploaded_user = null;
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'action-plan';
    this.previewObject.type = type;
    this.previewObject.file_details = itemDetails;
    this.previewObject.componentId = document.id;
    this.previewObject.ca_id = document.finding_corrective_action_id;
    this.previewObject.preview_url = previewItem;
    // this.previewObject.uploaded_user = document.updated_by ? document.updated_by : document.created_by;
    this.previewObject.uploaded_user = document.created_by ? document.created_by : null;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closePreviewModal() {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
    this.previewObject.component = '';
  }

  downloadDocument(type, document, docs?) {
    switch (type) {
      case "corrective-action":
        this._fileService.downloadFile('corrective-action', null, document.customer_complaint_action_plan_id, document.id, document.title, document);
        break;
      case "document-version":
        this._documentFileService.downloadFile(type, document.document_id, docs.id, null, document.title, docs);
        break;
    }
  }

  changeZIndex() {
    if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');

    }
  }
  

  getWatcherPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.watcherDetailObject.first_name = user.first_name;
      this.watcherDetailObject.last_name = user.last_name;
      this.watcherDetailObject.designation = user.designation;
      this.watcherDetailObject.image_token = user.image.token;
      this.watcherDetailObject.email = user.email;
      this.watcherDetailObject.mobile = user.mobile;
      this.watcherDetailObject.id = user.id;
      this.watcherDetailObject.department = user.department ? user.department : null;
      this.watcherDetailObject.status_id = user.status.id ? user.status.id : 1;
      return this.watcherDetailObject;
    }
  }

  getDaysRemaining() {

    let startDate = new Date(CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.target_date);

    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }
  
  getTotaldays() {
    let startDate = new Date(CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.start_date);
    let targetDate = new Date(CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.target_date);

    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;
    return this.Totaldays;
  }

  getColorKey(colorCode?){
    if(colorCode)
      var label_color = colorCode.split('-');
    else
      var label_color:any = CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.customer_complaint_action_plan_status?.color_code.split('-');
    
    return 'draft-tag-'+label_color;
  }

  // Update Modal
  updateCorrectiveAction() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.values = {
      ca_id: CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.id
    };
    CustomerComplaintActionPlanStore.clearUpdateDocumentDetails();
    this.caUpdateObject.type = 'Add'

    setTimeout(() => {
      $(this.UpdateCAformModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);
  }

  closeUpdateModal() {
    setTimeout(() => {
      $(this.UpdateCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);

    this.caUpdateObject.type = null;
    this.getActionPlan(CustomerComplaintActionPlanStore.currentPage,true);
    this._eventEmitterService.dismissCustomerComplaint()
  }

  // History Modal
  openHistoryModal() {
    // this.historyPageChange(1);

    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);
  }

  closeHistoryModal() {
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('hide');
     
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    // CustomerComplaintActionPlanStore.complaintActionPlanId = null;
    this.modalEventSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.updateSubscriptionEvent.unsubscribe();
    this.PreviewSubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    CustomerComplaintActionPlanStore.unsetCustomerComplaintActionPlan();
    // BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }
}
