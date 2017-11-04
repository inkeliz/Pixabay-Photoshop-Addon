(function () {
    'use strict';

    var csInterface = new CSInterface();
    themeManager.init();

    function sidebar() {
        sidebarDiskBox();
        sidebarConfigBox();
    }

    function sidebarConfigBox() {
        var configuration = BayStorage.Configuration.Search.read();

        for (var v in PixaAPI.Search.Image.Param.PossibleValues) {

            var ConfigBox = BayTemplate.open('.configuration form');
            ConfigBox.element.getElementsByClassName('name')[0].innerText = PixaAPI.Search.Image.Param.PossibleValues[v]['name'];
            ConfigBox = BayTemplate.saveAsElement(ConfigBox);

            for (var i in PixaAPI.Search.Image.Param.PossibleValues[v]['values']) {
                var line = document.createElement('div');
                line.classList.add('block');

                var opt = document.createElement('input');
                opt.name = v;
                opt.value = PixaAPI.Search.Image.Param.PossibleValues[v]['values'][i];
                opt.type = PixaAPI.Search.Image.Param.PossibleValues[v]['mode'];
                opt.id = PixaAPI.Search.Image.Param.PossibleValues[v]['values'][i];

                opt.addEventListener('change', function () {
                    this.form.dispatchEvent(new Event('submit'));
                });

                line.appendChild(opt);

                var label = document.createElement('label');
                label.setAttribute('for', PixaAPI.Search.Image.Param.PossibleValues[v]['values'][i]);
                label.innerHTML = PixaAPI.Search.Image.Param.PossibleValues[v]['text'][i];
                line.appendChild(label);

                ConfigBox.getElementsByClassName('value')[0].appendChild(line);
            }

            var selected = configuration[v].split(',');
            for (var i = 0; i < selected.length; i++) {

                console.log(selected[i]);
                var elem = document.querySelector('input[value="'+ selected[i] +'"]');
                if(elem !== null){
                    elem.checked = true;
                }

            }

        }
    }

    function sidebarDiskBox() {
        var Param = BayStorage.History.Download.read();
        var id = [];

        for (var i in Param) {
            id.push(i);
        }

        if (id.length > 0) {
            id = id.join(',');

            var GetParam = PixaAPI.Get.Image.Param.Default;
            GetParam['id'] = id;

            BayTemplate.wipe('.info .disk .flex-images');
            PixaAPI.Get.Image.request(GetParam, function (response) {

                response['hits'].forEach(function (data) {
                    var template = BayTemplate.open('.info .disk .flex-images');

                    template.element.setAttribute('data-w', data['webformatWidth']);
                    template.element.setAttribute('data-h', data['webformatHeight']);
                    template.element.setAttribute('data-authorname', data['user']);
                    template.element.setAttribute('data-authorpicture', data['userImageURL']);
                    template.element.setAttribute('data-id', data['id_hash']);

                    template.element.getElementsByTagName('img')[0].setAttribute('src', PixaAPI.Search.Image.changeResolution(data['webformatURL'], '_640'));

                    var saved = BayTemplate.saveAsElement(template);

                    var l = document.querySelector('.info .disk .flex-images .left');
                    var r = document.querySelector('.info .disk .flex-images .right');

                    if (document.querySelector('.info').clientWidth >= 436) {
                        saved.getElementsByTagName('img')[0].style.height = (((document.querySelector('.info').clientWidth / 2) - 10) * parseInt(data['webformatHeight'])) / parseInt(data['webformatWidth']) + 'px';
                    } else {
                        saved.getElementsByTagName('img')[0].style.height = ((document.querySelector('.info').clientWidth - 10) * parseInt(data['webformatHeight'])) / parseInt(data['webformatWidth']) + 'px';
                    }

                    if (parseInt(l.dataset.h) >= parseInt(r.dataset.h)) {
                        r.appendChild(saved);
                        r.dataset.h = parseInt(r.dataset.h) + parseInt(data['webformatHeight']);
                    } else {
                        l.appendChild(saved);
                        l.dataset.h = parseInt(l.dataset.h) + parseInt(data['webformatHeight']);
                    }


                });


            }, function (response) {


            });
        }

    }

    function showConfigBox() {
        document.querySelector('.configuration').style.display = "block";
        document.querySelector('.disk').style.display = "none";
    }

    function showDiskBox() {
        document.querySelector('.configuration').style.display = "none";
        document.querySelector('.disk').style.display = "block";

        new flexImages({selector: '.info .disk .flex-images', rowHeight: 175});
    }

    function downloadBox() {
        var Param = BayStorage.Configuration.Download.read();

        for (var i in Param) {
            var selectBox = document.querySelector('form#download select[name=' + i + ']');

            if (selectBox !== undefined) {
                selectBox.value = Param[i];
            }
        }
    }

    function searchBox() {
        setTimeout(function () {
            document.querySelector('form#search').dispatchEvent(new Event('submit'));
        }, 1000);
    }

    function init() {


        document.querySelector('form#configuration').addEventListener('submit', function (e) {
            e.preventDefault();

            var Param = BayStorage.Configuration.Search.read();
            var CategorieOld = Param.category;

            BayStorage.Configuration.Search.write(
                PixaHelper.Build.values(document.getElementById('configuration'), Param)
            );

            document.querySelector('form#search').dispatchEvent(new Event('submit'));

        });

        document.querySelector('.configuration-trigger').addEventListener('click', function (e) {
            if (!document.querySelector('.configuration').classList.contains('active')) {
                document.querySelector('.configuration').classList.add('active');
            } else {
                document.querySelector('.configuration').classList.remove('active');
            }
        });


        document.querySelector('form#search').addEventListener('submit', function (e) {
            e.preventDefault();

            var images = document.querySelectorAll('.item');
            for (var i = 0; i < images.length; i++) {
                if (!images[i].classList.contains('active')) {
                    images[i].classList.add('active');
                }
                images[i].classList.remove('selected');
            }
            document.querySelector('.download').classList.remove('active');
            document.querySelector('.downloadable img').src = "";

            var Param = BayStorage.Configuration.Search.read();
            Param['q'] = this.getElementsByTagName('input')[0].value;
            Param['per_page'] = 200;
            //Param['response_group'] = 'high_resolution';


            BayTemplate.wipe('.info .search-result .flex-images');

            PixaAPI.Search.Image.request(Param, function (response) {

                response['hits'].forEach(function (data) {
                    var template = BayTemplate.open('.info .search-result .flex-images');

                    template.element.setAttribute('data-w', data['webformatWidth']);
                    template.element.setAttribute('data-h', data['webformatHeight']);
                    template.element.setAttribute('data-src', data['webformatURL']);
                    template.element.setAttribute('data-authorname', data['user']);
                    template.element.setAttribute('data-authorpicture', data['userImageURL']);
                    template.element.setAttribute('data-id', data['id_hash']);

                    template.element.getElementsByTagName('img')[0].setAttribute('src', PixaAPI.Search.Image.changeResolution(data['webformatURL'], '_640'));

                    var saved = BayTemplate.saveAsElement(template);
                    var l = document.querySelector('.info .search-result .flex-images .left');
                    var r = document.querySelector('.info .search-result .flex-images .right');

                    if (document.querySelector('.info').clientWidth >= 436) {
                        saved.getElementsByTagName('img')[0].style.height = (((document.querySelector('.info').clientWidth / 2) - 10) * parseInt(data['webformatHeight'])) / parseInt(data['webformatWidth']) + 'px';
                    } else {
                        saved.getElementsByTagName('img')[0].style.height = ((document.querySelector('.info').clientWidth - 10) * parseInt(data['webformatHeight'])) / parseInt(data['webformatWidth']) + 'px';
                    }

                    if (parseInt(l.dataset.h) >= parseInt(r.dataset.h)) {
                        r.appendChild(saved);
                        r.dataset.h = parseInt(r.dataset.h) + parseInt(data['webformatHeight']);
                    } else {
                        l.appendChild(saved);
                        l.dataset.h = parseInt(l.dataset.h) + parseInt(data['webformatHeight']);
                    }


                });

            }, function (response) {


            });
        });

        document.querySelector('form#download').addEventListener('submit', function (e) {
            e.preventDefault();

            var DownloadForm = {};
            PixaHelper.Build.values(this, DownloadForm);


            var url = PixaAPI.Search.Image.changeResolution(DownloadForm.url, DownloadForm.size);
            var mode = DownloadForm.mode;

            BayLoading.start();

            if (PixaFiles.exist(PixaAPI.Search.Image.extractFileName(DownloadForm)) === false) {
                PixaAPI.Download.Image.request(url, function (response) {

                    var fileLocation = PixaFiles.store(response, PixaAPI.Search.Image.extractFileName(DownloadForm));

                    if (mode === 'layer') {
                        csInterface.evalScript('CreateLayer("' + fileLocation + '", "Picture from Pixabay")');
                    }
                    if (mode === 'clip') {
                        csInterface.evalScript('CreateClip("' + fileLocation + '", "Picture from Pixabay")');
                    }
                    if (mode === 'file') {
                        csInterface.evalScript('OpenDocument("' + fileLocation + '")');
                    }

                    var Disk = BayStorage.History.Download.read();

                    if (Disk[DownloadForm.id] === undefined) {
                        Disk[DownloadForm.id] = fileLocation;

                        BayStorage.History.Download.write(Disk);
                        sidebarDiskBox();
                    }
                    BayLoading.end();

                }, function (response) {

                    BayLoading.end();
                });
            } else {
                var fileLocation = PixaFiles.createPath(PixaAPI.Search.Image.extractFileName(DownloadForm));

                if (mode === 'layer') {
                    csInterface.evalScript('CreateLayer("' + fileLocation + '", "Picture from Pixabay")');
                }
                if (mode === 'clip') {
                    csInterface.evalScript('CreateClip("' + fileLocation + '", "Picture from Pixabay")');
                }
                if (mode === 'file') {
                    csInterface.evalScript('OpenDocument("' + fileLocation + '")');
                }

                BayLoading.end();
            }

            BayStorage.Configuration.Download.write(
                {mode: DownloadForm.mode, size: DownloadForm.size}
            );

        });

        document.querySelector('.config').addEventListener('click', function (e) {

            if (e.target && e.target.classList.contains('option') && !e.target.classList.contains('active')) {

                var options = document.querySelectorAll('.config .option');

                for (var i = 0; i < options.length; i++) {
                    options[i].classList.remove('active');
                    document.querySelector(options[i].dataset.t).classList.remove('active')
                }

                sidebarDiskBox();

                document.querySelector(e.target.dataset.t).classList.add('active');
                e.target.classList.add('active');
            }

        });

        var fi = document.querySelectorAll('.flex-images');

        for (var i = 0; i < fi.length; i++) {

            fi[i].addEventListener('click', function (e) {
                var images = document.querySelectorAll('.item');

                if (e.target && e.target.parentNode.classList.contains('item') && !e.target.parentNode.classList.contains('selected') && e.target.parentNode.classList.contains('active')) {

                    var parent = e.target.parentNode;
                    var informationSource = parent.dataset;

                    var template = document.getElementsByClassName('downloadable')[0];
                    template.getElementsByClassName('name')[0].innerText = informationSource.authorname;

                    if (informationSource.authorpicture !== "" && informationSource.authorpicture !== null) {
                        template.getElementsByTagName('img')[0].src = informationSource.authorpicture;
                    } else {
                        template.getElementsByTagName('img')[0].src = "img/pixabay.png";
                    }

                    template.querySelector('[name="url"]').value = e.target.src;
                    template.querySelector('[name="id"]').value = informationSource.id;

                    for (var i = 0; i < images.length; i++) {
                        images[i].classList.remove('active');
                        images[i].classList.remove('selected');
                    }

                    parent.classList.add('active');
                    parent.classList.add('selected');
                    template.classList.add('active');

                    document.querySelector('.download').classList.add('active');

                } else {
                    for (var i = 0; i < images.length; i++) {
                        if (!images[i].classList.contains('active')) {
                            images[i].classList.add('active');
                        }
                        images[i].classList.remove('selected');
                    }
                    document.querySelector('.download').classList.remove('active');
                    document.querySelector('.downloadable img').src = "";
                }
            });


        }


        sidebar();
        downloadBox();
        searchBox();

    }

    init();

}());

