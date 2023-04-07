import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventChangeRequestComponent } from './create-event-change-request.component';

describe('CreateEventChangeRequestComponent', () => {
  let component: CreateEventChangeRequestComponent;
  let fixture: ComponentFixture<CreateEventChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEventChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
