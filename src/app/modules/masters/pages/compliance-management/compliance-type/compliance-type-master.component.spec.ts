import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceTypeMasterComponent } from './compliance-type-master.component';

describe('ComplianceTypeMasterComponent', () => {
  let component: ComplianceTypeMasterComponent;
  let fixture: ComponentFixture<ComplianceTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
