/**
 * Created by lucas on 30/09/2017.
 *
 * This is for the old version (1.0.0 and 1.0.1) not used anymore.
 */

BaySwitch = {

    expanded: {},

    init: function (target, callbackLeft, callBackRight) {
        this.expanded[target] = false;

        var callback = [callbackLeft, callBackRight];
        var Switch = document.querySelector(target);

        Switch.addEventListener('click', function () {
            var x  = BaySwitch.change(target, Switch);

            callback[x]();
        })


    },

    change: function (target, selector) {
        var move = 0;
        var expanded = BaySwitch.expanded[target];
        
        var options = selector.getElementsByClassName('option');
        var pointer = selector.getElementsByClassName('pointer')[0];
        var switchbox =  selector.getElementsByClassName('switch-box')[0];

        if (!expanded) {
            var style = window.getComputedStyle(pointer);
            
            move -= parseInt(style.marginLeft, 10);
            move -= parseInt(style.marginRight, 10);
            move -= pointer.offsetWidth;
            move += switchbox.offsetWidth;
        }


        options[expanded | 0].classList.remove('active');
        expanded = !expanded;
        options[expanded | 0].classList.add('active');

        pointer.style.left = move + 'px';

        BaySwitch.expanded[target] = expanded;
        return expanded | 0;
    }


};