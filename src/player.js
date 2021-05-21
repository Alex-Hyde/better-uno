import Card from "./Card.js";
import firebase from "./firebase.js";

function Player(){
    this.turnNum = 0; 
    this.cardsInHand = [];
    this.handindex = 0;

    this.loadCards = function(inputs){
        for(var i = 0; i < inputs.length; i++){
            var newCard = new Card(81,126,inputs[i]);
            this.insertCard(newCard);
        }
    }

    this.insertCard = function(card) {
        for (var i = 0; i < this.cardsInHand.length; i++) {
            const other = this.cardsInHand[i];
            if (card.lessThan(other)) {
                break;
            }
        }
        this.cardsInHand.splice(i, 0, card);
    }
    
    this.updateHand = function(Game_Key){
        firebase.firestore().doc("Games/Game " + Game_Key + "/Players/Player " + (this.turnNum + 1)).update({
            Hand:  this.cardsInHand.map(card => card.strvalue)
        })
    }
}

export default Player;