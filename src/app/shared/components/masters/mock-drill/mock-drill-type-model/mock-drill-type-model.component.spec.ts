import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillTypeModelComponent } from './mock-drill-type-model.component';

describe('MockDrillTypeModelComponent', () => {
  let component: MockDrillTypeModelComponent;
  let fixture: ComponentFixture<MockDrillTypeModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillTypeModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillTypeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
