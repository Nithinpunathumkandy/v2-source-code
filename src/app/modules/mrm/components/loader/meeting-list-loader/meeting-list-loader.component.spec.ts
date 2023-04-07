import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingListLoaderComponent } from './meeting-list-loader.component';

describe('MeetingListLoaderComponent', () => {
  let component: MeetingListLoaderComponent;
  let fixture: ComponentFixture<MeetingListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
