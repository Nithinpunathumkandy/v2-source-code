import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditObjectiveModalComponent } from './audit-objective-modal.component';

describe('AuditObjectiveModalComponent', () => {
  let component: AuditObjectiveModalComponent;
  let fixture: ComponentFixture<AuditObjectiveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditObjectiveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditObjectiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
