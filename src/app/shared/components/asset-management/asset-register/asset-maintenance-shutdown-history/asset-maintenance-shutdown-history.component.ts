
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
  selector: 'app-asset-maintenance-shutdown-history',
  templateUrl: './asset-maintenance-shutdown-history.component.html',
  styleUrls: ['./asset-maintenance-shutdown-history.component.scss']
})
export class AssetMaintenanceShutdownHistoryComponent implements OnInit {

  @Input('source') maintenanceShutdownSource: any;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AssetMaintenanceStore = AssetMaintenanceStore;
  AssetMaintenanceScheduleStore= AssetMaintenanceScheduleStore;
  AppStore = AppStore;
  historyEmptyList = "empty_shutdown_history";
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
       this._eventEmitterService.dismissMaintenanceShutdownHistoryModal();
   
     }
     getHistoryDetails()
     {
       this._assetMaintenanceService.getShutdownUpdate(this.maintenanceShutdownSource.maintenance_id,this.maintenanceShutdownSource.schedule_id,this.maintenanceShutdownSource.shutdown_id).subscribe(res => {
         this._utilityService.detectChanges(this._cdr);
       })
     }
   
     viewDocument(document, schedule, update, shutdown_id?) {
      //  console.log(document)
      //  console.log(schedule)
      //  console.log(update)
      //  console.log(shutdown_id)

       if (shutdown_id) {
         this._assetManagementService.getFilePreview('maintenance-shutdown', document.id, document.asset_maintenance_schedule_shutdown_update_id, this.maintenanceShutdownSource.schedule_id, this.maintenanceShutdownSource.shutdown_id).subscribe(res => {
           var resp: any = this._utilityService.getDownLoadLink(res, document.title);
           this.openPreviewModal(resp, document, this.maintenanceShutdownSource.schedule_id, update, this.maintenanceShutdownSource.shutdown_id);
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
         this._assetManagementService.getFilePreview('maintenance-schedule', document.id, document.asset_maintenance_schedule_update_id, this.maintenanceShutdownSource.schedule_id).subscribe(res => {
           var resp: any = this._utilityService.getDownLoadLink(res, document.title);
           this.openPreviewModal(resp, document, this.maintenanceShutdownSource.schedule_id, update);
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
       this.previewObjectHistory.component = 'maintenance-shutdown';
       this.previewObjectHistory.schedule_id = schedule_id;
       this.previewObjectHistory.shutdown_id = shutdown_id;
       this.previewObjectHistory.componentId = update;
       this.previewObjectHistory.file_details = itemDetails;
       this.previewObjectHistory.file_name = itemDetails.title;
       this.previewObjectHistory.file_type = itemDetails.ext;
       this.previewObjectHistory.preview_url = previewItem;
       this.previewObjectHistory.size = itemDetails.size;
       this.previewObjectHistory.uploaded_user =itemDetails?.created_by;
       //this.previewObjectHistory.uploaded_user['image_token'] =itemDetails?.created_by_image_token;
       this.previewObjectHistory.created_at = itemDetails.created_at;
       $(this.filePreviewModal.nativeElement).modal('show');
       this._utilityService.detectChanges(this._cdr);
     }
   
     closePreviewModal(event) {
       $(this.filePreviewModal.nativeElement).modal('hide');
       this.previewObjectHistory.file_name = null;
       this.previewObjectHistory.file_type = '';
       this.previewObjectHistory.preview_url = '';
       AssetMaintenanceScheduleStore.setAllItemsShutdownHistoryClear();
     }
     checkExtension(ext, extType) {
       var res = this._imageService.checkFileExtensions(ext, extType);
       return res;
     }
   
     downloadDocument(document, schedule, update,shutdown_id?) {
      // console.log(document)
       this._assetManagementService.downloadFile('maintenance-shutdown', update, document.title, document.id, document, this.maintenanceShutdownSource.schedule_id,this.maintenanceShutdownSource.shutdown_id);
     }
   
     historyPageChange(newPage: number = null) {
       if (newPage) AssetMaintenanceScheduleStore.setShutdwnHistoryCurrentPage(newPage);
       this._assetMaintenanceService.getShutdownUpdate(this.maintenanceShutdownSource.maintenance_id,this.maintenanceShutdownSource.schedule_id,this.maintenanceShutdownSource.shutdown_id,'page='+newPage).subscribe(res => {
         this._utilityService.detectChanges(this._cdr);
       })
     }

}
