/**
 * Created by lucas on 27/09/2017.
 */
var csInterface = new CSInterface();

const KEY = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

var PixaAPI = {

    Download: {

        Image: {

            request: function (url, successCallback, errorCallback) {
                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (PixaHelper.ReadyState.isSuccess(this) && PixaHelper.Status.isSuccess(this)) {
                        successCallback(this.response);
                    }
                    if (PixaHelper.ReadyState.isSuccess(this) && !PixaHelper.Status.isSuccess(this)) {
                        errorCallback(this.status);
                    }
                };

                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';
                xhr.send();
            }

        },

    },

    Search: {

        Image: {

            Param: {

                PossibleValues: {
                    image_type: {
                        name: 'Image type',
                        values: ['photo', 'illustration'],
                        text: ['Photo', 'Illustration'],
                        mode: 'checkbox'
                    },
                    orientation: {
                        name: 'Orientation',
                        values: ['horizontal', 'vertical'],
                        text: ['Horizontal', 'Vertical'],
                        mode: 'checkbox'
                    },
                    order: {
                        name: 'Order',
                        values: ['popular', 'latest'],
                        text: ['Popular', 'Lastest'],
                        mode: 'radio'
                    },
                    editors_choice: {
                        name: 'Editors choice',
                        values: ['true', 'false'],
                        text: ['On', 'Off'],
                        mode: 'radio'
                    },
                },

                Default: {
                    q: '',
                    lang: 'EN',
                    id: '',
                    response_group: 'high_resolution',
                    image_type: 'all',
                    orientation: 'all',
                    category: 'all',
                    editors_choice: 'false',
                    safesearch: 'true',
                    order: 'popular',
                    page: '1',
                    per_page: '200'
                }
            },

            request: function (param, successCallback, errorCallback) {
                var url = 'https://pixabay.com/api/?key=' + KEY + PixaHelper.Build.param(param);

                getCache(function(c) {

                    if (c !== false && c !== undefined) {
                        successCallback(JSON.parse(c));
                    } else {
                        var xhr = new XMLHttpRequest();

                        xhr.onreadystatechange = function () {
                            if (PixaHelper.ReadyState.isSuccess(this) && PixaHelper.Status.isSuccess(this)) {
                                putCache(url, this.response);
                                successCallback(JSON.parse(this.response));
                            }
                            if (PixaHelper.ReadyState.isSuccess(this) && !PixaHelper.Status.isSuccess(this)) {
                                errorCallback(this.status);
                            }
                        };

                        xhr.open('GET', url, true);
                        xhr.send();
                    }

                }, url);
                

            },

            changeResolution: function (url, size) {
                return url.replace(/_340|_640|_960|_1280|1920/gi, size);
            },

            extractFileName: function (downloadForm) {
                var exploded = downloadForm.url.split('.');
                return downloadForm.id + downloadForm.size + '.' + exploded[exploded.length - 1];
            }
        },

    },

    Get: {

        Image: {

            Param: {

                Default: {
                    id: '',
                    response_group: 'high_resolution'
                },

            },

            request: function (param, successCallback, errorCallback) {
                var url = 'https://pixabay.com/api/?key=' + KEY + PixaHelper.Build.param(param);

                getCache(function(c) {

                    if (c !== false && c !== undefined) {
                        successCallback(JSON.parse(c));
                    } else {
                        var xhr = new XMLHttpRequest();

                        xhr.onreadystatechange = function () {
                            if (PixaHelper.ReadyState.isSuccess(this) && PixaHelper.Status.isSuccess(this)) {
                                putCache(url, this.response);
                                successCallback(JSON.parse(this.response));
                            }
                            if (PixaHelper.ReadyState.isSuccess(this) && !PixaHelper.Status.isSuccess(this)) {
                                errorCallback(this.status);
                            }
                        };

                        xhr.open('GET', url, true);
                        xhr.send();
                    }

                }, url);

            },

        }


    }

};

