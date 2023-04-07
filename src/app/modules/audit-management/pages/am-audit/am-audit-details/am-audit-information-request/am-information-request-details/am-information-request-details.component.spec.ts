import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmInformationRequestDetailsComponent } from './am-information-request-details.component';

describe('AmInformationRequestDetailsComponent', () => {
  let component: AmInformationRequestDetailsComponent;
  let fixture: ComponentFixture<AmInformationRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmInformationRequestDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmInformationRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
