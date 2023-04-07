import { observable, action } from 'mobx-angular';
import { ActivatedRoute } from '@angular/router';

class Store {
    //App
    @observable
    title: string = 'isorobot';

    @observable
    pageTitle: string = '';

    @observable
    showLoader: boolean = true;

    @observable
    noContentText: string = 'NA';

    activeStatusId: number = 1;

    inActiveStatusId: number = 2;

    idleTimeOut: number;

    appTimeZone: string;

    appTimeZoneUTC: string;

    overlay:boolean = false;

    confirmationLoading: boolean = false;

    @observable
    showDiscussion:boolean = false;

    previousUrl: string = null;

    currentUrl: string = null;

    @observable
    showTutorial:boolean = false;

    @action
    setTitle(title: string) {
        if (title) {
            this.title = `${title.trim()} isorobot`;
            this.pageTitle = title.substring(0,title.indexOf('|')).trim();
        }
    }

    //loading
    @observable
    loading: boolean = false;

    @action
    enableLoading() {
        this.loading = true;
    }

    @action
    disableLoading() {
        this.loading = false;
    }

    
    // Left Side Menu
    @observable
    leftSideMenuOpen: boolean = false;

    @action
    openLeftSideMenu() {
        this.leftSideMenuOpen = true;
    }
    @action
    closeLeftSideMenu() {
        this.leftSideMenuOpen = false;
    }

    // Right Sidebar
    @observable
    rightSidebarOpen: boolean = false;

    @observable
    commentBoxOpen: boolean = false;

    @action
    openCommentBox() {
        this.commentBoxOpen = true;
    }
    @action
    closeCommentBox() {
        this.commentBoxOpen = false;
    }

    @action
    openRightSidebar() {
        this.rightSidebarOpen = true;
    }
    @action
    closeRightSidebar() {
        this.rightSidebarOpen = false;
    }

    // Chat Box
    @observable
    chatBoxOpen: boolean = false;
    
    @observable
    chatBoxLarge: boolean = true;

    @action
    openChatBox() {
        this.chatBoxLarge = false;
        this.chatBoxOpen = true;
    }
    @action
    closeChatBox() {
        this.chatBoxOpen = false;
        this.chatBoxLarge = false;
    }
    @action
    makeChatBoxLarge() {
        this.chatBoxLarge = true;
    }
    @action
    makeChatBoxSmall() {
        this.chatBoxLarge = false;
    }

    // NavigationEnd (Router changing event)
    @observable
    route: ActivatedRoute = null;

    @action
    setRoute(currentRoute: ActivatedRoute) {
        this.route = currentRoute;
    }

    // Snackbar position, default: tr (top right)
    @observable
    snackbarPosition = 'tr';

    @action
    setSnackbarPosition(position: 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br') {
        this.snackbarPosition = position ? position : 'tr';
    }

    @observable
    discussionBoxOpen: boolean = false;

    @observable
    discussionBoxLarge: boolean = false;

    @action
    openDiscussionBox() {
        this.discussionBoxOpen = true;
        this.discussionBoxLarge = false;
    }
    @action
    closeDiscussionBox() {
        this.discussionBoxOpen = false;
        this.discussionBoxLarge = false;
    }

    @action
    makeDiscussionBoxLarge() {
        this.discussionBoxLarge = true;
    }
    @action
    makeDiscussionBoxSmall() {
        this.discussionBoxLarge = false;
    }

}

export const AppStore = new Store();