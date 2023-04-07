import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewChildren, QueryList, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer } from 'mobx';
import { Router } from "@angular/router";
import { ProfileService } from "src/app/core/services/organization/business_profile/profile/profile.service";
import { ProfileStore } from "src/app/stores/organization/business_profile/profile/profile.store";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AppStore } from "src/app/stores/app.store";
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { BranchesStore } from 'src/app/stores/organization/business_profile/branches/branches.store';
import { PolicyStore } from 'src/app/stores/organization/business_profile/policies/policies.store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessServiceStore } from 'src/app/stores/organization/business_profile/business-services.store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { BusinessApplicationsMasterStore } from 'src/app/stores/masters/bcm/business-applications.master.store';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
   selector: 'app-business-profile',
   templateUrl: './business-profile.component.html',
   styleUrls: ['./business-profile.component.scss']
})

export class BusinessProfileComponent implements OnInit,OnDestroy {
   @ViewChild('sideBarRound', { static: true }) sideBarRound: ElementRef;
   @ViewChild('curveToggle') curveToggle: ElementRef;
   @ViewChildren('userSideBar') userSideBar: QueryList<ElementRef>;
   @ViewChild('userRightDetails') userRightDetails: ElementRef;
   @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
   @ViewChild('profileSlider') profileSlider: ElementRef;
   @ViewChild('navBar') navBar: ElementRef;
   @ViewChild('plainDev') plainDev: ElementRef;

   reactionDisposer: IReactionDisposer;
   ProfileStore = ProfileStore;
   sideCollapsed: boolean = false;
   BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
   OrganizationModulesStore = OrganizationModulesStore;
   OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
   OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
   AppStore = AppStore;
   AuthStore = AuthStore;
   previewObject = {
      preview_url: null,
      uploaded_user: null,
      created_at: '',
      component: 'subsidiary-download-file',
      componentId: null,
      file_details: null,
   }
   sliderSubscriptionEvent: any = null;

   constructor(
      private _profileService: ProfileService, private _utilityService: UtilityService,
      private _renderer2: Renderer2, private _organizationFileService: OrganizationfileService,
      private _cdr: ChangeDetectorRef, private _sanitizer: DomSanitizer, private _imageService: ImageServiceService,
      private _eventEmitterService: EventEmitterService, private _router: Router
   ) { }

   ngOnInit() {
      AppStore.showDiscussion = false;
      AppStore.showTutorial = true;
      this._utilityService.detectChanges(this._cdr);
      this._utilityService.scrollToTop();//Automatically scroll to top of page

      setTimeout(() => {
         this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
         window.addEventListener('scroll',this.scrollEvent,true);
       }, 1000);
      
      // setTimeout(() => {
      //    // Open Modal for Profile Slider
      //    if(window.localStorage.showPopUp != 'false')
      //       this.showProfileSlider();
      // }, 150);

      //GET Primary Organization
      this._profileService.getItem(null,true).subscribe(res=>{
         AuthStore.user.organization.title = res.title
         this._utilityService.detectChanges(this._cdr); 
      })

      // Subscribe Event to Close Profile Slider
      this.sliderSubscriptionEvent = this._eventEmitterService.profileSlider.subscribe(res=>{
         this.closeProfileSlider();
      })

      BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;

   }

   //Check Whether the file extension is of image, or doc or excel or pdf
   checkExtension(ext,extType){
      var res = this._imageService.checkFileExtensions(ext,extType);
      return res;
   }

   getItemsPerIndex(start,end){
      let array = OrganizationModulesStore.getOrganizationSubModules(100,2101).slice(start,end);
      return array;
   }

   tabListUlClick(ev) {
      if ((ev.target.tagName == 'A') && (ev.target.classList.contains('full-screen-click')))
         this.collapseSide();
      else if ((ev.target.tagName == 'A') && (ev.target.classList.contains('nav-link-show')))
         this.unCollapseSide();
   }

