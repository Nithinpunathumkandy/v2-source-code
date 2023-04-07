import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditManagementPreviewComponent } from './ms-audit-management-preview.component';

describe('MsAuditManagementPreviewComponent', () => {
  let component: MsAuditManagementPreviewComponent;
  let fixture: ComponentFixture<MsAuditManagementPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditManagementPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditManagementPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
