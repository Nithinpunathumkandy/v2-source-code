import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditModeModalComponent } from './ms-audit-mode-modal.component';

describe('MsAuditModeModalComponent', () => {
  let component: MsAuditModeModalComponent;
  let fixture: ComponentFixture<MsAuditModeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditModeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditModeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
