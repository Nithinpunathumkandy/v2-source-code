import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from "@angular/router";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

import { ProfileStore } from "src/app/stores/organization/business_profile/profile/profile.store";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { AppStore } from "src/app/stores/app.store";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import * as introJs from 'intro.js/intro.js'; // importing introjs library
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationModulesStore = OrganizationModulesStore;
  ProfileStore = ProfileStore;
  AppStore = AppStore;
  introButtonSubscriptionEvent: any = null;
  emptyMessage = "no_data_found"
  introSteps = [
     {
       element: '.organization-profile-sidebar',
       intro: "Organization Basic Info",
       position: "right"
     },
     {
        element: '#right-details',
        intro: "Organization Description, Vision, Mission and Values",
        position: "left"
      },
     {
       element: '#edit_modal',
       intro: 'Edit Profile',
       position: 'bottom'
     },
     {
        element: '#export_to_excel',
        intro: 'Export Profile Details',
        position: 'bottom'
     },
     {
        element: '#template',
        intro: 'Download Template',
        position: 'bottom'
     },
  ]

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _router: Router,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _organizationFileService: OrganizationfileService,
    private _eventEmitterService: EventEmitterService
  ) { }

  ngOnInit() {
    RightSidebarLayoutStore.showFilter = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'UPDATE_BUSINESS_PROFILE', submenuItem: {type: 'edit_modal'}},
        // {activityName: 'EXPORT_BUSINESS_PROFILE', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'GENERATE_BUSINESS_PROFILE_TEMPLATE', submenuItem: {type: 'template'}},
      ]
      if(AuthStore.userPermissionsLoaded){
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems,this.introSteps);
      }
      if(OrganizationModulesStore.loaded){
        this.addItemsToIntroSteps();
      }
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this._router.navigateByUrl('/organization/profile/edit-profile');
            }, 1000);
            break;
          case "template":
            var fileDetails = {
              ext: 'xlsx',
              title: 'business_profile_template',
              size: null
            };
            this._organizationFileService.downloadFile('profile-template',1,null,fileDetails.title,fileDetails);
            break;
          case "export_to_excel":
            var fileDetails = {
              ext: 'xlsx',
              title: 'business_profiles',
              size: null
            };
            this._organizationFileService.downloadFile('profile-export',1,null,fileDetails.title,fileDetails);
            break;
          case "edit_modal":
            this._router.navigateByUrl('/organization/profile/edit-profile');
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res=>{
      this.showIntro();
    })

    SubMenuItemStore.setNoUserTab(true);

  }

  addItemsToIntroSteps(){
    if(OrganizationModulesStore.loaded){
       if(this.OrganizationModulesStore.getOrganizationSubModules(100,2101).length > 7){
          let element = {
             element: '#more',
             intro: 'More Items',
             position: 'bottom'
           };
           if(this.introSteps.findIndex(e => e.element == '#more') == -1) this.introSteps.unshift(element);
       }
       for(let i of this.getItemsPerIndex(0,7).reverse()){
          let element = {
             element: '#'+i.title.toLowerCase().replace(/ /g,''),
             intro: i.title,
             position: 'bottom'
           };
           if(this.introSteps.findIndex(e => e.element == '#'+i.title.toLowerCase().replace(/ /g,'')) == -1) this.introSteps.unshift(element);
       }
       
    }
 }

 getItemsPerIndex(start,end){
  let array = OrganizationModulesStore.getOrganizationSubModules(100,2101).slice(start,end);
  return array;
}

showIntro(){
  var intro:any = introJs();
  intro.setOptions({
    steps: this.introSteps,
    showBullets: true,
    showButtons: true,
    exitOnOverlayClick: true,
    keyboardNavigation: true,
    nextLabel: 'Next',
    prevLabel: 'Back',
    doneLabel: 'Done',
    nextToDone: true,
    hidePrev: true,
  });
  intro.start();
}

  //Returns Trimmed Mission
  getMisionContent(profileDetails){
    var misionContent = profileDetails.mision.substring(0,200);
    return misionContent;
  }

  //Sets Mission View More or Less
  viewMision(type){
    if(type == 'more')
      ProfileStore.mision_more = true;
    else
      ProfileStore.mision_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  //Returns Trimmed Vision
  getVisionContent(profileDetails){
    var misionContent = profileDetails.vision.substring(0,200);
    return misionContent;
  }

  //Sets Vision View More or Less
  viewVision(type){
    if(type == 'more')
      ProfileStore.vision_more = true;
    else
      ProfileStore.vision_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  //Returns Trimmed Description
  getDescriptionContent(profileDetails){
    var misionContent = profileDetails.description.substring(0,2000);
    return misionContent.trim();
  }

  //Sets Description View More or Less
  viewDescription(type){
    if(type == 'more')
      ProfileStore.description_more = true;
    else
      ProfileStore.description_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  //Returns Trimmed Values -- Not Using Now
  getValuesContent(profileDetails){
    var valuesContent = '';
    if(!ProfileStore.values_more)
      valuesContent = profileDetails.values.substring(0,1000);
    else
      valuesContent = profileDetails.values;
    return valuesContent;
  }

  //Sets Values View More or Less -- Not Using Now
  viewValues(type){
    if(type == 'more')
      ProfileStore.values_more = true;
    else
      ProfileStore.values_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  //Returns Trimmed CEO Message
  getCeoMessageContent(profileDetails){
    var ceoMessageContent = profileDetails.ceo_message.substring(0,1000);
    return ceoMessageContent;
  }

  //Sets Ceo Message View More or Less 
  viewCeoMessage(type){
    if(type == 'more')
      ProfileStore.ceo_message_more = true;
    else
      ProfileStore.ceo_message_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  //Returns the image url created according to type and token
  createImageUrl(type,token){
    if(type == 'logo')
       return this._imageService.getThumbnailPreview('user-profile-picture',token);
    else
       return this._imageService.getThumbnailPreview('business-profile-brochure',token);
  }

  //Returns default image, if no image is present according to type
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  //On Page Leaving Unsets store values
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ProfileStore.mision_more = false;
    ProfileStore.vision_more = false;
    ProfileStore.description_more = false;
    ProfileStore.ceo_message_more = false;
    ProfileStore.values_more = false;
    this.introButtonSubscriptionEvent.unsubscribe();
  }

}
