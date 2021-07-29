import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnitureEditModalWindowComponent } from './furniture-edit-modal-window.component';

describe('FurnitureEditModalWindowComponent', () => {
  let component: FurnitureEditModalWindowComponent;
  let fixture: ComponentFixture<FurnitureEditModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FurnitureEditModalWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FurnitureEditModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
