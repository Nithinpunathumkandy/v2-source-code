import { ChangeDetectorRef, ElementRef,Renderer2, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DiscussionMasterStore } from 'src/app/stores/project-management/project-details/project-discussion/project-discussion.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectDiscussionService } from 'src/app/core/services/project-management/project-details/project-discussion/project-discussion.service';


declare var $: any; 
@Component({
  selector: 'app-discussion-details',
  templateUrl: './discussion-details.component.html',
  styleUrls: ['./discussion-details.component.scss']
})
export class DiscussionDetailsComponent implements OnInit {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('replyModal') replyModal: ElementRef;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reply:any;
  replyReply:any;
  numbers:any=[];
  DiscussionMasterStore = DiscussionMasterStore;
  discussionModalCloseEvent: any;
  DiscussionObject = {
    component: 'Master',
    values: null,
    type: null
  };
  DiscussionReply = {
    component: 'Master',
    values: null,
    type: null
  };
  discussionArray: any=[] ;
  Loaded = false
  replyId:any;
  constructor(
    private route: ActivatedRoute,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _discussionService: ProjectDiscussionService,
  ) { }

  ngOnInit(): void {
    
    
    this.discussionModalCloseEvent = this._eventEmitterService.projectDiscussion.subscribe(res => {
      this.closeFormModal();
    })

    this.discussionModalCloseEvent = this._eventEmitterService.projectDiscussion.subscribe(res => {
      this.closeReplyModal();
    })

  
    this.replyId = this.route.snapshot.params['id'];;
    this.getReplies(this.replyId);
    this.numbers = DiscussionMasterStore.individualDiscussionId;
    this.reply=this.reply[0]
    this.replyReply=this.replyReply[0]
   
  }
  addNewItem() {
    this.DiscussionObject.type = 'Add';
    this.DiscussionObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.getReplies(this.replyId);
    setTimeout(() => {
      this.DiscussionObject.type = null;
      this._utilityService.detectChanges(this._cdr)

    }, 200);
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 200);
  }
  getReplies(id:any){
    this._discussionService.getRepliesById(id).subscribe(res => {
      this.discussionArray = res;
      this.Loaded = true
      this.reply = res;
    }); 
    this._utilityService.detectChanges(this._cdr)
  }



  addReplyItem(id) {
    this.DiscussionReply.type = 'Add';
    this.DiscussionReply.values = id; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openReplyModal();
  }

  closeReplyModal() {
    $(this.replyModal.nativeElement).modal('hide');
    this.getReplies(this.replyId);
    setTimeout(() => {
      this.DiscussionReply.type = null;
      this._utilityService.detectChanges(this._cdr)

    }, 200);
  }

  openReplyModal() {
    setTimeout(() => {
      $(this.replyModal.nativeElement).modal('show');
    }, 200);
  }

  createImagePreview(type, token) {
    return this._discussionService.getThumbnailPreview(type, token)
  }
}
