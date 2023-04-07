import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FrameworksService } from 'src/app/core/services/business-assessments/frameworks/frameworks.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { FrameworksStore } from 'src/app/stores/business-assessments/frameworks.store';
import { MaturityModalService } from 'src/app/core/services/business-assessments/maturity-modal/maturity-modal.service';
import { MaturityModalStore } from 'src/app/stores/business-assessments/maturity-modal/maturity-modal-store';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-framework-modal',
  templateUrl: './framework-modal.component.html',
  styleUrls: ['./framework-modal.component.scss']
})
export class FrameworkModalComponent implements OnInit {
  @Input('source') frameworkSource: any;

  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  AppStore = AppStore;
  formErrors = null;
  optionTitle = null;
  optionScore = null;
  applicable: boolean = false;
  rangeWarning:boolean=false;
  duplicateScore:boolean=false;
  optionArray = [];
  listOfMaturityLevels=[];
  title = '';
  description = '';
  maturity_model_ids=null;
  scoreTotal = null;
  cancelEventSubscription: any;
  confirmationObject = {
		title: 'Cancel?',
		subtitle: 'This action cannot be undone',
		type: 'Cancel'
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
  form: FormGroup;
  FrameworksStore = FrameworksStore;
  MaturityModalStore = MaturityModalStore;
  public Editor;
  public Config;

  constructor(private _frameworksService: FrameworksService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _helperService:HelperServiceService,
    private _maturityModalService: MaturityModalService,
    private _router: Router,
    private _http: HttpClient) { 
      this.Editor = myCkEditor;
     }
    
     public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }

