import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractDocumentRenewModalComponent } from './sla-contract-document-renew-modal.component';

describe('SlaContractDocumentRenewModalComponent', () => {
  let component: SlaContractDocumentRenewModalComponent;
  let fixture: ComponentFixture<SlaContractDocumentRenewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractDocumentRenewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractDocumentRenewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
