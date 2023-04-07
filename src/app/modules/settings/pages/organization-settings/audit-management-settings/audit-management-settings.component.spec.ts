import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditManagementSettingsComponent } from './audit-management-settings.component';

describe('AuditManagementSettingsComponent', () => {
  let component: AuditManagementSettingsComponent;
  let fixture: ComponentFixture<AuditManagementSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditManagementSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditManagementSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
