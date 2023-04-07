import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { BpmSuppliersService } from 'src/app/core/services/masters/bpm/bpm-suppliers/bpm-suppliers.service';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BpmSuppliersMasterStore } from 'src/app/stores/masters/bpm/bpm-suppliers';
declare var $:any

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss']
})
export class SupplierDetailsComponent implements OnInit,OnDestroy {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  BpmSuppliersMasterStore = BpmSuppliersMasterStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  contactEmptyMessage = "no_contact_person_added";
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  popupControlEventSubscription: any;
  constructor(private _activatedRouter: ActivatedRoute,
    private _suppliersService: BpmSuppliersService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _organizationFileService: OrganizationfileService,
    private _imageService:ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      // CustomersStore.customersId = id;
      BpmSuppliersMasterStore.selectedSupplierId = id;
      this._suppliersService.saveSupplierId(id);
     this.getSupplier(id);
     
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'delete' } },
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "delete":
            this.delete(BpmSuppliersMasterStore.selectedSupplierId);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
  }

  delete(id: number) {
		event.stopPropagation();
		this.popupObject.type = 'are_you_sure';
		this.popupObject.id = id;
		this.popupObject.title = "are_you_sure";
		this.popupObject.subtitle = "are_you_sure_delete";
		$(this.confirmationPopUp.nativeElement).modal("show");
	}

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'are_you_sure':
        this.deleteSupplier(status);
        break;
    }
  }

  deleteSupplier(status: boolean) {
		if (status && this.popupObject.id) {
			this._suppliersService.delete(this.popupObject.id).subscribe(
				(resp) => {
          this._router.navigateByUrl('/organization/business-profile/supplier');
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

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // Returns Image Url by token
  createImageUrl(token){
    return this._organizationFileService.getThumbnailPreview('supplier-logo',token);
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getSupplier(id){
    this._suppliersService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlEventSubscription.unsubscribe();
  }
}
