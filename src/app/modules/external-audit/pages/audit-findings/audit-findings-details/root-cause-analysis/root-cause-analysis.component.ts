import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RootCauseAnalysisService } from 'src/app/core/services/external-audit/root-cause-analysis/root-cause-analysis.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import {RCAMasterStore} from 'src/app/stores/external-audit/root-cause-analysis/root-cause-analysis-store';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RootCauseAnalysis } from 'src/app/core/models/external-audit/root-cause-analysis/root-cause-analysis';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';


declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root-cause-analysis',
  templateUrl: './root-cause-analysis.component.html',
  styleUrls: ['./root-cause-analysis.component.scss']
})
export class RootCauseAnalysisComponent implements OnInit , OnDestroy {
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
  FindingMasterStore = FindingMasterStore;
  RCAMasterStore = RCAMasterStore;

  AppStore = AppStore;
  AuthStore = AuthStore;
  
  addRCASubscriptionEvent: any;

  rcaRootCauseCategoryChildCloseEvent: any;
  rcaRootCauseSubCategoryChildEvent: any;
  lastItem:any;
  popupControlAuditableEventSubscription: any;

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _renderer2: Renderer2,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _rcaService: RootCauseAnalysisService,
    private _helperService: HelperServiceService,
    private _router:Router) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          // case "template":
          //   this._rcaService.generateTemplate(FindingMasterStore.auditFindingId);
          //   break;
          case "export_to_excel":
            this._rcaService.exportToExcel(FindingMasterStore.auditFindingId);
            break;

          case "go_to_audit":
            this.gotoAuditPage()
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
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_start_RCA'});


    // for closing the modal
    this.addRCASubscriptionEvent = this._eventEmitterService.IAfindingsRcaModalControl.subscribe(res => {
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


    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.addRCAformModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.addRCAformModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.addRCAformModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.addRCAformModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.addRCAformModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.addRCAformModal.nativeElement,'overflow','auto');
      }
    })


    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type:'go_to_audit'},
      // { type: 'template' },
      { type: 'export_to_excel'},
      { type: "close", path: "../" }

    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.pageChange(1);
  }

  // page change event
  pageChange(newPage: number = null) {
    this.lastItem = null;
    var lastWhy = null;
    if (newPage) RCAMasterStore.setCurrentPage(newPage);
    this._rcaService.getItems(FindingMasterStore.auditFindingId).subscribe(res=>{
      lastWhy = RCAMasterStore.allItems[RCAMasterStore.allItems.length-1];
      this.lastItem = lastWhy?.why;
      this._utilityService.detectChanges(this._cdr);
    });
   
   
  }

  gotoAuditPage(){
    this._router.navigateByUrl(`/external-audit/external-audit/${FindingMasterStore.ea_audit_id}`)
  }

  // for opening modal
  openFormModal() {
    FindingMasterStore.rcaDataLength = null;
    FindingMasterStore.rcaDataLength = RCAMasterStore.allItems.length;
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
    this.rcaAddObject.type = 'add';
    this.openFormModal();

  }

  editRCA(id:number){
    const rca: RootCauseAnalysis = RCAMasterStore.getRCAById(id);
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
      this._rcaService.delete(FindingMasterStore.auditFindingId, this.popupObject.id).subscribe(res=>{
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

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addRCASubscriptionEvent.unsubscribe();
    this.rcaRootCauseCategoryChildCloseEvent.unsubscribe();
    this.popupControlAuditableEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.rcaRootCauseSubCategoryChildEvent.unsubscribe();

  }


}
