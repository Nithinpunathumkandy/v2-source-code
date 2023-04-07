import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditTestPlanService } from 'src/app/core/services/audit-management/am-audit/am-audit-test-plan/am-audit-test-plan.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditTestPlanStore } from 'src/app/stores/audit-management/am-audit/am-audit-test-plan.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
declare var $: any;
@Component({
  selector: 'app-am-audit-test-plan-details',
  templateUrl: './am-audit-test-plan-details.component.html',
  styleUrls: ['./am-audit-test-plan-details.component.scss']
})
export class AmAuditTestPlanDetailsComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  AppStore = AppStore;
  AmAuditsStore=AmAuditsStore;
  AmAuditTestPlanStore = AmAuditTestPlanStore;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };
  deleteEventSubscription:any;
  testPlanModal:any;

deleteObject = {
  id: null,
  type: '',
  subtitle: ''
};
testPlanObject = {
  component: 'Audit',
  values: null,
  type: null,
};

reactionDisposer:IReactionDisposer;

  constructor(private _route:ActivatedRoute,
    private _auditTestPlanService:AmAuditTestPlanService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _imageService:ImageServiceService,
    private _humanCapitalService:HumanCapitalService,
    private _auditManagementService:AuditManagementService,
    private _documentFileService:DocumentFileService,
    private _sanitizer:DomSanitizer,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _router:Router,
    private _fileUploadPopupService:FileUploadPopupService,
    private _renderer2:Renderer2
    ) { }

  ngOnInit(): void {
     
    this.reactionDisposer = autorun(() => {
      if(AmAuditsStore.editAccessUser()){
        var subMenuItems = [
          { activityName: 'DELETE_AM_AUDIT_TEST_PLAN', submenuItem: { type: 'delete' } },
          { activityName: 'UPDATE_AM_AUDIT_TEST_PLAN', submenuItem: { type: 'edit_modal' } },
          { activityName: null, submenuItem: { type: 'close',path:AppStore.previousUrl } },
  
        ]
      }
      else{
        subMenuItems = [
          { activityName: null, submenuItem: { type: 'close',path:AppStore.previousUrl } },
  
        ]
      }
     
      

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editTestPlan(AmAuditTestPlanStore.auditTestPlanId);
            break;
          case "delete":
          this.deleteTestPlan(AmAuditTestPlanStore.auditTestPlanId);
          break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })
    this.getDetails();

    this.testPlanModal = this._eventEmitterService.amAuditTestPlanModal.subscribe(item => {
      this.closeFormModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
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
  

    this.getDetails();
  }

  getDetails() {
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['test_id']; // (+) converts string 'id' to a number
      AmAuditTestPlanStore.setAuditTestPlanId(id);
      this.getTestPlanDetails(id);
    })
  }

  
  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  getTestPlanDetails(id){
    this._auditTestPlanService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "test-plan-document":
        this._auditManagementService
          .getFilePreview(type, documents.am_audit_test_plan_id, documentFile.id)
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
      this.previewObject.uploaded_user =AmAuditTestPlanStore.individualTestPlanDetails?.created_by;
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
        case "test-plan-document":
          this._auditManagementService.downloadFile(
            type,
            document.am_audit_test_plan_id,
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
      if (type == 'test-plan-document')
        return this._auditManagementService.getThumbnailPreview(type, token);
      else if(type=='document-version')
        return this._documentFileService.getThumbnailPreview(type, token);
      else
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }
  
  getDefaultImage(){
      return this._imageService.getDefaultImageUrl('user-logo');
  }

  
  	// extension check function
	checkExtension(ext, extType) {
		return this._imageService.checkFileExtensions(ext, extType)
	}

  
  closeFormModal() {
    this.testPlanObject.type = null;
    this.getTestPlanDetails(AmAuditTestPlanStore.auditTestPlanId);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }


  /**
* Delete the audit test plan
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._auditTestPlanService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('/audit-management/am-audits/'+AmAuditsStore.auditId+'/am-audit-test-plans');
         
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

  deleteTestPlan(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_test_plan_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  getPopupDetails(user) {
    let userDetailObject: any = {};
    userDetailObject['first_name'] = user.created_by_first_name;
    userDetailObject['last_name'] = user.created_by_last_name;
    userDetailObject['designation'] = user.created_by_designation;
    userDetailObject['department'] = user.created_by_department;
    userDetailObject['image_token'] = user.created_by_image_token;
    return userDetailObject;

  }


  editTestPlan(id) {
    AmAuditTestPlanStore.setAuditTestPlanId(id);
    this._auditTestPlanService.getItem(id).subscribe(res => {

      this.testPlanObject.values = {
        id: id,
        am_audit_id: AmAuditsStore.auditId,
        description: res['description'],
        title: res['title'],
        control_ids: res['test_plan_controls'],
        risk_ids: res['test_plan_risks'],
        objective_ids: res['test_plan_objectives'],
        documents: res['test_plan_documents'],
        document_version_contents:res['test_plan_document_version_contents']
      }
      this.clearCommonFilePopupDocuments();
      if (res['test_plan_documents']?.length > 0) {
        this.setDocuments(res['test_plan_documents']);
      }

      this.testPlanObject.type = 'Edit';

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
          var purl = this._auditManagementService.getThumbnailPreview('test-plan-document', element.token)
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
    userDetail['created_at'] = AmAuditTestPlanStore.individualTestPlanDetails?.created_at;

    return userDetail;
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.testPlanModal.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
  }



}
