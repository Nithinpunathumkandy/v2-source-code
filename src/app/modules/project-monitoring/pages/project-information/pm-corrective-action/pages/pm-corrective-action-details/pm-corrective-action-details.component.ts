import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ProjectIssueCaService } from 'src/app/core/services/project-monitoring/project-ca/project-issue-ca.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CaStore } from 'src/app/stores/project-monitoring/project-issue-ca-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;

@Component({
  selector: 'app-pm-corrective-action-details',
  templateUrl: './pm-corrective-action-details.component.html',
})

export class PmCorrectiveActionDetailsComponent implements OnInit,OnDestroy {

  @ViewChild('newCa', { static: true }) newCa: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;
  @ViewChild('UpdateCAformModal', { static: true }) UpdateCAformModal: ElementRef;
  
  CaStore = CaStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  SubMenuItemStore = SubMenuItemStore;

  reactionDisposer: IReactionDisposer;

  historyPopupObject = {
    id : null,
    type:null
  }

  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();

  updateSubscriptionEvent:any;
  historySubscriptionEvent:any;
  resolveSubscriptionEvent: any;
  addCASubscriptionEvent: any;
  popupControlEventSubscription: any;
  addCASubscriptionEventProjectIssue:any;

  previewObject = {
    fid: null,
    ca_id: null,
    file_details: null,
    component: '',
    preview_url: null,
    frequency: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null,
    componentId: null,
    type : null
  };

  newCaObject = {
    component: 'CorrectiveAction',
    module: 'project-monitoring',
    value: null,
    type: null
  };

  caUpdateObject = {
    component: '',
    values: null,
    type: null
  };

  correctiveActionResolveObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    category: '',
    type: '',
    status_btn: '',
    title: '',
    id: null,
    subtitle: '',
  };

  constructor(private _projectIssueCaService: ProjectIssueCaService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _route: ActivatedRoute,) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof PmCorrectiveActionDetailsComponent
   */
  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this._route.params.subscribe(params => {
      CaStore.ProjectIssueCaId = params.id;
      this.getCorrectiveActionDetails();
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editCorrectiveACtion();
            break;
          case "update_modal":
            this.updateCaModal();
            break;
          case "history":
            this.openHistoryModal();
            break;
          case "delete":
              this.delete();
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.findingCorrectiveActionModalControl.subscribe(res => {
      this.closeNewCa();
    })

    this.resolveSubscriptionEvent = this._eventEmitterService.caResolveModalControl.subscribe(res => {
      this.closeUpdateModal();
    })

    this.historySubscriptionEvent = this._eventEmitterService.closeHistoryModal.subscribe(res => {
      this.closeHistoryModal();

    })

    this.updateSubscriptionEvent = this._eventEmitterService.incidentCorrectiveActionUpdateModal.subscribe(item => {
      this.closeUpdateModal();
    })

    this.addCASubscriptionEventProjectIssue = this._eventEmitterService.projectIssueCaModal.subscribe(res => {
      this.closeNewCa();
      //this.getCorrectiveActionDetails();
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }


  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
    if (languageSupport) {
      for (let i of items) {
        for (let j of i.language) {
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }


  getCorrectiveActionDetails() {
    this._projectIssueCaService.getCa(CaStore.ProjectIssueCaId).subscribe(() => {
      this.setSubmenu();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setSubmenu() {
    var subMenuItems = [
      { activityName: null, submenuItem: { type: 'edit_modal' } },
      { activityName: null, submenuItem: { type: 'delete' } },
      { activityName: null, submenuItem: { type: 'update_modal' } },
      { activityName: null, submenuItem: { type: 'history' } },
      { activityName: null, submenuItem: { type: 'close', path: "../" } },
    ]
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
  }


  getDaysRemaining() {
    let startDate = new Date(CaStore.correctiveActionDetails?.target_date);
    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }

  getTotaldays() {
    let startDate = new Date(CaStore.correctiveActionDetails?.start_date);
    let targetDate = new Date(CaStore.correctiveActionDetails?.target_date);

    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;
    return this.Totaldays;
  }

  // Update Modal
  updateCaModal() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.values = {
      ca_id: CaStore.correctiveActionDetails?.id
    };
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
    this.getCorrectiveActionDetails();
  }



  // History Modal
  openHistoryModal() {
    this.historyPageChange(1);
     this.historyPopupObject.type = 'add'
     this.historyPopupObject.id = CaStore.ProjectIssueCaId;
     setTimeout(() => {
      this._renderer2.setStyle(this.historyPopup.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.historyPopup.nativeElement, 'overflow', 'auto');
      $(this.historyPopup.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);
  }
  
  closeHistoryModal() {
    this.historyPopupObject.id = null;
    this._renderer2.setStyle(this.historyPopup.nativeElement, 'z-index', 99);
    this._renderer2.setStyle(this.historyPopup.nativeElement, 'overflow', 'none');
    $(this.historyPopup.nativeElement).modal('hide');
    CaStore.unsetCorrectiveActionHistory();
  }

  historyPageChange(newPage: number = null) {
    if (newPage) CaStore.setHistoryCurrentPage(newPage);
    this._projectIssueCaService.getCaHistory(CaStore.correctiveActionDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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

  viewAttachments(type, document, khDocuments?) {
    switch (type) {
      case "project-issue-corrective-action-document":
        this._projectIssueCaService.getFilePreview(type, document.project_issue_corrective_action_id, document.id).subscribe(res => {
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

  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component=type
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;
      this.previewObject.frequency = CaStore.ProjectIssueCaId;
      this.previewObject.uploaded_user =
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  *// Closes from preview
    closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }


  // Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token)
    }
    else
      return this._projectIssueCaService.getThumbnailPreview(type, token);
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

  downloadDocument(type, document, docs?) {
    switch (type) {
      case "project-issue-corrective-action-document":
        this._projectIssueCaService.downloadFile('project-issue-corrective-action-document', document.project_issue_corrective_action_id, document.id, document.title, document);
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

  // for opening modal
  openNewCa() {
    setTimeout(() => {
      $(this.newCa.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.newCa.nativeElement, 'show');
    this._renderer2.setStyle(this.newCa.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.newCa.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.newCa.nativeElement, 'overflow', 'auto')
  }

  // for closing the rca form modal
  closeNewCa() {
    setTimeout(() => {
      $(this.newCa.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
    this._renderer2.removeClass(this.newCa.nativeElement, 'show');
    this._renderer2.setStyle(this.newCa.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.newCa.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.newCa.nativeElement, 'overflow', 'none');
    this.getCorrectiveActionDetails();
    this.newCaObject.type = null;
    this._utilityService.detectChanges(this._cdr);
  }



  modalControl(status: boolean) {
    switch (this.popupObject.status_btn) {
      case '': this.deleteCorrectiveActions(status)
        break;
      case 'statusClose': this.closeCa(status)
        break;
      case 'reject': this.rejectCa(status)
        break;
    }
  }

  gotoIncident() {
    this._router.navigate([`project-monitoring/projects/${ProjectMonitoringStore.selectedProjectId}/issues-list`]);
  }


  delete() {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = CaStore.ProjectIssueCaId;
    this.popupObject.status_btn = '';
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = "common_delete_subtitle";
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteCorrectiveActions(status) {
    if (status && this.popupObject.id) {
      this._projectIssueCaService.deleteCa(this.popupObject.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        this._router.navigateByUrl('/project-monitoring/projects-issue-corrective-actions');
        this.clearPopupObject();
        CaStore.ProjectIssueCaId = null;
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }




  closeCorrectiveAction() {
    event.stopPropagation();
    this.popupObject.type = 'Confirm';
    this.popupObject.id = CaStore.ProjectIssueCaId;
    this.popupObject.status_btn = 'statusClose';
    this.popupObject.title = 'Are you sure?';
    this.popupObject.subtitle = 'It will change status of the corrective action to close';
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  closeCa(status) {
    if (status && this.popupObject.id) {
      console.log(status);
      this._projectIssueCaService.closeCa(this.popupObject.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        this._router.navigateByUrl('/non-conformity/finding-corrective-actions/' + this.popupObject.id);
        this.clearPopupObject();
        CaStore.ProjectIssueCaId = null;
      });
    } else {
      this.clearPopupObject();
    }
    this.getCorrectiveActionDetails();
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  rejectCorrectiveAction() {
    event.stopPropagation();
    this.popupObject.type = 'Confirm';
    this.popupObject.id = CaStore.ProjectIssueCaId;
    this.popupObject.status_btn = 'reject';
    this.popupObject.title = 'Are you sure?';
    this.popupObject.subtitle = 'It will change status of the corrective action to reject';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  rejectCa(status) {
    if (status && this.popupObject.id) {
      this._projectIssueCaService.rejectCa(this.popupObject.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        this._router.navigateByUrl('/non-conformity/finding-corrective-actions/' + this.popupObject.id);
        this.clearPopupObject();
        CaStore.ProjectIssueCaId = null;
      });
    } else {
      this.clearPopupObject();
    }
    this.getCorrectiveActionDetails();
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }


  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.status_btn = '';
    this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }


  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  labelDot(data) {
    if (data) {
    let str = data;
    let color="";
    const myArr = str.split("-");
    color=myArr[0];
    return color;
    }
  }

  editCorrectiveACtion() {
    event.stopPropagation();
     this._projectIssueCaService.getCa(CaStore.ProjectIssueCaId).subscribe(res=>{
       console.log(res)
      this.newCaObject.type = 'Edit';
      this.newCaObject.value = res;
      this.openNewCa();
      this.setDocuments(res.documents);
      this._utilityService.detectChanges(this._cdr);
    })
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
          var purl = this._projectIssueCaService.getThumbnailPreview('project-issue-corrective-action-document', element.token);
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
  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof PmCorrectiveActionDetailsComponent
   */    
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.updateSubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
    this.resolveSubscriptionEvent.unsubscribe();
    this.addCASubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.addCASubscriptionEventProjectIssue.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    CaStore.individualLoaded = false;
    CaStore.ProjectIssueCaId = null;
    AppStore.showDiscussion = false;
  }



}
