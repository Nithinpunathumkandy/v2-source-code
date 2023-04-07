import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { IReactionDisposer, autorun } from 'mobx';

import { StakeholdersListService } from "src/app/core/services/organization/stakeholder/stakeholders-list/stakeholders-list.service";
import { StakeholderDetailsService } from "src/app/core/services/organization/stakeholder/stakeholder-details/stakeholder-details.service";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

import { StakeholdersStore } from "src/app/stores/organization/stakeholders/stakeholders.store";
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { StakeholderDetailsStore } from 'src/app/stores/organization/stakeholders/stakeholder-details.store';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';

import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from "src/app/stores/auth.store";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

declare var $: any;
@Component({
  selector: 'app-stakeholder-details',
  templateUrl: './stakeholder-details.component.html',
  styleUrls: ['./stakeholder-details.component.scss']
})
export class StakeholderDetailsComponent implements OnInit,OnDestroy {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('needsAndExpectationsModal') needsAndExpectationsModal: ElementRef;
  @ViewChild('needsAndExpectationsFormModal') needsAndExpectationsFormModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;

  AuthStore = AuthStore;
  AppStore = AppStore;
  StakeholdersStore = StakeholdersStore;
  StakeholderDetailsStore = StakeholderDetailsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  reactionDisposer: IReactionDisposer;

  stakeholderId: number = null;
  needExpectationObject = {
    stakeholder_id: null
  };

  needExpectationFormObject = {
    type: null,
    values: null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  }
  emptyNeedsandExpectations = 'no_needs_expectations';
  emptyStakeholderIssues = 'no_stakeholder_issues';
  stakeHolderObject = {
    component: 'Master',
    values: null,
    type: null
  };

  userDetailObject = {
    first_name:'',
    last_name:'',
    designation:'',
    image_token:'',
    mobile:null,
    email:'',
    id:null,
    department:'',
    status_id:null,
    created_at:''
  }

  needExpectationSubscriptionEvent: any = null;
  needExpectationFormSubscriptionEvent: any = null;
  needExpectationFormSubscriptioncloseEvent: any = null;
  confirmationPopUpSubscriptionEvent: any = null;
  stakeHolderSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  constructor(private _renderer2: Renderer2, private _activatedRoute: ActivatedRoute,
    private _router: Router, private _stakeholdersService: StakeholdersListService,
    private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef, private _stakeholderDetailsService: StakeholderDetailsService,
    private _imageService: ImageServiceService, private _helperService: HelperServiceService) { }

