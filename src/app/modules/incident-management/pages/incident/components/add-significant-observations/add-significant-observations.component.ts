import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

@Component({
  selector: 'app-add-significant-observations',
  templateUrl: './add-significant-observations.component.html',
  styleUrls: ['./add-significant-observations.component.scss']
})
export class AddSignificantObservationsComponent implements OnInit {
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
    this._eventEmitterService.dismisssignificantModalControl();
    this._utilityService.detectChanges(this._cdr)
  }

  processData(){
    let saveData = {
      discription: this.form.value.discription ? this.form.value.discription : '',
    }
    return saveData;
  }

  saveSignificantObservations(){
    if(this.IncidentStore.significantObservations.length == 0){
      this.IncidentStore.setSignificantObservations( this.form.value.discription)
      this._utilityService.showSuccessMessage('success', 'incident_investigation_observation_added')

    }else{
      for (let i = 0; i < this.IncidentStore.significantObservations.length; i++) {
        if(this.form.value.discription == this.IncidentStore.significantObservations[i]){
          this.isDuplicated = true;
          break;

        }else{
          this.IncidentStore.setSignificantObservations( this.form.value.discription)
          this.isDuplicated = false;
          break;
        }  
      }
      if(  this.isDuplicated == false){
        this._utilityService.showSuccessMessage('success', 'incident_investigation_observation_added')

      }
    }
    this.form.reset();
    this._utilityService.detectChanges(this._cdr)
  }

}
