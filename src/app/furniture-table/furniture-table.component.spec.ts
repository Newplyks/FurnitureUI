import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnitureTableComponent } from './furniture-table.component';

describe('FurnitureTableComponent', () => {
  let component: FurnitureTableComponent;
  let fixture: ComponentFixture<FurnitureTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FurnitureTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FurnitureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
