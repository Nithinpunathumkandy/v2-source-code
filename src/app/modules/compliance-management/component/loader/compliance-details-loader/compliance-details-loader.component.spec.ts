import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceDetailsLoaderComponent } from './compliance-details-loader.component';

describe('ComplianceDetailsLoaderComponent', () => {
  let component: ComplianceDetailsLoaderComponent;
  let fixture: ComponentFixture<ComplianceDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
