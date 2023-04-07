import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';

@Component({
  selector: 'app-add-incident-at',
  templateUrl: './add-incident-at.component.html',
  styleUrls: ['./add-incident-at.component.scss']
})
export class AddIncidentAtComponent implements OnInit {
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  saved: boolean = false;

  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,private _utilityService: UtilityService) { }

  ngOnInit(): void {
    $(document).ready(function(){
      $("#startId,#startIdButton,#endId,#endIdButton").click(function(){
         $(".cdk-overlay-container").css({ "font-position": "fixed","z-index": "9999999"});
       });
     });
    this.form = this._formBuilder.group({
      id: [''],
      incident_at: ['', [Validators.required, Validators.maxLength(255)]]
    });

  

    this.resetForm();
  }

  ngDoCheck(){
   if(!this.form.value.incident_at  && IncidentInvestigationStore.investigationIncidentObjects.incident_at !='' && this.saved == false){
    
    this.form.patchValue({
      incident_at : new Date (IncidentInvestigationStore.investigationIncidentObjects.incident_at)
      
    })
    this._utilityService.detectChanges(this._cdr);


   }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
 }
 cancel(){
  this.saved = false;
   
}
 resetForm() {
   this.form.reset();
   this.form.pristine;
   this.formErrors = null;
   AppStore.disableLoading();
 }
 
 save(){

   IncidentInvestigationStore.investigationIncidentObjects.incident_at = this.form.value.incident_at;
   this.saved = true;
   this._utilityService.showSuccessMessage('success','incident_at__added');
   this._utilityService.detectChanges(this._cdr);
   this.resetForm();
 
 }

 incidentMaxDate(){
  let curDate = new Date();
  curDate.setDate(curDate.getDate()-1);
  return curDate;
}



}
