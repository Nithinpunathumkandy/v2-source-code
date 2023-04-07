import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceCategoryMasterComponent } from './compliance-category-master.component';

describe('ComplianceCategoryMasterComponent', () => {
  let component: ComplianceCategoryMasterComponent;
  let fixture: ComponentFixture<ComplianceCategoryMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceCategoryMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
