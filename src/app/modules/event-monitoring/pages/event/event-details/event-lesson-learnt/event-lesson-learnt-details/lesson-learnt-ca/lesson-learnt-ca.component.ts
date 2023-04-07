import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventLessonLearntCaService } from 'src/app/core/services/event-monitoring/event-lesson-learnt-ca/event-lesson-learnt-ca.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventLessonLearnedStore } from 'src/app/stores/event-monitoring/events/event-lesson-learned-store';
import { LessonLearntCaStore } from 'src/app/stores/event-monitoring/events/event-lesson-learnt-ca-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;

@Component({
  selector: 'app-lesson-learnt-ca',
  templateUrl: './lesson-learnt-ca.component.html',
  styleUrls: ['./lesson-learnt-ca.component.scss']
})
export class LessonLearntCaComponent implements OnInit {

  @ViewChild('newCa', { static: true }) newCa: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;
  @ViewChild('UpdateCAformModal', { static: true }) UpdateCAformModal: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  EventsStore = EventsStore;
  LessonLearntCaStore = LessonLearntCaStore;
  EventLessonLearnedStore = EventLessonLearnedStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;

  updateSubscriptionEvent:any;
  historySubscriptionEvent:any;
  resolveSubscriptionEvent: any;
  addCASubscriptionEvent: any;
  popupControlEventSubscription: any;

