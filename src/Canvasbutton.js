function CanvasButton(img,x,y,width,height){
    this.img = document.getElementById(img);
    this.width = width
    this.height = height 
    this.x = x
    this.y = y
    this.on = false

    this.draw = function(ctx){
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }

    this.clicked = function(x,y){
        if((x > this.x) && (x < this.x + this.width) && (y > this.y) && (y < this.y + this.height)){
            return true
        }
        return false
    }

}

function CanvasButtonCircle(x,y,radius,quadrant,color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.quadrant = quadrant;
    this.color = color;

    this.on = false;
    this.hovered = false;

    this.HOVERED_SIZE = 1.1;

    this.draw = function(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * (this.hovered ? this.HOVERED_SIZE : 1), Math.PI/2*(this.quadrant-1), Math.PI/2*(this.quadrant-1) + Math.PI/2, false);
        ctx.lineTo(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }

    this.clicked = function(x,y){
        switch (this.quadrant) {
            case 1:
                return (x > this.x && x < this.x + this.radius * (this.hovered ? this.HOVERED_SIZE : 1) && y > this.y && y < this.y + this.radius * (this.hovered ? this.HOVERED_SIZE : 1));
            case 2:
                return (x < this.x && x > this.x - this.radius * (this.hovered ? this.HOVERED_SIZE : 1) && y > this.y && y < this.y + this.radius * (this.hovered ? this.HOVERED_SIZE : 1));
            case 3:
                return (x < this.x && x > this.x - this.radius * (this.hovered ? this.HOVERED_SIZE : 1) && y < this.y && y > this.y - this.radius * (this.hovered ? this.HOVERED_SIZE : 1));
            case 4:
                return (x > this.x && x < this.x + this.radius * (this.hovered ? this.HOVERED_SIZE : 1) && y < this.y && y > this.y - this.radius * (this.hovered ? this.HOVERED_SIZE : 1));
            default:
                break;
        }
    }

}


export { CanvasButton, CanvasButtonCircle };