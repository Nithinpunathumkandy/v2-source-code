import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillResponseServiceComponent } from './mock-drill-response-service.component';

describe('MockDrillResponseServiceComponent', () => {
  let component: MockDrillResponseServiceComponent;
  let fixture: ComponentFixture<MockDrillResponseServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillResponseServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillResponseServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
