import { NavigationService } from './../../Services/navigation.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [],
  templateUrl: './empty.component.html',
  styleUrl: './empty.component.scss'
})
export class EmptyComponent {
navigateBack() {

    this.NavigationService.navigateTo('grid');
  }
  constructor(
   private NavigationService: NavigationService
  ) { }

}
