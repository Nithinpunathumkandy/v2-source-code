import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillProgramListComponent } from './mock-drill-program-list.component';

describe('MockDrillProgramListComponent', () => {
  let component: MockDrillProgramListComponent;
  let fixture: ComponentFixture<MockDrillProgramListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillProgramListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
