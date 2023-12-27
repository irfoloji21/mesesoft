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
  isModalOpen: boolean = false;
  newCard: any = {
    cardName: '',
    cardNumber: '',
    expirationMonth: '01',
    expirationYear: '2023',
    cvv: '',
    termsCheckbox: true
  };

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

  addNewCard() {
    // Assuming you have a service method to add a new card, update it accordingly
    this.savedCardService.addNewCard(this.newCard).subscribe(
      (res) => {
        // Handle success, e.g., update the UI with the new card
        this.registeredCards.push(res.newCard); // Assuming the server returns the new card
        this.closeModal();
      },
      (error) => {
        console.error(error);
        // Handle error, show a message to the user, etc.
      }
    );
  }

  openAddCardModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
