import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiskMappingKhComponent } from './add-risk-mapping-kh.component';

describe('AddRiskMappingKhComponent', () => {
  let component: AddRiskMappingKhComponent;
  let fixture: ComponentFixture<AddRiskMappingKhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRiskMappingKhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRiskMappingKhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
