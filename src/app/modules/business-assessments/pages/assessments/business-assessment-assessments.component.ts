import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { AssessmentsStore } from 'src/app/stores/business-assessments/assessments/assessments.store';
import { ByDocumentStore } from 'src/app/stores/business-assessments/assessments/by-document.store';
import { ByMsTypeStore } from 'src/app/stores/business-assessments/assessments/by-ms-type.store';
import { ByDocumentTypeStore } from 'src/app/stores/business-assessments/assessments/by-document-type.store';
import { ByDepartmentStore } from 'src/app/stores/business-assessments/assessments/by-department.store';
import { ByPdcaStore } from 'src/app/stores/business-assessments/assessments/by-pdca.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-business-assessment-assessments',
  templateUrl: './business-assessment-assessments.component.html',
  styleUrls: ['./business-assessment-assessments.component.scss']
})
export class BusinessAssessmentAssessmentsComponent implements OnInit {
  @ViewChild('navigationBar') navigationBar: ElementRef;
  OrganizationModulesStore = OrganizationModulesStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _renderer2: Renderer2, private _router: Router,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _organizationModulesService:OrganizationModulesService) { }

  ngOnInit(): void {
    
    window.addEventListener('scroll', this.scrollEvent, true)
    SubMenuItemStore.setNoUserTab(true);

    this._organizationModulesService.getModulesSettings(null).subscribe(res=>{
      //console.log(res);
      this._utilityService.detectChanges(this._cdr);
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 10) {

        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {

        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }

  }

  
  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    AssessmentsStore.unsetAssessmentDetails();
    ByDocumentStore.unsetByDocumentSummary();
    ByMsTypeStore.unsetByMsTypeSummary();
    ByDocumentTypeStore.unsetByDocumentTypeSummary();
    ByDepartmentStore.unsetByDepartmentSummary();
    ByPdcaStore.unsetByPdcaSummary();
  }


}
