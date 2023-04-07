import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer, autorun } from "mobx";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';

@Component({
  selector: 'app-initiative-details',
  templateUrl: './initiative-details.component.html',
  styleUrls: ['./initiative-details.component.scss']
})
export class InitiativeDetailsComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  
  SubMenuItemStore = SubMenuItemStore;
  StrategyInitiativeStore  = StrategyInitiativeStore
  reactionDisposer: IReactionDisposer;

  constructor(private _renderer2: Renderer2, private _router: ActivatedRoute,
    private _route: Router,  private _initiativeService : InitiativeService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
      { type: "close", path: "../" }
    ]);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    let id: number;
    this._router.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      if(id){
        StrategyInitiativeStore.setInitiativeId(id)
        this.getInitiativeDetails(id);
      }else{
        this._route.navigateByUrl('/strategy-management/initiatives');

      }
    });
    
  }
  getInitiativeDetails(id){
    this._initiativeService.getInduvalInitiative(id).subscribe(res=>{
      StrategyInitiativeStore.is_mileStoneReq = res.is_milestone
      StrategyInitiativeStore.profilemileStoneStartDate = this._helperService.processDate(res.start_date,'split')
     StrategyInitiativeStore.profilemileStoneEndDate = this._helperService.processDate(res.end_date,'split')
     this._utilityService.detectChanges(this._cdr);
    })
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

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    StrategyInitiativeStore.is_mileStoneReq = 1
  }

}
