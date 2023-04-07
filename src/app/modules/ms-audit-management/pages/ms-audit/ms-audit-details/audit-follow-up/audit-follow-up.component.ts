import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditNonConfirmityService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $:any;
@Component({
  selector: 'app-audit-follow-up',
  templateUrl: './audit-follow-up.component.html',
  styleUrls: ['./audit-follow-up.component.scss']
})
export class AuditFollowUpComponent implements OnInit {
  @ViewChild('nonConformity') nonConformity : ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  AuditNonConfirmityStore = AuditNonConfirmityStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  nonConformityObject = {
    value : null,
    type : ''
  }
  controlNonConiformitySubscriptionEvent: any;
  popupControlEventSubscription: any;

  constructor(   private _utilityService: UtilityService,   
    private _cdr: ChangeDetectorRef,
    private _router:Router,
    private _helperService: HelperServiceService,
    private _eventEmitterService : EventEmitterService,
    private _auditNonConfirmityService : AuditNonConfirmityService,
    private _renderer2: Renderer2,) { }

  ngOnInit(): void {
      NoDataItemStore.setNoDataItems({title:"Looks like we don't have any follow up Here!", subtitle: null,buttonText: null});
      this.reactionDisposer = autorun(() => {    
        
        var subMenuItems = [
          // {activityName: null, submenuItem: {type: 'new_modal'}},
          {activityName: null, submenuItem: {type: 'search'}},
          {activityName:null, submenuItem: {type: 'refresh'}},
          { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
    
        ]
        if(!AuthStore.getActivityPermission(3700,"CREATE_MS_AUDIT_CHECKLIST")){
          NoDataItemStore.deleteObject('subtitle');
          NoDataItemStore.deleteObject('buttonText');
        }
        this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "new_modal":
              this.addNonConfirmity();
              break;
      
            case "search":
              AuditNonConfirmityStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1); 
              break;
              case 'refresh':
                AuditNonConfirmityStore.loaded = false
                this.pageChange(1); 
                break
              case "user_grid_system":
                if(SubMenuItemStore.userGridSystem){
                  // this.gridView = true
                }
                break;
            default:
              break;
          }
          // Don't forget to unset clicked item immediately after using it
          SubMenuItemStore.unSetClickedSubMenuItem();
        } 
        if(NoDataItemStore.clikedNoDataItem){
          this.addNonConfirmity();
          NoDataItemStore.unSetClickedNoDataItem();
        }
      });

    this.controlNonConiformitySubscriptionEvent = this._eventEmitterService.msAuditNonConformity.subscribe(res => {
      this.closeNonConfirmityModal();
      this.pageChange(1)
    });

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.pageChange(1)
  }

   pageChange(newPage: number = null) {
      if (newPage) AuditNonConfirmityStore.setCurrentPage(newPage);
      this._auditNonConfirmityService.getItems(false,`&ms_audit_id=${MsAuditStore.msAuditId}`).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }

    sortTitle(type: string) {
      this._auditNonConfirmityService.sortList(type, null);
      this.pageChange();
    }

   addNonConfirmity(){
    this.nonConformityObject.type = 'Add';
    this.nonConformityObject.value = null;
    this._utilityService.detectChanges(this._cdr);
    this.openNonConfirmityModal();
   }

   openNonConfirmityModal(){
    setTimeout(() => {
      $(this.nonConformity.nativeElement).modal('show');
      this._renderer2.setStyle(this.nonConformity.nativeElement,'display','block');
      this._renderer2.setStyle(this.nonConformity.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.nonConformity.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);

    }, 100);
   }

   closeNonConfirmityModal(){
    $(this.nonConformity.nativeElement).modal('hide');
    this.nonConformityObject.type = null;
    this._utilityService.detectChanges(this._cdr);
  }

  edit(id:number){
    event.stopPropagation();
    this._auditNonConfirmityService.getIndividualCheckList(id).subscribe(res=>{
      this.nonConformityObject.type = "Edit";
      this.nonConformityObject.value = res;
      this.openNonConfirmityModal();
      this._utilityService.detectChanges(this._cdr);
      
    })
  }

  getDetails(id){
    AuditNonConfirmityStore.setmsAuditNonConfirmityId(id);
    AuditNonConfirmityStore.nonConfirmityRedirect=true;
    this._router.navigateByUrl(`ms-audit-management/ms-audits/follow-ups/${id}`);
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:"follow_up",
      path:'/ms-audit-management/ms-audits/'+MsAuditStore.selectedMsAuditId+'/follow-up'
    });
  }

  deleteNonConfirmity(id:number){
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure';
    this.popupObject.subtitle = 'It will remove the non conformity from the audit';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
      
  }

    // modal control event
    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case 'are_you_sure': this.deleteNonConfirmityItem(status)
          break;
      }
    }
  
    // delete function call
    deleteNonConfirmityItem(status: boolean) {
      if (status && this.popupObject.id) {
        this._auditNonConfirmityService.deleteNonConfirmity(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.pageChange(1)
          this.clearPopupObject();
        });
      }
      else {
        this.clearPopupObject();
      }
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
  
    }

    clearPopupObject() {
      this.popupObject.id = null;
    }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.controlNonConiformitySubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe()
    AuditNonConfirmityStore.unsetMsAuditNonConfirmity();
  }

}

