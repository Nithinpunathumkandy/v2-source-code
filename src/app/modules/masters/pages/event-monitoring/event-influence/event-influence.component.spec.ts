import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfluenceComponent } from './event-influence.component';

describe('EventInfluenceComponent', () => {
  let component: EventInfluenceComponent;
  let fixture: ComponentFixture<EventInfluenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventInfluenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventInfluenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
