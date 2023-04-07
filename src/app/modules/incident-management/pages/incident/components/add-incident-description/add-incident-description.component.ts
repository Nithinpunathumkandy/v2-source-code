import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';

@Component({
  selector: 'app-add-incident-description',
  templateUrl: './add-incident-description.component.html',
  styleUrls: ['./add-incident-description.component.scss']
})
export class AddIncidentDescriptionComponent implements OnInit {
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  saved: boolean = false;

  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,private _utilityService: UtilityService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      description: ['', [Validators.required]]
    });

  
    this.form.markAsPristine();
    this.resetForm();
  }

  ngDoCheck(){
    if(!this.form.value.description  && IncidentInvestigationStore.investigationIncidentObjects.description != '' && this.saved == false && this.form.controls['description'].pristine){
     this.form.patchValue({
      description : IncidentInvestigationStore.investigationIncidentObjects.description
       
     })
     this._utilityService.detectChanges(this._cdr);
 
    }
   }


  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
 }
 resetForm() {
   this.form.reset();
   this.form.controls['description'].markAsPristine();
   this.formErrors = null;
   AppStore.disableLoading();
 }
 
 save(){
  this.saved = true;
   IncidentInvestigationStore.investigationIncidentObjects.description = this.form.value.description;
   this._utilityService.detectChanges(this._cdr);
   this.resetForm();
 
 }

 cancel(){
  this.saved =false;
  this.resetForm();
  this._utilityService.detectChanges(this._cdr);
}

}
