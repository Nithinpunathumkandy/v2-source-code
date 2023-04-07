import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { AssetCriticalityService } from 'src/app/core/services/asset-management/asset-register/asset-criticality/asset-criticality.service';
import { AssetCriticalityStore } from 'src/app/stores/asset-management/asset-register/asset-criticality-store';
import { autorun, IReactionDisposer } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AssetMatrixService } from 'src/app/core/services/asset-management/asset-matrix/asset-matrix.service';
import { AssetMatrixStore } from 'src/app/stores/asset-management/asset-matrix/asset-matrix-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
declare var $: any;

@Component({
  selector: 'app-asset-criticality',
  templateUrl: './asset-criticality.component.html',
  styleUrls: ['./asset-criticality.component.scss']
})
export class AssetCriticalityComponent implements OnInit {
  @ViewChild('treatmentPopup') treatmentPopup: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('criticalityForm') criticalityForm:ElementRef;
  @ViewChild('assetMatrixFormModal') assetMatrixFormModal:ElementRef;
  

  currentTab = 0;
  nextButtonText = 'Next';
  previousButtonText = "Previous";
  duration_table = []

	AppStore = AppStore;
	AssetRegisterStore = AssetRegisterStore;
  AssetCriticalityStore = AssetCriticalityStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AssetMatrixStore = AssetMatrixStore;
  reactionDisposer : IReactionDisposer;

	id: number;
  matrixArray=[];
  criticalityRating = null;
  criticalityScore = null;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  cancelObject = {
    type: '',
    title: '',
    subtitle: ''
  };

  assetMatrixObjectObject = {
    type:null,
    values: null,
  }

  formErrors = null;
  cancelEventSubscription:any;
  networkFailureSubscription:any;
  idleTimeoutSubscription:any;
  modalAddMtrixEventSubscription:any;
  criticalityPresent = false;
  emptyMatrixMessage = "Asset Criticality Matrix not configured"
  

  constructor(
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _assetCriticalityService:AssetCriticalityService,
    private _renderer2:Renderer2,
    private _assetMatrixService:AssetMatrixService,
    private _eventEmitterService:EventEmitterService,
    private _router:Router
  ) { }


  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
		if (AssetCriticalityStore.loaded && AssetCriticalityStore.assetCriticality?.asset_matrix_id==null)
    NoDataItemStore.setNoDataItems({ title: "matrix_empty_message", subtitle: 'matrix_subtitle', buttonText: 'configure_criticality_matrix' });
    else
    NoDataItemStore.setNoDataItems({ title: "criticality_empty_message", subtitle: 'criticality_subtitle', buttonText: 'perform_now' });

