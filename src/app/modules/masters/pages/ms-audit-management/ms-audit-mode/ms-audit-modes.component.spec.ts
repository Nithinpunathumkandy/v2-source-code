import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditModesComponent } from './ms-audit-modes.component';

describe('MsAuditModesComponent', () => {
  let component: MsAuditModesComponent;
  let fixture: ComponentFixture<MsAuditModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditModesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
