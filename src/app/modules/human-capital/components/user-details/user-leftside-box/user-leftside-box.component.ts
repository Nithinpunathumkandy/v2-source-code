import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy,ChangeDetectorRef,ViewChildren, QueryList } from '@angular/core';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ActivatedRoute } from '@angular/router';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
@Component({
  selector: 'app-user-leftside-box',
  templateUrl: './user-leftside-box.component.html',
  styleUrls: ['./user-leftside-box.component.scss']
})
export class UserLeftsideBoxComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('sideBarRound', { static: true }) sideBarRound: ElementRef;
  @ViewChild('curveToggle') curveToggle: ElementRef;
  @ViewChildren('userSideBar') userSideBar: QueryList<ElementRef>;
  @ViewChild('userRightDetails') userRightDetails: ElementRef;

  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  formErrors: any;
  UsersStore=UsersStore;
  sideCollapsed: boolean = false;
  AppStore=AppStore;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _usersService:UsersService,
    private route: ActivatedRoute,
    private _humanCapitalService:HumanCapitalService,
    private _renderer2: Renderer2) { }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails(){
    let id:number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
      
   });
   this._usersService.getItemById(id).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
  
  }

  tabListUlClick(ev) {
    if ((ev.target.tagName == 'A') && (ev.target.classList.contains('full-screen-click')))
       this.collapseSide();
    else if ((ev.target.tagName == 'A') && (ev.target.classList.contains('nav-link-show')))
       this.unCollapseSide();
 }

 collapseSide() {
    if (!this.sideCollapsed && this.userSideBar.first) {
       this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
       this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
       setTimeout(() => {
          this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
          this._renderer2.addClass(this.userRightDetails.nativeElement, 'flex-98-width');
       }, 150);
       this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'block');
       this._renderer2.addClass(this.sideBarRound.nativeElement, 'tActive');
       this._renderer2.setStyle(this.sideBarRound.nativeElement, 'position','fixed');
       this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index','99999');
       this.sideCollapsed = true;
    }
 }

 unCollapseSide() {
    if (this.sideCollapsed && this.userSideBar.first) {
       this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
       this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
       this._renderer2.removeClass(this.userRightDetails.nativeElement, 'flex-98-width');
       this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'none');
       this._renderer2.removeClass(this.sideBarRound.nativeElement, 'tActive');

       this.sideCollapsed = false;
    }
 }

  createImageUrl(token){
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture',token);
  }

}
