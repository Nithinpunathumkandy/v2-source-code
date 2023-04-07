import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Projects } from 'src/app/core/models/project-monitoring/project-monitoring.modal';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-project-monitoring-mapping',
  templateUrl: './project-monitoring-mapping.component.html',
  styleUrls: ['./project-monitoring-mapping.component.scss']
})
export class ProjectMonitoringMappingComponent implements OnInit {

  @Input('removeselected') removeselected: boolean = false;
  @Input('projectMonitoringTitle') projectMonitoringTitle: any;
  @Input('title') title: boolean = false;

  ProjectMonitoringStore = ProjectMonitoringStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  searchText
  selectedStrat: Projects[] = []
  emptyStrategicObjectives = "no_project_monitoring"
  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _projectMonitoringService: ProjectMonitoringService,
  ) { }

  ngOnInit(): void {
    this.selectedStrat = JSON.parse(JSON.stringify(ProjectMonitoringStore.selectedProjectMonitoringForMapping));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) ProjectMonitoringStore.setCurrentPage(newPage);
    let params = '';
    if (this.removeselected) {
      params = 'exclude=' + ProjectMonitoringStore.selectedProjectMonitoringForMapping;
    }
    this._projectMonitoringService.getItems(false, (params ? params : '')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchLocation(e) {
    let params = '';
    if (this.removeselected) {
      params = '&exclude=' + ProjectMonitoringStore.selectedProjectMonitoringForMapping;
    }
    ProjectMonitoringStore.setCurrentPage(1);
    this._projectMonitoringService.getItems(false, `&q=${this.searchText}` + (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    ProjectMonitoringStore.saveSelected = true;
    this._projectMonitoringService.selectRequiredProjectMonitoring(this.selectedStrat);
    AppStore.disableLoading();
    let title = this.projectMonitoringTitle?.component ? this.projectMonitoringTitle?.component : 'item'
    if (this.selectedStrat.length > 0) this._utilityService.showSuccessMessage('project_monitoring_selected', 'Selected project monitoring are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully!');
    if (close) this.cancel();

  }

  cancel() {
    if (ProjectMonitoringStore.saveSelected) {
      //  console.log("success");
      this._eventEmitterService.dismissProjectMonitoringMapping();
      this.searchText = null;
    }
    else {
      this.selectedStrat = [];
      ProjectMonitoringStore.saveSelected = false
      this._eventEmitterService.dismissProjectMonitoringMapping()
      this.searchText = null;
    }
  }

  clear() {
    this.searchText = ''
    this.pageChange(1);
  }

  selectAlllocations(e) {
    if (e.target.checked) {
      for (let i of ProjectMonitoringStore.allItems) {
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedStrat.push(i);
        }
      }
    } else {
      for (let i of ProjectMonitoringStore.allItems) {
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
