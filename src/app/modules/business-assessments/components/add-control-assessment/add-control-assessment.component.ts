import { Component, OnInit,Input , ElementRef, ViewChild, ChangeDetectorRef,Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FrameworksStore } from 'src/app/stores/business-assessments/frameworks.store';
import { ControlAssessmentDetailsStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-details-store';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { FrameworksService } from 'src/app/core/services/business-assessments/frameworks/frameworks.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ControlAssessmentInnerDetailsService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-inner-details/control-assessment-inner-details.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { ControlAssessmentStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment.store';
import { MaturityModalService } from 'src/app/core/services/business-assessments/maturity-modal/maturity-modal.service';
declare var $: any;
@Component({
  selector: 'app-add-control-assessment',
  templateUrl: './add-control-assessment.component.html',
  styleUrls: ['./add-control-assessment.component.scss']
})
export class AddControlAssessmentComponent implements OnInit {
  @Input('source') controlAssessmentSource: any;
  @ViewChild('formModal') formModal: ElementRef;
  form: FormGroup;
  FrameworksStore = FrameworksStore;
  ControlAssessmentDetailsStore=ControlAssessmentDetailsStore;
  ControlAssessmentStore=ControlAssessmentStore;
  AppStore = AppStore;
  formErrors = null;
  frameworkSubscriptionEvent:any;
  maturityModels=[];
  frameworkObject = {
    component: 'control_assessment',
    values: null,
    type: null
  };
  config = {
 toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      
      '|',
      'bold',
      'italic',
     
      '|',
      'link',
      'imageUpload',
      '|',
     
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'insertTable',
      'blockQuote',
      
    ],
    language: 'id',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    }
  };
  public Editor;
  public Config;

  constructor(
    private _formBuilder:FormBuilder,
    private _utilityService:UtilityService,
    private _eventEmitterService:EventEmitterService,
    private _cdr:ChangeDetectorRef, 
    private _frameworksService: FrameworksService,
    private _controlAssessmentInnerDetailsService: ControlAssessmentInnerDetailsService,
    private _helperService:HelperServiceService,
    private _maturityModalService: MaturityModalService

    ) { this.Editor = myCkEditor;}
    public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id:[null],
      business_assessment_framework_id: [null, [Validators.required]],
      title: ['', [Validators.required]],
      description: [''],
      maturity_model_id:[null, [Validators.required]],
      document_version_id: [''],

    });
    this.frameworkSubscriptionEvent = this._eventEmitterService.frameworkControl.subscribe(res => {
      this.closeFrameworkModal();
    })

  }
  ngDoCheck(){
    if (this.controlAssessmentSource && this.controlAssessmentSource.hasOwnProperty('values') && this.controlAssessmentSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.controlAssessmentSource.hasOwnProperty('values') && this.controlAssessmentSource.values) {
      let { id, title,description,business_assessment_framework,maturity_model_id} = this.controlAssessmentSource.values
      this.form.patchValue({
        id:id,
        title:title,
        description: description,
        business_assessment_framework_id: business_assessment_framework.id,
        maturity_model_id:maturity_model_id?.id
      })
      this.getFrameworkDetails()
      this.searchFramework({term:business_assessment_framework?.id})
     //this.filterMaturityModel();
      // AssessmentsStore.activeFile=res.document_version;
      // AssessmentsStore.activeFile['document_version_id'] = res.document_version.id
      // this.getData();
     
    }
  }
  // filterMaturityModel()
  // {
  //   const data=this.maturityModels.find(e=>e.id==this.form.value.maturity_model_id)
  // }
  closeFormModal() {
    this.form.reset();
    this._eventEmitterService.dismissControlAssessmentModal();
 
   }
   getFramework() {
    this._frameworksService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchFramework(e) {
    this._frameworksService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  addNewFramework(){
    // this.form.reset();
    this.frameworkObject.type = 'Add';
    this.frameworkObject.values=null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
 
  }
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  closeFrameworkModal() {
    this.frameworkObject.type = null;
    $(this.formModal.nativeElement).modal('hide');
      if(FrameworksStore.lastInsertedId){
       
        this._frameworksService.getItems(false,'q=' + FrameworksStore.lastInsertedId+'&is_control_assessment=true').subscribe(res => {
          for(let i of res['data']){
            if(i.id == FrameworksStore.lastInsertedId){
              this.form.patchValue({
                business_assessment_framework_id:i.id
              })
            }
          }
          this._utilityService.detectChanges(this._cdr);
        })
      
      }
    
  }
   save(close: boolean = false) {
    this.formErrors = null;
    let save;
    this.form.patchValue({
      document_version_id:ControlAssessmentStore?.docversionId
    })
    AppStore.enableLoading();
    if (this.form.value.id) {
      save = this._controlAssessmentInnerDetailsService.updateItem(this.form.value.id, this.form.value);
    } else {

      save = this._controlAssessmentInnerDetailsService.saveItem(this.form.value);
    }
    save.subscribe((res: any) => {
      ControlAssessmentDetailsStore.lastInsertedId = res['id'];
      AppStore.disableLoading();
      // this._utilityService.detectChanges(this._cdr);
      if (!this.form.value.id) {
        this.form.reset();
      }
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {

        // this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.closeFormModal();
          //this._router.navigateByUrl('/business-assessments/maturity-models/'+MaturityModalStore.lastInsertedId)
        }
        
      }, 300);

    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      if (err.status == 403 || err.status == 500) {
        this.closeFormModal();
      }
      this._utilityService.detectChanges(this._cdr);
    });
   }

   getFrameworkDetails()
   {
    if(this.form.value.business_assessment_framework_id)
    {
      this._frameworksService.getItem(this.form.value.business_assessment_framework_id).subscribe(res => {
        this.maturityModels=res.maturity_models;
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else{
      this.maturityModels=[];
    }
    
   }

   ngOnDestroy(){
    this.frameworkSubscriptionEvent.unsubscribe();
  }

}
