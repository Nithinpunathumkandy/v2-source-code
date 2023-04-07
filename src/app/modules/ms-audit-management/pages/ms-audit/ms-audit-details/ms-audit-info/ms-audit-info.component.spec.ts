import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditInfoComponent } from './ms-audit-info.component';

describe('MsAuditInfoComponent', () => {
  let component: MsAuditInfoComponent;
  let fixture: ComponentFixture<MsAuditInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
