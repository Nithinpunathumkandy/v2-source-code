import { Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-kpi-review-measure-all-history',
  templateUrl: './kpi-review-measure-all-history.component.html',
  styleUrls: ['./kpi-review-measure-all-history.component.scss']
})
export class KpiReviewMeasureAllHistoryComponent implements OnInit {
  @Input('source') kpiMesureHistorySource: any;

  StrategyStore = StrategyStore;
  OrganizationGeneralSettingsStore =  OrganizationGeneralSettingsStore
  selectedKpiIndex: any = null;
  constructor(private _eventEmitterService: EventEmitterService,private _reviewService : StrategyReviewService,
    private _imageService: ImageServiceService,) { }

  ngOnInit(): void {
  }

  cancel(){
    this._eventEmitterService.dismisskpiMesureHistoryAllModal();
  }

  createImageUrl(type, token) {
    return this._reviewService.getThumbnailPreview(type, token);
  }

     // Returns default image
     getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }


  selectObjectiveIndexChange(index,id,initial:boolean=false){
   
    if(this.selectedKpiIndex == index){
      if(!initial)this.selectedKpiIndex = null;
    }else{
      this.selectedKpiIndex = index
    }
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

}
