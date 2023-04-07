import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import * as htmlToImage from 'html-to-image';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
	selector: 'app-asset-specification',
	templateUrl: './asset-specification.component.html',
	styleUrls: ['./asset-specification.component.scss']
})
export class AssetSpecificationComponent implements OnInit {

	AssetRegisterStore = AssetRegisterStore;
	AppStore = AppStore;
	asserSpecificationSubscription: any;
	downloadMessage: string = 'downloading';
	reactionDisposer: IReactionDisposer;
	@ViewChild('loaderPopUp') loaderPopUp: ElementRef;
	@ViewChild('formModal', { static: true }) formModal: ElementRef;

	assetSpeccObject = {
		component: 'Asset Specification',
		values: null,
		type: null,
		id: AssetRegisterStore.assetId
	  };

	constructor(
		private _helperService: HelperServiceService,
		private _imageService: ImageServiceService,
		private _utilityService: UtilityService,
		private _eventEmitterService: EventEmitterService,
		private _cdr: ChangeDetectorRef,
		private _router: Router,
		private _renderer2: Renderer2,
	) { }

	ngOnInit(): void {
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

		NoDataItemStore.setNoDataItems({ title: "specification_empty_message", subtitle: 'common_nodata_subtitle', buttonText: 'add_new_spec' });
		this.reactionDisposer = autorun(() => {
			if (AssetRegisterStore?.individualAssetDetails?.specification) {
				var subMenuItems = [
					{ activityName: null, submenuItem: { type: AssetRegisterStore?.individualAssetDetails?.specification?.length > 0 ? 'edit_modal':'new_modal' } },
					// { activityName: '', submenuItem: { type: 'export_to_excel' } },
					{ activityName: '', submenuItem: { type: 'close', path: "/asset-management/assets" } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
			}
			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "new_modal":
						setTimeout(() => {
							this.addNewItem();
						  }, 1000);
						  break;
					case "edit_modal":
						this.editAsset();
						break;
					// case "export_to_excel":
					// 	this.exportAssetSpecification();
					// 	break;
					// case "delete":
					// 	this.delete();
					// 	break;
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
			if(NoDataItemStore.clikedNoDataItem){
				this.addNewItem();
				NoDataItemStore.unSetClickedNoDataItem();
			  }
		})
		this.asserSpecificationSubscription = this._eventEmitterService.AssetSpecification.subscribe(item => {
			this.closeFormModal();
		});
	}

	addNewItem(){
		this.assetSpeccObject.type = 'Add';
		this.assetSpeccObject.values = null; // for clearing the value
		this.assetSpeccObject.id = AssetRegisterStore.assetId;
		this._utilityService.detectChanges(this._cdr);
		this.openFormModal();
	  }

	  editAsset() {
		AssetRegisterStore.setAssetId(AssetRegisterStore.assetId);
		AssetRegisterStore.editspecificationFlag = true;
		this.assetSpeccObject.type = 'Edit';
		this.assetSpeccObject.id = AssetRegisterStore.assetId;
		this.assetSpeccObject.values = AssetRegisterStore.individualAssetDetails?.specification;
    	this.openFormModal();
	}

	  openFormModal() {
		// this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
		// this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
		// setTimeout(() => {
		//   $(this.formModal.nativeElement).modal('show');  
		// }, 100);
		this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.formModal.nativeElement, 'show');
		this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	  }

	  closeFormModal() {
		this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
		this._renderer2.removeClass(this.formModal.nativeElement, 'show');
		this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this.assetSpeccObject.type = null;
		this.assetSpeccObject.id = null;
		this.assetSpeccObject.values = null;
	  }
	

	
	exportAssetSpecification() {
		setTimeout(() => {
			$(this.loaderPopUp.nativeElement).modal('show');
		}, 100);
		setTimeout(() => {
			let element: HTMLElement;
			element = document.getElementById("asset-specification");
			let pthis = this;
			htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
				.then(function (dataUrl) {
					var reader = new FileReader();
					reader.readAsDataURL(dataUrl);
					reader.onloadend = function () {
						var base64data = reader.result;
						// console.log(base64data);
						pthis.downloadPdf(base64data, 'asset specification');
					}
					// SubMenuItemStore.exportClicked = false;
					// pthis.closeLoaderPopUp();
				});
		}, 100);

	}

	downloadPdf(file, name: any) {
		this._imageService.getPdf(file, name).subscribe(res => {
			SubMenuItemStore.exportClicked = false;
			this.closeLoaderPopUp();
		})
	}
	closeLoaderPopUp() {
		setTimeout(() => {
			$(this.loaderPopUp.nativeElement).modal('hide');
		}, 250);
	}

	ngOnDestroy() {
		NoDataItemStore.unsetNoDataItems();
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
	}

}
