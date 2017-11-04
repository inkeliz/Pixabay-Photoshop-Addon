/**
 * Created by lucas on 03/10/2017.
 */

BayVisible = {

    change: function (on, off) {
        var o;
        var fi;
        
        for (o = 0; o < on.length; o++) {

            fi = document.querySelectorAll(on[i]);
            for (var i = 0; i < fi.length; i++) {
                    fi[i].classList.add('active');    
            }
            
        }

        for (o = 0; o < off.length; o++) {

            fi = document.querySelectorAll(off[i]);
            for (var i = 0; i < fi.length; i++) {
                fi[i].classList.remove('active');
            }

        }

    }


};