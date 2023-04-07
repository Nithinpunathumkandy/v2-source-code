import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AmAuditReportTypeService } from 'src/app/core/services/masters/audit-management/am-audit-report-type/am-audit-report-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AmAuditReportTypeMasterStore } from 'src/app/stores/masters/audit-management/am-audit-report-type.store';

declare var $: any;

@Component({
  selector: 'app-am-audit-report-type',
  templateUrl: './am-audit-report-type.component.html',
  styleUrls: ['./am-audit-report-type.component.scss']
})
export class AmAuditReportTypeComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

	reactionDisposer: IReactionDisposer;
	AmAuditReportTypeMasterStore = AmAuditReportTypeMasterStore;
	SubMenuItemStore = SubMenuItemStore;
	AuthStore = AuthStore;
	AppStore = AppStore;

	popupObject = {
		type: '',
		title: '',
		id: null,
		subtitle: ''
	};

	popupControlEventSubscription: any

	constructor(
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _amAuditReportTypeService: AmAuditReportTypeService,
		private _eventEmitterService: EventEmitterService
	) { }

	ngOnInit(): void {

		this.reactionDisposer = autorun(() => {

			var subMenuItems = [
			  {activityName: 'AM_AUDIT_REPORT_TYPE_LIST', submenuItem: { type: 'search' }},
			  {activityName: 'EXPORT_AM_AUDIT_REPORT_TYPE', submenuItem: {type: 'export_to_excel'}},
			  {activityName: null, submenuItem: {type: 'close', path: 'audit-management'}},
			]
			this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
	  
			NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
		  
				if (SubMenuItemStore.clikedSubMenuItem) {
		  
				  switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "export_to_excel":
					  this._amAuditReportTypeService.exportToExcel();
					  break;
					case "search":
						AmAuditReportTypeMasterStore.searchText = SubMenuItemStore.searchText;
					  this.pageChange(1);
					  break;
					default:
					  break;
				  }
				//   // Don't forget to unset clicked item immediately after using it
				  SubMenuItemStore.unSetClickedSubMenuItem();
				}
				if(NoDataItemStore.clikedNoDataItem){
				
				  NoDataItemStore.unSetClickedNoDataItem();
				}
			  })  
			  
			  // for deleting/activating/deactivating using delete modal
		  this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		  })
	  
		  this.pageChange(1);
	}

	pageChange(newPage: number = null) {
		if (newPage) AmAuditReportTypeMasterStore.setCurrentPage(newPage);
		this._amAuditReportTypeService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	  } 
	
		// modal control event
		modalControl(status: boolean) {
		  switch (this.popupObject.type) {
			case 'Activate': this.activateAmAuditReportType(status)
			  break;
	  
			case 'Deactivate': this.deactivateAmAuditReportType(status)
			  break;
	  
		  }
	  
		}
	  
	  
		closeConfirmationPopUp(){
		  $(this.confirmationPopUp.nativeElement).modal('hide');
		  this._utilityService.detectChanges(this._cdr);
		}
	   
		// for popup object clearing
		clearPopupObject() {
		  this.popupObject.id = null;
		  // this.popupObject.title = '';
		  // this.popupObject.subtitle = '';
		  // this.popupObject.type = '';
	  
		}
	  
		// calling activcate function
	  
		activateAmAuditReportType(status: boolean) {
		  if (status && this.popupObject.id) {
	  
			this._amAuditReportTypeService.activate(this.popupObject.id).subscribe(resp => {
			  setTimeout(() => {
				this._utilityService.detectChanges(this._cdr);
			  }, 500);
			  this.clearPopupObject();
			});
		  }
		  else {
			this.clearPopupObject();
		  }
		  setTimeout(() => {
			$(this.confirmationPopUp.nativeElement).modal('hide');
		  }, 250);
	  
		}
	  
		// calling deactivate function
	  
		deactivateAmAuditReportType(status: boolean) {
		  if (status && this.popupObject.id) {
	  
			this._amAuditReportTypeService.deactivate(this.popupObject.id).subscribe(resp => {
			  setTimeout(() => {
				this._utilityService.detectChanges(this._cdr);
			  }, 500);
			  this.clearPopupObject();
			});
		  }
		  else {
			this.clearPopupObject();
		  }
		  setTimeout(() => {
			$(this.confirmationPopUp.nativeElement).modal('hide');
		  }, 250);
	  
		}
	  
		// for activate 
		activate(id: number) {
		  // event.stopPropagation();
		  this.popupObject.type = 'Activate';
		  this.popupObject.id = id;
		  this.popupObject.title = 'Activate Audit Report Type?';
		  this.popupObject.subtitle = 'are_you_sure_activate';
	  
		  $(this.confirmationPopUp.nativeElement).modal('show');
		}
		// for deactivate
		deactivate(id: number) {
		  // event.stopPropagation();
		  this.popupObject.type = 'Deactivate';
		  this.popupObject.id = id;
		  this.popupObject.title = 'Deactivate Audit Report Type?';
		  this.popupObject.subtitle = 'are_you_sure_deactivate';
	  
		  $(this.confirmationPopUp.nativeElement).modal('show');
		}
	
	  // sortTitle(type: string) {
		// this._annualPlanFrequencyItemService.sortAnnualPlanFrequencyItemList(type, null);
		// this.pageChange();
	  // }
	  ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		AmAuditReportTypeMasterStore.searchText = '';
		AmAuditReportTypeMasterStore.currentPage = 1 ;
		this.popupControlEventSubscription.unsubscribe();
	  }

}
