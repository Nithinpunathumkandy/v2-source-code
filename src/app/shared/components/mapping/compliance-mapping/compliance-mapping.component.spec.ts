import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceMappingComponent } from './compliance-mapping.component';

describe('ComplianceMappingComponent', () => {
  let component: ComplianceMappingComponent;
  let fixture: ComponentFixture<ComplianceMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
