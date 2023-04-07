import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { AuditProgramSummaryReportService } from 'src/app/core/services/ms-audit-management/program-summary-report/audit-program-summary-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditProgramSummaryReportStore } from 'src/app/stores/ms-audit-management/audit-program-summary-report/audit-program-summary-report.store';
import { AnnualSummaryStore } from 'src/app/stores/ms-audit-management/ms-audit-annual-summary/ms-audit-annual-summary.store';
declare var $:any;
@Component({
  selector: 'app-summary-report-list',
  templateUrl: './summary-report-list.component.html',
  styleUrls: ['./summary-report-list.component.scss']
})
export class SummaryReportListComponent implements OnInit {
@ViewChild('chooseAuditProgram') chooseAuditProgram : ElementRef;

 list = [
   {
     title : '1st gen report',
     refNo : 12223,
     created_by : null
   }
 ]
 AppStore = AppStore
 AuditProgramSummaryReportStore = AuditProgramSummaryReportStore
 chooseProgamObject = {
  type : null,
  value : null,
  slectedIds : []
}
 reactionDisposer: IReactionDisposer;
  controlMsAuditProgamListSubscriptionEvent: any;
  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,   
    private _helperService: HelperServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _eventEmitterService : EventEmitterService,
    private _reportService : AuditProgramSummaryReportService,
    ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_ms_audit_annula_report'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'MS_AUDIT_CHECKLIST_LIST', submenuItem: { type: 'search' } },
        { activityName: null, submenuItem: {type: 'refresh'}},
        { activityName: 'CREATE_MS_AUDIT_CHECKLIST', submenuItem: { type: 'new_modal' } },
        //{ activityName: '', submenuItem: { type: 'export_to_excel' } },
      ]

      if (!AuthStore.getActivityPermission(100, 'CREATE_TEAM')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.chooseAuditProgramModal();
            }, 200);
            break;
          case "template":
            // this._msAuditCheckLIstService.generateTemplate();
            break;
          case "export_to_excel":
            this._reportService.exportToExcel();
            break;
            case "search":
              AnnualSummaryStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1); 
              break;
              case 'refresh':
                AnnualSummaryStore.loaded = false
                this.pageChange(1); 
                break
          case "share":
            // ShareItemStore.setTitle('share_teams');
            // ShareItemStore.formErrors = {};
            break;
          case "import":
            // ImportItemStore.setTitle('import_teams');
            // ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
         this.chooseAuditProgramModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      
    })

    this.controlMsAuditProgamListSubscriptionEvent = this._eventEmitterService.chooseAuditProgramModal.subscribe(res => {
      this.closeAuditProgramModal();
      this.pageChange(1)
    })
    this.pageChange(1)
  }

  getDetails(id){
  
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditProgramSummaryReportStore.setCurrentPage(newPage);
    this._reportService.getItems(false,null).subscribe(() => {;
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  chooseAuditProgramModal(){
    this.chooseProgamObject.type = 'Add';
    this.chooseProgamObject.value = null;
    this._utilityService.detectChanges(this._cdr);
    this.openAuditProgramModal();
  }

  openAuditProgramModal(){
    setTimeout(() => {
      $(this.chooseAuditProgram.nativeElement).modal('show');
      this._renderer2.setStyle(this.chooseAuditProgram.nativeElement,'display','block');
      this._renderer2.setStyle(this.chooseAuditProgram.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.chooseAuditProgram.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);

    }, 100);
  }

  closeAuditProgramModal(){
    $(this.chooseAuditProgram.nativeElement).modal('hide');
    this.chooseProgamObject.type = null;
    this.chooseProgamObject.slectedIds = []
    this._renderer2.setStyle(this.chooseAuditProgram.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.chooseAuditProgram.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.chooseAuditProgram.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  goToReportDetails(id){
      // MsAuditProgramsStore.setMsAuditProgramsId(id);
      this._router.navigateByUrl('ms-audit-management/audit-program-annual-summary-reports/' + id);
  }

  edit(id:number){
    this._reportService.getItem(id).subscribe(res=>{
      this.chooseProgamObject.type = 'Edit';
      this.chooseProgamObject.value = res;
      this.openAuditProgramModal();
      this._utilityService.detectChanges(this._cdr)
    })
  }

  sortTitle(title){

  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.controlMsAuditProgamListSubscriptionEvent.unsubscribe()
  }

}
