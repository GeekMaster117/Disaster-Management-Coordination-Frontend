import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-precautions',
  templateUrl: './precautions.component.html',
  styleUrl: './precautions.component.css'
})
export class PrecautionsComponent implements OnInit {
  disasters: DisasterType[] = ['Floods', 'Landslides', 'Cyclones', 'Tsunamis', 'Bio Hazards'];
  selectedDisaster: DisasterType | null = null;
  dos: string[] = [];
  donts: string[] = [];
  videos: { url: SafeResourceUrl, title: string }[] = [];

  private videoUrls: { [key in DisasterType]: { url: string, title: string }[] } = {
    'Floods': [
      { url: 'https://www.youtube.com/embed/CxOii3s8TVg', title: 'How to Prepare for Floods' },
      { url: 'https://www.youtube.com/embed/yb39Kq2ep4k', title: 'Flood Safety Tips' },
      { url: 'https://www.youtube.com/embed/ujRX2kPY-Zw', title: 'Flood Warning Systems' },
      { url: 'https://www.youtube.com/embed/5_4dHYi1lK4', title: 'Flood Recovery Tips' }
    ],
    'Landslides': [
      { url: 'https://www.youtube.com/embed/1pJ1ZcK-rE0', title: 'Understanding Landslides' },
      { url: 'https://www.youtube.com/embed/8Lo_5zwcoQw', title: 'Landslide Safety Tips' },
      { url: 'https://www.youtube.com/embed/6n8YJK2qP2A', title: 'Landslide Early Warning' },
      { url: 'https://www.youtube.com/embed/9Rb-iB3LRjQ', title: 'Post-Landslide Recovery' }
    ],
    'Cyclones': [
      { url: 'https://www.youtube.com/embed/19T6A72cyxE', title: 'Cyclone Safety Measures' },
      { url: 'https://www.youtube.com/embed/ybEAVP5avTk', title: 'Cyclone Preparedness' },
      { url: 'https://www.youtube.com/embed/E_4SoAq8Y3s', title: 'Cyclone Damage Assessment' },
      { url: 'https://www.youtube.com/embed/IvNh2T7xTNU', title: 'Cyclone Recovery Guide' }
    ],
    'Tsunamis': [
      { url: 'https://www.youtube.com/embed/FWv_sESFLrw', title: 'Tsunami Awareness' },
      { url: 'https://www.youtube.com/embed/EjKJtReF9Vw', title: 'How to Survive a Tsunami' },
      { url: 'https://www.youtube.com/embed/tj2Nq6xX8sI', title: 'Tsunami Warning Systems' },
      { url: 'https://www.youtube.com/embed/l6mFgr5xWks', title: 'Post-Tsunami Recovery' }
    ],
    'Bio Hazards': [
      { url: 'https://www.youtube.com/embed/UnHzbEjG3WQ', title: 'Bio Hazard Safety' },
      { url: 'https://www.youtube.com/embed/8r6xd-mMi7c', title: 'Protecting Yourself from Bio Hazards' },
      { url: 'https://www.youtube.com/embed/GNcR5jDffoY', title: 'Bio Hazard Cleanup Procedures' },
      { url: 'https://www.youtube.com/embed/X-8H2kZxvTk', title: 'Dealing with Contamination' }
    ]
  };

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Select the first disaster by default
    if (this.disasters.length > 0) {
      this.onSelectDisaster(this.disasters[0]);
    }
  }

  onSelectDisaster(disaster: DisasterType) {
    this.selectedDisaster = disaster;
    this.updateDosDonts(disaster);
    this.updateVideos(disaster);
  }

  updateDosDonts(disaster: DisasterType) {
    switch (disaster) {
      case 'Floods':
        this.dos = ['Move to higher ground', 'Stay away from floodwaters'];
        this.donts = ['Don’t drive through flooded areas', 'Avoid contact with floodwater'];
        break;
      case 'Landslides':
        this.dos = ['Evacuate immediately', 'Stay alert for landslide warnings'];
        this.donts = ['Don’t stay in unstable areas', 'Avoid heavy rainfall areas'];
        break;
      case 'Cyclones':
        this.dos = ['Seek shelter in a safe building', 'Stay indoors during the cyclone'];
        this.donts = ['Don’t go outside during the storm', 'Avoid using electrical appliances'];
        break;
      case 'Tsunamis':
        this.dos = ['Move to higher ground', 'Follow evacuation orders'];
        this.donts = ['Don’t stay in low-lying areas', 'Avoid returning until it’s safe'];
        break;
      case 'Bio Hazards':
        this.dos = ['Follow safety protocols', 'Wear protective gear'];
        this.donts = ['Don’t come into contact with hazardous materials', 'Avoid contaminated areas'];
        break;
      default:
        this.dos = [];
        this.donts = [];
        break;
    }
  }

  updateVideos(disaster: DisasterType) {
    this.videos = (this.videoUrls[disaster] || []).map(video => ({
      url: this.sanitizer.bypassSecurityTrustResourceUrl(video.url),
      title: video.title
    }));
  }
}
type DisasterType = 'Floods' | 'Landslides' | 'Cyclones' | 'Tsunamis' | 'Bio Hazards';
