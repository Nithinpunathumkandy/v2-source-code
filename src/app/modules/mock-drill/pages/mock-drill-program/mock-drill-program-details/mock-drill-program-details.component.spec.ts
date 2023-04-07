import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillProgramDetailsComponent } from './mock-drill-program-details.component';

describe('MockDrillProgramDetailsComponent', () => {
  let component: MockDrillProgramDetailsComponent;
  let fixture: ComponentFixture<MockDrillProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillProgramDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
