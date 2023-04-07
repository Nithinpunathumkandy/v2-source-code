import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

@Component({
  selector: 'app-add-recommendations-modal',
  templateUrl: './add-recommendations-modal.component.html',
  styleUrls: ['./add-recommendations-modal.component.scss']
})
export class AddRecommendationsModalComponent implements OnInit {

  form: FormGroup;
  formErrors: any;
  IncidentStore = IncidentStore;
  isDuplicated: boolean = false;


  constructor(private _eventEmitterService: EventEmitterService,private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,    private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
     // form
     this.form = this._formBuilder.group({
      discription: ['',[Validators.required]],
    })
  }

  cancel() {
    this._eventEmitterService.dismissrecommendationsModalControl();
    this.isDuplicated = false;
    this._utilityService.detectChanges(this._cdr)

  }

  processData(){
    let saveData = {
      discription: this.form.value.discription ? this.form.value.discription : '',
    }
    return saveData;
  }

  saveRecommendations(){

    if(this.IncidentStore.recommendations.length == 0){
      this.IncidentStore.setRecommendations(this.form.value.discription)
      this._utilityService.showSuccessMessage('success', 'incident_investigation_recomendation_added')
    }else{
      for (let i = 0; i < this.IncidentStore.recommendations.length; i++) {
        if(this.form.value.discription == this.IncidentStore.recommendations[i]){
          this.isDuplicated = true;
          break;
        }else{
          this.IncidentStore.setRecommendations(this.form.value.discription)
          this.isDuplicated = false;
          break;
        }  
      }
      if(  this.isDuplicated == false){
        this._utilityService.showSuccessMessage('success', 'incident_investigation_recomendation_added')

      }
    }
    this.form.reset();
    this._utilityService.detectChanges(this._cdr)
  }

}
