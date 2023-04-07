import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactAreaNewComponent } from './impact-area-new.component';

describe('ImpactAreaNewComponent', () => {
  let component: ImpactAreaNewComponent;
  let fixture: ComponentFixture<ImpactAreaNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpactAreaNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactAreaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
