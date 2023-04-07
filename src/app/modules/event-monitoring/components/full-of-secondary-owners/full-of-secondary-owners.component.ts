import { Component, OnInit, Input } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { EventTeamsStore } from "src/app/stores/event-monitoring/event-team-store";


@Component({
  selector: 'app-full-of-secondary-owners',
  templateUrl: './full-of-secondary-owners.component.html',
  styleUrls: ['./full-of-secondary-owners.component.scss']
})
export class FullOfSecondaryOwnersComponent implements OnInit {
  @Input('source') secondaryOwnersSource: any;
  EventTeamsStore=EventTeamsStore;
  constructor(private _eventEmitterService: EventEmitterService,
   ) { }

  ngOnInit(): void {
  }
  cancel()
  {
    this._eventEmitterService.dismissEventSecondaryOwnerDetailModal();
  }
  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

}
