import { ChangeDetectorRef, Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

declare var $: any;
@Component({
  selector: 'app-impact',
  templateUrl: './impact.component.html',
  styleUrls: ['./impact.component.scss']
})
export class ImpactComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  ImpactStore=ImpactStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle:''
  };
  AppStore = AppStore;
  AuthStore = AuthStore;
  formErrors = null;
  LanguageSettingsStore = LanguageSettingsStore;
  currentLanguage = null;
  formNgModal = [];
  score = null;
  impactId=null;
  

  config = {
    // toolbar: [
    //   { name: 'document', items: [ 'Source', '-', 'Preview' ] },
    //   { name: 'clipboard', items: [ 'Undo', 'Redo', 'Cut', 'Copy', 'Paste' ] },
    //   { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
    //   { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },'/',
    //   { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar' ] },
    //   { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-' ] },
    //   { name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
    //   { name: 'tools', items: [ 'Maximize' ] },
    //   { name: 'about', items: [ 'About' ] } 
    // ]
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
  constructor(private _impactService:ImpactService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _languageService:LanguageService,
    private _http: HttpClient,) { 
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
    // .create( document.querySelector( '#description' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CREATE_RISK_MATRIX_IMPACT', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_RISK_MATRIX_IMPACT_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_RISK_MATRIX_IMPACT', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/risk-management/risk-matrix' } },
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      NoDataItemStore.setNoDataItems({title: "impact_title_nodata", subtitle: 'impcat_subtitle_nodata',buttonText: 'add_impact'});
    
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewImpact();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;

          case "template":

              this._impactService.generateTemplate();
            break;
          case "export_to_excel":

            this._impactService.exportToExcel();
            break;
            case "search":
              ImpactStore.searchText = SubMenuItemStore.searchText;
              this.searchImpactList();
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this._languageService.getAllItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      this.initializeFormNgModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })


    SubMenuItemStore.setNoUserTab(true);
    this.pageChange(1);
  }

  MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader, this._http );
    };
}

  addNewImpact(){
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }


  pageChange(newPage: number = null) {

    if (newPage) ImpactStore.setCurrentPage(newPage);
    this._impactService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

    
  ngDoCheck(){
    if(!this.currentLanguage)
    {
      this.setLanguage(LanguageSettingsStore.languages[0]?.id);
      this._utilityService.detectChanges(this._cdr);
    }
      
  }

  initializeFormNgModal(){
    
    this.setLanguage(LanguageSettingsStore.languages[0].id);
    for(let i of LanguageSettingsStore.languages){
      this.formNgModal.push({language_id: i.id, language_title: i.title, title: '',description:'', id: '', error: null});
    }

  }

   // for resetting the form
resetForm() {
  for(let i of this.formNgModal){
    i.id = '';
    i.title = '';
    i.description='';
    i.error = null;
  }
  this.formErrors = null;
  this.score=null;
  this.impactId=null;
  this.setLanguage(LanguageSettingsStore.languages[0].id);
  AppStore.disableLoading();
}

createSaveData(){
     
  var returnData = {
    score:this.score,
    languages: []
  }
  var formData = this.getDataPresent();
  for(let i of formData){
    delete i.language_title;
    delete i.error;
    if(!ImpactStore.individualImpactDetails)
      delete i.id;
  }
  returnData.languages = formData;
  return returnData;
}

getDataPresent(){
  let stringifyData = JSON.stringify(this.formNgModal);
  let data = JSON.parse(stringifyData);
  for(var i = 0; i < data.length; i++){
    if(!data[i].title || data[i].title == ''){
      data.splice(i,1);
      i--;
    }
  }
  return data;
}

setEditValue(){
  if(ImpactStore.individual_impact_loaded && ImpactStore.individualImpactDetails.languages.length>0){
    for(let i of this.formNgModal){
      i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
      i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.risk_matrix_impact_id : '';
      i.description = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.description : '';
    }
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
}

getValuesForEdit(id: number){
  let languageValues = ImpactStore.individualImpactDetails.languages.find(e=> e.id == id);
  return languageValues;
}

checkFormValid(){
  var formData = this.getDataPresent();
  if(formData.length > 0) return true;
  else return false;
}

  save(close: boolean = false) {
    this.formErrors = null;
    this.clearFormNgModalError();
    var saveData = this.createSaveData();
   
    let save;
    AppStore.enableLoading();
    if (this.impactId) {
      save = this._impactService.updateItem(this.impactId, saveData);
    } else {
      // let saveData = {
      //   jd_id: this.form.value.jd_id ? this.form.value.jd_id : '',
      //   reporting_user_ids: this.form.value.reporting_user_ids ? this.form.value.reporting_user_ids : '',
      //   supervisor_id: this.form.value.supervisor_id ? this.form.value.supervisor_id : '',
      // }
      save = this._impactService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      if (!this.impactId) {
        this.resetForm();
      }

      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      

        if (close) {
          this.closeFormModal();
          
        }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
        AppStore.disableLoading();
      }
    });
  }

  setLanguage(id){
    this.currentLanguage = id;
  }

  setImpactSort(type, callList: boolean = true) {
    this._impactService.sortImpactList(type, callList);
  }

  openFormModal(){
    $(this.formModal.nativeElement).modal('show');
  }

  searchImpactList(){
    ImpactStore.setCurrentPage(1);
    this._impactService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

    /**
  * Delete the impact
  * @param id -impact id
  */
 delete(status) {
  if (status && this.deleteObject.id) {

    this._impactService.delete(this.deleteObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if (ImpactStore.currentPage > 1) {
          ImpactStore.currentPage = Math.ceil(ImpactStore.totalItems / 15);
          this.pageChange(ImpactStore.currentPage);
        }
      }, 500);
      this.clearDeleteObject();

    });
  }
  else {
    this.clearDeleteObject();
  }
  setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
  }, 250);

}

getDescriptionLength(description){
  var regex = /(<([^>]+)>)/ig;
  var result = description.replace(regex,"");
  return result.length;
}

descriptionValueChange(event){
  this._utilityService.detectChanges(this._cdr);
}

closeFormModal(){
  this.resetForm();
  this.impactId=null;
  this.currentLanguage=null;
  ImpactStore.unsetIndiviudalImpactDetails();
  setTimeout(() => {
    $(this.formModal.nativeElement).modal('hide');
  }, 100);


}

editImpact(id){
  this._impactService.getItem(id).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
    this.score = res['score'];
    this.impactId=res['id'];
    this.setEditValue();
  })
}


  deleteImpact(id){
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle='item_delete_subtitle'

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.type = '';
    this.deleteObject.subtitle='';

  }

  processFormErrors(){
    var formData = this.getDataPresent();
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
          if(key.includes('languages') && key.includes('title')){
            let keyValueSplit = key.split('.');
            let errorPosition = keyValueSplit[1];
            let languageId = formData[errorPosition].language_id;
            var formModalPosition = this.formNgModal.findIndex(e=>e.language_id == languageId);
            // this.formNgModal[formModalPosition].error = errors[key][0].includes('characters') ? 'Title may not be greater than 500 characters' : 'Title Already Taken';
            this.formNgModal[formModalPosition].error = errors[key];
            this.setLanguage(this.formNgModal[formModalPosition].language_id);
          }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  clearFormNgModalError(){
    for(let i of this.formNgModal){
      i.error = null;
    }
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    ImpactStore.searchText=null;
		SubMenuItemStore.searchText = '';
  }


}
