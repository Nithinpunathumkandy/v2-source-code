import { Component, OnInit } from '@angular/core';
import { EventDashboardService } from 'src/app/core/services/event-monitoring/event-dashboard/event-dashboard.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-stakeholder-dashboard',
  templateUrl: './stakeholder-dashboard.component.html',
  styleUrls: ['./stakeholder-dashboard.component.scss']
})
export class StakeholderDashboardComponent implements OnInit {

  constructor(
    private _helperService: HelperServiceService,
    private _eventDashboardService:EventDashboardService
  ) { }

  ngOnInit(): void {
    this.getStakeholderMatrix()
  }

  getStakeholderMatrix(){
    this._eventDashboardService.getEventStakeholder().subscribe(res=>{
      
    })
  }

}
