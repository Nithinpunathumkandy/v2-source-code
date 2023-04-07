import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractListComponent } from './sla-contract-list.component';

describe('SlaContractListComponent', () => {
  let component: SlaContractListComponent;
  let fixture: ComponentFixture<SlaContractListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
