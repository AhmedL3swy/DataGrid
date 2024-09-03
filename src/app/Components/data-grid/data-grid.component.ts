import { Component, Input } from '@angular/core';
import { DataGridConfig } from '../../types/data-grid-config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaxPaginatorDirective } from '../../customeDirectives/int-in-range.directive';
@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule,MaxPaginatorDirective],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss',
})
export class DataGridComponent {
next() {
 
  this.currentPage+=1;
  this.Paginate();
}
prev() {
  this.currentPage -= 1;
  this.Paginate();

}
  @Input() GridConfig!: DataGridConfig;
  //region Pagination
  PagintedData: any;
  currentPage: number = 1;
  pageSize: number = 10;
  maxPage: number = 1;
  //endregion
  //NgOnInit
  ngOnInit(): void {

    this.maxPage=Math.ceil(this.GridConfig.data.length/this.pageSize);
    this.PagintedData = this.GridConfig.data.slice(
      this.currentPage - 1,
      this.pageSize
    );
    
  }
  Paginate(): void {
    this.PagintedData = this.GridConfig.data.slice(
      (this.currentPage - 1) * this.pageSize,
      this.pageSize * this.currentPage
    );}
   ChangePageSize():void{
    this.maxPage=Math.ceil(this.GridConfig.data.length/this.pageSize);
    this.Paginate()
   }
   ChangeCurrentPage():void{
      if(this.currentPage>this.maxPage)
      {
        this.currentPage=this.maxPage;
        this.Paginate();

      }
      // handle if negative using elseif
      else if(this.currentPage<1)
      {
        this.currentPage=1;
        this.Paginate();

      }  
      else
      {
        this.Paginate();
      }
   }

 }

