import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  features = [
    {
      title: 'Real time Map',
      description: 'Integrates a comprehensive Open API map to visualize and interact with various geographical data.',
      image: 'https://www.avalon-routing.com/wp-content/uploads/2017/07/ww-map.jpg' // Path to your image
    },
    {
      title: 'Refugee Camps Locator',
      description: 'Shows nearby refugee camps and provides the path to the nearest one for ease of access.',
      image: 'https://www.arcgis.com/sharing/rest/content/items/4cb04704d4b440b5b46e4e73ba341726/info/thumbnail/ago_downloaded.png?w=800' // Path to your image
    },
    {
      title: 'Dos and Don\'ts',
      description: 'Provides essential dos and don\'ts during any disaster to ensure safety and preparedness.',
      image: 'https://www.oflox.com/blog/wp-content/uploads/2021/11/Dos-and-donts-for-a-successful-training-program.png' // Path to your image
    },
    {
      title: 'Instructional Videos',
      description: 'Offers video instructions for better understanding of disaster management and safety measures.',
      image: 'https://www.picserver.org/highway-signs2/images/instructions.jpg' // Path to your image
    }
  ];
}
