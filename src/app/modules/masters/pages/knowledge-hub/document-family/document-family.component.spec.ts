import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFamilyComponent } from './document-family.component';

describe('DocumentFamilyComponent', () => {
  let component: DocumentFamilyComponent;
  let fixture: ComponentFixture<DocumentFamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentFamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
