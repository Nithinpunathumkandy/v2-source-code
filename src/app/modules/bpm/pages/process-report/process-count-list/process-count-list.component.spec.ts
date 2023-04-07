import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCountListComponent } from './process-count-list.component';

describe('ProcessCountListComponent', () => {
  let component: ProcessCountListComponent;
  let fixture: ComponentFixture<ProcessCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
