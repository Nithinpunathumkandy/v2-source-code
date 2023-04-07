import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { StrategyReviewStore } from 'src/app/stores/strategy-management/review.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { AuthStore } from 'src/app/stores/auth.store';


@Component({
  selector: 'app-strategy-objective-plan',
  templateUrl: './strategy-objective-plan.component.html',
  styleUrls: ['./strategy-objective-plan.component.scss']
})
export class StrategyObjectivePlanComponent implements OnInit {
  @ViewChild('planMesure') planMesure: ElementRef;
  @ViewChild('planMesureHistory') planMesureHistory: ElementRef;
  @ViewChild('allPlanMesure') allPlanMesure: ElementRef;
  @ViewChild('allPlanMesureHistory') allPlanMesureHistory: ElementRef;



  StrategyInitiativeStore = StrategyInitiativeStore;
  AppStore = AppStore
  AuthStore = AuthStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  selectedIndex = null;
  selectedNote: any = 0;
  allPlanMesureObjectHistory = {
    type: null,
    value: null,
    id:null
  }
  planMesureObject = {
    type: null,
    value: null,
    id:null
  }
  allPlanMesureObject = {
    type: null,
    value: null,
    id:null
  }
  plnMesureModalModalEventSubscription: any;
  planMesureHistoryObject = {
    type: null,
    value: null,
    id:null
  }
  plnMesureHistoryModalModalEventSubscription: any;
  reactionDisposer: IReactionDisposer;
  plnAllMesureHistoryModalModalEventSubscription: any;
  plnAllMesureModalModalEventSubscription: any;

  constructor(private _intiativeService : InitiativeService,
    private _cdr: ChangeDetectorRef,private _utilityService: UtilityService,
    private _renderer2: Renderer2,private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            StrategyInitiativeStore.searchText = SubMenuItemStore.searchText;
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

    this.plnMesureModalModalEventSubscription = this._eventEmitterService.planMesureModal.subscribe(item=>{
      this.closePlanMesure();
      this.getMileStones()
    })
    this.plnMesureHistoryModalModalEventSubscription = this._eventEmitterService.kpiPlanMeasueModal.subscribe(item=>{
      this.closeplanMesureHistory();
    })

    this.plnAllMesureModalModalEventSubscription = this._eventEmitterService.addPlanMeasureModal.subscribe(item=>{
      this.closeALLPlanMesure();
    })
    this.plnAllMesureHistoryModalModalEventSubscription = this._eventEmitterService.planMeasureMainHistory.subscribe(item=>{
      this.closeALLPlanMesureHistory();
    })
    this.pageChange(1);
  }


