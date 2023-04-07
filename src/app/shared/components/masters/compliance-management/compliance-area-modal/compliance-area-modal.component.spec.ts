import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceAreaModalComponent } from './compliance-area-modal.component';

describe('ComplianceAreaModalComponent', () => {
  let component: ComplianceAreaModalComponent;
  let fixture: ComponentFixture<ComplianceAreaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceAreaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceAreaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
