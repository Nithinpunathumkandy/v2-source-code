import { Component, OnInit,ChangeDetectorRef,ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RootCauseAnalysis } from 'src/app/core/models/external-audit/root-cause-analysis/root-cause-analysis';
import { CyberIncidentRCAStore } from 'src/app/stores/cyber-incident/cyber-incident-rca-store';
import { CyberIncidentRcaService } from 'src/app/core/services/cyber-incident/cyber-incident-rca/cyber-incident-rca.service';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
declare var $: any;
@Component({
  selector: 'app-rca',
  templateUrl: './rca.component.html',
  styleUrls: ['./rca.component.scss']
})
export class RcaComponent implements OnInit,OnDestroy {
  @ViewChild('addRCAformModal', { static: true }) addRCAformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  rcaAddObject = {
    type:null,
    values:null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  NoDataItemStore=NoDataItemStore;
  CyberIncidentRCAStore=CyberIncidentRCAStore;
  CyberIncidentStore=CyberIncidentStore;

  AppStore = AppStore;
  AuthStore = AuthStore;
  
  addRCASubscriptionEvent: any;

  rcaRootCauseCategoryChildCloseEvent: any;
  rcaRootCauseSubCategoryChildEvent: any;
  lastItem:any;
  popupControlAuditableEventSubscription: any;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _imageService:ImageServiceService,
    private _helperService: HelperServiceService,
    private _cyberIncidentRcaService:CyberIncidentRcaService
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
            this.addRCA();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addRCA();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_start_RCA'}); // for closing the modal
    this.addRCASubscriptionEvent = this._eventEmitterService.cyberIncidentRcaModalControl.subscribe(res => {
      this.closeFormModal();
    })

    this.rcaRootCauseCategoryChildCloseEvent = this._eventEmitterService.rcaRootCausechild.subscribe(res=>{
      this.setModalstyle();
    })

    this.rcaRootCauseSubCategoryChildEvent = this._eventEmitterService.rcaRootCauseSubChild.subscribe(res=>{
      this.setModalFocus();
    })
    // for deleting/activating/deactivating using delete modal
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    SubMenuItemStore.setSubMenuItems([
      { type: 'new_modal'},
      { type: "close", path: "../" }

    ]);
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    this.lastItem = null;
    var lastWhy = null;
    if (newPage) CyberIncidentRCAStore.setCurrentPage(newPage);
    this._cyberIncidentRcaService.getItems(CyberIncidentStore.incidentId).subscribe(res=>{
      lastWhy = CyberIncidentRCAStore.allItems[CyberIncidentRCAStore.allItems.length-1];
      this.lastItem = lastWhy?.why;
      this._utilityService.detectChanges(this._cdr);
    });
  
  }

  openFormModal() {
    CyberIncidentRCAStore.rcaDataLength = null;
    CyberIncidentRCAStore.rcaDataLength = CyberIncidentRCAStore.allItems.length;
    setTimeout(() => {
      $(this.addRCAformModal.nativeElement).modal('show');
    }, 50);
  }
  // for closing the rca form modal
  closeFormModal() {
    setTimeout(() => {
      $(this.addRCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
      
    }, 50);
    this.rcaAddObject.type = null;
    this.rcaAddObject.values = null;
    this.pageChange();
  }

  setModalstyle(){
    setTimeout(() => {
    this._renderer2.setStyle(this.addRCAformModal.nativeElement,'z-index','999999'); // For Modal to Get Focus
      this._renderer2.setStyle(this.addRCAformModal.nativeElement,'overflow','auto');
    }, 50);
  }

  setModalFocus(){
    setTimeout(() => {
      this._renderer2.setStyle(this.addRCAformModal.nativeElement,'z-index','999999'); // For Modal to Get Focus
        this._renderer2.setStyle(this.addRCAformModal.nativeElement,'overflow','auto');
      }, 50);
  }
  // for opening rca add form modal
  addRCA() {
    if(CyberIncidentStore?.cyberIncidentDetails?.cyber_incident_status?.type!='closed')
    {
      this.rcaAddObject.type = 'add';
      this.openFormModal();
    }
    else
    {
      this._utilityService.showWarningMessage('warning','cyber_incident_closed')
    }
    

  }


  editRCA(id:number){
    const rca: RootCauseAnalysis = CyberIncidentRCAStore.getRCAById(id);
    //set form value
    this.rcaAddObject.values = {
      id: rca.id,
      root_cause_category_id: rca.root_cause_category_id,
      root_cause_sub_category_id: rca.root_cause_sub_category_id,
      why: rca.why,
      description: rca.description
    }
    this.rcaAddObject.type = 'Edit';
    this.openFormModal();
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'are_you_sure': this.deleteRCA(status)
        break;
      }
    }

    // delete function call
    deleteRCA(status: boolean) {

    if (status && this.popupObject.id) {
      this._cyberIncidentRcaService.delete(CyberIncidentStore.incidentId, this.popupObject.id).subscribe(res=>{
        this.pageChange();
        this._utilityService.detectChanges(this._cdr);
      });
    
    } 
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  
   
  }



  delete(id:number){
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete RCA?';
    this.popupObject.subtitle = 'ea_delete_rca_sub_title';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addRCASubscriptionEvent.unsubscribe();
    this.rcaRootCauseCategoryChildCloseEvent.unsubscribe();
    this.popupControlAuditableEventSubscription.unsubscribe();
  }

}
