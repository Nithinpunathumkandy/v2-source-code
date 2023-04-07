import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IReactionDisposer, autorun, toJS } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
// import { IsmsRiskMatrixCalculationMethodService } from 'src/app/core/services/masters/risk-management/risk-matrix-calculation-method/risk-matrix-calculation-method.service';
// import { RiskMatrixRatingLevelsService } from 'src/app/core/services/masters/risk-management/risk-matrix-rating-levels/risk-matrix-rating-levels.service';
// import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { IsmsRiskScoreService } from 'src/app/core/services/isms/isms-risk-configuration/isms-risk-score/isms-risk-score.service';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { IsmsRiskMatrixCalculationMethodMasterStore } from 'src/app/stores/masters/Isms/isms-risk-matrix-calculation-method-master-store';
import { IsmsRiskMatrixCalculationMethodService } from 'src/app/core/services/masters/Isms/isms-risk-matrix-calculation-method/isms-risk-matrix-calculation-method.service';
import { IsmsRiskMatrixRatingLevelService } from 'src/app/core/services/masters/isms/isms-risk-matrix-rating-level/isms-risk-matrix-rating-level.service';
import { IsmsRiskRatingService } from 'src/app/core/services/masters/Isms/isms-risk-rating/isms-risk-rating.service';
import { IsmsRiskMatrixRatingLevelMasterStore } from 'src/app/stores/masters/isms/isms-risk-matrix-rating-level-master-store';
import { IsmsRiskRatingMasterStore } from 'src/app/stores/masters/Isms/isms-risk-rating-master-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
@Component({
  selector: 'app-isms-risk-score',
  templateUrl: './isms-risk-score.component.html',
  styleUrls: ['./isms-risk-score.component.scss']
})
export class IsmsRiskScoreComponent implements OnInit {
  IsmsRiskMatrixCalculationMethodMasterStore = IsmsRiskMatrixCalculationMethodMasterStore;
  RiskRatingMasterStore = IsmsRiskRatingMasterStore;
  RiskMatrixRatingLevelsMasterStore = IsmsRiskMatrixRatingLevelMasterStore;
  calculationMethod = null;
  ratingLevel = null;
  ratings = null;
  ratingArray = [];
  formErrors = null;
  currentLanguage = null;
  formNgModal = [];
  LanguageSettingsStore = LanguageSettingsStore;
  IsmsRisksStore = IsmsRisksStore;
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  rangeArray = [];

  toOverlapped = [];
  fromOverlapped = [];
  overlapped = [];
  allRatings = [];

  // totalRangeArray=[];
  constructor(private _riskMatrixCalculationMethodService: IsmsRiskMatrixCalculationMethodService,
    private _riskRatingService: IsmsRiskRatingService,
    private _riskMatrixRatingLevelsService: IsmsRiskMatrixRatingLevelService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _riskScoreService: IsmsRiskScoreService,
    private _languageService: LanguageService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [

        { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risk-matrix' } },
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    for (let i = 1; i <= 36; i++) {
      this.rangeArray.push(i);

    }
    this.getCalculationMethod();
    IsmsRiskRatingMasterStore.orderItem = 'isms_risk_ratings.id';
    IsmsRiskRatingMasterStore.orderBy = 'desc'
    this._riskRatingService.getItems(false,null,true).subscribe(res => {
      this.ratingArray = [];

      for (let i of res['data']) {
        this.ratingArray.push({ isms_risk_rating_language_title: i.isms_risk_rating_language_title, isms_risk_rating_id: i.id, score_from: i.score_from == 0 ? null : i.score_from, score_to: i.score_to == 0 ? null : i.score_to, label: i.label })
      }
      this._utilityService.detectChanges(this._cdr);
    })

    this._riskRatingService.getRatingsByLanguage().subscribe(res => {
      this.allRatings = res;
      this._utilityService.detectChanges(this._cdr);
    })

    this._riskMatrixRatingLevelsService.getItems().subscribe(res => {
      for (let i of res['data']) {
        if (i.is_selected) {
          this.setLevel(i);
        }
      }

      this._utilityService.detectChanges(this._cdr);
    })

    this._languageService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this.initializeFormNgModal();
    })
  }


