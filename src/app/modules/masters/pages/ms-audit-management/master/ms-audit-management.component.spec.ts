import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditManagementComponent } from './ms-audit-management.component';

describe('MsAuditManagementComponent', () => {
  let component: MsAuditManagementComponent;
  let fixture: ComponentFixture<MsAuditManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