  pageChange(newPage:number = null){
    if (newPage) StrategyInitiativeStore.setCurrentPage(newPage);
    this._intiativeService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      
    })
  }

  selectedIndexChange(index,data){
     StrategyInitiativeStore.setInitiativeId(data.id)
    if(this.selectedIndex == index){
      this.selectedIndex = null;
    } else{
      this.selectedIndex = index;
    }

    this._intiativeService.getInduvalInitiative(data.id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    this.getMileStones();

  }

  getMileStones(){
    this._intiativeService.getMilestons().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  selectedItem(mIndex,id){
  this.selectedNote = mIndex
    // this.getNoteDetails(id);
  }

  openPlanMesureModal(plan,mileStone){
    // this._strategyService.induvalKpi(id).subscribe(res=>{
      StrategyReviewStore.setMileStoneId(mileStone.id)
      this.planMesureObject.value = plan;
      this.planMesureObject.type = 'Add';
      this.openPlanMesureModalPopup()
      this._utilityService.detectChanges(this._cdr)
    // })
  }

  openPlanMesureModalPopup(){
    // $(this.noteModal.nativeElement).modal('show');
    this._renderer2.addClass(this.planMesure.nativeElement,'show');
    this._renderer2.setStyle(this.planMesure.nativeElement,'display','block');
    this._renderer2.setStyle(this.planMesure.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.planMesure.nativeElement,'overflow','auto');
  }

  closePlanMesure(){
    this.planMesureObject.type = null;
    
    // $(this.kpiMesure.nativeElement).modal('hide');
    this._renderer2.removeClass(this.planMesure.nativeElement,'show');
    this._renderer2.setStyle(this.planMesure.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }


  openplanMesureHistoryModal(res){
    // this._strategyService.induvalKpi(id).subscribe(res=>{
      this.planMesureHistoryObject.value = res;
      this.planMesureHistoryObject.type = 'Add';
      this.openplanMesureHistoryModalPopup()
      this._utilityService.detectChanges(this._cdr)
    // })


  }

  openplanMesureHistoryModalPopup(){
    // $(this.noteModal.nativeElement).modal('show');
    this._renderer2.addClass(this.planMesureHistory.nativeElement,'show');
    this._renderer2.setStyle(this.planMesureHistory.nativeElement,'display','block');
    this._renderer2.setStyle(this.planMesureHistory.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.planMesureHistory.nativeElement,'overflow','auto');
  }

  closeplanMesureHistory(){
    this.planMesureHistoryObject.type = null;

    
    // $(this.kpiMesure.nativeElement).modal('hide');
    this._renderer2.removeClass(this.planMesureHistory.nativeElement,'show');
    this._renderer2.setStyle(this.planMesureHistory.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation?.title ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = this.getDate();
      return userDetailObject;
    }
  }

       // Returns Date
       getDate(){
        return new Date();
        // return this._helperService.timeZoneFormatted(new Date());
      }


      openAllPlanMesureModal(mileStone){
        // this._strategyService.induvalKpi(id).subscribe(res=>{
          StrategyReviewStore.setMileStoneId(mileStone.id)
          this.allPlanMesureObject.id = mileStone.id
          this.allPlanMesureObject.value = mileStone;
          this.allPlanMesureObject.type = 'Add';
          this.openAllPlanMesureModalPopup()
          this._utilityService.detectChanges(this._cdr)
        // })
      }
    
      openAllPlanMesureModalPopup(){
        // $(this.noteModal.nativeElement).modal('show');
        this._renderer2.addClass(this.allPlanMesure.nativeElement,'show');
        this._renderer2.setStyle(this.allPlanMesure.nativeElement,'display','block');
        this._renderer2.setStyle(this.allPlanMesure.nativeElement,'z-index',99999);
        this._renderer2.setStyle(this.allPlanMesure.nativeElement,'overflow','auto');
      }
    
      closeALLPlanMesure(){
        this.allPlanMesureObject.type = null;
        
        // $(this.kpiMesure.nativeElement).modal('hide');
        this._renderer2.removeClass(this.allPlanMesure.nativeElement,'show');
        this._renderer2.setStyle(this.allPlanMesure.nativeElement,'display','none');
        $('.modal-backdrop').remove();
        this._utilityService.detectChanges(this._cdr);
      }


      openAllPlanMesureHistoryModal(mileStone){
        // this._strategyService.induvalKpi(id).subscribe(res=>{
          // StrategyReviewStore.setMileStoneId(mileStone.id)
          this.allPlanMesureObjectHistory.id = mileStone.id
          this.allPlanMesureObjectHistory.value = mileStone;
          this.allPlanMesureObjectHistory.type = 'Add';
          this.openAllPlanMesureHistoryModalPopup()
          this._utilityService.detectChanges(this._cdr)
        // })
      }
    
      openAllPlanMesureHistoryModalPopup(){
        // $(this.noteModal.nativeElement).modal('show');
        this._renderer2.addClass(this.allPlanMesureHistory.nativeElement,'show');
        this._renderer2.setStyle(this.allPlanMesureHistory.nativeElement,'display','block');
        this._renderer2.setStyle(this.allPlanMesureHistory.nativeElement,'z-index',99999);
        this._renderer2.setStyle(this.allPlanMesureHistory.nativeElement,'overflow','auto');
      }
    
      closeALLPlanMesureHistory(){
        this.allPlanMesureObjectHistory.type = null;
        
        // $(this.kpiMesure.nativeElement).modal('hide');
        this._renderer2.removeClass(this.allPlanMesureHistory.nativeElement,'show');
        this._renderer2.setStyle(this.allPlanMesureHistory.nativeElement,'display','none');
        $('.modal-backdrop').remove();
        this._utilityService.detectChanges(this._cdr);
      }

      ngOnDestory(){
        this.plnAllMesureModalModalEventSubscription.unsubscribe()
        this.plnAllMesureHistoryModalModalEventSubscription.unsubscribe()
        this.plnMesureHistoryModalModalEventSubscription.unsubscribe()
        this.plnMesureModalModalEventSubscription.unsubscribe()



      }

}
