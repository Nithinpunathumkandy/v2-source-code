import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AnnualSummaryService } from 'src/app/core/services/ms-audit-management/annual-summary/annual-summary.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
@Component({
  selector: 'app-annual-summary-form',
  templateUrl: './annual-summary-form.component.html',
  styleUrls: ['./annual-summary-form.component.scss']
})
export class AnnualSummaryFormComponent implements OnInit {

  @Input('summaryData')summaryData


  AppStore=AppStore;

  annualSummaryForm:FormGroup;
  annualSummaryFormErrors:any;

  constructor(
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _auditAnnualSummaryService:AnnualSummaryService,
    private _helperService: HelperServiceService,

  ) { }

  ngOnInit(): void {

    // this.resetForm()
    this.annualSummaryForm = this._formBuilder.group({
      // id: [''],
      // title: ['',[Validators.required, Validators.maxLength(255)]],
      description: [''],
    })


    if (this.summaryData.hasOwnProperty('values') && this.summaryData.values) 
    this.setSummaryData()

  }

  setSummaryData(){
    this.annualSummaryForm.patchValue({
      // id:this.summaryData.values?.id?this.summaryData.values.id:null,
      // title:this.summaryData.values?.id?this.summaryData.values.title:'',
      description:this.summaryData.values?.id?this.summaryData.values.description:''
    })
  }


  save(close:boolean=false){
    this.annualSummaryFormErrors=null;
    if (this.annualSummaryForm.value) {

      let save
      AppStore.enableLoading();

      if (this.summaryData.values.id) {
        save = this._auditAnnualSummaryService.updateSummary(this.summaryData.values.id, this.annualSummaryForm.value)
      } 
      save.subscribe((res: any) => {
         this.resetForm()
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeSummaryForm();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.annualSummaryFormErrors = err.error.errors;
          this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
        }
      });
    }
  }

  closeSummaryForm(){
    this._eventEmitterService.dismissAuditAnnualSummaryModal()
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


  resetForm() {

    this.annualSummaryForm.reset();
    this.annualSummaryForm.pristine;
    this.annualSummaryForm = null;
  }

}
