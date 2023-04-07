import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ComplianceRegister } from 'src/app/core/models/compliance-management/compliance-register/compliance-register';
import { ComplianceRegisterService } from 'src/app/core/services/compliance-management/compliance-register/compliance-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-compliance-mapping',
  templateUrl: './compliance-mapping.component.html',
  styleUrls: ['./compliance-mapping.component.scss']
})
export class ComplianceMappingComponent implements OnInit {

  @Input('removeselected') removeselected: boolean = false;
  @Input('complianceModalTitle') complianceModalTitle: any;
  @Input('title') title: boolean = false;

  ComplianceRegisterStore = ComplianceRegisterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  searchText
  selectedStrat: ComplianceRegister[] = []
  emptyStrategicObjectives = "no_compliance"

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _complianceRegisterService: ComplianceRegisterService,
  ) { }

  ngOnInit(): void {
    this.selectedStrat = JSON.parse(JSON.stringify(ComplianceRegisterStore.selectedCompliance));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) ComplianceRegisterStore.setCurrentPage(newPage);
    let params = '';
    if (this.removeselected) {
      params = 'exclude=' + ComplianceRegisterStore.selectedCompliance;
    }
    this._complianceRegisterService.getItems(false, (params ? params : '')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // sortTitle(type: string) {
  //   this._complianceRegisterService.sortComplianceRegisterList(type, SubMenuItemStore.searchText);
  //   this.pageChange()
  // }

  searchLocation(e) {
    let params = '';
    if (this.removeselected) {
      params = '&exclude=' + ComplianceRegisterStore.selectedCompliance;
    }
    ComplianceRegisterStore.setCurrentPage(1);
    this._complianceRegisterService.getItems(false, `&q=${this.searchText}` + (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    ComplianceRegisterStore.saveSelected = true;
    this._complianceRegisterService.selectRequiredCompliances(this.selectedStrat);
    AppStore.disableLoading();
    let title = this.complianceModalTitle?.component ? this.complianceModalTitle?.component : 'item'
    if (this.selectedStrat.length > 0) this._utilityService.showSuccessMessage('compliances_selected', 'Selected compliances are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully!');
    if (close) this.cancel();

  }

  cancel() {
    if (ComplianceRegisterStore.saveSelected) {
      //  console.log("success");
      this._eventEmitterService.dismissComplianceMapping();
      this.searchText = null;
    }
    else {
      this.selectedStrat = [];
      ComplianceRegisterStore.saveSelected = false
      this._eventEmitterService.dismissComplianceMapping()
      this.searchText = null;
    }

  }

  clear() {
    this.searchText = ''
    this.pageChange(1);
  }

  selectAlllocations(e) {
    if (e.target.checked) {
      for (let i of ComplianceRegisterStore.allItems) {
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedStrat.push(i);
        }
      }
    } else {
      for (let i of ComplianceRegisterStore.allItems) {
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
