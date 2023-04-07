import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

@Component({
  selector: 'app-add-observations',
  templateUrl: './add-observations.component.html',
  styleUrls: ['./add-observations.component.scss']
})
export class AddObservationsComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  IncidentStore = IncidentStore;
  isDuplicated: boolean = false;
  constructor(private _eventEmitterService: EventEmitterService,private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,    private _cdr: ChangeDetectorRef,
    private _investigationService : InvestigationService) { }

  ngOnInit(): void {
       // form
       this.form = this._formBuilder.group({
        discription: ['',[Validators.required]],
      })
  }

  cancel() {
    this._eventEmitterService.dismisssignificantDetailsModalControl();
    this.isDuplicated = false;
    this._utilityService.detectChanges(this._cdr)
  }

  processData(){
    let saveData = {
      discription: this.form.value.discription ? this.form.value.discription : '',
    }
    return saveData;
  }

  saveSignificantObservations(close:boolean = false){
    let saveData = {
      investigation_observation :  this.form.value.discription
    }
    if(this.IncidentStore.significantObservations.length == 0){
      this.IncidentStore.setSignificantObservations( this.form.value.discription)
      this._investigationService.addInvestigationObservations(saveData).subscribe(()=>{this._utilityService.detectChanges(this._cdr)
        if(close){
              this.cancel();
            }
          })

  
    }else{
      for (let i = 0; i < this.IncidentStore.significantObservations.length; i++) {
        if(this.form.value.discription == this.IncidentStore.significantObservations[i]){
          this.isDuplicated = true;
          break;

        }else{
          this.IncidentStore.setSignificantObservations( this.form.value.discription)
          this._investigationService.addInvestigationObservations(saveData).subscribe(()=>{this._utilityService.detectChanges(this._cdr)
            if(close){
              this.cancel();
            }
          })

          this.isDuplicated = true;
          break;
        }  
      }
    }
    this.form.reset();
    this._utilityService.detectChanges(this._cdr)
  }


}
