import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditDetailsComponent } from './ms-audit-details.component';

describe('MsAuditDetailsComponent', () => {
  let component: MsAuditDetailsComponent;
  let fixture: ComponentFixture<MsAuditDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
