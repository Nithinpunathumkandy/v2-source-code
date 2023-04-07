import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationProgressUpdateComponent } from './investigation-progress-update.component';

describe('InvestigationProgressUpdateComponent', () => {
  let component: InvestigationProgressUpdateComponent;
  let fixture: ComponentFixture<InvestigationProgressUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationProgressUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationProgressUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
