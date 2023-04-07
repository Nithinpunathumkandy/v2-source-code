import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentChangeRequestTypeComponent } from './document-change-request-type.component';

describe('DocumentChangeRequestTypeComponent', () => {
  let component: DocumentChangeRequestTypeComponent;
  let fixture: ComponentFixture<DocumentChangeRequestTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentChangeRequestTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentChangeRequestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
