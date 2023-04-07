import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceSectionModalComponent } from './compliance-section-modal.component';

describe('ComplianceSectionModalComponent', () => {
  let component: ComplianceSectionModalComponent;
  let fixture: ComponentFixture<ComplianceSectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceSectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
