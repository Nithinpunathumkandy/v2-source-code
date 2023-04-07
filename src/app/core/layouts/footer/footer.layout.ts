import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as $ from 'jquery';
import { AppStore } from 'src/app/stores/app.store';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-footer-layout',
    templateUrl: './footer.layout.html',
    styleUrls: ['./footer.layout.scss']
})
export class FooterLayout {

    ThemeStructureSettingStore = ThemeStructureSettingStore;
    DiscussionBotStore = DiscussionBotStore;
    AppStore = AppStore
    ngOnInit() {
        //Click to top
        $('#return-to-top').click(function () {      // When arrow is clicked
            $('body,html').animate({
                scrollTop: 0                       // Scroll to top of body
            }, 500);
        });
    }

    messageClicked(event){
        AppStore.openDiscussionBox();
      }

    scrollToTop(){
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

}