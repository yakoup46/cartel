$(function(){
    C = $.cartel();
});

(function($,f){

    if(!$) return false; //no jQuery

    var Cartel = function(){

        var _ = this; //preserve state!

        this.opts = {};

        this.colors = {
            'purple' : '#9b59b6',
            'blue' : '#3498db',
            'pink' : '#ff0099',
            'orange' : '#ff9900',
            'red' : '#c0392b',
            'yellow' : '#f1c40f',
            'green' : '#27ae60',
            'darkblue' : '#2c3e50',
            'black' : '#000000'
        }

        this.c = $('#cartel')[0];
        this.ctx = this.c.getContext('2d');
        this.cw = this.c.width;
        this.ch = this.c.height;

        this.init = function(el, opts){
            this.opts = $.extend(this.opts, opts);
            this.drawBoard();
            this.rotateBoard();

            return this;
        };

        this.rotateBoard = function(){
            $('#rotate > a').on('click', function(e){
                e.preventDefault();

                var rotating = false;

                if (!rotating) {
                    rotating = true;
                    var canvasData = new Image();
                    canvasData.src = _.c.toDataURL();

                    canvasData.onload = function(){
                        _.c.width = _.cw;
                        _.c.height = _.ch;
                        _.cw = _.c.width;
                        _.ch = _.c.height;

                        _.ctx.save();
                        _.ctx.translate(_.cw, _.ch / _.cw);
                        _.ctx.rotate(Math.PI / 2);
                        _.ctx.drawImage(canvasData, 0, 0);
                        _.ctx.restore();
                        canvasData = null;
                        rotating = false;
                    }
                }
            });
        }

        this.drawCrossLines = function(eighth, ctx){
            // top left to bottom left
            ctx.moveTo(eighth, 0);
            ctx.lineTo(eighth, this.cw);
            ctx.stroke();

            // top left to top right
            ctx.moveTo(0, eighth);
            ctx.lineTo(this.cw, eighth);
            ctx.stroke();

            // top right to bottom right
            ctx.moveTo(this.cw - eighth, 0);
            ctx.lineTo(this.cw - eighth, this.cw);
            ctx.stroke();

            // bottom left to bottom right
            ctx.moveTo(0, this.cw - eighth);
            ctx.lineTo(this.cw, this.cw - eighth);
            ctx.stroke();
        }

        this.drawDividers = function(eighth, ctx, increment){
            var start = eighth;

            // pieces
            for (var i = 0; i < 9; i++) {
                // bottom side
                ctx.moveTo(start + increment * i, this.cw);
                ctx.lineTo(start + increment * i, this.cw - eighth);
                ctx.stroke();

                // top side
                ctx.moveTo(start + increment * i, 0);
                ctx.lineTo(start + increment * i, eighth);
                ctx.stroke();

                // left side
                ctx.moveTo(0, start + increment * i);
                ctx.lineTo(eighth, start + increment * i);
                ctx.stroke();

                // right side
                ctx.moveTo(this.cw, start + increment * i);
                ctx.lineTo(this.cw - eighth, start + increment * i);
                ctx.stroke();
            }
        }

        this.drawPieces = function(eighth, ctx, increment){
            var side = 0;
            var j = 0;
            var maxWidth = increment - 10;
            var x,y,w,h;

            ctx.font = '12px Arial';
            ctx.textAlign = 'center';

            // property colors and names
            for (var i = 0; i < spaces.length; i++) {
                var cur = spaces[i];
                var type = cur.type;
                var text = cur.name;
                var price = cur.price + ' Pesos' || 0;

                ctx.fillStyle = this.colors.black;

                if (i % 9 === 0 && i > 0) {
                    side++;
                    j = 0;
                }

                if (type === 'property') {
                    ctx.closePath();

                    switch (side) {
                        case 0:
                            x = this.cw - eighth - (increment * (j + 1));
                            y = this.cw - increment;
                            w = increment;
                            h = increment - eighth;

                            ctx.fillText(text, x + increment / 2, y + 15, maxWidth);
                            ctx.fillText(price, x + increment / 2, y + increment - 5, maxWidth);
                            break;
                        case 1:
                            x = eighth;
                            y = this.cw - eighth - (increment * (j + 1));
                            w = increment - eighth;
                            h = increment;

                            ctx.save();
                            ctx.translate(x, y);
                            ctx.rotate(Math.PI / 2);
                            ctx.fillText(text, increment / 2, increment - 25, maxWidth);
                            ctx.fillText(price, increment / 2, increment + 35, maxWidth);
                            ctx.restore();
                            break;
                        case 2:
                            x = eighth + (increment * j);
                            y = eighth;
                            w = increment;
                            h = increment - eighth;

                            ctx.save();
                            ctx.translate(x, y);
                            ctx.rotate(Math.PI);
                            ctx.fillText(text, -increment / 2, increment - 25, maxWidth);
                            ctx.fillText(price, -increment / 2, increment + 35, maxWidth);
                            ctx.restore();
                            break;
                        case 3:
                            x = this.cw - increment;
                            y = eighth + (increment * j);
                            w = increment - eighth;
                            h = increment;

                            ctx.save();
                            ctx.translate(x, y);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText(text, -increment / 2, increment - 60, maxWidth);
                            ctx.fillText(price, -increment / 2, increment - 5, maxWidth);
                            ctx.restore();
                            break;
                    }

                    ctx.fillStyle = this.colors[cur.color];
                    ctx.rect(x, y, w, h);

                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                }

                j++;
            }
        }

        this.drawBoard = function(){
            var eighth = this.cw / 8;
            var increment = this.cw / 12;
            var ctx = this.ctx;

            ctx.beginPath();
            ctx.lineWidth = 2;

            this.drawCrossLines(eighth, ctx);
            this.drawDividers(eighth, ctx, increment);
            this.drawPieces(eighth, ctx, increment);

            ctx.save();
        }
    };

    $.cartel = function(o) {
        var instance = (new Cartel).init(this, o);
        return instance;
    }

})(window.jQuery, false);