  ngOnInit(): void {

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    StakeholdersStore.unsetStakeholderDetails();
    StakeholderDetailsStore.unsetValues();

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'UPDATE_STAKEHOLDER', submenuItem: { type: 'edit_modal' }},
        {activityName: 'DELETE_STAKEHOLDER', submenuItem: { type: 'delete'}},
        {activityName: null, submenuItem: { type: 'close', path: '/organization/stakeholders' }},
      ]
 
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);


      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal": 
            setTimeout(() => {
              this.stakeHolderObject.type = 'Edit';
              this.stakeHolderObject.values = {
                id: StakeholdersStore.stakeholderDetails.id,
                title: StakeholdersStore.stakeholderDetails.title,
                stakeholder_type_id: StakeholdersStore.stakeholderDetails.stake_holder_type.id
              } // for clearing the value
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;
          case "delete":
            this.showDeleteConfirmation();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    SubMenuItemStore.setNoUserTab(true);

    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'edit_modal' },
    //   { type: 'delete' },
    //   { type: 'close', path: '/organization/stakeholders' },
    // ]);

    // for closing the modal
    this.needExpectationSubscriptionEvent = this._eventEmitterService.stakeholderNeedsAndExpectationsControl.subscribe(res => {
      this.closeNeedsAndExpectationModal();
    })

    this.needExpectationFormSubscriptionEvent = this._eventEmitterService.stakeholderNeedExpectationFormModalControl.subscribe(res=>{
      if(res)
        this.openNeedsExpectationsFormModal();
    })

    this.needExpectationFormSubscriptioncloseEvent = this._eventEmitterService.modalChange.subscribe(res=>{
      if(res == 6)
        this.closeNeedsAndExpectationFormModal();
    })

    this.confirmationPopUpSubscriptionEvent = this._eventEmitterService.deletePopup.subscribe(status => {
      if(this.popupObject.title.indexOf('Delete Stakeholder') != -1)
        this.deleteStakeholder(status);
      else if(this.popupObject.type == 'Deactivate')
        this.deactivateStakeholder(status);
      else
        this.deleteNeedsAndExpectations(status);
    })

    this.stakeHolderSubscriptionEvent = this._eventEmitterService.modalChange.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    this._activatedRoute.params.subscribe(params => {
      this.stakeholderId = +params['id']; 
      if(this.stakeholderId){
        this._stakeholdersService.getItem(this.stakeholderId).subscribe(res=>{
          this.checkForStakeholderStatus();
          this.pageChangeIssues();
          this.pageChangeNeedsAndExpectations();
          this._utilityService.detectChanges(this._cdr);
        })
      }
      else
        this._router.navigateByUrl('/organization/stakeholders');
    });
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }

  }

  gotoIssueDetails(issueId){
    IssueListStore.unsetIssueDetails();
    IssueListStore.setSelectedIssueId(issueId);
    this._router.navigateByUrl('/organization/issue-details/'+IssueListStore.selectedId)
  }

  pageChangeNeedsAndExpectations(page?: number){
    if(page) StakeholderDetailsStore.setStakeholderNeedsAndExpectationCurrentPage(page); 
    else StakeholderDetailsStore.setStakeholderNeedsAndExpectationCurrentPage(1);
    this._stakeholderDetailsService.getStakeholderNeedsAndExpectaions(this.stakeholderId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  pageChangeIssues(page?: number){
    if(page) StakeholderDetailsStore.setStakeholderIssuesCurrentPage(page); 
    else StakeholderDetailsStore.setStakeholderIssuesCurrentPage(1);
    this._stakeholderDetailsService.getStakeholderIssues(this.stakeholderId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  checkForStakeholderStatus(){
    if(StakeholdersStore.stakeholderDetails.status.id == AppStore.inActiveStatusId){
      SubMenuItemStore.removeSubMenu('delete');
      this._utilityService.detectChanges(this._cdr);
    }
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    else if($(this.needsAndExpectationsModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.needsAndExpectationsModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.needsAndExpectationsModal.nativeElement,'overflow','auto');
    }
    else if($(this.needsAndExpectationsFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.needsAndExpectationsFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.needsAndExpectationsFormModal.nativeElement,'overflow','auto');
    }
  }

  deleteConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Needs and Expectaion?';
    this.popupObject.subtitle = 'are_you_sure_delete';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  showDeleteConfirmation(){
    this.popupObject.type = '';
    this.popupObject.id = this.StakeholdersStore.stakeholderDetails?.id;
    this.popupObject.title = 'Delete Stakeholder?';
    this.popupObject.subtitle = 'are_you_sure_delete';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteNeedsAndExpectations(status){
    if(status && this.popupObject.id){
      this._stakeholderDetailsService.deleteStakeholderNeedsAndExpectations(this.popupObject.id,this.stakeholderId).subscribe(res =>{
        this.closeConfirmationPopup();
        this.clearPopUpObject();
        this._utilityService.detectChanges(this._cdr);
      },(error=>{
        this.closeConfirmationPopup();
        this.clearPopUpObject();
      }))
    }
    else{
      this.closeConfirmationPopup();
      this.clearPopUpObject();
    }
  }

  deleteStakeholder(status){
    if(status && this.popupObject.id){
      this._stakeholdersService.deleteItem(this.popupObject.id).subscribe(res =>{
        this.closeConfirmationPopup();
        this.clearPopUpObject();
        this._router.navigateByUrl('/organization/stakeholders');
        this._utilityService.detectChanges(this._cdr);
      },(error=>{
        if(error.status == 405 && StakeholdersStore.stakeholderDetails.status.id == AppStore.activeStatusId){
          let id = this.popupObject.id;
          this.closeConfirmationPopup();
          this.clearPopUpObject();
          setTimeout(() => {
            this.deactivateStakeholderConfirm(id);
          }, 500);
        }
        else{
          this.closeConfirmationPopup();
          this.clearPopUpObject();
        }
      }))
    }
    else{
      this.closeConfirmationPopup();
      this.clearPopUpObject();
    }
  }

  deactivateStakeholder(status: boolean) {
    if (status && this.popupObject.id) {
      this._stakeholdersService.deactivateItem(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this._stakeholdersService.getItem(this.stakeholderId).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        });
        this.closeConfirmationPopup();
        this.clearPopUpObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopUpObject();
    }
  }

  deactivateStakeholderConfirm(id: number) {
    if(event) event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Stakeholder?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  clearPopUpObject(){
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }

  openFormModal(){
    $(this.formModal.nativeElement).modal('show');
  }

  statusClass(statusLabel: string){
    if(statusLabel){
      let lastIndex = statusLabel.lastIndexOf('-');
      let statusColor = statusLabel.substring(0, lastIndex);
      return 'draft-tag draft-tag-'+statusColor+' label-tag-style-tag label-left-arow-tag d-inline-block status-tag-new-one';
    }
    else return '';
  }

  closeFormModal(){
    $(this.formModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    this._stakeholdersService.getItem(this.stakeholderId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  closeConfirmationPopup(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  openNeedsExpectationModal(){
    // setTimeout(() => {
      this.needExpectationObject.stakeholder_id = this.stakeholderId;
      //$(this.needsAndExpectationsModal.nativeElement).modal('show');
      this._renderer2.addClass(this.needsAndExpectationsModal.nativeElement,'show');
      this._renderer2.setStyle(this.needsAndExpectationsModal.nativeElement,'display','block');
    // }, 100);
  }

  closeNeedsAndExpectationModal(){
    // setTimeout(() => {
      // $(this.needsAndExpectationsModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.needsAndExpectationsModal.nativeElement,'show');
      this._renderer2.setStyle(this.needsAndExpectationsModal.nativeElement,'display','none');
      this.needExpectationObject.stakeholder_id = null;
    // }, 100);
  }

  openNeedsExpectationsFormModal(){
    // setTimeout(() => {
      this.needExpectationFormObject.type = 'Add';
      //$(this.needsAndExpectationsModal.nativeElement).modal('show');
      this._renderer2.addClass(this.needsAndExpectationsFormModal.nativeElement,'show');
      this._renderer2.setStyle(this.needsAndExpectationsFormModal.nativeElement,'display','block');
      this._renderer2.setStyle(this.needsAndExpectationsFormModal.nativeElement,'z-index','999999');
    // }, 100);
  }

  closeNeedsAndExpectationFormModal(){
    // setTimeout(() => {
      // $(this.needsAndExpectationsModal.nativeElement).modal('hide');
      this.needExpectationFormObject.type = null;
      this._renderer2.removeClass(this.needsAndExpectationsFormModal.nativeElement,'show');
      this._renderer2.setStyle(this.needsAndExpectationsFormModal.nativeElement,'display','none');
      this._renderer2.setStyle(this.needsAndExpectationsFormModal.nativeElement,'z-index','99999');
      this._renderer2.setStyle(this.needsAndExpectationsModal.nativeElement,'z-index','999999');
    // }, 100);
  }

  createPreviewUrl(type,token){
    return this._imageService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  getPopupDetails(user){
    if(user){
      this.userDetailObject.first_name = user.first_name;
      this.userDetailObject.last_name = user.last_name;
      this.userDetailObject.designation = user.designation;
      this.userDetailObject.image_token = user.image.token;
      this.userDetailObject.email = user.email ? user.email: null;
      this.userDetailObject.mobile = user.mobile ? user.mobile: null;
      this.userDetailObject.id = user.id;
      this.userDetailObject.department = user.department  ?user.department : null;
      this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
      this.userDetailObject.created_at = StakeholdersStore.stakeholderDetails?.created_at;
      return this.userDetailObject;
    }
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    this.stakeHolderSubscriptionEvent.unsubscribe();
    SubMenuItemStore.makeEmpty();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.needExpectationSubscriptionEvent.unsubscribe();
    this.needExpectationFormSubscriptionEvent.unsubscribe();
    this.needExpectationFormSubscriptioncloseEvent.unsubscribe();
    this.confirmationPopUpSubscriptionEvent.unsubscribe();
    StakeholdersStore.unsetStakeholderDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }


}
