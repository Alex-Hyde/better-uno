import firebase from "./firebase.js";
import imgdict from "./imgdict.js";

function PlayerIcons(icons, selfInd){
    this.icons = [];
    for (let i = 0; i < icons.length; i++) {
        this.icons.push(new PlayerIcon(icons[i], i, 0, 0, 0, 0));
    }
    this.selfInd = selfInd;
    this.active = false;

    this.draw = function(ctx, cards, current, sizeMult) {
        for (let i = 0; i < this.icons.length; i++) {
            const e = this.icons[i];
            e.draw(ctx, cards[i], current, sizeMult);
        }
    }

    this.setIcons = function(numPlayers, reversed, current, cardHeight, sizeMult) {
        var cardNums = [-1, -1, -1];
        var top = current;
        if (numPlayers > 3) {
            if (current == this.selfInd || current == index(this.selfInd - 1, numPlayers) || current == index(this.selfInd + 1, numPlayers)) {
                if (reversed) {
                    top = index(this.selfInd - 2, numPlayers);
                } else {
                    top = index(this.selfInd + 2, numPlayers);
                }
            }
        } else if (numPlayers == 3) {
            top = -1;
        } else {
            top = index(this.selfInd + 1, numPlayers);
        }      
        var leftSide = [];
        var rightSide = [];

        if (top != -1) {
            this.icons[top].x = window.innerWidth/2 - 25 * sizeMult;
            this.icons[top].y = (cardHeight + 30)*sizeMult;
            this.icons[top].w = 50*sizeMult;
            this.icons[top].h = 50*sizeMult;
            cardNums[1] = top;
        }
        this.icons[this.selfInd].x = 10*sizeMult;
        this.icons[this.selfInd].y = window.innerHeight - 80*sizeMult;
        this.icons[this.selfInd].w = 70*sizeMult;
        this.icons[this.selfInd].h = 70*sizeMult;
        
        if (numPlayers > 2) {
            let ind = index(this.selfInd + 1, numPlayers);
            this.icons[ind].x = (cardHeight + 30) * sizeMult;
            this.icons[ind].y = window.innerHeight/2 - 25 * sizeMult;
            this.icons[ind].w = 50*sizeMult;
            this.icons[ind].h = 50*sizeMult;
            cardNums[0] = ind;
            
            ind = index(this.selfInd - 1, numPlayers);
            this.icons[ind].x = window.innerWidth - (cardHeight + 30) * sizeMult - 50*sizeMult;
            this.icons[ind].y = window.innerHeight/2 - 25 * sizeMult;
            this.icons[ind].w = 50*sizeMult;
            this.icons[ind].h = 50*sizeMult;
            cardNums[2] = ind;
        }

        if (numPlayers > 4) {
            var left = true;
            for (let i = 0; i < numPlayers-3; i++) {
                if (index(this.selfInd+2+i, numPlayers) == top) {
                    left = false;
                    continue;
                }
                if (left) {
                    leftSide.push(this.icons[index(this.selfInd+2+i, numPlayers)]);
                } else {
                    rightSide.push(this.icons[index(this.selfInd+2+i, numPlayers)]);
                }
            }
        }

        for (let i = 0; i < leftSide.length; i++) {
            var icon = leftSide[i];
            icon.x = (10 + 60*i) * sizeMult;
            icon.y = 10 * sizeMult;
            icon.w = 50*sizeMult;
            icon.h = 50*sizeMult;
        }
        for (let i = 0; i < rightSide.length; i++) {
            var icon = rightSide[i];
            icon.x = window.innerWidth - (10 + 60*rightSide.length) * sizeMult + (10 + 60*i) * sizeMult;
            icon.y = 10 * sizeMult;
            icon.w = 50*sizeMult;
            icon.h = 50*sizeMult;
        }
        return cardNums;
    }
}

function index(i, len) {
    i = i % len;
    while (i < 0) {
        i += len;
    }
    return i;
}

function PlayerIcon(img, ind, x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.ind = ind;

    this.draw = function(ctx, numCards, current, sizeMult) {
        console.log(sizeMult);
        var border = 8*sizeMult;
        if (current == this.ind) {
            ctx.save();
            ctx.filter = "blur(20px)";
            ctx.fillStyle = "#EFFA52";
            ctx.fillRect(this.x - border, this.y - border, this.w + 2*border, this.h + 2*border);
            ctx.restore();
        }

        border = 2*sizeMult;
        ctx.save();
        ctx.fillStyle = "#100910";
        ctx.fillRect(this.x - border, this.y - border, this.w + 2*border, this.h + 2*border);
        ctx.drawImage(document.getElementById(this.img), this.x, this.y, this.w, this.h);
        ctx.font = "bold " + (this.w-3*sizeMult).toString() + "px Helvetica";
        ctx.globalAlpha = 0.5;
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillText(numCards.toString(), this.x + this.w/2, this.y + this.h/2+5);
        ctx.restore();
    }

    this.clicked = function(x,y){
        return ((x > this.x) && (x < this.x + this.w) && (y > this.y) && (y < this.y + this.h));
    }
}

export default PlayerIcons;