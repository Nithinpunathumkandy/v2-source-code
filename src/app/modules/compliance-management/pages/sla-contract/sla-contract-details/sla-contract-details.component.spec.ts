import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractDetailsComponent } from './sla-contract-details.component';

describe('SlaContractDetailsComponent', () => {
  let component: SlaContractDetailsComponent;
  let fixture: ComponentFixture<SlaContractDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
