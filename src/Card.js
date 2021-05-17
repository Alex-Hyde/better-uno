import firebase from "./firebase.js";

function Card(width,height, img){
    this.value = parseInt(img)
    this.strvalue = img
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.img = document.getElementById(img);
    this.enlarged = false;

    this.onCard = function(x, y, cardx = this.x, cardy = this.y){
        if (!this.enlarged){
            if((cardx < x) && (x < (cardx + this.width)) && (cardy < y) && (y < (cardy + this.height))){
                return true
            }
            return false
        }
        else{
            if((cardx < x) && (x < (cardx + this.width + 28)) && (cardy - 50 < y) && (y < (cardy + this.height))){
                return true
            }
            return false    
        }
    }

    this.draw = function(ctx){
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }   

    this.playCard = function(Game_Key, newturn, player, playernum, index){
        firebase.firestore().collection("Games").doc("Game " + Game_Key).update({
            currentcard : this.strvalue,
            turn : newturn + 1,
            currentplayer: (player + 1) % playernum,
            cardIndex: index
        })
    }
}

export default Card;