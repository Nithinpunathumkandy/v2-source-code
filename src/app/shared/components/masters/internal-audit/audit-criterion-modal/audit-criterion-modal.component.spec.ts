import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCriterionModalComponent } from './audit-criterion-modal.component';

describe('AuditCriterionModalComponent', () => {
  let component: AuditCriterionModalComponent;
  let fixture: ComponentFixture<AuditCriterionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditCriterionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCriterionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
