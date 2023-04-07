import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFamilyModalComponent } from './document-family-modal.component';

describe('DocumentFamilyModalComponent', () => {
  let component: DocumentFamilyModalComponent;
  let fixture: ComponentFixture<DocumentFamilyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentFamilyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentFamilyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
