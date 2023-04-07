import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventDashboardService } from 'src/app/core/services/event-monitoring/event-dashboard/event-dashboard.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Component({
  selector: 'app-stakeholder-matrix',
  templateUrl: './stakeholder-matrix.component.html',
  styleUrls: ['./stakeholder-matrix.component.scss']
})
export class StakeholderMatrixComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  reactionDisposer: IReactionDisposer;

  constructor(
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _eventDashboardService:EventDashboardService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      //this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.reactionDisposer = autorun(() => {      
      var subMenuItems = [        
        { activityName: null, submenuItem: { type: 'close', path: '../dashboard' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);          
    });
    this.getStakeholderMatrix()
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        //this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        //this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  getStakeholderMatrix(){
    this._eventDashboardService.getEventStakeholder().subscribe(res=>{
      
    })
  }

}
