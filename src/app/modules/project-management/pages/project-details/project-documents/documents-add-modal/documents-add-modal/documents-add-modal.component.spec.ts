import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAddModalComponent } from './documents-add-modal.component';

describe('DocumentsAddModalComponent', () => {
  let component: DocumentsAddModalComponent;
  let fixture: ComponentFixture<DocumentsAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
