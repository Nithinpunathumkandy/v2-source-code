import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer,autorun } from 'mobx';
import { Subscription } from 'rxjs';
import { AssetMatrixService } from 'src/app/core/services/asset-management/asset-matrix/asset-matrix.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMatrixStore } from 'src/app/stores/asset-management/asset-matrix/asset-matrix-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;

@Component({
  selector: 'app-asset-matrix-list',
  templateUrl: './asset-matrix-list.component.html',
  styleUrls: ['./asset-matrix-list.component.scss']
})
export class AssetMatrixListComponent implements OnInit {

	@ViewChild('deletePopup') deletePopup: ElementRef;
	@ViewChild('addMatrix') addMatrix: ElementRef;

	SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AssetMatrixStore = AssetMatrixStore;
  filterSubscription: Subscription = null;
  
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
    private _router:Router,
    private _renderer2:Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _helperService:HelperServiceService,
	private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {
	RightSidebarLayoutStore.showFilter = true;
	this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		this.AssetMatrixStore.loaded = false;
		this.pageChange(1);
	  })
	BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_asset_matrix' });

    
		this.reactionDisposer = autorun(() => {
				var subMenuItems = [
					{ activityName: 'ASSET_MATRIX_LIST', submenuItem: { type: 'search' } },
					{activityName: null, submenuItem: {type: 'refresh'}},
					{ activityName: 'CREATE_ASSET_MATRIX', submenuItem: { type: 'new_modal' } },
					{ activityName: 'GENERATE_ASSET_MATRIX_TEMPLATE', submenuItem: { type: 'template' } },
					{ activityName: 'EXPORT_ASSET_MATRIX', submenuItem: { type: 'export_to_excel' } },
					{ activityName: 'IMPORT_ASSET_MATRIX', submenuItem: { type: 'import' } },

				]
			
			if (NoDataItemStore.clikedNoDataItem) {
				this.addNewMatrix();
				NoDataItemStore.unSetClickedNoDataItem();
			}

			this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "new_modal":
						setTimeout(() => {
							this._utilityService.detectChanges(this._cdr);
							this.openFormModal();
						}, 1000);
						break;

				
					case "template":

						this._assetMatrixService.generateTemplate();
						break;

				
					case "export_to_excel":
						this._assetMatrixService.exportToExcel();
						break;

					case "search":
						AssetMatrixStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						break;
					case "refresh":
						SubMenuItemStore.searchText = '';
						AssetMatrixStore.searchText = '';
						AssetMatrixStore.loaded = false;
						this.pageChange(1);
						break;	
					case "import":
						ImportItemStore.setTitle('import_asset_matrix');
						ImportItemStore.setImportFlag(true);
						break;
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
			if (ImportItemStore.importClicked) {
				ImportItemStore.importClicked = false;
				this._assetMatrixService.importData(ImportItemStore.getFileDetails).subscribe(res => {
					ImportItemStore.unsetFileDetails();
					ImportItemStore.setTitle('');
					ImportItemStore.setImportFlag(false);
					$('.modal-backdrop').remove();
					this._utilityService.detectChanges(this._cdr);
				}, (error) => {
					if (error.status == 422) {
						ImportItemStore.processFormErrors(error.error.errors);
					}
					else if (error.status == 500 || error.status == 403) {
						ImportItemStore.unsetFileDetails();
						ImportItemStore.setImportFlag(false);
						$('.modal-backdrop').remove();
					}
					this._utilityService.detectChanges(this._cdr);
				})
			}
		})
		AppStore.showDiscussion = false;
   
		this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.delete(item);
		})

		this.matrixFormSubscription = this._eventEmitterService.assetMatrixForm.subscribe(item => {
			this.closeFormModal();
		})

		RightSidebarLayoutStore.filterPageTag = 'asset_matrix';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  'asset_calculation_method_ids',
		  'asset_category_ids',
		  'asset_matrix_category_ids',
		  'is_isms'

		]);

    this.pageChange();
  }



  getDetails(id) {
		this._router.navigateByUrl('asset-management/asset-matrix/' + id);

	}

  addNewMatrix(){
	this.openFormModal();
	this._utilityService.detectChanges(this._cdr);
  }

  editMatrix(id){
	this.matrixObject.type='edit';
	this._assetMatrixService.getItem(id).subscribe(res=>{
		this._utilityService.detectChanges(this._cdr);
	})

  }
  openFormModal(){
	this.matrixObject.type='add';
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
	if(AssetMatrixStore.assetMatrixId)
	this._router.navigateByUrl('/asset-management/asset-matrix/'+AssetMatrixStore.assetMatrixId);
  }
  

	pageChange(newPage: number = null) {
		if (newPage) AssetMatrixStore.setCurrentPage(newPage);
	
    this._assetMatrixService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })

	}

  
	getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
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
						this.pageChange(AssetMatrixStore.currentPage);
					}
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

  deleteAssetMatrix(id, position) {
		this.deleteObject.id = id;
		this.deleteObject.position = position;
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "delete_asset_matrix_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}

  editAssetMatrix(id){
	  this.matrixObject.type = 'edit';
	  this.matrixObject.id = id;
	this._utilityService.detectChanges(this._cdr);
	this._renderer2.setStyle(this.addMatrix.nativeElement, 'z-index', 999999);
	this._renderer2.setStyle(this.addMatrix.nativeElement, 'overflow', 'auto');
		
	$(this.addMatrix.nativeElement).modal('show');
  }

  

  searchAssetMatrixList() {
		AssetMatrixStore.setCurrentPage(1);
		this._assetMatrixService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
	}

	setAssetMatrixSort(type, callList: boolean = true) {
		this._assetMatrixService.sortAssetMatrixList(type, callList);
	}

	gotoDetails(id) {
		AssetMatrixStore.setAssetId(id);
		this._router.navigateByUrl('asset-management/asset-matrix/'+id);
	}

  ngOnDestroy() {
		if (this.reactionDisposer) this.reactionDisposer();
		NoDataItemStore.unsetNoDataItems();
		SubMenuItemStore.makeEmpty();
		this._rightSidebarFilterService.resetFilter();
	
		this.deleteEventSubscription.unsubscribe();
		
		// RisksStore.setRiskStatus(null)
		AssetMatrixStore.loaded = false;
	
		AssetMatrixStore.unsetAssetMatrixDetails();
		AssetMatrixStore.searchText = null;
		SubMenuItemStore.searchText = '';
	}



}
