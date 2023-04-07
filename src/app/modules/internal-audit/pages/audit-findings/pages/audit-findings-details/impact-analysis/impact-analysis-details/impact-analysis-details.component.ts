import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ImpactAnalysisService } from 'src/app/core/services/internal-audit/audit-findings/impact-analysis/impact-analysis.service';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { ImpactAnalysesStore } from 'src/app/stores/internal-audit/audit-findings/impact-analysis/impact-analysis-store';

@Component({
  selector: 'app-impact-analysis-details',
  templateUrl: './impact-analysis-details.component.html',
  styleUrls: ['./impact-analysis-details.component.scss']
})
export class ImpactAnalysisDetailsComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  ImpactAnalysesStore = ImpactAnalysesStore;
  AuditFindingsStore = AuditFindingsStore;
  constructor(private _impactAnalysisService: ImpactAnalysisService,
    private _router: Router,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "template":
            this._impactAnalysisService.generateTemplate(AuditFindingsStore.auditFindingId);
            break;
          case "export_to_excel":
            this._impactAnalysisService.exportToExcel(AuditFindingsStore.auditFindingId);
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.showPerformImpactAnalysispage();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })
    NoDataItemStore.setNoDataItems({title: "Looks like we don't have any impact analysis to show!", subtitle: 'Add an impact analysis if there is any. To add, simply tap the button below.', buttonText: 'Perform Impact Analysis'});
    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'template' },
      { type: 'export_to_excel' },
      { type: "close", path: "../" }

    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    // calling impact anaysis data
    this.getImpactAnalysis();
  }

  // calling impact analysis
  getImpactAnalysis(){

    this._impactAnalysisService.getItems(AuditFindingsStore.auditFindingId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  showPerformImpactAnalysispage(){
    this._router.navigateByUrl('/internal-audit/findings/'+AuditFindingsStore.auditFindingId+'/impact-analyses');
    this._utilityService.detectChanges(this._cdr);
  }

  editImpactAnalysis(){
    this._router.navigateByUrl('/internal-audit/findings/'+AuditFindingsStore.auditFindingId+'/impact-analyses')
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    ImpactAnalysesStore.loaded=false
  }

}

