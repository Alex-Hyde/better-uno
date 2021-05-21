import firebase from "./firebase.js";

const order = {
    "Y" : 0,
    "G" : 1,
    "R" : 2,
    "B" : 3,
    "!" : 4
}

function Card(width,height, img){
    this.value = parseInt(img)
    this.strvalue = img
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.width = width;
    this.height = height;
    this.img = document.getElementById(img);
    this.hovered = false;

    // dot product helper function
    function dot([x1,y1],[x2,y2]) {
        return x1*x2 + y1*y2;
    }

    this.onCard = function(x, y, cardx = this.x, cardy = this.y){
        return (this.x < x && x < this.x+this.width && this.y < y && y < this.y+this.height);

        // var cos = Math.cos(this.angle);
        // var sin = Math.sin(this.angle);
        // var AB = [this.width*cos,this.width*sin];
        // var AD = [this.height*sin,this.height*cos];
        // var AP = [x-this.x,y-this.y];
        // return (0 < dot(AP, AB) && dot(AP, AB) < dot(AB, AB) && 0 < dot(AP, AD) && dot(AP, AD) < dot(AD, AD));
    }

    this.draw = function(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.translate(-this.x, -this.y);
        ctx.drawImage(this.img,this.x,this.y - ((this.hovered) ? this.height/4 : 0),this.width,this.height);
        ctx.restore(); 
    }   

    this.playCard = function(Game_Key){
        firebase.firestore().collection("Games").doc("Game " + Game_Key).update({
            currentcard : this.strvalue
        })
    }

    // compare cards to keep deck sorted
    // other must be a card object
    this.lessThan = function(other) {
        if (order[this.strvalue[0]] < order[other.strvalue[0]]) {
            return true;
        } else if (order[this.strvalue[0]] > order[other.strvalue[0]]) {
            return false;
        }
        return (this.strvalue[1] < other.strvalue[1]);
    }
}

export default Card;