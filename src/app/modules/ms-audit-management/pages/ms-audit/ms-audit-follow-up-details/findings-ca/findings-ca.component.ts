import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileServiceService } from 'src/app/core/services/ms-audit-management/file-service/file-service.service';
import { FollowUpService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/follow-up/follow-up.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { AuditCorrectiveActionStore } from 'src/app/stores/ms-audit-management/corrective-acction/corrective-action.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { MsauditFindingsRcaService } from 'src/app/core/services/ms-audit-management/findings-rca/msaudit-findings-rca.service';
import { FindingRCAStore } from 'src/app/stores/ms-audit-management/findings-rca/findings-rca.store';
declare var $: any;
@Component({
  selector: 'app-findings-ca',
  templateUrl: './findings-ca.component.html',
  styleUrls: ['./findings-ca.component.scss']
})
export class FindingsCaComponent implements OnInit,OnDestroy {
  @ViewChild('AddCAformModal', { static: true }) AddCAformModal: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  // @ViewChild('resolveModal', { static: true }) resolveModal: ElementRef;
  @ViewChild('UpdateCAformModal', { static: true }) UpdateCAformModal: ElementRef;
  @ViewChild('historyPopup', { static: true }) historyPopup: ElementRef;
  @ViewChild('mailConfirmationPopup', { static: true }) mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;

  AuditCorrectiveActionStore = AuditCorrectiveActionStore;
  AuditNonConfirmityStore = AuditNonConfirmityStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  ShareItemStore = ShareItemStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  fileUploadPopupStore = fileUploadPopupStore;
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();
  subscription: any;
  responsibleUserObject = [];
  addCASubscriptionEvent: any;
  historySubscriptionEvent: any;
  mailConfirmationData='corrective_action_share_msg';
  


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

  correctiveActionObject = {
    component: 'FindingCorrectiveAction',
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
  PreviewSubscriptionEvent: any;
  popupControlAuditableEventSubscription: any;
  // resolveSubscriptionEvent: any;
  updateSubscriptionEvent: any;
  currectiveActionId: number;
  NoDataItemStore=NoDataItemStore;
  lastItem:any;

  constructor(private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _fileServiceService: FileServiceService,
    private _documentFileService: DocumentFileService,
    private _renderer2: Renderer2,
    private _fileUploadPopupService: FileUploadPopupService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private  _followUpService : FollowUpService,
    private _router: Router) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addCA();
            break;
          case "template":
            this._followUpService.generateTemplate(AuditNonConfirmityStore.msAuditNonConfirmityId);
            break;
          case "export_to_excel":
            this._followUpService.exportToExcel(AuditNonConfirmityStore.msAuditNonConfirmityId);
            break;
          case "share":
            ShareItemStore.setTitle('share_ms_audit_corrective_actions');
            ShareItemStore.formErrors = {};
            break;
          // case "go_to_audit":
          //   this.gotoAuditPage()
          //   break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addCA();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ShareItemStore.shareData) {
        this._followUpService.shareData(ShareItemStore.shareData).subscribe(res => {
          ShareItemStore.unsetShareData();
          ShareItemStore.setTitle('');
          ShareItemStore.unsetData();
          $('.modal-backdrop').remove();
          document.body.classList.remove('modal-open');
          setTimeout(() => {
            $(this.mailConfirmationPopup.nativeElement).modal('show');
          }, 200);
        }, (error) => {
          if (error.status == 422) {
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();

        });
      }

    })
    if((this.checkIsAuditee() ||  AuthStore.isRoleChecking('super-admin')) &&  AuditNonConfirmityStore?.individualMsAuditNonConfirmityDetails?.ms_audit_finding_status?.type!='close')
    {
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_corrective_action' });
    }
    else
    {
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle',});
    }
   
    // Subscribe Event Emitter from corrective action
    // this.subscription = this._followUpService.itemChange.subscribe(item => {
    //   this.getCorrectiveAction(item);
    // })

    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.correctiveActionModalControl.subscribe(res => {
      this.closeFormModal();
    })

    this.PreviewSubscriptionEvent = this._eventEmitterService.correctiveACtionPreviewModal.subscribe(res => {
      this.closePreviewModal();
      this.changeZIndex();
    })

    this.updateSubscriptionEvent = this._eventEmitterService.externalAuditCaUpdateModal.subscribe(res => {
      this.closeUpdateModal();
    })

    this.historySubscriptionEvent = this._eventEmitterService.externalAuditCaHistoryModal.subscribe(res => {
      this.closeHistoryModal();
    })


    // for deleting/activating/deactivating using delete modal
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.pageChange();
    //this.getRca();
  }

  checkIsAuditee(){
    return AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.ms_audit_schedule?.auditees.slice().find(user=> user?.user?.id==AuthStore.user?.id); 
  }

  isUser() {
    // if(ProjectMonitoringStore?.individualLoaded){
      // for (let i of AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.responsible_users) {
        if (AuditCorrectiveActionStore.individualCorrectiveAction?.responsible_user) {
          //var pos = AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.responsible_users.findIndex(e => e.id == AuthStore.user.id)
            if (AuditCorrectiveActionStore.individualCorrectiveAction?.responsible_user.id == AuthStore.user.id){
              return true;
            }
            else{
              return false
            }
        }else{
          return false
        }
      // }
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

  
  getDaysRemaining() {

    let startDate = new Date(AuditCorrectiveActionStore.correctiveActionDetails?.target_date);

    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }
  getTotaldays() {
    let startDate = new Date(AuditCorrectiveActionStore.correctiveActionDetails?.start_date);
    let targetDate = new Date(AuditCorrectiveActionStore.correctiveActionDetails?.target_date);

    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;
    return this.Totaldays;

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


  // Update Modal
  updateCorrectiveAction() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.values = {
      ca_id: AuditCorrectiveActionStore.correctiveActionDetails?.id
    };
    AuditCorrectiveActionStore.clearDocumentDetails();
    this.caUpdateObject.type = 'Edit'
    AuditCorrectiveActionStore.new_ca_id=AuditCorrectiveActionStore.correctiveActionDetails?.id;
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
    // console.log(AuditCorrectiveActionStore.correctiveActionDetails.id);
    // console.log(AuditCorrectiveActionStore.new_ca_id);
    //this.getCorrectiveAction(AuditCorrectiveActionStore.correctiveActionDetails.id);
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
    if (newPage) AuditCorrectiveActionStore.setHistoryCurrentPage(newPage);
    this._followUpService.caHistory(AuditCorrectiveActionStore.correctiveActionDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // page change event
  pageChange() {
    AuditCorrectiveActionStore.unsetCorrectiveActions();// crears previous loaded data if any
    // let params= `&finding_id=${FindingMasterStore.auditFindingId}`;
    this._followUpService.getItems().subscribe(res => {
      this.setSubmenu();
      //console.log(AuditCorrectiveActionStore.allItems)
      if (res.data.length > 0 && AuditCorrectiveActionStore.new_ca_id == null) {
        //console.log(res.data)
        this.getCorrectiveAction(res.data[0].id);
        AuditCorrectiveActionStore.setSelected(res.data[0].id);
      }
      
      if (AuditCorrectiveActionStore.allItems.length > 0 && AuditCorrectiveActionStore.new_ca_id != null) {
        this.getCorrectiveAction(AuditCorrectiveActionStore.new_ca_id);
        AuditCorrectiveActionStore.setSelected(AuditCorrectiveActionStore.new_ca_id);
      }
      this._utilityService.detectChanges(this._cdr);
    })

  }
  // call corrective action by id
  getCorrectiveAction(id: number) {
    AuditCorrectiveActionStore.unsetSelectedItemDetails();
    this.responsibleUserObject = [];
    //DiscussionBotStore.setDiscussionMessage([]);
    //DiscussionBotStore.setbasePath('/findings/');
    // this._externalCorrectiveActionService.unsetSelectedItemDetails(); // Clear previous data from store
    this._followUpService.getCorrectiveActionDetails(id).subscribe(res => {
      this.currectiveActionId = res.id;
      //DiscussionBotStore.setDiscussionAPI(FindingMasterStore.auditFindingId + '/corrective-actions/' + this.currectiveActionId + '/comments');

      // setting submenu items
      // SubMenuItemStore.setSubMenuItems([
      //   { type: 'go_to_audit' },
      //   { type: 'new_modal' },
      //   { type: 'export_to_excel' },
      //   { type: 'share' },
      //   { type: "close", path: "../" }

      // ]);

      
      //this.getImagePrivew();
      //this.downloadDiscussionThumbnial();
      //this.showThumbnailImage();
      //this.getDiscussions();
    })

    //this._followUpService.setSelected(id);
  }

  // getDiscussions() {
  //   this._discussionBotService.getDiscussionMessage().subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  // }

  // downloadDiscussionThumbnial() {
  //   DiscussionBotStore.setThumbnailDownloadAPI(AuditNonConfirmityStore.msAuditNonConfirmityId + '/corrective-actions/' + this.currectiveActionId + '/comments/')
  // }

  // showThumbnailImage() {
  //   DiscussionBotStore.setShowThumbnailAPI(FindingMasterStore.auditFindingId + '/corrective-actions/' + this.currectiveActionId + '/comments/')
  // }

  // getImagePrivew() {
  //   DiscussionBotStore.setDiscussionThumbnailAPI('/internal-audit/files/finding-corrective-action-comment-document/thumbnail?token=')
  // }

  // gotoAuditPage() {
  //   this._router.navigateByUrl(`/external-audit/external-audit/${FindingMasterStore.ea_audit_id}`)
  // }

  setSubmenu()
  {
    var subMenuItems = [
      //{ activityName: 'EA_FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_audit' } },
      //{ activityName: 'CREATE_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } },
      { activityName: 'EXPORT_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
      //{ activityName: 'EXPORT_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
      { activityName: null, submenuItem: { type: "close", path: "../" } },
    ]
    if(this.checkIsAuditee() || AuthStore.isRoleChecking('super-admin') && AuditNonConfirmityStore?.individualMsAuditNonConfirmityDetails?.ms_audit_finding_status?.type!='close')
    {
      subMenuItems.unshift({ activityName: 'CREATE_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } })
    }
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);

    this._utilityService.detectChanges(this._cdr);
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

  editCorrectiveACtion() {
    AuditCorrectiveActionStore.setSubMenuHide(true);
    AuditCorrectiveActionStore.clearDocumentDetails();
    const corrective_action = AuditCorrectiveActionStore.correctiveActionDetails; // assigning values for edit
    setTimeout(() => {
      if (corrective_action.documents.length > 0) {
        this.setDocuments(corrective_action.documents)
      }
    }, 200);
    this.correctiveActionObject.values = {
      id: corrective_action.id,
      title: corrective_action.title,
      findings: corrective_action.findings,
      responsible_user: corrective_action.responsible_user,
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
          var purl = this._fileServiceService.getThumbnailPreview('corrective-action', element.token);
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

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'Confirm': this.closeCorrectiveAction(status)
        break;
      case '': this.deleteCorrectiveActions(status)
        break;
    }
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = 'it_will_remove_the_corrective_action';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteCorrectiveActions(status) {
    if (status && this.popupObject.id) {
      this._followUpService.delete(this.popupObject.id,true).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        AuditCorrectiveActionStore.new_ca_id = null;
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
    this._followUpService.closeCA(this.currectiveActionId).subscribe(res => {
      AuditCorrectiveActionStore.new_ca_id = this.currectiveActionId;
      this.pageChange();
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('hide');
    })
  }

  markClosed() {
    this.popupObject.title = 'Close Corrective Action?';
    this.popupObject.subtitle = 'Are you sure want to close corrective action?';
    this.popupObject.type = 'Confirm';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for opening modal
  openFormModal() {
    // this.ExternalAuditCorrectiveActionStore.clearDocumentDetails();
    setTimeout(() => {
      $(this.AddCAformModal.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.AddCAformModal.nativeElement, 'show');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'overflow', 'auto')
  }

  // for closing the rca form modal
  closeFormModal() {
    setTimeout(() => {
      $(this.AddCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
    this._renderer2.removeClass(this.AddCAformModal.nativeElement, 'show');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'overflow', 'none');
    // console.log(AuditCorrectiveActionStore.correctiveActionDetails.id);
    // console.log(AuditCorrectiveActionStore.correctiveActionDetails.id);
    if(this.correctiveActionObject.type == 'Add')
    {
      AuditCorrectiveActionStore.new_ca_id = null;
      this.pageChange();
    }
    else
    {
      this.getCorrectiveAction(AuditCorrectiveActionStore.correctiveActionDetails.id);
    }
    this.correctiveActionObject.type = null;
    //console.log(AuditCorrectiveActionStore.new_ca_id)
   

  }

  //calling corrective action add modal
  addCA() {
    AuditCorrectiveActionStore.setSubMenuHide(true);
    this.correctiveActionObject.type = null;
    this.correctiveActionObject.values = null;
    this.AuditCorrectiveActionStore.clearDocumentDetails();
    this.correctiveActionObject.type = 'Add';
    this.openFormModal();
    //this._utilityService.detectChanges(this._cdr);
     
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  createImageUrl(type, token) {
    
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token)
    }
    else
      return this._fileServiceService.getThumbnailPreview(type, token);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  // for downloading files
  downloadAuditFindingCADocument(type, auditFindingId, downloadCADocument) {
    event.stopPropagation();
    switch (type) {
      case "downloadCADocument":
        this._fileServiceService.downloadFile(
          "corrective-action",
          AuditNonConfirmityStore.msAuditNonConfirmityId,
          auditFindingId.id,
          downloadCADocument.id,
          downloadCADocument
        );
        break;
    }
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

  viewAttachments(type, document, khDocuments?) {
    switch (type) {
      case "corrective-action":
        this._fileServiceService.getFilePreview(type, AuditNonConfirmityStore?.msAuditNonConfirmityId, document.id, document.ms_audit_finding_corrective_action_id).subscribe(res => {
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
    this.previewObject.fid = AuditNonConfirmityStore?.msAuditNonConfirmityId;
    this.previewObject.ca_id = document.ms_audit_finding_corrective_action_id;
    this.previewObject.preview_url = previewItem;
    // this.previewObject.uploaded_user = document.updated_by ? document.updated_by : document.created_by;
    this.previewObject.uploaded_user = AuditCorrectiveActionStore.correctiveActionDetails.created_by ? AuditCorrectiveActionStore.correctiveActionDetails.created_by : null;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  downloadDocument(type, document, docs?) {
    switch (type) {
      case "corrective-action":
        this._fileServiceService.downloadFile('corrective-action', AuditNonConfirmityStore?.msAuditNonConfirmityId, document.id, document.ms_audit_finding_corrective_action_id,  document.title, document);
        break;
      case "document-version":
        this._documentFileService.downloadFile(type, document.document_id, docs.id, null, document.title, docs);
        break;
    }
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCASubscriptionEvent.unsubscribe();
    AuditCorrectiveActionStore.loaded = false;
    AuditCorrectiveActionStore.new_ca_id = null;
    this.popupControlAuditableEventSubscription.unsubscribe();
    this.PreviewSubscriptionEvent.unsubscribe();
    this.updateSubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
    //this.subscription.unsubscribe();
    AppStore.showDiscussion = false;

  }
  

}
