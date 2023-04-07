import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AmAuditFindingService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';

@Component({
  selector: 'app-am-field-work-finding-details',
  templateUrl: './am-field-work-finding-details.component.html',
  styleUrls: ['./am-field-work-finding-details.component.scss']
})
export class AmFieldWorkFindingDetailsComponent implements OnInit {
  AmAuditFindingStore = AmAuditFindingStore;
  AppStore = AppStore;
  AmAuditFieldWorkStore = AmAuditFieldWorkStore;
  constructor(private _route:ActivatedRoute,
    private _auditFindingService:AmAuditFindingService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getDetails();

  }

  getDetails() {

    let id: number;
    this._route.params.subscribe(params => {
      id = +params['finding_id']; // (+) converts string 'id' to a number
      this._auditFindingService.saveAuditFindingId(id);
      this._auditFindingService.getItem(id).subscribe(res => {
        AmAuditFieldWorkStore.setAuditFieldWorkId(res?.am_audit?.id)
        this._utilityService.detectChanges(this._cdr)
      })
    })
  }
}
