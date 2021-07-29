import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { of, pipe, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FurnitureEditModalWindowComponent } from '../furniture-edit-modal-window/furniture-edit-modal-window.component';
import { Category } from '../Models/Category';
import { Furniture } from '../Models/Furniture';
import { CategoryService } from '../Services/category.service';
import { FurnitureService } from '../Services/furniture.service';


@Component({
  selector: 'app-furniture-table',
  templateUrl: './furniture-table.component.html',
  styleUrls: ['./furniture-table.component.css']
})
export class FurnitureTableComponent implements OnInit {

  displayedColumns = ['Title', 'Description', 'Category', 'actions'];
  dataSource: MatTableDataSource<Furniture>;
  furnitureCollection: Furniture[] = [];
  categories: Array<Category> = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageEvent: PageEvent;
  // MatPaginator Inputs
  length = 5;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  // MatPaginator Output
  constructor(
    private furnitureService: FurnitureService,
    private categoryService: CategoryService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,) {
  }
  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.furnitureService.getAll(this.pageSize, 0).pipe(
      catchError(error => {
        this._snackBar.open("Error getting data", 'Close');
        return throwError(error);
      })
    )
    .subscribe(response => {
      this.furnitureCollection = response.furniture;
      this.length = response.total;
      this.dataSource = new MatTableDataSource(this.furnitureCollection);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.categoryService.getAllCategories().pipe(
      catchError(error => {
        this._snackBar.open("Error getting categories", 'Close');
        return throwError(error);
      })
    ).subscribe(
        x => {
          this.categories = x;
        }
    );
  }

  changePage(pageEvent: PageEvent){
    this.furnitureService.getAll(pageEvent.pageSize, pageEvent.pageIndex * pageEvent.pageSize).subscribe(response => {
      this.furnitureCollection.push(...response.furniture);
      this.furnitureCollection.length = response.total;
      this.dataSource = new MatTableDataSource<any>(this.furnitureCollection);
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator
    });

  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(FurnitureEditModalWindowComponent, {
      width: '300px',
      height: '400px',
      data: {
        categories: this.categories,
        furniture: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.furnitureService.getAll(this.pageSize, 0)
        .pipe(
          catchError(error => {
            this._snackBar.open("Error getting data", 'Close');
            return throwError(error);
          })
        ).subscribe(response => {
          this.furnitureCollection = response.furniture;
          this.length = response.total;
          this.dataSource = new MatTableDataSource(this.furnitureCollection);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    });
  }

  openEditDialog(furniture: Furniture): void{
    console.log(furniture);
    const dialogRef = this.dialog.open(FurnitureEditModalWindowComponent, {
      width: '300px',
      height: '400px',
      data: {
        categories: this.categories,
        furniture: furniture,
        isModify: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.furnitureService.getAll(this.paginator.pageSize, this.paginator.pageIndex * this.paginator.pageSize)
      .pipe(
        catchError(error => {
          this._snackBar.open("Error getting data", 'Close');
          return throwError(error);
        })
      ).subscribe(response => {
        this.furnitureCollection = response.furniture;
        this.length = response.total;
        this.dataSource = new MatTableDataSource(this.furnitureCollection);
      });
    });
  }

  deleteFurniture(furniture: Furniture){
    console.log(furniture);
    this.furnitureService.delete(furniture.id)
      .pipe(
        catchError(error => {
          this._snackBar.open("Error delete furniture", 'Close');
          return throwError(error);
        })
      ).subscribe(
        x => {
          let index = this.furnitureCollection.findIndex(x => x.id = furniture.id);
          this.furnitureCollection.splice(index,1);
          this.dataSource.data = this.furnitureCollection;
        },
        error => console.log('HTTP Error', error)
      );
  }

  getCategoryTitle(categoryId: string): string{
    if(this.categories){
      let result = this.categories.find(item => item.id === categoryId);
      if(result){
        return result.title
      }
    }
    return 'unknow';

  }

}
