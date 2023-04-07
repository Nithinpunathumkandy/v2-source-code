import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalDocumentDetailsLoaderComponent } from './internal-document-details-loader.component';

describe('InternalDocumentDetailsLoaderComponent', () => {
  let component: InternalDocumentDetailsLoaderComponent;
  let fixture: ComponentFixture<InternalDocumentDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalDocumentDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalDocumentDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
