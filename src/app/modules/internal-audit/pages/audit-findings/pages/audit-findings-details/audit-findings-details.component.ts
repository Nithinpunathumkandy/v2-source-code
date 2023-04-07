import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubMenuItem } from 'src/app/core/models/general/sub-menu.model';
import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { CorrectiveActionsStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-store';
import { ImpactAnalysesStore } from 'src/app/stores/internal-audit/audit-findings/impact-analysis/impact-analysis-store';
import { RCAStore } from 'src/app/stores/internal-audit/audit-findings/root-cause-analysis/root-cause-analysis-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-audit-findings-details',
  templateUrl: './audit-findings-details.component.html',
  styleUrls: ['./audit-findings-details.component.scss']
})
export class AuditFindingsDetailsComponent implements OnInit {

  AppStore = AppStore;
  AuditFindingsStore = AuditFindingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  constructor(private _auditFindingsService: AuditFindingsService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _utilityService: UtilityService,) { }


  ngOnInit(): void {
 // getting details
  let id: number;
  this.route.params.subscribe(params => {
    id = +params['id']; // (+) converts string 'id' to a number
  });
  this._auditFindingsService.getItem(id).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
  this._auditFindingsService.saveAuditFindingId(id);
  }

  // getAuditFindingsDetails(){}

  checkItemPresent(item) {
		if (SubMenuItemStore.subMenuItems) {
			for (let i of SubMenuItemStore.subMenuItems) {
				if (i.type == item) {
					return true;
				}
			}
			return false;
		}
		else
			return false;
	}

	returnItem(item) {
		if (SubMenuItemStore.subMenuItems) {
			for (let i of SubMenuItemStore.subMenuItems) {
				if (i.type == item) {
					return i;
				}
			}
		}
	}

  itemClicked(item: SubMenuItem) {
	
		if (item.type == 'export_to_excel')
			SubMenuItemStore.exportClicked = true;
		else if (item.type == 'import')
			SubMenuItemStore.importClicked = true;
		else (item.type == 'template')
			SubMenuItemStore.templateClicked = true;
		

		SubMenuItemStore.setClickedSubMenuItem(item);
	}
 
  ngOnDestroy(){
    AuditFindingsStore.unsetIndividualAuditFindingItem();
    RCAStore.unsetRCA();
    ImpactAnalysesStore.unsetAllImpactAnalyses();
    CorrectiveActionsStore.unsetCorrectiveActions();
    CorrectiveActionsStore.unsetSelectedItemDetails();


  }

}
