import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { DesignationService } from "src/app/core/services/masters/human-capital/designation/designation.service";
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AddUserStore } from 'src/app/stores/human-capital/users/add-user.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalDashboardStore } from 'src/app/stores/human-capital/dashboard/dashboard-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";

declare var $: any;
@Component({
    selector: 'app-users-page',
    templateUrl: './users.page.component.html',
    styleUrls: ['./users.page.component.scss']
})
export class UsersPageComponent implements OnInit, OnDestroy {
    @ViewChild('navigationBar') navigationBar: ElementRef;
    @ViewChild('plainDev') plainDev: ElementRef;
    @ViewChild('popup') popup: ElementRef;
    @ViewChild('dialog') dialog: ElementRef;
    @ViewChild('showClass') showClass: ElementRef;
    @ViewChild('deletePopup') deletePopup: ElementRef;

    reactionDisposer: IReactionDisposer;
    UsersStore = UsersStore;
    AppStore = AppStore;
    SubMenuItemStore = SubMenuItemStore;
    OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
    users = [];
    DesignationMasterStore = DesignationMasterStore;
    OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
    AuthStore = AuthStore;
    activeIndex = null;
    hover = false;
    activeDesignation = null;
    filterSubscription: Subscription = null;

    deleteEventSubscription: any;
    deleteObject = {
        type: '',
        id: null,
        status: '',
        subtitle: '',
        category: ''
    };

    constructor(private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
        private _usersService: UsersService,
        private _router: Router,
        private _renderer2: Renderer2,
        private _designationService: DesignationService,
        private _humanCapitalService: HumanCapitalService,
        private _helperService: HelperServiceService,
        private _imageService: ImageServiceService,
        private _rightSidebarFilterService: RightSidebarFilterService,
        private _eventEmitterService: EventEmitterService
    ) { }

