import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationChartService } from 'src/app/core/services/organization/business_profile/organization-chart/organization-chart.service';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AddUserStore } from 'src/app/stores/human-capital/users/add-user.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationChartStore } from 'src/app/stores/organization/business_profile/organization-chart.store';

@Component({
  selector: 'app-organisation-chart-fullview',
  templateUrl: './organisation-chart-fullview.component.html',
  styleUrls: ['./organisation-chart-fullview.component.scss']
})
export class OrganisationChartFullviewComponent implements OnInit {
  @Input('source') FindingsSource: any
  @ViewChild('contentArea') contentArea: ElementRef;

  AuthStore = AuthStore;
  AppStore = AppStore;
  AddUserStore = AddUserStore;
  UsersStore = UsersStore;
  chartType: string = 'user-wise';
  OrganizationChartStore = OrganizationChartStore;
  userCount: number = 0;
  departmentCount: number = 0;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _organizationFileService: OrganizationfileService,
    private _utilityService: UtilityService,
    private _organizationChartService: OrganizationChartService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
  ) { }

  ngOnInit(): void {
    // if (this.FindingsSource.type == 'user-wise') this.getUserWiseChart();
    // else this.getDepartmentWiseChart();
    this.getTotalNumberOfUsers(OrganizationChartStore.userWiseChart);
    this.getTotalNumberofDepartments(OrganizationChartStore.departmentWiseChart);
  }


  close() {

    this.closeFormModal();
  }

  closeFormModal() {
    // this.resetForm();
    this._eventEmitterService.dismissOcFullViewModal();
  }

  gotoUserDetails(id: number) {
    this._router.navigateByUrl('/human-capital/users/' + id);
  }

  createImageUrl(token, type) {
    return this._organizationFileService.getThumbnailPreview(type, token);
  }

  // Return Default Image
  getDefaultImage(type: string) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getTotalNumberOfUsers(userChartArray) {
    for (let i of userChartArray) {
      this.userCount++;
      if (i.children.length > 0) {
        this.getTotalNumberOfUsers(i.children);
      }
    }
  }

  getChartWidth() {
    let width = this.userCount * 185;
    return width.toString() + 'px !important';
  }

  getTotalNumberofDepartments(departmentChartArray) {
    for (let i of departmentChartArray) {
      this.departmentCount++;
      if (i.hasOwnProperty('children') && i.children.length > 0) {
        this.getTotalNumberofDepartments(i.children);
      }
      if (i.hasOwnProperty('divisions') && i.divisions.length > 0) {
        this.getTotalNumberofDepartments(i.divisions);
      }
      if (i.hasOwnProperty('departments') && i.departments.length > 0) {
        this.getTotalNumberofDepartments(i.departments);
      }
      if (i.hasOwnProperty('sections') && i.sections.length > 0) {
        this.getTotalNumberofDepartments(i.sections);
      }
      if (i.hasOwnProperty('sub_sections') && i.sub_sections.length > 0) {
        this.getTotalNumberofDepartments(i.sub_sections);
      }
    }
  }

  getDepartmentChartWidth() {
    let width = this.departmentCount * 150;
    return width.toString() + 'px !important';
  }

  moveTo(type) {
    switch (type) {
      case 'top': $(this.contentArea.nativeElement).animate({
        scrollTop: "-=300px"
      }, "slow");
        $(this.contentArea.nativeElement).focus();
        break;
      case 'left': $(this.contentArea.nativeElement).animate({
        scrollLeft: "-=300px"
      }, "slow");
        $(this.contentArea.nativeElement).focus();
        break;
      case 'right': $(this.contentArea.nativeElement).animate({
        scrollLeft: "+=300px"
      }, "slow");
        $(this.contentArea.nativeElement).focus();
        break;
      case 'bottom': $(this.contentArea.nativeElement).animate({
        scrollTop: "+=300px"
      }, "slow");
        $(this.contentArea.nativeElement).focus();
        break;
    }
  }

  show(id) {
    $('#oc-plus-minus-icon-'+id).toggleClass("far fa-plus");
    $('.hide-and-show-oc-box-'+id).slideToggle("slow");
    $(".hide-and-show-oc-box-btn-"+id).toggleClass("oc-box-rotate-icon-normal");
  }

}
