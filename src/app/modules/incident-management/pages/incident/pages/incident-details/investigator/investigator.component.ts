import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationChartStore } from 'src/app/stores/organization/business_profile/organization-chart.store';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationChartImageResponse } from 'src/app/core/models/organization/business_profile/organization-chart-image.model';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
	selector: 'app-investigator',
	templateUrl: './investigator.component.html',
	styleUrls: ['./investigator.component.scss']
})
export class InvestigatorComponent implements OnInit {
	@ViewChild('addInvestigator') addInvestigator: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	reactionDisposer: IReactionDisposer;

	OrganizationChartStore = OrganizationChartStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	editFlag:boolean = false;


	controlObject = {
		type: null
	};
	addcontrolsEvent: any;
	IncidentStore = IncidentStore;
	AppStore = AppStore;
	AuthStore = AuthStore
	popupControlEventSubscription: any;
	networkFailureSubscription: any;
	idleTimeoutSubscription: any;
	popupObject = {
		type: '',
		title: '',
		id: null,
		subtitle: ''
	};
	popupData = {
		type: ''
	}



	constructor(private _renderer2: Renderer2,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _incidentService: IncidentService,
		private _helperService: HelperServiceService,
		private _organizationFileService: OrganizationfileService,
		private _imageService: ImageServiceService

	) { }

