import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, Renderer2, ChangeDetectorRef } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ActivatedRoute } from "@angular/router";
import { BcpService } from "src/app/core/services/bcm/bcp/bcp.service";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BcpStore } from "src/app/stores/bcm/bcp/bcp-store";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { BcpChangeRequestService } from "src/app/core/services/bcm/bcp/bcp-change-request/bcp-change-request.service";
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";
import { CommentStore } from 'src/app/stores/comment.store';

declare var $: any;

@Component({
  selector: 'app-bcp-details',
  templateUrl: './bcp-details.component.html',
  styleUrls: ['./bcp-details.component.scss']
})
export class BcpDetailsComponent implements OnInit {

  @ViewChild('sideBarRound', { static: true }) sideBarRound: ElementRef;
  @ViewChild('curveToggle') curveToggle: ElementRef;
  @ViewChildren('userSideBar') userSideBar: QueryList<ElementRef>;
  @ViewChild('userRightDetails') userRightDetails: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  BcpStore = BcpStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  sideCollapsed: boolean = false;
  sliderSubscriptionEvent: any = null;
  callTreeSubscription: any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  constructor(private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2,
    private _activatedRoute: ActivatedRoute, private _bcpService: BcpService, private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService, private _imageService: ImageServiceService,
    private _helperService: HelperServiceService, private _bcpChangeRequestService: BcpChangeRequestService) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.sliderSubscriptionEvent = this._eventEmitterService.profileSlider.subscribe(res=>{
      this.closeProfileSlider();
    })
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    AppStore.showDiscussion = false;
    this.callTreeSubscription = this._eventEmitterService.callTreeModal.subscribe(res=>{
      this.getBcpDetails(BcpStore.bcpDetails.id);
    })

    SubMenuItemStore.setNoUserTab(true);
    this._activatedRoute.params.subscribe(params => {
      let id = +params['id']; 
      BcpStore.selectedBcpId = id;
      this.getBcpDetails(id);
    });

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

  getBcpDetails(id: number){
    this._bcpService.getItem(id).subscribe(res=>{
        let pos = res.versions.findIndex(e => e.is_latest == 1);
        if(pos != -1) { 
          // BcpStore.setBcpContents(res.versions[pos]);
          this._bcpService.setBcpContents(res.versions[pos]);
          BcpStore.currentVersionId = res.versions[pos].id;
        }
        if(BcpStore.bcpContents?.change_request?.length == 0){
          BcpStore.changeRequestWorkflow = false;
        }
        else{
          BcpStore.changeRequestWorkflow = true;
        }
        if(res.versions.length > 0){
          let versions = JSON.parse(JSON.stringify(res.versions));
          pos = versions.findIndex(e => e.id == BcpStore.currentVersionId);
          versions.splice(pos,1);
          BcpStore.setBcpVersionHistory(versions);
        }
        this.getBcpWorkflow(BcpStore.bcpDetails.id);
        this._utilityService.detectChanges(this._cdr);
    })
  }

  getBcpWorkflow(id: number){
    let workflowDetails;
    if(BcpStore.changeRequestWorkflow)
      workflowDetails = this._bcpChangeRequestService.getWorkflowDetails(this.BcpStore.bcpContents.change_request[0].id);
    else
      workflowDetails = this._bcpService.getWorkflowDetails(BcpStore.bcpDetails.id);
    workflowDetails.subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  closeProfileSlider(){

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
       this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
       setTimeout(() => {
          this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
          this._renderer2.addClass(this.userRightDetails.nativeElement, 'flex-98-width');
       }, 150);
       this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'block');
       this._renderer2.addClass(this.sideBarRound.nativeElement, 'tActive');
       this._renderer2.setStyle(this.sideBarRound.nativeElement, 'position','fixed');
       this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index','99999');
       this.sideCollapsed = true;
    }
 }

 unCollapseSide() {
    if (this.sideCollapsed && this.userSideBar.first) {
       this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
       this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
       this._renderer2.removeClass(this.userRightDetails.nativeElement, 'flex-98-width');
       this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'none');
       this._renderer2.removeClass(this.sideBarRound.nativeElement, 'tActive');

       this.sideCollapsed = false;
    }
 }

 createImageUrl(type,token){
  if(type == 'logo')
     return this._imageService.getThumbnailPreview('user-profile-picture',token);
  }

  getPopupDetails(user, is_created_by: boolean = false) {
  
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation?.title ? user.designation.title : user.designation?user.designation: null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = BcpStore.bcpDetails.created_at;
      return userDetailObject;
    }
}

getTimezoneFormatted(time){
  return this._helperService.timeZoneFormatted(time);
}

//Returns default image, if no image is present
getDefaultImage(type){
  return this._imageService.getDefaultImageUrl(type);
}

getArrayFormattedText(array){
  return this._helperService.getArraySeperatedString(',','title',array)
}

  ngOnDestroy(){
    BcpStore.unsetBcpDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    CommentStore.commentObjectVariable = '';
    this.sliderSubscriptionEvent.unsubscribe();
    this.callTreeSubscription.unsubscribe();
    if(this.reactionDisposer) this.reactionDisposer();
  }

}
