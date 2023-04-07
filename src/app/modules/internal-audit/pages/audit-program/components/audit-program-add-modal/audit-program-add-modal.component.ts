import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-audit-program-add-modal',
  templateUrl: './audit-program-add-modal.component.html',
  styleUrls: ['./audit-program-add-modal.component.scss']
})
export class AuditProgramAddModalComponent implements OnInit {
  @Input('source') AuditProgramSource: any;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  res_id;
  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _utilityService: UtilityService,
    private _auditProgramService: AuditProgramService) { }

  ngOnInit(): void {

    // Form Object to add Audit Program

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      from: ['',[Validators.required]],
      to: ['',[Validators.required]],
      description: [''],
      import_auditable_items: false,
      import_risks: false,
      import_processes: false
    });
    
    // reset form initially
    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.AuditProgramSource) {
      if (this.AuditProgramSource.hasOwnProperty('values') && this.AuditProgramSource.values) {
        this.form.setValue({
          id: this.AuditProgramSource.values.id,
          title: this.AuditProgramSource.values.title,
          description: this.AuditProgramSource.values.description,
          from: this.AuditProgramSource.values.from,
          to: this.AuditProgramSource.values.to,
          import_auditable_items: false,
          import_risks: false,
          import_processes: false
        })
      }
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
    
    if(this.res_id!=null){
      this._router.navigateByUrl("/internal-audit/audit-programs/" + this.res_id);
    }
    this._eventEmitterService.dismissAddAuditProgramModal();
  }



  processDataForSave() {
    let saveData = {
      "id": this.form.value.id ? this.form.value.id : '',
      "title": this.form.value.title ? this.form.value.title : '',
      "description": this.form.value.description ? this.form.value.description : '',
      "from": this.form.value.from ? this._helperService.processDate(this.form.value.from, 'join') : '',
      "to": this.form.value.to ? this._helperService.processDate(this.form.value.to, 'join') : '',
      "import_auditable_items": this.form.value.import_auditable_items ? this.form.value.import_auditable_items : false,
      "import_risks": this.form.value.import_risks ? this.form.value.import_risks : false,
     "import_processes": this.form.value.import_processes ? this.form.value.import_processes : false,
    }

    return saveData;
  }

  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;

    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._auditProgramService.updateItem(this.form.value.id, this.processDataForSave());
      } else {
        delete this.form.value.id
        save = this._auditProgramService.saveItem(this.processDataForSave());
      }

      save.subscribe((res: any) => {
        this.res_id = res.id;// assign id to variable;
        if (!this.form.value.id) {
          this.resetForm();
        }
       
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
       
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}