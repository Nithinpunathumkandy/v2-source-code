import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { Router } from "@angular/router";
import { OrganizationChartService } from "src/app/core/services/organization/business_profile/organization-chart/organization-chart.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { OrganizationChartStore } from "src/app/stores/organization/business_profile/organization-chart.store";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { AddUserStore } from 'src/app/stores/human-capital/users/add-user.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { OrganizationChartImageResponse } from 'src/app/core/models/organization/business_profile/organization-chart-image.model';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
// import html2canvas from "html2canvas";
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthStore } from 'src/app/stores/auth.store';
import * as introJs from 'intro.js/intro.js'; // importing introjs library

declare var $: any;

@Component({
  selector: 'app-oc',
  templateUrl: './oc.component.html',
  styleUrls: ['./oc.component.scss']
})
export class OcComponent implements OnInit,OnDestroy {

  @ViewChild('contentArea') contentArea: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  @ViewChild('fileView') fileView: ElementRef;

  reactionDisposer: IReactionDisposer;
  OrganizationChartStore = OrganizationChartStore;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  chartType: string = 'user-wise';
  downloadMessage: string = '';
  fileUploadProgress = 0;
  editFlag: boolean = false;
  ocView = "view-1"

  deleteObject = {
    title: 'Delete Chart Image?',
    subtitle: 'are_you_sure_delete',
    id: null,
    type: ''
  };
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: '',
    component: 'organization-chart-download',
    componentId: null
  }
  fileViewObject = {
    component: 'fileView',
    values: null,
    type: null
  };

  deleteEventSubscription: any;
  introButtonSubscriptionEvent: any = null;
  fullViewSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#export_to_excel',
      intro: 'Export Strategic Objectives List',
      position: 'bottom'
    },
  ]
  userCount: number = 0;
  departmentCount: number = 0;

  constructor(private _organizationChartService: OrganizationChartService, private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _organizationFileService: OrganizationfileService, private _imageService: ImageServiceService, private _router: Router,
    private _eventEmitterService: EventEmitterService, private _helperService: HelperServiceService,
    private _sanitizer: DomSanitizer, private _renderer2: Renderer2,) { }

  ngOnInit() {
    RightSidebarLayoutStore.showFilter = false;

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'DOWNLOAD_ORGANIZATION_CHART_DOCUMENT_FILE', submenuItem: { type: 'full_view' } },
        { activityName: 'DOWNLOAD_ORGANIZATION_CHART_DOCUMENT_FILE', submenuItem: { type: 'export_to_excel' } }
      ]
      if (AuthStore.userPermissionsLoaded) {
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems, this.introSteps);
      }

      this._helperService.checkSubMenuItemPermissions(100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            if (this.chartType == 'user-wise') {
              this.downloadMessage = "export_userwise_chart";
              this.exportChart();
            }
            else if (this.chartType == 'department-wise') {
              this.downloadMessage = "export_depwise_chart";
              this.exportChart();
            }
            else {
              SubMenuItemStore.exportClicked = false;
              this._utilityService.toast('oc_chart_download_message', 'tr');
            }
            break;

          case "full_view":
            this.openFullView();
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    if(AuthStore.getActivityPermission(100,'OC_USER_WISE_LIST')) this.chartType = 'user-wise';
    else if(AuthStore.getActivityPermission(100,'OC_DEPARTMENT_WISE_LIST')) this.chartType = 'department-wise';
    else this.chartType = 'image';

    this.fullViewSubscriptionEvent = this._eventEmitterService.ocFullView.subscribe(item => {
      this.closeFullView();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      if (item)
        this.deleteImage();
      else
        this.closeConfirmationPopup();
    })

    if(OrganizationChartStore.userWiseChartLoaded){
      this.getTotalNumberOfUsers(OrganizationChartStore.userWiseChart);
    }
    if(OrganizationChartStore.departmentWiseChartLoaded){
      this.getTotalNumberofDepartments(OrganizationChartStore.departmentWiseChart);
    }
    SubMenuItemStore.setNoUserTab(true);
    NoDataItemStore.setNoDataItems({ title: "Nothing to display in the Organization Chart!", subtitle: 'Organization chart displays internal structure of the organization. Try uploading an image of the organization chart.' });
    this.getUserWiseChart();
    this.getDepartmentWiseChart();
    this.checkForOcImage();
    setTimeout(() => {
      $(this.contentArea.nativeElement).focus();
    }, 250);

    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res => {
      this.showIntro();
    })

  }

  showIntro() {
    var intro: any = introJs();
    intro.setOptions({
      steps: this.introSteps,
      showBullets: true,
      showButtons: true,
      exitOnOverlayClick: true,
      keyboardNavigation: true,
      nextLabel: 'Next',
      prevLabel: 'Back',
      doneLabel: 'Done',
      nextToDone: true,
      hidePrev: true,
    });
    intro.start();
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

  // openFullView(){

  //   setTimeout(() => {
  //     $(this.fileView.nativeElement).modal('show');
  //   }, 100);
  // }

  // closeFullView() {
  //   console.log('clicked');
  //   setTimeout(() => {
  //     $(this.fileView.nativeElement).modal('hide');
  //   }, 100);
  // }


  openFullView() {
    console.log(this.chartType);
    this.fileViewObject.type = this.chartType;
    setTimeout(() => {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileView.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileView.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileView.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }


  closeFullView() {
    // $(this.formModal.nativeElement).modal('hide');
    this.fileViewObject.type = null;
    this._renderer2.removeClass(this.fileView.nativeElement, 'show');
    this._renderer2.setStyle(this.fileView.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.fileView.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.fileView.nativeElement, 'overflow', 'none');
  }


  exportChart() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('show');
    }, 100);
    let element: HTMLElement;
    if (this.chartType == 'user-wise')
      element = document.getElementById("capture-user");
    else
      element = document.getElementById('capture-dept');
    let pthis = this;
    htmlToImage.toJpeg(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = `${pthis.chartType}.jpeg`;
        link.href = dataUrl;
        link.click();
        SubMenuItemStore.exportClicked = false;
        pthis.closeLoaderPopUp();
      });
    // let pthis = this;
    // html2canvas(element,{ useCORS: true }).then(function(canvas) {
    //   // Convert the canvas to blob
    //   canvas.toBlob(function(blob){
    //       // To download directly on browser default 'downloads' location
    //       let link = document.createElement("a");
    //       link.download = "image.png";
    //       link.href = URL.createObjectURL(blob);
    //       link.click();
    //       pthis.closeLoaderPopUp();

    //   });
    // });
  }

  closeLoaderPopUp() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

  getUserWiseChart() {
    this._organizationChartService.getUserWiseOrganizationChart().subscribe(res => {
      this.getTotalNumberOfUsers(OrganizationChartStore.userWiseChart)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDepartmentWiseChart() {
    this._organizationChartService.getDepartmentWiseOrganizationChart().subscribe(res => {
      this.getTotalNumberofDepartments(OrganizationChartStore.departmentWiseChart);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createImageUrl(token, type) {
    return this._organizationFileService.getThumbnailPreview(type, token);
  }

  // Return Default Image
  getDefaultImage(type: string) {
    return this._imageService.getDefaultImageUrl(type);
  }

  setType(type: string) {
    this.chartType = type;
    if (type != 'image') {
      var subMenuItems = [
        { activityName: 'DOWNLOAD_ORGANIZATION_CHART_DOCUMENT_FILE', submenuItem: { type: 'full_view' } },
        { activityName: 'DOWNLOAD_ORGANIZATION_CHART_DOCUMENT_FILE', submenuItem: { type: 'export_to_excel' } },

      ]
      if (AuthStore.userPermissionsLoaded) {
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems, this.introSteps);
      }

      this._helperService.checkSubMenuItemPermissions(100, subMenuItems);
    }
    else {
      SubMenuItemStore.makeEmpty();
    }
  }
  setOcView(view: string, type: string){
    this.ocView = view
    this.setType(type)
  }

  editUser(id: number) {
    event.stopPropagation();
    AddUserStore.setEditFlag();
    UsersStore.setUserId(id);
    if (UsersStore.user_id)
      this._router.navigateByUrl('/human-capital/users/edit/' + UsersStore.user_id);
  }

  checkForOcImage() {
    this._organizationChartService.getUserChartImage().subscribe(res => {
      if (res['data'].length > 0) {
        this.processImage(res['data']);
        OrganizationChartStore.temporaryChartImage = null;
      }
      else {
        this.editFlag = true;
        OrganizationChartStore.organizationChartImage = null;
      }
    })
  }

  onFileChange(event, type: string) {
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      // if(type == 'logo') 
      OrganizationChartStore.logo_preview_available = true;
      this._utilityService.detectChanges(this._cdr);
      var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
      this._imageService.uploadImageWithProgress(formData, typeParams)
        .subscribe((res: HttpEvent<any>) => {
          let uploadEvent: any = res;
          switch (uploadEvent.type) {
            case HttpEventType.UploadProgress:
              // Compute and show the % done;
              if (uploadEvent.loaded)
                this.fileUploadProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
              this._utilityService.detectChanges(this._cdr);
              break;
            case HttpEventType.Response:
              $("#file").val('');
              let temp: any = uploadEvent['body'];
              this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                // if(type == 'logo'){
                OrganizationChartStore.logo_preview_available = false;
                // }
                this.createImageFromBlob(prew, temp, type);
              }, (error) => {
                $("#file").val('');
                OrganizationChartStore.logo_preview_available = false;
                this._utilityService.detectChanges(this._cdr);
              })
          }
        }, (error) => {
          $("#file").val('');
          this._utilityService.showErrorMessage('failed', 'file_upload_failed');
          OrganizationChartStore.logo_preview_available = false;
          this.fileUploadProgress = 0;
          this._utilityService.detectChanges(this._cdr);
        })
    }
  }

  // Create Base64 image strig from blob
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if (imageDetails != null) {
        imageDetails['preview_url'] = logo_url;
        this.fileUploadProgress = 0;
        OrganizationChartStore.setTemporaryChartImage(imageDetails);
      }
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  /**
   * @param ext File Extension
   * @param extType Type of file to check - image or doc or pdf...
   */
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  gotoUserDetails(id: number) {
    this._router.navigateByUrl('/human-capital/users/' + id);
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

  updateImage() {
    if (OrganizationChartStore.temporaryChartImage) {
      AppStore.enableLoading();
      this._organizationChartService.uploadUserChartImage(OrganizationChartStore.temporaryChartImage).subscribe(res => {
        AppStore.disableLoading();
        this.checkForOcImage();
        this._utilityService.detectChanges(this._cdr);
      }, (error => {
        AppStore.disableLoading();
        this._utilityService.showErrorMessage('error', 'something_went_wrong');
        this._utilityService.detectChanges(this._cdr);
      })
      )
    }
  }

  editImage() {
    this.editFlag = true;
  }

  cancel() {
    if (this.editFlag) this.editFlag = false;
    else {
      if (OrganizationChartStore.temporaryChartImage) this.OrganizationChartStore.temporaryChartImage = null;
    }
  }

  processImage(image: OrganizationChartImageResponse) {
    if (image) {
      if (image[0].token) {
        var purl = this._organizationFileService.getThumbnailPreview('organization-chart', image[0].token);
        var lDetails = {
          id: image[0].id,
          name: image[0].title,
          title: image[0].title,
          ext: image[0].ext,
          size: image[0].size,
          url: image[0].url,
          token: image[0].token,
          preview_url: purl,
          thumbnail_url: image[0].url
        };
        this.editFlag = false;
        OrganizationChartStore.temporaryChartImage = null;
        OrganizationChartStore.setOrganizationChartImage(lDetails);
        this._utilityService.detectChanges(this._cdr);
      }
    }
  }

  deleteConfirmation() {
    $(this.deletePopup.nativeElement).modal('show');
  }

  closeConfirmationPopup() {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  deleteImage() {
    this._organizationChartService.deleteOrganizationChartImage(OrganizationChartStore.organizationChartImage.id).subscribe(res => {
      this.editFlag = true;
      this.checkForOcImage();
      this._utilityService.detectChanges(this._cdr);
      this.closeConfirmationPopup();
    }, (error => {
      this.closeConfirmationPopup();
    })
    )
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  viewOrganizationChartPreview() {
    this._organizationFileService.getFilePreview('organization-chart', OrganizationChartStore.organizationChartImage.id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, OrganizationChartStore.organizationChartImage.name);
      this.openPreviewModal(resp, OrganizationChartStore.organizationChartImage, OrganizationChartStore.organizationChartImage.id);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('error', 'permission_denied');
      }
      else {
        this.openPreviewModal(null, OrganizationChartStore.organizationChartImage, OrganizationChartStore.organizationChartImage.id);
      }
    });
  }

  // Opens brochure preview
  openPreviewModal(filePreview, fileDetails, fileId) {
    var previewItem = null;
    if (filePreview)
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.preview_url = previewItem;
    this.previewObject.file_details = fileDetails;
    this.previewObject.componentId = fileId;
    // this.previewObject.uploaded_user = this._subsidiaryService.getSelectedSubsidiaryDetails().updated_by ? this._subsidiaryService.getSelectedSubsidiaryDetails().updated_by : null;
    this.previewObject.created_at = OrganizationChartStore.organizationChartImage['created_at'];
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close brochure preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.preview_url = '';
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = '';
  }

  show(id) {
    $('#oc-plus-minus-icon-'+id).toggleClass("far fa-plus");
    $('.hide-and-show-oc-box-'+id).slideToggle("slow");
    // $('.hide-and-show-oc-box-'+id).setStyle("display=none")
    $(".hide-and-show-oc-box-btn-"+id).toggleClass("oc-box-rotate-icon-normal");
  }

  ngOnDestroy() {
    this.deleteEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.introButtonSubscriptionEvent.unsubscribe();
    this.fullViewSubscriptionEvent.unsubscribe();
    OrganizationChartStore.temporaryChartImage = null;
  }

}
