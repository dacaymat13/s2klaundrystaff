import { Component, OnInit } from '@angular/core';
import { ReceivingComponent } from '../receiving/receiving.component';
import { ReleasingComponent } from '../releasing/releasing.component';
import $ from 'jquery';

@Component({
  selector: 'app-home-holder',
  standalone: true,
  imports: [ReleasingComponent, ReceivingComponent],
  templateUrl: './home-holder.component.html',
  styleUrl: './home-holder.component.css'
})
export class HomeHolderComponent implements OnInit {
  ngOnInit(): void {
    this.initializeNavigation();
  }

  private initializeNavigation(): void {
    $('nav').each(function() {
      let $active: JQuery<HTMLElement>, $content: JQuery<HTMLElement>;
      const $links: JQuery<HTMLElement> = $(this).find('a');

      $active = $($links.filter(`[href="${location.hash}"]`)[0] || $links[0]);
      $active.addClass('active');

      const activeAnchor = $active[0] as HTMLAnchorElement;
      $content = $(activeAnchor.hash);

      $links.not($active).each(function() {

        const linkElement = this as HTMLAnchorElement;
        $(linkElement.hash).hide();
      });

      $(this).on('click', 'a', function(e: JQuery.Event) {
        e.preventDefault();

        $active.removeClass('active');
        $content.hide();

        const anchorElement = this as HTMLAnchorElement;

        $active = $(this);
        $content = $(anchorElement.hash);

        $active.addClass('active');
        $content.show();
      });
    });
  }
}
