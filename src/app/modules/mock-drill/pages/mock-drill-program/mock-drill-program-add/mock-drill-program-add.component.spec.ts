import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillProgramAddComponent } from './mock-drill-program-add.component';

describe('MockDrillProgramAddComponent', () => {
  let component: MockDrillProgramAddComponent;
  let fixture: ComponentFixture<MockDrillProgramAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillProgramAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillProgramAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
