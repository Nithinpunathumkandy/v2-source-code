import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from "@angular/router";

import { UtilityService } from "src/app/shared/services/utility.service";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

import { MasterService } from "src/app/core/services/masters/masters/master.service";
import { MasterMenuStore } from 'src/app/stores/masters/masters.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss']
})
export class MastersComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('searchDiv') searchDiv: ElementRef
  SubMenuItemStore = SubMenuItemStore;
  MasterMenuStore = MasterMenuStore;
  OrganizationModulesStore = OrganizationModulesStore;
  searchTerm: string;
  form: FormGroup;
  searchListShown: boolean = false;
  currentMasters = null;

  constructor(private _renderer2: Renderer2, private _utilityService: UtilityService,
    private _masterService: MasterService, private _cdr: ChangeDetectorRef,
    private _router: Router){
  }

  ngOnInit() { 

    this.form = new FormGroup({});
    this.getMastersMenu();

    this._utilityService.scrollToTop();//Automatically scroll to top of page

    SubMenuItemStore.setNoUserTab(true);

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
      window.addEventListener('click',this.clickEvent,true);
    }, 1000);

    this._router.events.subscribe(res=>{
      this.searchTerm = null;
    })

  }

  getMastersMenu(){
    this._masterService.getItems().subscribe(res=>{
      // this._router.navigateByUrl('/masters'+MasterMenuStore.masterMenu[0].client_side_url);
      this.checkPermissionPresent();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  checkPermissionPresent(){
    var pos = MasterMenuStore.masterMenu.findIndex(e=>'/masters'+e.client_side_url == this._router.url);
    let mpos;
    for(let i of this.MasterMenuStore.masterMenu){
      mpos = i.modules.findIndex(e => e.client_side_url == this._router.url);
      if(mpos != -1) break;
    }
    if(pos == -1 && mpos == -1) this._router.navigateByUrl('/masters'+MasterMenuStore.masterMenu[0].client_side_url);
  }

  clickEvent = (e:any):void =>{
    if(this.searchDiv){
      if(e.target !== this.searchDiv.nativeElement){
        this.searchListShown=false;
      }
      else{
        this.searchListShown = true;
      }
    }
    else{
      this.searchListShown = false;
    }
  }

  searchMasters(){
    //console.log(this.searchTerm);
    if(this.searchTerm){
      this._masterService.searchItems('?q='+this.searchTerm).subscribe(res=>{
        this.searchListShown = true;
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.searchListShown = false;
      MasterMenuStore.searchResults = [];
    }
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
  
  clearSearchBar(){
    this.searchTerm = '';
    this.searchMasters();
  }

  // masterMenuClicked(item){
  //   this.currentMasters = item;
  // }

  checkIfPresent(item){
      for(let i of item.modules){
        if(this._router.url.indexOf(i.client_side_url) != -1)
          return true;
      }
      return false;
  }

  clearSearchResults(){
    MasterMenuStore.searchResults = [];
  }

}
