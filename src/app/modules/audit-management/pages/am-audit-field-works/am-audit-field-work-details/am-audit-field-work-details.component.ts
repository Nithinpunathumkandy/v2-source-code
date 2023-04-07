import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AmAuditFieldWorkService } from 'src/app/core/services/audit-management/am-audit-field-work/am-audit-field-work.service';
import { AmAuditService } from 'src/app/core/services/audit-management/am-audit/am-audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';

@Component({
  selector: 'app-am-audit-field-work-details',
  templateUrl: './am-audit-field-work-details.component.html',
  styleUrls: ['./am-audit-field-work-details.component.scss']
})
export class AmAuditFieldWorkDetailsComponent implements OnInit {
  AmAuditFieldWorkStore = AmAuditFieldWorkStore;
  AppStore = AppStore;
  AmAuditsStore = AmAuditsStore;
  constructor(private _auditFieldWorkService:AmAuditFieldWorkService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _route:ActivatedRoute,
    private _auditsService:AmAuditService) { }

  ngOnInit(): void {
 
    this.getDetails();
  }

  getDetails(){
        
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._auditFieldWorkService.saveAuditFieldWorkId(id);
      this.getAmAuditProgress(id)
      this._auditFieldWorkService.getItem(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    })
  }

  getAmAuditProgress(id){
    this._auditsService.getAmAuditProgress(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  tabActive(type){
    let pos = AmAuditsStore.auditProgress?.am_audit_statuses.findIndex(e=>(e.type==type) && (e.is_selected==true));
    if(pos!=-1){
      return true;
    }
    else
    return false;
  }
}
