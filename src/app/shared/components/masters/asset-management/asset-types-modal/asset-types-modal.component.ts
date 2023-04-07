import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

import { AssetTypesMasterStore } from "src/app/stores/masters/asset-management/asset-types-master.store";
import { AssetTypesService } from "src/app/core/services/masters/asset-management/asset-types/asset-types.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
@Component({
  selector: 'app-asset-types-modal',
  templateUrl: './asset-types-modal.component.html',
  styleUrls: ['./asset-types-modal.component.scss']
})
export class AssetTypesModalComponent implements OnInit {

  @Input ('source') AssetTypesSource:any;
  assettypesForm:FormGroup;
  assettypesErrors:any;
  AppStore = AppStore;
  AssetTypesMasterStore = AssetTypesMasterStore;
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
    private _formBuilder: FormBuilder, public _assetTypesService: AssetTypesService,
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

      // Form Object to add asset Category


  
      this.assettypesForm=this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required, Validators.maxLength(255)]],
        description: [''],
      })
  
      this.resetForm();
  
      // Checking if Source has Values and Setting Form Value

      if (this.AssetTypesSource) {
        if(this.AssetTypesSource.hasOwnProperty('values') && this.AssetTypesSource.values){
  
          let {id,title,description}=this.AssetTypesSource.values
    
          this.assettypesForm.setValue({
            id: id,
            title: title,
            description: description,
          })
        }
      }
  
 
  
  
    }
    descriptionValueChange(event){
      this._utilityService.detectChanges(this._cdr);
    }
    getDescriptionLength(){
      var regex = /(<([^>]+)>)/ig;
      var result = this.assettypesForm.value.description.replace(regex,"");
      return result.length;
    }

    MyCustomUploadAdapterPlugin( editor ) {
      editor.plugins.get( 'FileRepository' )
      .createUploadAdapter = ( loader ) => {
          // Configure the URL to the upload script in your back-end here!
          return new MyUploadAdapter( loader, this._http );
      };
  }
  
    saveAssetTypes(close:boolean=false){
      this.assettypesErrors=null;
      if(this.assettypesForm.value){
        let save
        AppStore.enableLoading();
  
        if (this.assettypesForm.value.id) {
          save = this._assetTypesService.updateItem(this.assettypesForm.value.id, this.assettypesForm.value);
        } else {
          // Deleting ID before POST
          delete this.assettypesForm.value.id
          save = this._assetTypesService.saveItem(this.assettypesForm.value);
        }
        save.subscribe((res: any) => {
          if(!this.assettypesForm.value.id){
            this.resetForm();}
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.assettypesErrors = err.error.errors;}
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
      this.assettypesForm.reset();
      this.assettypesForm.pristine;
      this.assettypesErrors = null;
      AppStore.disableLoading();
    }
  
    closeFormModal(){
      this.resetForm();
      this._eventEmitterService.dismissAssetTypesModal();
      // Emitting Event To set the Style in Parent Component(MODAL)
      // this._eventEmitterService.setModalStyle();
    }

    
@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

  if(event.key == 'Escape' || event.code == 'Escape'){     

      this.cancel();

  }

}
     
    //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
