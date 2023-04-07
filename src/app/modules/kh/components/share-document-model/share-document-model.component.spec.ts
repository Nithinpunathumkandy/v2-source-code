import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareDocumentModelComponent } from './share-document-model.component';

describe('ShareDocumentModelComponent', () => {
  let component: ShareDocumentModelComponent;
  let fixture: ComponentFixture<ShareDocumentModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareDocumentModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDocumentModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
