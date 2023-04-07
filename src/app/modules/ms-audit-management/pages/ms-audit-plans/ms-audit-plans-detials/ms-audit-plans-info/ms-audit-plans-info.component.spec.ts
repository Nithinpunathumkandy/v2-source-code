import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditPlansInfoComponent } from './ms-audit-plans-info.component';

describe('MsAuditPlansInfoComponent', () => {
  let component: MsAuditPlansInfoComponent;
  let fixture: ComponentFixture<MsAuditPlansInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditPlansInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditPlansInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
