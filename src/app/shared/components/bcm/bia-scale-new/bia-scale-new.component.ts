import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BiaScaleService } from 'src/app/core/services/bcm/bia-scale/bia-scale.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BiaScaleCategoryService } from 'src/app/core/services/masters/bcm/bia-scale-category/bia-scale-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { BiaScaleStore } from 'src/app/stores/bcm/configuration/bia-scale/bia-scale-store';
import { BiaScaleCategoryMasterStore } from 'src/app/stores/masters/bcm/bia-scale-category.master.store';

@Component({
  selector: 'app-bia-scale-new',
  templateUrl: './bia-scale-new.component.html',
  styleUrls: ['./bia-scale-new.component.scss']
})
export class BiaScaleNewComponent implements OnInit {

  @Input('source') source: any;
  
  AppStore = AppStore;
  BiaScaleCategoryMasterStore = BiaScaleCategoryMasterStore;
  BiaScaleStore = BiaScaleStore
  form: FormGroup;
  formErrors: any;
  sampleArray=[{title:"Day"},{title:"Hour"}]
  intervalArray=[]
  existingNumbersArray = [] //To check the typed number is existing or not
  itemExist:boolean=false;
  betweenNumberExisting: boolean=false;
  fromAndTo: boolean=false;
  is_English:boolean=false;
  constructor(
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _biaScaleCategoryService: BiaScaleCategoryService,
    private _biaScaleService: BiaScaleService
  ) { }
  

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id:[''],
      is_range_value:[null],
      eng_time_scale:['',[Validators.required]],
      eng_from:['',[Validators.required]],
      eng_to:[null],
      order:['',[Validators.required]]
    })
    this.resetForm();
    this.getBiaScale();
    if (this.source)
    this.setValue();
    this.form.patchValue({is_range_value:BiaScaleStore.isRangeValue})
    if(BiaScaleStore.BiaScaleDetails.length!=0){
      this.form.patchValue({
        eng_time_scale:BiaScaleStore.BiaScaleDetails[0].bia_scale_category_id
      })
    }
  }

  ngDoCheck(){
    if (this.source && this.source.hasOwnProperty('values') && this.source.values && !this.form.value.id)
      this.setValue();
  }

  rangeChange(event){
    if(!this.form.value.is_range_value){
      this.form.patchValue({
        eng_to:''
      })
      this.form.get('eng_to').clearValidators();
      this.form.get('eng_to').updateValueAndValidity();
    }else{
      this.form.get('eng_to').setValidators([Validators.required]);
      this.form.get('eng_to').updateValueAndValidity();
    }
  }

  setValue(){
    if (this.source.hasOwnProperty('values') && this.source.values) {
      let {from,bia_scale_category_id,to,id,is_range_value,order } = this.source.values
      console.log(this.source.values);
      
      this.form.patchValue({
        id: id,
        eng_time_scale: bia_scale_category_id,
        eng_from: from,
        eng_to: to,
        is_range_value:is_range_value,
        order:order
      })
    }
    this._utilityService.detectChanges(this._cdr);
  }

  searchBiaScale(e) {
    this._biaScaleCategoryService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBiaScale() {
    this._biaScaleCategoryService.getItems(false).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
  }

  getTimeScale(e){
    this.form.patchValue({
      eng_time_scale: e
    })
  }

  // saveImpactScenario(close:boolean=false){
  //   BiaMatrixStore.setbiaScale(this.intervalArray);
  //   console.log("scale",BiaMatrixStore.biaScale)
  //   if(close)this.closemsModal()
  // }

   // function for add & update
   saveBiaScale(close: boolean = false) {
    BiaMatrixStore.setbiaScale(this.intervalArray);
    this.formErrors = null;
  
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        save = this._biaScaleService.updateItem(this.form.value.id, this.processDataForSave());
      } else {
  
        delete this.form.value.id
        save = this._biaScaleService.saveItem(this.processDataForSave());
      }
  
      save.subscribe((res: any) => {
        // this.res_id = res.id;// assign id to variable;
        if (!this.form.value.id) {
          this.resetForm();
        }
       
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close){
          this.closemsModal();
        } else{
          this._biaScaleService.getItems().subscribe(res=>{
            this.form.patchValue({
              eng_from:'',
              eng_to:''
            })
            this._utilityService.detectChanges(this._cdr);
          })
        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          // console.log(this.formErrors);
        } else if(err.status == 500 || err.status == 403){
          this.closemsModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
  
      });
    }
  }

  processDataForSave(){
    let saveData
    saveData = {
      bia_scale_category_id:this.form.value.eng_time_scale,
      from:this.form.value.eng_from,
      to:this.form.value.eng_to,
      is_range_value:this.form.value.is_range_value?1:0,
      order:this.form.value.order
    }
    return saveData
  }

  addNumbers(){
    var lowEnd = this.form.value.eng_from;
    var highEnd = this.form.value.eng_to;
    this.existingNumbersArray = [];
    while(lowEnd <= highEnd){
      this.existingNumbersArray.push(lowEnd++);
    }
  }

  changeFromInput(){
    if(this.form.value.eng_from){
      let pos = this.existingNumbersArray.findIndex(e => e === this.form.value.eng_from )
      if(pos==-1){
        this.betweenNumberExisting = false
      }else{
        this.betweenNumberExisting = true
      }
    }else{
      this.betweenNumberExisting = false
    }
  }

  changeToInput(){
    var minValue = this.form.value.eng_from;
      var maxValue = this.form.value.eng_to;
    if(maxValue){
      if(minValue > maxValue){
        this.fromAndTo = true
      }else{
        this.fromAndTo = false
      }
      // let pos = this.existingNumbersArray.findIndex(e => e === this.form.value.eng_to )
      // if(pos==-1){
      //   this.betweenNumberExisting = false
      // }else{
      //   this.betweenNumberExisting = true
      // }
    }

    // else{
    //   this.betweenNumberExisting = false
    // }
    this._utilityService.detectChanges(this._cdr);
  }

  addBetweenNumbers(){
    console.log("init",this.existingNumbersArray)
    if(this.existingNumbersArray.length!=0){
      let pos = this.existingNumbersArray.findIndex(e => {
        e===this.form.value.eng_from
      })
      console.log("pos",pos)
      if(pos==-1){
        console.log("inside pos")
        this.addNumbers()
        this.betweenNumberExisting = false;
      }else{
        this.betweenNumberExisting = true;
        console.log("true",this.betweenNumberExisting)
      }
    }else{
      this.addNumbers()
      this.betweenNumberExisting = false;
      console.log("first",this.betweenNumberExisting,this.existingNumbersArray)
    }
  }

  addImpactScenario(){
    if(this.intervalArray.length>0){
      let pos
      if(this.form.value.eng_from && this.form.value.eng_to)pos=this.intervalArray.findIndex(e => {e.from === this.form.value.eng_from,e.to === this.form.value.eng_to})
      if(pos==-1){          
        if(this.form.value.eng_from && this.form.value.eng_to)this.intervalArray.push({from:this.form.value.eng_from,to:this.form.value.eng_to,time_scale:this.form.value.eng_time_scale});
        this.addNumbers()
        this.form.patchValue({eng_from:'',
            eng_to:'',});
          this.itemExist=false;            
      }else{ 
        this.itemExist=true;                        
    }
    }else{
      if(this.form.value.eng_from && this.form.value.eng_to)this.intervalArray.push({from:this.form.value.eng_from,to:this.form.value.eng_to,time_scale:this.form.value.eng_time_scale});
      this.addNumbers()
      this.form.patchValue({eng_from:'',
        eng_to:'',});
        this.itemExist=false;  
        this.betweenNumberExisting = false
    }
  }

  deleteIncidentLessons(index){
    this.intervalArray.splice(index, 1);
  }

  tabChange(status:boolean){
    this.is_English = status;
    this.resetForm()
    this.intervalArray = []
  }

  closemsModal(){
      this._utilityService.detectChanges(this._cdr);
    this.resetForm();
    setTimeout(() => {
      this._eventEmitterService.dismissBiaScaleModal()
    }, 250);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  
@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

  if(event.key == 'Escape' || event.code == 'Escape'){     

      this.cancel();

  }

}

     // cancel modal
     cancel() {
      this.closemsModal();
    }

  resetForm() {
    this.form.reset();
    if(BiaScaleStore.BiaScaleDetails.length!=0){
      this.form.patchValue({
        eng_time_scale:BiaScaleStore.BiaScaleDetails[0].bia_scale_category_id
      })
    }
    if(BiaScaleStore.isRangeValue)this.form.patchValue({is_range_value:BiaScaleStore.isRangeValue})
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

}
