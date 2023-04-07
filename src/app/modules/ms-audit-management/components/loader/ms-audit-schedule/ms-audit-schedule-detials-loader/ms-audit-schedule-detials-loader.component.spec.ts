import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditScheduleDetialsLoaderComponent } from './ms-audit-schedule-detials-loader.component';

describe('MsAuditScheduleDetialsLoaderComponent', () => {
  let component: MsAuditScheduleDetialsLoaderComponent;
  let fixture: ComponentFixture<MsAuditScheduleDetialsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditScheduleDetialsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditScheduleDetialsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
