import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiBasePathInterceptor } from './auth/interceptors/api-base-path-interceptor';
import { HeaderInterceptor } from './auth/interceptors/header.interceptor';
import { ErrorHandlerInterceptor } from './auth/interceptors/error-handler.interceptor';
import { JwtService } from './auth/services/jwt.service';
import { RetryInterceptor } from './auth/interceptors/retry-interceptor';
import { AppLayout } from './layouts/app/app.layout';
import { HeaderLayout } from './layouts/header/header.layout';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterLayout } from './layouts/footer/footer.layout';
import { LeftSideMenuLayout } from './layouts/left-side-menu/left-side-menu.layout';
import { RightSideMenuLayout } from './layouts/right-sidebar/right-sidebar.layout';
import { AuthService } from './auth/services/auth.service';
import { ChatLayout } from './modules/chat/layout/chat.layout';
import { FeedbackLayout } from './modules/feedback/layout/feedback.layout';
import { SharedModule } from '../shared/shared.module';
import { HelpComponent } from './modules/help/help.component';
import { AccessConfigurationComponent } from './modules/access-configuration/access-configuration.component';
// import { ApplicationLoaderComponent } from './modules/application-loader/application-loader.component';
import { DiscussionComponent } from './modules/discussion/discussion.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ChatThumbnailPreviewComponent } from "./modules/discussion/components/chat-thumbnail-preview/chat-thumbnail-preview.component";
import { CommentComponent } from './modules/comment/comment.component';
import { DiscussionBoxLoaderComponent } from './modules/discussion/components/discussion-box-loader/discussion-box-loader.component';
import { ObjectiveWorkflowComponent } from './services/strategy-management/objective-workflow-service/objective-workflow/objective-workflow.component';

@NgModule({
    declarations: [
        AppLayout,
        HeaderLayout,
        FooterLayout,
        LeftSideMenuLayout,
        RightSideMenuLayout,
        ChatLayout,
        FeedbackLayout,
        HelpComponent,
        AccessConfigurationComponent,
        // ApplicationLoaderComponent,
        DiscussionComponent,
        ChatThumbnailPreviewComponent,
        CommentComponent,
        DiscussionBoxLoaderComponent,
        ObjectiveWorkflowComponent
        ],
    imports: [
        SharedModule,
        InfiniteScrollModule,
        NgxPaginationModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ApiBasePathInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RetryInterceptor, multi: true },
        JwtService,
        AuthService,
    ]
})
export class CoreModule { }