import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { Router } from "@angular/router";

import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { IssueListService } from "src/app/core/services/organization/context/issue-list/issue-list.service";

import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";

@Component({
  selector: 'app-issuelist-main',
  templateUrl: './issuelist-main.component.html',
  styleUrls: ['./issuelist-main.component.scss']
})
export class IssuelistMainComponent implements OnInit {
  @ViewChild('issueNavBar') issueNavBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  IssueListStore = IssueListStore;
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationModulesStore = OrganizationModulesStore;
  constructor(private _route: Router, private _issueListService: IssueListService,
    private _renderer2: Renderer2, private _helperService: HelperServiceService) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = false;

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'UPDATE_ORGANIZATION_ISSUE', submenuItem: { type: 'edit_modal' }},
        // {activityName: null, submenuItem: { type: 'close', path: '/organization/context/issue-lists' }}
        {activityName: null, submenuItem: { type: 'close', path: AppStore.previousUrl ? AppStore.previousUrl : '/organization/context/issue-lists' }}
      ]

      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.gotoEditIssue();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    SubMenuItemStore.setNoUserTab(true);

    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'edit_modal' },
    //   { type: 'close', path: '/organization/context/issue-lists' },
    // ]);
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        // setTimeout(() => {
          this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
          this._renderer2.addClass(this.issueNavBar.nativeElement,'affix');
        // }, 100);
      }
      else{
        // setTimeout(() => {
          this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
          this._renderer2.removeClass(this.issueNavBar.nativeElement,'affix');
        // }, 100);
      }
    }
  }

  gotoEditIssue(){
    this._issueListService.getIssueDetails(IssueListStore.selectedIssueData?.id).subscribe(res=>{
      this._route.navigateByUrl('/organization/edit-issue');
    });
  }

  checkPath(url: string){
    if(this._route.url == '/organization/issue-details/processes' && url == '/organization/issue-details/processes') return true;
    if(url == '/organization/issue-details' && this._route.url != '/organization/issue-details/processes') return true;
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    window.removeEventListener('scroll',this.scrollEvent);
    SubMenuItemStore.makeEmpty();
    if(!IssueListStore.selectedId)
      IssueListStore.unsetIssueDetails();
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
