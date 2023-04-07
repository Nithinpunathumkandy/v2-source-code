import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditScheduleDetailsLoaderComponent } from './audit-schedule-details-loader.component';

describe('AuditScheduleDetailsLoaderComponent', () => {
  let component: AuditScheduleDetailsLoaderComponent;
  let fixture: ComponentFixture<AuditScheduleDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditScheduleDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditScheduleDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
