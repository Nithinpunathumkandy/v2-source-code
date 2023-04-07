import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationDetailsLoaderComponent } from './investigation-details-loader.component';

describe('InvestigationDetailsLoaderComponent', () => {
  let component: InvestigationDetailsLoaderComponent;
  let fixture: ComponentFixture<InvestigationDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
