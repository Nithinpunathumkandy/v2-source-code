import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCheckinPopupComponent } from './document-checkin-popup.component';

describe('DocumentCheckinPopupComponent', () => {
  let component: DocumentCheckinPopupComponent;
  let fixture: ComponentFixture<DocumentCheckinPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentCheckinPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCheckinPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
