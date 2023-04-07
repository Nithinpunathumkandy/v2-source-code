import { Component, OnInit,ViewChild,ElementRef,Renderer2, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
import { AssessmentStore } from 'src/app/stores/human-capital/assessment/assessment.store';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit,OnDestroy {

  @ViewChild('navigationBar') navigationBar: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  selectedTab: string;
  OrganizationModulesStore = OrganizationModulesStore;
  AppStore = AppStore;

  constructor(
      private _router: Router,
      private _renderer2: Renderer2,
  ) { }

  ngOnInit() {
    this.checkPermissionPresent();
    setTimeout(() => {
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 250);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }

  checkPermissionPresent(){
    //console.log(OrganizationModulesStore.getOrganizationSubModules(200,7601)[0]?.['client_side_url'])
    if(OrganizationModulesStore.getOrganizationSubModules(200,7601)[0]?.['client_side_url'])
    {
      this._router.navigateByUrl(OrganizationModulesStore.getOrganizationSubModules(200,7601)[0].client_side_url);
    }
    
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AssessmentStore.unsetAssessments();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.addClass(this.navigationBar.nativeElement,'affix');
      }
      else{ 
        this._renderer2.removeClass(this.navigationBar.nativeElement,'affix');
      }
    }

    
  }

}
