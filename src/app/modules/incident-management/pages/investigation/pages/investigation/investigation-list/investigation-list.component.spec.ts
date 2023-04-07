import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationListComponent } from './investigation-list.component';

describe('InvestigationListComponent', () => {
  let component: InvestigationListComponent;
  let fixture: ComponentFixture<InvestigationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
