import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestDashboardLoaderComponent } from './change-request-dashboard-loader.component';

describe('ChangeRequestDashboardLoaderComponent', () => {
  let component: ChangeRequestDashboardLoaderComponent;
  let fixture: ComponentFixture<ChangeRequestDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
