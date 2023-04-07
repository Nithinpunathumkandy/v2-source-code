import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { BiaCategoryService } from 'src/app/core/services/bcm/bia-category/bia-category.service';
import { ImpactScenarioService } from 'src/app/core/services/bcm/impact-scenario/impact-scenario.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BiaCategoryStore } from 'src/app/stores/bcm/configuration/bia-category/bia-category-store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';

@Component({
  selector: 'app-impact-scenario-new',
  templateUrl: './impact-scenario-new.component.html',
  styleUrls: ['./impact-scenario-new.component.scss']
})
export class ImpactScenarioNewComponent implements OnInit {

  @Input('source') source: any;

  AppStore = AppStore;
  BiaMatrixStore = BiaMatrixStore;
  BiaCategoryStore = BiaCategoryStore;
  form: FormGroup;
  formErrors: any;
  itemExist:boolean=false;
  scenarioArray = [] // Need to replace once API ready
  is_English: boolean=true;
  constructor(
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _impactScenarioService: ImpactScenarioService,
    private _biaCategoryService: BiaCategoryService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id:[''],
      eng_impact_category:['',[Validators.required]],
      eng_impact_scenario:['',[Validators.required]],
    })
    this.resetForm();
    this.getImpactCategory();

    if (this.source)
    this.setValue();
  }

  ngDoCheck(){
    if (this.source && this.source.hasOwnProperty('values') && this.source.values && !this.form.value.id)
      this.setValue();
  }

  setValue(){
    if (this.source.hasOwnProperty('values') && this.source.values) {
      let {title,bia_impact_category_id,id } = this.source.values
      console.log(this.source.values);
      
      this.form.patchValue({
        id: id,
        eng_impact_category: bia_impact_category_id,
        eng_impact_scenario: title
      })
    }
  }

  processDataForSave(){
    let saveData
    saveData = {
      bia_impact_category_id:this.form.value.eng_impact_category,
      title:this.form.value.eng_impact_scenario
    }
    return saveData
  }

  // saveImpactScenario(close:boolean=false){
  //   let save = this.processDataForSave()
  //   if(BiaMatrixStore.impactScenario.length==0){
  //     BiaMatrixStore.setImpactScenarioArray(this.scenarioArray);
  //   }else{
  //     this.scenarioArray.forEach(element=>{
  //       BiaMatrixStore.setImpactScenario(element);
  //     })
  //   }
    
  //   console.log("scenar",BiaMatrixStore.impactScenario)
  //   if(close)this.closemsModal()
  // }

    // function for add & update
    saveImpactScenario(close: boolean = false) {
      if(BiaMatrixStore.impactScenario.length==0){
            BiaMatrixStore.setImpactScenarioArray(this.scenarioArray);
          }else{
            this.scenarioArray.forEach(element=>{
              BiaMatrixStore.setImpactScenario(element);
            })
          }
      this.formErrors = null;
    
      if (this.form.value) {
        let save;
        AppStore.enableLoading();
    
        if (this.form.value.id) {
          save = this._impactScenarioService.updateItem(this.form.value.id, this.processDataForSave());
        } else {
    
          delete this.form.value.id
          save = this._impactScenarioService.saveItem(this.processDataForSave());
        }
    
        save.subscribe((res: any) => {
          // this.res_id = res.id;// assign id to variable;
         
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close){
            this.closemsModal();
          } else{
            this.form.patchValue({
              eng_impact_scenario:''
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

  changeTab(status:boolean){
    this.is_English = status
    this.resetForm()
    this.scenarioArray = [];
    this.itemExist = false;
  }

  getImpactCategory() {
    this._biaCategoryService.getItems(false).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
  }

  searchImpactCategory(e) {
    this._biaCategoryService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  addImpactScenario(){
    if(this.scenarioArray.length>0){
      let pos
      if(this.form.value.eng_impact_scenario)pos=this.scenarioArray.findIndex(e => e.title === this.form.value.eng_impact_scenario)
      if(pos==-1){          
        if(this.form.value.eng_impact_scenario)this.scenarioArray.push({title:this.form.value.eng_impact_scenario,category:this.form.value.eng_impact_category});

          this.form.patchValue({eng_impact_scenario:''});
          this.itemExist=false;            
      }else{ 
        this.itemExist=true;                        
    }
    }else{
      if(this.form.value.eng_impact_scenario)this.scenarioArray.push({title:this.form.value.eng_impact_scenario,category:this.form.value.eng_impact_category});
      this.form.patchValue({eng_impact_scenario:''});
    }
  }

  deleteIncidentLessons(index){
    this.scenarioArray.splice(index, 1);
  }

  closemsModal(){
      this._utilityService.detectChanges(this._cdr);
    this.resetForm();
    setTimeout(() => {
      this._eventEmitterService.dismissImpactScenarioModal()
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
