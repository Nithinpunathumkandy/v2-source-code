import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { CustomerComplaintService } from 'src/app/core/services/customer-satisfaction/customer-complaint/customer-complaint.service';
import { CustomerEngagementFileServiceService } from 'src/app/core/services/customer-satisfaction/customer-engagement-file-service/customer-engagement-file-service.service';
import { CustomerInvestigationService } from 'src/app/core/services/customer-satisfaction/customer-investigation/customer-investigation.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { CustomerInvestigationStore } from 'src/app/stores/customer-engagement/customer-investigation/customer-investigation-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $: any;
@Component({
  selector: 'app-customer-complaint-info',
  templateUrl: './customer-complaint-info.component.html',
  styleUrls: ['./customer-complaint-info.component.scss']
})
export class CustomerComplaintInfoComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild("formModal") formModal: ElementRef;
  @ViewChild("formModalInvestigation") formModalInvestigation: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;

  AppStore = AppStore;
  AuthStore = AuthStore;
  CustomerComplaintStore = CustomerComplaintStore;
  CustomerInvestigationStore = CustomerInvestigationStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    type: ''
  };

  customerComplaintObject = {
    type: null,
    values: null,
  }

  customerInvestigationObject = {
    type: null,
    values: null,
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  id: number;
  modalEventSubscription: any;
  popupControlEventSubscription: any;
  PreviewSubscriptionEvent: any;
  fileUploadPopupSubscriptionEvent: any;
  modalEventInvestigationSubscription: any;

  constructor(
    private _imageService: ImageServiceService,
    private _customerComplaintService: CustomerComplaintService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _customerInvestigationService: CustomerInvestigationService,
    private _fileService: CustomerEngagementFileServiceService,
    private _router: Router,
  ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      if (CustomerComplaintStore.indivitualCustomerComplaint?.customer_complaint_status?.type == 'new') {
        var subMenuItems = [
          { activityName: 'UPDATE_CUSTOMER_COMPLAINT', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_CUSTOMER_COMPLAINT', submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: { type: 'close', path: '../' } }
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      }
      else {
        var subMenuItemClose = [
          { activityName: null, submenuItem: { type: 'close', path: '../' } }
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItemClose);
      }


      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.customerComplaintObject.values = null;
            this.editCustomerComplaint(CustomerComplaintStore.selectedCustomerComplaintId)
            break;
          case "delete":
            this.delete(CustomerComplaintStore.selectedCustomerComplaintId);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      // setting submenu items

    })
    this.modalEventSubscription = this._eventEmitterService.addCustomerComplaint.subscribe(res => {
      this.closeComplaintFormModal();
    });

    this.modalEventInvestigationSubscription = this._eventEmitterService.addCustomerInvestigation.subscribe(res => {
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
  }

  getColorKey() {
    var label_color = CustomerComplaintStore.indivitualCustomerComplaint?.customer_complaint_status?.color_code.split('-');
    return 'draft-tag-' + label_color;
  }

  getComplaintDetails() {
    this._customerComplaintService.getItem(CustomerComplaintStore.selectedCustomerComplaintId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeZIndex() {
    if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.formModalInvestigation.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModalInvestigation.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModalInvestigation.nativeElement, 'overflow', 'auto');
    }
  }

  editCustomerComplaint(id) {
    event.stopPropagation();
    this._customerComplaintService.getItem(id).subscribe(res => {
      this.CustomerComplaintStore.clearDocumentDetails();
      let ActionDetails = res;
      if (res) {
        this.customerComplaintObject.values = {
          id: ActionDetails.id,
          title: ActionDetails.title,
          responsible_user_id: ActionDetails.responsible_user,
          description: ActionDetails.description,
          organization: ActionDetails.organization,
          division: ActionDetails.division,
          department: ActionDetails.department,
          section: ActionDetails.section,
          sub_section: ActionDetails.sub_section,
          branch: ActionDetails.branch,
          customer: ActionDetails.customer,
          customer_complaint_type: ActionDetails.customer_complaint_type,
          customer_complaint_source_id: ActionDetails.customer_complaint_source,
          receiving_date: ActionDetails.receiving_date,
          is_non_conformity: ActionDetails.is_non_conformity,
          documents: ActionDetails.documents
        }
        this.customerComplaintObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openComplaintFormModal();
      }
    })
  }

  deleteCustomerComplaint(status: boolean) {
		if (status && this.popupObject.id) {
			this._customerComplaintService.delete(this.popupObject.id).subscribe(
				(resp) => {
          this._router.navigateByUrl('/customer-engagement/complaint');
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
		this.popupObject.subtitle = "customer_complaint_delete_subtitle";
		$(this.confirmationPopUp.nativeElement).modal("show");
	}

	closeConfirmationPopUp() {
		$(this.confirmationPopUp.nativeElement).modal("hide");
		this._utilityService.detectChanges(this._cdr);
	}

  openComplaintFormModal() {
    // $(this.formModal.nativeElement).modal('show');
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }
  // for close modal
  closeComplaintFormModal() {
    // $(this.formModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    this.customerComplaintObject.type = null;

  }

  setDocuments(documents) {
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element.kh_document?.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
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
          var purl = this._fileService.getThumbnailPreview('customer-complaint-document', element.token);
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


  closeFormModal() {
    setTimeout(() => {
      this.customerInvestigationObject.type = null;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.formModalInvestigation.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.formModalInvestigation.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.formModalInvestigation.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
    this._customerComplaintService.getItem(CustomerComplaintStore.selectedCustomerComplaintId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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


  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

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

  // File Preview,Download Starts Here
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "customer-complaint-document":
        this._fileService.downloadFile(
          type,
          document.customer_complaint_id,
          null,
          document.id,
          document.title,
          document
        );
        break;

      case "customer-investigation-document":
        this._fileService.downloadFile(
          type,
          document.customer_complaint_investigation_id,
          null,
          document.id,
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

  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "customer-complaint-document":
        this._fileService
          .getFilePreview(type, documents.customer_complaint_id, null, documentFile.id)
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

      case "customer-investigation-document":
        this._fileService
          .getFilePreview(type, documents.customer_complaint_investigation_id, null, documentFile.id)
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

  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.type = type
    this.previewObject.component = 'complaints'
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;


      this.previewObject.uploaded_user =
        document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  closePreviewModal() {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    this.previewObject.preview_url = '';
    this.previewObject.component = '';
  }

  addInvestigation() {
    setTimeout(() => {
      CustomerInvestigationStore.setSubMenuHide(true);
      this.customerInvestigationObject.type = 'Add'
      this.customerInvestigationObject.values = null
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.formModalInvestigation.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.formModalInvestigation.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.formModalInvestigation.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  
  editInvestigation(item) {
    setTimeout(() => {
      CustomerComplaintStore.clearDocumentDetails();
      CustomerInvestigationStore.setSubMenuHide(true);
      this.customerInvestigationObject.type = 'Edit'
      this.customerInvestigationObject.values = item;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.formModalInvestigation.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.formModalInvestigation.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.formModalInvestigation.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  deleteInvestigation(id) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_investigation';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteCustomerInvestigation(status)
        break;
      case 'are_you_sure':
        this.deleteCustomerComplaint(status);
        break;
    }
  }

  // delete function call
  deleteCustomerInvestigation(status: boolean) {
    if (status && this.popupObject.id) {
      this._customerInvestigationService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.getComplaintDetails();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
    this.getComplaintDetails();
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
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
      userInfoObject.department = null;
      return userInfoObject;
    }

  }

  ngOnDestroy() {
    this.modalEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    CustomerComplaintStore.searchText = null;
    SubMenuItemStore.searchText = '';
    this.PreviewSubscriptionEvent.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.modalEventInvestigationSubscription.unsubscribe();
  }


}
