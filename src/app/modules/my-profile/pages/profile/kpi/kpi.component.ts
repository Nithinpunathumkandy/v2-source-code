import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { KpiService } from 'src/app/core/services/masters/human-capital/kpi/kpi.service';
import { ProfileKpiService } from 'src/app/core/services/my-profile/profile/kpi/profile-kpi.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProfileKPIStore } from 'src/app/stores/my-profile/profile/profile-kpi-store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss']
})
export class KpiComponent implements OnInit {

  ProfileKPIStore = ProfileKPIStore;
  selectedIndex = null;
  noDataMessage = "no_key_performance_to_show";
  constructor(private _profileKPIService: ProfileKpiService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getprofileKpi(1);
  }

  getprofileKpi(newpage: number) {
    if (newpage) ProfileKPIStore.setCurrentPage(newpage);
    this._profileKPIService.getProfileKPI().subscribe(() => {
      // setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)

      if (ProfileKPIStore.loaded && ProfileKPIStore.profileKpi.length > 0) {
        this.getKPIDetails(ProfileKPIStore.profileKpi[0].id, 0,);

      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  //Setting Accordion
  getKPIDetails(id: number, index: number) {

    ProfileKPIStore.unsetIndividualProfileKpi();
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else {
      this.selectedIndex = index;
      this._profileKPIService.getItemById(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    this._utilityService.detectChanges(this._cdr);
  }

}
