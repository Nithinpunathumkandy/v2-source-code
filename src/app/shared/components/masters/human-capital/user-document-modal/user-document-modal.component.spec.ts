import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDocumentModalComponent } from './user-document-modal.component';

describe('UserDocumentModalComponent', () => {
  let component: UserDocumentModalComponent;
  let fixture: ComponentFixture<UserDocumentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDocumentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
