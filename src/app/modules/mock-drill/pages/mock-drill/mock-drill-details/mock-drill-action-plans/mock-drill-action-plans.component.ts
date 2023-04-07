import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MockDrillActionPlanService } from 'src/app/core/services/mock-drill/mock-drill-action-plans/mock-drill-action-plan.service';
import { MockDrillService } from 'src/app/core/services/mock-drill/mock-drill/mock-drill.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillActionPlanStore } from 'src/app/stores/mock-drill/mock-drill-action-plan/mock-drill-action-plan-store';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-mock-drill-action-plans',
  templateUrl: './mock-drill-action-plans.component.html',
  styleUrls: ['./mock-drill-action-plans.component.scss']
})
export class MockDrillActionPlansComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('actionPlanUpdate') actionPlanUpdate: ElementRef;
  @ViewChild('actionPlanHistory') actionPlanHistory: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  reactionDisposer: IReactionDisposer;

  actionPlansObject = { type: null, values: null }
  modelEventSubscriptionUpdate: any;
  popupControlEventSubscription: any;
  fileUploadPopupSubscriptionEvent: any;
  modelEventSubscriptionHistory: any;
  modelEventSubscriptionCommon: any;
  MockDrillActionPlanStore = MockDrillActionPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    updateId: null,
  };
  isResponsibleUser: boolean;
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _actionPlansService: MockDrillActionPlanService,
    private _mockDrillService: MockDrillService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _sanitizer: DomSanitizer,) { }


  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_action_plans' });
    setTimeout(() => {
      var subMenuItems = [
        { activityName: 'CREATE_MOCK_DRILL_ACTION_PLAN', submenuItem: { type: 'new_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];
      SubMenuItemStore.makeEmpty();
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    }, 300);
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => { this.addActionPlan('new'); }, 200)
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addActionPlan('new');
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.modelEventSubscriptionCommon = this._eventEmitterService.commonModal.subscribe(res => {
      if (res && res == "Edit")
        this.getActionPlan(MockDrillActionPlanStore.selectedPlan?.id);
      else
        this.pageChange(1, MockDrillStore.mock_drill_id);
      this.closeFormModal();
    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });
    this.modelEventSubscriptionUpdate = this._eventEmitterService.actionPlanUpadateModal.subscribe(res => {
      this.closeModelUpdate();
    });

    this.modelEventSubscriptionHistory = this._eventEmitterService.actionPlanHistoryModal.subscribe(res => {
      this.closeHistoryModal();
    });
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.changeZIndex();
    })
    this.pageChange(1, MockDrillStore.mock_drill_id)
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteActionPlans(status);
        break;
    }
    if (!status)
      $(this.confirmationPopUp.nativeElement).modal('hide');
  }

  // delete function call
  deleteActionPlans(status: boolean) {
    if (status && this.popupObject.id) {
      this._actionPlansService.delete(this.popupObject.id).subscribe(resp => {
        this.clearPopupObject();
        this.pageChange(1, MockDrillStore.mock_drill_id);
        setTimeout(() => {
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 350);
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  addActionPlan(type) {
    MockDrillActionPlanStore.editFlag = type != "new";
    this.actionPlansObject.type = 'Add';
    this.actionPlansObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      ($(this.formModal.nativeElement) as any).modal('show');
    }, 100);
  }

  closeFormModal() {
    ($(this.formModal.nativeElement) as any).modal('hide');
    this.actionPlansObject.type = null;
  }

  getActionPlan(id: number) {
    MockDrillActionPlanStore.unsetIndividualActionPlansDetails();
    this._actionPlansService.getItem(id).subscribe(res => {
      this.isResponsibleUser = AuthStore.user.id == MockDrillActionPlanStore.selectedPlan.responsible_user.id ? true : false;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  labelDot(data) {
    let str = data;
    let color = "";
    const myArr = str.split("-");
    color = myArr[0];
    return color;
  }

  pageChange(newPage: number = null, mock_drill_id?) {
    if (newPage) MockDrillActionPlanStore.setCurrentPage(newPage);
    this._actionPlansService.getItems(false, `&mock_drill_ids=${mock_drill_id}`).subscribe((res) => {
      if (res?.data[0]) {
        this.getActionPlan(res?.data[0]?.id);
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "action-plan":
        this._actionPlansService
          .getFilePreview(type, MockDrillActionPlanStore.selectedPlan.id, documentFile.id, documents.mock_drill_action_plan_update_id)
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
        this._documentFileService.getFilePreview(type, documents.document_id, documentFile.id).subscribe((res) => {
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
    this.previewObject.component = type;

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.updateId = document.mock_drill_action_plan_update_id;
      this.previewObject.componentId = MockDrillActionPlanStore.selectedPlan.id;

      this.previewObject.uploaded_user = MockDrillActionPlanStore.selectedPlan.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // kh-module base document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "action-plan":
        this._actionPlansService.downloadFile(
          type,
          MockDrillActionPlanStore.selectedPlan.id,
          document.id,
          document.mock_drill_action_plan_update_id,
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

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else if (type == 'action-plan')
      return this._actionPlansService.getThumbnailPreview(type, token);
  }

  closeModelUpdate() {
    MockDrillActionPlanStore.action_plan_update = false;
    $(this.actionPlanUpdate.nativeElement).modal('hide');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    AppStore.showDiscussion = true;
  }

  openHistoryModal() {
    MockDrillActionPlanStore.action_plan_history = true;
    $(this.actionPlanHistory.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeHistoryModal() {
    MockDrillActionPlanStore.action_plan_history = false;
    $(this.actionPlanHistory.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    MockDrillActionPlanStore.unSetActionPlanHistory();
    AppStore.showDiscussion = true;
  }

  editActionPlan() {
    if (MockDrillActionPlanStore.selectedPlan?.id) {
      this.actionPlansObject.values = {
        id: MockDrillActionPlanStore.selectedPlan?.id,
        title: MockDrillActionPlanStore.selectedPlan?.title,
        mock_drill_id: MockDrillActionPlanStore.selectedPlan?.mock_drill,
        completion: MockDrillActionPlanStore.selectedPlan?.completion ? MockDrillActionPlanStore.selectedPlan?.completion : 0,
        start_date: MockDrillActionPlanStore.selectedPlan?.start_date,
        target_date: MockDrillActionPlanStore.selectedPlan?.target_date,
        description: MockDrillActionPlanStore.selectedPlan?.description,
        responsible_user_id: MockDrillActionPlanStore.selectedPlan?.responsible_user,
      }
      this.actionPlansObject.type = 'Edit';
      MockDrillActionPlanStore.editFlag = true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }
  }

  addModelUpdate() {
    MockDrillActionPlanStore.action_plan_update = true;
    $(this.actionPlanUpdate.nativeElement).modal('show');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  deleteActionPlan(id) {
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.title = 'Delete';
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
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

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
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

  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    this.modelEventSubscriptionUpdate.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.modelEventSubscriptionHistory.unsubscribe();
    this.modelEventSubscriptionCommon.unsubscribe();
  }
}
