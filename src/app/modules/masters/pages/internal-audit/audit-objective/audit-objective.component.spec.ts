import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditObjectiveComponent } from './audit-objective.component';

describe('AuditObjectiveComponent', () => {
  let component: AuditObjectiveComponent;
  let fixture: ComponentFixture<AuditObjectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditObjectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
