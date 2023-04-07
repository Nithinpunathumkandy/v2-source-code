import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDocumentTypeMasterComponent } from './user-document-type-master.component';

describe('UserDocumentTypeMasterComponent', () => {
  let component: UserDocumentTypeMasterComponent;
  let fixture: ComponentFixture<UserDocumentTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDocumentTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDocumentTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
