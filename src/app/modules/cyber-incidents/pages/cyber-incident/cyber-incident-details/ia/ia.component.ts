import { Component, OnInit , ViewChild,ElementRef, ChangeDetectorRef,Renderer2,OnDestroy} from '@angular/core';
import { IReactionDisposer,autorun } from 'mobx';
import { CyberIncidentIaService } from 'src/app/core/services/cyber-incident/cyber-incident-ia/cyber-incident-ia.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CyberIncidentIAStore } from 'src/app/stores/cyber-incident/cyber-incident-ia-store';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-ia',
  templateUrl: './ia.component.html',
  styleUrls: ['./ia.component.scss']
})
export class IaComponent implements OnInit,OnDestroy {
  @ViewChild('addIAformModal', { static: true }) addIAformModal: ElementRef;
  iaAddObject = {
    type:null,
    values:null
  }
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  CyberIncidentStore=CyberIncidentStore;
  CyberIncidentIAStore=CyberIncidentIAStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  NoDataItemStore=NoDataItemStore;
  addIASubscriptionEvent: any;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _imageService:ImageServiceService,
    private _helperService: HelperServiceService,
    private _cyberIncidentIaService:CyberIncidentIaService
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"incident",
        path:`/cyber-incident/cyber-incidents`
      });
    }
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addIA();
            break;
          case "edit_modal":
          this.addIA();
          break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
     

    })
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle'}); // for closing the modal
    this.addIASubscriptionEvent = this._eventEmitterService.cyberIncidentIAModal.subscribe(res => {
      this.closeFormModal();
    })

   
    
    this.pageChange();
  }

  pageChange() {
  
    this._cyberIncidentIaService.getItems(CyberIncidentStore.incidentId).subscribe(res=>{
      this.setMenu();
      this._utilityService.detectChanges(this._cdr);
    });
  
  }

  setMenu()
  {
    if(CyberIncidentIAStore?.imapctAnalysis?.data.length)
    {
      SubMenuItemStore.setSubMenuItems([
        { type: 'edit_modal'},
        { type: "close", path: "../" }
  
      ]);
      
    }
    else
    {
      SubMenuItemStore.setSubMenuItems([
        { type: 'new_modal'},
        { type: "close", path: "../" }

      ]);
    }
  }

  addIA() {
    if(CyberIncidentIAStore?.imapctAnalysis?.data.length)
    {
      this.iaAddObject.type = 'Edit';
    }
    else{
      this.iaAddObject.type = 'Add';
    }
    
    setTimeout(() => {
      $(this.addIAformModal.nativeElement).modal('show');
    }, 50);
  }
  // for closing the rca form modal
  closeFormModal() {
    setTimeout(() => {
      $(this.addIAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
      
    }, 50);
    this.iaAddObject.type = null;
    this.iaAddObject.values = null;
    this.pageChange();
  }

  

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }
  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title;
    userDetial['image_token'] = users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;

  }

  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    CyberIncidentIAStore.unsetIA();
    this.addIASubscriptionEvent.unsubscribe();
  }

}
