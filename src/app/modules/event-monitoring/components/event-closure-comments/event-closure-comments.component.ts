import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { EventClosureMainStore } from 'src/app/stores/event-monitoring/event-closure-main-store';
import { EventClosureEventDetailsService } from 'src/app/core/services/event-monitoring/event-closure-event-details/event-closure-event-details.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-event-closure-comments',
  templateUrl: './event-closure-comments.component.html',
  styleUrls: ['./event-closure-comments.component.scss']
})
export class EventClosureCommentsComponent implements OnInit {

  @Input('source') source

  AppStore = AppStore;
  EventClosureMainStore = EventClosureMainStore  
  title: string;
  comments:string
  formErrors: any;
  form: FormGroup;

  constructor(
    private _helperService: HelperServiceService,    
    private _closureWorkflowService: EventClosureEventDetailsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    console.log(this.source)
  }

  getButtonText(text) {    
    return this._helperService.translateToUserLanguage(text);   
  }

  save(close: boolean = false) {

    let save;
  AppStore.enableLoading();  
  
  let comment = {
    comment:this.comments
  }
      if(this.source.title=='reject')
        save = this._closureWorkflowService.rejectClosures(EventClosureMainStore.closureId,comment);
    
      if(this.source.title=='revert')
        save = this._closureWorkflowService.revertClosures(EventClosureMainStore.closureId,comment);
        
  save.subscribe(
    (res: any) => {
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
    },
    (err: HttpErrorResponse) => {
      // AppStore.disableLoading();
      //   this._utilityService.showErrorMessage(
      //     "Error!",
      //     "Something went wrong. Please try again."
      //   );
      // this._utilityService.detectChanges(this._cdr);
      AppStore.disableLoading();
      if (err.status == 422) {
        this.formErrors = err.error;
        // this.processFormErrors()
      } else {
        this._utilityService.showErrorMessage(
          "Error!",
          "Something went wrong. Please try again."
        );
        this._utilityService.detectChanges(this._cdr);
      }
    }
  );

}

cancel() {
  this.closeFormModal();
}

closeFormModal() {
  AppStore.disableLoading();
  this.comments = null;
  this._eventEmitterService.dismissClosureWorkflowComment()
}

ngOnDestroy() {
  this.formErrors = null;
  this.comments = null;
}

}
