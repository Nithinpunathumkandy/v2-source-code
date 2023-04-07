import { Component, OnInit, ChangeDetectorRef, Input, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import {EventStrategicThemesService} from 'src/app/core/services/event-monitoring/event-strategic-themes/event-strategic-themes.service'
import { ObjectiveTypeService } from 'src/app/core/services/masters/event-monitoring/objective-type/objective-type.service';
import { ObjectiveTypeMasterStore } from 'src/app/stores/masters/event-monitoring/objective-type-store';
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-add-event-objective',
  templateUrl: './add-event-objective.component.html',
  styleUrls: ['./add-event-objective.component.scss']
})
export class AddEventObjectiveComponent implements OnInit {
  @Input('source') eventObjectiveSource: any;
  @ViewChild('objectiveTypeAddformModal', { static: true }) objectiveTypeAddformModal: ElementRef;
  objectiveForm: FormGroup;
  formErrors: any;
  objectiveTypeSubscriptionEvent : any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  ObjectiveTypeMasterStore = ObjectiveTypeMasterStore;
  objectiveTypeObject = {
    component: 'Master',
    type: null,
    values: null
  };
  constructor(private _formBuilder: FormBuilder,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _eventStrategicThemesService: EventStrategicThemesService,
    private _eventEmitterService: EventEmitterService, private _helperService: HelperServiceService,
    private _objectiveTypeService : ObjectiveTypeService,
    private _renderer2:Renderer2
   ) { }

  ngOnInit(): void {
    this.getObjectiveType();
    this.objectiveForm = this._formBuilder.group({
      title: [null,[Validators.required]],
      id:null,
      event_objective_type_id:[null, [Validators.required]],
    });
    if (this.eventObjectiveSource.type == 'Edit') {
      this.setFormValues();
    }

    this.objectiveTypeSubscriptionEvent = this._eventEmitterService.objectiveType.subscribe(res=>{
      this.closeObjectiveTypeMasterModal();
    });
  }

  getObjectiveType() {
    this._objectiveTypeService.getItems().subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })


  }
  searchObjectiveType(event) {
    this._objectiveTypeService.getItems(false, '&q=' + event.term).subscribe(res => {
      this.objectiveForm.patchValue({event_objective_type_id:ObjectiveTypeMasterStore.lastInsertedObjectiveType});
        this.getObjectiveType();
        this._utilityService.detectChanges(this._cdr);
    });
  }

  openObjectiveType(){
    this.objectiveTypeObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.objectiveTypeMasterModal();
  }

  objectiveTypeMasterModal() {
    this._renderer2.addClass(this.objectiveTypeAddformModal.nativeElement,'show');
    this._renderer2.setStyle(this.objectiveTypeAddformModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.objectiveTypeAddformModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeObjectiveTypeMasterModal() {
    this.objectiveTypeObject.type = null;
    this._renderer2.removeClass(this.objectiveTypeAddformModal.nativeElement,'show');
    this._renderer2.setStyle(this.objectiveTypeAddformModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.objectiveTypeAddformModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchObjectiveType({term : ObjectiveTypeMasterStore.lastInsertedObjectiveType})
    

  }


  setFormValues(){
    if (this.eventObjectiveSource.hasOwnProperty('values') && this.eventObjectiveSource.values) {
      this.objectiveForm.patchValue({
        title:this.eventObjectiveSource.values.title,
        id:this.eventObjectiveSource.values.id,
        event_objective_type_id:this.eventObjectiveSource.values.type_title,
      })
      this._utilityService.detectChanges(this._cdr);
    }
  }
  closeFormModal(){
    this._eventEmitterService.dismissEventObjectModal();
    this.formErrors = null;
    this.objectiveForm.reset();
  }
   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  save(close?)
  {
    let save: any;
    this.formErrors = null;
    AppStore.enableLoading();
    if (this.eventObjectiveSource.type=='Edit') {
      save = this._eventStrategicThemesService.updateObjective(this.objectiveForm.value,this.objectiveForm.value.id);
    }
    else
    {
      save = this._eventStrategicThemesService.saveObjective(this.objectiveForm.value);
    }
    
    // }
    save.subscribe(res=>{
      AppStore.disableLoading();
      this.objectiveForm.reset();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if(close) this.closeFormModal();
      
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  ngOnDestroy(){
    this.objectiveTypeSubscriptionEvent.unsubscribe();
  }

}
