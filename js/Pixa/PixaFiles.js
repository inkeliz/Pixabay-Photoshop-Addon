/**
 * Created by lucas on 27/09/2017.
 */
var csInterface = new CSInterface();

const Folder = '/PixaBay/';

var PixaFiles = {
    
    directory: function() {
        var path = csInterface.getSystemPath(SystemPath.MY_DOCUMENTS) + Folder;
        
        window.cep.fs.makedir(path);
        return path;
    },
    
    store: function (data, name) {
        var str = '';
        
        var uInt8Array = new Uint8Array(data);
        for (var i = 0; i < uInt8Array.length; i++) {
            str += String.fromCharCode(uInt8Array[i]);
        }

        var fileLocation = this.createPath(name);

        window.cep.fs.writeFile(fileLocation, window.btoa(str), cep.encoding.Base64);
        
        return fileLocation;
    },
    
    createPath: function (name) {
        return PixaFiles.directory() + name;
    },

    exist: function (name) {
        return window.cep.fs.readFile(this.createPath(name)).err === 0;
    }
    
};
