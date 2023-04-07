import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssueService } from 'src/app/core/services/masters/organization/issue/issue.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { IssueMasterStore } from 'src/app/stores/masters/organization/issue-master.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {
  @Input('source') IssuesSource: any;

  form: FormGroup;
  reactionDisposer: IReactionDisposer;
  formErrors: any;
  AppStore = AppStore;
  IssueMasterStore = IssueMasterStore;

  constructor(private _formBuilder: FormBuilder,
    private _issueService: IssueService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });

        // restingForm on initial load
     this.resetForm();

     // Checking if Source has Values and Setting Form Value

  if (this.IssuesSource) {
    this.setFormValues();
  }

  }

  ngDoCheck(){
    if (this.IssuesSource && this.IssuesSource.hasOwnProperty('values') && this.IssuesSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.IssuesSource.hasOwnProperty('values') && this.IssuesSource.values) {
      let { id, title ,description} = this.IssuesSource.values
      this.form.setValue({
        id: id,
        title: title,
        description: description
      })
    }
  }


   // for resetting the form
resetForm() {
  this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  AppStore.disableLoading();
}
// cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();


}

// for closing the modal
closeFormModal(){
  this.resetForm();
  this._eventEmitterService.dismissIssueModal();
 
}
// getting description count

getDescriptionLength(){
  var regex = /(<([^>]+)>)/ig;
  var result = this.form.value.description.replace(regex,"");
  return result.length;
}

save(close: boolean = false) {
  this.formErrors = null;
  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._issueService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      save = this._issueService.saveItem(this.form.value,true);
    }

    save.subscribe((res: any) => {
       if(!this.form.value.id){
       this.resetForm();}
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
      else if(err.status == 500 || err.status == 403){
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      
    });
  }
 }

//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  if(event.key == 'Escape' || event.code == 'Escape'){
      this.cancel();
  }
}

}
