import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillProgramInfoComponent } from './mock-drill-program-info.component';

describe('MockDrillProgramInfoComponent', () => {
  let component: MockDrillProgramInfoComponent;
  let fixture: ComponentFixture<MockDrillProgramInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillProgramInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillProgramInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
