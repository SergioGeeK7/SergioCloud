toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};


var menu = $("#menulist");
var contextmenu = $("#contextmenu");

$(function () {

    $("button:first").button({
        icons: {
            primary: "ui-icon-home"
        },
        text: false
    }).next().button({
        icons: {
            primary: "ui-icon-circle-arrow-w"
        },
        text: false
    }).next().button({
        icons: {
            primary: "ui-icon-circle-arrow-e"
        },
        text: false
    }).next().button({
        icons: {
            primary: "ui-icon-circle-arrow-n"
        },
        text: false
    }).next().button({
        icons: {
            primary: "ui-icon-circle-plus"
        },
        text: false
    }).next().button({
        icons: {
            primary: "ui-icon-circle-arrow-s"
        },
        text: false
    }).next().button({
        icons: {
            primary: "ui-icon-shuffle",
            secondary: "ui-icon-triangle-1-s"
        },
        text: false
    }).click(function () {

        menu.show().position({
            my: "left top",
            at: "left bottom",
            of: this
        });

        return false;

    }).next().button({
        icons: {
            primary: "ui-icon-help"
        },
        text: false
    });

    $("#selectable").selectable({
        filter: ".contenedorfile",
        start: function (event, ui) {

            contextmenu.hide();
            menu.hide();

        },
        cancel: ".contenedorlabel"
    });

    $(document).bind("contextmenu", function (e) {

        contextmenu.show().position({
            my: "left top",
            at: "left bottom",
            of: e
        });

        return false;

    });

    //bind y el live
    $(document).bind("click", function () {

        menu.hide();
        contextmenu.hide();

    });
    paint(null);

    // MANAGE !!!

    $('.upload').fileupload({
        dataType: 'text',
        formData: void(0),
        done: function doneUpload(e, data) {

            var fileName = data.files[0].name;

            toastr.success(fileName + " Done !");
            var $template = fileTemplate(fileName);
            $template.insertAfter($(".folder:last"));

            //var actives = $(this).fileupload('active');
            //console.dir(actives);
            //console.log("progress amount...");
            //console.dir($(this).fileupload('progress'))
        },
        progress: function (e, data) {
            //console.dir(data);
            //console.log("done");
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            if (progress === 100) {
                console.log(progress);
            }
        },
        processdone: function (e, data) {
            //console.log('Processing ' + data.files[data.index].name + ' done.');
        }
    });

    $("#search").on("keyup", filter);

});



function dragg() {

    var files = document.querySelectorAll('.contenedorfile');
    var filename;
    for (var i = 0, file; file = files[i]; ++i) {

        //Recorremos todos los enlaces para escucharlos con el listenes dragstart
        // file.setAttribute('draggable', 'true'); //Aplicamos el atributo draggable para que todos los enlaces sea arrastrables
        filename = file.lastChild.innerHTML; // con esto hago el ajax
        addDragListenner(filename, file);

    }

}

function addDragListenner(filename, file) {

    var href = window.location.href;

    file.addEventListener('dragstart', function (evt) {

        //Escucharmos todos los enlaces que estan en file para que al ser arrastrados se ejecute el siguiente codigo

        if (filename.indexOf(".") === -1)
            evt.dataTransfer.setData('DownloadURL', "application/force-download:" + filename + ".zip:" + href + "php/descarga.php?file=" + filename);
        else
            evt.dataTransfer.setData('DownloadURL', "application/force-download:" + filename + ":" + href + "php/descarga.php?file=" + filename);

        //Al ser arrastrado un enlace o archivo este asigna al DownloadURL el enlace absoluto para que la descarga sea correcta
        /*$(".ui-selected", document.body).each(function() {
                        
                        $(this).simulate("dragstart");
                        });*/

    }, false);

}

function paint(dir) {

    var params = dir !== null ? {
        dir: dir
    } : void(0);

    $.ajax({
        url: "php/paintDir.php",
        type: 'POST',
        data: params,
        dataType: 'json',
        success: success
    });


    function success(data) {
        sort(null, data);
    }

}

function sort(orderby, metadata) {

    $("#selectable").empty();

    if (orderby === null) {

        // order by date

        var filename;
        var contentfile;
        var files = [];

        for (var i in metadata) {

            filename = metadata[i].path.replace(/^.*(\\|\/|\:)/, '');

            if (filename.substr(0, 1) === ".")
                continue;

            if (filename.indexOf(".") === -1) // folders first
                files.unshift(fileTemplate(filename));
            else
                files.push(fileTemplate(filename));

        }
        $("#selectable").append(files);
    }

    EventListenners();
    dragg();
}




function fileTemplate(filename) {

    var isFolder = filename.indexOf(".") === -1;

    var ext = isFolder ?
        "file_" :
        "file_" + filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();


    return $("<div>", {
        "class": "contenedorfile " + (isFolder ? "folder" : "")
    }).append(
        $("<div>", {
            "class": "contenedoricono " + ext,
            title: filename
        }).append(
            $("<div>", {
                "class": "icono"
            })),
        $("<div>", {
            "class": "contenedorlabel",
            text: filename,
            title: filename
        })
    ).attr("draggable", "true");

}


function download(file) {

    var iframe = document.createElement("iframe");
    iframe.src = "php/descarga.php?file=" + file;
    iframe.style.display = "none";
    $("#dl").append(iframe);
}

function EventListenners() {

    contextmenu.hide().menu({
        select: function (event, ui) {

            $(".ui-selected", document.body).each(function () {

                download(this.lastChild.innerHTML);
                setInterval(function () {

                    $("#dl").empty();

                }, 12000);

            });

        }
    });

    $("#selectable .contenedorfile").mousedown(function (event) {

        if (event.which === 1) {

            if ($(event.currentTarget).data('oneclck') === 1) {

                // DBLCLICK OPTION
                //console.log(this.lastChild.innerHTML);
                if (this.lastChild.innerHTML.indexOf(".") === -1) {

                    paint(this.lastChild.innerHTML);

                } else {

                    download(this.lastChild.innerHTML);

                }

                return false;

            } else {

                $(this).data('oneclck', 1);
                setTimeout(function () {

                    $(event.currentTarget).data('oneclck', 0); // DBL CLICK RESET

                }, 500);

            }

        }

    });

    menu.hide().menu({
        select: function (event, ui) {

            console.log("op:" + ui.item.attr("id"));
            // ARRANGE OPTION

        }
    });

    $("button").on("click", function () {

        //var options = $(this).button("option");
        //alert(options.label);

        if (this.value === "arrange")
            return;
        menuToolbar(this.value);

        // TOOLBAR OPTION

    });

}

function filter() {

    var texbox = this;
    var filter = this.value.toLowerCase();

    $(".contenedoricono").each(function () {
        if (this.title.toLowerCase().indexOf(filter) === -1) {
            $(this).parent().hide(500);
        } else {
            $(this).parent().show(500);
        }
    });
}


function menuToolbar(item) {

    switch (item) {
    case "home":
        paint(null);
        break;
    case "download":
        download($(".ui-selected:first").children(":first")[0].title);
        break;
    case "upload":
        $("#uploadbtn").trigger('click');
        break;
    default:
        alert("No Supported yet");
        break;
    }
}