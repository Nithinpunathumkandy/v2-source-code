import { Component, OnInit, ChangeDetectorRef, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { ShareItemStore } from "src/app/stores/general/share-item.store";

import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  ShareItemStore = ShareItemStore;
  UsersStore = UsersStore;
  reactionDisposer: IReactionDisposer;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  constructor(private _imageService: ImageServiceService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _userService: UsersService, private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  // Returns default image
  getDefaultImage(){
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  // for searching the users

  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getAllUsers() {
    this._userService
      .getAllItems()
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  shareData(){
    ShareItemStore.formErrors = {};
    ShareItemStore.emaiErrors = [];
    this._utilityService.detectChanges(this._cdr);
    ShareItemStore.setShareData(JSON.parse(JSON.stringify(this.generateFormData())));
    // this.clearForm();
  }

  clearForm(){
    ShareItemStore.selectedUsers = [];
    ShareItemStore.selectedEmails = '';
    ShareItemStore.description = '';
  }

  formValid(){
    if(ShareItemStore.selectedEmails.length > 0 || ShareItemStore.selectedUsers.length > 0){
      return true;
    }
    else{
      return false;
    }  
  }

  processUserIds(){
    let userIds = [];
    for(let i of ShareItemStore.selectedUsers){
      userIds.push(i.id);
    }
    return userIds;
  }

  processUserEmails(){
    if(ShareItemStore.selectedEmails){
      let emailsArray = ShareItemStore.selectedEmails.split(',');
      return emailsArray;
    }
    else{
      return [];
    }
  }

  generateFormData(){
    let saveObject = { "user_ids": this.processUserIds(), "emails": this.processUserEmails(), "message": ShareItemStore.description };
    return saveObject;
  }

  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }
  
}
