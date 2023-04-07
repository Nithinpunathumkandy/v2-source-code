import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidualHiraComponent } from './residual-hira.component';

describe('ResidualHiraComponent', () => {
  let component: ResidualHiraComponent;
  let fixture: ComponentFixture<ResidualHiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidualHiraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidualHiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
