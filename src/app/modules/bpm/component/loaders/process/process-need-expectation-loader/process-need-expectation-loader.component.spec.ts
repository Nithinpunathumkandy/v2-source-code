import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessNeedExpectationLoaderComponent } from './process-need-expectation-loader.component';

describe('ProcessNeedExpectationLoaderComponent', () => {
  let component: ProcessNeedExpectationLoaderComponent;
  let fixture: ComponentFixture<ProcessNeedExpectationLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessNeedExpectationLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessNeedExpectationLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
