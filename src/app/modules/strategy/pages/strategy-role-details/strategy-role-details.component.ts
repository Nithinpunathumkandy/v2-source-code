import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitter } from 'protractor';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { FocusAreaService } from 'src/app/core/services/masters/strategy/focus-area/focus-area.service';
import { StrategyMappingService } from 'src/app/core/services/strategy-management/mapping/strategy-mapping.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';

@Component({
  selector: 'app-strategy-role-details',
  templateUrl: './strategy-role-details.component.html',
  styleUrls: ['./strategy-role-details.component.scss']
})
export class StrategyRoleDetailsComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('contentAreaStandard') contentAreaStandard: ElementRef;
  
  StrategyMappingStore = StrategyMappingStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  strategyEmptyList: string = 'strategy_mapping_nodata_title';
  strategyProfileObject = {
    id: null,
    type: null
  };

  strategyProfileSubscription:any;
  constructor(private _router:Router,private _focusArea: FocusAreaService,
    private _strategyService:StrategyService,private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService, private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,private _eventEmitterService:EventEmitterService,
    private _strategyMappingService:StrategyMappingService) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
      { type: "close",path:'/strategy-management/strategy-mappings/'+StrategyMappingStore.ProfileId}
    ]);
    
    this.strategyProfileSubscription = this._eventEmitterService.strategyProfileModal.subscribe(res => {
      if (res) {
        this.individualStrategyProfile(res)
        this.closeStrategyProfile()
      }else {
        this.closeStrategyProfile();
      }
    });

  }

  createImageUrl(token, type?) {
    if (type === "focus_area") {
      return this._focusArea.getThumbnailPreview('focus_area', token);
    } else if (type === "strategy_profile") {
      return this._strategyService.getThumbnailPreview('profile', token);
    }
    else {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }
  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  //this is for opening choose strategy modal
  openStrategyProfile() {
    this.strategyProfileObject.type = 'Add';
    this.strategyProfileObject.id = StrategyMappingStore?.individualStrategyMapping?.id;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  //it will open choose strategy modal
  openFormModal() {    
    ($(this.formModal.nativeElement) as any).modal('show');    
  }

  //it will close add/edit treatment modal
  closeStrategyProfile() {
    ($(this.formModal.nativeElement) as any).modal('hide');    
    this.strategyProfileObject.type = null;
  }

  individualStrategyProfile(id) {
    StrategyMappingStore.setProfileId(id);
    this._strategyMappingService.getItem(id).subscribe(result => {
        this._utilityService.detectChanges(this._cdr);
      })
  }

  getNoDataSource(type,message){
    let noDataSource = {
      noData:message, border: false, imageAlign: type
    }
    return noDataSource;
  }

  moveTostandard(type) {
    switch (type) {
      case 'left': $(this.contentAreaStandard.nativeElement).animate({
        scrollLeft: "-=300px"
      }, "slow");
        $(this.contentAreaStandard.nativeElement).focus();
        break;
      case 'right': $(this.contentAreaStandard.nativeElement).animate({
        scrollLeft: "+=300px"
      }, "slow");
        $(this.contentAreaStandard.nativeElement).focus();
        break;
    }
  }

}
