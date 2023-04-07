import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillProgramStatusComponent } from './mock-drill-program-status.component';

describe('MockDrillProgramStatusComponent', () => {
  let component: MockDrillProgramStatusComponent;
  let fixture: ComponentFixture<MockDrillProgramStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillProgramStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillProgramStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
