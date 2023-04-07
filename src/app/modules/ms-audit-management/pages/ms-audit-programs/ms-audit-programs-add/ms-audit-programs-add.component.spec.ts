import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditProgramsAddComponent } from './ms-audit-programs-add.component';

describe('MsAuditProgramsAddComponent', () => {
  let component: MsAuditProgramsAddComponent;
  let fixture: ComponentFixture<MsAuditProgramsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditProgramsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditProgramsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
