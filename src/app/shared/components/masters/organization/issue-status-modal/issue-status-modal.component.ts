import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { IssueStatusMasterStore } from 'src/app/stores/masters/organization/issue-status-master.store';
import { IssueStatusService } from 'src/app/core/services/masters/organization/issue-status/issue-status.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-issue-status-modal',
  templateUrl: './issue-status-modal.component.html',
  styleUrls: ['./issue-status-modal.component.scss']
})
export class IssueStatusModalComponent implements OnInit {
  @Input('source') IssueStatusSource: any;

  form: FormGroup;
  reactionDisposer: IReactionDisposer;
  formErrors: any;
  AppStore = AppStore;
  IssueStatusMasterStore = IssueStatusMasterStore;

  constructor( private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _formBuilder: FormBuilder,
    private _issueStatusService: IssueStatusService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]]
    });

        // restingForm on initial load
     this.resetForm();

     // Checking if Source has Values and Setting Form Value

  if (this.IssueStatusSource) {
    this.setFormValues();
  }

  }

  ngDoCheck(){
    if (this.IssueStatusSource && this.IssueStatusSource.hasOwnProperty('values') && this.IssueStatusSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.IssueStatusSource.hasOwnProperty('values') && this.IssueStatusSource.values) {
      let { id, title} = this.IssueStatusSource.values
      this.form.setValue({
        id: id,
        title: title
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
  this._eventEmitterService.dismissIssueStatusModal();
 
}
// getting description count

getDescriptionLength(){
  var regex = /(<([^>]+)>)/ig;
  var result = this.form.value.description.replace(regex,"");
  return result.length;
}

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._issueStatusService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._issueStatusService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if(!this.form.value.id)
        this.resetForm();
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

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancel();

    }

  }

//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}
}
