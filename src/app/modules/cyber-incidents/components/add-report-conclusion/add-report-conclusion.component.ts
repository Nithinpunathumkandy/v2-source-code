import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input , ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CyberIncidentService } from 'src/app/core/services/cyber-incident/cyber-incident.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CyberReportStore } from 'src/app/stores/cyber-incident/cyber-incident-report';

@Component({
  selector: 'app-add-report-conclusion',
  templateUrl: './add-report-conclusion.component.html',
  styleUrls: ['./add-report-conclusion.component.scss']
})
export class AddReportConclusionComponent implements OnInit {
  @Input('source') Source: any;
  CyberReportStore=CyberReportStore;
  AppStore=AppStore;
  form: FormGroup;
  formErrors:any;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cyberIncidentService:CyberIncidentService,
    private _utilityService:UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    console.log(this.Source);
    this.form = this._formBuilder.group({
      id: [this.Source.values.id],
      description:[this.Source.values.description]
    });
  }

  closeFormModal() {
    this.form.reset();
    this._eventEmitterService.dismissCyberInccidentCommentModal();
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false)
  {
    let save;
    AppStore.enableLoading();
    save = this._cyberIncidentService.addReportComment(4,this.form.value);
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
       // console.log( this.formErrors.impact_analysis_details)
      } else if(err.status == 500 || err.status == 403){
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }

}
