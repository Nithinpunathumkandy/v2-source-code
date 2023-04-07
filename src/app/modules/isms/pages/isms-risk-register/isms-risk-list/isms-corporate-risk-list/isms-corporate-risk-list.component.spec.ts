import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsCorporateRiskListComponent } from './isms-corporate-risk-list.component';

describe('IsmsCorporateRiskListComponent', () => {
  let component: IsmsCorporateRiskListComponent;
  let fixture: ComponentFixture<IsmsCorporateRiskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsCorporateRiskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsCorporateRiskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
