import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLogDetailsComponent } from './system-log-details.component';

describe('SystemLogDetailsComponent', () => {
  let component: SystemLogDetailsComponent;
  let fixture: ComponentFixture<SystemLogDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemLogDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
