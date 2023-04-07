import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditNonConfirmityService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';

@Component({
  selector: 'app-ms-audit-follow-up-details',
  templateUrl: './ms-audit-follow-up-details.component.html',
  styleUrls: ['./ms-audit-follow-up-details.component.scss']
})
export class MsAuditFollowUpDetailsComponent implements OnInit {
  AppStore = AppStore;
  AuthStore = AuthStore;
  MsAuditStore = MsAuditStore;
  AuditNonConfirmityStore = AuditNonConfirmityStore
  constructor(private route: ActivatedRoute,private _auditNonConfirmityService : AuditNonConfirmityService,) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; 
      AuditNonConfirmityStore.setmsAuditNonConfirmityId(id);
      // this.getDetails(id);
    })
  }

  getDetails(id){
    this._auditNonConfirmityService.getIndividualCheckList(id).subscribe(res => {
    // this._utilityService.detectChanges(this._cdr);
    });
  }

  // clean up your code...
  ngOnDestroy(){
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    AuditNonConfirmityStore.unsetIndividualMsAuditNonConfirmityDetails();
    AuditNonConfirmityStore.brudcrubDisable=true;
    AuditNonConfirmityStore.nonConfirmityRedirect=false;
  }
}