  initializeFormNgModal() {

    this.setLanguage(LanguageSettingsStore.languages[0].id);
    for (let i of LanguageSettingsStore.languages) {
      this.formNgModal.push({ language_id: i.id, language_title: i.title, title: '', description: '', id: '', error: null });
    }


  }

  ngDoCheck() {
    if (!this.currentLanguage) {
      this.setLanguage(LanguageSettingsStore.languages[0]?.id);
      this._utilityService.detectChanges(this._cdr);
    }

  }

  getCalculationMethod() {
    this._riskMatrixCalculationMethodService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      for (let i of res['data']) {
        if (i.is_selected) {
          this.calculationMethod = i.id;
          IsmsRisksStore.calculationMethod = i;
        }
      }
      // this.calculationMethod=res['data'][0].id;
    })
  }


  getButtonText(text) {

    return this._helperService.translateToUserLanguage(text);
  }


  setLanguage(id) {
    this.currentLanguage = id;
  }

  getDataPresent() {
    let stringifyData = JSON.stringify(this.formNgModal);
    let data = JSON.parse(stringifyData);
    for (var i = 0; i < data.length; i++) {
      if (!data[i].title || data[i].title == '') {
        data.splice(i, 1);
        i--;
      }
    }
    return data;
  }

  // for resetting the form
  resetForm() {
    for (let i of this.formNgModal) {
      i.id = '';
      i.title = '';
      i.description = '';
      i.error = null;
    }
    this.formErrors = null;

    this.setLanguage(LanguageSettingsStore.languages[0].id);
    AppStore.disableLoading();
  }

  setCalculation(id) {
    this.calculationMethod = id;
  }

  setLevel(level) {
    this.ratingArray = [];

    this.RiskRatingMasterStore.setAllIsmsRiskRating(this.allRatings);

    this.ratingLevel = level.id;
    for (let i of this.RiskRatingMasterStore.allItems)

      this.ratingArray.push({ isms_risk_rating_language_title: i.isms_risk_rating_language_title, isms_risk_rating_id: i.id, score_from: i.score_from, score_to: i.score_to, label: i.label })

    // this.ratings = this.RiskRatingMasterStore.allItems;
    if (level.is_three) {
      if (this.ratingArray.length == 4) {
        this.ratingArray.splice(3, 1);
        for (let j of this.RiskRatingMasterStore.allLanguageRiskRating) {
          j.isms_risk_ratings?.splice(3, 1)
        }
      }


      else if (this.ratingArray.length == 5) {
        this.ratingArray.splice(3, 2);
        for (let j of this.RiskRatingMasterStore.allLanguageRiskRating) {
          j.isms_risk_ratings?.splice(3, 2)
        }
      }


    }
    if (level.is_four) {
      if (this.ratingArray.length == 5) {
        this.ratingArray.splice(4, 1);
        for (let j of this.RiskRatingMasterStore.allLanguageRiskRating) {
          j.isms_risk_ratings?.splice(4, 1)
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
    // if(level.is_five){
    //   if(this.ratingArray.length==5){
    //     this.ratingArray.splice(4,1);
    //   }
    // }
  }



  // setLevelRange(ratingValue,rating){
  //   if(!this.checkValuePresent(rating,ratingValue)){
  //     let searchCount = 0;
  //     if(this.ratingArray.length>0){
  //       for(let i of this.ratingArray){
  //         if(i.risk_rating_id == rating.id){
  //           searchCount++;
  //           if(i.values?.length>0){
  //             const index = i.values.findIndex(e => e == ratingValue);
  //             if(index==-1){
  //               i.values.push(ratingValue);

  //             }
  //             else{
  //               i.values.splice(index,1);

  //             }
  //           }
  //           else{
  //             i['values'] = [];
  //             i['values'][0]=ratingValue;
  //           }

  //         }
  //       }
  //       if(searchCount == 0){

  //             this.ratingArray.push({risk_rating_id:rating.id,values:[ratingValue]});

  //       }
  //     }
  //     else{
  //       this.ratingArray.push({risk_rating_id:rating.id,values:[ratingValue]});
  //     }
  //   }
  // }

  checkValueForLevel(type, value) {
    const index = this.ratingArray.findIndex(e => e.isms_risk_rating_id == type.id);
    if (index != -1) {
      if (this.ratingArray[index].values)
        var pos = this.ratingArray[index].values?.findIndex(r => r == value)
      if (pos != -1) {
        return true
      }
      else
        return false;
    }
  }

  checkValuePresent(type, value) {
    let searchCount = 0;
    // const index = this.ratingArray.findIndex(e=>e.risk_rating_id==type.id)
    for (let i of this.ratingArray) {


      if (i.risk_rating_id != type.id && i.values?.length > 0) {
        for (let j of i.values) {
          if (j == value) {
            searchCount++;
            return true
          }

        }
      }

    }
    if (searchCount == 0)
      return false;
  }

  createSaveData() {

    var formData = []
    // for(let i of formData){
    //   delete i.language_title;
    //   delete i.error;
    // if(!ImpactStore.individualImpactDetails)
    //   delete i.id;
    // }
    for (let i of this.ratingArray) {
      i['treatments'] = [];
    }

    for (let language of this.RiskRatingMasterStore.allLanguageRiskRating) {
      for (let item of language.isms_risk_ratings) {
        formData.push({ id: item.id, language_id: item.language_id, title: item.isms_risk_treatment });
        // this.ratingArray['treatments'].push(formData);
      }
    }
    for (let i of this.ratingArray) {
      for (let j of formData) {
        if (i.isms_risk_rating_id == j.id) {
          delete j.id;
          i.treatments.push(j);
        }
      }

      // if(i.language_id)
    }
    let saveData = {
      isms_risk_matrix_calculation_method_id: this.calculationMethod,
      isms_risk_matrix_rating_level_id: this.ratingLevel,
      isms_risk_rating_scores: this.ratingArray,

    }
    // this.ratingArray['treatments'] = formData;
    return saveData;
  }

  save(close: boolean = false) {

    this.formErrors = null;
    let save;
    AppStore.enableLoading();
    let saveData = this.createSaveData();

    save = this._riskScoreService.saveItem(saveData);

    save.subscribe((res: any) => {

      AppStore.disableLoading();
      this.getCalculationMethod();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);


    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
      }
    });
  }


  setLevelRange(event, id, type, index) {
    // for(let i of this.ratingArray){
    let count = 0;
    let pos = this.ratingArray.findIndex(e => e.isms_risk_rating_id == id)
    if (pos != -1) {
      let pos3 = this.ratingArray.findIndex(e => e.score_from == e.score_to)
      if (pos3 != -1)
        this.overlapped[index] = true
      if (type == 'from') {
        for (let i = 0; i < this.ratingArray.length; i++) {
          if (i != pos) {
            // this.ratingArray[i].score_from==null
            if (((parseInt(this.ratingArray[i].score_from) < parseInt(event.target.value)) && (parseInt(this.ratingArray[i].score_to) > parseInt(event.target.value))) || (this.ratingArray[i].score_from == event.target.value) || (this.ratingArray[i].score_to == event.target.value)) {
              count++;


            }


          }

        }
        if (count == 0) {

          this.ratingArray[pos].score_from = event.target.value;
          this.fromOverlapped[index] = false;


        }
        else {
          this.fromOverlapped[index] = true;
        }

      }

      else {
        count = 0;
        for (let i = 0; i < this.ratingArray.length; i++) {
          if (i != pos) {
            if (((parseInt(this.ratingArray[i].score_from) < parseInt(event.target.value)) && (parseInt(this.ratingArray[i].score_to) > parseInt(event.target.value))) || (this.ratingArray[i].score_from == event.target.value) || (this.ratingArray[i].score_to == event.target.value)) {
              count++
            }
          }

        }

        if (count == 0) {
          this.ratingArray[pos].score_to = event.target.value;
          this.toOverlapped[index] = false;
        }
        else {
          this.toOverlapped[index] = true;
        }
      }

    }

    // }

  }

  isOverlapped() {
    let pos1 = this.fromOverlapped.findIndex(e => e == true);
    let pos2 = this.toOverlapped.findIndex(t => t == true);
    if (pos1 != -1 || pos2 != -1) {
      return true;
    }
  }


}
