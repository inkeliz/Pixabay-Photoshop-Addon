
// PHOTOSHOP
function CreateClip(location, name){
    var Doc = app.activeDocument;
    var ActiveLayer = Doc.activeLayer;
    var Openened = OpenDocument(location);

    Layer = Openened.artLayers[0].duplicate(ActiveLayer, ElementPlacement.PLACEBEFORE);

    if(Doc.name !== Openened.name) {
        Openened.close(SaveOptions.DONOTSAVECHANGES);
    }

    Layer.name = name;
    Layer.grouped = true;

    return Layer;
}

function CreateLayer(location, name) {
    var Doc = app.activeDocument;
    var Openened = OpenDocument(location);


    Layer = Openened.artLayers[0].duplicate(Doc);

    if(Doc.name !== Openened.name) {
        Openened.close(SaveOptions.DONOTSAVECHANGES);
    }

    Layer.name = name;

    return Layer;
}

function OpenDocument(location) {
    return app.open(new File(location));
}


function replaceContents(newFile) {
    // Credits to https://stackoverflow.com/a/42936524/3043018
    // This is not in use anymore
    
    var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    desc3.putPath(idnull, new File(newFile));
    var idPgNm = charIDToTypeID("PgNm");
    desc3.putInteger(idPgNm, 1);
    executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);
    return app.activeDocument.activeLayer
}