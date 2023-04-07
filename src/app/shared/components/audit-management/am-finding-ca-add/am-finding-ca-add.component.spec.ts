import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmFindingCaAddComponent } from './am-finding-ca-add.component';

describe('AmFindingCaAddComponent', () => {
  let component: AmFindingCaAddComponent;
  let fixture: ComponentFixture<AmFindingCaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmFindingCaAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmFindingCaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
