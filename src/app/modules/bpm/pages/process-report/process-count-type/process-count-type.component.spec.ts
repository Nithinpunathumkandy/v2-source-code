import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCountTypeComponent } from './process-count-type.component';

describe('ProcessCountTypeComponent', () => {
  let component: ProcessCountTypeComponent;
  let fixture: ComponentFixture<ProcessCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
