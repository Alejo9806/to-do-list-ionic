import { Component, OnInit, inject } from '@angular/core';
import { FeatureFlagService } from './services/feature-flag.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private featureFlagService = inject(FeatureFlagService);

  async ngOnInit() {
    await this.featureFlagService.loadConfig();
  }
}
