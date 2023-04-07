import { Component, OnInit,ChangeDetectorRef,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { AmFindingIAStore } from 'src/app/stores/audit-management/am-audit-finding/am-finding-ia.store';
import { AmAuditFindingIaService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding-ia/am-audit-finding-ia.service';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';

declare var $: any;

@Component({
  selector: 'app-am-audit-finding-ia',
  templateUrl: './am-audit-finding-ia.component.html',
  styleUrls: ['./am-audit-finding-ia.component.scss']
})
export class AmAuditFindingIaComponent implements OnInit {


  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AmAuditFindingStore=AmAuditFindingStore;
  AmFindingIAStore = AmFindingIAStore;
  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle:''
  };
  
  impactAnalysisObject = {
    component: 'am-audit',
    values: null,
    type: null
  };

  AppStore = AppStore;
  AuthStore = AuthStore;
  deleteEventSubscription: any;
  BreadCrumbMenuItemStore =BreadCrumbMenuItemStore;
  closeImpactAnalysisEventSubscription:any;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;
  impactCategoryId=null;
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2:Renderer2,
    private _impactAnalysisService:AmAuditFindingIaService
    ){}

  ngOnInit(): void {
    if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed')
    NoDataItemStore.setNoDataItems({title: "no_impact_analysis_data", subtitle: 'no_impact_analysis_sub_data',buttonText: 'add_impact_analyses'});
    else
    NoDataItemStore.setNoDataItems({title: "", subtitle: 'no_impact_analysis_data'});
   
    
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
            case "edit_modal":
              setTimeout(() => {
                this._utilityService.detectChanges(this._cdr);
                this.addNewItem();
              }, 1000);
              break;
  
          case "template":

              this._impactAnalysisService.generateTemplate();
            break;
          case "export_to_excel":

            this._impactAnalysisService.exportToExcel();
            break;
          case "search":
            AmFindingIAStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            AmFindingIAStore.searchText = '';
            AmFindingIAStore.loaded = false;
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
        this._impactAnalysisService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    this.closeImpactAnalysisEventSubscription = this._eventEmitterService.riskImpactAnalysis.subscribe(item => {
      this.pageChange();
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


  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  addNewItem(){
    this.impactAnalysisObject.type = 'Add';
    this.impactAnalysisObject.values = AmFindingIAStore.allItems?.data; // for clearing the value
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
  
    this.impactAnalysisObject.type = null;
  }

  getImpactAnalysis(id){
    this.impactAnalysisObject.type = 'edit';
    this.impactCategoryId=id;
    this.openFormModal();
  }


 delete(status) {
  if (status && this.deleteObject.id) {

    this._impactAnalysisService.delete(this.deleteObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if (AmFindingIAStore.currentPage > 1) {
          AmFindingIAStore.currentPage = Math.ceil(AmFindingIAStore.totalItems / 15);
          this.pageChange(AmFindingIAStore.currentPage);
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

deleteImpactAnalysis(id,position){
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

  if (newPage) AmFindingIAStore.setCurrentPage(newPage);
  this._impactAnalysisService.getAllItems().subscribe(res=>{
    if(AmFindingIAStore.loaded && res['data']?.length>0){
    
      if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'fieldwork'){
        if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed'){
          var subMenuItems = [
            { activityName: 'RISK_IMPACT_ANALYSIS_LIST', submenuItem: { type: 'search'} },
            {activityName: null, submenuItem: {type: 'refresh'}},
            { activityName: 'CREATE_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'edit_modal' } },
            { activityName: 'EXPORT_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'export_to_excel' } },
            {activityName: null, submenuItem: {type: 'close',path:'/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings'}},
    
          ]
        }
        else{
          var subMenuItems = [
            { activityName: 'RISK_IMPACT_ANALYSIS_LIST', submenuItem: { type: 'search'} },
            {activityName: null, submenuItem: {type: 'refresh'}},
            { activityName: 'EXPORT_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'export_to_excel' } },
            {activityName: null, submenuItem: {type: 'close',path:'/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings'}},
    
          ]
        }
       
      }
      else if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'finding'){

        if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed'){
        var subMenuItems = [
          { activityName: 'RISK_IMPACT_ANALYSIS_LIST', submenuItem: { type: 'search'} },
          {activityName: null, submenuItem: {type: 'refresh'}},
          { activityName: 'CREATE_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'edit_modal' } },
          { activityName: 'EXPORT_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'export_to_excel' } },
          {activityName: null, submenuItem: {type: 'close',path:'/audit-management/am-audit-findings'}},
  
        ]
      }
      else{
        var subMenuItems = [
          { activityName: 'RISK_IMPACT_ANALYSIS_LIST', submenuItem: { type: 'search'} },
          {activityName: null, submenuItem: {type: 'refresh'}},
          { activityName: 'EXPORT_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'export_to_excel' } },
          {activityName: null, submenuItem: {type: 'close',path:'/audit-management/am-audit-findings'}},
  
        ]
      }
      }
      else{
        var subMenuItems = [
          { activityName: 'RISK_IMPACT_ANALYSIS_LIST', submenuItem: { type: 'search'} },
          {activityName: null, submenuItem: {type: 'refresh'}},
          { activityName: 'EXPORT_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'export_to_excel' } },
          {activityName: null, submenuItem: {type: 'close',path:'/audit-management/am-audit-findings'}},
  
        ]
      }
      
     
    }

    else if(AmFindingIAStore.loaded && res['data']?.length==0){
      if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'fieldwork'){
        if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed'){
        var subMenuItems = [
          { activityName: 'CREATE_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'new_modal' } },
          {activityName: null, submenuItem: {type: 'close',path:'/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings'}},
  
        ]
      }
      else{
        subMenuItems = [
          {activityName: null, submenuItem: {type: 'close',path:'/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings'}},
  
        ]
      }
      }

      else if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'finding'){
        if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed'){
        var subMenuItems = [
          { activityName: 'CREATE_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'new_modal' } },
          {activityName: null, submenuItem: {type: 'close',path:'/audit-management/am-audit-findings'}},
  
        ]
      }
      else{
        subMenuItems = [
          {activityName: null, submenuItem: {type: 'close',path:'/audit-management/am-audit-findings'}},
  
        ]
      }
      }
      else{
        subMenuItems = [

          {activityName: null, submenuItem: {type: 'close',path:'/audit-management/am-audit-findings'}},
  
        ]
      }
      
     
    }
    

    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    this._utilityService.detectChanges(this._cdr);
  })

}

  /**
   * changing the number of days in to month and years
   * @param days -number of days
   */
   createDaysString(days) {
    return this._helperService.daysConversion(days);
  }

setImpactAnalysisSort(type, callList: boolean = true) {
  this._impactAnalysisService.sortImpactAnalysisList(type);
}

ngOnDestory(){
  if (this.reactionDisposer) this.reactionDisposer();
  BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  NoDataItemStore.unsetNoDataItems();
  this.closeImpactAnalysisEventSubscription.unsubscribe();
  this.deleteEventSubscription.unsubscribe();
  this.networkFailureSubscription.unsubscribe();
  this.idleTimeoutSubscription.unsubscribe();
  this.impactCategoryId = null
  SubMenuItemStore.makeEmpty();
  AmFindingIAStore.unsetImpactAnalysis();
}


}
