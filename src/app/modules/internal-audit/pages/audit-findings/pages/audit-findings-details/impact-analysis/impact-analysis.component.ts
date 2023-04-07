import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ImpactAnalysisService } from 'src/app/core/services/internal-audit/audit-findings/impact-analysis/impact-analysis.service';
import { FindingImpactAnalysisCategoryService } from 'src/app/core/services/masters/internal-audit/finding-impact-analysis-category/finding-impact-analysis-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import {ImpactAnalysesStore} from 'src/app/stores/internal-audit/audit-findings/impact-analysis/impact-analysis-store';
import { FindingImpactAnalysisCategoryMasterStore } from 'src/app/stores/masters/internal-audit/finding-impact-analysis-category-store';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-impact-analysis',
  templateUrl: './impact-analysis.component.html',
  styleUrls: ['./impact-analysis.component.scss']
})
export class ImpactAnalysisComponent implements OnInit ,OnDestroy, AfterViewInit  {

  ImpactAnalysesStore = ImpactAnalysesStore;
  impact_analysis = [];
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  AuditFindingsStore = AuditFindingsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  FindingImpactAnalysisCategoryMasterStore = FindingImpactAnalysisCategoryMasterStore;
  showDiv:boolean = true;
  constructor(private _impactAnalysisService: ImpactAnalysisService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _findingImpactAnalysisService: FindingImpactAnalysisCategoryService,) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
   this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "template":
            this._impactAnalysisService.generateTemplate(AuditFindingsStore.auditFindingId);
            break;
          case "export_to_excel":
            this._impactAnalysisService.exportToExcel(AuditFindingsStore.auditFindingId);
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
      { type: 'template' },
      { type: 'export_to_excel' },
      { type: "close", path: "../" }

    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.getDatas();
  }

  ngAfterViewInit(){
    let dollarInputSlider = $('.ddata');
  }

  ngAfterViewChecked(){
    let dollarInputSlider = $('.ddata');
  for(let i of  dollarInputSlider){
    let background = '';
    let obj:any = $(i).val();
   if(obj <0){
      // background  = 'linear-gradient(to right,white 0%,white ' +obj +'%, #e1370d ' + obj + '%, #e1370d 50%, white 50%,  white 100%)'
      background = 'linear-gradient(to right,white 0%,white ' +(((100+obj)*50)/100) +'%, #e1370d ' + (((100+obj)*50)/100) + '%, #e1370d 50%, white 50%,  white 100%)'
     }
    else{
     background = 'linear-gradient(to right,white 0%,white 50%, #27e10d 50%, #27e10d ' + ((obj*50/100)+50) + '%, #fff ' + ((obj*50/100)+50) + '%, white 100%)'
      }
      $(i).css('background',background)
   }
  
}

  // calling impact analysis masters and impact analysis main api
  getDatas() {
    // calling impact analysis data
    this._impactAnalysisService.getItems(AuditFindingsStore.auditFindingId).subscribe(res => {
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

      if (ImpactAnalysesStore.loaded && FindingImpactAnalysisCategoryMasterStore.loaded) {

        for (let element of FindingImpactAnalysisCategoryMasterStore.allItems) {
          if (ImpactAnalysesStore.allItems.length > 0) {
            for (let item of ImpactAnalysesStore.allItems) {
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
    this._router.navigateByUrl('internal-audit/findings/' + AuditFindingsStore.auditFindingId + '/impact-analysis-details');
  }

  // processing datas for save

  getValues() {


    var items = {
      finding_id: AuditFindingsStore.auditFindingId,
      impact_analysis_details: this.impact_analysis
    }
    return items;
  }

  // save function
  save() {

    let save;
    AppStore.enableLoading();


    save = this._impactAnalysisService.saveItem(AuditFindingsStore.auditFindingId,AuditFindingsStore.auditFindingId, this.getValues());


    save.subscribe((res: any) => {
      this._router.navigateByUrl('internal-audit/findings/' + AuditFindingsStore.auditFindingId + '/impact-analysis-details');

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

  }

}

