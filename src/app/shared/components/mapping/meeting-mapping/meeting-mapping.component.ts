import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { IndividualMeetings } from 'src/app/core/models/mrm/meetings/meetings';


@Component({
  selector: 'app-meeting-mapping',
  templateUrl: './meeting-mapping.component.html',
  styleUrls: ['./meeting-mapping.component.scss']
})
export class MeetingMappingComponent implements OnInit {

  @Input('removeselected') removeselected: boolean = false;
  @Input('meetingModalTitle') meetingModalTitle: any;
  @Input('title') title: boolean = false;

  MeetingsStore = MeetingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  searchText
  selectedStrat: IndividualMeetings[] = []
  emptyStrategicObjectives = "no_meetings"

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _meetingsService: MeetingsService,
  ) { }

  ngOnInit(): void {
    this.selectedStrat = JSON.parse(JSON.stringify(MeetingsStore.selectedMeetingForMapping));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) MeetingsStore.setCurrentPage(newPage);
    let params = '';
    if (this.removeselected) {
      params = 'exclude=' + MeetingsStore.selectedMeetingForMapping;
    }
    this._meetingsService.getItems(false, (params ? params : '')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // sortTitle(type: string) {
  //   this._meetingsService.sortComplianceRegisterList(type, SubMenuItemStore.searchText);
  //   this.pageChange()
  // }

  searchLocation(e) {
    let params = '';
    if (this.removeselected) {
      params = '&exclude=' + MeetingsStore.selectedMeetingForMapping;
    }
    MeetingsStore.setCurrentPage(1);
    this._meetingsService.getItems(false, `&q=${this.searchText}` + (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    MeetingsStore.saveSelected = true;
    this._meetingsService.selectRequiredMeeting(this.selectedStrat);
    AppStore.disableLoading();
    let title = this.meetingModalTitle?.component ? this.meetingModalTitle?.component : 'item'
    if (this.selectedStrat.length > 0) this._utilityService.showSuccessMessage('meetings_selected', 'Selected meetings are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully!');
    if (close) this.cancel();

  }

  cancel() {
    if (MeetingsStore.saveSelected) {
      //  console.log("success");
      this._eventEmitterService.dismissMeetingMapping();
      // meetingMappingModal
      this.searchText = null;
    }
    else {
      this.selectedStrat = [];
      MeetingsStore.saveSelected = false
      this._eventEmitterService.dismissMeetingMapping()
      this.searchText = null;
    }

  }

  clear() {
    this.searchText = ''
    this.pageChange(1);
  }

  selectAlllocations(e) {
    if (e.target.checked) {
      for (let i of MeetingsStore.allItems) {
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedStrat.push(i);
        }
      }
    } else {
      for (let i of MeetingsStore.allItems) {
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
