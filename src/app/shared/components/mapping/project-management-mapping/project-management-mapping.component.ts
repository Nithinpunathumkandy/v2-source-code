import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ProjectListDatum } from 'src/app/core/models/project-management/projects/projects';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectManagementProjectsService } from 'src/app/core/services/project-management/projects/project-management-projects.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-project-management-mapping',
  templateUrl: './project-management-mapping.component.html',
  styleUrls: ['./project-management-mapping.component.scss']
})
export class ProjectManagementMappingComponent implements OnInit {

  @Input('removeselected') removeselected: boolean = false;
  @Input('projectManagementTitle') projectManagementTitle: any;
  @Input('title') title: boolean = false;

  ProjectsStore = ProjectsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  searchText
  selectedStrat: ProjectListDatum[] = []
  emptyStrategicObjectives = "no_project_management"

  constructor( private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _projectManagementService: ProjectManagementProjectsService,) { }

  ngOnInit(): void {
    this.selectedStrat = JSON.parse(JSON.stringify(ProjectsStore.selectedProjectManagmentForMapping));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) ProjectsStore.setCurrentPage(newPage);
    let params = '';
    if (this.removeselected) {
      params = 'exclude=' + ProjectsStore.selectedProjectManagmentForMapping;
    }
    this._projectManagementService.getItems(false, (params ? params : '')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchLocation(e) {
    let params = '';
    if (this.removeselected) {
      params = '&exclude=' + ProjectsStore.selectedProjectManagmentForMapping;
    }
    ProjectsStore.setCurrentPage(1);
    this._projectManagementService.getItems(false, `&q=${this.searchText}` + (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    ProjectsStore.saveSelected = true;
    this._projectManagementService.selectRequiredProjectManagement(this.selectedStrat);
    AppStore.disableLoading();
    let title = this.projectManagementTitle?.component ? this.projectManagementTitle?.component : 'item'
    if (this.selectedStrat.length > 0) this._utilityService.showSuccessMessage('project_management_selected', 'Selected project management are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully!');
    if (close) this.cancel();
  }

  cancel() {
    if (ProjectsStore.saveSelected) {
      //  console.log("success");
      this._eventEmitterService.dismissProjectManagementMapping();
      this.searchText = null;
    }
    else {
      this.selectedStrat = [];
      ProjectsStore.saveSelected = false
      this._eventEmitterService.dismissProjectManagementMapping()
      this.searchText = null;
    }
  }

  clear() {
    this.searchText = ''
    this.pageChange(1);
  }

  selectAlllocations(e) {
    if (e.target.checked) {
      for (let i of ProjectsStore.projectList) {
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedStrat.push(i);
        }
      }
    } else {
      for (let i of ProjectsStore.projectList) {
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
