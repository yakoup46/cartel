var fun, socket;

$(function(){
    socket = io('http://cartel:1337');
    fun = $.functional();
});

(function($,f){

    if(!$) return false; //no jQuery

    var Functional = function(){

        var _ = this;

        this.init = function(){
            this.roll();
        }

        this.roll = function(){
            var roll = $("#roll");
            var intv;

            roll.on('click', function(){
                socket.emit('roll-dice');

                intv = setInterval(function(){
                    $('.die').addClass('hide');
                    $('.first .die').eq(Math.ceil(Math.random() * 6) - 1).toggleClass('hide');
                    $('.secnd .die').eq(Math.ceil(Math.random() * 6) - 1).toggleClass('hide');
                }, 50);
            });

            socket.on('dice-rolled', function(f,s){
                clearInterval(intv);
                $('.die').addClass('hide');
                $('.first .die').eq(f).toggleClass('hide');
                $('.secnd .die').eq(s).toggleClass('hide');
            });
        }

    }

    $.functional = function(o) {
        var instance = (new Functional).init(this, o);
        return instance;
    }

})(window.jQuery, false);
