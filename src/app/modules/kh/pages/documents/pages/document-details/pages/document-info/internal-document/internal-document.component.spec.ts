import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalDocumentComponent } from './internal-document.component';

describe('InternalDocumentComponent', () => {
  let component: InternalDocumentComponent;
  let fixture: ComponentFixture<InternalDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
