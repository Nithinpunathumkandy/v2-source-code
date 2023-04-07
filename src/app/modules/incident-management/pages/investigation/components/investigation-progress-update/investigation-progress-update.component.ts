import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';

@Component({
  selector: 'app-investigation-progress-update',
  templateUrl: './investigation-progress-update.component.html',
  styleUrls: ['./investigation-progress-update.component.scss']
})
export class InvestigationProgressUpdateComponent implements OnInit {
  statuses:any = [];
  AppStore = AppStore;
  IncidentInvestigationStore = IncidentInvestigationStore;
  form: FormGroup;
  formErrors=null;
  constructor(private  _eventEmitterService: EventEmitterService,private _helperService: HelperServiceService,
       private _utilityService: UtilityService,private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,     private _imageService: ImageServiceService,
    private _investigationService : InvestigationService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      incident_investigation_status_id: [null],
      comment : ''
    })
this.getInvestigationStatus();

  }

  cancel() {
    this._eventEmitterService.dismissInvestigationProgressModalControl();
  }

  getInvestigationStatus(){
    this.statuses = [];
    this._investigationService.getInvestigationStatus().subscribe(res => {
      for(let i of res['data']){
        if(i.type=='new' || i.type == 'wip' || i.type == 'resolved' || i.type=='closed'){
          this.statuses.push(i);
        }
      }
      this._utilityService.detectChanges(this._cdr);
      // this.statuses = res['data']
    });
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  searchStatus(e){
   
    // this._userService.searchUsers('?q=' + e.term).subscribe(res => {
    //   this._utilityService.detectChanges(this._cdr);
    // })
  // }
  }

  save( close : boolean = false){
    let saveData={
      incident_investigation_status_id : this.form.value.incident_investigation_status_id ? this.form.value.incident_investigation_status_id : null,
      comment : this.form.value.comment ?  this.form.value.comment : ''
    }
    AppStore.enableLoading();
    this._investigationService.saveInvestigationProgress(saveData).subscribe(res=>{
      if(close){
        this.cancel();
      }
      this.form.reset;
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if(err.status == 500 || err.status==404){
        this.cancel();
         AppStore.disableLoading();
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
       AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

}
