import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditProgramsComponent } from './ms-audit-programs.component';

describe('MsAuditProgramsComponent', () => {
  let component: MsAuditProgramsComponent;
  let fixture: ComponentFixture<MsAuditProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditProgramsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
