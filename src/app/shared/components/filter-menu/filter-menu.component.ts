import { Component, OnInit } from '@angular/core';
import { RightSidebarFilterService } from "src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit {

  RightSidebarLayoutStore = RightSidebarLayoutStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  UsersStore = UsersStore;
  constructor(private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit(): void {
  }

  removeItem(key,val){
    if(this.checkTypeOf(val) == 2)
      this._rightSidebarFilterService.setOrUnsetFilterItem(key,val)
    else if(this.checkTypeOf(val) == 1)
      this._rightSidebarFilterService.setOrUnsetFilterItem(key,val);
    else
      this._rightSidebarFilterService.setOrUnsetFilterItem(key,1);
  }

  checkTypeOf(value){
    if(typeof(value) == 'string')
      return 2
    else if(typeof(value) != 'number' && typeof(value) != 'string')
      return 1;
    else
      return 0;
  }


}
