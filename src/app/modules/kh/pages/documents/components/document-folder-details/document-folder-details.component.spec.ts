import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFolderDetailsComponent } from './document-folder-details.component';

describe('DocumentFolderDetailsComponent', () => {
  let component: DocumentFolderDetailsComponent;
  let fixture: ComponentFixture<DocumentFolderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentFolderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentFolderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
