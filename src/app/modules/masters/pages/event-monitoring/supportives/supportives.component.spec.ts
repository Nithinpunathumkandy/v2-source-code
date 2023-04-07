import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportivesComponent } from './supportives.component';

describe('SupportivesComponent', () => {
  let component: SupportivesComponent;
  let fixture: ComponentFixture<SupportivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
