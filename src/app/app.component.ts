import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BingoClient';
  isDevelopment = !environment.production;
  isOfflineMode = environment.enableStubLogin;
}
