import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditProgramListComponent } from './audit-program-list.component';

describe('AuditProgramListComponent', () => {
  let component: AuditProgramListComponent;
  let fixture: ComponentFixture<AuditProgramListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditProgramListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
