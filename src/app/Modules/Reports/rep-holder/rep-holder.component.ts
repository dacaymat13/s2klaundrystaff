import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RepIncomeComponent } from '../rep-income/rep-income.component';
import { RepExpenseComponent } from '../rep-expense/rep-expense.component';
import { RepRemitComponent } from '../rep-remit/rep-remit.component';
import $ from 'jquery';

@Component({
  selector: 'app-rep-holder',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, RepIncomeComponent, RepExpenseComponent, RepRemitComponent],
  templateUrl: './rep-holder.component.html',
  styleUrl: './rep-holder.component.css'
})
export class RepHolderComponent implements OnInit{
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

      // $content = $($active[0].hash as string);

      $links.not($active).each(function() {
        // TypeScript fix for the hash issue
        const linkElement = this as HTMLAnchorElement;
        $(linkElement.hash).hide();
      });

      $(this).on('click', 'a', function(e: JQuery.Event) {
        e.preventDefault();

        $active.removeClass('active');
        $content.hide();

        // TypeScript fix for the hash issue
        const anchorElement = this as HTMLAnchorElement;

        $active = $(this);
        $content = $(anchorElement.hash);

        $active.addClass('active');
        $content.show();
      });
    });
  }
}
