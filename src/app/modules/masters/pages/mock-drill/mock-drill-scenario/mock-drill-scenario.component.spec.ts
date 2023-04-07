import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillScenarioComponent } from './mock-drill-scenario.component';

describe('MockDrillScenarioComponent', () => {
  let component: MockDrillScenarioComponent;
  let fixture: ComponentFixture<MockDrillScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillScenarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
