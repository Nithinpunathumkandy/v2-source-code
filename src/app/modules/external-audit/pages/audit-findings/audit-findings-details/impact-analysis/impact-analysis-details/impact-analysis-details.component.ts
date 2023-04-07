import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { ImpactAnalysisService } from 'src/app/core/services/external-audit/impact-analysis/impact-analysis.service';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
import { ImpactAnalysesMasterStore } from 'src/app/stores/external-audit/impact-analysis/impact-analysis-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from '@angular/router';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";

@Component({
  selector: 'app-impact-analysis-details',
  templateUrl: './impact-analysis-details.component.html',
  styleUrls: ['./impact-analysis-details.component.scss']
})
export class ImpactAnalysisDetailsComponent implements OnInit, OnDestroy {
 
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  ImpactAnalysesMasterStore = ImpactAnalysesMasterStore;
  FindingMasterStore = FindingMasterStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  constructor( private _impactAnalysisService: ImpactAnalysisService,
    private _router:Router,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          // case "template":
          //   this._impactAnalysisService.generateTemplate(FindingMasterStore.auditFindingId);
          //   break;
          case "export_to_excel":
            this._impactAnalysisService.exportToExcel(FindingMasterStore.auditFindingId);
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
        this.switchToPerformImpactAnalysisPage();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })
    NoDataItemStore.setNoDataItems({title: "Looks like we don't have any impact analysis to show!", subtitle: 'Add an impact analysis if there is any. To add, simply tap the button below.', buttonText: 'Perform Impact Analysis'});

    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type:'go_to_audit'},
      // { type: 'template' },
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

    this._impactAnalysisService.getItems(FindingMasterStore.auditFindingId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  switchToPerformImpactAnalysisPage(){
    this._router.navigateByUrl('/external-audit/audit-findings/'+FindingMasterStore.auditFindingId+'/impact-analyses');
  }

  gotoAuditPage(){
    this._router.navigateByUrl(`/external-audit/external-audit/${FindingMasterStore.ea_audit_id}`)
  }

  editImpactAnalysis(){
    this._router.navigateByUrl('/external-audit/audit-findings/'+FindingMasterStore.auditFindingId+'/impact-analyses');
  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title;
    userDetial['image_token'] = users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;

  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;

  }

}
