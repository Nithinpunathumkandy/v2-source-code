import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestDashboardComponent } from './change-request-dashboard.component';

describe('ChangeRequestDashboardComponent', () => {
  let component: ChangeRequestDashboardComponent;
  let fixture: ComponentFixture<ChangeRequestDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
