import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsClauseLoopComponent } from './ms-clause-loop.component';

describe('MsClauseLoopComponent', () => {
  let component: MsClauseLoopComponent;
  let fixture: ComponentFixture<MsClauseLoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsClauseLoopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsClauseLoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