  newCaObject = {
    component: 'CorrectiveAction',
    module: 'event-monitoring',
    value: null,
    type: null,
    page: false
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

  historyPopupObject = {
    id : null,
    type:null
  }

  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();

  constructor(
    private _eventLessonLearntCaService: EventLessonLearntCaService,
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
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this._route.params.subscribe(params => {
      LessonLearntCaStore.LessonLearntCaId = params.id;
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({title:"corrective_action_nodata_title", subtitle: 'corrective_action_nodata_subtitle',buttonText: 'new_corrective_action'});
      if(!AuthStore.getActivityPermission(3200,'CREATE_EVENT_LESSON_LEARNED_CORRECTIVE_ACTION')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.openNewCaModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewCaModal();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.lessonLearntCaModal.subscribe(res => {
      this.closeNewCa();
      this.pageChange();
    })

    this.resolveSubscriptionEvent = this._eventEmitterService.caResolveModalControl.subscribe(res => {
      this.closeUpdateModal();
    })

    this.historySubscriptionEvent = this._eventEmitterService.closeHistoryModal.subscribe(res => {
      this.closeHistoryModal();

    })

    this.updateSubscriptionEvent = this._eventEmitterService.lessonLearntCaUpdateModal.subscribe(item => {
      this.closeUpdateModal();
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange();
    this.setSubmenu();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }

  setSubmenu() {
    var subMenuItems = [
      {activityName: 'CREATE_EVENT_LESSON_LEARNED_CORRECTIVE_ACTION', submenuItem: {type: 'new_modal'}},
      { activityName: null, submenuItem: { type: 'close', path: "../../" } },
    ]
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
  }

  openNewCaModal(){
    this.newCaObject.type = 'Add';
    LessonLearntCaStore.setSubMenuHide(true);
    this.newCaObject.page = true;
    this.newCaObject.value = null; // for clearing the value
    this.openNewCa()
  }

  // for opening form modal
  openNewCa() {
    setTimeout(() => {
      $(this.newCa.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.newCa.nativeElement, 'show');
    this._renderer2.setStyle(this.newCa.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.newCa.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.newCa.nativeElement, 'overflow', 'auto')
  }

  // for closing form modal
  closeNewCa() {
    setTimeout(() => {
      this.newCaObject.type = null;
      this.newCaObject.value = null;
      $(this.newCa.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newCa.nativeElement,'show');
      this._renderer2.setStyle(this.newCa.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
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

  getDaysRemaining() {
    let startDate = new Date(LessonLearntCaStore.correctiveActionDetails?.target_date);
    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }

  getTotaldays() {
    let startDate = new Date(LessonLearntCaStore.correctiveActionDetails?.start_date);
    let targetDate = new Date(LessonLearntCaStore.correctiveActionDetails?.target_date);

    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;
    return this.Totaldays;
  }

  pageChange(){
    let params = `&lesson_learned_ids=${EventLessonLearnedStore.LessonLearntId}`
    this._eventLessonLearntCaService.getItems(false, params).subscribe(res=>{
      console.log(res);
      if (res.data)
      this.getCorrectiveActionDetails(res?.data[0].id);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCorrectiveActionDetails(id) {
    LessonLearntCaStore.LessonLearntCaId = id;
    this._eventLessonLearntCaService.getCa(id).subscribe(() => {
      LessonLearntCaStore.setSelected(id)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // Update Modal
  updateCaModal() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.values = {
      ca_id: LessonLearntCaStore.correctiveActionDetails?.id
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
    this.pageChange();
    this.getCorrectiveActionDetails(LessonLearntCaStore.LessonLearntCaId);
  }



  // History Modal
  openHistoryModal() {
    this.historyPageChange(1);
     this.historyPopupObject.type = 'add'
     this.historyPopupObject.id = LessonLearntCaStore.LessonLearntCaId;
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
    LessonLearntCaStore.unsetCorrectiveActionHistory();
  }

  historyPageChange(newPage: number = null) {
    if (newPage) LessonLearntCaStore.setHistoryCurrentPage(newPage);
    this._eventLessonLearntCaService.getCaHistory(LessonLearntCaStore.correctiveActionDetails?.id).subscribe(res => {
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
      case "lesson-learned-corrective-action-document":
        this._eventLessonLearntCaService.getFilePreview(type, document.event_lesson_learned_corrective_action_id, document.id).subscribe(res => {
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
      this.previewObject.frequency = LessonLearntCaStore.LessonLearntCaId;
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
      return this._eventLessonLearntCaService.getThumbnailPreview(type, token);
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
      case "lesson-learned-corrective-action-document":
        this._eventLessonLearntCaService.downloadFile('lesson-learned-corrective-action-document', document.event_lesson_learned_corrective_action_id, document.id, document.title, null, document);
        break;
      case "document-version":
        this._documentFileService.downloadFile(type, document.document_id, docs.id, document.title, null,docs);
        break;
    }
  }

  changeZIndex() {
    if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
  }

  editCorrectiveACtion() {
    event.stopPropagation();
     this._eventLessonLearntCaService.getCa(LessonLearntCaStore.LessonLearntCaId).subscribe(res=>{
       console.log(res)
      this.newCaObject.type = 'Edit';
      this.newCaObject.value = res;
      LessonLearntCaStore.setSubMenuHide(true);
      this.newCaObject.page = true;
      this.openNewCa();
      this.setDocuments(res.documents);
      this._utilityService.detectChanges(this._cdr);
    })
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
    this._router.navigate([`event-monitoring/events/${EventsStore.selectedEventId}/lesson-learned`]);
  }


  delete() {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = LessonLearntCaStore.LessonLearntCaId;
    this.popupObject.status_btn = '';
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = "delete_c_action";

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deleteCorrectiveActions(status) {
    if (status && this.popupObject.id) {
      this._eventLessonLearntCaService.deleteCa(this.popupObject.id).subscribe(resp => {
        this.pageChange();
        this._utilityService.detectChanges(this._cdr);
        this.clearPopupObject();
        LessonLearntCaStore.LessonLearntCaId = null;
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
    this.popupObject.id = LessonLearntCaStore.LessonLearntCaId;
    this.popupObject.status_btn = 'statusClose';
    this.popupObject.title = 'Are you sure?';
    this.popupObject.subtitle = 'It will change status of the corrective action to close';
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  closeCa(status) {
    if (status && this.popupObject.id) {
      console.log(status);
      this._eventLessonLearntCaService.closeCa(this.popupObject.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        this._router.navigateByUrl('/non-conformity/finding-corrective-actions/' + this.popupObject.id);
        this.clearPopupObject();
        LessonLearntCaStore.LessonLearntCaId = null;
      });
    } else {
      this.clearPopupObject();
    }
    this.getCorrectiveActionDetails(LessonLearntCaStore.LessonLearntCaId);
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  rejectCorrectiveAction() {
    event.stopPropagation();
    this.popupObject.type = 'Confirm';
    this.popupObject.id = LessonLearntCaStore.LessonLearntCaId;
    this.popupObject.status_btn = 'reject';
    this.popupObject.title = 'Are you sure?';
    this.popupObject.subtitle = 'It will change status of the corrective action to reject';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  rejectCa(status) {
    if (status && this.popupObject.id) {
      this._eventLessonLearntCaService.rejectCa(this.popupObject.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        this._router.navigateByUrl('/non-conformity/finding-corrective-actions/' + this.popupObject.id);
        this.clearPopupObject();
        LessonLearntCaStore.LessonLearntCaId = null;
      });
    } else {
      this.clearPopupObject();
    }
    this.getCorrectiveActionDetails(LessonLearntCaStore.LessonLearntCaId);
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
  }


  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  labelDot(data) {
    if (data)  {
    let str = data;
    let color="";
    const myArr = str.split("-");
    color=myArr[0];
    return color;
  }
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
          var purl = this._eventLessonLearntCaService.getThumbnailPreview('lesson-learned-corrective-action-document', element.token);
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
  }
  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.updateSubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
    this.resolveSubscriptionEvent.unsubscribe();
    this.addCASubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    LessonLearntCaStore.individualLoaded = false;
    LessonLearntCaStore.unSetCorrectiveAction();
    LessonLearntCaStore.LessonLearntCaId = null;
    AppStore.showDiscussion = false;
  }
  

}
