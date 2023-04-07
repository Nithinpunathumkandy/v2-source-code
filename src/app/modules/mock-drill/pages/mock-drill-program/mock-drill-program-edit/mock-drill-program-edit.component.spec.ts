import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillProgramEditComponent } from './mock-drill-program-edit.component';

describe('MockDrillProgramEditComponent', () => {
  let component: MockDrillProgramEditComponent;
  let fixture: ComponentFixture<MockDrillProgramEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillProgramEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillProgramEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
