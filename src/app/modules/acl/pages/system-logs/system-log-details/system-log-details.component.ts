import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SystemLogsService } from 'src/app/core/services/acl/system-logs/system-logs.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SystemLogStore } from 'src/app/stores/acl/system-log.store';

@Component({
  selector: 'app-system-log-details',
  templateUrl: './system-log-details.component.html',
  styleUrls: ['./system-log-details.component.scss']
})
export class SystemLogDetailsComponent implements OnInit {

  @Input ('source') detailObject: any;
  selectedIndex = 0;
  SystemLogStore = SystemLogStore;
  
  constructor(private _systemLogService:SystemLogsService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails(){
    this._systemLogService.systemLogDetails(this.detailObject).subscribe(res=>{
    })
  }
  
  dismissModal(status){
    this._eventEmitterService.dismissLogDetailsPopup(status);
  }

  getDetailsClicked(index: number) {
    if (this.selectedIndex == index){
      this.selectedIndex = null;
      this._utilityService.detectChanges(this._cdr);
  }
    else {
      this.selectedIndex = index;
    this._utilityService.detectChanges(this._cdr);
    }
  }

}
