 var menu = $("#menulist");
            var contextmenu = $("#contextmenu");
            var metadata;


            $(function() {
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
                }).click(function() {
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
                    start: function(event, ui) {
                        contextmenu.hide();
                        menu.hide();
                    },
                    cancel: ".contenedorlabel"
                });

                $(document).bind("contextmenu", function(e) {

                    contextmenu.show().position({
                        my: "left top",
                        at: "left bottom",
                        of: e
                    });

                    return false;
                });

                //bind y el live
                $(document).bind("click", function() {
                    menu.hide();
                    contextmenu.hide();
                });
                paint(null);

                // MANAGE !!!

            });


            function dragg() {
                var files = document.querySelectorAll('.contenedorfile');
                var filename;
                for (var i = 0, file; file = files[i]; ++i) { //Recorremos todos los enlaces para escucharlos con el listenes dragstart
                    // file.setAttribute('draggable', 'true'); //Aplicamos el atributo draggable para que todos los enlaces sea arrastrables
                    filename = file.lastChild.innerHTML; // con esto hago el ajax
                    addDragListenner(filename, file);
                    
                }
            }

            function addDragListenner(filename, file) {
                file.addEventListener('dragstart', function(evt) { //Escucharmos todos los enlaces que estan en file para que al ser arrastrados se ejecute el siguiente codigo

                    if (filename.indexOf(".") === -1)
                        evt.dataTransfer.setData('DownloadURL', "application/force-download:" + filename + ".zip:http://sergio.tk/descarga.php?file=" + filename);
                    else
                        evt.dataTransfer.setData('DownloadURL', "application/force-download:" + filename + ":http://sergio.tk/descarga.php?file=" + filename);




                    //Al ser arrastrado un enlace o archivo este asigna al DownloadURL el enlace absoluto para que la descarga sea correcta
                    /*$(".ui-selected", document.body).each(function() {
                     
                     $(this).simulate("dragstart");
                     });*/


                }, false);
            }

            function paint(dir) {
                var metadata;
                if (dir !== null) {
                    $.ajax({
                        url: "paintDir.php",
                        type: 'POST',
                        data: {
                            "dir": dir
                        },
                        dataType: 'json',
                        async: false,
                        success: function(data) {
                            metadata = data;
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    });
                } else {
                    $.ajax({
                        url: "paintDir.php",
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        success: function(data) {
                            metadata = data;
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    });
                }
                this.metadata = metadata;
                sort(null);
            }

            function sort(orderby) {

                $("#selectable").empty();

                if (orderby === null) { // order by date

                    var filename;
                    var ext;
                    var contentfile;

                    for (var i in metadata) {

                        filename = metadata[i].path.replace(/^.*(\\|\/|\:)/, '');

                        if (filename.substr(0, 1) === ".")
                            continue;


                        if (filename.indexOf(".") === -1)
                            ext = "file_"; // folder
                        else
                            ext = "file_" + filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();


                        contentfile = $("<div>", {
                            "class": "contenedorfile"
                        }).append(
                                $("<div>", {
                                    "class": "contenedoricono " + ext,
                                    title: filename
                                }).append(
                                $("<div>", {
                                    "class": "icono"
                                }))
                                ,
                                $("<div>", {
                                    "class": "contenedorlabel",
                                    text: filename,
                                    title: filename
                                })
                                ).attr("draggable", "true");

                        if (filename.indexOf(".") === -1)
                            contentfile.prependTo("#selectable");
                        else
                            contentfile.appendTo("#selectable");
                    }
                }

                EventListenners();
                dragg();
            }
            function download(file) {

                var iframe = document.createElement("iframe");
                iframe.src = "descarga.php?file=" + file;
                iframe.style.display = "none";
                $("#dl").append(iframe);
            }

            function EventListenners() {

                contextmenu.hide().menu({
                    select: function(event, ui) {
                        $(".ui-selected", document.body).each(function() {

                            download(this.lastChild.innerHTML);
                            setInterval(function() {
                                $("#dl").empty();
                            }, 12000);
                        });
                    }
                });


                $("#selectable .contenedorfile").mousedown(function(event) {
                    if (event.which === 1)
                    {
                        if ($(event.currentTarget).data('oneclck') === 1)
                        {
                            // DBLCLICK OPTION
                            console.log(this.lastChild.innerHTML);
                            if (this.lastChild.innerHTML.indexOf(".") === -1) {
                                paint(this.lastChild.innerHTML);
                            } else {
                                download(this.lastChild.innerHTML);
                            }

                            return false;
                        }
                        else
                        {
                            $(this).data('oneclck', 1);
                            setTimeout(function() {
                                $(event.currentTarget).data('oneclck', 0); // DBL CLICK RESET
                            }, 500);
                        }
                    }
                });

                menu.hide().menu({
                    select: function(event, ui) {
                        console.log("op:" + ui.item.attr("id"));
                        // ARRANGE OPTION
                    }
                });



                $("button").on("click", function() {
                    //var options = $(this).button("option");
                    //alert(options.label);

                    if (this.value === "arrange")
                        return;
                    menuToolbar(this.value);

                    // TOOLBAR OPTION
                });
            }


            function menuToolbar(item) {
                switch (item) {
                    case "home":
                        paint(null);
                        break;

                    default:

                        break;
                }
            }
