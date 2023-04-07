import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { IReactionDisposer, autorun } from 'mobx';
import { Router } from "@angular/router";

import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from "src/app/stores/app.store";

import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { IssueListService } from "src/app/core/services/organization/context/issue-list/issue-list.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.scss']
})
export class IssueDetailsComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  IssueListStore = IssueListStore;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  selectedNeed = null;
  emptyMessage="no_data_found"
  AppStore = AppStore;

  constructor(private _activatedRouter: ActivatedRoute, private _issuelistService: IssueListService,
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService,
    private _imageService: ImageServiceService, private _route: Router, private _helperService: HelperServiceService) { }
  
  ngOnInit(): void {

    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      if(id){
        this.getIssueDetails(id);
        IssueListStore.setSelectedIssueId(id);
      }
      else if(!IssueListStore.selectedId)
        this._route.navigateByUrl('/organization/context/issue-lists');
    });
  }

  getIssueDetails(id){
    this._issuelistService.getIssueDetails(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeSelectedNeed(item){
    if(item == this.selectedNeed)
      this.selectedNeed = null;
    else
      this.selectedNeed = item;
  }

  createPreviewUrl(type,token){
    return this._imageService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  gotoEditIssue(){
    this._issuelistService.getIssueDetails(IssueListStore.selectedIssueData?.id).subscribe(res=>{
      this._route.navigateByUrl('/organization/edit-issue');
    });
  }

  gotoUserDetails(userDetails){
    this._route.navigateByUrl('/human-capital/users/'+userDetails.id);
  }

  getArrayFormatedString(items){
    return this._helperService.getArraySeperatedString(',','title',items);
  }

  getTimeZoneTime(time){
    return this._helperService.timeZoneFormatted(time);
  }

  getPopupDetails(user,is_created_by:boolean = false){
    if(user){
      let userDetailObject: any = {};
      userDetailObject['first_name'] = user.first_name;
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation;
      userDetailObject['image_token'] = user.image.token;
      userDetailObject['email'] = user.email;
      userDetailObject['mobile'] = user.mobile;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = user.department?user.department:null;
      userDetailObject['status_id'] = user.status.id?user.status.id:1;
      if(is_created_by) userDetailObject['created_at'] = IssueListStore.selectedIssueData.created_at;
      console.log(userDetailObject['created_at']);
      return userDetailObject;
    }
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

}
