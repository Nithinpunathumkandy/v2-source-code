import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ByAuditorService } from 'src/app/core/services/internal-audit/annual-plan/by-auditor/by-auditor.service';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ByAuditorsStore } from 'src/app/stores/internal-audit/annual-plan/by-auditor/by-auditor-store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-by-auditor-details',
  templateUrl: './by-auditor-details.component.html',
  styleUrls: ['./by-auditor-details.component.scss']
})
export class ByAuditorDetailsComponent implements OnInit,OnDestroy {
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  ByAuditorsStore = ByAuditorsStore;
  AuditPlanStore = AuditPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  planEmptyList = "No Plans Found For This Auditor";
  byAuditorEmptyList = "No Plans Found For This Auditor";
  auditLeaderInfo;
  constructor(private _byAuditorService:ByAuditorService,
    private _cdr: ChangeDetectorRef,
    private _auditPlanService: AuditPlanService,
    private _imageService : ImageServiceService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _utilityService: UtilityService,) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
 // setting submenu items
  SubMenuItemStore.setSubMenuItems([
  { type: 'close', path: '/internal-audit/anual-plan' }
  ]);
  SubMenuItemStore.setNoUserTab(true);
  BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.pageChange(1);
  }

  pageChange(newPage: number = null){
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
    });
    let params2 = `&audit_leader_ids=${id}`;
    if (newPage) AuditPlanStore.setCurrentPage(newPage);
    this._auditPlanService.getItems(false,params2).subscribe(res => {
      this.auditLeaderInfo = res.data[0];
      this._utilityService.detectChanges(this._cdr);
    });
  }

   // details page callig function
   gotToAuditPlanDetails(id:number){
    this._router.navigateByUrl('/internal-audit/audit-plans/'+id);
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
 


  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    AuditPlanStore.loaded = false;
  }
}
