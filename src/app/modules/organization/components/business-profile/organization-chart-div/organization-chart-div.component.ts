import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { AddUserStore } from 'src/app/stores/human-capital/users/add-user.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AppStore } from "src/app/stores/app.store";

@Component({
  selector: 'app-organization-chart-div',
  templateUrl: './organization-chart-div.component.html',
  styleUrls: ['./organization-chart-div.component.scss']
})
export class OrganizationChartDivComponent implements OnInit {

  @Input('details') loopItems: any[] = [];
  AppStore = AppStore;
  constructor(private _organizationFileService: OrganizationfileService, private _imageService: ImageServiceService,
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

  editUser(id: number){
    AddUserStore.setEditFlag();
    UsersStore.setUserId(id);
    if(UsersStore.user_id)
    this._router.navigateByUrl('/human-capital/users/edit/'+UsersStore.user_id);
  }
  
  gotoUserDetails(id: number){
    this._router.navigateByUrl('/human-capital/users/'+id);
  }


}
