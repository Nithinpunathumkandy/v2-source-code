import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDocumentLoaderComponent } from './profile-document-loader.component';

describe('ProfileDocumentLoaderComponent', () => {
  let component: ProfileDocumentLoaderComponent;
  let fixture: ComponentFixture<ProfileDocumentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileDocumentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDocumentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
