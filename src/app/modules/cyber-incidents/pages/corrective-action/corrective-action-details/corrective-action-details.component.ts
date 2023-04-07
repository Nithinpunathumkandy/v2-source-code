import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { SubMenuItem } from 'src/app/core/models/general/sub-menu.model';
import { CyberIncidentCorrectiveActionService } from 'src/app/core/services/cyber-incident/cyber-incident-corrective-action/cyber-incident-corrective-action.service';
import { CyberIncidentService } from 'src/app/core/services/cyber-incident/cyber-incident.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CyberIncidentCorrectiveActionStore } from 'src/app/stores/cyber-incident/cyber-incident-corrective-action-store';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
  selector: 'app-corrective-action-details',
  templateUrl: './corrective-action-details.component.html',
  styleUrls: ['./corrective-action-details.component.scss']
})
export class CorrectiveActionDetailsComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('addCAformModal', { static: true }) addCAformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('UpdateCAformModal', { static: true }) UpdateCAformModal: ElementRef;
  @ViewChild('historyPopup', { static: true }) historyPopup: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  CyberIncidentCorrectiveActionStore = CyberIncidentCorrectiveActionStore;
  CyberIncidentStore = CyberIncidentStore;

  AppStore = AppStore;
  subscription: any;

  correctiveActionObject = {
    component: 'CorrectiveAction',
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
    componentId: null
  };
  reactionDisposer: IReactionDisposer;
  findings_id: number;
  corrective_action_id: number;
  historySubscriptionEvent: any;
  updateSubscriptionEvent: any;
  PreviewSubscriptionEvent: any;
  fileUploadPopupSubscriptionEvent: any;
  addCASubscriptionEvent: any;
  popupControlAuditableEventSubscription: any;
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();

  fileUploadPopupStore = fileUploadPopupStore;
  comments: any;
  comment_id: number = null;
  AuthStore=AuthStore;
  
  constructor(
    private _fileUploadPopupService: FileUploadPopupService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cyberIncidentService: CyberIncidentService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    //private _caCommentService: CaCommentService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _sanitizer: DomSanitizer,
    private  _cyberIncidentCorrectiveActionService : CyberIncidentCorrectiveActionService,
    // private _correctiveActionService: CorrectiveActionService,
    //private _discussionBotService: DiscussionBotService,
    private _router: Router,
  ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.gotoEditPage();
            break;
          case "delete":
            this.deleteCa(CyberIncidentCorrectiveActionStore.correctiveActionDetails.id);
            break;
          case "update_modal":
            this.updateCorrectiveAction();
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
    })

    this.addCASubscriptionEvent = this._eventEmitterService.addCyberIncidentCAModal.subscribe(res => {
      this.closeFormModal();
    })


    this.PreviewSubscriptionEvent = this._eventEmitterService.correctiveACtionPreviewModal.subscribe(res => {
      this.closePreviewModal();
      this.changeZIndex();
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.changeZIndex();
    })

    this.updateSubscriptionEvent = this._eventEmitterService.cyberIncidentCaUpdateModal.subscribe(res => {
      this.closeUpdateModal();
    })

    this.historySubscriptionEvent = this._eventEmitterService.cyberIncidentCaHistoryModal.subscribe(res => {
      this.closeHistoryModal();
    })

    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:"corrective_action",
      path:'/cyber-incident/cyber-incident-corrective-actions'
    });

    let id: number;
    // let finding_id: number
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      // finding_id = +params['finding_id'];
      // this.findings_id = finding_id;
      this.corrective_action_id = id;
      // AuditNonConfirmityStore.setmsAuditNonConfirmityId(this.findings_id);
      this.getActionPlan(id);
    });
  } 

  getActionPlan(id) {
    this._cyberIncidentCorrectiveActionService.getItem(id).subscribe(res => {
      this.setSubmenu(res);
      this._utilityService.detectChanges(this._cdr);
    });
    // this._findingService.getItem(AuditCorrectiveActionStore.correctiveActionDetails?.finding_id).subscribe(res => {
    //   this._utilityService.detectChanges(this._cdr);
    // })
  }

  setSubmenu(res) {
    if (res.cyber_incident_corrective_action_status?.type != "closed") {
      if (CyberIncidentCorrectiveActionStore.correctiveActionDetails?.cyber_incident_id) {

        var subMenuItems = [
          { activityName: '', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/cyber-incident/cyber-incident-corrective-actions' } },
        ]
        if(this.isResponsibleUser()  || AuthStore.isRoleChecking('super-admin'))
        {
          subMenuItems.unshift({ activityName: '', submenuItem: { type: 'edit_modal' } });
          subMenuItems.unshift({ activityName: '', submenuItem: { type: 'delete' } });
        }
        if(this.isResponsibleUser() || AuthStore.isRoleChecking('super-admin'))
        {
          subMenuItems.unshift({ activityName: '', submenuItem: { type: 'update_modal' } })
        }
      }
      else {
        var subMenuItems = [
          { activityName: '', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/cyber-incident/cyber-incident-corrective-actions' } },
        ]
        if(this.isResponsibleUser() || AuthStore.isRoleChecking('super-admin') && res.cyber_incident_corrective_action_status?.type != "closed")
        {
          subMenuItems.unshift({ activityName: '', submenuItem: { type: 'edit_modal' } });
          subMenuItems.unshift({ activityName: '', submenuItem: { type: 'delete' } });
        }
        if(this.isResponsibleUser() || AuthStore.isRoleChecking('super-admin')&& res.cyber_incident_corrective_action_status?.type != "closed")
        {
          subMenuItems.unshift({ activityName: '', submenuItem: { type: 'update_modal' } })
        }
      }
    } else {
      if (CyberIncidentCorrectiveActionStore.correctiveActionDetails?.cyber_incident_id) {
        var subMenuItems = [
          { activityName: '', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/cyber-incident/cyber-incident-corrective-actions' } },
        ]
      } else {
        var subMenuItems = [
          { activityName: '', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/cyber-incident/cyber-incident-corrective-actions' } },
        ]
      }
    }
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
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

  updateCorrectiveAction() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.values = {
      ca_id: CyberIncidentCorrectiveActionStore.correctiveActionDetails?.id
    };
    CyberIncidentCorrectiveActionStore.clearDocumentDetails();
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
    // this.pageChange();
    this.getActionPlan(CyberIncidentCorrectiveActionStore.correctiveActionDetails.id);
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

  historyPageChange(newPage: number = null) {
    if (newPage) CyberIncidentCorrectiveActionStore.setHistoryCurrentPage(newPage);
    this._cyberIncidentCorrectiveActionService.getCaHistory(CyberIncidentCorrectiveActionStore.correctiveActionDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // for opening modal
  openFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('show');
    }, 50);
  }

  // for closing the rca form modal
  closeFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this.correctiveActionObject.type = null;
    this.getActionPlan(this.corrective_action_id);
  }

  changeZIndex() {
    if ($(this.addCAformModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.addCAformModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.addCAformModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
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

  gotoEditPage() {
    CyberIncidentCorrectiveActionStore.setSubMenuHide(false);
    CyberIncidentCorrectiveActionStore.clearDocumentDetails();
    const corrective_action = CyberIncidentCorrectiveActionStore.correctiveActionDetails; // assigning values for edit
    setTimeout(() => {
      if (corrective_action.documents.length > 0) {
        this.setDocuments(corrective_action.documents)
      }
    }, 200);
    this.correctiveActionObject.values = {
      id: corrective_action.id,
      title: corrective_action.title,
      cyber_incident_id: corrective_action.cyber_incident.id,
      estimated_cost: corrective_action.estimated_cost,
      responsible_user_ids: toJS(corrective_action.responsible_user),
      description: corrective_action.description,
      start_date: this._helperService.processDate(corrective_action.start_date, 'split'),
      target_date: this._helperService.processDate(corrective_action.target_date, 'split'),
      documents: ''
    }

    this.correctiveActionObject.type = 'Edit';
    this.openFormModal();
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
    userDetial['first_name'] = users.first_name;
    userDetial['last_name'] = users.last_name;
    userDetial['designation'] = users.designation;
    userDetial['image_token'] = users.image.token;
    userDetial['email'] = users.email;
    userDetial['mobile'] = users.mobile;
    userDetial['id'] = users.id;
    userDetial['department'] = users.department;
    userDetial['status_id'] = users.status_id ? users.status_id : users.status.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;

  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  // Returns image url according to type and token
  // createImageUrl(type, doc, token) {
  //   return this._fileServiceService.getThumbnailPreview(type, token);
  // }

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
    this.previewObject.ca_id = document.cyber_incident_corrective_action_id;
    this.previewObject.fid = CyberIncidentCorrectiveActionStore.correctiveActionDetails.cyber_incident_id;
    this.previewObject.preview_url = previewItem;
    // this.previewObject.uploaded_user = document.updated_by ? document.updated_by : document.created_by;
    this.previewObject.uploaded_user = CyberIncidentCorrectiveActionStore.correctiveActionDetails.created_by ? CyberIncidentCorrectiveActionStore.correctiveActionDetails.created_by : null;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
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


  closePreviewModal($event?) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteCorrectiveActions(status)
        break;
    }
  }

  deleteCa(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = 'it_will_remove_the_corrective_action';
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
        this._router.navigateByUrl('/cyber-incident/cyber-incident-corrective-actions');
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

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  checkItemPresent(item) {
		if (SubMenuItemStore.subMenuItems) {
			for (let i of SubMenuItemStore.subMenuItems) {
				if (i.type == item) {
					return true;
				}
			}
			return false;
		}
		else
			return false;
	}

	returnItem(item) {
		if (SubMenuItemStore.subMenuItems) {
			for (let i of SubMenuItemStore.subMenuItems) {
				if (i.type == item) {
					return i;
				}
			}
		}
	}

  itemClicked(item: SubMenuItem) {
	
		if (item.type == 'export_to_excel')
			SubMenuItemStore.exportClicked = true;
		else if (item.type == 'import')
			SubMenuItemStore.importClicked = true;
		else (item.type == 'template')
			SubMenuItemStore.templateClicked = true;
		

		SubMenuItemStore.setClickedSubMenuItem(item);
	}

  getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCASubscriptionEvent.unsubscribe();
   
    AppStore.showDiscussion = false;
    CyberIncidentCorrectiveActionStore.unsetCorrectiveActionHistory();
    CyberIncidentCorrectiveActionStore.unsetDocumentDetails();
    CyberIncidentCorrectiveActionStore.unsetSelectedItemDetails();
    this.PreviewSubscriptionEvent.unsubscribe();
    this.updateSubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
    this.popupControlAuditableEventSubscription.unsubscribe();

  }

}
