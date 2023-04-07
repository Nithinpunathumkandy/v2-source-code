import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCriterionComponent } from './audit-criterion.component';

describe('AuditCriterionComponent', () => {
  let component: AuditCriterionComponent;
  let fixture: ComponentFixture<AuditCriterionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditCriterionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCriterionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
