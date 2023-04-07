import { Component, OnInit, Renderer2,ChangeDetectorRef,ElementRef,ViewChild, OnDestroy } from '@angular/core';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { IReactionDisposer,autorun, toJS } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CyberIncidentCorrectiveActionStore } from 'src/app/stores/cyber-incident/cyber-incident-corrective-action-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { CyberIncidentCorrectiveActionService } from 'src/app/core/services/cyber-incident/cyber-incident-corrective-action/cyber-incident-corrective-action.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { CyberIncidentService } from 'src/app/core/services/cyber-incident/cyber-incident.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
declare var $: any;
@Component({
  selector: 'app-ca',
  templateUrl: './ca.component.html',
  styleUrls: ['./ca.component.scss']
})
export class CaComponent implements OnInit,OnDestroy {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('UpdateCAformModal', { static: true }) UpdateCAformModal: ElementRef;
  @ViewChild('historyPopup', { static: true }) historyPopup: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  SubMenuItemStore=SubMenuItemStore;
  CyberIncidentStore=CyberIncidentStore;
  AuthStore=AuthStore;
  CyberIncidentCorrectiveActionStore = CyberIncidentCorrectiveActionStore;
  fileUploadPopupStore = fileUploadPopupStore;
  reactionDisposer: IReactionDisposer;
  popupControlAuditableEventSubscription: any;
  responsibleUserObject = [];
  correctiveActionId: number;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();
  AppStore = AppStore;
  caObject = {
    readOnly: true,
    component: 'CICorrectiveAction',
    values: null,
    type: null
  };
  popupObject = {
    category: '',
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  caUpdateObject = {
    component: '',
    values: null,
    type: null
  };
  previewObject = {
    cid: null,
    ca_id: null,
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null,
    componentId: null
  };
  PreviewSubscriptionEvent: any;
  addCaSubscription:any;
  caHistorySubscription:any;
  updateSubscriptionEvent: any;
  NoDataItemStore=NoDataItemStore;
  constructor(private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _fileUploadPopupService: FileUploadPopupService,
    private _cyberIncidentCorrectiveActionService: CyberIncidentCorrectiveActionService,
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _cyberIncidentService: CyberIncidentService,
    private _sanitizer: DomSanitizer,
    ) { }

  ngOnInit(): void {
   
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"incident",
        path:`/cyber-incident/cyber-incidents`
      });
    }

    this.reactionDisposer = autorun(() => {
      this.setSubMenu();
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createCA();
            break;
          
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
       
        
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.createCA();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    if((this.isUser() ||  AuthStore.isRoleChecking('super-admin')))
    {
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_corrective_action' });
    }
    else
    {
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle',});
    }
    this.PreviewSubscriptionEvent = this._eventEmitterService.correctiveACtionPreviewModal.subscribe(res => {
      this.closePreviewModal();
      this.changeZIndex();
    })
    this.addCaSubscription = this._eventEmitterService.addCyberIncidentCAModal.subscribe(res => {
      this.closeFormModal();
    })
    this.caHistorySubscription = this._eventEmitterService.cyberIncidentCaHistoryModal.subscribe(res => {
      this.closeHistoryModal();
    })
    this.updateSubscriptionEvent = this._eventEmitterService.cyberIncidentCaUpdateModal.subscribe(res => {
      this.closeUpdateModal();
    })
    // for deleting/activating/deactivating using delete modal
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange();

  }

  // page change event
  pageChange() {
    CyberIncidentCorrectiveActionStore.unsetCorrectiveActions();// crears previous loaded data if any
    this._cyberIncidentCorrectiveActionService.getAllItems('&cyber_incident_id='+CyberIncidentStore.incidentId).subscribe(res => {
      if (res.data.length > 0 && CyberIncidentCorrectiveActionStore.new_ca_id == null) {
        this.getCorrectiveAction(res.data[0].id);
        CyberIncidentCorrectiveActionStore.setSelected(res.data[0].id);
      }
      if (CyberIncidentCorrectiveActionStore.allItems.length > 0 && CyberIncidentCorrectiveActionStore.new_ca_id != null) {
        this.getCorrectiveAction(CyberIncidentCorrectiveActionStore.new_ca_id);
        CyberIncidentCorrectiveActionStore.setSelected(CyberIncidentCorrectiveActionStore.new_ca_id);
      }
      this._utilityService.detectChanges(this._cdr);
    })

  }

  // call corrective action by id
  getCorrectiveAction(id: number) {
    CyberIncidentCorrectiveActionStore.unsetSelectedItemDetails();
    this.responsibleUserObject = [];
    this._cyberIncidentCorrectiveActionService.getItem(id).subscribe(res => {
      this.correctiveActionId = res.id;

      // setting submenu items
      // SubMenuItemStore.setSubMenuItems([
      //   { type: 'go_to_audit' },
      //   { type: 'new_modal' },
      //   { type: 'export_to_excel' },
      //   { type: 'share' },
      //   { type: "close", path: "../" }

      // ]);

      // var subMenuItems = [
      //   { activityName: 'EA_FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_audit' } },
      //   { activityName: 'CREATE_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } },
      //   { activityName: 'EXPORT_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
      //   { activityName: 'EXPORT_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
      //   { activityName: null, submenuItem: { type: "close", path: "../" } },
      // ]
      // this._helperService.checkSubMenuItemPermissions(900, subMenuItems);

      this._utilityService.detectChanges(this._cdr);
    })

    this._cyberIncidentCorrectiveActionService.setSelected(id);
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

  createCA() {
    this.caObject.type = 'Add';
    this.caObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();

  }
  closeFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this._renderer2.removeClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    if(this.caObject.type == 'Add')
    {
      CyberIncidentCorrectiveActionStore.new_ca_id = null;
      this.pageChange();
    }
    else
    {
      this.getCorrectiveAction(CyberIncidentCorrectiveActionStore.correctiveActionDetails.id);
    }
    this.caObject.type = null;
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto')
  }

  editCorrectiveACtion() {
    CyberIncidentCorrectiveActionStore.setSubMenuHide(true);
    CyberIncidentCorrectiveActionStore.clearDocumentDetails();
    const corrective_action = CyberIncidentCorrectiveActionStore.correctiveActionDetails; // assigning values for edit
    setTimeout(() => {
      if (corrective_action.documents.length > 0) {
        this.setDocuments(corrective_action.documents)
      }
    }, 100);
    this.caObject.values = {
      id: corrective_action.id,
      title: corrective_action.title,
      estimated_cost: corrective_action.estimated_cost,
      responsible_user_ids: toJS(corrective_action.responsible_user),
      description: corrective_action.description,
      start_date: this._helperService.processDate(corrective_action.start_date, 'split'),
      target_date: this._helperService.processDate(corrective_action.target_date, 'split'),
      documents: ''
    }
    this.caObject.type = 'Edit';
    this.openFormModal();
  }

  // getCorrectiveAction(id: number) {
  //   CyberIncidentCorrectiveActionStore.unsetSelectedItemDetails();
  //   this._cyberIncidentCorrectiveActionService.getCorrectiveActionDetails(id).subscribe(res => {
  //     // this.currectiveActionId = res.id;
  //   })
  // }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'Confirm': this.closeCorrectiveAction(status)
        break;
      case '': this.deleteCorrectiveActions(status)
        break;
    }
  }

  closeCorrectiveAction(status) {
    if (status) {
      this.markClose();
    } else {
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
    }
  }

  markClose() {
    this.popupObject.title = 'Close Corrective Action?';
    this.popupObject.subtitle = 'Are you sure want to close corrective action?';
    this.popupObject.type = 'Confirm';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteCorrectiveActions(status) {
    if (status && this.popupObject.id) {
      this._cyberIncidentCorrectiveActionService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        CyberIncidentCorrectiveActionStore.new_ca_id = null;
        this.pageChange();
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
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = 'it_will_remove_the_corrective_action';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  setDocuments(documents) {
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        // let doc = element;
        // doc['is_kh_document'] = true;
        // khDocuments.push(doc);
        // let doc2=element;
        // doc2['updateId'] = element.id;
        // fileUploadPopupStore.setUpdateFileArray(doc2)
        element.kh_document.versions.forEach(innerElement => {
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
          var purl = this._cyberIncidentService.getThumbnailPreview('corrective-action', element.token);
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

  setSubMenu()
  {
    var subMenuItems = [];
    if(this.isUser() || AuthStore.isRoleChecking('super-admin'))
    {
      subMenuItems.push({ activityName: '', submenuItem: { type: 'new_modal' } });
    }
    
    subMenuItems.push({ activityName: null, submenuItem: { type: 'close',path:'/cyber-incident/cyber-incidents'}});
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
  }

  isUser() {
    if(CyberIncidentStore.cyberIncidentDetails?.reporting_user)
    {
      for (let i of CyberIncidentStore.cyberIncidentDetails?.reporting_user) {
        if (i?.id == AuthStore.user.id){
          return true;
        }
    }
    }
   
}

isResponsibleUser() {
  if(CyberIncidentCorrectiveActionStore.correctiveActionDetails?.responsible_user)
    {
      for (let i of CyberIncidentCorrectiveActionStore.correctiveActionDetails?.responsible_user) {
        if (i?.id == AuthStore.user.id){
          return true;
        }
    }
    }
}

createImageUrl(type, token) {
  if (type == 'document-version') {
    return this._documentFileService.getThumbnailPreview(type, token)
  }
  else
    return this._cyberIncidentService.getThumbnailPreview(type, token);
}

viewAttachments(type, document, khDocuments?) {
  switch (type) {
    case "corrective-action":
      this._cyberIncidentService.getPreview(type, document.cyber_incident_corrective_action_id, document.id).subscribe(res => {
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
  this.previewObject.component = type;
  this.previewObject.file_details = itemDetails;
  this.previewObject.componentId = document.id;
  this.previewObject.cid = CyberIncidentStore.incidentId;
  //this.previewObject.cyber_incident_corrective_action_id = document.cyber_incident_corrective_action_id;
  this.previewObject.preview_url = previewItem;
  // this.previewObject.uploaded_user = document.updated_by ? document.updated_by : document.created_by;
  this.previewObject.uploaded_user = CyberIncidentCorrectiveActionStore.correctiveActionDetails.created_by ? CyberIncidentCorrectiveActionStore.correctiveActionDetails.created_by : null;
  this.previewObject.created_at = document.created_at;
  $(this.filePreviewModal.nativeElement).modal('show');
  this._utilityService.detectChanges(this._cdr);
}

closePreviewModal($event?) {
  $(this.filePreviewModal.nativeElement).modal('hide');
  this.previewObject.file_name = null;
  this.previewObject.file_type = '';
  this.previewObject.preview_url = '';
}

changeZIndex() {
  if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
  }
}

downloadDocument(type, document, docs?) {
  switch (type) {
    case "corrective-action":
      this._cyberIncidentService.downloadFile(document.cyber_incident_corrective_action_id, 'corrective-action', null, document.id, null, document);
      break;
    case "document-version":
      this._documentFileService.downloadFile(type, document.document_id, docs.id, null, document.title, docs);
      break;
  }
}

// extension check function
checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
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

labelDot(data) {
  let str = data;
  let color = "";
  if(data)
  {
    const myArr = str.split("-");
    color = myArr[0];
    
  }
  return color;
}

// Update Modal
updateCorrectiveAction() {
  this.caUpdateObject.type = null;
  this.caUpdateObject.values = {
    ca_id: CyberIncidentCorrectiveActionStore.correctiveActionDetails?.id
  };
  CyberIncidentCorrectiveActionStore.clearDocumentDetails();
  CyberIncidentCorrectiveActionStore.new_ca_id=CyberIncidentCorrectiveActionStore.correctiveActionDetails?.id;
  this.caUpdateObject.type = 'Edit'

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
  this.pageChange();
  // this.getCorrectiveAction(ExternalAuditCorrectiveActionStore.correctiveActionDetails.id);
}

historyPageChange(newPage: number = null) {
  if (newPage) CyberIncidentCorrectiveActionStore.setHistoryCurrentPage(newPage);
  this._cyberIncidentCorrectiveActionService.getCaHistory(CyberIncidentCorrectiveActionStore.correctiveActionDetails?.id).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}

// History Modal
openHistoryModal() {
  this.historyPageChange(1);
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

  // this.pageChange();
  //this.getCorrectiveActions();
}

ngOnDestroy() {
  if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCaSubscription.unsubscribe();
    this.caHistorySubscription.unsubscribe();
    CyberIncidentCorrectiveActionStore.loaded = false;
    CyberIncidentCorrectiveActionStore.individualLoaded = false;
    CyberIncidentCorrectiveActionStore.new_ca_id = null;
    this.popupControlAuditableEventSubscription.unsubscribe();
    this.PreviewSubscriptionEvent.unsubscribe();
    // this.updateSubscriptionEvent.unsubscribe();
    // this.historySubscriptionEvent.unsubscribe();
    // this.subscription.unsubscribe();
    // AppStore.showDiscussion = false;
}

}
