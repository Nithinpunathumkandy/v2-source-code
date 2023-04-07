import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInfoLoaderComponent } from './process-info-loader.component';

describe('ProcessInfoLoaderComponent', () => {
  let component: ProcessInfoLoaderComponent;
  let fixture: ComponentFixture<ProcessInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
