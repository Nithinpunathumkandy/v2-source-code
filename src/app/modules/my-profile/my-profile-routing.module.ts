import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecurityComponent } from '../human-capital/pages/users/pages/user-details/user-settings-page/security/security.component';
import { ActivitiesMainComponent } from './pages/activities/activities-main/activities-main.component';
import { DashboardMainComponent } from './pages/dashboard/dashboard-main/dashboard-main.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { CompetenciesComponent } from './pages/profile/competencies/competencies.component';
import { DocumentsComponent } from './pages/profile/documents/documents.component';
import { JdComponent } from './pages/profile/jd/jd.component';
import { KpiComponent } from './pages/profile/kpi/kpi.component';
import { NotificationComponent } from './pages/profile/notification/notification.component';
import { ProfileMainComponent } from './pages/profile/profile-main/profile-main.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { RRComponent } from './pages/profile/r-r/r-r.component';
import { ReportsComponent } from './pages/profile/reports/reports.component';
import { TrainingTabComponent } from './pages/profile/training-tab/training-tab.component';
import { AccessSettingsComponent } from './pages/settings/access-settings/access-settings.component';
import { AclSettingComponent } from './pages/settings/acl-setting/acl-setting.component';
import { EmailnotificationProfileSettingsComponent } from './pages/settings/emailnotification-profile-settings/emailnotification-profile-settings.component';
import { IntegrationProfileSettingsComponent } from './pages/settings/integration-profile-settings/integration-profile-settings.component';
import { MyprofileGeneralSettingsComponent } from './pages/settings/myprofile-general-settings/myprofile-general-settings.component';
import { SettingsMainComponent } from './pages/settings/settings-main/settings-main.component';
import { SettingsSecurityComponent } from './pages/settings/settings-security/settings-security.component';
import { TasksMainComponent } from './pages/tasks/tasks-main/tasks-main.component';
import { ThirdPartyAppIntegrationComponent } from './pages/profile/third-party-app-integration/third-party-app-integration.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    component: MyProfileComponent,
    data: {
    },
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: ProfileMainComponent,
        data: {
          core: {title: "Profile"},
        },
        children:[
          {
            path: '',
            component: ProfileComponent,
            data: {
              core: { title: "Profile" }
            }
          },
          {
            path: 'documents',
            component: DocumentsComponent,
            data: {
              core: { title: "Documents" }
            }
          },
          {
            path: 'job-descriptions',
            component: JdComponent,
            data: {
              core: { title: "JD" }
            }
          },
          {
            path: 'roles-and-responsibilities',
            component: RRComponent,
            data: {
              core: { title: "R&R" }
            }
          },
          {
            path: 'integration',
            component: ThirdPartyAppIntegrationComponent,
            data: {
              core: { title: "Integration" }
            }
          },
          {
            path: 'notification',
            component: NotificationComponent,
            data: {
              core: { title: "Notification" }
            }
          },
          {
            path: 'key-performances',
            component: KpiComponent,
            data: {
              core: { title: "KPI" }
            }
          },
          {
            path: 'competencies',
            component: CompetenciesComponent,
            data: {
              core: { title: "Competencies" }
            }
          },
          {
            path: 'trainings',
            component: TrainingTabComponent,
            data: {
              core: { title: "Trainings" }
            }
          },
          {
            path: 'reports',
            component: ReportsComponent,
            data: {
              core: { title: "Reports" }
            }
          },
          {
            path: 'settings',
            component: SettingsMainComponent,
            data: {
              core: { title: "Settings" }
            },
            children:[
              {
                path: '',
                redirectTo: 'security',
                pathMatch: 'full',
              },
              {
                path: 'security',
                component: SettingsSecurityComponent,
                data: {
                  core: { title: " Security" }
                }
              },
              {
                path: 'access',
                component: AccessSettingsComponent,
                data: {
                  core: { title: "Access" }
                }
              },
              {
                path: 'email-notification',
                component: EmailnotificationProfileSettingsComponent,
                data: {
                  core: { title: " Email Notification" }
                }
              },
              {
                path: 'general-settings',
                component: MyprofileGeneralSettingsComponent,
                data: {
                  core: { title: "General Settings" }
                }
              },
              {
                path: 'integration',
                component: IntegrationProfileSettingsComponent,
                data: {
                  core: { title: "Integration" }
                }
              },
              {
                path: 'acl',
                component: AclSettingComponent,
                data: {
                  core: { title: "ACL" }
                }
              },
            ]
          },
        ]

      },
      
      {
        path: 'activities',
        component: ActivitiesMainComponent,
        data: {
          core: { title: "Activities Main" },
          breadcrumb: 'Activities'
        },
        // children:[]
      },
      {
        path: 'dashboard',
        component: DashboardMainComponent,
        data: {
          core: { title: "Dashboard" },
          breadcrumb: 'Dashboard'
        },
        // children:[]
      },
      {
        path: 'tasks',
        component: TasksMainComponent,
        data: {
          core: { title: "Tasks" },
          breadcrumb: 'Tasks'
        },
        // children:[]
      },
      {
        path: 'settings',
        component: SettingsMainComponent,
        data: {
          core: { title: "Tasks" },
          breadcrumb: 'Tasks'
        },
        // children:[]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProfileRoutingModule { }
