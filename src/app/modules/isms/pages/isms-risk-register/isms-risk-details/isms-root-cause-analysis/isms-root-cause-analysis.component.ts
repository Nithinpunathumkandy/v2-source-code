import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
// import { IsmsRCAStore } from 'src/app/stores/risk-management/risks/rca-risk.store';
// import { IsmsRisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { RootCauseAnalysis } from 'src/app/core/models/risk-management/risks/root-cause-analyses';
// import { RootCauseAnalysesService } from 'src/app/core/services/risk-management/risks/root-cause-analyses/root-cause-analyses.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { IsmsRCAStore } from 'src/app/stores/isms/isms-risks/isms-rca-risk.store';
import { IsmsRootCauseAnalysisService } from 'src/app/core/services/isms/isms-risks/isms-root-cause-analysis/isms-root-cause-analysis.service';
// import { IsmsRouteCauseAnalysisService } from 'src/app/core/services/isms/isms-risks/isms-root-cause-analysis/isms-route-cause-analysis.service';


@Component({
  selector: 'app-isms-root-cause-analysis',
  templateUrl: './isms-root-cause-analysis.component.html',
  styleUrls: ['./isms-root-cause-analysis.component.scss']
})
export class IsmsRootCauseAnalysisComponent implements OnInit {

  @ViewChild('addRCAformModal', { static: true }) addRCAformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  rcaAddObject = {
    component:'isms',
    type:null,
    values:null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  rcaRootCauseCategoryChildCloseEvent: any;
  rcaRootCauseSubCategoryChildEvent: any;
  lastItem:any;
  popupControlRiskEventSubscription: any;
  addRCASubscriptionEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  IsmsRisksStore=IsmsRisksStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  IsmsRCAStore = IsmsRCAStore;
  AppStore = AppStore;
  AuthStore = AuthStore;


  constructor(
    private _rootCauseAnalysesService:IsmsRootCauseAnalysisService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _renderer2: Renderer2,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _helperService:HelperServiceService
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_start_RCA'});

    this.reactionDisposer = autorun(() => {

       // setting submenu items
    if(IsmsRisksStore.individualRiskDetails?.is_corporate){
      var subMenuItems = [
        // { activityName: 'CREATE_ISMS_RISK_TREATMENT', submenuItem: { type: 'new_modal' } },
        // { activityName: null, submenuItem: { type: 'template' } },
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
      ]
    }
    else{
      var subMenuItems = [
        // { activityName: 'CREATE_ISMS_RISK_TREATMENT', submenuItem: { type: 'new_modal' } },
        // { activityName: null, submenuItem: { type: 'template' } },
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
      ]
    }
    this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
   
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "template":
            this._rootCauseAnalysesService.generateTemplate(IsmsRisksStore.riskId);
            break;
          case "export_to_excel":
            this._rootCauseAnalysesService.exportToExcel(IsmsRisksStore.riskId);
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
  
     //for closing the modal
     this.addRCASubscriptionEvent = this._eventEmitterService.riskRcaModalControl.subscribe(res => {
       this.closeFormModal();
     })

     this.rcaRootCauseCategoryChildCloseEvent = this._eventEmitterService.rcaRootCausechild.subscribe(res=>{
       this.setModalstyle();
     })

     this.rcaRootCauseSubCategoryChildEvent = this._eventEmitterService.rcaRootCauseSubChild.subscribe(res=>{
       this.setModalFocus();
     })
    // for deleting/activating/deactivating using delete modal
     this.popupControlRiskEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
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


   

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.pageChange(1);
  }

  // page change event
  pageChange(newPage: number = null) {
    this.lastItem = null;
    var lastWhy = null;
    if (newPage) IsmsRCAStore.setCurrentPage(newPage);
    this._rootCauseAnalysesService.getItems(IsmsRisksStore.riskId).subscribe(res=>{
      lastWhy = IsmsRCAStore.allItems[IsmsRCAStore.allItems.length-1];
      this.lastItem = lastWhy?.why;
      this._utilityService.detectChanges(this._cdr);
    });
   
   
  }

  // for opening modal
   openFormModal() {
     IsmsRisksStore.rcaDataLength = null;
     IsmsRisksStore.rcaDataLength = IsmsRCAStore.allItems.length;
     setTimeout(() => {
       ($(this.addRCAformModal.nativeElement)as any).modal('show');
     }, 50);
   }
  // for closing the rca form modal
   closeFormModal() {
     setTimeout(() => {
       ($(this.addRCAformModal.nativeElement)as any).modal('hide');
       this._utilityService.detectChanges(this._cdr);
      
     }, 50);
     this.rcaAddObject.type = null;
     this.rcaAddObject.values = null;
     this.pageChange();
   }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users.first_name;
    userDetial['last_name'] = users.last_name;
    userDetial['designation'] = users.designation;
    userDetial['image_token'] = users.image.token;
    userDetial['email'] = users.email;
    userDetial['mobile'] = users.mobile;
    userDetial['id'] = users.id;
    userDetial['department'] = users.department;
    userDetial['status_id'] = users.status_id? users.status_id:users.status.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;

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

  // openFormModal() {
  //   //AuditFindingsStore.rcaDataLength = null;
  //   //AuditFindingsStore.rcaDataLength = IsmsRCAStore.allItems.length;
  //   setTimeout(() => {
  //     ($(this.addRCAformModal.nativeElement)as any).modal('show');
  //   }, 50);
  // }

  editRCA(id:number){
    const rca: RootCauseAnalysis = IsmsRCAStore.getRCAById(id);
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
      case '': this.deleteRCA(status)
        break;
      }
    }

    // delete function call
    deleteRCA(status: boolean) {

    if (status && this.popupObject.id) {
      this._rootCauseAnalysesService.delete(IsmsRisksStore.riskId, this.popupObject.id).subscribe(res=>{
        this.pageChange();
        this._utilityService.detectChanges(this._cdr);
      });
    
    } 
    setTimeout(() => {
      ($(this.confirmationPopUp.nativeElement) as any).modal('hide');
    }, 250);
  
   
  }



  delete(id:number){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete RCA?';
    this.popupObject.subtitle = 'delete_rca_sub_title';

    ($(this.confirmationPopUp.nativeElement) as any).modal('show');
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
    this.popupControlRiskEventSubscription.unsubscribe();
     this.addRCASubscriptionEvent.unsubscribe();
     this.rcaRootCauseCategoryChildCloseEvent.unsubscribe();
    // this.popupControlAuditableEventSubscription.unsubscribe();
     this.idleTimeoutSubscription.unsubscribe();
     this.networkFailureSubscription.unsubscribe();

  }


}
