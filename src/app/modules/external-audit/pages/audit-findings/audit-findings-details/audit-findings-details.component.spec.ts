import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingsDetailsComponent } from './audit-findings-details.component';

describe('AuditFindingsDetailsComponent', () => {
  let component: AuditFindingsDetailsComponent;
  let fixture: ComponentFixture<AuditFindingsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditFindingsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
