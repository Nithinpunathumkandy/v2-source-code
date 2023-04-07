import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { UtilityService } from "src/app/shared/services/utility.service";

import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { AuthStore } from "src/app/stores/auth.store";
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuthStore = AuthStore;
  OrganizationModulesStore = OrganizationModulesStore;
  itemSelected: string = null;
  themeSettingsUrls = ['/settings/theme-structure','/settings/theme-login','/settings/theme-footer'];
  orgSettingsUrls = ['/settings/organization','/settings/audit-management','/settings/knowledge-hub','/settings/risk-management','/settings/asset-management','/settings/login', '/settings/active-directory-setting',
  '/settings/strategy-management-settings','/settings/isms-risk-settings','/settings/bcm-settings','/settings/internal-audit'];
  constructor(private _renderer2: Renderer2, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _router: Router) { }

  ngOnInit() {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    setTimeout(() => {
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    this.checkForInitialUrl();
  }

  //Function to check for url loading and activate the dropdown tab
  checkForInitialUrl(){
    let initUrl = this._router.url;
    switch(initUrl){
      case '/settings/organization-settings': this.itemSelected = 'settings';
      break;
      case '/settings/theme-structure': this.itemSelected = 'theme';
      break;
      case '/settings/theme-login': this.itemSelected = 'theme';
      break;
      case '/settings/theme-footer': this.itemSelected = 'theme';
      break;
    }
    this._utilityService.detectChanges(this._cdr);
  }

  //Checking active urls to make dropdownlist heading active/inactive according to url
  checkForActiveUrls(type:string){
    if(type == 'theme' && this.themeSettingsUrls.indexOf(this._router.url) != -1)
      return true;
    else if(type == 'settings' && this.orgSettingsUrls.indexOf(this._router.url) != -1)
      return true;
    else
      return false;
    
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  itemClicked(item,hideList:boolean = false){
    setTimeout(() => {
      if(hideList)
        this.itemSelected = this.itemSelected == item ? null : item;
      else
        this.itemSelected = item;
      this._utilityService.detectChanges(this._cdr);
    }, 50);
  }

}
