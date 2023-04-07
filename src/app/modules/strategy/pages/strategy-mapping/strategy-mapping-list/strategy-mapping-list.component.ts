import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { IReactionDisposer , autorun } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
@Component({
  selector: 'app-strategy-mapping-list',
  templateUrl: './strategy-mapping-list.component.html',
  styleUrls: ['./strategy-mapping-list.component.scss']
})
export class StrategyMappingListComponent implements OnInit ,OnDestroy {
  
  AppStore = AppStore
  StrategyStore = StrategyStore;
  SubMenuItemStore = SubMenuItemStore;  
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  reactionDisposer: IReactionDisposer;

  private strategyProfile$=new Subject()
  
  constructor(    
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _service : StrategyService,            
    private _utilityService: UtilityService,    
    private _imageService:ImageServiceService,
    private _helperService: HelperServiceService,
  ) {}

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
    this.reactionDisposer = autorun(() => {    
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'search' } },        
      ]  
      this._helperService.checkSubMenuItemPermissions(100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {          
          case "search":
            StrategyStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1); 
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }       
    });
    this.pageChange();
  }

  //this is for getting strategy profile item list *takeuntill used to unsubscribe http call
  pageChange(newPage:number = null){
    if (newPage) StrategyStore.setCurrentPage(newPage);
    this._service.getItems().pipe(takeUntil(this.strategyProfile$)).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //navigating to details page
  gotoDetails(id){
    StrategyStore.setSelectedId(id)
    this._router.navigateByUrl('strategy-management/strategy-mappings/'+id);
  }

  //passing token to get preview
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  //this is for sorting items
  sortTitle(type: string) {
    this._service.sortStrategyProfiles(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  //Don't forget to unsubscribe events , services and store
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();   
    this.strategyProfile$.next() 
    this.strategyProfile$.complete()
    StrategyStore.searchText = null;
    SubMenuItemStore.searchText = '';
    StrategyStore.loaded=false
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }
}