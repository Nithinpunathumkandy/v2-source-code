import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraJourneyComponent } from './hira-journey.component';

describe('HiraJourneyComponent', () => {
  let component: HiraJourneyComponent;
  let fixture: ComponentFixture<HiraJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
