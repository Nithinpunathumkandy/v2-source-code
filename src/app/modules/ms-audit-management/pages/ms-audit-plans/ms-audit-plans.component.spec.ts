import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditPlansComponent } from './ms-audit-plans.component';

describe('MsAuditPlansComponent', () => {
  let component: MsAuditPlansComponent;
  let fixture: ComponentFixture<MsAuditPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditPlansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
