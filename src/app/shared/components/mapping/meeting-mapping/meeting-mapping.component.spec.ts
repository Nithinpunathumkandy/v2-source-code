import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingMappingComponent } from './meeting-mapping.component';

describe('MeetingMappingComponent', () => {
  let component: MeetingMappingComponent;
  let fixture: ComponentFixture<MeetingMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
