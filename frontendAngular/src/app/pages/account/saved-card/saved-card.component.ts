import { Component, OnInit } from '@angular/core';
import { SavedCardService } from 'src/app/shared/services/savedCard.service';

@Component({
  selector: 'app-saved-card',
  templateUrl: './saved-card.component.html',
  styleUrls: ['./saved-card.component.scss']
})
export class SavedCardComponent implements OnInit {

  registeredCards = []; 
  selectedCard: any;

  constructor(private savedCardService: SavedCardService) { }

  ngOnInit(): void {
    this.savedCardService.getSavedCards().subscribe(
      (res) => {
        this.registeredCards = res.cards;
      },
      (error) => {
        console.error(error);
      }
    );    
    const storedSelectedCard = localStorage.getItem('selectedCard');
    if (storedSelectedCard) {
      this.selectedCard = JSON.parse(storedSelectedCard);
    }
  }

  saveSelectedCard(card: any) {
    this.selectedCard = card;
    localStorage.setItem('selectedCard', JSON.stringify(card));
  }

}
