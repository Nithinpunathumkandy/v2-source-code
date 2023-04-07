import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

@Component({
  selector: 'app-add-investigation-details',
  templateUrl: './add-investigation-details.component.html',
  styleUrls: ['./add-investigation-details.component.scss']
})
export class AddInvestigationDetailsComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  IncidentStore = IncidentStore;
  isDuplicated: boolean = false;
  constructor(private _eventEmitterService: EventEmitterService,private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,    private _cdr: ChangeDetectorRef, private _investigationService : InvestigationService) { }

  ngOnInit(): void {
    
        // form
        this.form = this._formBuilder.group({
          discription: ['',[Validators.required]],
        })
  }

  cancel() {
    this._eventEmitterService.dismissInvestigationDetailsModalControl();
    this.isDuplicated = false;
    this._utilityService.detectChanges(this._cdr)


  }

  processData(){
    let saveData = {
      discription: this.form.value.discription ? this.form.value.discription : '',
    }
    return saveData;
  }

  saveIncidentInvestigations(close:boolean = false){
    let saveData = {
      investigation_point : this.form.value.discription
    }
  if(this.IncidentStore.incidentInvestigations.length == 0){
    this.IncidentStore.setIncidentInvestigations(this.form.value.discription)
    this._investigationService.addInvestigationInvestigationPoint(saveData).subscribe(()=>{
       if(close){
              this.cancel();
            }
    })

  }else{
    for (let i = 0; i < this.IncidentStore.incidentInvestigations.length; i++) {
      if(this.form.value.discription == this.IncidentStore.incidentInvestigations[i]){
        this.isDuplicated = true;
        break;
      }else{
        this.IncidentStore.setIncidentInvestigations(this.form.value.discription)
        this._investigationService.addInvestigationInvestigationPoint(saveData).subscribe(()=>{
           if(close){
              this.cancel();
            }
        })
        this.isDuplicated = false;
       
        break;
      }
      
    }
  }
    this.form.reset();
    this._utilityService.detectChanges(this._cdr)
  }

}
