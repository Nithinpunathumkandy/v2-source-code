import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

import { CompetencyTypesMasterStore } from "src/app/stores/masters/human-capital/competency-types-master.store";
import { CompetencyTypesService } from "src/app/core/services/masters/human-capital/competency-types/competency-types.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-competency-types-modal',
  templateUrl: './competency-types-modal.component.html',
  styleUrls: ['./competency-types-modal.component.scss']
})

export class CompetencyTypesModalComponent implements OnInit {

  @Input ('source') CompetencyTypesSource:any;
  competencytypesForm:FormGroup;
  competencytypesErrors:any;
  AppStore = AppStore;
  CompetencyTypesMasterStore = CompetencyTypesMasterStore;
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
  
  constructor(private _utilityService: UtilityService, 
    private _helperService: HelperServiceService,private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _competencyTypesService: CompetencyTypesService,
    private _eventEmitterService: EventEmitterService, 
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

    //   ClassicEditor
    // .create( document.querySelector( '#description' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

      // Form Object to add competency Category


  
      this.competencytypesForm=this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required, Validators.maxLength(255)]],
        description: ['']
      });
  
      this.resetForm();
  
      // Checking if Source has Values and Setting Form Value

      if (this.CompetencyTypesSource) {
        if(this.CompetencyTypesSource.hasOwnProperty('values') && this.CompetencyTypesSource.values){
  
          let {id,title,description}=this.CompetencyTypesSource.values
    
          this.competencytypesForm.setValue({
            id: id,
            title: title,
            description:description
          })
        }
      }
  
 
  
  
    }

    MyCustomUploadAdapterPlugin( editor ) {
      editor.plugins.get( 'FileRepository' )
      .createUploadAdapter = ( loader ) => {
          // Configure the URL to the upload script in your back-end here!
          return new MyUploadAdapter( loader, this._http );
      };
  }
  
    saveCompetencyTypes(close:boolean=false){
      this.competencytypesErrors=null;
      if(this.competencytypesForm.value){
        let save
        AppStore.enableLoading();
  
        if (this.competencytypesForm.value.id) {
          save = this._competencyTypesService.updateItem(this.competencytypesForm.value.id, this.competencytypesForm.value);
        } else {
          // Deleting ID before POST
          delete this.competencytypesForm.value.id
          save = this._competencyTypesService.saveItem(this.competencytypesForm.value);
        }
        save.subscribe((res: any) => {
          if(!this.competencytypesForm.value.id){
            this.resetForm();}
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.competencytypesErrors = err.error.errors;}
            else if(err.status == 500 || err.status == 403){
              this.closeFormModal();
            }
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
          
        });
      }
    }
  
  cancel() {
      
    this.closeFormModal();
    }
  
  
    resetForm(){
      this.competencytypesForm.reset();
      this.competencytypesForm.pristine;
      this.competencytypesErrors = null;
      AppStore.disableLoading();
    }
  
    closeFormModal(){
      this.resetForm();
      this._eventEmitterService.dismissCompetencyTypesModal();
      // Emitting Event To set the Style in Parent Component(MODAL)
      // this._eventEmitterService.setModalStyle();
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

      if(event.key == 'Escape' || event.code == 'Escape'){     
  
          this.closeFormModal();
  
      }
  
    }
     
    //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}