	ngOnInit(): void {

		this.reactionDisposer = autorun(() => {

			// var subMenuItems = [
			//   {activityName: 'UPDATE_INCIDENT_INVESTIGATOR', submenuItem: {type: IncidentStore.investigatorsList == null ? 'new_modal': 'edit_modal'}},
			//   {activityName:null, submenuItem: {type: 'close', path: '../incidents'}}
			// ]

			// this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);

			if (SubMenuItemStore.clikedSubMenuItem) {

				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "edit_modal":
						this.addInvestigatorModal()
						break;
					case "new_modal":
						this.addInvestigatorModal()
						break;
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}

			if (NoDataItemStore.clikedNoDataItem) {
				IncidentStore.investigatorsList = null;
				this.addInvestigatorModal();
				NoDataItemStore.unSetClickedNoDataItem();
			}
		})
		if (IncidentStore.individualIncidentItem && IncidentStore.individualIncidentItem?.incident_status?.type == 'approved') {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_investigation_team' });
		} else {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'incident_not_approved_message' });
		}
		this.addcontrolsEvent = this._eventEmitterService.incidentInvestigatorMoadlControl.subscribe(element => {
			this.closeModal();
		})
		this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})
		this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
			if (!status) {
				this.changeZIndex();
			}
		})
		this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
			if (!status) {
				this.changeZIndex();
			}
		})
		this.getInvestigators();
	}

	checkSubMenuItem() {
		// setting submenu items
		// var subMenuItems = [
		//   {activityName: 'UPDATE_INCIDENT_INVESTIGATOR', submenuItem: 
		//   {type: IncidentStore.investigatorsList.investigation_leader == null ? 'new_modal': 'edit_modal'}
		// },
		//   {activityName:null, submenuItem: 
		//     {type: 'close', path: '../incidents'}
		//   }


		// ]
		if (IncidentStore.individualIncidentItem.incident_status.type == 'approved') {
			let subMenuItems = [
				{activityName: IncidentStore.investigatorsList.investigation_leader == null ? '' : 'UPDATE_INCIDENT_INVESTIGATOR', submenuItem: {type: IncidentStore.investigatorsList.investigation_leader == null ? 'new_modal' : 'edit_modal'}},
				{activityName:null, submenuItem: {type: 'close', path: '../'}}
			]
			this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
			this._utilityService.detectChanges(this._cdr);
		} else {
			let subMenuItems = [
				{activityName:null, submenuItem: {type: 'close', path: '../'}}
			]
			this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
			this._utilityService.detectChanges(this._cdr);
		}

		// this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
		this._utilityService.detectChanges(this._cdr);
	}

	getInvestigators() {

		this._incidentService.getInvestigation(IncidentStore.selectedId).subscribe((res) => {
			if (IncidentStore.individualIncidentItem.incident_status.type == 'approved') {
				SubMenuItemStore.setSubMenuItems([
					{ type: res.investigation_leader ? 'edit_modal' : 'new_modal' },
					{ type: 'close', path: '../incidents' }
				])
			} else {
				SubMenuItemStore.setSubMenuItems([
					{ type: 'close', path: '../incidents' }
				])
			}
			this._utilityService.detectChanges(this._cdr)
		}
		);
	}

	processImage(image: OrganizationChartImageResponse){
		if(image){
		  if(image[0].token){
			var purl = this._organizationFileService.getThumbnailPreview('organization-chart',image[0].token);
			var lDetails = {
							  id: image[0].id,
							  name: image[0].title, 
							  title: image[0].title,
							  ext: image[0].ext,
							  size: image[0].size,
							  url: image[0].url,
							  token: image[0].token,
							  preview_url: purl,
							  thumbnail_url: image[0].url
						  };
			this.editFlag = false;
			OrganizationChartStore.temporaryChartImage = null;
			OrganizationChartStore.setOrganizationChartImage(lDetails);
			this._utilityService.detectChanges(this._cdr);
		  }
		}
	  }

	createImageUrl(token,type){
		return this._organizationFileService.getThumbnailPreview(type,token);
	  }
	
	   // Return Default Image
	   getDefaultImage(type:string){
		return this._imageService.getDefaultImageUrl(type);
	  }


	changeZIndex() {
		if ($(this.addInvestigator.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.addInvestigator.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.addInvestigator.nativeElement, 'overflow', 'auto');
		}
	}


	addInvestigatorModal() {
		this.controlObject.type = 'Add';
		// $('.modal-backdrop').add();
		// document.body.classList.add('modal-open')
		//   this._renderer2.setStyle(this.addInvestigator.nativeElement, 'display', 'block');
		//   // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
		//   this._renderer2.removeAttribute(this.addInvestigator.nativeElement, 'aria-hidden');

		setTimeout(() => {
			$('.modal-backdrop').add();
			document.body.classList.add('modal-open')
			this._renderer2.setStyle(this.addInvestigator.nativeElement, 'display', 'block');
			// this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
			this._renderer2.removeAttribute(this.addInvestigator.nativeElement, 'aria-hidden');
			this._renderer2.addClass(this.addInvestigator.nativeElement, 'show')
			this._utilityService.detectChanges(this._cdr)
		}, 100);
	}

	closeModal() {
		
		// this._renderer2.removeClass(this.addInvestigator.nativeElement, 'show')
		// document.body.classList.remove('modal-open')
		// this._renderer2.setStyle(this.addInvestigator.nativeElement, 'display', 'none');
		// // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
		// this._renderer2.setAttribute(this.addInvestigator.nativeElement, 'aria-hidden', 'true');
		// $('.modal-backdrop').remove();
		// this._utilityService.detectChanges(this._cdr)
		this.getInvestigators();


		setTimeout(() => {
			this._renderer2.removeClass(this.addInvestigator.nativeElement, 'show')
			document.body.classList.remove('modal-open')
			this._renderer2.setStyle(this.addInvestigator.nativeElement, 'display', 'none');
			// this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
			this._renderer2.setAttribute(this.addInvestigator.nativeElement, 'aria-hidden', 'true');
			$('.modal-backdrop').remove();
			this._utilityService.detectChanges(this._cdr)
			this._renderer2.removeClass(this.addInvestigator.nativeElement, 'show');
			this.controlObject.type = null;
			this.checkSubMenuItem();
			this._utilityService.detectChanges(this._cdr)
		}, 200);

	}

	// for user previrews
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

			userInfoObject.first_name = user?.first_name ? user?.first_name : user?.user?.first_name;
			userInfoObject.last_name = user?.last_name ? user?.last_name : user?.user?.last_name;
			userInfoObject.designation = user?.designation_title ? user?.designation_title : user?.designation ? user?.designation : user?.user?.designation ? user?.user?.designation?.title : null;
			userInfoObject.image_token = user?.image_token ? user?.image_token : user?.image ? user?.image?.token : user?.user ? user?.user?.image_token : null;
			userInfoObject.email = user?.email;
			userInfoObject.mobile = user?.mobile;
			userInfoObject.id = user?.id;
			userInfoObject.status_id = user?.status_id
			userInfoObject.department = user?.department ? user?.department : user?.user?.department?.title ? user?.user?.department?.title : null;
			return userInfoObject;
		}
	}

	// for delete
	delete(id: number) {
		event.stopPropagation();
		this.popupObject.type = '';
		this.popupObject.id = id;
		this.popupObject.title = 'Delete Investigator?';
		this.popupObject.subtitle = 'delete_investigator';
		this._utilityService.detectChanges(this._cdr);
		$(this.confirmationPopUp.nativeElement).modal('show');

	}

	// for popup object clearing
	clearPopupObject() {
		this.popupObject.id = null;
		this.popupObject.title = '';
		this.popupObject.subtitle = '';
		this.popupObject.type = '';

	}


	// modal control event
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteIncident(status)
				break;
		}

	}

	// delete function call
	deleteIncident(status: boolean) {
		if (status && this.popupObject.id) {
			this._incidentService.deleteInvestigator(this.popupObject.id, this.popupObject.type).subscribe(resp => {
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

	ngOnDestroy() {
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		this.addcontrolsEvent.unsubscribe();
		this.popupControlEventSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
		this.idleTimeoutSubscription.unsubscribe();
	}

}
