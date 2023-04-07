import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceSectionComponent } from './compliance-section.component';

describe('ComplianceSectionComponent', () => {
  let component: ComplianceSectionComponent;
  let fixture: ComponentFixture<ComplianceSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
