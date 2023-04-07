import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { AppStore } from 'src/app/stores/app.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';

@Component({
  selector: 'app-strategy-mapping-oc-view',
  templateUrl: './strategy-mapping-oc-view.component.html',
  styleUrls: ['./strategy-mapping-oc-view.component.scss']
})
export class StrategyMappingOcViewComponent implements OnInit {

  @Input('details') loopItems: any[] = [];
  @Input('id') id: any;
  AppStore = AppStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  constructor( private _organizationFileService: OrganizationfileService,
    private _imageService: ImageServiceService,
    private _router: Router) { }

  ngOnInit(): void {
  }

  createImageUrl(token){
    return this._organizationFileService.getThumbnailPreview('user-profile-picture',token);
  }

  // Return Default Image
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  // editUser(id: number){
  //   AddUserStore.setEditFlag();
  //   UsersStore.setUserId(id);
  //   if(UsersStore.user_id)
  //   this._router.navigateByUrl('/human-capital/users/edit/'+UsersStore.user_id);
  // }
  
  gotoUserDetails(id: number){
    this._router.navigateByUrl('/human-capital/users/'+id);
  }
  show(id) {
    $('#oc-plus-minus-icon-'+id).find("i").toggleClass("far fa-plus");
    $('.hide-and-show-oc-box-'+id).slideToggle("slow");
    $(".hide-and-show-oc-box-btn-"+id).toggleClass("oc-box-rotate-icon-normal");
  }

  goToRoleDetails(item){
    if(item?.is_profile || item?.is_focus_area || item?.is_objective || item?.is_initiative){
      StrategyMappingStore.setUser(item)
      this._router.navigateByUrl('strategy-management/strategy-role-details');
    }
  }
}
