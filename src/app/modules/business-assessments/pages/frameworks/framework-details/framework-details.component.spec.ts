import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworkDetailsComponent } from './framework-details.component';

describe('FrameworkDetailsComponent', () => {
  let component: FrameworkDetailsComponent;
  let fixture: ComponentFixture<FrameworkDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameworkDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
