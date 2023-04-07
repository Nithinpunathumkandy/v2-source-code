import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConfirmityInnerDocumentsComponent } from './non-confirmity-inner-documents.component';

describe('NonConfirmityInnerDocumentsComponent', () => {
  let component: NonConfirmityInnerDocumentsComponent;
  let fixture: ComponentFixture<NonConfirmityInnerDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConfirmityInnerDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConfirmityInnerDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
