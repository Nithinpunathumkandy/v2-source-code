import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';

@Component({
  selector: 'app-add-incident-title',
  templateUrl: './add-incident-title.component.html',
  styleUrls: ['./add-incident-title.component.scss']
})
export class AddIncidentTitleComponent implements OnInit {
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  saved: boolean = false;

  constructor(    private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,private _utilityService: UtilityService
    ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]]
    });
    this.form.markAsPristine();
    this.resetForm();
  }

  ngDoCheck(){
    if(!this.form.value.title  && IncidentInvestigationStore.investigationIncidentObjects.title != '' && this.saved == false && this.form.controls['title'].pristine){
     this.form.patchValue({
       title : IncidentInvestigationStore.investigationIncidentObjects.title
     })
     this._utilityService.detectChanges(this._cdr);
 
    }
   }

  // save(close: boolean = false) {
  //   this.formErrors = null;
  //   if (this.form.value) {
  //     let save;
  //     AppStore.enableLoading();

  //     if (this.form.value.id) {
  //       // save = this._auditableItemCategoryService.updateItem(this.form.value.id, this.form.value);
  //     } else {
  //       delete this.form.value.id
  //       // save = this._auditableItemCategoryService.saveItem(this.form.value);
  //     }

  //     save.subscribe((res: any) => {
  //       if(!this.form.value.id){
  //       this.resetForm();}
  //       AppStore.disableLoading();
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //       }, 500);
  //       if (close) this.closeFormModal();
  //     }, (err: HttpErrorResponse) => {
  //       if (err.status == 422) {
  //         this.formErrors = err.error.errors;}
  //         else if(err.status == 500 || err.status == 403){
  //           this.closeFormModal();
  //         }
  //         AppStore.disableLoading();
  //         this._utilityService.detectChanges(this._cdr);
        
  //     });
  //   }
  // }

  //getting button name by language
getButtonText(text){
   return this._helperService.translateToUserLanguage(text);
}
resetForm() {
  this.form.reset();
  this.form.controls['title'].markAsPristine();
  this.formErrors = null;
  AppStore.disableLoading();
}

save(){
  this.saved = true;
  IncidentInvestigationStore.investigationIncidentObjects.title = this.form.value.title;
  this._utilityService.detectChanges(this._cdr);
  this._utilityService.showSuccessMessage('success','incident_title_added');
  this.resetForm();

}

cancel(){
  this.saved =false;
  this.resetForm();
  this._utilityService.detectChanges(this._cdr);
}

}
