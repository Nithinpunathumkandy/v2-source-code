import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogDetailsComponentComponent } from './log-details-component.component';

describe('LogDetailsComponentComponent', () => {
  let component: LogDetailsComponentComponent;
  let fixture: ComponentFixture<LogDetailsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogDetailsComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogDetailsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
