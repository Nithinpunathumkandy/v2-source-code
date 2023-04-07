import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AssetMatrixService } from 'src/app/core/services/asset-management/asset-matrix/asset-matrix.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMatrixStore } from 'src/app/stores/asset-management/asset-matrix/asset-matrix-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-asset-matrix-details',
  templateUrl: './asset-matrix-details.component.html',
  styleUrls: ['./asset-matrix-details.component.scss']
})
export class AssetMatrixDetailsComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
	@ViewChild('addMatrix') addMatrix: ElementRef;
  @ViewChild('addCategory') addCategory: ElementRef;
  AssetMatrixStore = AssetMatrixStore;
  reactionDisposer: IReactionDisposer;
  openCategory = false;
  assetCategoryFormSubscription:any;
  deleteObject = {
		id: null,
		position: null,
		type: '',
		subtitle: ''
	};
  AppStore = AppStore;
  deleteEventSubscription: any;
  matrixFormSubscription:any;
  matrixObject = {
	  id:null,
	  type:null,
	  values:null
  }
  constructor(private _assetMatrixService:AssetMatrixService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _renderer2:Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _router:Router,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(AssetMatrixStore.assetMatrixId)
    this.getAssetMatrix();
    else{
      this._router.navigateByUrl('asset-management/asset-matrix');
    }
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        
        { activityName: 'UPDATE_ASSET_MATRIX', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_ASSET_MATRIX', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'close',path:'/asset-management/asset-matrix' } },

      ]
    
  
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    if (SubMenuItemStore.clikedSubMenuItem) {
      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "edit_modal":
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
            this.editAssetMatrix(AssetMatrixStore.assetMatrixId);
          }, 1000);
          break;

      
        case "delete":

          this.deleteAssetMatrix(AssetMatrixStore.assetMatrixId);
          break;

        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    }
    
  })
  AppStore.showDiscussion = false;

  this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.delete(item);
  })

  this.matrixFormSubscription = this._eventEmitterService.assetMatrixForm.subscribe(item => {
    this.closeFormModal();
  })
  

    this.assetCategoryFormSubscription = this._eventEmitterService.assetCategoryForm.subscribe(item => {
			this.closeCategoryModal();
		})
  }

  getAssetMatrix(){
    this._assetMatrixService.getItem(AssetMatrixStore.assetMatrixId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  editAssetMatrix(id){
	  this.matrixObject.type = 'edit';
	  this.matrixObject.id = id;
	this._utilityService.detectChanges(this._cdr);
	this._renderer2.setStyle(this.addMatrix.nativeElement, 'z-index', 999999);
	this._renderer2.setStyle(this.addMatrix.nativeElement, 'overflow', 'auto');
		
	$(this.addMatrix.nativeElement).modal('show');
  }

  closeFormModal(){
	  this.matrixObject.type=null;
	  this.matrixObject.values=null;
	$(this.addMatrix.nativeElement).modal('hide');
	this._renderer2.setStyle(this.addMatrix.nativeElement, 'z-index', 9);
	this._renderer2.setStyle(this.addMatrix.nativeElement, 'overflow', 'none');
	$('.modal-backdrop').remove();
  this.getAssetMatrix();
  }

  openCategoryModal(){
    this.openCategory = true;
    $(this.addCategory.nativeElement).modal('show');
    this._renderer2.setStyle(this.addCategory.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.addCategory.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.addCategory.nativeElement, 'overflow', 'block');

  }

  closeCategoryModal(){
    this.openCategory = false;
    $(this.addMatrix.nativeElement).modal('hide');
    this._renderer2.setStyle(this.addCategory.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.addCategory.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.addCategory.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  	/**
   * Delete the risk
   * @param id -risk id
   */
	delete(status) {
		if (status && this.deleteObject.id) {

			this._assetMatrixService.delete(this.deleteObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
					if (AssetMatrixStore.currentPage > 1) {
						AssetMatrixStore.currentPage = Math.ceil(AssetMatrixStore.totalItems / 15);
						// this.pageChange(AssetMatrixStore.currentPage);
           
            
					}
          this._router.navigateByUrl('asset-management/asset-matrix');
				}, 500);
				this.clearDeleteObject();
				// console.log(AssessmentStore.totalItems);

			});
		}
		else {
			this.clearDeleteObject();
		}
		setTimeout(() => {
			$(this.deletePopup.nativeElement).modal('hide');
		}, 250);

	}


	clearDeleteObject() {

		this.deleteObject.id = null;

	}

  deleteAssetMatrix(id) {
		this.deleteObject.id = id;
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "delete_asset_matrix_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}

  ngOnDestroy(){
    AssetMatrixStore.assetMatrixId=null;
    this.deleteEventSubscription.unsubscribe();
    this.matrixFormSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }




}
