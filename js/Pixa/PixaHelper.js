/**
 * Created by lucas on 27/09/2017.
 */

var PixaHelper = {

    Status: {
        isSuccess: function (t) {
            return t.status === 200 || t.status === 304;
        }
    },

    ReadyState: {
        isSuccess: function (t) {
            return t.readyState === 4;
        }
    },

    Build: {

        param: function (obj) {
            var param = '';
            for (var p in obj) {
                if (obj.hasOwnProperty(p) && obj[p] !== '') {
                    param += '&' + p + '=' + encodeURIComponent(obj[p]);
                }
            }
            return param;
        },

        search: function (target, input, values) {
            var alteradyInserted = [];
            target = target.querySelectorAll(input);

            for (var i = 0; i < target.length; i++) {

                if ((target[i].type !== "checkbox" && target[i].type !== "radio") || target[i].checked === true) {
                    if (alteradyInserted[target[i].name] === true) {
                        values[target[i].name] += "," + target[i].value;
                    } else {
                        alteradyInserted[target[i].name] = true;
                        values[target[i].name] = target[i].value;
                    }

                }else if(target[i].type === "checkbox"){

                    var elems = document.querySelectorAll('input[name="'+ target[i].name +'"]');
                    var nelems = elems.length;
                    var ok = 0;

                    for(var c = 0; c < nelems; c++){
                        if(elems[c].checked === false){
                            ok += 1;
                        }
                    }

                    if(ok === nelems){
                        console.log(target[i].name)
                        alteradyInserted[target[i].name] = true;
                        values[target[i].name] = "all";
                    }

                }

            }

            return values;
        },

        values: function (form, to) {
            var values = {};
            if (to !== undefined) {
                values = to;
            }

            values = this.search(form, 'input', values);
            values = this.search(form, 'select', values);

            return values;
        },
    }

};