import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from 'firebase/remote-config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  private remoteConfig;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.remoteConfig = getRemoteConfig(app);

    this.remoteConfig.settings.minimumFetchIntervalMillis = 60000;
  }

  async loadConfig() {
    try {
      await fetchAndActivate(this.remoteConfig);
    } catch (error) {
      console.error('Error loading remote config', error);
    }
  }

  isFeatureEnabled(key: string): boolean {
    return getValue(this.remoteConfig, key).asBoolean();
  }
}
