
import { ChangeDetectorRef, Component, Input, OnInit,ElementRef, ViewChild } from '@angular/core';
import { AssetMaintenanceService } from 'src/app/core/services/asset-management/asset-register/asset-maintenance/asset-maintenance.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AssetMaintenanceScheduleStore } from 'src/app/stores/asset-management/asset-register/asset-schedule-store';
import { AssetManagementService } from 'src/app/core/services/asset-management/asset-management-service/asset-management.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-asset-maintenance-schedule-history',
  templateUrl: './asset-maintenance-schedule-history.component.html',
  styleUrls: ['./asset-maintenance-schedule-history.component.scss']
})
export class AssetMaintenanceScheduleHistoryComponent implements OnInit {
  @Input('source') maintenanceScheduleSource: any;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AssetMaintenanceStore = AssetMaintenanceStore;
  AssetMaintenanceScheduleStore= AssetMaintenanceScheduleStore;
  AppStore = AppStore;
  historyEmptyList = "empty_schedule_history";
  previewObjectHistory = {
		file_details: null,
		component: '',
		schedule_id: null,
		shutdown_id: null,
		componentId: null,
		preview_url: null,
		file_name: '',
		file_type: '',
		size: '',
		uploaded_user: null,
		created_at: null
	};
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _assetMaintenanceService: AssetMaintenanceService,
    private _imageService: ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _assetManagementService: AssetManagementService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
   //console.log(this.maintenanceScheduleSource);
   this.getHistoryDetails();
  }
  createImageUrl(type, token) {
		return this._assetManagementService.getThumbnailPreview(type, token);
	}
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
 }


  closeHistoryModal() {
    this._eventEmitterService.dismissMaintenanceScheduleHistoryModal();

  }
  getHistoryDetails()
  {
    this._assetMaintenanceService.getScheduleUpdate(this.maintenanceScheduleSource.maintenance_id,this.maintenanceScheduleSource.schedule_id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  viewDocument(document, schedule, update, shutdown_id?) {
		if (shutdown_id) {
			this._assetManagementService.getFilePreview('maintenance-shutdown', document.id, document.asset_maintenance_schedule_shutdown_update_id, this.maintenanceScheduleSource.schedule_id, shutdown_id).subscribe(res => {
				var resp: any = this._utilityService.getDownLoadLink(res, document.title);
				this.openPreviewModal(resp, document, this.maintenanceScheduleSource.schedule_id, update, shutdown_id);
			}), (error => {
				if (error.status == 403) {
					this._utilityService.showErrorMessage('Error', 'Permission Denied');
				}
				else {
					this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
				}
			});
		}
		else {
			this._assetManagementService.getFilePreview('maintenance-schedule', document.id, document.asset_maintenance_schedule_update_id, this.maintenanceScheduleSource.schedule_id).subscribe(res => {
				var resp: any = this._utilityService.getDownLoadLink(res, document.title);
				this.openPreviewModal(resp, document, this.maintenanceScheduleSource.schedule_id, update);
			}), (error => {
				if (error.status == 403) {
					this._utilityService.showErrorMessage('Error', 'Permission Denied');
				}
				else {
					this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
				}
			});
		}
	}

  /**
	 * opening the preview model
	 * @param filePreview -get response of file preview
	 * @param itemDetails -certificate details
	 */
	openPreviewModal(filePreview, itemDetails, schedule_id, update, shutdown_id?) {
		let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
		this.previewObjectHistory.component = 'maintenance-schedule';
		this.previewObjectHistory.schedule_id = schedule_id;
		this.previewObjectHistory.shutdown_id = shutdown_id;
		this.previewObjectHistory.componentId = update;
		this.previewObjectHistory.file_details = itemDetails;
		this.previewObjectHistory.file_name = itemDetails.title;
		this.previewObjectHistory.file_type = itemDetails.ext;
		this.previewObjectHistory.preview_url = previewItem;
		this.previewObjectHistory.size = itemDetails.size;
		this.previewObjectHistory.uploaded_user = itemDetails?.created_by;
		//this.previewObjectHistory.uploaded_user['image_token'] = AssetMaintenanceScheduleStore?.individualSchedule?.created_by?.image?.token;
		this.previewObjectHistory.created_at = itemDetails.created_at;
		$(this.filePreviewModal.nativeElement).modal('show');
		this._utilityService.detectChanges(this._cdr);
	}

	closePreviewModal(event) {
		$(this.filePreviewModal.nativeElement).modal('hide');
		this.previewObjectHistory.file_name = null;
		this.previewObjectHistory.file_type = '';
		this.previewObjectHistory.preview_url = '';
		AssetMaintenanceScheduleStore.setAllItemsScheduleHistoryClear();

	}
  checkExtension(ext, extType) {
		var res = this._imageService.checkFileExtensions(ext, extType);
		return res;
	}

  downloadDocument(document, schedule, update) {
   // console.log(document)
		this._assetManagementService.downloadFile('maintenance-schedule', update, document.title, document.id, document, this.maintenanceScheduleSource.schedule_id);
	}

  historyPageChange(newPage: number = null) {
    if (newPage) AssetMaintenanceScheduleStore.setHistoryCurrentPage(newPage);
    this._assetMaintenanceService.getScheduleUpdate(this.maintenanceScheduleSource.maintenance_id,this.maintenanceScheduleSource.schedule_id,'page='+newPage).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

}
