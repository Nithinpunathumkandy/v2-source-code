import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ProfileCompetenciesService } from 'src/app/core/services/my-profile/profile/competencies/profile-competencies.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProfileCompetenciesStore } from 'src/app/stores/my-profile/profile/profile-competencies-store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-competencies',
  templateUrl: './competencies.component.html',
  styleUrls: ['./competencies.component.scss']
})
export class CompetenciesComponent implements OnInit {

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ProfileCompetenciesStore = ProfileCompetenciesStore;
  selectedIndex = null;
  noDataMessage = "no_competencies_to_show";
  constructor(private _profileCompetenciesService:ProfileCompetenciesService,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService,
    private _humanCapitalService:HumanCapitalService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getprofileCompetencies(1);
  }

  getprofileCompetencies(newPage: number = null) {
    this._profileCompetenciesService.getItems().subscribe(() => {
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    if (ProfileCompetenciesStore.loaded && ProfileCompetenciesStore.competencyDetails?.length > 0) {
      this.getCompetencyDetails(ProfileCompetenciesStore.competencyDetails[0].competencies[0].id, 0,);
    }
    this._utilityService.detectChanges(this._cdr);
  });
    
  }

  createDaysString(days) {
    return this._helperService.daysConversion(days);
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
}

getCompetencyDetails(id:number,index: number) {

    ProfileCompetenciesStore.unsetIndividualCompetency();
      if(this.selectedIndex == index)
      this.selectedIndex = null;
    else{
      this.selectedIndex = index;
      this._profileCompetenciesService.getItemById(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
      this._utilityService.detectChanges(this._cdr);
}

}
