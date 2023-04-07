import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingDocumentsComponent } from './meeting-documents.component';

describe('MeetingDocumentsComponent', () => {
  let component: MeetingDocumentsComponent;
  let fixture: ComponentFixture<MeetingDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
