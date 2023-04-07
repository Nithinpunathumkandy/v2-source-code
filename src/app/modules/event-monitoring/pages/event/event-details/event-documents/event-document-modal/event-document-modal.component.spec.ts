import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDocumentModalComponent } from './event-document-modal.component';

describe('EventDocumentModalComponent', () => {
  let component: EventDocumentModalComponent;
  let fixture: ComponentFixture<EventDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDocumentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
