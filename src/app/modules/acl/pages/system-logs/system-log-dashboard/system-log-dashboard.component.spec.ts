import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLogDashboardComponent } from './system-log-dashboard.component';

describe('SystemLogDashboardComponent', () => {
  let component: SystemLogDashboardComponent;
  let fixture: ComponentFixture<SystemLogDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemLogDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemLogDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
