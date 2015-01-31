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

        this.drawBoard = function(){
            var eighth = this.cw / 8;
            var _ = this.ctx;

            _.beginPath();
            _.lineWidth = 2;

            // top left to bottom left
            _.moveTo(eighth, 0);
            _.lineTo(eighth, this.cw);
            _.stroke();

            // top left to top right
            _.moveTo(0, eighth);
            _.lineTo(this.cw, eighth);
            _.stroke();

            // top right to bottom right
            _.moveTo(this.cw - eighth, 0);
            _.lineTo(this.cw - eighth, this.cw);
            _.stroke();

            // bottom left to bottom right
            _.moveTo(0, this.cw - eighth);
            _.lineTo(this.cw, this.cw - eighth);
            _.stroke();

            var start = eighth;
            var increment = this.cw / 12;

            // pieces
            for (var i = 0; i < 9; i++) {
                // bottom side
                _.moveTo(start + increment * i, this.cw);
                _.lineTo(start + increment * i, this.cw - eighth);
                _.stroke();

                // top side
                _.moveTo(start + increment * i, 0);
                _.lineTo(start + increment * i, eighth);
                _.stroke();

                // left side
                _.moveTo(0, start + increment * i);
                _.lineTo(eighth, start + increment * i);
                _.stroke();

                // right side
                _.moveTo(this.cw, start + increment * i);
                _.lineTo(this.cw - eighth, start + increment * i);
                _.stroke();
            }

            var side = 0;
            var j = 0;
            var maxWidth = increment - 10;
            var x,y,w,h;

            _.font = '12px Arial';
            _.textAlign = 'center';

            // property colors and names
            for (var i = 0; i < spaces.length; i++) {
                var cur = spaces[i];
                var type = cur.type;
                var text = cur.name;
                var price = cur.price + ' Pesos' || 0;

                _.fillStyle = this.colors.black;

                if (i % 9 === 0 && i > 0) {
                    side++;
                    j = 0;
                }

                if (type === 'property') {
                    _.closePath();

                    switch (side) {
                        case 0:
                            x = this.cw - eighth - (increment * (j + 1));
                            y = this.cw - increment;
                            w = increment;
                            h = increment - eighth;

                            _.fillText(text, x + increment / 2, y + 15, maxWidth);
                            _.fillText(price, x + increment / 2, y + increment - 5, maxWidth);
                            break;
                        case 1:
                            x = eighth;
                            y = this.cw - eighth - (increment * (j + 1));
                            w = increment - eighth;
                            h = increment;

                            _.save();
                            _.translate(x, y);
                            _.rotate(Math.PI / 2);
                            _.fillText(text, increment / 2, increment - 25, maxWidth);
                            _.fillText(price, increment / 2, increment + 35, maxWidth);
                            _.restore();
                            break;
                        case 2:
                            x = eighth + (increment * j);
                            y = eighth;
                            w = increment;
                            h = increment - eighth;

                            _.save();
                            _.translate(x, y);
                            _.rotate(Math.PI);
                            _.fillText(text, -increment / 2, increment - 25, maxWidth);
                            _.fillText(price, -increment / 2, increment + 35, maxWidth);
                            _.restore();
                            break;
                        case 3:
                            x = this.cw - increment;
                            y = eighth + (increment * j);
                            w = increment - eighth;
                            h = increment;

                            _.save();
                            _.translate(x, y);
                            _.rotate(-Math.PI / 2);
                            _.fillText(text, -increment / 2, increment - 60, maxWidth);
                            _.fillText(price, -increment / 2, increment - 5, maxWidth);
                            _.restore();
                            break;
                    }

                    _.fillStyle = this.colors[cur.color];
                    _.rect(x, y, w, h);

                    _.fill();
                    _.stroke();
                    _.beginPath();
                }

                j++;
            }
        }
        _.ctx.save();
    };

    $.cartel = function(o) {
        var instance = (new Cartel).init(this, o);
        return instance;
    }

})(window.jQuery, false);
