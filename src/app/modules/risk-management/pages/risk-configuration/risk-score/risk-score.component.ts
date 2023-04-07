import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IReactionDisposer,autorun, toJS } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskMatrixCalculationMethodService } from 'src/app/core/services/masters/risk-management/risk-matrix-calculation-method/risk-matrix-calculation-method.service';
import { RiskMatrixRatingLevelsService } from 'src/app/core/services/masters/risk-management/risk-matrix-rating-levels/risk-matrix-rating-levels.service';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { RiskScoreService } from 'src/app/core/services/risk-management/risk-configuration/risk-score/risk-score.service';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskMatrixCalculationMethodMasterStore } from 'src/app/stores/masters/risk-management/risk-matrix-calculation-method-store';
import { RiskMatrixRatingLevelsMasterStore } from 'src/app/stores/masters/risk-management/risk-matrix-rating-levels-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';

@Component({
  selector: 'app-risk-score',
  templateUrl: './risk-score.component.html',
  styleUrls: ['./risk-score.component.scss']
})
export class RiskScoreComponent implements OnInit {
  RiskMatrixCalculationMethodMasterStore = RiskMatrixCalculationMethodMasterStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  RiskMatrixRatingLevelsMasterStore = RiskMatrixRatingLevelsMasterStore;
  calculationMethod=null;
  ratingLevel=null;
  ratings = null;
  ratingArray = [];
  formErrors = null;
  currentLanguage = null;
  formNgModal = [];
  LanguageSettingsStore = LanguageSettingsStore;
  AppStore = AppStore;
  reactionDisposer:IReactionDisposer;
  AuthStore = AuthStore;
  rangeArray=[];
  val: number;
  // totalRangeArray=[];
  constructor(private _riskMatrixCalculationMethodService:RiskMatrixCalculationMethodService,
    private _riskRatingService:RiskRatingService,
    private _riskMatrixRatingLevelsService:RiskMatrixRatingLevelsService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _riskScoreService:RiskScoreService,
    private _languageService:LanguageService,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
    var subMenuItems = [
     
      { activityName: null, submenuItem: { type: 'close', path: '/risk-management/risk-matrix' } },
    ]

    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
  })
  this.getTotalScore()
  
    this._riskMatrixCalculationMethodService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      for(let i of res['data']){
        if(i.is_selected){
          this.calculationMethod = i.id;
        }
      }
      // this.calculationMethod=res['data'][0].id;
    })
    this._riskRatingService.getItems().subscribe(res=>{
      this.ratingArray = [];
      // this.ratings = res.data;
      for(let i of res['data']){
        // this.totalRangeArray.push(i.type)
        // ,score_from:i.score_from,score_to:i.score_to
        this.ratingArray.push({risk_rating_id:i.id,values:i.risk_rating_values})
      }
      this._utilityService.detectChanges(this._cdr);
    })

    this._riskRatingService.getRatingsByLanguage().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

    this._riskMatrixRatingLevelsService.getItems().subscribe(res=>{
      for(let i of res['data']){
        if(i.is_selected){
          this.setLevel(i);
        }
      }
     
      this._utilityService.detectChanges(this._cdr);
    })

    this._languageService.getAllItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      this.initializeFormNgModal();
    })
  }

  
  initializeFormNgModal(){
    
    this.setLanguage(LanguageSettingsStore.languages[0].id);
    for(let i of LanguageSettingsStore.languages){
      this.formNgModal.push({language_id: i.id, language_title: i.title, title: '',description:'', id: '', error: null});
    }


  }

  ngDoCheck(){
    if(!this.currentLanguage)
    {
      this.setLanguage(LanguageSettingsStore.languages[0]?.id);
      this._utilityService.detectChanges(this._cdr);
    }
      
  }

  
  getButtonText(text) {

    return this._helperService.translateToUserLanguage(text);
  }


  setLanguage(id){
    this.currentLanguage = id;
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
  
     // for resetting the form
resetForm() {
  for(let i of this.formNgModal){
    i.id = '';
    i.title = '';
    i.description='';
    i.error = null;
  }
  this.formErrors = null;

  this.setLanguage(LanguageSettingsStore.languages[0].id);
  AppStore.disableLoading();
}

  setCalculation(data){
    this.calculationMethod=data.id;
    this.getMaxScore(data)
  }

  getMaxScore(data){
    if(data.is_addition == true){
      this.val = LikelihoodStore.likelihoodDetails?.length + ImpactStore?.impactDetails?.length
     }else if(data.is_multiplication == true){
      this.val = LikelihoodStore.likelihoodDetails?.length * ImpactStore?.impactDetails?.length
     }
     this.rangeArray = [];
     for(let i=1;i<=this.val;i++){
      this.rangeArray.push(i); 
    }
  }

  setLevel(level){
    console.log('level',level);
    console.log('ratlevel',this.ratingArray);
    this.ratingLevel=level;
    this.ratings = RiskRatingMasterStore.allItems;
    if(level.is_three){
      if(this.ratings.length==4){      
        this.ratingArray[this.ratingArray.length-1].values = []; 
        this.ratings.splice(3,1);
      }
      
      else if(this.ratings.length==5){        
        this.ratingArray[this.ratingArray.length-1].values = [];
        this.ratingArray[this.ratingArray.length-2].values = [];
        this.ratings.splice(3,2);
      } 
    }
    if(level.is_four){
      if(this.ratings.length==5){
        this.ratingArray[this.ratingArray.length-1].values = [];
        this.ratings.splice(4,1);
      }
    }
  }



  setLevelRange(ratingValue,rating){
    if(!this.checkValuePresent(rating,ratingValue)){
      let searchCount = 0;
      if(this.ratingArray.length>0){
        for(let i of this.ratingArray){
          if(i.risk_rating_id == rating.id){
            searchCount++;
            if(i.values?.length>0){
              const index = i.values.findIndex(e => e == ratingValue);
              if(index==-1){
                i.values.push(ratingValue);
                // if(this.totalRangeArray[rating.type] && this.totalRangeArray[rating.type].length>0)
                // this.totalRangeArray[rating.type].push(ratingValue);
                // else
                // this.totalRangeArray[rating.type][0]=ratingValue;
              }
              else{
                i.values.splice(index,1);
                // this.totalRangeArray.splice(ratingValue);
              }
            }
            else{
              i['values'] = [];
              i['values'][0]=ratingValue;
            }
           
            // if(type=='from')
            //   i.score_from = event.target.value;
            // else
            //   i.score_to = event.target.value
          }
        }
        if(searchCount == 0){
            // if(type=='from')
              this.ratingArray.push({risk_rating_id:rating.id,values:[ratingValue]});
            // else
            //   this.ratingArray.push({risk_rating_id:rating.id,score_from:null,score_to:event.target.value});
        }
      }
      else{
        this.ratingArray.push({risk_rating_id:rating.id,values:[ratingValue]});
      }
    }
  }

  checkValueForLevel(type,value){
    const index = this.ratingArray.findIndex(e => e.risk_rating_id == type.id);
    if(index!=-1){
      if(this.ratingArray[index].values)
      var pos = this.ratingArray[index].values?.findIndex(r=>r==value)
      else
      this.ratingArray[index].values = [];
      if(pos!=-1){
        return true
      }
      else
      return false;
    }
  }

  checkValuePresent(type,value){
    let searchCount=0;
    // const index = this.ratingArray.findIndex(e=>e.risk_rating_id==type.id)
    for(let i of this.ratingArray){

      
      if(i.risk_rating_id!=type.id && i.values?.length>0){
        for(let j of i.values){
          if(j==value){
            searchCount++;
            return true
          }
          
        }
      }
    
    }
    if(searchCount==0)
    return false;
  }

  createSaveData(){
    
    var formData = []
    // for(let i of formData){
    //   delete i.language_title;
    //   delete i.error;
      // if(!ImpactStore.individualImpactDetails)
      //   delete i.id;
    // }
    for(let i of this.ratingArray){
      i['treatments']=[];
    }

    for(let language of RiskRatingMasterStore.allLanguageRiskRating){
      for(let item of language.risk_ratings){
        let pos=this.ratings.findIndex(e=>e.type==item.type)
        if(pos!=-1)
        formData.push({id:item.id,formId:item.id,language_id:item.language_id,title:item.risk_treatment});
        // this.ratingArray['treatments'].push(formData);
      }
    }
    for(let i of this.ratingArray){
      for(let j of formData){
        if(i.risk_rating_id == j.id){
          delete j.id;
          i.treatments.push(j);
        }
      }

      // if(i.language_id)
    }

    let ratingSaveData=[];
    for(let i of this.ratingArray){
      let pos2=formData.findIndex(e=>e.formId==i.risk_rating_id);
      if(pos2!=-1){
        ratingSaveData.push(i);
      }
    }
    
    
    let saveData = {
      risk_matrix_calculation_method_id: this.calculationMethod,
      risk_matrix_rating_level_id: this.ratingLevel?.id,
      risk_rating_scores: ratingSaveData,

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

  getTotalScore(){
    RiskMatrixCalculationMethodMasterStore.allItems.findIndex(e => {
      if(e.is_selected == true){
        this.getMaxScore(e)
      }     
    })
  
  }
}
