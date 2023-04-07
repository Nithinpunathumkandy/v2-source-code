import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectKpiService } from 'src/app/core/services/masters/project-monitoring/project-kpi/project-kpi.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { StrategicThemesStore } from 'src/app/stores/event-monitoring/events/event-strategic-themes-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import {EventStrategicThemesService} from 'src/app/core/services/event-monitoring/event-strategic-themes/event-strategic-themes.service';
import {UnitMasterStore} from 'src/app/stores/masters/human-capital/unit-store';
import { UnitService } from 'src/app/core/services/masters/human-capital/unit/unit.service';
declare var $: any;

@Component({
  selector: 'app-add-strategic-theme',
  templateUrl: './add-strategic-theme.component.html',
  styleUrls: ['./add-strategic-theme.component.scss']
})
export class AddStrategicThemeComponent implements OnInit {
  @Input('source') strategicSource: any;
  @ViewChild('unitMasterModal', { static: true }) unitMasterModal: ElementRef;
  StrategicThemesStore = StrategicThemesStore;
  EventsStore = EventsStore;
  UnitMasterStore = UnitMasterStore;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  kpiArray: any[] = [];
  // notes = [
  //   {
  //     id:1,
  //     title : "ebdjhfbsdnfsdbjf"
  //   }
  // ]
  data = {
    objective_id : null,
    kpis : []

  };
  unitMasterObject = {
    component: 'Master',
    type: null,
    values: null,
    compareValue:null
  };
  criteriaEmptyList = "common_nodata_title";
  selectedIndex: any = null;
  objctiveData: any = [];
  unitmasterSubscription: any;
  validationForm=false;
  constructor(private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,    
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _unitService: UnitService,
    private _eventStrategicThemesService: EventStrategicThemesService,
    private _projectKpiService: ProjectKpiService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id : null,
      event_id : null,
      event_objective_id:null,
      theme_id: [null, [Validators.required]],
      objectives : []
    });
   
    this.unitmasterSubscription = this._eventEmitterService.humanCapitalUnitControl.subscribe((res)=>{
      this.closeUnitMasterModal();
    })

    this.getTheme();
    if(this.strategicSource.type =="Edit"){
      this.editData()
    }
  }

  getTheme(){
    this._eventStrategicThemesService.getEventThemes(false,null).subscribe(() =>
     setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }
  getKpis(){
    this._projectKpiService.getItems(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  changeTheme(){
    //console.log(this.strategicSource)
    let pos
    if(this.strategicSource.type == "Edit"){
       pos = StrategicThemesStore._eventObjectiveDetails.findIndex(e=> e.theme_id == this.form.value.theme_id)
      //console.log(pos);
      if(pos == -1){
         //console.log(pos);
        this.objctiveData= []
      }
      // else {
      //   this.editData()
      // }
    }
    //console.log(this.objctiveData)
    this.getObjectives(this.form.value.theme_id,pos)

  }

  getObjectives(id,pos){
    if(id)
    this._eventStrategicThemesService.getObjectives(id).subscribe((res) => {
      this.getUnit();
    if(this.strategicSource.type == "Add"){
      this.getData(res)
      
    }
    if(this.strategicSource.type == "Edit" && pos>-1)
    {

      this.setEditDataChecked();
    }
    
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      
    });

  }
  getUnit() {
    this._unitService.getItems(false,null,false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getData(res){
    this.objctiveData= []
    if(StrategicThemesStore._eventObjectiveDetails.length > 0){
    let pos = StrategicThemesStore._eventObjectiveDetails.findIndex(e=>e.theme_id == this.form.value.theme_id )
    if(pos != -1){
      for(let data of StrategicThemesStore._eventObjectiveDetails[pos].event_strategic_objectives){
        for(let obj of res['objectives']){
          if(data.objective_id == obj.id){
            for(let kpi of data.event_strategic_kpis){
              for(let mainKpi  of obj.project_kpis){
                if(kpi.kpi_id == mainKpi.id){
                  this.selectKpi(null,kpi.kpi_id,data.objective_id,kpi?.unit_id,kpi?.predicted_exposure,kpi?.actual_exposure?kpi?.actual_exposure:0);
                  this.setValuesForKPI(null,kpi.kpi_id,data.objective_id,kpi?.unit_id,kpi?.predicted_exposure,kpi?.actual_exposure?kpi?.actual_exposure:0);
                }
              }
            }
          }
        }
      }
    }
     
    }
  }

  searchTheme(e,patchValue:boolean = false){
    this._eventStrategicThemesService.getEventThemes(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue({ themeId: i.id });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUnit(e,patchValue:boolean = false){
    this._unitService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            //this.form.patchValue({ themeId: i.id });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  editData(){
    //console.log(this.strategicSource.values.theme.id)
    this.form.patchValue({
      theme_id : this.strategicSource.values.theme ? this.strategicSource.values.theme.theme_id : null,
      id : this.strategicSource.values.theme ? this.strategicSource.values.theme.id  : null
    })
    //console.log(this.form.value)
    //this.getObjectives(this.strategicSource.values.theme.theme_id);
    this.changeTheme();
    
    }

    getButtonText(text) {
      return this._helperService.translateToUserLanguage(text);
    }

    processSaveData() {
      
      let saveData = {
        event_objective_id :this.strategicSource.values.objectiveId ,
        theme_id : this.form.value.theme_id? this.form.value.theme_id : null,
        objectives : this.objctiveData.length > 0 ? this.objctiveData : [],
        //id : this.form.value.id ? this.form.value.id : null
        // type : this.scopeOfWorkSource.scopeType,
      }
      
      return saveData;
    }
    setValueChange()
    {
      
    }

  clearTheme(){
    this.getTheme()
    this.StrategicThemesStore._themeObjective = []
  }
  clearUnit(){
    this.getUnit()
  }

  cancel(){
    this._eventEmitterService.dismissEventStrategicThemeModal();
    this.objctiveData= []
    StrategicThemesStore._themeObjective=[];
  }

  save(close: boolean = false) {
    //console.log(this.kpiArray,this.objctiveData)
    //console.log(StrategicThemesStore?._themeObjective);
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.strategicSource.type == "Edit") {
        //this.processDataForEdit()
        save = this._eventStrategicThemesService.updateStrategicTheme(this.processSaveData(), this.strategicSource.values.objectiveId,this.form.value.id);
      } else {
       // console.log(this.processSaveData())
      save = this._eventStrategicThemesService.saveStrategicTheme(this.processSaveData(),this.strategicSource.values.objectiveId);
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        if(this.strategicSource.type == "Add")
        {
          this.clearTheFields()
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  resetForm() {
    this.form.reset();
    this.objctiveData= []
    StrategicThemesStore._themeObjective = []
    this.formErrors = null;
  }

  selectedIndexChange(index,id){
    if(this.selectedIndex == index){
      this.selectedIndex = null;
    } else{
      this.selectedIndex = index;
      this._utilityService.detectChanges(this._cdr);
    }
     this.getKpis()
  }

  checkSelectedStatus(id: number,objId) {
    var pos = null;
    pos = this.objctiveData.findIndex(e => e.objective_id == objId);
    if (pos != -1) {
     let kpos =  this.objctiveData[pos].kpis.findIndex(e=> e.kpi_id == id)
     if(kpos != -1)
     return true;
     else return false;

    }

  }
  selectKpi(event, doc, obj ,unitId?,predictedExposure?,actual_exposure?) {
   let objectId =  obj
    if(this.objctiveData.length > 0){
      let pos = this.objctiveData.findIndex(e => e.objective_id == ( objectId));
      if(pos != -1){
        let kpos = this.objctiveData[pos].kpis.findIndex(e => e.kpi_id == doc);
        if(kpos!= -1){
         this.objctiveData[pos].kpis.splice(kpos, 1);
         if(this.objctiveData[pos].kpis.length == 0){
           this.objctiveData.splice(pos,1)
         }


        }else {
          let kpiIds = {
                  kpi_id : doc,
                  unit_id:unitId,
                  predicted_exposure:predictedExposure,
                  actual_exposure:actual_exposure
                }
          this.objctiveData[pos].kpis.push(kpiIds)
        }
        //code to push new data
       
      }else{
        let item = {
          objective_id : objectId,
          kpis : []
        }
        let kpiIds = {
          kpi_id : doc,
          unit_id:unitId,
          predicted_exposure:predictedExposure,
          actual_exposure:actual_exposure
        }
         item.kpis.push(kpiIds)
         this.objctiveData.push(item)
      }
     
     }
    //  else if (this.objctiveData.length > 0 && this.strategicSource.type =="Edit"){
    //   let pos = this.objctiveData.findIndex(e => e.objective_id == ( objectId));
    //   if(pos != -1){
    //     let kpos = this.objctiveData[pos].kpis.findIndex(e => e.kpi_id == doc);
    //     if(kpos!= -1){
    //      this.objctiveData[pos].kpis.splice(kpos, 1);

    //     }else {
    //       let kpiIds = {
    //               kpi_id : doc,
    //             }
    //       this.objctiveData[pos].kpis.push(kpiIds)
    //     }
    //     //code to push new data
       
    //   }else{
    //     let item = {
    //       objective_id : objectId,
    //       is_new : 1,
    //       kpis : []
    //     }
    //     let kpiIds = {
    //       kpi_id : doc
    //     }
    //      item.kpis.push(kpiIds)
    //      this.objctiveData.push(item)
    //   }
    //  }
     else{
      //  this.data.objective_id = objectId;
      let item = {
        objective_id : objectId,
        kpis : []
      }
      let kpiIds = {
        kpi_id : doc,
        unit_id:unitId,
        predicted_exposure:predictedExposure,
        actual_exposure:actual_exposure
      }
       item.kpis.push(kpiIds)
       this.objctiveData.push(item)
   
     }
     //console.log(this.objctiveData)
     this.checkValidation()
}

processDataForEdit(){
  this.strategicSource.values.event_strategic_objectives.map(data=>{
   let pos =  this.objctiveData.findIndex(e=>e.objective_id == data.objective_id)
     if(pos != -1){
       let obj = {
         id : data.id
       }
       Object.assign(this.objctiveData[pos],obj)

       for(let kdata of data.project_strategic_kpis){
        let kpos = this.objctiveData[pos].kpis.findIndex(k=>k.kpi_id == kdata.kpi_id)
         if(kpos != -1){
           let kobj = {
             id : kdata.id
           }
           Object.assign(this.objctiveData[pos].kpis[kpos],kobj)
         }
        //  else {
          //  let kobj = {
         
          //  }
          //  Object.assign(this.objctiveData[pos].kpis[kpos],kobj)
        //  }
      }
       
     }else{
       
     }
   
    
  })
}

setEditDataChecked(){
  this.strategicSource.values.theme.event_strategic_objectives.map(data=>{
    for(let kpiData of data.event_strategic_kpis){
      //console.log(kpiData)
      this.selectKpi(null,kpiData.kpi_id,data.objective_id,kpiData?.unit_id,kpiData?.predicted_exposure,kpiData?.actual_exposure?kpiData?.actual_exposure:0);
      this.setValuesForKPI(null,kpiData.kpi_id,data.objective_id,kpiData?.unit_id,kpiData?.predicted_exposure,kpiData?.actual_exposure?kpiData?.actual_exposure:0)
    }
  })
}



checkedAll(notes){
  if(this.objctiveData.length > 0){
    let pos = this.objctiveData.findIndex(e=>e.objective_id == notes.id)
    if(pos != -1){
      if(this.objctiveData[pos].kpis.length == notes.project_kpis.length){
       return true
      }else{
       return false
      }
    }
  }else {
    return false
  }
 
 
}
selectAllKpi(event,notes){
  
  if(event.target.checked){
    let pos =this.objctiveData.findIndex(e=> e.objective_id == notes.id)
    if (pos != -1) {
      this.objctiveData.splice(pos,1)
    }
    notes.project_kpis.map(data=>{
      //console.log(data);
      this.selectKpi(null,data.id,notes.id,data?.unit_id,data?.predicted_exposure,data?.actual_exposure?data?.actual_exposure:0);
       this.checkSelectedStatus(data.id,notes.id)
    })
  }else{
    this.kpiArray = [];
    let pos =this.objctiveData.findIndex(e=> e.objective_id == notes.id)
    if (pos != -1) {
      this.objctiveData.splice(pos,1)
    }
    
  }
  this.checkValidation();
}

openUnit(event, doc, obj){
  setTimeout(() => {
    this.unitMasterObject.type = 'Add';
    this.unitMasterObject.values = null;
    this.unitMasterObject.compareValue={kpiId:doc,objectiveId:obj}
    setTimeout(() => {
      $(this.unitMasterModal.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.unitMasterModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.unitMasterModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.unitMasterModal.nativeElement,'z-index',99999);
    this._utilityService.detectChanges(this._cdr);
  }, 100);
}
closeUnitMasterModal() {
  setTimeout(() => {
  this.unitMasterObject.type = null;
  $(this.unitMasterModal.nativeElement).modal('hide');
  this._renderer2.removeClass(this.unitMasterModal.nativeElement,'show');
  this._renderer2.setStyle(this.unitMasterModal.nativeElement,'display','none');
  this._utilityService.detectChanges(this._cdr);
  this.searchUnitMaster({term : this.UnitMasterStore.lastInsertedId},true)
  }, 200);
}
searchUnitMaster(e,patchValue:boolean = false){
  //console.log(this.unitMasterObject.compareValue)
  this._unitService.getItems(false, '&q=' + e.term).subscribe((res) => {
    if(patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          //this.regForm.patchValue({event_location_id: i.id });
          this.setUnitValue(this.unitMasterObject.compareValue,i.id)
          break;
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  });
}

selectedKpiAddValue(event, doc, obj ,unitId?,predictedExposure?,actual_exposure?)
{
  //console.log(predictedExposure)
  if(this.objctiveData.length)
  {
     for(let i of this.objctiveData)
     {
        const index=i.kpis.findIndex(e=>e.kpi_id==doc)
        if(index>-1)
        {
          i.kpis[index].predicted_exposure=predictedExposure;
          i.kpis[index].unit_id=unitId;
          i.kpis[index].actual_exposure=actual_exposure;

        }
     } 
     this.checkValidation();
  }
  //console.log(this.objctiveData) 
}
setValuesForKPI(event, doc, obj ,unitId?,predictedExposure?,actual_exposure?)
{

  const objectiveIndex=StrategicThemesStore?._themeObjective.findIndex(e=>e.id==obj)
  if(objectiveIndex>-1)
  {
    const kpiIndex=StrategicThemesStore?._themeObjective[objectiveIndex].project_kpis.findIndex(e=>e.id==doc)
    //console.log(kpiIndex)
    if(kpiIndex>-1)
    {
    
      StrategicThemesStore._themeObjective[objectiveIndex].project_kpis[kpiIndex].unit_id=unitId
      StrategicThemesStore._themeObjective[objectiveIndex].project_kpis[kpiIndex].predicted_exposure=predictedExposure
      StrategicThemesStore._themeObjective[objectiveIndex].project_kpis[kpiIndex].actual_exposure=actual_exposure
    }
  }
  
}
setUnitValue(values,unitId)
{
  const objectiveIndex=StrategicThemesStore?._themeObjective.findIndex(e=>e.id==values?.objectiveId)
  if(objectiveIndex>-1)
  {
    const kpiIndex=StrategicThemesStore?._themeObjective[objectiveIndex].project_kpis.findIndex(e=>e.id==values?.kpiId)
    if(kpiIndex>-1)
    {
      StrategicThemesStore._themeObjective[objectiveIndex].project_kpis[kpiIndex].unit_id=unitId

    }
  }
}

clearTheFields()

{
  for(let i of StrategicThemesStore?._themeObjective)
  {
      for(let j of i.project_kpis)
      {
        j.unit_id=null,
        j.predicted_exposure="",
        j.actual_exposure=""
      }
  }
}
numberOnly(evt): boolean {
  //console.log(evt.target.value);
var charCode = (evt.which) ? evt.which : evt.keyCode
if (charCode != 46 && charCode > 31 
  && (charCode < 48 || charCode > 57))
   return false;

return true;

}

checkValidation()
{
  this.validationForm=false;
  if(this.objctiveData.length)
  {
     for(let i of this.objctiveData)
     {
        for(let j of i.kpis)
        {
          //console.log(j)
          if(j.unit_id==undefined || j.predicted_exposure==undefined)
          {
            this.validationForm=false;
            //return this.validationForm;
            break;
          }
          else{
            if(j.unit_id && j.predicted_exposure)
            {
              this.validationForm=true;
            }
          }
          
        }
        if(!this.validationForm)
        {
          break;
        }
     }
  //console.log(this.validationForm)
  }
}

}
