import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';

@Component({
  selector: 'app-add-incident-action-taken',
  templateUrl: './add-incident-action-taken.component.html',
  styleUrls: ['./add-incident-action-taken.component.scss']
})
export class AddIncidentActionTakenComponent implements OnInit {
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  saved: boolean = false;


  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,private _utilityService: UtilityService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      action: ['', [Validators.required, Validators.maxLength(255)]]
    });

  //  this.editvalue();
  this.form.markAsPristine();
    this.resetForm();
  }

  ngDoCheck(){
    
   if(!this.form.value.action  && IncidentInvestigationStore.investigationIncidentObjects.action !='' && this.saved == false && this.form.controls['action'].pristine){
    this.form.patchValue({
      action : IncidentInvestigationStore.investigationIncidentObjects.action
      
    })
    this._utilityService.detectChanges(this._cdr);


   }
  }

 

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
 }
 resetForm() {
   this.form.reset();
  //  this.form.pristine;
   this.form.controls['action'].markAsPristine();
   this.formErrors = null;
   AppStore.disableLoading();
 }
 
 save(){
  this.saved = true;
   IncidentInvestigationStore.investigationIncidentObjects.action = this.form.value.action;
   this._utilityService.showSuccessMessage('success','incident_action_taken_added');
   this._utilityService.detectChanges(this._cdr);
   this.resetForm();
 
 }
 cancel(){
  this.saved =false;
  this.resetForm();
  this._utilityService.detectChanges(this._cdr);
 }

}
