import { query } from "@angular/animations";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, ChangeDetectionStrategy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from "@angular/core";
import { ArrayList } from "src/app/core/models/chatbox.model";
import { ChatboxService } from "src/app/core/services/chatbox/chatbox.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from "src/app/stores/auth.store";
import { ChatbotStore } from "src/app/stores/chatbot.stores";

declare var $: any;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-chat-layout',
    templateUrl: './chat.layout.html',
    styleUrls: ['./chat.layout.scss']
})
export class ChatLayout implements AfterViewInit {
    AppStore = AppStore;
    @ViewChild('initOwlCarousel', { static: false }) initOwlCarousel: ElementRef;
    @ViewChild('chatingArea', { static: false }) chatingArea: ElementRef;
    @ViewChild('scroll') scroll: any;

    owlCarousel: any;
    query: string;
    message: any;
    result: any;
    listArray: ArrayList[] = [];
    queryArray = [];
    messageArray = [];
    AuthStore = AuthStore;
    buttonDisabled =  false;
    emptyMessage:boolean = true;
    constructor(private _chatboxService: ChatboxService,
        private utilityService: UtilityService,
        private _humanCapitalService: HumanCapitalService,
        private _imageService: ImageServiceService,
        private elem: ElementRef,
        private cdr: ChangeDetectorRef) {

    }

    // ngAfterViewChecked() {        
    //     this.scrollToBottom();        
    // } 

    ngAfterViewInit() {
        $(this.scroll.nativeElement).mCustomScrollbar();
        // this.owlCarousel = $(this.initOwlCarousel.nativeElement);
        // this.owlCarousel.owlCarousel({
        //     items: 2,
        //     loop: true,
        //     dots: false,
        // }); 
        // this.scrollToBottom();
        // this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
    }

    owlPre(event) {

        this.owlCarousel.trigger('prev.owl.carousel');
    }

    owlNext(event) {

        this.owlCarousel.trigger('next.owl.carousel');
    }

    roboHeadClicked(event) {
        AppStore.openChatBox();
    }

    chatCloseClicked(event) {
        AppStore.closeChatBox();
    }

    chatLargeClicked(event) {
        if (AppStore.chatBoxLarge) AppStore.makeChatBoxSmall();
        else AppStore.makeChatBoxLarge();
    }

    searchData() {
        for(let i=0;i<this.listArray.length;i++){
            if(this.listArray[i].message == 'typing'){
                this.listArray[i].message = null;
            }
        }
    }

    getMessage(keyup?) {
        let submit;
        if(keyup)
        submit = this.query?.length > 1 ? true : false;
        else
        submit = this.query ? true : false;

        if (submit && !this.buttonDisabled) {
            this.buttonDisabled = true;
            let data = {
                query: this.query,
            }
            let queryArrayData = {
                query: this.query,
                message: 'typing'
            }
            this.emptyMessage = false;
            this.listArray.push(queryArrayData);
            this.mscrollToBottom();
            this.query = null;
            this.utilityService.detectChanges(this.cdr);
            this._chatboxService.getResult(data).subscribe(res => {
                this.message = res;
                this.searchData();
                this.utilityService.detectChanges(this.cdr);
                this.listArray.push(ChatbotStore.returnMessage);
                this.mscrollToBottom();
                this.utilityService.detectChanges(this.cdr);
                this.buttonDisabled = false;
            }, (err: HttpErrorResponse) =>{
                this.searchData();
                let queryArrayData = {
                    query: this.query,
                    message: 'Unable to fetch result'
                }
                this.listArray.push(queryArrayData);
                this.buttonDisabled = false;
                this.utilityService.detectChanges(this.cdr);
            })
            // this.buttonDisabled = false;
        }
    }

    // scrollToBottom() {
    //         this.chatingArea.nativeElement.scrollTop = this.chatingArea?.nativeElement?.scrollHeight;
    //         $(this.scroll.nativeElement).mCustomScrollbar();

    //     }                 

    // @HostListener("window:scroll", [])
    // onWindowScroll() {
    //     let elements = this.elem.nativeElement.querySelectorAll('.input-block');

    //     //we'll do some stuff here when the window is scrolled
    //     elements.forEach((elem) => {
    //         var etop = elem.getBoundingClientRect().top;
    //         var diff = etop - window.pageYOffset;

    //         if (this.elementInViewport(elem)) {
    //             this.reinitState(elem, elements);
    //         }
    //     });
    // }


    // reinitState(elem, elements) {
    //     elements.forEach(elem => {
    //         elem.classList.remove('active');
    //     })
    //     elem.classList.add('active');

    // }

    // elementInViewport(el) {
    //     var top = el.offsetTop;
    //     var diff = top - window.scrollY;
    //     // return (diff > 0 && diff < 250);
    //     return (diff > 0 && diff < 250);
    // }

    // scrollToBottom(event) {
    //     var top = window.pageYOffset;

    //     if (event.screenY < 200) {


    //         top = top + this.elem.nativeElement.offsetTop - 200;
    //         window.scrollTo({ left: 0, top: top, behavior: 'smooth' });


    //         setTimeout(() => {
    //             // top = top + this.elem.nativeElement.offsetTop + 230;
    //             top = top + this.elem.nativeElement.offsetTop + 230;
    //             window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
    //         }, 200);


    //         // top = top + this.elem.nativeElement.offsetTop - 260;

    //     }
    //     else {
    //         top = top + this.elem.nativeElement.offsetTop + 200;
    //     }


    //     window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
    // }

    createImageUrl(token) {
        return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

    getDefaultImage() {
        return this._imageService.getDefaultImageUrl('user-logo');
    }

    mscrollToBottom() {
        setTimeout(() => {
            $(this.scroll.nativeElement).mCustomScrollbar("scrollTo", "bottom", {
                scrollEasing: "linear"
            });
        }, 25);
    }
}