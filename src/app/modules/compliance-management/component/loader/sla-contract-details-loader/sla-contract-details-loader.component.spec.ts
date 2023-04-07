import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractDetailsLoaderComponent } from './sla-contract-details-loader.component';

describe('SlaContractDetailsLoaderComponent', () => {
  let component: SlaContractDetailsLoaderComponent;
  let fixture: ComponentFixture<SlaContractDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
