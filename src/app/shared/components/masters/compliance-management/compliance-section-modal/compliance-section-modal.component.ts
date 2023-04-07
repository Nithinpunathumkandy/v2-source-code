import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ComplianceSectionService } from 'src/app/core/services/masters/compliance-management/compliance-section/compliance-section.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ComplianceSectionMasterStore } from 'src/app/stores/masters/compliance-management/compliance-section-store';

@Component({
  selector: 'app-compliance-section-modal',
  templateUrl: './compliance-section-modal.component.html',
  styleUrls: ['./compliance-section-modal.component.scss']
})
export class ComplianceSectionModalComponent implements OnInit {

  @Input('source') ComplianceSectionSource: any;

  ComplianceSectionMasterStore = ComplianceSectionMasterStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _complianceSectionService: ComplianceSectionService,
    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {

    
    // Form Object to add Control Category
    
      this.form = this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required, Validators.maxLength(255)]],
        description: ['']
      });
    
    
    
      this.resetForm();
    
    
      // Checking if Source has Values and Setting Form Value
    
      if (this.ComplianceSectionSource) {
        this.setFormValues();
      }
      }
      ngDoCheck(){
        if (this.ComplianceSectionSource && this.ComplianceSectionSource.hasOwnProperty('values') && this.ComplianceSectionSource.values && !this.form.value.id)
          this.setFormValues();
      }
      
      setFormValues(){
        if (this.ComplianceSectionSource.hasOwnProperty('values') && this.ComplianceSectionSource.values) {
          let { id, title,description } = this.ComplianceSectionSource.values
          this.form.setValue({
            id: id,
            title: title,
            description:description
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
      closeFormModal() {
        this.resetForm();
        this._eventEmitterService.dismissComplianceSectionControlModal();
        this._eventEmitterService.dismisscomplianceRegisterFocusControl();
      }
      
      // function for add & update
      save(close: boolean = false) {
        this.formErrors = null;
        if (this.form.value) {
          let save;
          AppStore.enableLoading();
      
          if (this.form.value.id) {
            save = this._complianceSectionService.updateItem(this.form.value.id, this.form.value);
          } else {
            delete this.form.value.id
            save = this._complianceSectionService.saveItem(this.form.value);
          }
      
          save.subscribe((res: any) => {
            this.ComplianceSectionMasterStore.lastInsertedId = res.id
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
