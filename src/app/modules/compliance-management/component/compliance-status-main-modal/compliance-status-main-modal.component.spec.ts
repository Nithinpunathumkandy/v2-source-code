import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceStatusMainModalComponent } from './compliance-status-main-modal.component';

describe('ComplianceStatusMainModalComponent', () => {
  let component: ComplianceStatusMainModalComponent;
  let fixture: ComponentFixture<ComplianceStatusMainModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceStatusMainModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceStatusMainModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
