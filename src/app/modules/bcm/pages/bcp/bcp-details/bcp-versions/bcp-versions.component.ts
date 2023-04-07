import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BcpStore } from "src/app/stores/bcm/bcp/bcp-store";
import { autorun, IReactionDisposer } from 'mobx';
import { Router, ActivatedRoute } from "@angular/router";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";

@Component({
  selector: 'app-bcp-versions',
  templateUrl: './bcp-versions.component.html',
  styleUrls: ['./bcp-versions.component.scss']
})
export class BcpVersionsComponent implements OnInit {
  BcpStore = BcpStore;
  AppStore = AppStore;
  selectedVersion = null;
  reactionDisposer: IReactionDisposer;
  constructor(private _cdr: ChangeDetectorRef, private _helperService: HelperServiceService,
    private _utilityService: UtilityService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _imageService: ImageServiceService) { }

  ngOnInit(): void {
    let subMenuItems = [
      {activityName:null, submenuItem: {type: 'close', path: '../'}}
    ]
    NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
    if(!BcpStore.detailsLoaded) {
      let params = this._activatedRoute.params['id'];
      this._router.navigateByUrl('/bcm/business-continuity-plan/'+params);
    }
    this._utilityService.detectChanges(this._cdr);
  }

  selectedVersionChange(e){
  }

  getVersions(){
    if(BcpStore.bcpDetails){
      let versions = JSON.parse(JSON.stringify(BcpStore.bcpDetails.versions));
      let pos = versions.findIndex(e => e.id == BcpStore.currentVersionId);
      versions.splice(pos,1);
      return versions;
    }
    else{
      return [];
    }
  }

  createImageUrl(token){
    return this._imageService.getThumbnailPreview('user-profile-picture',token);
  }

  // Return Default Image
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

}
