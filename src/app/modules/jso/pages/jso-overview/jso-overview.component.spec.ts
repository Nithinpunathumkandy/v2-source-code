import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoOverviewComponent } from './jso-overview.component';

describe('JsoOverviewComponent', () => {
  let component: JsoOverviewComponent;
  let fixture: ComponentFixture<JsoOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
