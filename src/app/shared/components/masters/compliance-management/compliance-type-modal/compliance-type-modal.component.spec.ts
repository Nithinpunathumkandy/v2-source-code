import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceTypeModalComponent } from './compliance-type-modal.component';

describe('ComplianceTypeModalComponent', () => {
  let component: ComplianceTypeModalComponent;
  let fixture: ComponentFixture<ComplianceTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
