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
  @Input() paginationOptions!: number[];
  @Input() resetFlag!: boolean;
  @Output() paginationChange = new EventEmitter<{
    limit: number;
    skip: number;
  }>();
  constructor(private dataGridService: DataGridService) {}
  currentPage: number = 1;
  pageSize: number = 5;
  ngOnInit(): void {
    this.pageSize = this.paginationOptions[0];
    this.emitPagination();
    this.dataGridService.resetPagSignal.subscribe((value: boolean) => {
      if (value) {
        this.currentPage = 1;
      }
    });
  }
  ngOnChanges() {
    if (this.resetFlag) {
      this.currentPage = 1;
    }
    this.emitPagination();
  }
  // Calculate the maximum number of pages
  get maxPage(): number {
    return Math.ceil(this.total / this.pageSize);
  }
  get CurrentPage(): number {
    if (this.resetFlag && this.currentPage != 1) {
      this.currentPage = 1;
    }
    return this.currentPage;
  }
  // Emit the current limit and skip values
  private emitPagination(): void {
    const skip = (this.currentPage - 1) * this.pageSize;
    const limit = this.pageSize;
    this.paginationChange.emit({ limit, skip });
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
    this.dataGridService.emitResetPagSingal();
    this.emitPagination();
  }
}
