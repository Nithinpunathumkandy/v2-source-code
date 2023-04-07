import { add } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectKpiService } from 'src/app/core/services/masters/project-monitoring/project-kpi/project-kpi.service';
import { ProjectObjectiveService } from 'src/app/core/services/masters/project-monitoring/project-objective/project-objective.service';
import { ProjectThemeService } from 'src/app/core/services/masters/project-monitoring/project-theme/project-theme.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectKpiMasterStore } from 'src/app/stores/masters/project-monitoring/project-kpi-store';
import { ProjectObjectiveMasterStore } from 'src/app/stores/masters/project-monitoring/project-objective-store';
import { ProjectThemeMasterStore } from 'src/app/stores/masters/project-monitoring/project-theme-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';

@Component({
  selector: 'app-add-strategyic-alignment',
  templateUrl: './add-strategyic-alignment.component.html',
  styleUrls: ['./add-strategyic-alignment.component.scss']
})
export class AddStrategyicAlignmentComponent implements OnInit {
  @Input('source') strategicSource: any;
  @ViewChild('theme', { static: true }) theme: ElementRef;
  ProjectThemeMasterStore = ProjectThemeMasterStore;
  ProjectObjectiveMasterStore = ProjectObjectiveMasterStore
  ProjectKpiMasterStore = ProjectKpiMasterStore
  ProjectMonitoringStore = ProjectMonitoringStore
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  kpiArray: any[] = [];
  projectThemeObject = {
    component: 'Master',
    type: null,
    values: null
  }
  notes = [
    {
      id:1,
      title : "ebdjhfbsdnfsdbjf"
    }
  ]
  data = {
    objective_id : null,
    kpis : []

  }
  criteriaEmptyList = "common_nodata_title"


  projectThemeSubscriptionEvent: any;
  selectedIndex: any = null;
  objctiveData: any = [];
  constructor(private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,    
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _projectService : ProjectMonitoringService,
    private _projectThemeService: ProjectThemeService,
    private _projectObjectiveService: ProjectObjectiveService,
    private _projectKpiService: ProjectKpiService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id : null,
      project_id : null,
      theme_id: [null, [Validators.required, Validators.maxLength(255)]],
      objectives : []
    });

    if(this.strategicSource.type =="Edit"){
      this.editData()
    }
    this.projectThemeSubscriptionEvent = this._eventEmitterService.projectTheme.subscribe(res=>{
      this.closeNewTheme();
    })
    this.getTheme();
  }

  getTheme(){
    this._projectThemeService.getItems(false,null,true).subscribe(() =>
     setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  getKpis(){
    this._projectKpiService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  changeTheme(){
    if(this.strategicSource.type == "Edit"){
      let pos = ProjectMonitoringStore.strategicAlignment.findIndex(e=> e.theme.id == this.form.value.theme_id)
      if(pos == -1){
        this.objctiveData= []
      }
      // else {
      //   this.editData()
      // }
    }
    this.getObjectives(this.form.value.theme_id)
  }

  getData(res){
    if(ProjectMonitoringStore.strategicAlignment.length > 0){
    let pos = ProjectMonitoringStore.strategicAlignment.findIndex(e=>e.theme_id == this.form.value.theme_id )
    if(pos != -1){
      for(let data of ProjectMonitoringStore.strategicAlignment[pos].project_strategic_objectives){
        for(let obj of res['objectives']){
          if(data.objective_id == obj.id){
            for(let kpi of data.project_strategic_kpis){
              for(let mainKpi  of obj.project_kpis){
                if(kpi.kpi_id == mainKpi.id){
                  this.selectKpi(null,kpi.kpi_id,data.objective_id);
                }
              }
            }
          }
        }
      }
    }
     
    }
  }

  getObjectives(id){
    if(id)
    this._projectService.getObjectives(id).subscribe((res) => {
    if(this.strategicSource.type == "Add"){
      this.getData(res)
    }
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });

  }

  clearTheme(){
    this.getTheme()
    this.ProjectMonitoringStore._themeObjective = []
  }

  searchTheme(e,patchValue:boolean = false){
    this._projectThemeService.getItems(false, '&q=' + e.term).subscribe((res) => {
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

  cancel(){
    this._eventEmitterService.dismissStrategicAlignmentModal();
    this.objctiveData= []
    ProjectMonitoringStore._themeObjective = []
  }
editData(){
this.form.patchValue({
  theme_id : this.strategicSource.value.theme_id ? this.strategicSource.value.theme_id : null,
  id : this.strategicSource.value.id ? this.strategicSource.value.id  : null
})
this.getObjectives(this.strategicSource.value.theme_id);
this.setEditDataChecked();
}

getButtonText(text) {
  return this._helperService.translateToUserLanguage(text);
}



processSaveData() {
  let saveData = {
    project_id : ProjectMonitoringStore.selectedProjectId ,
    theme_id : this.form.value.theme_id? this.form.value.theme_id : null,
    objectives : this.objctiveData.length > 0 ? this.objctiveData : [],
    id : this.form.value.id ? this.form.value.id : null
    // type : this.scopeOfWorkSource.scopeType,
  }
  
  return saveData;
}

save(close: boolean = false) {
  console.log(this.kpiArray,this.objctiveData)
  this.formErrors = null;
  if (this.form.valid) {
    let save;
    AppStore.enableLoading();
    if (this.strategicSource.type == "Edit") {
      this.processDataForEdit()
      save = this._projectService.updateStrategicAlignment(this.processSaveData(), this.strategicSource.value.id);
    } else {
      save = this._projectService.saveStrategicAlignment(this.processSaveData());
    }
    save.subscribe((res: any) => {
      if (!this.form.value.id) {
        this.resetForm();
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
   ProjectMonitoringStore._themeObjective = []
  this.formErrors = null;
}

openNewThemeModal(){
  this.projectThemeObject.type =  "Add"
  this.openNewTheme();
  }

  
  openNewTheme(){
    this._renderer2.addClass(this.theme.nativeElement,'show');
    this._renderer2.setStyle(this.theme.nativeElement,'display','block');
    this._renderer2.setStyle(this.theme.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.theme.nativeElement,'z-index',99999);
  }

  closeNewTheme(){
 
    setTimeout(() => {
      // $(this.theme.nativeElement).modal('hide');
      this.projectThemeObject.type = null;
      this._renderer2.removeClass(this.theme.nativeElement,'show');
      this._renderer2.setStyle(this.theme.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
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
  selectKpi(event, doc, obj ) {
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
                  kpi_id : doc
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
          kpi_id : doc
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
        kpi_id : doc
      }
       item.kpis.push(kpiIds)
       this.objctiveData.push(item)
   
     }
}

processDataForEdit(){
  this.strategicSource.value.project_strategic_objectives.map(data=>{
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
  this.strategicSource.value.project_strategic_objectives.map(data=>{
    for(let kpiData of data.project_strategic_kpis){
      this.selectKpi(null,kpiData.kpi_id,data.objective_id);
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
      this.selectKpi(null,data.id,notes.id);
       this.checkSelectedStatus(data.id,notes.id)
    })
  }else{
    this.kpiArray = [];
    let pos =this.objctiveData.findIndex(e=> e.objective_id == notes.id)
    if (pos != -1) {
      this.objctiveData.splice(pos,1)
    }
    
  }
}
}
