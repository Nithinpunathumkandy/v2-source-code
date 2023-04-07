import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AssetManagementService } from 'src/app/core/services/asset-management/asset-management-service/asset-management.service';
import { AssetMaintenanceService } from 'src/app/core/services/asset-management/asset-register/asset-maintenance/asset-maintenance.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SuppliersMasterStore } from 'src/app/stores/masters/suppliers-management/suppliers';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { SuppliersService } from 'src/app/core/services/masters/suppliers-management/suppliers/suppliers.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';

declare var $: any;
@Component({
	selector: 'app-maintenance-details',
	templateUrl: './maintenance-details.component.html',
	styleUrls: ['./maintenance-details.component.scss']
})
export class MaintenanceDetailsComponent implements OnInit {
	@ViewChild('maintenanceReview') maintenanceReview: ElementRef;
	@ViewChild('shutdownReview') shutdownReview: ElementRef;
	@ViewChild('filePreviewModal') filePreviewModal: ElementRef;
	@ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;
	@ViewChild('shutdownHistory') shutdownHistory: ElementRef;
	@ViewChild('maintenanceHistory') maintenanceHistory: ElementRef;
	AssetRegisterStore = AssetRegisterStore;
	AssetMaintenanceStore = AssetMaintenanceStore;
	AppStore = AppStore;
	reactionDisposer: IReactionDisposer;
	SubMenuItemStore = SubMenuItemStore;
	shutdownMaintenanceHistoryEventSubscription: any;
	scheduleMaintenanceHistoryEventSubscription: any;
	currentScheduleIndex = null;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	shutdownReviewOpened = false;
	maintenanceReviewOpened = false;
	shutdownHistoryOpened = false;
	maintenanceHistoryOpened = false;
	maintenanceId: any;
	shutdownObject = {
		maintenance_id: null,
		schedule_id: null,
		shutdown_id: null,
		values: null
	}

	popupObject = {
		type: "",
		title: "",
		id: null,
		subtitle: "",
	};

	scheduleObject = {
		maintenance_id: null,
		schedule_id: null,
		values: null

	}
	previewObject = {
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
	}
	shutdownHistoryObject = {
		maintenance_id: null,
		schedule_id: null,
		shutdown_id: null,
		values: null

	}
	historyObject = {
		maintenance_id: null,
		schedule_id: null,
		values: null

	}
	shutdownReviewEventSubscription: any;
	scheduleReviewEventSubscription: any
	deleteEventSubscription: any;

	constructor(private _router: Router,
		private _assetMaintenanceService: AssetMaintenanceService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2,
		private _eventEmitterService: EventEmitterService,
		private _assetManagementService: AssetManagementService,
		private _imageService: ImageServiceService,
		private _sanitizer: DomSanitizer,
		private _supplierService: SuppliersService) { }


	ngOnInit(): void {
		if (AssetRegisterStore.currentAssetPage == 'maintenance') {
			BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
		}
		else {
			BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
		}
		this.maintenanceId = AssetMaintenanceStore.getmaintenanceId;
		// AssetRegisterStore.currentAssetPage='maintenance';

		this.reactionDisposer = autorun(() => {

			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "edit_modal":
						AssetMaintenanceStore.editFlag = true;
						this.editMaintenance(AssetMaintenanceStore.getmaintenanceId);
						break;
					case "delete":
						this.delete(AssetMaintenanceStore.getmaintenanceId);
						break;

					case "goto_asset":
						this.gotoAssetProfile();
						break;

					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
		});

		if (!AssetMaintenanceStore.maintenanceId) {
			if (AssetRegisterStore.assetId)
				this._router.navigateByUrl('asset-management/assets/' + AssetRegisterStore.assetId + '/maintenances');
			else
				this._router.navigateByUrl('asset-management/assets');

		}
		else {

		}
		// this.reactionDisposer = autorun(() => {
		//   if (SubMenuItemStore.clikedSubMenuItem) {
		//     switch (SubMenuItemStore.clikedSubMenuItem.type) {
		//       default:
		//         break;
		//     }
		//     // Don't forget to unset clicked item immediately after using it
		//     SubMenuItemStore.unSetClickedSubMenuItem();
		//   }
		//   // setTimeout(() => {

		//   //   this.maintenanceForm.pristine;
		//   // }, 250);

		// });
		AppStore.showDiscussion = false
		SubMenuItemStore.setNoUserTab(true);
		if (AssetRegisterStore.currentAssetPage == 'maintenance') {
			var subMenuItems = [
				{ activityName: null, submenuItem: { type: 'goto_asset' } },
				{ activityName: null, submenuItem: { type: 'edit_modal' } },
				{ activityName: null, submenuItem: { type: 'delete' } },
				{ activityName: null, submenuItem: { type: 'close', path: '/asset-management/assets/' + AssetRegisterStore.assetId + '/maintenances' } },
		
			  ]
		
			  this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
		}
		else {
			var subMenuItems = [
			
				{ activityName: null, submenuItem: { type: 'edit_modal' } },
				{ activityName: null, submenuItem: { type: 'delete' } },
				{ activityName: null, submenuItem: { type: 'close',  path: '/asset-management/asset-maintenances' } },
		
			  ]
		
			  this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
		
		}

		this.shutdownReviewEventSubscription = this._eventEmitterService.maintenanceShutdownReview.subscribe(
			() => {
				this.closeShutdownReview();
			});

		this.scheduleReviewEventSubscription = this._eventEmitterService.maintenanceScheduleReview.subscribe(
			() => {
				this.closeMaintenanceReview();
			});

		this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(
			(item) => {
				this.deleteMaintenance(item);
			}
		);
		this.scheduleMaintenanceHistoryEventSubscription = this._eventEmitterService.maintenanceScheduleHistory.subscribe(
			() => {
				this.closeMaintenanceScheduleHistory();
			});
		this.shutdownMaintenanceHistoryEventSubscription = this._eventEmitterService.maintenanceShutdownHistory.subscribe(
			() => {
				this.closeMaintenanceShutdownHistory();
			});
		this.getSuppliers();
		this.getMaintenanceData();
	}

