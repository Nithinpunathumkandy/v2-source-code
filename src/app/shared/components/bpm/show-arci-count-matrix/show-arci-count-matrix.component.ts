import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';

@Component({
  selector: 'app-show-arci-count-matrix',
  templateUrl: './show-arci-count-matrix.component.html',
  styleUrls: ['./show-arci-count-matrix.component.scss']
})
export class ShowArciCountMatrixComponent implements OnInit {

  @Input ('source') source:any;
  ProcessStore = ProcessStore

  constructor(
    private _processService: ProcessService,
    private _eventEmitterService:EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    this._processService.getItemById(ProcessStore.process_id).subscribe()
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
  }

  getPopupDetails(user, is_created_by: boolean = false) {
  
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation?.title ? user.designation.title : user.designation?user.designation: null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = ProcessStore.processDetails.created_at;
      return userDetailObject;
    }
  }

  closeModal(){
    this._eventEmitterService.dismissArciModal()
  }

}
