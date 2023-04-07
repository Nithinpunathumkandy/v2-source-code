import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AprService } from 'src/app/core/services/bpm/advanced-process/apr.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AdvanceProcessStore } from 'src/app/stores/bpm/process/advance-process.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';

declare var $: any;
@Component({
  selector: 'app-choose-related-process',
  templateUrl: './choose-related-process.component.html',
  styleUrls: ['./choose-related-process.component.scss']
})
export class ChooseRelatedProcessComponent implements OnInit {

  @Input('source') source: any;
  @ViewChild('scroll') scroll: any;
  AppStore = AppStore;
  AdvanceProcessStore = AdvanceProcessStore
  ProcessStore = ProcessStore
  form: FormGroup;
  formErrors: any;
  relatedProcess = []
  searchTerm
  processItemEmptyList: string;
  auditableItemEmptyList = "No Process To Show";
  processEmptyList = 'No Process To Show'
  processArray = []
  activitiesArray = []
  allProcessList:boolean=false
  dependecies=[]
  constructor(
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _aprService: AprService
  ) { }

  ngOnInit(): void {
    this.setCheckedData()
    setTimeout(() => {
      this.getProcessRecoveries();
    }, 250);
  }

  ngAfterViewInit(){
    $(this.scroll.nativeElement).mCustomScrollbar();
  }

  setCheckedData(){
    // if(AdvanceProcessStore.savedDependencies){
    //   AdvanceProcessStore.savedDependencies.related_processes.forEach(res=>{
    //     this.processArray.push(res.related_process_id)
    //     if(res.process_activity_ids){
    //       res.process_activity_ids.forEach(elem=>{
    //         this.activitiesArray.push(elem)
    //       })
    //     }
    //   })
    // }
    if(AdvanceProcessStore.advanceProcessDiscovery.process_dependency&&AdvanceProcessStore.advanceProcessDiscovery.process_dependency.related_processes.length!=0){
      let process = AdvanceProcessStore.advanceProcessDiscovery.process_dependency.related_processes
      process.forEach(res=>{
        this.processArray.push(res.related_process_id)
        if(res.dependancy_related_process_activities.length!=0){
          res.dependancy_related_process_activities.forEach(act=>{
            this.activitiesArray.push(act.id)
          })
        }
      })
    }else{
      if(AdvanceProcessStore.savedDependencies){
      AdvanceProcessStore.savedDependencies.forEach(res=>{
        this.processArray.push(res.related_process_id)
        if(res.process_activity_ids){
          res.process_activity_ids.forEach(elem=>{
            this.activitiesArray.push(elem)
          })
        }
      })
    }
    }
  }

  saveDependencied(close:boolean=false){
    this.buildObjectsForSave(close)
  }

  processActivitiesArray(activity){
    let actArray = []
    if(activity.process_activities&&activity.process_activities.length!=0){
      activity.process_activities.forEach(activity=>{
        var pos = this.activitiesArray.findIndex(e=>e == activity.id)
        if(pos!=-1){
          actArray.push(activity.id)
        }
      })
    }
    return actArray
  }

  buildObjectsForSave(close:boolean=false){
    let saveData = []
    if(this.activitiesArray.length!=0){
      this.dependecies.forEach(process=>{
        let process_data
        var pos = this.processArray.findIndex(e=> e == process.id)
        console.log("POSITION",pos)
        if(pos!=-1){
          if(process.process_activities.length!=0){
            process_data={
              related_process_id:process.id,
              process_activity_ids:this.processActivitiesArray(process)
            }
            saveData.push(process_data)
          }else{
            process_data={
              related_process_id:process.id,
              process_activity_ids:[]
            }
            saveData.push(process_data)
          }
        }
        
      })
    }else{
      this.dependecies.forEach(process=>{
        let process_data
        var pos = this.processArray.findIndex(e=> e == process.id)
        if(pos!=-1){
          if(process.process_activities.length!=0){
            process_data={
              related_process_id:process.id,
              process_activity_ids:this.processActivitiesArray(process)
            }
            saveData.push(process_data)
          }else{
            process_data={
              related_process_id:process.id,
              process_activity_ids:[]
            }
            saveData.push(process_data)
          }
        }
      })
    }
    setTimeout(() => { 
      AdvanceProcessStore.setsavedDependencies(saveData)
      console.log("saveData",saveData)
      if(close)this.closeFormModal()
    }, 100);
  }

