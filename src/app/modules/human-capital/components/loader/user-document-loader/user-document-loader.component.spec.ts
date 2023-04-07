import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDocumentLoaderComponent } from './user-document-loader.component';

describe('UserDocumentLoaderComponent', () => {
  let component: UserDocumentLoaderComponent;
  let fixture: ComponentFixture<UserDocumentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDocumentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDocumentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
