import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ProfileRRService } from 'src/app/core/services/my-profile/profile/R&R/profile-r-r.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProfileRRStore } from 'src/app/stores/my-profile/profile/profile-r-r-store';

@Component({
  selector: 'app-r-r',
  templateUrl: './r-r.component.html',
  styleUrls: ['./r-r.component.scss']
})
export class RRComponent implements OnInit {

  ProfileRRStore = ProfileRRStore;
  selectedIndex = null;
  noDataMessage = "no_roles_and_responsibilities_to_show";
  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null

  }
  constructor(private _profileRRService: ProfileRRService,
    private _utilityService: UtilityService,
    private _humanCapitalService: HumanCapitalService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getProfileRR(1);
  }

  getProfileRR(newpage: number) {
    if (newpage) ProfileRRStore.setCurrentPage(newpage);
    this._profileRRService.getprofileRR().subscribe(() => {
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)

      if (ProfileRRStore.loaded && ProfileRRStore.profileRR.length > 0) {
        this.getRRDetails(ProfileRRStore.profileRR[0].id, 0);

      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getRRDetails(id: number, index: number) {
    ProfileRRStore.unsetIndiviudalRoleDetails();
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else {
      this.selectedIndex = index;
      this._profileRRService.getItem(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    this._utilityService.detectChanges(this._cdr);
  }

  getPopupDetails(details){
    this.userDetailObject.id = details.id;
    this.userDetailObject.first_name = details.first_name;
    this.userDetailObject.last_name = details.last_name;
    this.userDetailObject.designation = details.designation;
    this.userDetailObject.image_token = details.image.token;
    this.userDetailObject.email = details.email;
    this.userDetailObject.mobile = details.mobile;
    this.userDetailObject.department = details.department ? details.department : null;
    this.userDetailObject.status_id = details.status.id ? details.status.id : 1;

    return this.userDetailObject;
  }

}
