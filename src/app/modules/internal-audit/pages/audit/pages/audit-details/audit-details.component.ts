import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubMenuItem } from 'src/app/core/models/general/sub-menu.model';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { AuditSchedulesStore } from 'src/app/stores/internal-audit/audit-schedule/audit-schedule-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';

@Component({
  selector: 'app-audit-details',
  templateUrl: './audit-details.component.html',
  styleUrls: ['./audit-details.component.scss']
})
export class AuditDetailsComponent implements OnInit {

  AuditStore = AuditStore;
  AppStore =AppStore;
  constructor( private route: ActivatedRoute,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _auditService: AuditService) { }

  ngOnInit(): void {
    console.log("Check")
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
    this.getAuditDetails(id);
    sessionStorage.auditId=id;
    })
  }

  getAuditDetails(id){
      this._auditService.getItem(id).subscribe(res => {
        AuditStore.auditProgramId=res.audit_plan.audit_program_id
        this._utilityService.detectChanges(this._cdr);
        this._auditService.setAuditReportId(res?.audit_report?.id);
      });
      this._auditService.setAuditId(id);
  }

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
		else if (item.type == 'template')
			SubMenuItemStore.templateClicked = true;
		else if (item.type == 'mark_audited')
			SubMenuItemStore.markAuditClicked = true;
		else  (item.type == 'un_mark_audited')
			SubMenuItemStore.unmarkAuditClicked = true;

		SubMenuItemStore.setClickedSubMenuItem(item);
	}

  ngOnDestroy(){
    AuditStore.unsetIndividualAudit();
    AuditSchedulesStore.unsetAllAuditSChedules();
    AuditFindingsStore.unsetFindings();
    
  }
}
