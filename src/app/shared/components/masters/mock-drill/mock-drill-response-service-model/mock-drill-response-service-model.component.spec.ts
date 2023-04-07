import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillResponseServiceModelComponent } from './mock-drill-response-service-model.component';

describe('MockDrillResponceServiceModelComponent', () => {
  let component: MockDrillResponseServiceModelComponent;
  let fixture: ComponentFixture<MockDrillResponseServiceModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockDrillResponseServiceModelComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillResponseServiceModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
