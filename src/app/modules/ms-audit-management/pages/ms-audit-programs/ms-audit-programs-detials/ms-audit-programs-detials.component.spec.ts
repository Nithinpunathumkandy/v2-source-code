import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditProgramsDetialsComponent } from './ms-audit-programs-detials.component';

describe('MsAuditProgramsDetialsComponent', () => {
  let component: MsAuditProgramsDetialsComponent;
  let fixture: ComponentFixture<MsAuditProgramsDetialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditProgramsDetialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditProgramsDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
