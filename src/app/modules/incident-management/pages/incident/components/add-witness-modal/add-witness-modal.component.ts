import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

@Component({
  selector: 'app-add-witness-modal',
  templateUrl: './add-witness-modal.component.html',
  styleUrls: ['./add-witness-modal.component.scss']
})
export class AddWitnessModalComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  IncidentStore = IncidentStore;

  constructor(private _eventEmitterService: EventEmitterService,private _formBuilder: FormBuilder,
              private _utilityService: UtilityService,    private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {

    // form
    this.form = this._formBuilder.group({
      name: ['',[Validators.required]],
      designation : [''],
      company : [''],
      email : ['',[Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      mobile : ['',[Validators.required]],
    })

   
  }

  get f() {
    return this.form.controls; 
   }

   ngDoCheck(){
    if(IncidentStore.selectedIndexForWitnessEdit  !=  null && !this.form.value.name){
      this.setDataForEdit();
      this._utilityService.detectChanges(this._cdr)

    }
  }
  

  cancel() {
    this._eventEmitterService.dismissWitnessModalControl();
  }


  setDataForEdit(){
    this.form.patchValue({
      name: IncidentStore.involvedWitnessUserDetailsEdit[0].name ? IncidentStore.involvedWitnessUserDetailsEdit[0].name : '',
      designation: IncidentStore.involvedWitnessUserDetailsEdit ? IncidentStore.involvedWitnessUserDetailsEdit[0].designation : '',
      company: IncidentStore.involvedWitnessUserDetailsEdit ? IncidentStore.involvedWitnessUserDetailsEdit[0].company : '',
      mobile: IncidentStore.involvedWitnessUserDetailsEdit ? IncidentStore.involvedWitnessUserDetailsEdit[0].mobile : '',
      email : IncidentStore.involvedWitnessUserDetailsEdit ? IncidentStore.involvedWitnessUserDetailsEdit[0].email : '',
    })
    this._utilityService.detectChanges(this._cdr);

  }

  
  processFormErrors(){
    if(this.form.value.auditee_ids && this.form.value.auditee_ids.length>0){
    var errors = this.formErrors;
   
    // for (var key in errors) {
    //   if (errors.hasOwnProperty(key)) {
    //       if(key.startsWith('incident_damage_type_id.')){
    //        let keyValueSplit = key.split('.');
    //        let errorPosition = parseInt(keyValueSplit[1]);
    //       this.formErrors['incident_damage_type_id'] = this.formErrors['incident_damage_type_id']? this.formErrors['incident_damage_type_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
    //       }
    
    //   }
    // }
   }
    this._utilityService.detectChanges(this._cdr);
  }

  processData(){
    let saveData = {
      name: this.form.value.name ? this.form.value.name : '',
      designation: this.form.value.designation ? this.form.value.designation : '',
      company: this.form.value.company ? this.form.value.company : '',
      email: this.form.value.email ? this.form.value.email : '',
      mobile: this.form.value.mobile ? this.form.value.mobile : '',
    }

    return saveData;
  }

  saveOtherWitnessUserDetails(){

    if(IncidentStore.selectedIndexForWitnessEdit != null){
      IncidentStore.involvedWitnessUserDetails.splice(IncidentStore.selectedIndexForWitnessEdit,1)
 }
 
    this.IncidentStore.setOtherWitnessUserDetails(this.processData())
    this.form.reset();
    IncidentStore.selectedIndexForWitnessEdit = null;
    this._utilityService.detectChanges(this._cdr)
  }

}
