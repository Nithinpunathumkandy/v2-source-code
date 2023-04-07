import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditManagementImpactComponent } from './audit-management-impact.component';

describe('AuditManagementImpactComponent', () => {
  let component: AuditManagementImpactComponent;
  let fixture: ComponentFixture<AuditManagementImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditManagementImpactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditManagementImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
