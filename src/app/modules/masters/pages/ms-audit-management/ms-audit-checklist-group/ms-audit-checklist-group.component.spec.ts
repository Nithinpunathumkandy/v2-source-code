import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditChecklistGroupComponent } from './ms-audit-checklist-group.component';

describe('MsAuditChecklistGroupComponent', () => {
  let component: MsAuditChecklistGroupComponent;
  let fixture: ComponentFixture<MsAuditChecklistGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditChecklistGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditChecklistGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
