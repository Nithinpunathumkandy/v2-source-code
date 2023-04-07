import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { AppStore } from 'src/app/stores/app.store';
import { AddUserStore } from 'src/app/stores/human-capital/users/add-user.store';

@Component({
  selector: 'app-strategy-mapping-oc-div',
  templateUrl: './strategy-mapping-oc-div.component.html',
  styleUrls: ['./strategy-mapping-oc-div.component.scss']
})
export class StrategyMappingOcDivComponent implements OnInit {

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
  
  gotoUserDetails(id: number){
    this._router.navigateByUrl('/human-capital/users/'+id);
  }

}
