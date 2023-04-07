import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalAditMastersComponent } from './internal-adit-masters.component';

describe('InternalAditMastersComponent', () => {
  let component: InternalAditMastersComponent;
  let fixture: ComponentFixture<InternalAditMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalAditMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalAditMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
