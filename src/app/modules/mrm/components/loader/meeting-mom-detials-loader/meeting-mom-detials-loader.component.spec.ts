import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingMomDetialsLoaderComponent } from './meeting-mom-detials-loader.component';

describe('MeetingMomDetialsLoaderComponent', () => {
  let component: MeetingMomDetialsLoaderComponent;
  let fixture: ComponentFixture<MeetingMomDetialsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingMomDetialsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingMomDetialsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
