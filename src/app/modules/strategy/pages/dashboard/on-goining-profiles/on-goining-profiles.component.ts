import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DashboardService } from 'src/app/core/services/strategy-management/dashboard/dashboard.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyDaashboardStore } from 'src/app/stores/strategy-management/dashboard.store';

@Component({
  selector: 'app-on-goining-profiles',
  templateUrl: './on-goining-profiles.component.html',
  styleUrls: ['./on-goining-profiles.component.scss']
})
export class OnGoiningProfilesComponent implements OnInit {
  OrganizationGeneralSettingsStore =  OrganizationGeneralSettingsStore;
  StrategyDaashboardStore = StrategyDaashboardStore
  reactionDisposer: IReactionDisposer;

  constructor(private _dashbordService : DashboardService,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _strategyService:StrategyService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _router: Router,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            StrategyDaashboardStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
    });
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: "../dashboard"},
      {type:'search'}
    ]);
    this.pageChange(1)
  }


  onGoinngDetails(id,title){
    StrategyDaashboardStore.selectedOnGoingProfile = title;
    this._router.navigateByUrl('strategy-management/profiles-details/'+id) 
  }

  pageChange(newPage:number = null){
    if (newPage) StrategyDaashboardStore.setCurrentPage(newPage);
    this._dashbordService.getStrategyProfiles().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }


  createImageUrl(token, type?) {
    if (type === "strategy_profile") {
      return this._strategyService.getThumbnailPreview('profile', token);
    } else {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    StrategyDaashboardStore.searchText = null;
    SubMenuItemStore.searchText = '';
  }

}
