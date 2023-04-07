import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditChecklistViewmoreComponent } from './audit-checklist-viewmore.component';

describe('AuditChecklistViewmoreComponent', () => {
  let component: AuditChecklistViewmoreComponent;
  let fixture: ComponentFixture<AuditChecklistViewmoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditChecklistViewmoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditChecklistViewmoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
