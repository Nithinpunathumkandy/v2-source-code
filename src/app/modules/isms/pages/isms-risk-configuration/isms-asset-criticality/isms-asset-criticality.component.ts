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
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

@Component({
  selector: 'app-isms-asset-criticality',
  templateUrl: './isms-asset-criticality.component.html',
  styleUrls: ['./isms-asset-criticality.component.scss']
})
export class IsmsAssetCriticalityComponent implements OnInit {

  AssetMatrixStore = AssetMatrixStore;
  reactionDisposer: IReactionDisposer;
  openCategory = false;
  AppStore = AppStore;
  deleteEventSubscription: any;
  matrixFormSubscription:any;

  constructor(private _assetMatrixService:AssetMatrixService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _renderer2:Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _router:Router,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    // if(AssetMatrixStore.assetMatrixId)
    NoDataItemStore.setNoDataItems({title: "no_data_found"});
    this.getAssetMatrix();
    // else{
    //   this._router.navigateByUrl('/isms/isms-risk-matrix');
    // }
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        
        { activityName: null, submenuItem: { type: 'close',path:'/isms/isms-risk-matrix' } },

      ]
    
  
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    // if (SubMenuItemStore.clikedSubMenuItem) {
    
    //   // Don't forget to unset clicked item immediately after using it
    //   SubMenuItemStore.unSetClickedSubMenuItem();
    // }
    
  })
  SubMenuItemStore.setNoUserTab(true);
  AppStore.showDiscussion = false;


  }

  getAssetMatrix(){
    this._assetMatrixService.getItems(false,'&is_isms=true').subscribe(res=>{
      if(res['data']?.length>0){
        this._assetMatrixService.getItem(res['data'][0].id).subscribe(response=>{
          this._utilityService.detectChanges(this._cdr);
        });
      }
      else{
        AssetMatrixStore.individual_asset_matrix_loaded = true;
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }




 

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }





}
