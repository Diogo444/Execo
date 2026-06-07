import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type ActionButton = {
  label: string;
  icon: string;
  variant: 'filled' | 'raised' | 'outlined' | 'soft';
  size: 'standard' | 'wide' | 'tall' | 'compact';
  id: string;
};

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Execo');
  protected api: string = 'http://localhost:3000/api';
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }


  protected readonly actionButtons: ActionButton[] = [
    { label: 'Bouton 01', icon: 'radio_button_checked', variant: 'filled', size: 'wide', id: 'button-01' },
    { label: 'Bouton 02', icon: 'favorite', variant: 'raised', size: 'standard', id: 'button-02' },
    { label: 'Bouton 03', icon: 'bolt', variant: 'soft', size: 'standard', id: 'button-03' },
    { label: 'Bouton 04', icon: 'auto_awesome', variant: 'outlined', size: 'compact', id: 'button-04' },
    { label: 'Bouton 05', icon: 'star', variant: 'soft', size: 'tall', id: 'button-05' },
    { label: 'Bouton 06', icon: 'palette', variant: 'filled', size: 'standard', id: 'button-06' },
    { label: 'Bouton 07', icon: 'layers', variant: 'outlined', size: 'standard', id: 'button-07' },
    { label: 'Bouton 08', icon: 'widgets', variant: 'raised', size: 'wide', id: 'button-08' },
    { label: 'Bouton 09', icon: 'rocket_launch', variant: 'soft', size: 'standard', id: 'button-09' },
    { label: 'Bouton 10', icon: 'verified', variant: 'outlined', size: 'standard', id: 'button-10' },
    { label: 'Bouton 11', icon: 'tune', variant: 'filled', size: 'compact', id: 'button-11' },
    { label: 'Bouton 12', icon: 'workspace_premium', variant: 'raised', size: 'tall', id: 'button-12' },
    { label: 'Bouton 13', icon: 'gesture', variant: 'outlined', size: 'standard', id: 'button-13' },
    { label: 'Bouton 14', icon: 'extension', variant: 'soft', size: 'wide', id: 'button-14' },
    { label: 'Bouton 15', icon: 'hub', variant: 'filled', size: 'standard', id: 'button-15' },
    { label: 'Bouton 16', icon: 'diamond', variant: 'raised', size: 'compact', id: 'button-16' },
  ];

  protected runLater(action: ActionButton): void {
    console.info(`${action.label} sera branche plus tard.`);
    this.http.post(`${this.api}/action`, { actionName: action.id }).subscribe({
      next: (response) => console.log('Action enregistrée:', response),
      error: (error) => console.error('Erreur lors de l\'enregistrement de l\'action:', error)
    });
  }
}