    ngOnInit() {

        UsersStore.designation_index = 0;
        RightSidebarLayoutStore.showFilter = true;
        this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
            this.UsersStore.user_loaded = false;
            DesignationMasterStore.loaded = false;
            this._utilityService.detectChanges(this._cdr);
            if (SubMenuItemStore.userGridSystem) {
                UsersStore.unsetUserList();
                UsersStore.itemsPerPage = 15;
                DesignationMasterStore.loaded = true;
                this.getUsersList();
            } else {
                UsersStore.searchText = '';
                SubMenuItemStore.searchText = '';
                DesignationMasterStore.loaded = false;
                this._utilityService.detectChanges(this._cdr);
                this.pageChange(1);
            }
        })
        // UsersStore.designation_index = 0;
        AppStore.showDiscussion = false;
        setTimeout(() => {
            this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
            window.addEventListener('scroll', this.scrollEvent, true);
        }, 1000);
        DesignationMasterStore.unsetDesignations();
        DesignationMasterStore.orderItem = 'designations.order';
        DesignationMasterStore.orderBy = 'asc';
        // window.addEventListener('scroll', this.scrollEvent, true);
        NoDataItemStore.setNoDataItems({ title: "Looks like we don't have users to display here", subtitle: "Click on the button below to add a new user", buttonText: 'Add New User' });
        this.reactionDisposer = autorun(() => {
            var subMenuItems = [
                { activityName: null, submenuItem: { type: 'search' } },
                { activityName: null, submenuItem: { type: 'refresh' } },
                { activityName: 'CREATE_USER', submenuItem: { type: 'new_modal' } },
                { activityName: 'GENERATE_USER_TEMPLATE', submenuItem: { type: 'template' } },
                { activityName: 'EXPORT_USER', submenuItem: { type: 'export_to_excel' } },
                { activityName: 'IMPORT_USERS', submenuItem: { type: 'import' } },
                { activityName: null, submenuItem: { type: 'user_grid_system' } },
            ]
            if (!AuthStore.getActivityPermission(200, 'CREATE_USER')) {
                NoDataItemStore.deleteObject('subtitle');
                NoDataItemStore.deleteObject('buttonText');
            }

            this._helperService.checkSubMenuItemPermissions(200, subMenuItems);


            if (SubMenuItemStore.clikedSubMenuItem) {

                switch (SubMenuItemStore.clikedSubMenuItem.type) {
                    case "new_modal":
                        setTimeout(() => {
                            AddUserStore.editFlag = false;
                            this.addUser();
                        }, 1000);
                        break;
                    case "template":
                        this._usersService.generateTemplate();
                        break;
                    case "export_to_excel":
                        this._usersService.exportToExcel();
                        break;
                    case "search":
                        UsersStore.searchText = SubMenuItemStore.searchText;
                        if (SubMenuItemStore.userGridSystem) {
                            this.getUsersList(1);
                        } else {
                            setTimeout(() => {
                                // this.getUserCount();
                                // if(UsersStore.searchText)
                                this.pageChange(1);
                            }, 150);
                        }
                        break;
                    case "refresh":
                        if (SubMenuItemStore.userGridSystem) {
                            UsersStore.unsetUserList();
                            UsersStore.itemsPerPage = 15;
                            DesignationMasterStore.loaded = true;
                            this.getUsersList();
                        }
                        else {
                            UsersStore.searchText = '';
                            SubMenuItemStore.searchText = '';
                            DesignationMasterStore.loaded = false;
                            this._utilityService.detectChanges(this._cdr);
                            this.pageChange(1);
                        }
                        break;
                    case "import":
                        ImportItemStore.setTitle('import_user');
                        ImportItemStore.setImportFlag(true);
                        break;
                    case "user_grid_system":
                        if (SubMenuItemStore.userGridSystem) {
                            UsersStore.unsetUserList();
                            UsersStore.itemsPerPage = 15;
                            DesignationMasterStore.loaded = true;
                            this.getUsersList();
                        } else {
                            DesignationMasterStore.loaded = false;
                            this.pageChange(1);
                        }
                        break;
                    default:
                        break;
                }
                // Don't forget to unset clicked item immediately after using it
                SubMenuItemStore.unSetClickedSubMenuItem();
            }

            if (NoDataItemStore.clikedNoDataItem) {
                this.addNewItem();
                NoDataItemStore.unSetClickedNoDataItem();
            }
            if (ImportItemStore.importClicked) {
                ImportItemStore.importClicked = false;
                this._usersService.importData(ImportItemStore.getFileDetails).subscribe(res => {
                    ImportItemStore.unsetFileDetails();
                    ImportItemStore.setTitle('');
                    ImportItemStore.setImportFlag(false);
                    $('.modal-backdrop').remove();
                    this._utilityService.detectChanges(this._cdr);
                }, (error) => {
                    if (error.status == 422) {
                        ImportItemStore.processFormErrors(error.error.errors);
                    }
                    else if (error.status == 500 || error.status == 403) {
                        ImportItemStore.unsetFileDetails();
                        ImportItemStore.setImportFlag(false);
                        $('.modal-backdrop').remove();
                    }
                    this._utilityService.detectChanges(this._cdr);
                })
            }

        })
        SubMenuItemStore.setNoUserTab(true);
        if (UsersStore.searchText != '')
            this.getUserCount();

        // SubMenuItemStore.setSubMenuItems([
        //     { type: 'search' },
        //     { type: 'new_modal' },
        //     { type: 'template' },
        //     { type: 'export_to_excel' },
        // ]);
        RightSidebarLayoutStore.filterPageTag = 'users';
        this._rightSidebarFilterService.setFiltersForCurrentPage([
            'organization_ids',
            'division_ids',
            'department_ids',
            'section_ids',
            'sub_section_ids',
            'designation_ids',
            'reporting_to_ids',
            'language_ids',
            'role_ids',
            'is_active',
            'is_passive',
        ]);

        this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
            this.delete(item);
        })

        if (SubMenuItemStore.userGridSystem) {
            UsersStore.unsetUserList();
            UsersStore.itemsPerPage = 15;
            DesignationMasterStore.loaded = true;
            this.getUsersList();
        } else {
            DesignationMasterStore.loaded = false;
            this.pageChange(1);
        }

    }

    addNewItem() {
        AddUserStore.editFlag = false;
        this.addUser();
    }

    getUserCount() {
        this._usersService.getUserCount().subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        })
    }

    /*to get designation with pagination */
    pageChange(newPage: number = null) {
        this.getUserCount();
        UsersStore.designation_index = null;

        if (newPage) DesignationMasterStore.setCurrentPage(newPage);
        // ?page=' + DesignationMasterStore.currentPage + '&
        this._designationService.getItems(false, 'is_user=true')
            .subscribe((response: any) => {
                if (UsersStore.designation_id != null) {
                    const index: number = this.DesignationMasterStore.designations.findIndex(e => e.id == UsersStore.designation_id);
                    //    UsersStore.designation_index = index;
                    this.getUsers(index, UsersStore.designation_id, 1);
                }
                else if (DesignationMasterStore.loaded && DesignationMasterStore?.designations.length > 0 && UsersStore.designation_id == null)
                    // this._renderer2.addClass(this.showClass.nativeElement, 'show');   
                    this.getUsers(0, DesignationMasterStore?.designations[0].id, 1);
                // console.log(DesignationMasterStore?.designations);
                this._utilityService.detectChanges(this._cdr);

            });
    }

    /**
     * to get users with pagination
     * @param index - index of designation
     * @param designation_id 
     * @param newPage - page number
     */
    getUsers(index, designation_id: number, newPage: number, paginate: boolean = false) {
        UsersStore.designation_id = designation_id;
        if (!paginate) {
            if (UsersStore.designation_index != index)
                UsersStore.designation_index = index;
            else {
                UsersStore.designation_index = null;
            }
        }
        else {
            DesignationMasterStore.designations[index]['is_accordion_active'] = false;
        }

        this._utilityService.detectChanges(this._cdr);

        if (newPage) UsersStore.setCurrentPage(newPage);


        if (DesignationMasterStore?.designations[index]) {
            /**to control accordion button */
            if (DesignationMasterStore?.designations[index]['is_accordion_active'] != true || !DesignationMasterStore?.designations[index].hasOwnProperty('is_accordion_active')) {
                DesignationMasterStore.designations[index]['is_accordion_active'] = true;
                this.closeOtherAccordions(index);
            }
            else if (DesignationMasterStore?.designations[index]['is_accordion_active'] == true || DesignationMasterStore?.designations[index]['is_accordion_active'] != false) {
                DesignationMasterStore.designations[index]['is_accordion_active'] = false;
            }
            DesignationMasterStore.designations[index]['users'] = [];
        }


        this._usersService.getAllItems('?page=' + newPage + '&designation_ids=' + designation_id + '&limit=16' + ((UsersStore.selectedStatus == null || UsersStore.selectedStatus == 'all') ? '&status=all' : '&status=' + UsersStore.selectedStatus))
            .subscribe((response: any) => {
                // console.log(index);
                if (index >= 0) DesignationMasterStore.designations[index]['users'] = [];
                if (UsersStore.user_loaded) {

                    for (let i of UsersStore.users) {

                        if ((i.designation_id == designation_id) && DesignationMasterStore.designations[index]) {
                            DesignationMasterStore.designations[index]['users'].push(i);
                        }
                    }
                }
                this._utilityService.detectChanges(this._cdr);
            });
    }

    setPerPage(perPage) {
        UsersStore.itemsPerPage = perPage;
        this.getUsersList(1);
    }

    // for sorting
    sortTitle(type: string) {
        this._usersService.sortList(type, null);
        this.getUsersList();
    }

    getUsersList(newPage: number = null) {
        if (newPage) UsersStore.setCurrentPage(newPage);
        let additionalParams = ''
        if (UsersStore.selectedStatus == null || UsersStore.selectedStatus == 'all') {
            additionalParams = additionalParams + '&status=all';
        }

        if (HumanCapitalDashboardStore.dashboardParam) {
            additionalParams = HumanCapitalDashboardStore.dashboardParam
        }

        this._usersService.getAllItems(`?page=${UsersStore.currentPage}&order_by=${UsersStore.orderItem}&order=${UsersStore.orderBy}&limit=${UsersStore.itemsPerPage}${additionalParams}`).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    closeOtherAccordions(index) {
        // UsersStore.designation_index=index;
        for (let i = 0; i < DesignationMasterStore?.designations?.length; i++) {
            if (i != index) {
                if (DesignationMasterStore?.designations[i]['is_accordion_active'] || DesignationMasterStore?.designations[i]['is_accordion_active'] == true) {
                    DesignationMasterStore.designations[i]['is_accordion_active'] = false;
                }
            }
            else {
                DesignationMasterStore.designations[i]['is_accordion_active'] = true;
            }

        }
        this._utilityService.detectChanges(this._cdr);
    }

    addUser() {
        this._router.navigateByUrl('/human-capital/users/add-user');
    }

    scrollEvent = (event: any): void => {

        if (event.target.documentElement != undefined) {
            const number = event.target.documentElement.scrollTop;

            if (number > 50) {

                this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
                this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
            }
            else {
                this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
                this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
            }
        }

    }

    mouseHover(event, index, designationIndex) {

        if (index != undefined) {

            this.activeIndex = index;

        }
        else {
            this.activeIndex = null;
        }
        if (this.activeDesignation != undefined) {
            this.activeDesignation = designationIndex;
        }
        else {
            this.activeDesignation = null;
        }
        this.hover = true;
        // console.log(this.activeDesignation);
        if (this.popup) {
            this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
        }

    }

    mouseOut(event) {
        this.activeIndex = null;
        this.activeDesignation = null;
        this.hover = false;
        if (this.popup) {
            this._renderer2.setStyle(this.popup.nativeElement, 'display', 'none');
        }

    }


    clickEvent = (event: any): void => {
        this.activeIndex = null;
        this.hover = false;
        this._utilityService.detectChanges(this._cdr);
    }

    /**
     * navigating to user profile page
     * @param id -user id
     */
    gotoUser(id) {
        AddUserStore.editFlag = true;
        this._router.navigateByUrl('/human-capital/users/' + id);
    }

    getStringsFormatted(stringArray, characterLength, seperator) {
        return this._helperService.getFormattedName(stringArray, characterLength, seperator);
    }

    getLanguageTranslate(text) {
        return this._helperService.translateToUserLanguage(text);
    }

    editUser(id) {
        event.stopPropagation();
        AddUserStore.editFlag = true;
        this._router.navigateByUrl('/human-capital/users/edit/' + id);
    }

    // getPopupDetails(user){
    //     this.userDetailObject.id = user.id;
    //     this.userDetailObject.first_name = user.first_name;
    //     this.userDetailObject.last_name = user.last_name;
    //     this.userDetailObject.designation = user.designation;
    //     this.userDetailObject.image_token = user.image_token;
    //     this.userDetailObject.email = user.email;
    //     this.userDetailObject.mobile = user.mobile;
    //     this.userDetailObject.department = user.department;

    //     return this.userDetailObject;
    //   }

    checkIfRoleAdmin(roles: string){
        if (roles.includes('super-admin'))
        return true
        else return false;
    }
    addZoomClass() {
        this._renderer2.addClass(this.dialog.nativeElement, 'a-zoom');
    }

    searchUser(params) {
        this._usersService.searchUsers('?q=' + params.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        })
    }


    createImageUrl(token) {
        return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

    getDefaultImage(type) {
        return this._imageService.getDefaultImageUrl(type);
    }

    updateStatus(status, Id) {
        console.log(Id);

        event.stopPropagation();
        if (status == 'deactivate') {
            this.deleteObject.id = Id;
            this.deleteObject.type = 'Deactivate';
            this.deleteObject.category = 'Deactivate';
            this.deleteObject.subtitle = 'are_you_sure_deactivate';

            this.deleteObject.status = status;
            $(this.deletePopup.nativeElement).modal('show');

        }
        else {
            this.deleteObject.id = Id;
            this.deleteObject.type = 'Activate';
            this.deleteObject.category = 'Activate';
            this.deleteObject.subtitle = 'are_you_sure_activate';
            this.deleteObject.status = status;
            $(this.deletePopup.nativeElement).modal('show');
        }
    }

    /**
 * delete user
 */
    deleteUser(id) {
        event.stopPropagation();
        this.deleteObject.id = id;
        this.deleteObject.category = 'Delete User';
        this.deleteObject.subtitle = 'are_you_sure_delete';

        this.deleteObject.type = 'Delete';

        $(this.deletePopup.nativeElement).modal('show');

    }

    /**
     * delete confirmation with delete modal
     * @param status - status from delete event emitter
     */
    delete(status) {
        // console.log(status);
        let deleteType;
        if (status && this.deleteObject.id && this.deleteObject.type && this.deleteObject.category) {
            switch (this.deleteObject.category) {
                case 'Delete User':
                    deleteType = this._usersService.deleteUser(this.deleteObject.id);
                    break;
                case 'Deactivate':
                    deleteType = this._usersService.userStatus(this.deleteObject.status, this.deleteObject.id);
                    break;
                case 'Activate':
                    deleteType = this._usersService.userStatus(this.deleteObject.status, this.deleteObject.id);
                    break;
                default:
                    break;

            }
            deleteType.subscribe(resp => {
                this.getUsersList();
                this.closeConfirmationPopUp();
                this._utilityService.detectChanges(this._cdr);
                if (this.deleteObject.category == 'Deactivate' || this.deleteObject.category == 'Activate') {
                    // this.addSubmenu();
                }
                if (this.deleteObject.category == 'Delete User') {
                    // this._router.navigateByUrl('/human-capital/users');
                }
                this.clearDeleteObject();
            }, (error => {
                this.closeConfirmationPopUp();
                if (error.status == 405) {
                    setTimeout(() => {
                        // this.updateStatus('deactivate');
                        // this.addSubmenu();
                        this._utilityService.detectChanges(this._cdr);
                    }, 500);
                }
            }));
        }
        else {
            this.closeConfirmationPopUp();
            this.clearDeleteObject();
        }

    }

    closeConfirmationPopUp() {
        // setTimeout(() => {
        $(this.deletePopup.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
        // }, 250);
    }

    getButtonText(text) {
        return this._helperService.translateToUserLanguage(text);
    }


    clearDeleteObject() {
        this.deleteObject.id = null;
        this.deleteObject.type = '';
        this.deleteObject.category = '';
        this.deleteObject.status = '';
        this.deleteObject.subtitle = '';
    }

    ngOnDestroy() {
        UsersStore.designation_index = null;
        UsersStore.searchText = '';
        SubMenuItemStore.searchText = '';
        if (this.reactionDisposer) this.reactionDisposer();
        SubMenuItemStore.makeEmpty();
        this.filterSubscription.unsubscribe();
        this.deleteEventSubscription.unsubscribe();
        RightSidebarLayoutStore.showFilter = false;
        // this._rightSidebarFilterService.resetFilter();
        // RightSidebarLayoutStore.resetFilter();
        NoDataItemStore.unsetNoDataItems();
        HumanCapitalDashboardStore.unsetDashboardParam()
        UsersStore.unsetUserList();
    }

}
