import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaProcessesComponent } from './bia-processes.component';

describe('BiaProcessesComponent', () => {
  let component: BiaProcessesComponent;
  let fixture: ComponentFixture<BiaProcessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaProcessesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
