import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { FindingImpactAnalysisCategoryMasterStore } from 'src/app/stores/masters/internal-audit/finding-impact-analysis-category-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImpactAnalysisService } from 'src/app/core/services/external-audit/impact-analysis/impact-analysis.service';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImpactAnalysesMasterStore } from 'src/app/stores/external-audit/impact-analysis/impact-analysis-store';
import { FindingImpactAnalysisCategoryService } from 'src/app/core/services/masters/internal-audit/finding-impact-analysis-category/finding-impact-analysis-category.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-impact-analysis',
  templateUrl: './impact-analysis.component.html',
  styleUrls: ['./impact-analysis.component.scss']
})
export class ImpactAnalysisComponent implements OnInit, OnDestroy {
  @ViewChild('obj', { static: true }) obj: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;

  impact_analysis = [];
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  FindingMasterStore = FindingMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  FindingImpactAnalysisCategoryMasterStore = FindingImpactAnalysisCategoryMasterStore;
  ImpactAnalysesMasterStore = ImpactAnalysesMasterStore;
  showDiv:boolean = true;
  OrganizationGeneralSettingsStore= OrganizationGeneralSettingsStore;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };

  cancelEventSubscription : any;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _findingImpactAnalysisService: FindingImpactAnalysisCategoryService,
    private _impactAnalysisService: ImpactAnalysisService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          // case "template":
          //   this._impactAnalysisService.generateTemplate(FindingMasterStore.auditFindingId);
          //   break;
          case "export_to_excel":
            this._impactAnalysisService.exportToExcel(FindingMasterStore.auditFindingId);
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
     
    })
   
    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      // { type: 'template' },
      { type: 'export_to_excel' },
      { type: "close", path: "../" }

    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.getDatas();

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })
  }

getBackground(value)
{  
  value=Number(value);
     if(value <0){
      // background  = 'linear-gradient(to right,white 0%,white ' +obj +'%, #e1370d ' + obj + '%, #e1370d 50%, white 50%,  white 100%)'
      return 'linear-gradient(to right,white 0%,white ' +(((100+value)*50)/100) +'%, #e1370d ' + (((100+value)*50)/100) + '%, #e1370d 50%, white 50%,  white 100%)'
     }
    else{
      return 'linear-gradient(to right,white 0%,white 50%, #27e10d 50%, #27e10d ' + ((value*50/100)+50) + '%, #fff ' + ((value*50/100)+50) + '%, white 100%)'
      }
      
}

cancelByUser(status) {
  
  setTimeout(() => {
    $(this.cancelPopup.nativeElement).modal('hide');
  }, 250);
  if(status)
  {
    this.cancel();
  }
 
}


confirmCancel() {

  $(this.cancelPopup.nativeElement).modal('show');
}

  // calling impact analysis masters and impact analysis main api
  getDatas() {
    // calling impact analysis data
    this._impactAnalysisService.getItems(FindingMasterStore.auditFindingId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    // calling finding impact analysis
    this._findingImpactAnalysisService.getItems().subscribe(resp => {
      this._utilityService.detectChanges(this._cdr);
      this.checkData(); // after api calls call this function to compare apis
    })
  }

  // checking impact analysis data for display 
  checkData() {
    this.impact_analysis = [];

    setTimeout(() => {

      if (ImpactAnalysesMasterStore.loaded && FindingImpactAnalysisCategoryMasterStore.loaded) {

        for (let element of FindingImpactAnalysisCategoryMasterStore.allItems) {
          if (ImpactAnalysesMasterStore.allItems.length > 0) {
            for (let item of ImpactAnalysesMasterStore.allItems) {
              var items = {};
              const indexOne = FindingImpactAnalysisCategoryMasterStore.allItems.findIndex(ele => ele.id == item.finding_impact_analysis_category_id);
              if (indexOne != -1) {
                items = {
                  title: FindingImpactAnalysisCategoryMasterStore.allItems[indexOne].title, finding_impact_analysis_category_id: FindingImpactAnalysisCategoryMasterStore.allItems[indexOne].id,
                  money: item.money, time: item.time, count: item.count
                }
              }
              const index = this.impact_analysis.findIndex(ele => ele.finding_impact_analysis_category_id == items['finding_impact_analysis_category_id']);
              if (index == -1) {
                this.impact_analysis.push(items);
              }
            }
          } else {
            var itemsNew = {
              title: element.title, money: 0, time: 0,count:0, finding_impact_analysis_category_id: element.id
            }
            this.impact_analysis.push(itemsNew);
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  cancel() {
    // call back to initial state
    this._router.navigateByUrl('external-audit/audit-findings/' + FindingMasterStore.auditFindingId + '/impact-analysis-details');
  }

  // processing datas for save

  getValues() {


    var items = {
      finding_id: FindingMasterStore.auditFindingId,
      impact_analysis_details: this.impact_analysis
    }
    return items;
  }

  // save function
  save() {

    let save;
    AppStore.enableLoading();


    save = this._impactAnalysisService.saveItem(FindingMasterStore.auditFindingId, this.getValues());


    save.subscribe((res: any) => {
      this._router.navigateByUrl('external-audit/audit-findings/' + FindingMasterStore.auditFindingId + '/impact-analysis-details');

      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      }
    });

  }

  sliderFillColor(obj,id){
    let objId = '#'+id;
     let background = '';
    if(obj <0){
      // background  = 'linear-gradient(to right,white 0%,white ' +obj +'%, #e1370d ' + obj + '%, #e1370d 50%, white 50%,  white 100%)'
      background = 'linear-gradient(to right,white 0%,white ' +(((100+obj)*50)/100) +'%, #e1370d ' + (((100+obj)*50)/100) + '%, #e1370d 50%, white 50%,  white 100%)'
     }
     else{
      background = 'linear-gradient(to right,white 0%,white 50%, #27e10d 50%, #27e10d ' + ((obj*50/100)+50) + '%, #fff ' + ((obj*50/100)+50) + '%, white 100%)'
     }
     $(objId).css('background',background);
  };

  

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.impact_analysis = []; // clears once left the page  
    this.showDiv = true;
    this.cancelEventSubscription.unsubscribe();

  }

}

