import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsMastersComponent } from './isms-masters.component';

describe('IsmsMastersComponent', () => {
  let component: IsmsMastersComponent;
  let fixture: ComponentFixture<IsmsMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsMastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
