import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BiaCategoryService } from 'src/app/core/services/bcm/bia-category/bia-category.service';
import { ImpactAreaService } from 'src/app/core/services/bcm/impact-area/impact-area.service';
import { ImpactScenarioService } from 'src/app/core/services/bcm/impact-scenario/impact-scenario.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BiaCategoryStore } from 'src/app/stores/bcm/configuration/bia-category/bia-category-store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { ImpactScenarioStore } from 'src/app/stores/bcm/configuration/impact-scenario/impact-scenario-store';

@Component({
  selector: 'app-impact-area-new',
  templateUrl: './impact-area-new.component.html',
  styleUrls: ['./impact-area-new.component.scss']
})
export class ImpactAreaNewComponent implements OnInit {

  @Input('source') source: any;

  AppStore = AppStore;
  BiaMatrixStore = BiaMatrixStore;
  BiaCategoryStore = BiaCategoryStore;
  ImpactScenarioStore = ImpactScenarioStore;
  form: FormGroup;
  formErrors: any;
  itemExist:boolean=false;
  areaArray = [] // Need to replace once API ready
  is_English: boolean=true;
  constructor(
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _biaCategoryService: BiaCategoryService,
    private _impactScenarioService: ImpactScenarioService,
    private _impactAreaService: ImpactAreaService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id:[''],
      // eng_impact_category:['',[Validators.required]],
      eng_impact_scenario:['',[Validators.required]],
      eng_impact_area:['',[Validators.required]],
    })
    this.resetForm();
    this.getImpactScenario();

    if (this.source)
    this.setValue();
  }

  ngDoCheck(){
    if (this.source && this.source.hasOwnProperty('values') && this.source.values && !this.form.value.id)
      this.setValue();
  }

  setValue(){
    if (this.source.hasOwnProperty('values') && this.source.values) {
      let {title,bia_impact_category_id,bia_impact_scenario_id,id } = this.source.values
      console.log(this.source.values);
      
      this.form.patchValue({
        id: id,
        eng_impact_category: bia_impact_category_id,
        eng_impact_scenario: bia_impact_scenario_id,
        eng_impact_area: title
      })
    }
  }

  processDataForSave(){
    let saveData
    saveData = {
      // bia_impact_category_id:this.form.value.eng_impact_category,
      bia_impact_scenario_id:this.form.value.eng_impact_scenario,
      title:this.form.value.eng_impact_area,

    }
    return saveData
  }

  // saveImpactArea(close:boolean=false){
  //   let save = this.processDataForSave()
  //   if(BiaMatrixStore.impactArea.length==0){
  //     BiaMatrixStore.setImpactArea(this.areaArray);
  //   }else{
  //     this.areaArray.forEach(element=>{
  //       BiaMatrixStore.setImpactAreaArray(element);
  //     })
  //   }
    
  //   console.log("area",BiaMatrixStore.impactArea)
  //   if(close)this.closemsModal()
  // }

  changeTab(status:boolean){
    this.is_English = status
    this.resetForm()
    this.areaArray = [];
    this.itemExist = false;
  }

    // function for add & update
    saveImpactArea(close: boolean = false) {
      if(BiaMatrixStore.impactArea.length==0){
        BiaMatrixStore.setImpactArea(this.areaArray);
      }else{
        this.areaArray.forEach(element=>{
          BiaMatrixStore.setImpactAreaArray(element);
        })
      }
      this.formErrors = null;
    
      if (this.form.value) {
        let save;
        AppStore.enableLoading();
    
        if (this.form.value.id) {
          save = this._impactAreaService.updateItem(this.form.value.id, this.processDataForSave());
        } else {
    
          delete this.form.value.id
          save = this._impactAreaService.saveItem(this.processDataForSave());
        }
    
        save.subscribe((res: any) => {
          // this.res_id = res.id;// assign id to variable;
          // if (!this.form.value.id) {
          //   this.resetForm();
          // }
         
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close){
            this.closemsModal();
          } else{
            this.form.patchValue({
              eng_impact_area:''
            })
          }
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else if(err.status == 500 || err.status == 403){
            this.closemsModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
    
        });
      }
    }

  // getImpactCategory() {
  //   this._biaCategoryService.getItems(false).subscribe(res => {
  //   this._utilityService.detectChanges(this._cdr);
  // })
  // }

  // searchImpactCategory(e) {
  //   this._biaCategoryService.getItems(false,'&q='+e.term).subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  // }

  getImpactScenario() {
    this._impactScenarioService.getItems(false).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
  }

  searchImpactScenario(e) {
    this._impactScenarioService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  addImpactScenario(){
    if(this.areaArray.length>0){
      let pos
      if(this.form.value.eng_impact_area)pos=this.areaArray.findIndex(e => e.title === this.form.value.eng_impact_area)
      if(pos==-1){          
        if(this.form.value.eng_impact_area)this.areaArray.push({title:this.form.value.eng_impact_area,
        category:this.form.value.eng_impact_category, scenario:this.form.value.eng_impact_scenario});       
          this.form.patchValue({eng_impact_area:''});
          this.itemExist=false;            
      }else{ 
        this.itemExist=true;                        
    }
    }else{
        if(this.form.value.eng_impact_area)this.areaArray.push({title:this.form.value.eng_impact_area,
          category:this.form.value.eng_impact_category, scenario:this.form.value.eng_impact_scenario});
        this.form.patchValue({eng_impact_area:''});
        this.itemExist=false;  
    }
  }

  deleteIncidentLessons(index){
    this.areaArray.splice(index, 1);
  }

  closemsModal(){
      this._utilityService.detectChanges(this._cdr);
    this.resetForm();
    setTimeout(() => {
      this._eventEmitterService.dismissImpactAreaModal()
    }, 250);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
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


}
