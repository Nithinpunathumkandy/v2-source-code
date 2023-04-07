import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { KpiManagementFileService } from 'src/app/core/services/kpi-management/file-service/kpi-management-file.service';
import { KpiScoreService } from 'src/app/core/services/kpi-management/kpi-score/kpi-score.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiScoreStore } from 'src/app/stores/kpi-management/kpi-score/kpi-score-store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  @ViewChild ('updateScoreModal') updateScoreModal: ElementRef;

  reactionDisposer: IReactionDisposer;

  AppStore = AppStore;
  AuthStore = AuthStore;
  KpiScoreStore = KpiScoreStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  updateScoreEventSubscription:any;

  popupScorueObject:any;
  crubPath:any;

  scoreModal:boolean=false;

  componeDistory:boolean=false;

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr:ChangeDetectorRef,
    private _utilityService:UtilityService,
    private _kpiScoreService: KpiScoreService,
    private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _documentFileService: DocumentFileService,
    private _kpiManagementFileService: KpiManagementFileService
  ) { }

  ngOnInit(): void {

    this.componeDistory=true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:this._helperService.translateToUserLanguage('kpis'),
      path:`/kpi-management/kpis`
    });

    RightSidebarLayoutStore.showFilter = false;

    this.reactionDisposer = autorun(() => {
      
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: null, buttonText: null });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._kpiScoreService.exportToExcel(`?kpi_management_kpi_ids=${KpisStore.kpiId}`);
          break;
          case "search":
            KpiScoreStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            KpiScoreStore.searchText = '';
            KpiScoreStore.loaded = false;
            this.pageChange(1);
          break;	
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.updateScoreOpenModal(null);
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    this.updateScoreEventSubscription = this._eventEmitterService.updateScoreModal.subscribe(res => {
      if(typeof res=="number" || res=="cancel" || res==false){
        this.updateCloseModal();          
      }else{
        this.updateCloseModal();
        KpiScoreStore.loaded=false;
        this.pageChange(1);
      }
    });

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) KpiScoreStore.setCurrentPage(newPage);
    this._kpiScoreService.getItems(false,`&kpi_management_kpi_ids=${KpisStore.kpiId}`).subscribe((res) => {
      if(KpiScoreStore?.loaded  && this.componeDistory){
        this.subMenu();
      }
      this._utilityService.detectChanges(this._cdr)
    });
  }

  subMenu(){
    let subMenuItems=[];
    if(KpiScoreStore.allItems.length > 0){
      subMenuItems = [
        {activityName: 'KPI_MANAGEMENT_KPI_SCORE_LIST', submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'EXPORT_KPI_MANAGEMENT_KPI_SCORE', submenuItem: {type: 'export_to_excel'}},
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];
    }else{
      subMenuItems = [
        {activityName: 'KPI_MANAGEMENT_KPI_SCORE_LIST', submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];
    }

    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
  }

  workFlowUpdateButtonDisable(row){
    //1. kpi stutas approved 
    //2. kpi score status not-updated and sent-back 
    //3. update button only responsible users and desgination all

    if(row.kpi_management_kpi_status=='approved'){
      if(row.kpi_management_kpi_score_status_type=='not-updated'|| row.kpi_management_kpi_score_status_type=='updated'|| row.kpi_management_kpi_score_status_type=='send-back'){
        if(row.kpi_responsible_user_ids){
          for(let i= 0; i<row.kpi_responsible_user_ids?.split(',').length;i++){

            if(row.kpi_responsible_user_ids.split(',')[i]==AuthStore.user?.id ){  
              return true;
            }
          }
        }
        
        if(row.kpi_designation_user_ids){
          for(let i= 0; i<row.kpi_designation_user_ids?.split(',').length;i++){
  
            if(row.kpi_designation_user_ids.split(',')[i]==AuthStore.user?.designation?.id ){ 
              return true;
            }
          }
        }

      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  updateScoreOpenModal(data){
    event.stopPropagation();
    
    this.scoreModal=true;
    this.popupScorueObject=data;
    this.crubPath={
      name:this._helperService.translateToUserLanguage('score'),
      path:`/kpi-management/kpis/${KpisStore.kpiId}/score`
    };
    setTimeout(() => {
      $(this.updateScoreModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  updateCloseModal(){
    this.scoreModal=false;
    $(this.updateScoreModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.popupScorueObject=null;
    this.crubPath=null;
  }

  createImageUrl(type,token) {
    if(type=='document-version'){
      return this._documentFileService.getThumbnailPreview(type, token);
    }else if(type=='kpi-document'){
      return this._kpiManagementFileService.getThumbnailPreview(type, token);
    }else{
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }

  getToken(doc){
    let token = null
    if(doc.kh_document){
      doc.kh_document.versions.map(data=>{
        if(data.is_latest){
          token = data
        }
      })
    }
    return token;
  }

  getDetails(id){
    KpiScoreStore.setKpiScoreId(id);
    this._router.navigateByUrl('kpi-management/kpi-scores/'+id);
    KpiScoreStore.setPath(`/kpi-management/kpis/${KpisStore.kpiId}/score`);
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:this._helperService.translateToUserLanguage('score'),
      path:`/kpi-management/kpis/${KpisStore.kpiId}/score`
    });
  }

  sortTitle(type: string) {
    this._kpiScoreService.sortList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    KpiScoreStore.unSetKpiScore();
    RightSidebarLayoutStore.showFilter = false;
    this.updateScoreEventSubscription.unsubscribe();
    this.componeDistory=false;

  }

}
