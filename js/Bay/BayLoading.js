/**
 * Created by lucas on 02/10/2017.
 */

BayLoading = {
    start: function () {
        document.querySelector('.loading').classList.add('active');
    },
    end: function () {
        document.querySelector('.loading').classList.remove('active');
    }
};