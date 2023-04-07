import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

@Component({
  selector: 'app-add-references-modal',
  templateUrl: './add-references-modal.component.html',
  styleUrls: ['./add-references-modal.component.scss']
})
export class AddReferencesModalComponent implements OnInit {

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
    this._eventEmitterService.dismissreferenceModalControl();
    this.isDuplicated = false;
    this._utilityService.detectChanges(this._cdr)

  }

  processData(){
    let saveData = {
      discription: this.form.value.discription ? this.form.value.discription : '',
    }
    return saveData;
  }

  saveReferences(){
 
    if(this.IncidentStore.references.length == 0){
      this.IncidentStore.setReferences( this.form.value.discription)
      this._utilityService.showSuccessMessage('success', 'incident_investigation_references_added')

    }else{
      for (let i = 0; i < this.IncidentStore.references.length; i++) {
        if(this.form.value.discription == this.IncidentStore.references[i]){
          this.isDuplicated = true;
          break;

        }else{
          this.IncidentStore.setReferences( this.form.value.discription)
          this.isDuplicated = false;
          break;
        }  
      }
      if(  this.isDuplicated == false){
        this._utilityService.showSuccessMessage('success', 'incident_investigation_references_added')

      }
    }
    this.form.reset();
    this._utilityService.detectChanges(this._cdr)
  }

}
