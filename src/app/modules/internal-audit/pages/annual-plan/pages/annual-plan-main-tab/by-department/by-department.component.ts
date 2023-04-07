import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ByDepartmentService } from 'src/app/core/services/internal-audit/annual-plan/by-department/by-department.service';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import {ByDepartmentsStore} from 'src/app/stores/internal-audit/annual-plan/by-department/by-department-store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-by-department',
  templateUrl: './by-department.component.html',
  styleUrls: ['./by-department.component.scss']
})
export class ByDepartmentComponent implements OnInit ,OnDestroy {

  ByDepartmentsStore = ByDepartmentsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  AuditStore = AuditStore;
  AuditPlanStore = AuditPlanStore;
  departmentEmptyList = "No Departments To Show";
  constructor(private _byDepartmentService: ByDepartmentService,
    private _utilityService: UtilityService,
    private _router: Router,
    private _imageService:ImageServiceService,
    private _auditService: AuditService,
    private _cdr: ChangeDetectorRef,
    private _auditPlanService: AuditPlanService,
    ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this.pageChange();
  }

  pageChange(){
    this._byDepartmentService.getAllItems().subscribe(res=>{

      if(res.length > 0) this.getAuditPlans(res[0].department_id)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAuditPlans(id:number){
    AuditPlanStore.loaded = false;
    let params = `&department_ids=${id}`;
    this._auditPlanService.getItems(false,params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
    this._byDepartmentService.setSelected(id);
  }

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

  gotoAuditDetails(id:number){
    this._router.navigateByUrl('/internal-audit/audits/'+id);
  }

  ngOnDestroy(){
    AuditPlanStore.loaded = false;
    ByDepartmentsStore.loaded =false;
  }

}
