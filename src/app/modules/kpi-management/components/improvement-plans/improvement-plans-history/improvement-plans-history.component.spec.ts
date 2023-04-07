import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementPlansHistoryComponent } from './improvement-plans-history.component';

describe('ImprovementPlansHistoryComponent', () => {
  let component: ImprovementPlansHistoryComponent;
  let fixture: ComponentFixture<ImprovementPlansHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementPlansHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementPlansHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
