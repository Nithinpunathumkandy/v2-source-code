import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalDocumentLeftMenuComponent } from './internal-document-left-menu.component';

describe('InternalDocumentLeftMenuComponent', () => {
  let component: InternalDocumentLeftMenuComponent;
  let fixture: ComponentFixture<InternalDocumentLeftMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalDocumentLeftMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalDocumentLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
