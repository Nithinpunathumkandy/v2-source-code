import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractModelComponent } from './sla-contract-model.component';

describe('SlaContractModelComponent', () => {
  let component: SlaContractModelComponent;
  let fixture: ComponentFixture<SlaContractModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
