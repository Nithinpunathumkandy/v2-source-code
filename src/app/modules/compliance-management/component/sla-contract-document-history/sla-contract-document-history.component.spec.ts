import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractDocumentHistoryComponent } from './sla-contract-document-history.component';

describe('SlaContractDocumentHistoryComponent', () => {
  let component: SlaContractDocumentHistoryComponent;
  let fixture: ComponentFixture<SlaContractDocumentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractDocumentHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractDocumentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
