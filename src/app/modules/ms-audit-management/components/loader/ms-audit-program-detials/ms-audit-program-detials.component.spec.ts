import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditProgramDetialsComponent } from './ms-audit-program-detials.component';

describe('MsAuditProgramDetialsComponent', () => {
  let component: MsAuditProgramDetialsComponent;
  let fixture: ComponentFixture<MsAuditProgramDetialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditProgramDetialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditProgramDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
