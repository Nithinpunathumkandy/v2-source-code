import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

@Component({
  selector: 'app-involved-witness-person-other-details',
  templateUrl: './involved-witness-person-other-details.component.html',
  styleUrls: ['./involved-witness-person-other-details.component.scss']
})
export class InvolvedWitnessPersonOtherDetailsComponent implements OnInit {
  @Input ('source') page: any;

  form: FormGroup;
  formErrors: any;
  IncidentStore = IncidentStore;
  AppStore = AppStore
  constructor(private _eventEmitterService: EventEmitterService,private _formBuilder: FormBuilder,
              private _utilityService: UtilityService,    private _cdr: ChangeDetectorRef,
              private _investigationService : InvestigationService, private _incidentService : IncidentService,
              private _helperService: HelperServiceService,) { }

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
    this._eventEmitterService.dismissWitnessDetailsModalControl();
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
    // console.log(this.formErrors);
    if(this.form.value.auditee_ids && this.form.value.auditee_ids.length>0){
    var errors = this.formErrors;
   
    // for (var key in errors) {
    //   if (errors.hasOwnProperty(key)) {
    //       if(key.startsWith('incident_damage_type_id.')){
    //        let keyValueSplit = key.split('.');
    //        let errorPosition = parseInt(keyValueSplit[1]);
    //       // console.log(key);
    //       this.formErrors['incident_damage_type_id'] = this.formErrors['incident_damage_type_id']? this.formErrors['incident_damage_type_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
    //       }
    
    //   }
    // }
   }
    this._utilityService.detectChanges(this._cdr);
  }
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
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

  saveOtherWitnessUserDetails(close:boolean = false){

//     if(IncidentStore.selectedIndexForWitnessEdit != null){
//       IncidentStore.involvedWitnessUserDetails.splice(IncidentStore.selectedIndexForWitnessEdit,1)
//  }
//  this.IncidentStore.setOtherInvolvedUserDetails(this.processData())
AppStore.enableLoading();

 let save 
 if(this.page == 'incident'){
 save = this._incidentService.addIncidentInvolvedWitnessOtherUser(this.processData())
 }else {
   save = this._investigationService.addInvestigationInvolvedWitnessOtherUser(this.processData())
 }
 save.subscribe(res=>{
  AppStore.disableLoading();
   this._utilityService.detectChanges(this._cdr) 
   this.form.reset();
   if(close){
     this.cancel();
   }
 }, (err: HttpErrorResponse) => {
  AppStore.disableLoading();
  if (err.status == 422) {
    this.formErrors = err.error.errors;
    this.processFormErrors();
  }else if(err.status == 500 || err.status == 403){
    this.cancel();
  }
},)
    this.IncidentStore.setOtherWitnessUserDetails(this.processData())
    this.form.reset();
    IncidentStore.selectedIndexForWitnessEdit = null;
    this._utilityService.detectChanges(this._cdr)
  }

}
