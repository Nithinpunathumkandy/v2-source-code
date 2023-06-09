import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditProgramComponent } from './audit-program.component';

describe('AuditProgramComponent', () => {
  let component: AuditProgramComponent;
  let fixture: ComponentFixture<AuditProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