   collapseSide() {
      if (!this.sideCollapsed && this.userSideBar.first) {
         this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
         // this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
         setTimeout(() => {
            this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
            this._renderer2.addClass(this.userRightDetails.nativeElement, 'flex-98-width');
         }, 500);
         this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'block');
         this._renderer2.addClass(this.sideBarRound.nativeElement, 'tActive');
         this._renderer2.setStyle(this.sideBarRound.nativeElement, 'position','fixed');
         this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index','9999');
         this.sideCollapsed = true;
      }
   }

   unCollapseSide() {
      if (this.sideCollapsed && this.userSideBar.first) {
         this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
         this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
         this._renderer2.removeClass(this.userRightDetails.nativeElement, 'flex-98-width');
         this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'none');
         // this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index','999999');
         this._renderer2.removeClass(this.sideBarRound.nativeElement, 'tActive');

         this.sideCollapsed = false;
      }
   }

   //Download a particular brochure
   downloadBrochures(downloadItem,id){
      event.stopPropagation();
      this._organizationFileService.downloadFile('profile-download-file',id,downloadItem.id,downloadItem.title,downloadItem);
   }
  
   //Download all brochures as zip
   downloadAllBrochures(id){
      this._organizationFileService.downloadFile('profile-download-all',id, null, 'organization-brochures');
   }
    
   //View particular brochure
   viewBrochureItem(brochureItem,id){
      this._organizationFileService.getFilePreview('profile-preview',id,brochureItem.id).subscribe(res=>{
         var resp:any = this._utilityService.getDownLoadLink(res,brochureItem.name);
         this.openPreviewModal(resp,brochureItem,id);
      }),(error=>{
      if(error.status == 403){
         this._utilityService.showErrorMessage('error','permission_denied');
      }
      else{
         this._utilityService.showErrorMessage('error','unable_generate_preview');
      }
      });
   }

   dropdownItemClicked(item){
      if(item.client_side_url == 'organization/business-profile'){
         this.unCollapseSide();
      }
      else{
         this.collapseSide();
      }
   }

   //Returns the image url created according to type and token
   createImageUrl(type,token){
      if(type == 'logo')
         return this._organizationFileService.getThumbnailPreview('business-profile-logo',token);
      else
         return this._organizationFileService.getThumbnailPreview('business-profile-brochure',token);
   }

   //Returns default image, if no image is present
   getDefaultImage(type){
      return this._imageService.getDefaultImageUrl(type);
   }

   /**
    * Sets details of brochure in preview object and opens preview
    * @param filePreview download url of the file
    * @param brochureDetails details of the brochure
    */
   openPreviewModal(filePreview,brochureDetails,profileId){
      let previewItem = null;
      if(filePreview){
         previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = brochureDetails;
      this.previewObject.component = "profile-download-file";
      this.previewObject.componentId = profileId;
      this.previewObject.uploaded_user = this._profileService.getProfileDetailsStore().updated_by ? this._profileService.getProfileDetailsStore().updated_by : this._profileService.getProfileDetailsStore().created_by ;
      this.previewObject.created_at = this._profileService.getProfileDetailsStore().created_at ? this._profileService.getProfileDetailsStore().created_at : '';
      $(this.filePreviewModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
      }
    }

    checkForCurrentUrl(){
       let bpos = OrganizationModulesStore.getOrganizationSubModules(100,2101).findIndex(e => e.client_side_url == 'organization/business-profile/projects');
       let spos = OrganizationModulesStore.getOrganizationSubModules(100,2101).findIndex(e => e.client_side_url == 'organization/business-profile/business-applications');
       if(bpos != -1 || spos != -1){
          return true;
       }
       else{
          return false;
       }
    }

   processTitle(title){
      return title.toLowerCase().replace(/ /g,'');
   }
  
    // Closes from preview
    closePreviewModal(event){
      $(this.filePreviewModal.nativeElement).modal('hide');
      this.previewObject.componentId = null;
      this.previewObject.file_details = null;
      this.previewObject.preview_url = '';
      this.previewObject.uploaded_user = null;
      this.previewObject.created_at = '';
    }

   // Open Modal for Profile Slider
   showProfileSlider(){
      $(this.profileSlider.nativeElement).modal('show');
   }

   // Close Modal for Profile Slider
   closeProfileSlider(){
      $(this.profileSlider.nativeElement).modal('hide');
   }

   scrollEvent = (event: any): void => {
      if(event.target.documentElement){
        const number = event.target.documentElement.scrollTop;
        if(number > 50){
          this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
          this._renderer2.addClass(this.navBar.nativeElement,'affix');
        }
        else{
          this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
          this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        }
      }
    }

   returnWebsiteValue(value){
      if(value){
         if(value.indexOf('http') != -1)
            return value;
         else
            return `http://${value}`;
      }
   }

   checkRouterLink(){
      let url = this._router.url.substring(1, this._router.url.length);
      let moreItems = this.getItemsPerIndex(8,OrganizationModulesStore.getOrganizationSubModules(100,2101).length);
      let pos =  moreItems.findIndex(e => url == e.client_side_url);
      return pos != -1 ? true : false;
   }

   ngOnDestroy(){
      window.removeEventListener('scroll',this.scrollEvent);
      ProfileStore.unsetOrganizationProfile();
      BranchesStore.unsetBranchList();
      PolicyStore.unsetPolicyList();
      SubsidiaryStore.clearSubsidiaryList();
      MsTypeStore.unsetAllData();
      BusinessProductsStore.unsetAllData();
      BusinessServiceStore.clearServicesList();
      BusinessProjectsStore.unSetAllData();
      BusinessApplicationsMasterStore.unsetBusinessApplications();
      StrategicObjectivesMasterStore.unsetStrategicObjectives();
      BusinessCustomersStore.unsetAllData();
      this.sliderSubscriptionEvent.unsubscribe();
      AppStore.showTutorial = false;
      this._utilityService.detectChanges(this._cdr);
   }

}
