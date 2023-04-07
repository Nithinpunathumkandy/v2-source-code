import { ChangeDetectorRef, Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { IsmsLikelihoodService } from 'src/app/core/services/isms/isms-risk-configuration/isms-likelihood/isms-likelihood.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsLikelihoodStore } from 'src/app/stores/isms/isms-risk-configuration/isms-likelihood.store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';

declare var $: any;


@Component({
  selector: 'app-isms-likelihood',
  templateUrl: './isms-likelihood.component.html',
  styleUrls: ['./isms-likelihood.component.scss']
})
export class IsmsLikelihoodComponent implements OnInit {

  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  IsmsLikelihoodStore=IsmsLikelihoodStore;
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
  probability=null;
  likelihoodId=null;

  constructor(private _likelihoodService:IsmsLikelihoodService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _languageService:LanguageService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CREATE_ISMS_RISK_MATRIX_LIKELIHOOD', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_ISMS_RISK_MATRIX_LIKELIHOOD_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_ISMS_RISK_MATRIX_LIKELIHOOD', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risk-matrix' } },
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      NoDataItemStore.setNoDataItems({title: "likelihood_title_nodata", subtitle: 'likelihood_subtitle_nodata',buttonText: 'add_likelihood'});
    
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewLikelihood();
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

              this._likelihoodService.generateTemplate();
            break;
          case "export_to_excel":

            this._likelihoodService.exportToExcel();
            break;
            case "search":
              IsmsLikelihoodStore.searchText = SubMenuItemStore.searchText;
              this.searchLikelihoodList();
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

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    IsmsLikelihoodStore.orderItem = 'isms_risk_matrix_likelihoods.score'
    if (newPage) IsmsLikelihoodStore.setCurrentPage(newPage);
    this._likelihoodService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  addNewLikelihood(){
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
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
      this.formNgModal.push({language_id: i.id, language_title: i.title, title: '',timeframe:'', id: '', error: null});
    }

  }

   // for resetting the form
resetForm() {
  for(let i of this.formNgModal){
    i.id = '';
    i.title = '';
    i.timeframe='';
    i.error = null;
  }
  this.formErrors = null;
  this.score=null;
  this.probability=null;
  this.likelihoodId=null;
  this.setLanguage(LanguageSettingsStore.languages[0].id);
  AppStore.disableLoading();
}

createSaveData(){
     
  var returnData = {
    score:this.score,
    probability:this.probability,
    languages: []
  }
  var formData = this.getDataPresent();
  for(let i of formData){
    delete i.language_title;
    delete i.error;
    if(!IsmsLikelihoodStore.individualLikelihoodDetails)
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
  if(IsmsLikelihoodStore.individual_likelihood_loaded && IsmsLikelihoodStore.individualLikelihoodDetails.languages.length>0){
    for(let i of this.formNgModal){
      i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
      i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.risk_matrix_likelihood_id : '';
      i.timeframe = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.timeframe : '';
    }
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
}

getValuesForEdit(id: number){
  let languageValues = IsmsLikelihoodStore.individualLikelihoodDetails.languages.find(e=> e.id == id);
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
    if (this.likelihoodId) {
      save = this._likelihoodService.updateItem(this.likelihoodId, saveData);
    } else {
      // let saveData = {
      //   jd_id: this.form.value.jd_id ? this.form.value.jd_id : '',
      //   reporting_user_ids: this.form.value.reporting_user_ids ? this.form.value.reporting_user_ids : '',
      //   supervisor_id: this.form.value.supervisor_id ? this.form.value.supervisor_id : '',
      // }
      save = this._likelihoodService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      if (!this.likelihoodId) {
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

  setLikelihoodSort(type, callList: boolean = true) {
    this._likelihoodService.sortLikelihoodList(type, callList);
  }

  openFormModal(){
    $(this.formModal.nativeElement).modal('show');
  }

  searchLikelihoodList(){
    IsmsLikelihoodStore.setCurrentPage(1);
    this._likelihoodService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

    /**
  * Delete the likelihood
  * @param id -likelihood id
  */
 delete(status) {
  if (status && this.deleteObject.id) {

    this._likelihoodService.delete(this.deleteObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if (IsmsLikelihoodStore.currentPage > 1) {
          IsmsLikelihoodStore.currentPage = Math.ceil(IsmsLikelihoodStore.totalItems / 15);
          this.pageChange(IsmsLikelihoodStore.currentPage);
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

closeFormModal(){
  this.resetForm();
  this.likelihoodId=null;
  this.currentLanguage=null;
  IsmsLikelihoodStore.unsetIndiviudalLikelihoodDetails();
  setTimeout(() => {
    $(this.formModal.nativeElement).modal('hide');
  }, 100);


}

editLikelihood(id){
  this._likelihoodService.getItem(id).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
    this.score = res['score'];
    this.probability=res['probability'];
    this.likelihoodId=res['id'];
    this.setEditValue();
  })
}


  deleteLikelihood(id){
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'item_delete_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = '';

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
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
 
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
    IsmsLikelihoodStore.searchText=null;
		SubMenuItemStore.searchText = '';
  }


}
