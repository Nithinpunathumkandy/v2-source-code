import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetMaintenanceScheduleStore } from 'src/app/stores/asset-management/asset-register/asset-schedule-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MaintenanceScheduleService } from 'src/app/core/services/asset-management/asset-register/maintenance-schedule/maintenance-schedule.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SuppliersMasterStore } from 'src/app/stores/masters/suppliers-management/suppliers';
import { AssetManagementService } from 'src/app/core/services/asset-management/asset-management-service/asset-management.service';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';


declare var $: any;

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss']
})
export class ScheduleDetailComponent implements OnInit, OnDestroy {
  reactionDisposer: IReactionDisposer
  AssetMaintenanceScheduleStore = AssetMaintenanceScheduleStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AssetMaintenanceStore= AssetMaintenanceStore;
  SubMenuItemStore = SubMenuItemStore;
  shutdownReviewOpened = false;
  maintenanceReviewOpened = false;
  maintenanceHistoryOpened = false;
  shutdownHistoryOpened = false;
  AppStore = AppStore;
  filterSubscription: Subscription = null;
  currentScheduleIndex = null;
  scheduleMaintenanceId: any;
  shutdownReviewEventSubscription:any;
  scheduleReviewEventSubscription:any;
  scheduleMaintenanceHistoryEventSubscription:any;
  shutdownMaintenanceHistoryEventSubscription:any;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  @ViewChild('shutdownReview') shutdownReview: ElementRef;
  @ViewChild('maintenanceReview') maintenanceReview: ElementRef;
  @ViewChild('maintenanceHistory') maintenanceHistory: ElementRef;
  @ViewChild('shutdownHistory') shutdownHistory: ElementRef;
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
	};
  shutdownObject = {
		maintenance_id: null,
		schedule_id: null,
		shutdown_id: null,
		values: null
	};
 scheduleObject = {
		maintenance_id: null,
		schedule_id: null,
		values: null

	}
	historyObject = {
		maintenance_id: null,
		schedule_id: null,
		values: null

	}

	shutdownHistoryObject = {
		maintenance_id: null,
		schedule_id: null,
		shutdown_id:null,
		values: null

	}


  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _maintenanceScheduleService: MaintenanceScheduleService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _assetManagementService: AssetManagementService,
    private _sanitizer: DomSanitizer,
    private _imageService:ImageServiceService,
    ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
	this.getScheduleMaintenanceData();
		this.scheduleMaintenanceId = AssetMaintenanceScheduleStore.getScheduleId;
		this.reactionDisposer = autorun(() => {
			if(AssetMaintenanceScheduleStore?.individualSchedule?.asset_maintenance_schedule_status.type!='completed')
			{
				var subMenuItems = [
			  
					{ activityName: 'UPDATE_ASSET_MAINTENANCE_SCHEDULE', submenuItem: { type: 'update_modal' } },
					{ activityName: 'ASSET_MAINTENANCE_SCHEDULE_UPDATE_LIST', submenuItem: { type: 'history' } },
					{ activityName: null, submenuItem: { type: 'close',path:'/asset-management/asset-maintenance-schedules' } },
			
				  ]
			}
			else{
				var subMenuItems = [
			  
					//{ activityName: 'UPDATE_ASSET_MAINTENANCE_SCHEDULE', submenuItem: { type: 'edit_modal' } },
					{ activityName: 'ASSET_MAINTENANCE_SCHEDULE_UPDATE_LIST', submenuItem: { type: 'history' } },
					{ activityName: null, submenuItem: { type: 'close',path:'/asset-management/asset-maintenance-schedules' } },
			
				  ]
			}
			
		  
			//CREATE_ASSET_MAINTENANCE_SCHEDULE_SHUTDOWN_UPDATE
		  this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
		  if (SubMenuItemStore.clikedSubMenuItem) {
			switch (SubMenuItemStore.clikedSubMenuItem.type) {
			  case "update_modal":
				setTimeout(() => {
				  this._utilityService.detectChanges(this._cdr);
				  this.openMaintenanceReviewPopup(AssetMaintenanceScheduleStore.scheduleId);
				}, 1000);
				break;
				case "history":
				setTimeout(() => {
				  this._utilityService.detectChanges(this._cdr);
				  this.openMaintenanceScheduleHistory(AssetMaintenanceScheduleStore.scheduleId);
				}, 1000);
				break;
	  
			  default:
				break;
			}
			// Don't forget to unset clicked item immediately after using it
			SubMenuItemStore.unSetClickedSubMenuItem();
		  }
		  
		})
    if (!AssetMaintenanceScheduleStore.scheduleId) {
			if (AssetMaintenanceScheduleStore.assetId)
				this._router.navigateByUrl('asset-management/asset-maintenance-schedules/'+ AssetMaintenanceScheduleStore.scheduleId);
			else
				this._router.navigateByUrl('asset-management/asset-maintenance-schedules');

		}
		else {
      //this._router.navigateByUrl('asset-management/asset-maintenance-schedules');
		}
		this.shutdownReviewEventSubscription = this._eventEmitterService.maintenanceShutdownReview.subscribe(
			() => {
				this.closeShutdownReview();
			});

		this.scheduleReviewEventSubscription = this._eventEmitterService.maintenanceScheduleReview.subscribe(
			() => {
				this.closeMaintenanceReview();
			});

			this.scheduleMaintenanceHistoryEventSubscription = this._eventEmitterService.maintenanceScheduleHistory.subscribe(
				() => {
					this.closeMaintenanceScheduleHistory();
			});

			this.shutdownMaintenanceHistoryEventSubscription = this._eventEmitterService.maintenanceShutdownHistory.subscribe(
				() => {
					this.closeMaintenanceShutdownHistory();
			});
    
  }
  getScheduleMaintenanceData()
  {
    if (AssetMaintenanceScheduleStore.scheduleId) {
			this._maintenanceScheduleService.getItem(AssetMaintenanceScheduleStore.scheduleId).subscribe(res => {
				AssetMaintenanceStore.setMaintenanceId(res.asset_maintenance.id)
				this._utilityService.detectChanges(this._cdr)
			})
		}
  }
  getCreatedByPopupDetails(users, supplier: boolean = false) {
    
		let userDetial: any = {};
		if (supplier && users != null) {
			let pos = SuppliersMasterStore.allItems.findIndex(e => e.id == users);
			if (pos != -1)
				users = SuppliersMasterStore.allItems[pos];
			userDetial['first_name'] = users?.first_name ? users?.first_name : users.title;
			userDetial['image_token'] = users?.image_token;
			userDetial['designation'] = users?.email?users?.email:'Supplier';
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
			userDetial['image_token'] = users?.image_token;
			userDetial['email'] = users?.email;
			userDetial['mobile'] = users?.mobile;
			userDetial['id'] = users?.id;
			userDetial['department'] = users?.department;
			userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
		}
   
		return userDetial;
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
		this.previewObject.component = shutdown_id?'maintenance-shutdown':'maintenance-schedule';
		this.previewObject.schedule_id = schedule_id;
		this.previewObject.shutdown_id = shutdown_id;
		this.previewObject.componentId = update.id;
		this.previewObject.file_details = itemDetails;
		this.previewObject.file_name = itemDetails.title;
		this.previewObject.file_type = itemDetails.ext;
		this.previewObject.preview_url = previewItem;
		this.previewObject.size = itemDetails.size;
		this.previewObject.uploaded_user = AssetMaintenanceScheduleStore?.individualSchedule?.created_by;
		this.previewObject.uploaded_user['image_token'] = AssetMaintenanceScheduleStore?.individualSchedule?.created_by?.image?.token;
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

	formatDate(tempstartdate){
		//console.log(tempstartdate)
       if(tempstartdate)
	   {
		 //this.startDate = this._helperService.processDate(tempstartdate, 'join');
		 return  this._helperService.processDate(tempstartdate, 'join');
	   }
	   else{return null}
		 
	  }

  openShutdownReviewModal(shutdown_id, schedule_id,shutdown,documents) {
	  //console.log(shutdown);
	  //let actual_start_date=shutdown?.actual_start_date?shutdown?.actual_start_date:shutdown?.start_date;
	  //let actual_end_date=shutdown?.actual_end_date?shutdown?.actual_end_date:shutdown?.end_date;
		this.shutdownObject.maintenance_id = AssetMaintenanceStore.maintenanceId;
		this.shutdownObject.schedule_id = schedule_id;
		this.shutdownObject.shutdown_id = shutdown_id;
		this.shutdownReviewOpened = true;
		this.shutdownObject.values = { 
			status: shutdown.asset_maintenance_status_id, 
			//comment: shutdown.description ,
			//actual_start_date:this.formatDate(actual_start_date),
			//actual_end_date:this.formatDate(actual_end_date),
			//documents: documents
		}
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
	openMaintenanceReviewPopup(schedule_id) {
		this.maintenanceReviewOpened = true;
		this.scheduleObject.maintenance_id = AssetMaintenanceStore.maintenanceId;
		this.scheduleObject.schedule_id = schedule_id;
		this.currentScheduleIndex = null;
		this.scheduleObject.values = 
		{ status: AssetMaintenanceScheduleStore?.individualSchedule?.asset_maintenance_schedule_status?.id, 
		//comment: AssetMaintenanceScheduleStore?.individualSchedule?.latest_asset_maintenance_schedule_update?.comment,
		//documents: AssetMaintenanceScheduleStore?.individualSchedule?.latest_asset_maintenance_schedule_update?.documents
		}
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

    openMaintenanceShutdownistory(shutdown_id) {
		this.shutdownHistoryOpened = true;
		this.shutdownHistoryObject.maintenance_id = AssetMaintenanceStore.maintenanceId;
		this.shutdownHistoryObject.schedule_id = AssetMaintenanceScheduleStore.scheduleId;
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


	ngOnDestroy() {
	if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
	AssetMaintenanceScheduleStore.setAllItemsScheduleDetailsestroy();
	AssetMaintenanceScheduleStore.setAllItemsScheduleHistoryClear();
	AssetMaintenanceScheduleStore.setAllItemsShutdownHistoryClear();
	BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;

	}


}
