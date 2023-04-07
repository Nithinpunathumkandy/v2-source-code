import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsLoaderComponent } from './documents-loader.component';

describe('DocumentsLoaderComponent', () => {
  let component: DocumentsLoaderComponent;
  let fixture: ComponentFixture<DocumentsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
