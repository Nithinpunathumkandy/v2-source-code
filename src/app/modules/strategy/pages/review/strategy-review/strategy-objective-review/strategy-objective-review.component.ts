import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyReviewStore } from 'src/app/stores/strategy-management/review.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-strategy-objective-review',
  templateUrl: './strategy-objective-review.component.html',
  styleUrls: ['./strategy-objective-review.component.scss']
})
export class StrategyObjectiveReviewComponent implements OnInit {
  @ViewChild('kpiMesure') kpiMesure: ElementRef;
  @ViewChild('kpiMesureHistory') kpiMesureHistory: ElementRef;
  @ViewChild('allKpiMesure') allKpiMesure: ElementRef;
  @ViewChild('kpiMesureHistoryAll') kpiMesureHistoryAll: ElementRef;



  StrategyReviewStore = StrategyReviewStore;
  StrategyStore = StrategyStore
  AppStore = AppStore
  AuthStore = AuthStore
  selectedIndex = null;
  kpiMesureObject = {
    type: null,
    value: null,
    id:null
  }

  allKpiMesureObject = {
    type: null,
    value: null,
    id:null
  }
  kpiMesureData ={
    type: null,
    value: null,
    id:null
  }

  kpiMesureHistoryObject = {
    type: null,
    value: null,
    id:null
  }

  kpiMesureHistoryAllObject = {
    type: null,
    value: null,
    id:null
  }
  kpiMesureModalModalEventSubscription: any;
  kpiMesureModalMesureModalEventSubscription: any;
  reactionDisposer: IReactionDisposer;
  allKpiMesureModalModalEventSubscription: any;
  kpiMesureModalMesureAllModalEventSubscription: any;

