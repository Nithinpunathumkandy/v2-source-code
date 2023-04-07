import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractInfoComponent } from './sla-contract-info.component';

describe('SlaContractInfoComponent', () => {
  let component: SlaContractInfoComponent;
  let fixture: ComponentFixture<SlaContractInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
