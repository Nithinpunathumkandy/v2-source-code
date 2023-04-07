import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';

@Component({
  selector: 'app-add-incident-location',
  templateUrl: './add-incident-location.component.html',
  styleUrls: ['./add-incident-location.component.scss']
})
export class AddIncidentLocationComponent implements OnInit {
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  saved: boolean = false;

  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,private _utilityService: UtilityService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      location: ['', [Validators.required, Validators.maxLength(255)]]
    });
    this.form.markAsPristine();
    this.resetForm();
  }
  ngDoCheck(){
   if(!this.form.value.action  && IncidentInvestigationStore.investigationIncidentObjects.location !='' && this.saved == false && this.form.controls['location'].pristine){
    this.form.patchValue({
      location : IncidentInvestigationStore.investigationIncidentObjects.location
      
    })
    this._utilityService.detectChanges(this._cdr);


   }
  }

  editvalue(){
    // if(IncidentInvestigationStore.investigationIncidentObjects.action){
      this.form.patchValue({
        location : IncidentInvestigationStore.investigationIncidentObjects.location
        
      })
      this._utilityService.detectChanges(this._cdr);
    // }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
 }
 resetForm() {
   this.form.reset();
   this.form.controls['location'].markAsPristine();
   this.formErrors = null;
   AppStore.disableLoading();
 }
 
 save(){
  this.saved = true;
   IncidentInvestigationStore.investigationIncidentObjects.location = this.form.value.location;
   this._utilityService.showSuccessMessage('success','incident_location_added');
   this._utilityService.detectChanges(this._cdr);
   this.resetForm();
 
 }
 cancel(){
  this.saved =false;
  this.resetForm();
  this._utilityService.detectChanges(this._cdr);
 }

}
