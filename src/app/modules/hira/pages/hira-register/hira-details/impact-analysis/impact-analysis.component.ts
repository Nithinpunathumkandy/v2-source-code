import { Component, OnInit,ChangeDetectorRef,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { Router } from '@angular/router';
import { HiraService } from 'src/app/core/services/hira/hira/hira.service';
import { RisksStore } from 'src/app/stores/hira/hira/hira.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ImpactAnalysisStore } from 'src/app/stores/hira/hira/impact-analysis.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImpactAnalysisService } from 'src/app/core/services/hira/hira/impact-analysis/impact-analysis.service';

declare var $: any;

@Component({
  selector: 'app-impact-analysis',
  templateUrl: './impact-analysis.component.html',
  styleUrls: ['./impact-analysis.component.scss']
})
export class ImpactAnalysisComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  RisksStore=RisksStore;
  ImpactAnalysisStore = ImpactAnalysisStore;
  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle:''
  };
  
  impactAnalysisObject = {
    component: 'risk',
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
    private _router: Router,
    private _hiraService:HiraService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2:Renderer2,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _impactAnalysisService:ImpactAnalysisService) { }

    ngOnInit(): void {
      NoDataItemStore.setNoDataItems({title: "no_impact_analysis_data", subtitle: 'no_impact_analysis_sub_data',buttonText: 'add_impact_analyses'});
      
      
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
              ImpactAnalysisStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
            case "refresh":
              SubMenuItemStore.searchText = '';
              ImpactAnalysisStore.searchText = '';
              ImpactAnalysisStore.loaded = false;
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
  
    // addNewImpactAnalysis(){
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
      this.impactAnalysisObject.type = 'Add';
      this.impactAnalysisObject.values = ImpactAnalysisStore.allItems?.data; // for clearing the value
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
      // console.log(this.impactAnalysisObject.values);
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
  
  
      /**
     * Get particular competency item
     * @param id  id of competency 
     */
      //  getImpactAnalysis(id: number) {
      //   const impactAnalysis: ImpactAnalysis = ImpactAnalysisStore.getImpactAnalysisById(id);
      //   //set form value
      //   this.impactAnalysisObject.values = {
      //     id: id,
          // impact_analysis_id: impactAnalysis.impact_analysis_id,
          // risk_category_id:impactAnalysis.risk_category_id,
          // actual_exposure:impactAnalysis.actual_exposure,
          // predicted_exposure:impactAnalysis.predicted_exposure,
          // unit_id:impactAnalysis.unit_id
  
          // competency_group_id: competency.competency_group_id,
          // description: competency.description ? competency.description : ''
      //   }
      //   this.impactAnalysisObject.type = 'Edit';
      //   this.openFormModal();
      // }
  
      /**
    * Delete the risk
    * @param id -risk id
    */
   delete(status) {
    if (status && this.deleteObject.id) {
  
      this._impactAnalysisService.delete(this.deleteObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if (ImpactAnalysisStore.currentPage > 1) {
            ImpactAnalysisStore.currentPage = Math.ceil(ImpactAnalysisStore.totalItems / 15);
            this.pageChange(ImpactAnalysisStore.currentPage);
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
  
    if (newPage) ImpactAnalysisStore.setCurrentPage(newPage);
    this._impactAnalysisService.getAllItems().subscribe(res=>{
      if(ImpactAnalysisStore.loaded && res['data']?.length>0){
        if(RisksStore.individualRiskDetails?.is_corporate){
          var subMenuItems = [
            { activityName: 'RISK_IMPACT_ANALYSIS_LIST', submenuItem: { type: 'search'} },
            {activityName: null, submenuItem: {type: 'refresh'}},
            { activityName: 'CREATE_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'edit_modal' } },
            // { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
            { activityName: 'EXPORT_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'export_to_excel' } },
            // {activityName: 'IMPORT_RISK', submenuItem: {type: 'import'}},
            {activityName: null, submenuItem: {type: 'close',path:'/risk-management/corporate-risks'}},
    
          ]
        }
        else{
          var subMenuItems = [
            { activityName: 'RISK_IMPACT_ANALYSIS_LIST', submenuItem: { type: 'search'} },
            {activityName: null, submenuItem: {type: 'refresh'}},
            { activityName: 'CREATE_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'edit_modal' } },
            // { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
            { activityName: 'EXPORT_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'export_to_excel' } },
            // {activityName: 'IMPORT_RISK', submenuItem: {type: 'import'}},
            {activityName: null, submenuItem: {type: 'close',path:'/risk-management/risks'}},
    
          ]
        }
       
      }
  
      else if(ImpactAnalysisStore.loaded && res['data']?.length==0){
        if(RisksStore.individualRiskDetails?.is_corporate){
          var subMenuItems = [
            { activityName: 'RISK_IMPACT_ANALYSIS_LIST', submenuItem: { type: 'search'} },
            { activityName: 'CREATE_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'new_modal' } },
            // { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
            { activityName: 'EXPORT_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'export_to_excel' } },
            // {activityName: 'IMPORT_RISK', submenuItem: {type: 'import'}},
            {activityName: null, submenuItem: {type: 'close',path:'/risk-management/corporate-risks'}},
    
          ]
        }
        else{
          var subMenuItems = [
            { activityName: 'RISK_IMPACT_ANALYSIS_LIST', submenuItem: { type: 'search'} },
            { activityName: 'CREATE_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'new_modal' } },
            // { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
            { activityName: 'EXPORT_RISK_IMPACT_ANALYSIS', submenuItem: { type: 'export_to_excel' } },
            // {activityName: 'IMPORT_RISK', submenuItem: {type: 'import'}},
            {activityName: null, submenuItem: {type: 'close',path:'/risk-management/risks'}},
    
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
    ImpactAnalysisStore.unsetImpactAnalysis();
  }

}
