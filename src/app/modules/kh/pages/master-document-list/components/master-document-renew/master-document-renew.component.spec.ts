import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDocumentRenewComponent } from './master-document-renew.component';

describe('MasterDocumentRenewComponent', () => {
  let component: MasterDocumentRenewComponent;
  let fixture: ComponentFixture<MasterDocumentRenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDocumentRenewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDocumentRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
