import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentListLoaderComponent } from './document-list-loader.component';

describe('DocumentListLoaderComponent', () => {
  let component: DocumentListLoaderComponent;
  let fixture: ComponentFixture<DocumentListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
