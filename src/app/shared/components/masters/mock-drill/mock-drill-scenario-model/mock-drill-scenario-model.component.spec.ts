import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillScenarioModelComponent } from './mock-drill-scenario-model.component';

describe('MockDrillScenarioModelComponent', () => {
  let component: MockDrillScenarioModelComponent;
  let fixture: ComponentFixture<MockDrillScenarioModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillScenarioModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillScenarioModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
