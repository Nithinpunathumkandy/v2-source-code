import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CustomerComplaintActionPlanService } from "src/app/core/services/customer-satisfaction/customer-complaint-action-plan/customer-complaint-action-plan.service";
import { CustomerEngagementFileServiceService } from "src/app/core/services/customer-satisfaction/customer-engagement-file-service/customer-engagement-file-service.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { DocumentFileService } from "src/app/core/services/knowledge-hub/documents/document-file.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthStore } from "src/app/stores/auth.store";
import { CustomerComplaintActionPlanStore } from "src/app/stores/customer-engagement/customer-complaint-action-plans/customer-complaint-action-plans-store";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
declare var $: any;

@Component({
  selector: "app-customer-corrective-action-history-modal",
  templateUrl: "./customer-corrective-action-history-modal.component.html",
  styleUrls: ["./customer-corrective-action-history-modal.component.scss"],
})
export class CustomerCorrectiveActionHistoryModalComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  CustomerComplaintActionPlanStore = CustomerComplaintActionPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  historyEmptyList = "common_nodata_title";

  previewObject = {
    ca_id: null,
    update_id: null,
    file_id: null,
    file_details: null,
    component: "",
    preview_url: null,
    file_name: "",
    file_type: "",
    type: "",
    size: "",
    uploaded_user: null,
    created_at: null,
  };

  previewSubscriptionEvent: any;

  constructor(
    private _imageService: ImageServiceService,
    private _correctiveActionService: CustomerComplaintActionPlanService,
    private _utilityService: UtilityService,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _fileService: CustomerEngagementFileServiceService
  ) {}

  ngOnInit(): void {
    this.previewSubscriptionEvent =
      this._eventEmitterService.customerCorrectiveACtionPreviewModal.subscribe(
        (res) => {
          this.closePreviewModal();
        }
      );
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  closeHistoryModal() {
    this._eventEmitterService.dismissCahistoryControlModal();
  }

  // Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == "document-version") {
      return this._documentFileService.getThumbnailPreview(type, token);
    } else return this._fileService.getThumbnailPreview(type, token);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType);
  }

  getColorKey(colorcode) {
    var label_color = colorcode.split("-");
    return "draft-tag-" + label_color;
  }

  openPreviewModal(filePreview, itemDetails, history) {
    let uploadedUser = {
      first_name: history.created_by.first_name,
      last_name: history.created_by.last_name,
      designation: history.created_by.designation,
      image: {
        token: itemDetails.token,
      },
    };

    let previewItem =
      this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.type = "customer-compaint-action-plans-update";
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    (this.previewObject.uploaded_user = uploadedUser),
      (this.previewObject.created_at = itemDetails?.created_at);
    this.previewObject.ca_id =
      CustomerComplaintActionPlanStore.complaintActionPlanId;
    this.previewObject.update_id =
      itemDetails.finding_corrective_action_update_id;
    this.previewObject.file_id = itemDetails.id;
    setTimeout(() => {
      this._renderer2.setStyle(
        this.filePreviewModal.nativeElement,
        "z-index",
        9999999
      );
      this._renderer2.setStyle(
        this.filePreviewModal.nativeElement,
        "overflow",
        "auto"
      );
      $(this.filePreviewModal.nativeElement).modal("show");
    }, 200);
    this._utilityService.detectChanges(this._cdr);
  }

  closePreviewModal() {
    this._renderer2.setStyle(
      this.filePreviewModal.nativeElement,
      "z-index",
      99
    );
    this._renderer2.setStyle(
      this.filePreviewModal.nativeElement,
      "overflow",
      "none"
    );
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.preview_url = "";
    this.previewObject.component = "";
  }

  viewDocument(documents, history) {
    this._fileService
      .getFilePreview(
        "customer-compaint-action-plans-update",
        CustomerComplaintActionPlanStore.complaintActionPlanId,
        null,
        history.id,
        documents.id
      )
      .subscribe((res) => {
        var resp: any = this._utilityService.getDownLoadLink(
          res,
          document.title
        );
        this.openPreviewModal(resp, documents, history);
      }),
      (error) => {
        if (error.status == 403) {
          this._utilityService.showErrorMessage("Error", "Permission Denied");
        } else {
          this._utilityService.showErrorMessage(
            "Error",
            "Unable to generate Preview"
          );
        }
      };
  }
  // File Preview,Download Starts Here
  downloadDocumentFile(updateId, fileId) {
    event.stopPropagation();
    this._fileService.downloadFile(
      "customer-compaint-action-plans-update",
      CustomerComplaintActionPlanStore.complaintActionPlanId,
      null,
      updateId,
      null,
      fileId
    );
  }

  ngOnDestroy() {
    this.previewSubscriptionEvent.unsubscribe();
  }
  
}