	gotoAssetProfile() {
		this._router.navigateByUrl(`/asset-management/assets/${AssetRegisterStore.assetId}`);
	}

	editMaintenance(id) {
		AssetMaintenanceStore.maintenanceId = id;
		AssetMaintenanceStore.editFlag = true;
		this._router.navigateByUrl('asset-management/assets/' + AssetRegisterStore.assetId + '/edit-asset-maintenance');
	}

	delete(id: number) {
		event.stopPropagation();
		this.popupObject.type = "";
		this.popupObject.id = id;
		this.popupObject.title = "Delete Maintenance?";
		this.popupObject.subtitle = "common_delete_subtitle";
		$(this.confirmationPopUp.nativeElement).modal("show");
	}

	closeConfirmationPopUp() {
		$(this.confirmationPopUp.nativeElement).modal("hide");
		this._utilityService.detectChanges(this._cdr);
	}

	deleteMaintenance(status: boolean) {
		if (status && this.popupObject.id) {
			this._assetMaintenanceService.deleteMaintenance(this.popupObject.id, '&asset_ids=' + AssetRegisterStore.assetId).subscribe(
				(resp) => {
					this._utilityService.detectChanges(this._cdr);
					this.closeConfirmationPopUp();
					this.clearPopupObject();
				},
			);
		} else {
			this.closeConfirmationPopUp();
			this.clearPopupObject();
		}
	}

	clearPopupObject() {
		this.popupObject.id = null;

	}

	getMaintenanceData() {
		if (AssetRegisterStore.assetId) {
			this._assetMaintenanceService.getItem(AssetMaintenanceStore.maintenanceId, '?asset_ids=' + AssetRegisterStore.assetId).subscribe(res => {
				this._utilityService.detectChanges(this._cdr)
			})
		}
	}

