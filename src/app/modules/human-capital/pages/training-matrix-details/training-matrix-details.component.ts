import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { CompetencyMatrixService } from 'src/app/core/services/human-capital/competency-matrix/competency-matrix.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { TrainingMatrixDetailsStore } from 'src/app/stores/human-capital/competency-matrix/training-matrix-details/training-matrix-details-store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-training-matrix-details',
  templateUrl: './training-matrix-details.component.html',
  styleUrls: ['./training-matrix-details.component.scss']
})
export class TrainingMatrixDetailsComponent implements OnInit,OnDestroy {
  @Input('source') matrixTrainingObject: any;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  emptyRecommendedTrainingData = "empty_recommended_training_message";
  emptyScheduledTrainingData = "empty_scheduled_training_message";

  popupObject = {
    type: '',
    title: '',
    subtitle: '',
    id: null
  };

  AppStore = AppStore;
  TrainingMatrixDetailsStore = TrainingMatrixDetailsStore;
  OrganizationGeneralSettingsStore =OrganizationGeneralSettingsStore;

  popupControlEventSubscription:any;
  showMore = false;

  constructor(private _competencyMatrixService:CompetencyMatrixService,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _eventEmitterService: EventEmitterService,
              private _helperService: HelperServiceService,
              private _imageService:ImageServiceService,
              ) { }

  ngOnInit(): void {
    // console.log('test');
    
    // this.getDetails();

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
  }

  getDetails(){
    this._competencyMatrixService.getTrainingMatrixDetails(this.matrixTrainingObject.user_id,this.matrixTrainingObject.competency_id).subscribe(()=> this._utilityService.detectChanges(this._cdr)
    );
  }

  cancel(){
    this._eventEmitterService.dismissTrainingMatrixDetails();
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  confirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'Confirm';
    this.popupObject.subtitle = 'Are you sure want to confirm this action?';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }

 // modal control event
 modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case 'Confirm': this.confirmRecommentedTraining(status)
      break;
  }

}

processDataForSave(){
  let saveData = {
    user_id: this.matrixTrainingObject.user_id,
    training_id: this.popupObject.id
  }
 
  return saveData;
}

setMoreView(type){
  if(type=='more')
  this.showMore = true;
  else this.showMore = false;
}




confirmRecommentedTraining(status: boolean) {
  if (status && this.popupObject.id) {
    this._competencyMatrixService.onAdd(this.processDataForSave()).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.clearPopupObject();
      this.getDetails();
    });
  }
  else {
    this.clearPopupObject();
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);
  this.getDetails();
}
  
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

createImagePreview(type, token) {
  return this._imageService.getThumbnailPreview(type, token)
}
 // Returns default image
 getDefaultImage(type) {
  return this._imageService.getDefaultImageUrl(type);
}

  ngOnDestroy(){
    TrainingMatrixDetailsStore.unsetTrainingMatrixDetails();
   this.popupControlEventSubscription.unsubscribe();
  }
}
