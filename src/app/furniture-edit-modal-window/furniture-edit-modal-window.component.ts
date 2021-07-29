import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../Models/Category';
import { Furniture } from '../Models/Furniture';
import { FurnitureService } from '../Services/furniture.service';

@Component({
  selector: 'app-furniture-edit-modal-window',
  templateUrl: './furniture-edit-modal-window.component.html',
  styleUrls: ['./furniture-edit-modal-window.component.css']
})
export class FurnitureEditModalWindowComponent implements OnInit {

  furnitureForm = this.fb.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    description: ['']
  });

  categories: Array<Category>;
  furniture: Furniture;
  isModify: Boolean = false;

  constructor(
    private fb: FormBuilder,
    private furnitureService: FurnitureService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FurnitureEditModalWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData) {
      this.categories = data.categories;
      this.furniture = data.furniture;
      if(data.isModify){
        this.isModify = data.isModify;
        let category = this.categories.find(c => c.id === this.furniture.categoryId);
        this.furnitureForm.setValue({
          title: this.furniture.title,
          description: this.furniture.description,
          category: category?.id
       });
      }

  }

  ngOnInit(): void {
  }

  onSaveClick(){
    console.log('SAVE');
    if (!this.furnitureForm.valid) {
      return;
    }
    if(!this.furniture){
      this.furniture = {
        id: '',
        title: this.furnitureForm.controls['title'].value,
        description: this.furnitureForm.controls['description'].value,
        categoryId:  this.furnitureForm.controls['category'].value
      };
    }
    this.furniture.title = this.furnitureForm.controls['title'].value;
    this.furniture.description = this.furnitureForm.controls['description'].value;
    this.furniture.categoryId = this.furnitureForm.controls['category'].value;
    if(this.isModify){
      this.furnitureService.update(this.furniture)
      .pipe(
        catchError(error => {
          this._snackBar.open("Error save data", 'Close');
          return throwError(error);
        })
      ).subscribe(response => {
        this.furniture.id = response;
      });
    } else{
      this.furnitureService.create(this.furniture)
      .pipe(
        catchError(error => {
          this._snackBar.open("Error save data", 'Close');
          return throwError(error);
        })
      ).subscribe();
    }
    this.dialogRef.close();

  }

  onCancelClick(){
    this.dialogRef.close();
  }

}

interface ModalData{
  furniture: Furniture;
  categories: Array<Category>;
  isModify: Boolean;
}
