import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDocumentsComponent } from './event-documents.component';

describe('EventDocumentsComponent', () => {
  let component: EventDocumentsComponent;
  let fixture: ComponentFixture<EventDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
