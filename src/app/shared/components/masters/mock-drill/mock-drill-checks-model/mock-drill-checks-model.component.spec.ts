import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillChecksModelComponent } from './mock-drill-checks-model.component';

describe('MockDrillChecksModelComponent', () => {
  let component: MockDrillChecksModelComponent;
  let fixture: ComponentFixture<MockDrillChecksModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillChecksModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillChecksModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
