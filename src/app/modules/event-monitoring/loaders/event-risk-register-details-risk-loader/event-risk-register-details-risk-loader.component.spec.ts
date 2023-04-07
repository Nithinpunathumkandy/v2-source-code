import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRiskRegisterDetailsRiskLoaderComponent } from './event-risk-register-details-risk-loader.component';

describe('EventRiskRegisterDetailsRiskLoaderComponent', () => {
  let component: EventRiskRegisterDetailsRiskLoaderComponent;
  let fixture: ComponentFixture<EventRiskRegisterDetailsRiskLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRiskRegisterDetailsRiskLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRiskRegisterDetailsRiskLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
