import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractMappingComponent } from './sla-contract-mapping.component';

describe('SlaContractMappingComponent', () => {
  let component: SlaContractMappingComponent;
  let fixture: ComponentFixture<SlaContractMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
