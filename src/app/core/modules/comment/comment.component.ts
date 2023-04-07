import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { AppStore } from "src/app/stores/app.store";
import { CommentStore } from "src/app/stores/comment.store";
import { CommentService } from "src/app/core/services/comment/comment.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { EventEmitterService } from '../../services/general/event-emitter/event-emitter.service';

declare var $: any;

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @ViewChild('scroll') scroll: any;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  CommentStore = CommentStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  comment: string;
  replyComment: string;
  selectedCommentId: number = null;
  constructor(private _cdr: ChangeDetectorRef, private _utilityService: UtilityService,
    private _commentService: CommentService, private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      if(CommentStore.commentApi){
        this.getComments();    
      }
    })
  }

  ngAfterViewInit() {
    $(this.scroll.nativeElement).mCustomScrollbar();
  }

  sendMessage(commentId: number){
    // AppStore.enableLoading();
    let commentData = {
      "comment":this.replyComment,
    };
    commentData[this.CommentStore.commentVariable] = commentId;
    this._commentService.save(commentData).subscribe(res=>{
      this.replyComment = null;
      this.selectedCommentId = null;
      // AppStore.disableLoading();
      this.getComments();
    },
    (error)=>{
      // AppStore.disableLoading();
    })
  }

  replyClicked(id: number){
    if(this.selectedCommentId != id) this.selectedCommentId = id;
    else this.selectedCommentId = null;
    this._utilityService.detectChanges(this._cdr);
  }

  resolveClicked(id: number){
    this._commentService.resolve(id).subscribe(res=>{
      this.selectedCommentId = null;
      this.getComments();
    })
  }

  reopenClicked(id: number){
    this._commentService.reopen(id).subscribe(res=>{
      this.selectedCommentId = null;
      this.getComments();
    })
  }

  archiveClicked(id: number){
    this._commentService.archive(id).subscribe(res=>{
      this.selectedCommentId = null;
      this.getComments();
    })
  }

  sendComment(){
    AppStore.enableLoading();
    let commentData = {
      "comment":this.comment,
    };
    commentData[this.CommentStore.commentVariable] = '';
    this._commentService.save(commentData).subscribe(res=>{
      this.comment = null;
      this.selectedCommentId = null;
      AppStore.disableLoading();
      this.getComments();
    },
    (error)=>{
      AppStore.disableLoading();
    })
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getComments(){  
    this._commentService.getItems().subscribe(res=>{
      this.mscrollToBottom();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  cancel(){
    AppStore.closeCommentBox();
    this._eventEmitterService.closeCommentBox()
    this._utilityService.detectChanges(this._cdr);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  mscrollToBottom() {
    setTimeout(() => {
        $(this.scroll.nativeElement).mCustomScrollbar("scrollTo", "bottom", {
            scrollEasing: "linear"
        });
    }, 25);
  }

}
