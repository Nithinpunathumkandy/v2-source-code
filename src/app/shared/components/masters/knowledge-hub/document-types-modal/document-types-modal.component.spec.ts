import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypesModalComponent } from './document-types-modal.component';

describe('DocumentTypesModalComponent', () => {
  let component: DocumentTypesModalComponent;
  let fixture: ComponentFixture<DocumentTypesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentTypesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTypesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
