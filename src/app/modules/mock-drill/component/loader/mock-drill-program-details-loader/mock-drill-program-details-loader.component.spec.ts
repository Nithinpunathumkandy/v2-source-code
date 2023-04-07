import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillProgramDetailsLoaderComponent } from './mock-drill-program-details-loader.component';

describe('MockDrillProgramDetailsLoaderComponent', () => {
  let component: MockDrillProgramDetailsLoaderComponent;
  let fixture: ComponentFixture<MockDrillProgramDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillProgramDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillProgramDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
