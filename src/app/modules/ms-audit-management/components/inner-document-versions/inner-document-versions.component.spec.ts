import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerDocumentVersionsComponent } from './inner-document-versions.component';

describe('InnerDocumentVersionsComponent', () => {
  let component: InnerDocumentVersionsComponent;
  let fixture: ComponentFixture<InnerDocumentVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerDocumentVersionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerDocumentVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
