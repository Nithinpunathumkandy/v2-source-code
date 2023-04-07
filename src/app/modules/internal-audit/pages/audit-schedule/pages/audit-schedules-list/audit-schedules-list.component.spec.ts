import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditSchedulesListComponent } from './audit-schedules-list.component';

describe('AuditSchedulesListComponent', () => {
  let component: AuditSchedulesListComponent;
  let fixture: ComponentFixture<AuditSchedulesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditSchedulesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSchedulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
