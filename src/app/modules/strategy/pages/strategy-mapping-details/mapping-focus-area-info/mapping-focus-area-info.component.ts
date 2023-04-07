import { Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-mapping-focus-area-info',
  templateUrl: './mapping-focus-area-info.component.html',
  styleUrls: ['./mapping-focus-area-info.component.scss']
})
export class MappingFocusAreaInfoComponent implements OnInit {

  StrategyMappingStore = StrategyMappingStore;
  AppStore = AppStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  constructor(private _helperService: HelperServiceService,) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: '/strategy-management/strategy-mappings/'+StrategyStore._strategyProfileId}
    ]);
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
  
}