  ngOnInit(): void {

    // ClassicEditor
    // .create( document.querySelector( '#fdescription' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      is_control_assessment: [''],
      description: [''],
      business_assessment_framework_options: [[]],
      maturity_model_ids: [[],[Validators.required]],

    });
    if (this.frameworkSource) {
      this.setFormValues();
    }

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.cancelByUser(item);
		})
    MaturityModalStore.unsetIndiviudalMaturityModalDetails();

    
  }

  // setValidation()
  // {
  //   if(this.form.value.is_control_assessment)
  //   {
  //       this.form.controls['maturity_model_ids'].setValidators([Validators.required])
  //       this.form.controls['maturity_model_ids'].updateValueAndValidity()
  //   }
  //   else{
  //     this.form.controls['maturity_model_ids'].setValidators(null);
  //     this.form.controls['maturity_model_ids'].updateValueAndValidity();
  //   }
  // }

  getAllMaturityModel() {
    this._maturityModalService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }
  searchMaturityModal(e)
  {
    this._maturityModalService.getItems(false,'q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  

  getDetailsModel(item?)
  {
    this.listOfMaturityLevels=[];
    if(item)
    {
      for(let i of item)
      {
        this._maturityModalService.getItem(i).subscribe(res => {
          this.listOfMaturityLevels.push(res);
          this._utilityService.detectChanges(this._cdr);
        })
      }
    }
    else{
      for(let i of this.form.value.maturity_model_ids)
      {
        this._maturityModalService.getItem(i?.id?i.id:i).subscribe(res => {
          this.listOfMaturityLevels.push(res);
          this._utilityService.detectChanges(this._cdr);
        })
      }
    }
    
  }

  cancelByUser(status) {
		if (status) {
      this.form.reset();
      this.formErrors = null;
       this.scoreTotal = null;
       this.unsetFields();
      this._eventEmitterService.dismissFrameworkModal();
		}
		setTimeout(() => {
			$(this.cancelPopup.nativeElement).modal('hide');
		}, 250);
	}

  confirmCancel() {
		setTimeout(() => {
			$(this.cancelPopup.nativeElement).modal('show');
		}, 100);

	}

  MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' )
    .createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader, this._http );
    };
}

  ngDoCheck(){
    if (this.frameworkSource && this.frameworkSource.hasOwnProperty('values') && this.frameworkSource.values && !this.form.value.id)
      this.setFormValues();
  }

  closeFormModal() {
   this.form.reset();
   this.formErrors = null;
    this.scoreTotal = null;
    this.unsetFields();
   this._eventEmitterService.dismissFrameworkModal();


  }
  addScoreData()
  {
    this.optionArray.push({ title: this.optionTitle, score: this.optionScore, is_applicable: !(this.applicable), is_new: true});
    this.optionTitle = null;
    this.optionScore = null;
    this.applicable = false;
  }

  addOption() {
    this.scoreTotal=null;
    this.rangeWarning=false;
    this.duplicateScore=false;
    if (this.optionTitle != null) {
      if(this.optionScore == null||this.optionScore == '' || this.applicable){
        this.optionScore=0;
       
      }
      if((this.optionScore>=0)){
         if(this.checkvalueExist())
         {
            if(this.checkValueIntheRange() )
              {
                this.addScoreData();
              }
              else
              {
                this.rangeWarning=true;
              }
         }
         else{
          this.duplicateScore=true;
         }
       
      }
        
    }
  }
  checkvalueExist()
  {
    let flag=true;
    for(let i of this.optionArray)
    {
      if(i.score==this.optionScore)
      {
        flag=false;
        break;
      }
    }
    return flag;
  }
  removedMaturity(event)
  {
    this.listOfMaturityLevels=[];
  }

  checkValueIntheRange()
  {
    let flag=false;
   
    if(this.applicable)
    {
      flag=true;
    }
    else{
      for(let j of this.listOfMaturityLevels)
      {
        if(j?.maturity_model_levels?.length)
        {
          for(let i of j?.maturity_model_levels)
            {
              if(this.optionScore>=i.score_from && this.optionScore<=i.score_to)
              {
                flag=true;
                break;
              }
            }
        }
      }
      
    }
    return flag;
  }

  setFormValues(){
    if (this.frameworkSource.hasOwnProperty('values') && this.frameworkSource.values) {
     
      let { id, title,description,option,maturity_models,is_control_assessment} = this.frameworkSource.values
      this.form.patchValue({
        id: id,
        title:title,
        description:description,
        is_control_assessment: is_control_assessment,
        maturity_model_ids:maturity_models

      })
      this.optionArray = option;
      this.getDetailsModel(this.getById(this.form.value.maturity_model_ids));
      // if(this.form.value.is_control_assessment)
      // {
      //   this.searchMaturityModal({term:maturity_model?.id})
       
      // }
      
    }
  }
  getById(data)
  {
    let item=[];
    for(let i of data)
    {
      item.push(i.id);
    }
    return item;
  }
  removeOption(index) {
    if(this.optionArray[index]['is_new']){
      this.optionArray.splice(index, 1)
    }
    else{
      this.optionArray[index]['is_deleted']=true
    }
  }

  unsetFields() {
    this.title = '';
    this.description = '';
    this.optionArray = null;
  }

  getScoreSum(option) {
    let sum = 0;
    for (let i of option) {
      sum = sum + parseInt(i.score);
    }
    this.scoreTotal = sum;
  }

  save(close: boolean = false) {
    this.formErrors = null;
    this.scoreTotal = null;
    this.getScoreSum(this.optionArray);
    this.form.patchValue({
      is_control_assessment:this.form.value.is_control_assessment?this.form.value.is_control_assessment:false,
      business_assessment_framework_options: this.optionArray,
      maturity_model_ids:this.form.value.maturity_model_ids.length?this.getById(this.form.value.maturity_model_ids):[]
    })

    let save;
    AppStore.enableLoading();
    if (this.form.value.id) {
      save = this._frameworksService.updateItem(this.form.value.id, this.form.value);
    } else {

      save = this._frameworksService.saveItem(this.form.value);
    }
    save.subscribe((res: any) => {
      FrameworksStore.lastInsertedId = res['id'];
      AppStore.disableLoading();
      // this._utilityService.detectChanges(this._cdr);
      if (!this.form.value.id) {
        this.form.reset();
        this.unsetFields();
      }
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {

        // this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.closeFormModal();
          if(this.frameworkSource.component=='BusinessAssessment')
          {
            this._router.navigateByUrl('/business-assessments/frameworks/'+FrameworksStore.lastInsertedId)
          }
          
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

  setApplicable(event) {
    if (event.target.checked){
      this.applicable = true;
      this.optionScore=0
    }
      
    else this.applicable = false;
  }

  descriptionValueChange(event){
    this._utilityService.detectChanges(this._cdr);
  }
  
  getDescriptionLength(){
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex,"");
    return result.length;
  }

    
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy() {
		this.cancelEventSubscription.unsubscribe();
	}

}
