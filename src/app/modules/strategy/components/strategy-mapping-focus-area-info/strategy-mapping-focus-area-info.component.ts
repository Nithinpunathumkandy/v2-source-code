import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { StrategyMappingService } from 'src/app/core/services/strategy-management/mapping/strategy-mapping.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';

@Component({
  selector: 'app-strategy-mapping-focus-area-info',
  templateUrl: './strategy-mapping-focus-area-info.component.html',
  styleUrls: ['./strategy-mapping-focus-area-info.component.scss']
})
export class StrategyMappingFocusAreaInfoComponent implements OnInit {

  @Input('source') strategyAreaSource: any;

  StrategyMappingStore = StrategyMappingStore;
  AppStore = AppStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(private _helperService: HelperServiceService,private _eventEmitterService:EventEmitterService,
    private _imageService:ImageServiceService,private _humanCapitalService:HumanCapitalService,
    private _strategyMappingService:StrategyMappingService,private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getFocusAreaDetail();
  }

  getFocusAreaDetail(){
    this._strategyMappingService.getFocusAreaDetail(this.strategyAreaSource.profileId,this.strategyAreaSource.id).subscribe(()=>this._utilityService.detectChanges(this._cdr))
  }
  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

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
      userInfoObject.first_name = user?.first_name;
      userInfoObject.last_name = user?.last_name;
      userInfoObject.designation = user?.designation?.title;
      userInfoObject.image_token = user?.image_token;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      userInfoObject.status_id = user?.status_id
      userInfoObject.department = user?.department?.title;
      return userInfoObject;
    }
  }

  getPopupDetails(user,created_at) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user?.first_name ? user?.first_name : (user.name ? user.name : '');
      userDetailObject['last_name'] = user?.last_name ? user?.last_name : '';
      userDetailObject['designation'] = user?.designation ? user?.designation : null;
      userDetailObject['image_token'] = user?.image ? user?.image?.token : null;
      userDetailObject['email'] = user?.email ? user?.email : null;
      userDetailObject['mobile'] = user?.mobile ? user?.mobile : null;
      userDetailObject['id'] = user?.id;
      userDetailObject['department'] = typeof (user.department) == 'string' ? user.department : (user.designation ? user.designation : null);
      userDetailObject['status_id'] = user.status?.id ? user.status?.id : 1;
      userDetailObject['created_at'] = created_at ? created_at : null;
      return userDetailObject;
    }
  }
  getNoDataSource(type,message){
    let noDataSource = {
      noData:message, border: false, imageAlign: type
    }
    return noDataSource;
  }

  cancel(){
    this._eventEmitterService.dismissMappingFocusAreaPopup();
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

}