	getSuppliers() {
		this._supplierService.getAllItems().subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

	setMaintenanceIndex(index, schedule_id) {
		if (this.currentScheduleIndex == index)
			this.currentScheduleIndex = null;
		else {
			AssetMaintenanceStore.shutdownLoaded = false;
			this.currentScheduleIndex = index;
			// this.getSchedules(schedule_id);
			// this.getShutdowns(schedule_id,1);
		}

		this._utilityService.detectChanges(this._cdr);

	}

	// getSchedules(schedule_id){
	//   this._assetMaintenanceService.getScheduleUpdate(AssetMaintenanceStore.maintenanceId,schedule_id).subscribe(res=>{
	//     this._utilityService.detectChanges(this._cdr);
	//   })
	// }

	// getShutdowns(schedule_id,shutdown_id){
	//   setTimeout(() => {
	//     if(!AssetMaintenanceStore?.shutdownLoaded&& this.currentScheduleIndex!=null){
	//       this._assetMaintenanceService.getShutdownUpdate(AssetMaintenanceStore.maintenanceId,schedule_id,shutdown_id).subscribe(res=>{
	//         this._utilityService.detectChanges(this._cdr);
	//       })
	//     }

	//   }, 500);

	// }

	getScheduledDate(date) {
		let scheduled_date = this._helperService.processDate(date, 'join');
		return scheduled_date;

	}


	getCreatedByPopupDetails(users, supplier: boolean = false) {
		let userDetial: any = {};
		if (supplier && users != null) {
			let pos = SuppliersMasterStore.allItems.findIndex(e => e.id == users);
			if (pos != -1)
				users = SuppliersMasterStore.allItems[pos];
			userDetial['first_name'] = users?.first_name ? users?.first_name : users.title;
			userDetial['image_token'] = users?.image?.token;
			userDetial['designation'] = users?.email;
			userDetial['email'] = users?.email;
			userDetial['mobile'] = users?.mobile;
			userDetial['id'] = users?.id;
			userDetial['department'] = users?.department;
			userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
		}
		else {
			userDetial['first_name'] = users?.first_name ? users?.first_name : users.title;
			userDetial['last_name'] = users?.last_name;
			userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
			userDetial['image_token'] = users?.image?.token;
			userDetial['email'] = users?.email;
			userDetial['mobile'] = users?.mobile;
			userDetial['id'] = users?.id;
			userDetial['department'] = users?.department;
			userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
		}
		return userDetial;
	}

	openMaintenanceReviewPopup(schedule_id) {
		this.maintenanceReviewOpened = true;
		this.scheduleObject.maintenance_id = AssetMaintenanceStore.maintenanceId;
		this.scheduleObject.schedule_id = schedule_id;
		this.currentScheduleIndex = null;
		this.scheduleObject.values = { status: AssetMaintenanceStore.individualMaintenanceDetails.asset_maintenance_schedules[this.currentScheduleIndex]?.asset_maintenance_status_id }
		this._renderer2.setStyle(this.maintenanceReview.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.maintenanceReview.nativeElement, 'show');
		this._renderer2.setStyle(this.maintenanceReview.nativeElement, 'display', 'block');
		this._renderer2.setStyle(this.maintenanceReview.nativeElement, 'overflow', 'auto');
		this._utilityService.detectChanges(this._cdr);
	}

	closeMaintenanceReview() {
		this.maintenanceReviewOpened = false;
		this.scheduleObject.maintenance_id = null;
		this.scheduleObject.schedule_id = null;
		this._renderer2.setStyle(this.maintenanceReview.nativeElement, 'z-index', 9);
		this._renderer2.removeClass(this.maintenanceReview.nativeElement, 'show');
		this._renderer2.setStyle(this.maintenanceReview.nativeElement, 'display', 'none');
	}

	openShutdownReviewModal(shutdown_id, schedule_id) {
		this.shutdownObject.maintenance_id = AssetMaintenanceStore.maintenanceId;
		this.shutdownObject.schedule_id = schedule_id;
		this.shutdownObject.shutdown_id = shutdown_id;
		this.shutdownReviewOpened = true;
		this._renderer2.setStyle(this.shutdownReview.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.shutdownReview.nativeElement, 'show');
		this._renderer2.setStyle(this.shutdownReview.nativeElement, 'display', 'block');
		this._renderer2.setStyle(this.shutdownReview.nativeElement, 'overflow', 'auto');
		this._utilityService.detectChanges(this._cdr);
	}

	closeShutdownReview() {
		this.shutdownObject.maintenance_id = null;
		this.shutdownObject.schedule_id = null;
		this.shutdownObject.shutdown_id = null;
		this.shutdownReviewOpened = false;
		this._renderer2.setStyle(this.shutdownReview.nativeElement, 'z-index', 9);
		this._renderer2.removeClass(this.shutdownReview.nativeElement, 'show');
		this._renderer2.setStyle(this.shutdownReview.nativeElement, 'display', 'none');
	}

	createImagePreview(type, token) {
		return this._assetManagementService.getThumbnailPreview(type, token);
	}

	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	viewDocument(document, schedule, update, shutdown_id?) {
		if (shutdown_id) {
			this._assetManagementService.getFilePreview('maintenance-shutdown', document.id, document.asset_maintenance_schedule_shutdown_update_id, schedule.id, shutdown_id).subscribe(res => {
				var resp: any = this._utilityService.getDownLoadLink(res, document.title);
				this.openPreviewModal(resp, document, schedule.id, update, shutdown_id);
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
			this._assetManagementService.getFilePreview('maintenance-schedule', document.id, document.asset_maintenance_schedule_update_id, schedule.id).subscribe(res => {
				var resp: any = this._utilityService.getDownLoadLink(res, document.title);
				this.openPreviewModal(resp, document, schedule.id, update);
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

	downloadDocument(document, schedule, update) {
		this._assetManagementService.downloadFile('maintenance-schedule', update.id, document.title, document.id, document, schedule.id);
	}

	/**
	 * opening the preview model
	 * @param filePreview -get response of file preview
	 * @param itemDetails -certificate details
	 */
	openPreviewModal(filePreview, itemDetails, schedule_id, update, shutdown_id?) {
		let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
		this.previewObject.component = shutdown_id ? 'maintenance-shutdown' : 'maintenance-schedule';
		this.previewObject.schedule_id = schedule_id;
		this.previewObject.shutdown_id = shutdown_id;
		this.previewObject.componentId = update.id;
		this.previewObject.file_details = itemDetails;
		this.previewObject.file_name = itemDetails.title;
		this.previewObject.file_type = itemDetails.ext;
		this.previewObject.preview_url = previewItem;
		this.previewObject.size = itemDetails.size;
		this.previewObject.uploaded_user = AssetMaintenanceStore?.individualMaintenanceDetails?.created_by;
		this.previewObject.uploaded_user['image_token'] = AssetMaintenanceStore?.individualMaintenanceDetails?.created_by?.image?.token;
		this.previewObject.created_at = itemDetails.created_at;
		$(this.filePreviewModal.nativeElement).modal('show');
		this._utilityService.detectChanges(this._cdr);
	}

	closePreviewModal(event) {
		$(this.filePreviewModal.nativeElement).modal('hide');
		this.previewObject.file_name = null;
		this.previewObject.file_type = '';
		this.previewObject.preview_url = '';
	}

	/**
	* Returns whether file extension is of imgage, pdf, document or etc..
	* @param ext File extension
	* @param extType Type - image,pdf,doc etc..
	*/
	checkExtension(ext, extType) {
		var res = this._imageService.checkFileExtensions(ext, extType);
		return res;
	}

	openMaintenanceShutdownistory(shutdown_id, schedule_id) {
		this.shutdownHistoryOpened = true;
		this.shutdownHistoryObject.maintenance_id = AssetMaintenanceStore.maintenanceId;
		this.shutdownHistoryObject.schedule_id = schedule_id;
		this.shutdownHistoryObject.shutdown_id = shutdown_id;

		//this.scheduleObject.values = { status: AssetMaintenanceScheduleStore?.individualSchedule?.asset_maintenance_schedule_status?.id }
		this._renderer2.setStyle(this.shutdownHistory.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.shutdownHistory.nativeElement, 'show');
		this._renderer2.setStyle(this.shutdownHistory.nativeElement, 'display', 'block');
		this._renderer2.setStyle(this.shutdownHistory.nativeElement, 'overflow', 'auto');
		this._utilityService.detectChanges(this._cdr);
	}

	closeMaintenanceShutdownHistory() {
		this.shutdownHistoryOpened = false;
		this.shutdownHistoryObject.maintenance_id = null;
		this.shutdownHistoryObject.schedule_id = null;
		this.shutdownHistoryObject.shutdown_id = null;
		this._renderer2.setStyle(this.shutdownHistory.nativeElement, 'z-index', 9);
		this._renderer2.removeClass(this.shutdownHistory.nativeElement, 'show');
		this._renderer2.setStyle(this.shutdownHistory.nativeElement, 'display', 'none');
	}

	openMaintenanceScheduleHistory(schedule_id) {
		this.maintenanceHistoryOpened = true;
		this.historyObject.maintenance_id = AssetMaintenanceStore.maintenanceId;
		this.historyObject.schedule_id = schedule_id;

		//this.scheduleObject.values = { status: AssetMaintenanceScheduleStore?.individualSchedule?.asset_maintenance_schedule_status?.id }
		this._renderer2.setStyle(this.maintenanceHistory.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.maintenanceHistory.nativeElement, 'show');
		this._renderer2.setStyle(this.maintenanceHistory.nativeElement, 'display', 'block');
		this._renderer2.setStyle(this.maintenanceHistory.nativeElement, 'overflow', 'auto');
		this._utilityService.detectChanges(this._cdr);
	}

	closeMaintenanceScheduleHistory() {
		this.maintenanceHistoryOpened = false;
		this.historyObject.maintenance_id = null;
		this.historyObject.schedule_id = null;
		this._renderer2.setStyle(this.maintenanceHistory.nativeElement, 'z-index', 9);
		this._renderer2.removeClass(this.maintenanceHistory.nativeElement, 'show');
		this._renderer2.setStyle(this.maintenanceHistory.nativeElement, 'display', 'none');
	}


	ngOnDestroy() {
		// AssetMaintenanceStore.maintenanceId = null;
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		AssetRegisterStore.currentAssetPage = null;
		this.deleteEventSubscription.unsubscribe();
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
		AssetMaintenanceStore.unsetIndiviudalAssetDetails();
	}
}
