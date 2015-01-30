$(function(){
    C = $.cartel();
});

(function($,f){

    if(!$) return false; //no jQuery

    var Cartel = function(){

        var _ = this; //preserve state!

        this.opts = {};

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
        }

    };

    $.cartel = function(o) {
        var instance = (new Cartel).init(this, o);
        return instance;
    }

})(window.jQuery, false);