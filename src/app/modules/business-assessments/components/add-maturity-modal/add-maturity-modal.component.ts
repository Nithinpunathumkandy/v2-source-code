import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaturityModalService } from 'src/app/core/services/business-assessments/maturity-modal/maturity-modal.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MaturityModalStore } from 'src/app/stores/business-assessments/maturity-modal/maturity-modal-store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-add-maturity-modal',
  templateUrl: './add-maturity-modal.component.html',
  styleUrls: ['./add-maturity-modal.component.scss']
})
export class AddMaturityModalComponent implements OnInit {
  @Input('source') maturityModalSource: any;
  AppStore = AppStore;
  formErrors = null;
  optionTitle = null;
  optionScoreFrom=null;
  optionScoreTo=null;
  existwaring:boolean=false;
  level=null;
  levelsList=["1","2","3","4","5","6","7","8","9","10"];
  applicable: boolean = false;
  optionArray = [];
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
  MaturityModalStore = MaturityModalStore;
  color:string='';
  public Editor;
  public Config;

  constructor(private _maturityModalService: MaturityModalService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _helperService:HelperServiceService,
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
      description: [''],
      // color_code:[''],
      optionScoreFrom:[null],
      optionScoreTo:[null],
      maturity_model_levels: [[]],

    });
    if (this.maturityModalSource.type=='Edit') {
      this.setFormValues();
    }

   

  }



  MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' )
    .createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader, this._http );
    };
}

  ngDoCheck(){
    if (this.maturityModalSource && this.maturityModalSource.hasOwnProperty('values') && this.maturityModalSource.values && !this.form.value.id)
      this.setFormValues();
  }

  compareScores(){
    if(this.optionScoreFrom && this.optionScoreTo){
      if(parseInt(this.optionScoreFrom) > parseInt(this.optionScoreTo)) return true
      else return false
    }
  }

  closeFormModal() {
   this.form.reset();
   this.formErrors = null;
   this.unsetFields();
   this._eventEmitterService.dismissMaturityModal();
  }

  addOption() {
    this.existwaring=false;
   if(this.checkRangeExist())
   {
    if (this.optionTitle != null) {
      if(!this.optionScoreFrom){
        this.optionScoreFrom=0;
      }
      if(!this.optionScoreTo){
        this.optionScoreTo=0;
      }
  
        if(!(this.optionScoreFrom>100) && !(this.optionScoreTo>100)){
          
          this.optionArray.push({ title: this.optionTitle, score_from: this.optionScoreFrom, 
            score_to: this.optionScoreTo,level:this.level,color_code:this.color });
          this.optionTitle = null;
          this.optionScoreFrom = null;
          this.optionScoreTo = null;
          this.level = null;
          this.color='';
        }
        
      // }
     
    }
  }
  else
  {
    this.existwaring=true;
  }
    
  }
  checkRangeExist()
  { 
    let flag=true;
    for(let i of this.optionArray)
    {
    
      if((parseInt(this.optionScoreFrom)>=parseInt(i.score_from) && parseInt(this.optionScoreFrom)<=parseInt(i.score_to)) || 
      (parseInt(this.optionScoreTo)>=parseInt(i.score_from) && parseInt(this.optionScoreTo)<=parseInt(i.score_to)) )
      {
        flag=false;
        break;
      }
    }
    return flag
  }

  setFormValues(){
    if (this.maturityModalSource.hasOwnProperty('values') && this.maturityModalSource.values) {
      let { id, title,description,option} = this.maturityModalSource.values
      this.form.patchValue({
        id: id,
        title:title,
        description:description,
      })
      this.optionArray = option;
    }
  }

  removeOption(index) {
    this.optionArray.splice(index, 1)
  }

  unsetFields() {
    // this.title = '';
    // this.description = '';
    this.color = '';
    this.optionArray = [];
  }

  getScoreSum(option) {
    let sum = 0;
    for (let i of option) {
      sum = sum + parseInt(i.score);
    }
  }

  save(close: boolean = false) {
    this.formErrors = null;
    this.getScoreSum(this.optionArray);
    this.form.patchValue({
      maturity_model_levels: this.optionArray,
      //color_code:this.color ? this.color : ''
    })

    let save;
    AppStore.enableLoading();
    if (this.form.value.id) {
      save = this._maturityModalService.updateItem(this.form.value.id, this.form.value);
    } else {

      save = this._maturityModalService.saveItem(this.form.value);
    }
    save.subscribe((res: any) => {
      MaturityModalStore.lastInsertedId = res['id'];
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
          this._router.navigateByUrl('/business-assessments/maturity-models/'+MaturityModalStore.lastInsertedId)
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

  numberOnly(evt): boolean {
    this.existwaring=false;
    //console.log(evt.target.value);
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode != 46 && charCode > 31 
    && (charCode < 48 || charCode > 57))
     return false;
  
  return true;
  
  }

  

}
