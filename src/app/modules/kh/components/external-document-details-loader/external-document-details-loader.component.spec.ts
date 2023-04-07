import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalDocumentDetailsLoaderComponent } from './external-document-details-loader.component';

describe('ExternalDocumentDetailsLoaderComponent', () => {
  let component: ExternalDocumentDetailsLoaderComponent;
  let fixture: ComponentFixture<ExternalDocumentDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalDocumentDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalDocumentDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
