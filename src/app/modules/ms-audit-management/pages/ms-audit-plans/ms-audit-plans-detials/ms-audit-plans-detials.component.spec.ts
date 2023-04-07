import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditPlansDetialsComponent } from './ms-audit-plans-detials.component';

describe('MsAuditPlansDetialsComponent', () => {
  let component: MsAuditPlansDetialsComponent;
  let fixture: ComponentFixture<MsAuditPlansDetialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditPlansDetialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditPlansDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
