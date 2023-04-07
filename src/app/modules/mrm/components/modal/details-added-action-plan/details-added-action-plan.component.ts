import { Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';


@Component({
  selector: 'app-details-added-action-plan',
  templateUrl: './details-added-action-plan.component.html',
  styleUrls: ['./details-added-action-plan.component.scss']
})
export class DetailsAddedActionPlanComponent implements OnInit {
  @Input('source') source: any;
 actionPlanDetails=[];
 AppStore=AppStore;
 selectedIndex:number;
 MeetingsStore=MeetingsStore;
 NoDataItemStore=NoDataItemStore;
 OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  constructor( 
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _imageService:ImageServiceService,
    private _utilityService: UtilityService
    ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "action_plan_nodata_title" });
    this.actionPlanDetails=this.source.values.data.action_plan
  }

  cancel()
  {
    this._eventEmitterService.dismissDetailsActionPlanMappingModal();
  }
 getDate(date)
 {
   return this._helperService.processDate(date, 'join')
 }
  //passing token to get preview
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  readMore(index,type)
  {
    if(type=="more")
    {
      this.selectedIndex=index
    }
    else{
      this.selectedIndex=null;
    }
    
  }

  removeActionPlan(index)
  {
    const indexMain=MeetingsStore.mappedActionPlan.findIndex(e=>(e.meeting_plan_meeting_agenda_id==this.source.values.id && e.description== this.source.values.description))
    if(indexMain!=-1)
    {
      MeetingsStore.mappedActionPlan[indexMain]['action_plan'].splice(index, 1);
      this._utilityService.showSuccessMessage('success','action_plan_deleted')
    }
    
  }

}
