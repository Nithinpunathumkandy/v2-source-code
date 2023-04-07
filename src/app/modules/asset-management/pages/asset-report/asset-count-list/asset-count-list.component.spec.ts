import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCountListComponent } from './asset-count-list.component';

describe('AssetCountListComponent', () => {
  let component: AssetCountListComponent;
  let fixture: ComponentFixture<AssetCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
