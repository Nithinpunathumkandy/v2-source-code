import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IReactionDisposer, autorun } from "mobx";
import { ActivatedRoute, Router } from "@angular/router";
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.scss']
})
export class StrategyDetailsComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  StrategyStore = StrategyStore
  OrganizationModulesStore = OrganizationModulesStore;
  
  constructor(private _renderer2: Renderer2, private _router: ActivatedRoute,
    private _route: Router,private _strategyService : StrategyService,private _helperService : HelperServiceService) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
      { type: "close", path: "../" }
    ]);
    let id: number;
    this._router.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      if(id){
        StrategyStore.setSelectedId(id)
        this.getDtrategyProfileData(id)
      }else{
        this._route.navigateByUrl('/strategy-management/strategies');

      }
    });
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }

  getDtrategyProfileData(id){
    this._strategyService.getItem(id).subscribe(res=>{
      StrategyStore.start_date = this._helperService.processDate(StrategyStore.induvalStrategyProfile?.start_date,'split') ;
      StrategyStore.end_date = this._helperService.processDate(StrategyStore.induvalStrategyProfile?.end_date,'split')
    })
    }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    StrategyStore._induvalObjectives = null;
    StrategyStore._kpis = [];
    StrategyStore._objectives = [];
    StrategyStore._focusAreas = [];
    StrategyStore._profileNotes = [];
    StrategyStore._induavalKpi = null;
    StrategyStore._induvalObjectives = null;
    // StrategyStore.__individualProfile = null,
    StrategyStore.individualLoaded = false;
    StrategyStore.objectivesLoaded = false;
    StrategyStore.focusAreaLoaded = false


    





  }

}
