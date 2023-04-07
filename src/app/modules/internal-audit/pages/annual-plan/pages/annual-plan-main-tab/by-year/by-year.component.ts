import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ByYearService } from 'src/app/core/services/internal-audit/annual-plan/by-year/by-year.service';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import {ByYearsStore} from 'src/app/stores/internal-audit/annual-plan/by-year/by-year-store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-by-year',
  templateUrl: './by-year.component.html',
  styleUrls: ['./by-year.component.scss']
})
export class ByYearComponent implements OnInit , OnDestroy {

  ByYearsStore = ByYearsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  AuditStore = AuditStore;
  AuditPlanStore = AuditPlanStore;
  yearEmptyList = "No Year wise Data To Show";
  constructor(private _byYearService:ByYearService,
    private _utilityService: UtilityService,
    private _router: Router,
    private _imageService:ImageServiceService,
    private _auditPlanService: AuditPlanService,
    private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    this.pageChange();
  }

  pageChange(){
    this._byYearService.getAllItems().subscribe(res=>{
      if(res.length > 0) this.getAudit(res[0].year)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAudit(id:number){
    AuditPlanStore.loaded = false;
    let params = `&year=${id}`;
    this._auditPlanService.getItems(false,params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
    this._byYearService.setSelected(id);
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
    ByYearsStore.loaded = false;
  }

}
