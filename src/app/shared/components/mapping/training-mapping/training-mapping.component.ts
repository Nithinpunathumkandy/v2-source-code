import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Trainings } from 'src/app/core/models/training/trainings/trainings.model';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TrainingsService } from 'src/app/core/services/training/trainings/trainings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';


@Component({
  selector: 'app-training-mapping',
  templateUrl: './training-mapping.component.html',
  styleUrls: ['./training-mapping.component.scss']
})
export class TrainingMappingComponent implements OnInit {

  @Input('removeselected') removeselected: boolean = false;
  @Input('trainingModalTitle') trainingModalTitle: any;
  @Input('title') title: boolean = false;

  TrainingsStore = TrainingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  searchText
  selectedStrat: Trainings[] = []
  emptyStrategicObjectives = "no_trainings"

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _trainingsService: TrainingsService,
  ) { }

  ngOnInit(): void {
    this.selectedStrat = JSON.parse(JSON.stringify(TrainingsStore.selectedTrainingForMapping));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) TrainingsStore.setCurrentPage(newPage);
    let params = '';
    if (this.removeselected) {
      params = 'exclude=' + TrainingsStore.selectedTrainingForMapping;
    }
    this._trainingsService.getItems(false, (params ? params : '')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // sortTitle(type: string) {
  //   this._trainingsService.sortComplianceRegisterList(type, SubMenuItemStore.searchText);
  //   this.pageChange()
  // }

  searchLocation(e) {
    let params = '';
    if (this.removeselected) {
      params = '&exclude=' + TrainingsStore.selectedTrainingForMapping;
    }
    TrainingsStore.setCurrentPage(1);
    this._trainingsService.getItems(false, `&q=${this.searchText}` + (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    TrainingsStore.saveSelected = true;
    this._trainingsService.selectRequiredTraining(this.selectedStrat);
    AppStore.disableLoading();
    let title = this.trainingModalTitle?.component ? this.trainingModalTitle?.component : 'item'
    if (this.selectedStrat.length > 0) this._utilityService.showSuccessMessage('trainings_selected', 'Selected trainings are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully!');
    if (close) this.cancel();

  }

  cancel() {
    if (TrainingsStore.saveSelected) {
      //  console.log("success");
      this._eventEmitterService.dismissTrainingMapping();
      this.searchText = null;
    }
    else {
      this.selectedStrat = [];
      TrainingsStore.saveSelected = false
      this._eventEmitterService.dismissTrainingMapping()
      this.searchText = null;
    }
  }

  clear() {
    this.searchText = ''
    this.pageChange(1);
  }

  selectAlllocations(e) {
    if (e.target.checked) {
      for (let i of TrainingsStore.allItems) {
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedStrat.push(i);
        }
      }
    } else {
      for (let i of TrainingsStore.allItems) {
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
