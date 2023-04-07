import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceCountTypeComponent } from './compliance-count-type.component';

describe('ComplianceCountTypeComponent', () => {
  let component: ComplianceCountTypeComponent;
  let fixture: ComponentFixture<ComplianceCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
