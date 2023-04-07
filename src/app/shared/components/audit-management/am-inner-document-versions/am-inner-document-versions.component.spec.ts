import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmInnerDocumentVersionsComponent } from './am-inner-document-versions.component';

describe('AmInnerDocumentVersionsComponent', () => {
  let component: AmInnerDocumentVersionsComponent;
  let fixture: ComponentFixture<AmInnerDocumentVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmInnerDocumentVersionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmInnerDocumentVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