  searchProcessWithActivities() {
    AdvanceProcessStore.setCurrentPage(1);
     let params = "";
      if (this.searchTerm) {
        this._aprService.getAllProcessWithActivities(false, `?q=${this.searchTerm}` + params).subscribe(res => {
          this.dependecies = AdvanceProcessStore.processWithActivities
          var pos = AdvanceProcessStore.processWithActivities.findIndex(e=>e.id==ProcessStore.process_id)
          this.dependecies.splice(pos,1)
          this._utilityService.detectChanges(this._cdr);
          if(this.dependecies.length == 0){
            this.processItemEmptyList = "Your search did not match any auditable Items. Please make sure you typed the auditable Item name correctly, and then try again."
          }
          // else if (this.dependecies.length >= 3) {
          //   console.log("ffddd")
          //   $(this.scroll.nativeElement).mCustomScrollbar();
          //   this._utilityService.detectChanges(this._cdr);
          // }
          // else {
          //   $(this.scroll.nativeElement).mCustomScrollbar("destroy");
          // }
          $(this.scroll.nativeElement).mCustomScrollbar();
          this._utilityService.detectChanges(this._cdr);
        });
      } else {
        this.getProcessRecoveries();
      }
  }

  clearSearchBar() {
    this.searchTerm = '';
    this.getProcessRecoveries();
    setTimeout(() => {
      $(this.scroll.nativeElement).mCustomScrollbar();
    }, 100);
  }

  getProcessRecoveries(newPage: number = null){
    if (newPage) AdvanceProcessStore.setCurrentPage(newPage);
    this._aprService.getProcessWithActivities().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      if (AdvanceProcessStore.processWithActLoaded){
        console.log("heree")
        if (this.processArray.length > 0) {
          $(this.scroll?.nativeElement).mCustomScrollbar();
          this.dependecies = AdvanceProcessStore.processWithActivities
          var pos = AdvanceProcessStore.processWithActivities.findIndex(e=>e.id==ProcessStore.process_id)
          this.dependecies.splice(pos,1)
          this._utilityService.detectChanges(this._cdr);
          // console.log("depemn",this.dependecies)
          this.dependecies.forEach(element => {
            this.processArray.forEach(item => {
              if (element.id == item.id) {
                element['is_enabled'] = true;
              }
            });
          });
        } else {
          this.processArray = [];
          $(this.scroll?.nativeElement).mCustomScrollbar();
          this.dependecies = AdvanceProcessStore.processWithActivities
          var pos = AdvanceProcessStore.processWithActivities.findIndex(e=>e.id==ProcessStore.process_id)
          this.dependecies.splice(pos,1)
          this._utilityService.detectChanges(this._cdr);
          // console.log("depemniii",this.dependecies)
        }
        $(this.scroll?.nativeElement).mCustomScrollbar();
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  // Check process

  checkSelectedStatus(id: number){
    var pos = this.processArray.findIndex(e => e == id);
    if(pos != -1) return true;
    else return false;
  }

  checkSelectedActivityStatus(id: number){
    var pos = this.activitiesArray.findIndex(e => e == id);
      if(pos != -1) return true;
      else return false;
  }

  checkActivities(id:number,process:any=null,is_splice:boolean=false){
    var pos = this.activitiesArray.findIndex(e=>e == id);
    if(pos!=-1){
      this.activitiesArray.splice(pos,1)
      // this.checkProcess(process)
    }else{
      if(!is_splice){
        this.activitiesArray.push(id)
      this.checkActivityParentProcess(process,false)
      }
    }
  }

  checkActivityParentProcess(process,is_activity_add:boolean=true){
    if(process){
      var pos = this.processArray.findIndex(e=>e == process.id);
      if(pos==-1){
        this.processArray.push(process.id);
      if(is_activity_add){
        if(process.process_activities.length!=0){
          process.process_activities.forEach(element => {
            this.checkActivities(element.id)
          });
        }
      }
      }
    }
  }
  
  checkProcess(process,is_activity_add:boolean=true){
    if(process){ 
      var pos = this.processArray.findIndex(e=>e == process.id);
    if(pos!=-1){
      this.processArray.splice(pos,1);
      if(is_activity_add){
        if(process.process_activities.length!=0){
          process.process_activities.forEach(element => {
            this.checkActivities(element.id,null,true)
          });
        }
      }
    }else{
      this.processArray.push(process.id);
      if(is_activity_add){
        if(process.process_activities.length!=0){
          process.process_activities.forEach(element => {
            this.checkActivities(element.id)
          });
        }
      }
    }
    }
  }

  resetForm(){
    AppStore.disableLoading();
  }

  closeFormModal() {
    // Emitting Event To set the Style in Parent Component(MODAL)
     this._eventEmitterService.setModalStyle();
     this.resetForm();
     this._eventEmitterService.dismissRelatedProcess();
     $(this.scroll.nativeElement).mCustomScrollbar("destroy");
   }

}
