import { DataGridService } from './../../Services/data-grid.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  standalone: true,
  styleUrls: ['./paginator.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class PaginatorComponent {
  @Input() total: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 5;
  @Input() paginationOptions!: number[];
  @Output() paginationChange = new EventEmitter<{
    pageNumber: number;
    pageSize: number;
  }>();
  constructor(private dataGridService: DataGridService) {}
 
  ngOnInit(): void {
    this.pageSize = this.paginationOptions[0];
    this.emitPagination();
  }
  ngOnChanges() {
  
  }
  // Calculate the maximum number of pages
  get maxPage(): number {
    return Math.ceil(this.total / this.pageSize);
  }
  
  // Emit the current limit and skip values
  private emitPagination(): void {
    this.paginationChange.emit({
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
    });
  }

  onPrev(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitPagination();
    }
  }

  onNext(): void {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
      this.emitPagination();
    }
  }

  onPageChange(event: any): void {
    const page = event.target.value;
    if (page >= 1 && page <= this.maxPage) {
      this.currentPage = page;
      this.emitPagination();
    } else if (page < 1) {
      this.currentPage = 1;
      this.emitPagination();
    } else {
      this.currentPage = this.maxPage;
      this.emitPagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.emitPagination();
  }
}
