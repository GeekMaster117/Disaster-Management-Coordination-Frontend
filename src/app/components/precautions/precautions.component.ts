import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VIDEO_URLS } from './video-urls';  // Adjust the path as needed
import { DISASTER_INFO } from './dos-donts';

@Component({
  selector: 'app-precautions',
  templateUrl: './precautions.component.html',
  styleUrls: ['./precautions.component.css']
})
export class PrecautionsComponent implements OnInit {
  disasters: DisasterType[] = ['Floods', 'Landslides', 'Cyclones', 'Tsunamis', 'Earthquake'];
  selectedDisaster: DisasterType | null = null;
  dos: string[] = [];
  donts: string[] = [];
  beforeMeasures: string[] = [];
  afterMeasures: string[] = [];
  videos: { url: SafeResourceUrl, title: string }[] = [];
  currentPage: number = 1;
  maxPage: number = 2;  // Two pages for dos & donts and before & after measures

  private videoUrls = VIDEO_URLS;  // Use the imported video URLs
  private dosDonts = DISASTER_INFO;  // Use the imported Dos and Don'ts

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
    const { dos, donts, beforeMeasures, afterMeasures } = this.dosDonts[disaster] || { dos: [], donts: [], beforeMeasures: [], afterMeasures: [] };
    this.dos = dos;
    this.donts = donts;
    this.beforeMeasures = beforeMeasures;
    this.afterMeasures = afterMeasures;
  }

  updateVideos(disaster: DisasterType) {
    this.videos = (this.videoUrls[disaster] || []).map(video => ({
      url: this.sanitizer.bypassSecurityTrustResourceUrl(video.url),
      title: video.title
    }));
  }

  changePage(direction: number) {
    const newPage = this.currentPage + direction;
    if (newPage >= 1 && newPage <= this.maxPage) {
      this.currentPage = newPage;
    }
  }
}

type DisasterType = 'Floods' | 'Landslides' | 'Cyclones' | 'Tsunamis' | 'Earthquake';
