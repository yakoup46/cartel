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
            'yellow' : '',
            'green' : '#27ae60'
        }

        this.c = $('#cartel');
        this.ctx = (this.c)[0].getContext('2d');

        this.init = function(el, opts){
            this.opts = $.extend(this.opts, opts);
            this.drawBoard();

            return this;
        };

        this.drawBoard = function(){
            var eighth = 960 / 8;
            var _ = this.ctx;

            _.beginPath();
            _.lineWidth = 2;

            // top left to bottom left
            _.moveTo(eighth, 0);
            _.lineTo(eighth ,960);
            _.stroke();

            // top left to top right
            _.moveTo(0, eighth);
            _.lineTo(960, eighth);
            _.stroke();

            // top right to bottom right
            _.moveTo(960 - eighth, 0);
            _.lineTo(960 - eighth, 960);
            _.stroke();

            // bottom left to bottom right
            _.moveTo(0, 960 - eighth);
            _.lineTo(960, 960 - eighth);
            _.stroke();

            var start = eighth;
            var increment = 960 / 12;

            // pieces
            for (var i = 0; i < 9; i++) {
                // bottom side
                _.moveTo(start + increment * i, 960);
                _.lineTo(start + increment * i, 960 - eighth);
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
                _.moveTo(960, start + increment * i);
                _.lineTo(960 - eighth, start + increment * i);
                _.stroke();
            }

            var side = 0;
            var j = 0;
            var x,y,w,h;

            for (var i = 0; i < spaces.length; i++) {
                var cur = spaces[i];
                var type = cur.type;

                if (i % 9 === 0 && i > 0) {
                    side++;
                    j = 0;
                }

                if (type === 'property') {
                    _.closePath();
                    _.fillStyle = this.colors[cur.color];

                    switch (side) {
                        case 0:
                            x = 960 - eighth - (increment * (j + 1));
                            y = 960 - increment;
                            w = increment;
                            h = increment - eighth;
                            break;
                        case 1:
                            x = eighth;
                            y = 960 - eighth - (increment * (j + 1));
                            w = increment - eighth;
                            h = increment;
                            break;
                        case 2:
                            x = eighth + (increment * j);
                            y = eighth;
                            w = increment;
                            h = increment - eighth;
                            break;
                        case 3:
                            x = 960 - increment;
                            y = eighth + (increment * j);
                            w = increment - eighth;
                            h = increment;
                            break;
                    }

                    _.rect(x, y, w, h);

                    _.fill();
                    _.stroke();
                    _.beginPath();
                }

                j++;
            }
        }

    };

    $.cartel = function(o) {
        var instance = (new Cartel).init(this, o);
        return instance;
    }

})(window.jQuery, false);