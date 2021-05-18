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

export default CanvasButton;