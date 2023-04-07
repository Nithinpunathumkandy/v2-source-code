import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

declare var $:any

@Component({
  selector: 'app-add-person-involved-modal',
  templateUrl: './add-person-involved-modal.component.html',
  styleUrls: ['./add-person-involved-modal.component.scss']
})
export class AddPersonInvolvedModalComponent implements OnInit {
  form: FormGroup;
  IncidentStore = IncidentStore;
  formErrors: any;
  femaleGender : boolean = false;
  maleGender : boolean = false


  constructor(private _eventEmitterService: EventEmitterService,private _formBuilder: FormBuilder,
                       private _utilityService: UtilityService,    private _cdr: ChangeDetectorRef,

    ) { }

  ngOnInit(): void {

    // form
    this.form = this._formBuilder.group({
      name: ['',[Validators.required]],
      designation : [''],
      company : [''],
      age : ['',[Validators.pattern("^[0-9]*$")]],
      gender : [''],
      mobile : ['',[Validators.required]],
      remarks : [''],
      email : ['',[Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    })


   
  }

   get f() {
     return this.form.controls; 
    }

  cancel() {
    this._eventEmitterService.dismissPersonInvolvedModalControl();
  }

  processData(){
    let saveData = {
      name: this.form.value.name ? this.form.value.name : '',
      designation: this.form.value.designation ? this.form.value.designation : '',
      company: this.form.value.company ? this.form.value.company : '',
      age: this.form.value.age ? this.form.value.age : '',
      gender: this.form.value.gender ? this.form.value.gender : '',
      mobile: this.form.value.mobile ? this.form.value.mobile : '',
      remarks: this.form.value.remarks ? this.form.value.remarks : '',
      email :  this.form.value.email ? this.form.value.email : ''
    }

    return saveData;
  }

  ngDoCheck(){
    if(IncidentStore.selectedIndexForEdit  !=  null && !this.form.value.name){
      this.setDataForEdit();
      this._utilityService.detectChanges(this._cdr)

    }
  }

  saveOtherInvolvedUserDetails(){
    // this.processFormErrors()

     if(IncidentStore.selectedIndexForEdit != null){
          IncidentStore.involvedOtherUserDetails.splice(IncidentStore.selectedIndexForEdit,1)
     }
  
      this.IncidentStore.setOtherInvolvedUserDetails(this.processData())
      this.maleGender = false;
      this.femaleGender = false
      IncidentStore.selectedIndexForEdit = null;
      this.form.reset();
      this._utilityService.detectChanges(this._cdr)
    
  }
 

  onCheckboxChange1(e,value) {
    const gender:any = value;
    if (e.target.checked) {
      this.maleGender = true
      this.femaleGender = false
      this.form.patchValue({
        gender: gender

      })
    } 
  }
  onCheckboxChange2(e,value) {
    const gender:any = value;
    if (e.target.checked) {
      this.maleGender = false
      this.femaleGender = true
      this.form.patchValue({
        gender: gender

      })
    } 
  }

  processFormErrors(){
    if(this.form.value.auditee_ids && this.form.value.auditee_ids.length>0){
    var errors = this.formErrors;
   
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
          if(key.startsWith('incident_damage_type_id.')){
           let keyValueSplit = key.split('.');
           let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['incident_damage_type_id'] = this.formErrors['incident_damage_type_id']? this.formErrors['incident_damage_type_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
    
      }
    }
   }
    this._utilityService.detectChanges(this._cdr);
  }

  setDataForEdit(){
    this.form.patchValue({
      name: IncidentStore.involvedOtherUserDetailsEdit[0].name ? IncidentStore.involvedOtherUserDetailsEdit[0].name : '',
      designation: IncidentStore.involvedOtherUserDetailsEdit ? IncidentStore.involvedOtherUserDetailsEdit[0].designation : '',
      company: IncidentStore.involvedOtherUserDetailsEdit ? IncidentStore.involvedOtherUserDetailsEdit[0].company : '',
      age: IncidentStore.involvedOtherUserDetailsEdit ? IncidentStore.involvedOtherUserDetailsEdit[0].age : '',
      gender: IncidentStore.involvedOtherUserDetailsEdit ? IncidentStore.involvedOtherUserDetailsEdit[0].gender : '',
      mobile: IncidentStore.involvedOtherUserDetailsEdit ? IncidentStore.involvedOtherUserDetailsEdit[0].mobile : '',
      remarks: IncidentStore.involvedOtherUserDetailsEdit ? IncidentStore.involvedOtherUserDetailsEdit[0].remarks : '',
      email : IncidentStore.involvedOtherUserDetailsEdit ? IncidentStore.involvedOtherUserDetailsEdit[0].email : '',
    })

    if(IncidentStore.involvedOtherUserDetailsEdit[0].gender == "male"){
      this.maleGender = true;
    }else{
      this.femaleGender = true
    }
    
    this._utilityService.detectChanges(this._cdr);

  }

}