  constructor(private _reviewService : StrategyReviewService,private _utilityService: UtilityService,
              private _renderer2: Renderer2,private _cdr: ChangeDetectorRef, 
              private _eventEmitterService: EventEmitterService, private _strategyService : StrategyService,) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            StrategyReviewStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
    });
    SubMenuItemStore.setSubMenuItems([
      { type: 'search' },
     
    ]);
    this.kpiMesureModalModalEventSubscription = this._eventEmitterService.kpiMesureModal.subscribe(item=>{
      this.closekpiMesure();
      this.getKpiList();
      
    })

    this.allKpiMesureModalModalEventSubscription = this._eventEmitterService.kpiMesureHistoryAllModal.subscribe(item=>{
      this.closekpiMesureHistoryAll();
      
    })


    this.kpiMesureModalMesureModalEventSubscription = this._eventEmitterService.addAllReviewModal.subscribe(item=>{
      this.closeAllkpiMesure();
    })

    this.kpiMesureModalMesureAllModalEventSubscription = this._eventEmitterService.kpiMesureHistoryModal.subscribe(item=>{
      this.closekpiMesureHistory();
    })
    this.pageChange(1)
  }

  pageChange(newPage:number = null){
    if (newPage) StrategyReviewStore.setCurrentPage(newPage);
    this._reviewService.getItems().subscribe(res=>this._utilityService.detectChanges(this._cdr))
  }

  selectedIndexChange(index,objective){
    StrategyStore.setSelectedId(objective.strategy_profile_id)
    StrategyStore.setObjectiveId(objective.id);
    StrategyStore.setFocusAreaId(objective.strategy_profile_focus_area_id)
    if(this.selectedIndex == index){
      this.selectedIndex = null;
    } else{
      this.selectedIndex = index;
    }
    this.getInduObjectives(objective.id,objective.strategy_profile_focus_area_id);
    // this._strategyService.induvalObjectives(id,this.selectedFocusAreaId).subscribe(res=>{this._utilityService.detectChanges(this._cdr)})
    this.getKpiList();
    this._utilityService.detectChanges(this._cdr);

  }


  getInduObjectives(id,focusAreaId){
    this._strategyService.induvalObjectives(id,focusAreaId).subscribe(res=>{this._utilityService.detectChanges(this._cdr)})

  }

  getKpiList(){
    this._strategyService.getAllKpis(true).subscribe(res=>{this._utilityService.detectChanges(this._cdr);})
  }

  openKpiMesureModal(id){
    this._strategyService.induvalKpi(id).subscribe(res=>{
      this.kpiMesureObject.value = res;
      this.kpiMesureObject.type = 'Add';
      this.openKpiMesureModalPopup()
      this._utilityService.detectChanges(this._cdr)
    })


  }

  openKpiMesureModalPopup(){
    // $(this.noteModal.nativeElement).modal('show');
    this._renderer2.addClass(this.kpiMesure.nativeElement,'show');
    this._renderer2.setStyle(this.kpiMesure.nativeElement,'display','block');
    this._renderer2.setStyle(this.kpiMesure.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.kpiMesure.nativeElement,'overflow','auto');
  }

  closekpiMesure(){
    this.kpiMesureObject.type = null;
    
    // $(this.kpiMesure.nativeElement).modal('hide');
    this._renderer2.removeClass(this.kpiMesure.nativeElement,'show');
    this._renderer2.setStyle(this.kpiMesure.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  openAllKpiMesureModal(){
    // this._strategyService.induvalKpi(id).subscribe(res=>{
      // this.allKpiMesureObject.value = res;
      this.allKpiMesureObject.type = 'Add';
      this.openAllKpiMesureModalPopup()
      this._utilityService.detectChanges(this._cdr)
    // })


  }

  openAllKpiMesureModalPopup(){
    // $(this.noteModal.nativeElement).modal('show');
    this._renderer2.addClass(this.allKpiMesure.nativeElement,'show');
    this._renderer2.setStyle(this.allKpiMesure.nativeElement,'display','block');
    this._renderer2.setStyle(this.allKpiMesure.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.allKpiMesure.nativeElement,'overflow','auto');
  }

  closeAllkpiMesure(){
    this.allKpiMesureObject.type = null;
    
    // $(this.kpiMesure.nativeElement).modal('hide');
    this._renderer2.removeClass(this.allKpiMesure.nativeElement,'show');
    this._renderer2.setStyle(this.allKpiMesure.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  openKpiMesureHistoryModal(id){
    this._strategyService.induvalKpi(id).subscribe(res=>{
      this.kpiMesureHistoryObject.value = res;
      this.kpiMesureHistoryObject.type = 'Add';
      this.openKpiMesureHistoryModalPopup()
      this._utilityService.detectChanges(this._cdr)
    })


  }

  openKpiMesureHistoryModalPopup(){
    // $(this.noteModal.nativeElement).modal('show');
    this._renderer2.addClass(this.kpiMesureHistory.nativeElement,'show');
    this._renderer2.setStyle(this.kpiMesureHistory.nativeElement,'display','block');
    this._renderer2.setStyle(this.kpiMesureHistory.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.kpiMesureHistory.nativeElement,'overflow','auto');
  }

  closekpiMesureHistory(){
    this.kpiMesureHistoryObject.type = null;

    
    // $(this.kpiMesure.nativeElement).modal('hide');
    this._renderer2.removeClass(this.kpiMesureHistory.nativeElement,'show');
    this._renderer2.setStyle(this.kpiMesureHistory.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  openKpiMesureHistoryAllModal(id){
    this._strategyService.induvalKpi(id).subscribe(res=>{
      this.kpiMesureHistoryAllObject.value = res;
      this.kpiMesureHistoryAllObject.type = 'Add';
      this.openKpiMesureHistoryAllModalPopup()
      this._utilityService.detectChanges(this._cdr)
    })


  }

  openKpiMesureHistoryAllModalPopup(){
    // $(this.noteModal.nativeElement).modal('show');
    this.kpiMesureHistoryAllObject.type = 'Add';
    this._renderer2.addClass(this.kpiMesureHistoryAll.nativeElement,'show');
    this._renderer2.setStyle(this.kpiMesureHistoryAll.nativeElement,'display','block');
    this._renderer2.setStyle(this.kpiMesureHistoryAll.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.kpiMesureHistoryAll.nativeElement,'overflow','auto');
  }

  closekpiMesureHistoryAll(){
    this.kpiMesureHistoryAllObject.type = null;
    // $(this.kpiMesure.nativeElement).modal('hide');
    this._renderer2.removeClass(this.kpiMesureHistoryAll.nativeElement,'show');
    this._renderer2.setStyle(this.kpiMesureHistoryAll.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy(){
    this.kpiMesureModalModalEventSubscription.unsubscribe();
    this.kpiMesureModalMesureModalEventSubscription.unsubscribe();
    this.allKpiMesureModalModalEventSubscription.unsubscribe();
    this.kpiMesureModalMesureAllModalEventSubscription.unsubscribe();
  }

}
