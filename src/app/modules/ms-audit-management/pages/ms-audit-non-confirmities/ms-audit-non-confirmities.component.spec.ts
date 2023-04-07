import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditNonConfirmitiesComponent } from './ms-audit-non-confirmities.component';

describe('MsAuditNonConfirmitiesComponent', () => {
  let component: MsAuditNonConfirmitiesComponent;
  let fixture: ComponentFixture<MsAuditNonConfirmitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditNonConfirmitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditNonConfirmitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
