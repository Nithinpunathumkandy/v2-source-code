import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { IReactionDisposer } from 'mobx';
import { Router } from "@angular/router";
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
import { SwotStore } from 'src/app/stores/organization/context/swot.store';
import { PestleStore } from 'src/app/stores/organization/context/pestle.store';
import { InternalIssueStore } from 'src/app/stores/organization/context/internal-issue.store';
import { ExternalIssueStore } from 'src/app/stores/organization/context/external-issue.store';
import { StakeholderAnalysisStore } from 'src/app/stores/organization/context/stakeholder-analysis.store';
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
  selector: 'app-organization-context',
  templateUrl: './organization-context.component.html',
  styleUrls: ['./organization-context.component.scss']
})
export class OrganizationContextComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationModulesStore = OrganizationModulesStore;
  AppStore = AppStore;
  constructor(private _renderer2: Renderer2, private _router: Router,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.checkPermissionPresent();
    AppStore.showDiscussion = false;
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this._utilityService.detectChanges(this._cdr); 
  }

  checkPermissionPresent(){
    var pos = OrganizationModulesStore.getOrganizationSubModules(100,3901).findIndex(e=>'/'+e.client_side_url == this._router.url);
    if(this._router.url == '/organization/context' && pos != 0 && !this.checkPath())
      this._router.navigateByUrl(OrganizationModulesStore.getOrganizationSubModules(100,3901)[0]?.client_side_url);
  }

  checkPath(){
    if(AppStore.previousUrl.indexOf('organization/issue-details') == -1)
      return false;
    else return true;
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  ngOnDestroy(){
    window.removeEventListener('scroll',this.scrollEvent);
    SwotStore.unsetSwotList();
    PestleStore.unsetPestleList();
    InternalIssueStore.unsetInternalIssueList();
    ExternalIssueStore.unsetExternalIssueList();
    StakeholderAnalysisStore.unsetDetails();
    // IssueListStore.unsetIssueDetails();
  }

}
