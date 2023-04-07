import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRiskMappingLoaderComponent } from './event-risk-mapping-loader.component';

describe('EventRiskMappingLoaderComponent', () => {
  let component: EventRiskMappingLoaderComponent;
  let fixture: ComponentFixture<EventRiskMappingLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRiskMappingLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRiskMappingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