    this.reactionDisposer = autorun(() => {
     
    if (SubMenuItemStore.clikedSubMenuItem) {
      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "edit_modal":
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
            this.editAssetCriticality();
          }, 1000);
          break;
          case "new_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.editAssetCriticality();
            }, 1000);
            break;
          case "close":
            this.confirmCancel();
            break;
  
        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    }

    if (NoDataItemStore.clikedNoDataItem) {
      if (AssetCriticalityStore.loaded && AssetCriticalityStore.assetCriticality?.asset_matrix_id==null)
      this._router.navigateByUrl('/asset-management/asset-matrix')
      else
      this.editAssetCriticality();
      NoDataItemStore.unSetClickedNoDataItem();
    }
    
  })
  AppStore.showDiscussion = false;

    
    setTimeout(() => {
      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);


    }, 250);

    // var current_fs, next_fs, previous_fs; //fieldsets
    // var left, opacity, scale; //fieldset properties which we will animate
    // var animating; //flag to prevent quick multi-click glitches

    // $(".next").click(function() {
    //     if (animating) return false;
    //     animating = true;

    //     current_fs = $(this).parent();
    //     next_fs = $(this).parent().next();

    //     //activate next step on progressbar using the index of next_fs
    //     $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //     //show the next fieldset
    //     next_fs.show();
    //     //hide the current fieldset with style
    //     current_fs.animate({
    //         opacity: 0
    //     }, {
    //         step: function(now, mx) {
    //             //as the opacity of current_fs reduces to 0 - stored in "now"
    //             //1. scale current_fs down to 80%
    //             scale = 1 - (1 - now) * 0.2;
    //             //2. bring next_fs from the right(50%)
    //             left = (now * 50) + "%";
    //             //3. increase opacity of next_fs to 1 as it moves in
    //             opacity = 1 - now;
    //             current_fs.css({
    //                 'transform': 'scale(' + scale + ')'
    //             });
    //             next_fs.css({
    //                 'left': left,
    //                 'opacity': opacity
    //             });
    //         },
    //         duration: 500,
    //         complete: function() {
    //             current_fs.hide();
    //             animating = false;
    //         },
    //         //this comes from the custom easing plugin
    //         easing: 'easeOutQuint'
    //     });
    // });

    // $(".previous").click(function() {
    //     if (animating) return false;
    //     animating = true;

    //     current_fs = $(this).parent();
    //     previous_fs = $(this).parent().prev();

    //     //de-activate current step on progressbar
    //     $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //     //show the previous fieldset
    //     previous_fs.show();
    //     //hide the current fieldset with style
    //     current_fs.animate({
    //         opacity: 0
    //     }, {
    //         step: function(now, mx) {
    //             //as the opacity of current_fs reduces to 0 - stored in "now"
    //             //1. scale previous_fs from 80% to 100%
    //             scale = 0.8 + (1 - now) * 0.2;
    //             //2. take current_fs to the right(50%) - from 0%
    //             left = ((1 - now) * 50) + "%";
    //             //3. increase opacity of previous_fs to 1 as it moves in
    //             opacity = 1 - now;
    //             current_fs.css({
    //                 'left': left
    //             });
    //             previous_fs.css({
    //                 'transform': 'scale(' + scale + ')',
    //                 'opacity': opacity
    //             });
    //         },
    //         duration: 500,
    //         complete: function() {
    //             current_fs.hide();
    //             animating = false;
    //         },
    //         //this comes from the custom easing plugin
    //         easing: 'easeOutQuint'
    //     });
    // });

    // $(".submit").click(function() {
    //     return false;
    // })

    if(AssetRegisterStore.assetId){
      this.getCriticalityData();
    }
    else{
      this._router.navigateByUrl('/asset-management/assets');
    }
    
   

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.closeCancel(item);
    })

    this.modalAddMtrixEventSubscription = this._eventEmitterService.assetMatrixForm.subscribe(res => {
      this.closeFormModal();
    });

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })


  }

  changeZIndex() {
    if ($(this.criticalityForm.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.criticalityForm.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.criticalityForm.nativeElement, 'overflow', 'auto');
    }

  }

  
  ngAfterViewChecked(){
    // <script>
   //step-form-small starts
   var current_fs, next_fs, previous_fs; //fieldsets
   var left, opacity, scale; //fieldset properties which we will animate
   var animating; //flag to prevent quick multi-click glitches

   $(".next").click(function (event) {
     current_fs = $(this).parent();
     next_fs = $(this).parent().next();
     current_fs.hide(100);
     next_fs.show(100);
     $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
   })

   $(".previous").click(function (event) {
     current_fs = $(this).parent();
     previous_fs = $(this).parent().prev();
     current_fs.hide(100);
     previous_fs.show(100);
     $("#progressbar li").eq($("fieldset").index(next_fs)).removeClass("active");

   })
   $(".submit").click(function () {
    return false;
  })

}

  nextPrev(n) {

    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }


    // Hide the current tab:
    // x[this.currentTab]?.style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      // x[this.currentTab].style.display = "block";
      // this.submitForm();

      return false;
    }
    // Otherwise, display the correct tab:

    this.showTab(this.currentTab);

  }

  getCriticalityData(){
    if(AssetCriticalityStore.loaded && AssetCriticalityStore.assetCriticality?.criticalities?.length>0){
      var subMenuItems = [
      
        { activityName: 'CREATE_ASSET_CRITICALITY', submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: '/asset-management/assets'} },

      ]
      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    }
    else if(AssetCriticalityStore.loaded && AssetCriticalityStore.assetCriticality?.criticalities?.length==0 && AssetCriticalityStore.assetCriticality?.asset_matrix_id){
      var subMenuItems = [
      
        { activityName: 'CREATE_ASSET_CRITICALITY', submenuItem: { type: 'new_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: '/asset-management/assets' } },

      ]
      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    }
   
  

 
    this.setCriticalityData();
  }


  setCriticalityData(){
    this._assetCriticalityService.getItem().subscribe(res=>{
      if(res['is_criticality_performed']){
        this.getMatrixData(res['asset_matrix_id'],true)
        this.getMatrixArray(res,true)
      }
      else{
        if(res['asset_matrix_id']!=null)
        this.getMatrixData(res['asset_matrix_id'],false)
        
      }
       
     
        
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMatrixData(id,call){
    this._assetMatrixService.getItem(id).subscribe(res=>{
      if(!call)
      this.getMatrixArray(res,false)
      this._utilityService.detectChanges(this._cdr);
    })
  }


  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      // this.getSelectedValues();
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Save";
    } else {
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n)
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  
	Depreciation() {
		let yr: any;
		let cost: any;
		if (AssetRegisterStore.individualAssetDetails?.depreciation_duration && AssetRegisterStore.individualAssetDetails?.depreciation_percentage) {
			var currenyYear = Number(AssetRegisterStore.individualAssetDetails?.purchased_date.split('-')[0]);
			cost = AssetRegisterStore.individualAssetDetails?.asset_value;
      let annualDepriciation = Math.floor(cost * (AssetRegisterStore.individualAssetDetails?.depreciation_percentage / 100));
			
			for (var i = 0; i <= AssetRegisterStore.individualAssetDetails?.depreciation_duration; i++) {
				yr = currenyYear + i;
				const row = {
					year: yr,
					value: cost
				};
				this.duration_table.push(row);
				cost = cost - annualDepriciation>0?cost - annualDepriciation:0;
			}
		}

	}

  
  editAssetCriticality() {
    AssetRegisterStore.individual_asset_loaded=true;
    // if(){
      this.Depreciation();

      this._renderer2.setStyle(this.criticalityForm.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.criticalityForm.nativeElement, 'overflow', 'auto');
  
      $(this.criticalityForm.nativeElement).modal('show');
      // NoDataItemStore.unsetNoDataItems();
      // setTimeout(() => {
        // NoDataItemStore.setNoDataItems({ title: "control_empty_message" });
        this._utilityService.detectChanges(this._cdr);
      // }, 250);
    // }
   

  }

  getMatrixArray(response,call){
    this.matrixArray = [];
    if(call){
      // if(response['criticalities']?.length>0){
        for(let c of response['criticalities']){
          this.matrixArray.push({
            "matrix_category_id":c.asset_matrix_asset_matrix_category_id,
            "asset_matrix_asset_matrix_category":c.asset_matrix_asset_matrix_categories?.asset_matrix_category,
            "asset_option_value":c.asset_option_values
          })
        }
      // }
      if(this.matrixArray?.length>0)
      this.getRating();
      
    }
    
    else{
      for(let i of response.asset_matrix_categories){
        // i.asset_matrix_category['cat_id'] = i.id;
        this.matrixArray.push({"matrix_category_id":i.id,"asset_matrix_asset_matrix_category":i.asset_matrix_category,"asset_option_value":response.asset_option_values[0]});
  
      }
      if(this.matrixArray?.length>0)
      this.getRating();
    }

    this._utilityService.detectChanges(this._cdr);

   
   

  }

  setOptionValue(option,matrix_id){
    let pos = this.matrixArray.findIndex(e=>e.matrix_category_id == matrix_id);
    if(pos!=-1){
      this.matrixArray[pos].asset_option_value = option;
    }
  }

  isActive(option_id,matrix_id){
    let pos = this.matrixArray.findIndex(e=>e.matrix_category_id == matrix_id);
    if(pos!=-1){
      if(this.matrixArray[pos].asset_option_value?.id == option_id)
        return true;
      else
        return false;
    }
    else
      return false;
  }

  getRating(){
    let score = 0;
    this.criticalityRating = null;
    this.criticalityScore = null;
    switch(AssetMatrixStore?.individualAssetMatrixDetails?.asset_calculation_method?.type){
      
      case 'addition':
        for(let i of this.matrixArray){
          score = score + i.asset_option_value?.score;
          
        }
        break;
      case 'multiplication':
        for(let i of this.matrixArray){
          if(score==0){
            score = i.asset_option_value?.score;
          }
          else{
            score = score*i.asset_option_value?.score;
          }
        }
        break;

        case 'average':
          let total = 0;
          if(this.matrixArray?.length>0){
            if(this.matrixArray?.length==1){
              score = this.matrixArray[0]?.asset_option_value.score;
            }
            else{
              for(let i of this.matrixArray){
                total = total + i.asset_option_value?.score;
              }
              score = total/this.matrixArray?.length;
            }
            
          }
          else{
            score = 0;
          }
         
          break;
        case 'highest':
          let mArray=[];
          if(this.matrixArray?.length==1){
            score = this.matrixArray[0]?.asset_option_value.score;
          }
          else{
            for(let i of this.matrixArray){
              mArray.push(i.asset_option_value.score)
            }
            score = Math.max(...mArray);
          }
          
    }

    if(score){
      for(let rating of AssetMatrixStore.individualAssetMatrixDetails?.asset_ratings){
        if(score>=rating.score_from && score<=rating.score_to){
          this.criticalityRating = rating;
          break;
        }
      }
    }
    this.criticalityScore = score
    
  }

  getMethod(){
   
    if(AssetMatrixStore?.individualAssetMatrixDetails?.asset_calculation_method?.type == 'addition'){
      return 'Total';
    }
    else if(AssetMatrixStore?.individualAssetMatrixDetails?.asset_calculation_method?.type == 'multiplication'){
      return 'Product'
    }
    else if(AssetMatrixStore?.individualAssetMatrixDetails?.asset_calculation_method?.type == 'average'){
      return 'Average';
    }
    else{
      return 'Highest'
    }
  }

  getArrayFormatedString(type, items) {
		return this._helperService.getArraySeperatedString(',', type, items);
	}


  getArraySeperatedString() {
		if (this.matrixArray && this.matrixArray.length > 0 && this.matrixArray[0].hasOwnProperty('asset_matrix_asset_matrix_category')) {
			var result = this.matrixArray.map(function (val) {
				return val['asset_matrix_asset_matrix_category'].title;
			}).join(',');
			return result;
		}
		else {
			return AppStore.noContentText;
		}
	}

  getCriticalityArray(){
    let criticalityArray = [];
    for(let i of this.matrixArray){
      criticalityArray.push({"asset_matrix_asset_matrix_category_id":i.matrix_category_id,"asset_option_value_id":i.asset_option_value.id})
    }
    return criticalityArray;
  }

  getAssetRatingScore(data){
    return Math.round(data)
  }

  saveCriticality(){
    this.formErrors = null;
    AppStore.enableLoading();
    let SaveData={
      asset_criticalities:this.getCriticalityArray()
    }
   
    this._assetCriticalityService.updateItem(SaveData).subscribe(res=>{
      AppStore.disableLoading();
      this.currentTab = 0;
      this.showTab(0)
      this.closePerformPopup();
      this.setCriticalityData();
      this._utilityService.detectChanges(this._cdr);
     
    }, (err: HttpErrorResponse) => {
      this.closePerformPopup();
      AppStore.disableLoading();
      if (err.status == 422) {
        this.showTab(1);

        this.formErrors = err.error.errors;

      }
      else if (err.status == 500 || err.status == 403) {
        this.closePerformPopup();

      }
      this._utilityService.detectChanges(this._cdr);
    });
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal() {
    this._renderer2.addClass(this.assetMatrixFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.assetMatrixFormModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.assetMatrixFormModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.assetMatrixFormModal.nativeElement, 'overflow', 'none');
    this.assetMatrixObjectObject.type = null;
  } 

  openFormModal() {
    this._renderer2.addClass(this.assetMatrixFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.assetMatrixFormModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.assetMatrixFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.assetMatrixFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  closePerformPopup() {

    // location.reload();
    // $("#progressbar li").eq($("fieldset").index(2)).removeClass("active");
    // $("#progressbar li").eq($("fieldset").index(3)).removeClass("active");
    // $("#progressbar li").eq($("fieldset").index(4)).removeClass("active");
    // $("#progressbar li").eq($("fieldset").index(0)).addClass("active");

    setTimeout(() => {
      $(this.criticalityForm.nativeElement).modal('hide');
      this._renderer2.setStyle(this.criticalityForm.nativeElement, 'z-index', 0);
      this._renderer2.setStyle(this.criticalityForm.nativeElement, 'overflow', 'none');
    }, 100);

  }

  confirmCancel() {
    this.cancelObject.type = 'Cancel';
    this.cancelObject.title = 'Cancel criticality Creation?';
    this.cancelObject.subtitle = 'criticality_cancel_confirmation';
    $(this.cancelPopup.nativeElement).modal('show');
  }

  clearCancelObject() {

    this.cancelObject.title = '';
    this.cancelObject.subtitle = '';

  }
  closeCancel(status) {
    $(this.cancelPopup.nativeElement).modal('hide');
    if (status) {
      AppStore.disableLoading();
      this.clearCancelObject();
      // NoDataItemStore.unsetNoDataItems();
      // NoDataItemStore.setNoDataItems({ title: "assessment_empty_message", subtitle: 'assessment_subtitle', buttonText: 'perform_now' });
      this._utilityService.detectChanges(this._cdr);
      this.closePerformPopup();

    }
    else {
      this.clearCancelObject();
    }
    // setTimeout(() => {
    //   $(this.cancelPopup.nativeElement).modal('hide');
    // }, 250);
  }


  getYear(date){
		return new Date(date).getFullYear();
	  }

    getRatingData(id){
    let pos = AssetMatrixStore.individualAssetMatrixDetails?.asset_ratings.findIndex(e=>e.id == id);
    if(pos!=-1){
      return AssetMatrixStore.individualAssetMatrixDetails?.asset_ratings[pos];
    }
    }

    addCriticality(){
      this.assetMatrixObjectObject.type = 'Add';
      this.openFormModal();
      this._utilityService.detectChanges(this._cdr);
    }



    ngOnDestroy(){
      this.criticalityPresent = false;
      this.criticalityRating = null;
      this.criticalityScore=null;
      this.cancelEventSubscription?.unsubscribe();
      this.networkFailureSubscription?.unsubscribe();
      this.idleTimeoutSubscription?.unsubscribe();
      this.modalAddMtrixEventSubscription?.unsubscribe();
      NoDataItemStore.unsetNoDataItems();
      SubMenuItemStore.makeEmpty();
    }

}
