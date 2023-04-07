import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ActivatedRoute, Router } from '@angular/router';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { AmAuditFindingService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
declare var $: any;

@Component({
  selector: 'app-am-audit-finding-info',
  templateUrl: './am-audit-finding-info.component.html',
  styleUrls: ['./am-audit-finding-info.component.scss']
})
export class AmAuditFindingInfoComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ImportItemStore = ImportItemStore;
  AmAuditFindingStore = AmAuditFindingStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  findingObject = {
    component: 'Audit Field Work',
    values: null,
    type: null
  };
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  auditFindingEventSubscription: any;

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };


  constructor(private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _auditFindingService: AmAuditFindingService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _route:ActivatedRoute,
    private _auditManagementService:AuditManagementService,
    private _documentFileService:DocumentFileService,
    private _sanitizer:DomSanitizer,
    private _fileUploadPopupService:FileUploadPopupService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'fieldwork'){
  if(AmAuditFindingStore?.individualFindingDetails?.am_audit_finding_status?.type!='closed' && AmAuditFindingStore?.individualFindingDetails?.is_corrective_action_closed && AmAuditFindingStore?.individualFindingDetails?.created_by?.id == AuthStore.user?.id){
    var subMenuItems = [
      { activityName: 'UPDATE_AM_AUDIT_FINDING', submenuItem: { type: 'edit_modal' } },
      { activityName: 'DELETE_AM_AUDIT_FINDING', submenuItem: { type: 'delete' } },
      { activityName: 'CLOSE_AM_AUDIT_FINDING', submenuItem: { type: 'close_cmn' } },
      { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings' } },
    ]
  }
  else{
    if(AmAuditFindingStore?.individualFindingDetails?.am_audit_finding_status?.type!='closed'){
      subMenuItems = [
        { activityName: 'UPDATE_AM_AUDIT_FINDING', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_AM_AUDIT_FINDING', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings' } },
      ]
    }
    else{
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings' } },
      ]
    }

  }
  
}
else if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'finding'){
  if(AmAuditFindingStore?.individualFindingDetails?.am_audit_finding_status?.type!='closed' && AmAuditFindingStore?.individualFindingDetails?.is_corrective_action_closed && AmAuditFindingStore?.individualFindingDetails?.created_by?.id == AuthStore.user?.id){
  
  var subMenuItems = [
    { activityName: 'UPDATE_AM_AUDIT_FINDING', submenuItem: { type: 'edit_modal' } },
    { activityName: 'DELETE_AM_AUDIT_FINDING', submenuItem: { type: 'delete' } },
    { activityName: 'CLOSE_AM_AUDIT_FINDING', submenuItem: { type: 'close_cmn' } },
    { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-findings' } },
  ]
}
else{
  if(AmAuditFindingStore?.individualFindingDetails?.am_audit_finding_status?.type!='closed'){
  subMenuItems = [
    { activityName: 'UPDATE_AM_AUDIT_FINDING', submenuItem: { type: 'edit_modal' } },
    { activityName: 'DELETE_AM_AUDIT_FINDING', submenuItem: { type: 'delete' } },
    { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-findings' } },
  ]
}
else{
  subMenuItems = [

    { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-findings' } },
  ]
}
}
}
else{
   subMenuItems = [
    { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-findings' } },
  ]
}
     

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              this.editFinding(AmAuditFindingStore.auditFindingId);
            }, 1000);
            break;
          case "delete":
            this.deleteAuditFinding(AmAuditFindingStore.auditFindingId);
            break;
            case "close_cmn":
              this.closeAuditFinding(AmAuditFindingStore.auditFindingId);
              break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.auditFindingEventSubscription = this._eventEmitterService.amAuditFindingModal.subscribe(item => {
      this.closeFormModal();
    })



    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    if (AmAuditFindingStore.auditFindingId == null || !AmAuditFindingStore.individual_audit_finding_loaded || AmAuditFieldWorkStore.auditFieldWorkId==null)
      this.getDetails();

      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

  }

  getDetails() {

    let id: number;
    this._route.params.subscribe(params => {
      let fieldwork_id = params['id'];
      id = +params['finding_id']; // (+) converts string 'id' to a number
      AmAuditFieldWorkStore.auditFieldWorkId = fieldwork_id;
      this._auditFindingService.saveAuditFindingId(id);
      this._auditFindingService.getItem(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    })
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  /**
* Delete the audit field work finding
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._auditFindingService.delete(this.deleteObject.id);
          break;
        case 'Confirm':type=this._auditFindingService.closeAuditFinding(this.deleteObject.id);
        break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if(this.deleteObject.type==''){
            if(AmAuditFindingStore.findingComponent == 'fieldwork'){
              this._router.navigateByUrl('/audit-management/am-audit-field-works');
            }
            else{
              this._router.navigateByUrl('/audit-management/am-audit-findings');
            }
          }
         
         
        }, 500);
        this.clearDeleteObject();
      }, (error => {
        setTimeout(() => {
          if (error.status == 405) {
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  closeFormModal() {
    this.findingObject.type = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  deleteAuditFinding(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_finding_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  
  closeAuditFinding(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.subtitle = 'close_am_audit_finding_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }


  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }


  editFinding(id) {
    AmAuditFindingStore.setAuditFindingId(id);
    this._auditFindingService.getItem(id).subscribe(res => {

      this.findingObject.values = {

        id: id,
        am_audit_id:res['am_audit']?.id,
        am_audit_test_plan_id:res['am_audit_test_plan']?.id,
        finding_risk_rating_id: res['am_audit_finding_risk_rating'],
        title: res['title'],
        description: res['description'],
        recommendation: res['recommendation'],
        department_response: res['department_response'],
        remarks:res['remarks'],
        finding_risks: res['am_audit_finding_risks']?res['am_audit_finding_risks']:[],
        documents: res['documents'],

      }
      this.clearCommonFilePopupDocuments();
      if (res['documents']?.length > 0) {
        this.setDocuments(res['documents']);
      }

      this.findingObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);

    })
  }


  setDocuments(documents) {

    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element?.kh_document?.versions?.forEach(innerElement => {

          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement

            })
          }

        });
      }
      else {
        if (element && element.token) {
          var purl = this._auditManagementService.getThumbnailPreview('finding-document', element.token)
          var lDetails = {
            created_at: element.created_at,
            created_by: element.created_by,
            updated_at: element.updated_at,
            updated_by: element.updated_by,
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            asset_id: element.asset_id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl);

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);

  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }




  getPopupDetails(user) {
    let userDetailObject: any = {};
    userDetailObject['first_name'] = user.first_name;
    userDetailObject['last_name'] = user.last_name;
    userDetailObject['designation'] = user.designation?user.designation:'';
    userDetailObject['image_token'] = user.image_token;
    userDetailObject['department'] = user.department?user.department:'';
    return userDetailObject;
  
  }

  getAuditorPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }

   
  
	getCreatedByPopupDetails(users, supplier: boolean = false) {
		let userDetial: any = {};

		
			userDetial['first_name'] = users?.first_name ? users?.first_name : '';
			userDetial['last_name'] = users?.last_name;
			userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
			userDetial['image_token'] = users?.image?.token;
			userDetial['email'] = users?.email;
			userDetial['mobile'] = users?.mobile;
			userDetial['id'] = users?.id;
			userDetial['department'] = users?.department;
			userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
      userDetial['created_at']=AmAuditFindingStore.individualFindingDetails?.created_at;
		
		return userDetial;
	}


  getArrayFormatedString(type, items) {
		return this._helperService.getArraySeperatedString(',', type, items);
	}

  gotoTestPlan(id){
    this._router.navigateByUrl('/audit-management/am-audit-field-works/'+AmAuditFindingStore.auditFindingId+'/am-audit-test-plans/'+id);
  }

  
  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "audit-finding-document":
        this._auditManagementService
          .getFilePreview(type, documents.finding_id, documentFile.id)
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
    this.previewObject.component = type
  
  
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document;
      this.previewObject.uploaded_user =AmAuditFindingStore.individualFindingDetails?.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }
  
    // Closes from preview
    closePreviewModal(event) {
      $(this.filePreviewModal.nativeElement).modal("hide");
      this.previewObject.preview_url = "";
      this.previewObject.uploaded_user = null;
      this.previewObject.created_at = "";
      this.previewObject.file_details = null;
      this.previewObject.componentId = null;
    }
  
  
    downloadDocumentFile(type, document, docs?) {
      event.stopPropagation();
      switch (type) {
        case "audit-finding-document":
          this._auditManagementService.downloadFile(
            type,
            document.finding_id,
            document.id,
            document.title,
            null,
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

    createImageUrl(type,token) {
      if (type == 'audit-finding-document')
        return this._auditManagementService.getThumbnailPreview(type, token);
      else if(type=='document-version')
        return this._documentFileService.getThumbnailPreview(type, token);
      else
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

    
  	// extension check function
	checkExtension(ext, extType) {
		return this._imageService.checkFileExtensions(ext, extType)
	}

  
  getCreatedByDetails(user) {
    let userDetail: any = {};
    userDetail['first_name'] = user?.first_name ? user?.first_name : '';
    userDetail['last_name'] = user?.last_name;
    userDetail['designation'] = user?.designation;
    userDetail['image_token'] = user?.image?.token;
    userDetail['email'] = user?.email;
    userDetail['mobile'] = user?.mobile;
    userDetail['id'] = user?.id;
    userDetail['department'] = user?.department;
    userDetail['status_id'] = user?.status?.id;
    userDetail['created_at'] = AmAuditFindingStore.individualFindingDetails?.created_at;

    return userDetail;
  }

  removeDot(data){
    return data.split('-')[0];
  }
  ngOnDestroy() {
    this.deleteEventSubscription?.unsubscribe();
    this.idleTimeoutSubscription?.unsubscribe();
    this.networkFailureSubscription?.unsubscribe();
    this.auditFindingEventSubscription?.unsubscribe();
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();

  }
}
