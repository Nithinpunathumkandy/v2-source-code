import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfluenceModalComponent } from './event-influence-modal.component';

describe('EventInfluenceModalComponent', () => {
  let component: EventInfluenceModalComponent;
  let fixture: ComponentFixture<EventInfluenceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventInfluenceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventInfluenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
