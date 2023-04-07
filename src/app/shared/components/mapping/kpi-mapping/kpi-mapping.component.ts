import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { IndividualKpi } from 'src/app/core/models/kpi-management/kpi/kpi';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { KpisService } from 'src/app/core/services/kpi-management/kpi/kpis.service';

@Component({
  selector: 'app-kpi-mapping',
  templateUrl: './kpi-mapping.component.html',
  styleUrls: ['./kpi-mapping.component.scss']
})
export class KpiMappingComponent implements OnInit {

  @Input('removeselected') removeselected: boolean = false;
  @Input('kpiModalTitle') kpiModalTitle: any;
  @Input('title') title: boolean = false;
  KpisStore = KpisStore;
  AppStore = AppStore;
  searchText
  selectedStrat: IndividualKpi[] = []
  emptykpiObjectives = "no_kpi"
  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _kpisService: KpisService
  ) { }

  ngOnInit(): void {
    this.selectedStrat = JSON.parse(JSON.stringify(KpisStore.selectedKpiForMapping));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) KpisStore.setCurrentPage(newPage);
    let params = '';
    if (this.removeselected) {
      params = 'exclude=' + KpisStore.selectedKpiForMapping;
    }
    this._kpisService.getItems(false, (params ? params : '')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // sortTitle(type: string) {
  //   this._trainingsService.sortComplianceRegisterList(type, SubMenuItemStore.searchText);
  //   this.pageChange()
  // }

  searchLocation(e) {
    let params = '';
    if (this.removeselected) {
      params = '&exclude=' + KpisStore.selectedKpiForMapping;
    }
    KpisStore.setCurrentPage(1);
    this._kpisService.getItems(false, `&q=${this.searchText}` + (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    KpisStore.saveSelected = true;
    this._kpisService.selectRequiredKpi(this.selectedStrat);
    AppStore.disableLoading();
    let title = this.kpiModalTitle?.component ? this.kpiModalTitle?.component : 'item'
    if (this.selectedStrat.length > 0) this._utilityService.showSuccessMessage('kpi_selected', 'Selected kpi are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully!');
    if (close) this.cancel();

  }

  cancel() {
    if (KpisStore.saveSelected) {
      //  console.log("success");
      this._eventEmitterService.dismissKpiMapping();
      this.searchText = null;
    }
    else {
      this.selectedStrat = [];
      KpisStore.saveSelected = false
      this._eventEmitterService.dismissKpiMapping()
      this.searchText = null;
    }
  }

  clear() {
    this.searchText = ''
    this.pageChange(1);
  }

  selectAlllocations(e) {
    if (e.target.checked) {
      for (let i of KpisStore.allItems) {
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedStrat.push(i);
        }
      }
    } else {
      for (let i of KpisStore.allItems) {
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos != -1) {
          this.selectedStrat.splice(pos, 1);
        }
      }
    }
  }

  locationSelected(locations) {
    var pos = this.selectedStrat.findIndex(e => e.id == locations.id);
    if (pos != -1)
      this.selectedStrat.splice(pos, 1);
    else
      this.selectedStrat.push(locations);
  }


  locationPresent(id) {
    const index = this.selectedStrat.findIndex(e => e.id == id);
    if (index != -1)
      return true;
    else
      return false;
  }

}
