import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { element } from 'protractor';
import { BiaMatrix } from 'src/app/core/models/bcm/bia-matrix';
import { BiaMatrixService } from 'src/app/core/services/bcm/bia-matrix/bia-matrix.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { BiaSettingsService } from 'src/app/core/services/settings/organization_settings/bia-settings/bia-settings.service';
import { BiaDemoStore } from 'src/app/modules/bcm/bia-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiamatrixListStore } from 'src/app/stores/bcm/bia/bia-matrix.store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BiaSettingStore } from 'src/app/stores/settings/bia-settings.store';


declare var $: any;
@Component({
  selector: 'app-bia-matrix-list',
  templateUrl: './bia-matrix-list.component.html',
  styleUrls: ['./bia-matrix-list.component.scss']
})
export class BiaMatrixListComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;


  SubMenuItemStore = SubMenuItemStore;
  BiaMatrixStore = BiaMatrixStore
  BiamatrixListStore = BiamatrixListStore //Orig store
  BiaSettingStore = BiaSettingStore
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  matrixArray=[]

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,  
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _biaMatrixService:BiaMatrixService,
    private _biaSettingService: BiaSettingsService
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "matrix_nodata_title", subtitle: 'matrix_nodata_subtitle',buttonText: 'add_new_matrix_cofigs'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'configuration'}},
        // {activityName: null, submenuItem: {type: 'search'}},
        // {activityName: null, submenuItem: {type: 'refresh'}},
        // {activityName: null, submenuItem: {type: 'new_modal'}},
        // {activityName: null, submenuItem: {type: 'template'}},
        // {activityName: null, submenuItem: {type: 'export_to_excel'}},
        // {activityName: null, submenuItem: {type: 'import'}},
      ]
      // if(!AuthStore.getActivityPermission(100,'CREATE_PROCESS_STAKEHOLDER')){
      //   NoDataItemStore.deleteObject('subtitle');
      //   NoDataItemStore.deleteObject('buttonText');
      // }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this._router.navigateByUrl('bcm/bia-configuration/bia-rating');
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
          case "configuration":
            this._router.navigateByUrl('bcm/bia-configuration/bia-rating');
              break
              case "refresh":
              this.getMatrixList()
              break
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this._router.navigateByUrl('bcm/bia-configuration/bia-rating');
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this._biaSettingService.getItems().subscribe()
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);
    this.reArrangeArray()
    this.getMatrixList()
  }

  calculateRowSpan(cat,scenario,area){
    var rowSpan = 0
    if(scenario>1) rowSpan = (rowSpan+scenario)-1
    if(area>1) rowSpan = (rowSpan+area)-1
    return rowSpan
  }

  calculateSpan(cat,scenario,area){
    var rowSpan = 0
    if(scenario>1) rowSpan = (rowSpan+scenario)-1
    if(area>1) rowSpan = (rowSpan+area)-1
    return rowSpan
  }

  calculateRow(rowSpanLength,bia,cat=null,scen=null){
    let rowSpan = rowSpanLength
    // ============= Impact categories ====================
    if(bia.bia_impact_categories&&bia.bia_impact_categories.length!=0){
      bia.bia_impact_categories.forEach(element => {
        if(element.bia_impact_scenarios&&element.bia_impact_scenarios.length>1){
          rowSpan = rowSpan+(element.bia_impact_scenarios.length-1)
        }
        if(element.bia_impact_scenarios&&element.bia_impact_scenarios.length!=0){
          element.bia_impact_scenarios.forEach(scenario => {
            if(scenario.bia_impact_areas&&scenario.bia_impact_areas.length>1){
              rowSpan = rowSpan+(scenario.bia_impact_areas.length-1)
            }
          });
        }
      });
    }
    // ======================================================
    if(bia.bia_impact_scenarios&&bia.bia_impact_scenarios.length!=0){
      bia.bia_impact_scenarios.forEach(element => {
        if(element.bia_impact_areas&&element.bia_impact_areas.length>1){
          rowSpan = rowSpan+(element.bia_impact_areas.length-1)
        }
      });
    }
    // ==============Impact area ============================
    return rowSpan
  }

  getIndex(length){
    var index="$"
    if(length!=0&&length!=1){
      index=index+"num"
    }else{
      index=index+"index"
    }
    return index
  }

  getMatrixList(){
    BiamatrixListStore.loaded = false
    this._biaMatrixService.getItem().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  reArrangeArray(){
    var obj = new Object()
    if(BiaMatrixStore.BiaRating.length!=0){
      //Initial start
         BiaMatrixStore.BiaRating.forEach(rating=>{
           //Assigning bia rating to array
          // element.bia_rating = rating.rating
          // element.impact_level = rating.impact_level
          let data={
            bia_rating:rating.rating,
            impact_level:rating.impact_level,
            impact_category:[]
          }
          this.matrixArray.push(data)
            if(BiaMatrixStore.impactCategory.length != 0) {
              //Assigning imp category to array
              this.matrixArray.forEach(element => {
                BiaMatrixStore.impactCategory.forEach(cat => {
                  
                  if(element.bia_rating == cat.eng_impact_level) {
                    let data = {
                      title: cat.eng_impact_category,
                      cat_impact_level: cat.eng_impact_level,
                      impact_scenario: []
                    }
                    if(element.impact_category.length==0){element.impact_category.push(data)}
                    else{
                      let pos = element.impact_category.findIndex(e => e.title === data.title)
                      if(pos==-1){
                        element.impact_category.push(data)
                      }
                    }
                      if(BiaMatrixStore.impactScenario.length != 0) {
                        element.impact_category.forEach(impactCat => {
                          BiaMatrixStore.impactScenario.forEach(biaScenario => {
                            if(biaScenario.category?.eng_impact_category == impactCat.title) {
                              let data = {
                                title: biaScenario.title,
                                scenario_category: biaScenario.category?.eng_impact_category,
                                scenario_category_level: biaScenario.category?.eng_impact_level,
                                impact_area: []
                              }
                              if(impactCat.impact_scenario.length==0){impactCat.impact_scenario.push(data)}
                              else{
                                let pos = impactCat.impact_scenario.findIndex(e => e.title === data.title)
                                if(pos==-1){
                                  impactCat.impact_scenario.push(data)
                                }
                              }
                                if(BiaMatrixStore.impactArea.length != 0) {
                                  impactCat.impact_scenario.forEach(impScenario => {
                                    BiaMatrixStore.impactArea.forEach(biaArea => {
                                      if(impScenario.title == biaArea.scenario.title) {
                                        let data = {
                                          title: biaArea.title,
                                          area_scenario: biaArea.scenario.title,
                                          area_category: biaArea.scenario.category.eng_impact_category,
                                          area_cat_level: biaArea.scenario.category.eng_impact_level
                                        }
                                        if(impScenario.impact_area.length==0){impScenario.impact_area.push(data)}
                                        else{
                                          let pos = impScenario.impact_area.findIndex(e => e.title === data.title)
                                          if(pos==-1){
                                            impScenario.impact_area.push(data)
                                          }
                                        }
                                      }
                                    })
                                  })
                                }
                            }
                          })
                        })
                      }
                  }
                })
              })
            }
       })
    }
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this._rightSidebarFilterService.resetFilter();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
