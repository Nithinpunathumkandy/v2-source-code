import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualAuditPalnFrequencyItemComponent } from './annual-audit-paln-frequency-item.component';

describe('AnnualAuditPalnFrequencyItemComponent', () => {
  let component: AnnualAuditPalnFrequencyItemComponent;
  let fixture: ComponentFixture<AnnualAuditPalnFrequencyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualAuditPalnFrequencyItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualAuditPalnFrequencyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
