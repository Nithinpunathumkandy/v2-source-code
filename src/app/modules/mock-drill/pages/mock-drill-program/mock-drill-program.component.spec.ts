import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillProgramComponent } from './mock-drill-program.component';

describe('MockDrillProgramComponent', () => {
  let component: MockDrillProgramComponent;
  let fixture: ComponentFixture<MockDrillProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillProgramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
