import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditPlansAddComponent } from './ms-audit-plans-add.component';

describe('MsAuditPlansAddComponent', () => {
  let component: MsAuditPlansAddComponent;
  let fixture: ComponentFixture<MsAuditPlansAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditPlansAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditPlansAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
