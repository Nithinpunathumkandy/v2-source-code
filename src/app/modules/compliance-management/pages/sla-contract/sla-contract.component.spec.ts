import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractComponent } from './sla-contract.component';

describe('SlaContractComponent', () => {
  let component: SlaContractComponent;
  let fixture: ComponentFixture<SlaContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
