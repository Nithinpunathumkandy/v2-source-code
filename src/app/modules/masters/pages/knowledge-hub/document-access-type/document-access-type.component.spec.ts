import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAccessTypeComponent } from './document-access-type.component';

describe('DocumentAccessTypeComponent', () => {
  let component: DocumentAccessTypeComponent;
  let fixture: ComponentFixture<DocumentAccessTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentAccessTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentAccessTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
