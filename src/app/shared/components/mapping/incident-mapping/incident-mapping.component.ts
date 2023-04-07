import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Incident } from 'src/app/core/models/incident-management/incident/incident';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';


@Component({
  selector: 'app-incident-mapping',
  templateUrl: './incident-mapping.component.html',
  styleUrls: ['./incident-mapping.component.scss']
})
export class IncidentMappingComponent implements OnInit {

  @Input('removeselected') removeselected: boolean = false;
  @Input('incidentModalTitle') incidentModalTitle: any;
  @Input('title') title: boolean = false;

  IncidentStore = IncidentStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  searchText
  selectedStrat: Incident[] = []
  emptyStrategicObjectives = "no_incidents"

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _incidentService: IncidentService,
  ) { }

  ngOnInit(): void {
    this.selectedStrat = JSON.parse(JSON.stringify(IncidentStore.selectedIincidentForMapping));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) IncidentStore.setCurrentPage(newPage);
    let params = '';
    if (this.removeselected) {
      params = 'exclude=' + IncidentStore.selectedIincidentForMapping;
    }
    this._incidentService.getItems(false, (params ? params : '')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // sortTitle(type: string) {
  //   this._incidentService.sortComplianceRegisterList(type, SubMenuItemStore.searchText);
  //   this.pageChange()
  // }

  searchLocation(e) {
    let params = '';
    if (this.removeselected) {
      params = '&exclude=' + IncidentStore.selectedIincidentForMapping;
    }
    IncidentStore.setCurrentPage(1);
    this._incidentService.getItems(false, `&q=${this.searchText}` + (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    IncidentStore.saveSelected = true;
    this._incidentService.selectRequiredIncident(this.selectedStrat);
    AppStore.disableLoading();
    let title = this.incidentModalTitle?.component ? this.incidentModalTitle?.component : 'item'
    if (this.selectedStrat.length > 0) this._utilityService.showSuccessMessage('incidents_selected', 'Selected incidents are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully!');
    if (close) this.cancel();

  }

  cancel() {
    if (IncidentStore.saveSelected) {
      //  console.log("success");
      this._eventEmitterService.dismissIncidentMapping();
      this.searchText = null;
    }
    else {
      this.selectedStrat = [];
      IncidentStore.saveSelected = false
      this._eventEmitterService.dismissIncidentMapping()
      this.searchText = null;
    }
  }

  clear() {
    this.searchText = ''
    this.pageChange(1);
  }

  selectAlllocations(e) {
    if (e.target.checked) {
      for (let i of IncidentStore.allItems) {
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedStrat.push(i);
        }
      }
    } else {
      for (let i of IncidentStore.allItems) {
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
