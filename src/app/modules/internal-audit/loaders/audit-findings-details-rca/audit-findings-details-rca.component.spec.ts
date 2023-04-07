import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingsDetailsRCAComponent } from './audit-findings-details-rca.component';

describe('AuditFindingsDetailsRCAComponent', () => {
  let component: AuditFindingsDetailsRCAComponent;
  let fixture: ComponentFixture<AuditFindingsDetailsRCAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditFindingsDetailsRCAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingsDetailsRCAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
