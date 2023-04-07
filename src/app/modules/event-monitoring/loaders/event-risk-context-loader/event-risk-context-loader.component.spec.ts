import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRiskContextLoaderComponent } from './event-risk-context-loader.component';

describe('EventRiskContextLoaderComponent', () => {
  let component: EventRiskContextLoaderComponent;
  let fixture: ComponentFixture<EventRiskContextLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRiskContextLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRiskContextLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
