import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditProgramDetailsComponent } from './audit-program-details.component';

describe('AuditProgramDetailsComponent', () => {
  let component: AuditProgramDetailsComponent;
  let fixture: ComponentFixture<AuditProgramDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditProgramDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
