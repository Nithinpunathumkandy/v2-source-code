import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationDetailComponent } from './investigation-detail.component';

describe('InvestigationDetailComponent', () => {
  let component: InvestigationDetailComponent;
  let fixture: ComponentFixture<InvestigationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
