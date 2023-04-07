import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

declare var $: any;

@Component({
  selector: 'app-strategy-mapping-initiative-detail-popup',
  templateUrl: './strategy-mapping-initiative-detail-popup.component.html',
  styleUrls: ['./strategy-mapping-initiative-detail-popup.component.scss']
})
export class StrategyMappingInitiativeDetailPopupComponent implements OnInit {
  @Input('source') strategyAreaSource: any;
  
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;

  AppStore = AppStore
  AuthStore = AuthStore;
  StrategyStore = StrategyStore;
  StrategyInitiativeStore = StrategyInitiativeStore
  OrganizationModulesStore = OrganizationModulesStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
 
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  historyObject = {
    type: null,
    value: null,
    id: null
  }
  historyModalEventSubscription: any;

  constructor(private _eventEmitterService:EventEmitterService,
    private _imageService: ImageServiceService,
    private _initiativeService: InitiativeService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,private _humanCapitalService:HumanCapitalService,
    private _helperService: HelperServiceService,) { }

  ngOnInit(): void {
    this.historyModalEventSubscription = this._eventEmitterService.initiativeHistoryModalControl.subscribe(item => {
      this.closeHistoryModal();
    })
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  getPopupDetails(user, is_created_by: boolean = false) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title : user.designation?.title ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof (user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if (is_created_by) userDetailObject['created_at'] = this.getDate();
      return userDetailObject;
    }
  }

  // Returns Date
  getDate() {
    return new Date();
    // return this._helperService.timeZoneFormatted(new Date());
  }

  // History Modal
  openHistoryModal() {
    // this.historyPageChange(1);
    this.historyObject.type = "Initiative";
    this.historyObject.id = StrategyInitiativeStore.selectedInitiativeId;
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);
  }

  closeHistoryModal() {
    this.historyObject.type = null;
    this.historyObject.id = null;
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);
    StrategyStore.unsetHistory();
  }

  cancel(){
    this._eventEmitterService.dismissStrategyMappingInitiativePopup();
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

}
