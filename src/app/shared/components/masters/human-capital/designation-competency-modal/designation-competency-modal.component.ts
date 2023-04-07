import { ChangeDetectorRef, Component, OnInit, Renderer2,ElementRef,ViewChild,Input } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { CompetencyGroupService } from 'src/app/core/services/masters/human-capital/competency-group/competency-group.service';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { HelperServiceService } from '../../../../../core/services/general/helper-service/helper-service.service';
declare var $: any;

@Component({
  selector: 'app-designation-competency-modal',
  templateUrl: './designation-competency-modal.component.html',
  styleUrls: ['./designation-competency-modal.component.scss']
})
export class DesignationCompetencyModalComponent implements OnInit {
  @ViewChild('competencyModal') competencyModal: ElementRef;
  @Input('source') competencySource: any;
  DesignationMasterStore = DesignationMasterStore;
  addCompetencyFlag :boolean = false;
  loader:boolean = false;
  num: number = 0;
  AppStore = AppStore;
  addCompetencyObject = {
    component: 'Master',
    values: null,
    type: null
  };

  displayArray = [];
  noCompetencyMessage = "no_competency_added";
  designationCompetencyAddSubscriptionEvent:any;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;

  constructor(private _designationService:DesignationService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _renderer2:Renderer2,
    private _competencyGroupService:CompetencyGroupService,
    private _eventEmitterService:EventEmitterService,
    private _helperService:HelperServiceService
    ) { }

  ngOnInit(): void {
    this.designationCompetencyAddSubscriptionEvent = this._eventEmitterService.competencyAddControl.subscribe(res => {
      this.closeCompetencyModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
  }

  getIndexValue(i:any, j:any) {
    if(i == 0 && j == 0) {
      this.num = 0;
    }
      this.num = this.num+1;
    return this.num;
  }

  closeDetailModal(){
    this._eventEmitterService.dismissHumanCapitalDesignationCompetencyControlModal();
  }

  changeZIndex(){
    if($(this.competencyModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.competencyModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.competencyModal.nativeElement,'overflow','auto');
    }
  }

  
  addCompetency() {
    this.loader = true;
    this.displayArray = [];
    this._designationService.getCompetencies(this.competencySource.values.designation_id).subscribe((res) => {
      for (let i of res) {
        for (let j of i.competencies) {
          console.log(j);
          this.displayArray.push({
            competency: j, required: j.required
          })
        }
      }
      this.addCompetencyObject.values = {
        designation_id: this.competencySource.values.designation_id,
        displayArray: this.displayArray,
        
      }
      this._utilityService.detectChanges(this._cdr);
    });
    // this.getCompetencies();
    this.getCompetencyGroups();
    this.addCompetencyFlag = true;
    setTimeout(() => {
      this.addCompetencyObject.type='Add';
      // this._renderer2.setStyle(this.competencyModal.nativeElement, 'z-index', '99999');
      // this._renderer2.setStyle(this.competencyModal.nativeElement, 'overflow', 'auto');
      this._renderer2.setStyle(this.competencyModal.nativeElement, 'display', 'block');
      $(this.competencyModal.nativeElement).modal('show');
    }, 200);
    setTimeout(() => {
      this.loader = false;
      this._utilityService.detectChanges(this._cdr);
    }, 2000);
  }
  
  getCompetencyGroups() {
    this._competencyGroupService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  closeCompetencyModal() {
    AppStore.disableLoading();
    this.getCompetency();
    this.addCompetencyObject.type=null;
    this._renderer2.setStyle(this.competencyModal.nativeElement, 'display', 'none');
    $(this.competencyModal.nativeElement).modal('hide');
  }

  getCompetency() {

    this._designationService.getCompetencies(this.competencySource.values.designation_id).subscribe((res) => {

      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy(){
    this.designationCompetencyAddSubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.num = 0;
  }


  addCompetencyButtonName(): string {   
    return DesignationMasterStore.competencies.length>0 ? this._helperService.translateToUserLanguage(this.loader ? 'Loading...' : 'edit_competency') : this._helperService.translateToUserLanguage(this.loader ? 'Loading...' : 'add_competency');
  }

}
