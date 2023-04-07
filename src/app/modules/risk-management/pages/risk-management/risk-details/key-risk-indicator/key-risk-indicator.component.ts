import { Component, OnInit,ChangeDetectorRef,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { Router } from '@angular/router';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { KRI } from 'src/app/core/models/risk-management/risks/key-risk-indicators';
import { KRIStore } from 'src/app/stores/risk-management/risks/kri.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { KriService } from 'src/app/core/services/risk-management/risks/kri/kri.service';


declare var $: any;
@Component({
  selector: 'app-key-risk-indicator',
  templateUrl: './key-risk-indicator.component.html',
  styleUrls: ['./key-risk-indicator.component.scss']
})
export class KeyRiskIndicatorComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  RisksStore=RisksStore;
  KRIStore = KRIStore;
  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle:''
  };
  
  kriObject = {
    component: 'risk',
    values: null,
    type: null
  };

  AppStore = AppStore;
  AuthStore = AuthStore;
  deleteEventSubscription: any;
  BreadCrumbMenuItemStore =BreadCrumbMenuItemStore;
  closeKRIEventSubscription:any;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;

  closeRiskList = '/risk-management/risks';
  closeCorporateRisks = '/risk-management/corporate-risks';
  
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _risksService:RisksService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2:Renderer2,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _kriService:KriService
    ){}

  ngOnInit(): void {
    if (RisksStore.componentFrom == 'strategy_risk') {
      this.closeRiskList = '/strategy-management/risk-list';
      this.closeCorporateRisks = '/strategy-management/risk-list';
    }
    if(!RisksStore.riskId){
      this._router.navigateByUrl('/risk-management/risks');
    }
    NoDataItemStore.setNoDataItems({title: "no_kri_data", subtitle: 'no_kri_sub_data',buttonText: 'add_KRI'});
    
    
    this.reactionDisposer = autorun(() => {
     
   
     
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
     
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              
              this._utilityService.detectChanges(this._cdr);
              this.addNewItem();
            }, 1000);
            break;

          case "template":

              this._kriService.generateTemplate();
            break;
          case "export_to_excel":

            this._kriService.exportToExcel();
            break;
          case "search":
            KRIStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            KRIStore.searchText = '';
            KRIStore.loaded = false;
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._kriService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    AppStore.showDiscussion = false;

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.closeKRIEventSubscription = this._eventEmitterService.riskKRI.subscribe(item => {
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

    SubMenuItemStore.setNoUserTab(true);
    this.pageChange(1)
  }

  // addNewKRI(){
  //   this._utilityService.detectChanges(this._cdr);
  //   this.openFormModal();
  // }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  addNewItem(){
    this.kriObject.type = 'Add';
    this.kriObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  
  openFormModal() {
    setTimeout(() => {

      $(this.formModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999'); // For Modal to Get Focus
  
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999'); // For Modal to Get Focus
  
    this.kriObject.type = null;
  }


    /**
   * Get particular competency item
   * @param id  id of competency 
   */
     getKRI(id: number) {
      const kri: KRI = KRIStore.getKRIById(id);
      //set form value
      this.kriObject.values = {
        id: id,
        key_risk_indicator_id: kri.key_risk_indicator_id,
        risk_category_id:kri.risk_category_id,
        actual_exposure:kri.actual_exposure,
        predicted_exposure:kri.predicted_exposure,
        unit_id:kri.unit_id

        // competency_group_id: competency.competency_group_id,
        // description: competency.description ? competency.description : ''
      }
      this.kriObject.type = 'Edit';
      this.openFormModal();
    }

    /**
  * Delete the risk
  * @param id -risk id
  */
 delete(status) {
  if (status && this.deleteObject.id) {

    this._kriService.delete(this.deleteObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if (KRIStore.currentPage > 1) {
          KRIStore.currentPage = Math.ceil(KRIStore.totalItems / 15);
          this.pageChange(KRIStore.currentPage);
        }
      }, 500);
      this.clearDeleteObject();

    });
  }
  else {
    this.clearDeleteObject();
  }
  setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
  }, 250);

}

deleteKRI(id,position){
  this.deleteObject.id = id;
  this.deleteObject.position = position;
  this.deleteObject.type = '';
  this.deleteObject.subtitle = "delete_item_confirmation"

  $(this.deletePopup.nativeElement).modal('show');
}

clearDeleteObject() {

  this.deleteObject.id = null;

}


  


pageChange(newPage: number = null) {

  if (newPage) KRIStore.setCurrentPage(newPage);
  this._kriService.getItems().subscribe(res=>{
    if(KRIStore.loaded){
      if(RisksStore.individualRiskDetails?.is_corporate){
        var subMenuItems = [
          { activityName: 'RISK_KEY_RISK_INDICATOR_LIST', submenuItem: { type: 'search'} },
          {activityName: null, submenuItem: {type: 'refresh'}},
          { activityName: 'CREATE_RISK_KEY_RISK_INDICATOR', submenuItem: { type: 'new_modal' } },
          // { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
          { activityName: 'EXPORT_RISK_KEY_RISK_INDICATOR', submenuItem: { type: 'export_to_excel' } },
          // {activityName: 'IMPORT_RISK', submenuItem: {type: 'import'}},
          {activityName: null, submenuItem: {type: 'close',path:this.closeCorporateRisks}},
  
        ]
      }
      else{
        var subMenuItems = [
          { activityName: 'RISK_KEY_RISK_INDICATOR_LIST', submenuItem: { type: 'search'} },
          {activityName: null, submenuItem: {type: 'refresh'}},
          { activityName: 'CREATE_RISK_KEY_RISK_INDICATOR', submenuItem: { type: 'new_modal' } },
          // { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
          { activityName: 'EXPORT_RISK_KEY_RISK_INDICATOR', submenuItem: { type: 'export_to_excel' } },
          // {activityName: 'IMPORT_RISK', submenuItem: {type: 'import'}},
          {activityName: null, submenuItem: {type: 'close',path:this.closeRiskList}},
  
        ]
      }
    }
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    this._utilityService.detectChanges(this._cdr);
  })

}

setKRISort(type, callList: boolean = true) {
  this._kriService.sortKRIList(type);
}

ngOnDestory(){
  BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  NoDataItemStore.unsetNoDataItems();
  this.closeKRIEventSubscription.unsubscribe();
  this.deleteEventSubscription.unsubscribe();
  this.networkFailureSubscription.unsubscribe();
  this.idleTimeoutSubscription.unsubscribe();
  SubMenuItemStore.makeEmpty();
  KRIStore.unsetKRI();
  if (this.reactionDisposer) this.reactionDisposer();
}

}
