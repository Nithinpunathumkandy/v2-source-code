import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer, autorun } from "mobx";
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
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $:any

@Component({
  selector: 'app-customer-complaint-action-plans-details',
  templateUrl: './customer-complaint-action-plans-details.component.html',
  styleUrls: ['./customer-complaint-action-plans-details.component.scss']
})
export class CustomerComplaintActionPlansDetailsComponent implements OnInit {
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('UpdateCAformModal', { static: true }) UpdateCAformModal: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  CustomerComplaintStore = CustomerComplaintStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  CustomerComplaintActionPlanStore = CustomerComplaintActionPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;

  customerComplaintActionPLanObject = {
    type:null,
    values: null,
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
    type : null
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

  caUpdateObject = {
    component: '',
    values: null,
    type: null
  };

  caHistoryObject = {
    id: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();

  AppStore = AppStore;
  
  popupControlEventSubscription: any;
  modalEventSubscription:any;
  PreviewSubscriptionEvent : any;
  fileUploadPopupSubscriptionEvent :any;
  updateSubscriptionEvent : any;
  historySubscriptionEvent :any;
  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _customerComplaintActionPlanService: CustomerComplaintActionPlanService,
    private _activatedRouter: ActivatedRoute,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _sanitizer: DomSanitizer,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _customerComplaintService: CustomerComplaintService,
    private _documentFileService: DocumentFileService,
    private _fileService: CustomerEngagementFileServiceService,
    private _router: Router
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof CustomerComplaintActionPlansDetailsComponent
   */
  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      CustomerComplaintActionPlanStore.complaintActionPlanId = id;
     this.getCustomerComplaintCorrectiveAction(id);
     
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {

      if (CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.customer_complaint_action_plan_status?.type == 'resolved') {
        var subMenuItems = [
          { activityName: 'CREATE_NOC_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '../' } },
        ]
      }
      else {
        var subMenuItems = [
          { activityName: 'UPDATE_CUSTOMER_COMPLAINT_ACTION_PLAN', submenuItem: { type: 'edit_modal' } },
          { activityName: 'CREATE_NOC_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'update_modal' } },
          { activityName: 'DELETE_CUSTOMER_COMPLAINT_ACTION_PLAN', submenuItem: { type: 'delete' } },
          { activityName: 'CREATE_NOC_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '../' } },
        ]
      }

      this._helperService.checkSubMenuItemPermissions(600,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editCustomerComplaintActionPlan(id);
            break;
          case "update_modal":
            this.updateCaModal();
            break;
          case "delete":
            this.delete(id);
            break;
          case "history":
            this.openHistoryModal();
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

  getCustomerComplaintCorrectiveAction(id){
    this._customerComplaintActionPlanService.getItem(id).subscribe(res=>{
      this.getCustomerComplaint();
      this._utilityService.detectChanges(this._cdr);
    })
  }
 
  getCustomerComplaint(){
    this._customerComplaintService.getItem(CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.customer_complaint?.id).subscribe(()=>this._utilityService.detectChanges(this._cdr))
  }

  deleteCustomerActionPlan(status: boolean) {
		if (status && this.popupObject.id) {
			this._customerComplaintActionPlanService.delete(this.popupObject.id).subscribe(
				(resp) => {
          this._router.navigateByUrl('/customer-engagement/complaint-action-plan');
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

  delete(id: number) {
		event.stopPropagation();
		this.popupObject.type = 'are_you_sure';
		this.popupObject.id = id;
		this.popupObject.title = "are_you_sure";
		this.popupObject.subtitle = "customer_action_plan_delete_subtitle";
		$(this.confirmationPopUp.nativeElement).modal("show");
	}

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'are_you_sure':
        this.deleteCustomerActionPlan(status);
        break;
    }
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  closeConfirmationPopUp() {
		$(this.confirmationPopUp.nativeElement).modal("hide");
		this._utilityService.detectChanges(this._cdr);
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

  openFormModal() {
    $(this.formModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
}

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.customerComplaintActionPLanObject.type = null;
    this.getCustomerComplaintCorrectiveAction(CustomerComplaintActionPlanStore.complaintActionPlanId);
  } 
  
  editCustomerComplaintActionPlan(id) {
    event.stopPropagation();
    this._customerComplaintActionPlanService.getItem(id).subscribe(res => {
      if(res){
        this.customerComplaintActionPLanObject.values = res;
        this.customerComplaintActionPLanObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }
    })
  }

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof CustomerComplaintActionPlansDetailsComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    this.updateSubscriptionEvent.unsubscribe();
    this.PreviewSubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    CustomerComplaintActionPlanStore?.unsetIndivitualCustomerComplaintActionPlan();
    CustomerComplaintStore.unsetIndivitualCustomerComplaint();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
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

  getColorKey(){
    var label_color = CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.customer_complaint_action_plan_status?.color_code.split('-');
    return 'draft-tag-'+label_color;
  }

  changeZIndex() {
    if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }
  

  

   // Update Modal
   updateCaModal() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.values = {
      ca_id: CustomerComplaintActionPlanStore?.indivitualCustomerComplaintActionPlan?.id
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
    this.caUpdateObject.values = null;
    // this.pageChange();
    // this.getCustomerComplaintCorrectiveAction();
  }

  // History Modal
  openHistoryModal() {
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

}
