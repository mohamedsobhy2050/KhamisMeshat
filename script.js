
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/geometry/Point",
    "esri/Graphic",
    "esri/widgets/Expand",
    "esri/widgets/Home",
    "esri/widgets/ScaleBar",
    "esri/widgets/Compass",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Search",
    "esri/tasks/QueryTask",
    "esri/rest/support/Query",
    "esri/layers/FeatureLayer",
    "esri/layers/support/LabelClass",
    "esri/layers/support/Field",
    "esri/views/draw/Draw",


], (
    Map,
    MapView,
    Point,
    Graphic,
    Expand,
    Home,
    ScaleBar,
    Compass,
    BasemapGallery,
    Search,
    QueryTask,
    Query,
    FeatureLayer,
    LabelClass,
    Field,
    Draw,

) => {

    const map = new Map({
        basemap: "hybrid"
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 11.5,
        center: [42.69, 18.29],// longitude, latitude


    });

    //=====  go to functions ======
    let goTo_latlong = document.querySelector("#goTo_latlong")
    goTo_latlong.addEventListener("click", () => {
        let longitude = Number(document.querySelector("#longitude").value)
        let latitude = Number(document.querySelector("#latitude").value)
        let pt_latlong = new Point({
            type: "Point",
            longitude: longitude,
            latitude: latitude,
            // SpatialReference: view.SpatialReference
        });

        // Create a symbol for drawing the point
        const markerSymbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: "green",
            size: 8,
            outline: {
                // autocasts as new SimpleLineSymbol()
                color: "white",
                width: 1.5
            }
        };

        // Create a graphic and add the geometry and symbol to it
        const pointGraphic_latlong = new Graphic({
            geometry: pt_latlong,
            symbol: markerSymbol
        });

        view.graphics.add(pointGraphic_latlong);

        setTimeout(() => {
            longitude.value = ""
            latitude.value = ""
        }, 6000)


        let opts = {
            duration: 5000  // Duration of animation will be 5 seconds
        };

        // go to point at LOD 15 with custom duration
        view.goTo({
            target: pointGraphic_latlong,
            zoom: 20
        }, opts);






    })//===== end go to functions ======


    //=========== function view on Method ===========
    let viewOnMethod = document.querySelector("#viewOnMethod")
    view.on("double-click", function (event) {

        viewOnMethod.style.display = "flex"
        viewOnMethod.innerHTML = `
        Display XY & Long-Lat Coordinates <button id="closeBtn" class=" esri-icon-close esri-widget--button"></button>
                                  X : ${event.mapPoint.x} </br> 
                                  Y : ${event.mapPoint.y} </br></br>
                                  Longitude : ${event.mapPoint.longitude} </br> 
                                  Latitude : ${event.mapPoint.latitude} `
        //-----------------------------

        // Create a symbol for drawing the point
        const markerSymbol_onMethod = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: "red",
            size: 8,
            outline: {
                // autocasts as new SimpleLineSymbol()
                color: "white",
                width: 1.5
            }
        };

        // Create a graphic and add the geometry and symbol to it
        const pointGraphic_onMethod = new Graphic({
            geometry: event.mapPoint,
            symbol: markerSymbol_onMethod
        });

        // let pushGraphic = [];
        // pushGraphic.push(pointGraphic_onMethod);
        view.graphics.add(pointGraphic_onMethod);



        // let opts = {
        //     duration: 5000  // Duration of animation will be 5 seconds
        // };

        // // go to point at LOD 15 with custom duration
        // view.goTo({
        //     target: pointGraphic_onMethod,
        //     zoom: 20
        // }, opts);
        //======= function closeBtn=============
        let closeBtn = document.querySelector("#closeBtn")
        closeBtn.addEventListener("click", () => {
            view.graphics.removeAll();
            viewOnMethod.innerHTML = "";
            viewOnMethod.style.display = "none"
        })
    }); //===========end function view on Method ===========

    //============ function get plan name & boundery ===========

    let getplanName_boundery = () => {
        let queryTask = new QueryTask({
            url: "https://services3.arcgis.com/U26uBjSD32d7xvm2/ArcGIS/rest/services/planboundery/FeatureServer/0"
        });

        let query = new Query();
        query.returnGeometry = true;
        query.outFields = ["PLAN_NAME", "PLAN_DATE"];
        query.where = "1=1";

        // When resolved, returns features and graphics that satisfy the query.
        queryTask.execute(query).then(function (results) {
            let planNameBoundery = results.features  //define public var
            // console.log(planNameBoundery)
            results.features.map(feature => {
                let planName = feature.attributes.PLAN_NAME
                let planDate = feature.attributes.PLAN_DATE
                //-------------------------------------------
                let listPlanBoundery = document.querySelector("#listPlanBoundery")
                listPlanBoundery.innerHTML += `<option value="${planName}">${planDate}</option>`
                //---------------------------------------------


            })
        });
    };
    getplanName_boundery()
    //=================end function get plan name & boundery ==========

    /////=== get geometry plan boundery ============

    let inputPlanBoundery = document.querySelector("#inputPlanBoundery")

    inputPlanBoundery.addEventListener("change", () => {

        view.graphics.removeAll();
        listPlanParcel.innerHTML = ""


        let getplanGeometry_boundery = () => {
            let queryTask = new QueryTask({
                url: "https://services3.arcgis.com/U26uBjSD32d7xvm2/ArcGIS/rest/services/planboundery/FeatureServer/0"
            });

            let query = new Query();
            query.returnGeometry = true;
            query.outFields = ["PLAN_NAME"];
            query.where = `PLAN_NAME = '${inputPlanBoundery.value}' `;

            queryTask.execute(query).then(function (results) {
                let planNameBoundery = results.features  //define public var
                // console.log(planNameBoundery)

                results.features.map(feature => {
                    let planGeometry = feature.geometry
                    //------------------------------------
                    //   Create a symbol for rendering the graphic
                    const fillSymbol_boundery = {
                        type: "simple-fill", // autocasts as new SimpleFillSymbol()
                        //color: "red",
                        outline: {
                            // autocasts as new SimpleLineSymbol()
                            color: "red",
                            width: 1.5
                        }
                    };
                    // Create a graphic and add the geometry and symbol to it
                    const planBounderyGraphic = new Graphic({
                        geometry: planGeometry,
                        symbol: fillSymbol_boundery
                    });

                    view.graphics.add(planBounderyGraphic);

                    //------------
                    setTimeout(() => {
                        inputPlanBoundery.value = ""
                    }, 5000)
                    //--------------------
                    let opts = {
                        duration: 5000  // Duration of animation will be 5 seconds
                    };

                    // go to point at LOD 15 with custom duration
                    view.goTo({
                        target: planBounderyGraphic,
                        zoom: 15
                    }, opts);

                })
            })

        }
        getplanGeometry_boundery();
        //////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////

        let getParcel = () => {

            let queryTask = new QueryTask({
                url: "https://services3.arcgis.com/U26uBjSD32d7xvm2/ArcGIS/rest/services/parcel_shp/FeatureServer/0"
            });

            let query = new Query();
            query.returnGeometry = true;
            query.outFields = ["*"];
            query.where = `PLAN_NAME = '${inputPlanBoundery.value}' `;

            queryTask.execute(query).then(function (results) {
                let parcelNO = results.features  //define public var
                // console.log(parcelNO)

                results.features.map(feature => {

                    let parcelGeometry = feature.geometry
                    let attribute = feature.attributes
                    //console.log(attribute)
                   // let pcNo = toString(feature.attributes.PC_NO)
                    // console.log(pcNo)

                    //------------------------------------
                    //   Create a symbol for rendering the graphic
                    const fillSymbol_parcel = {
                        type: "simple-fill", // autocasts as new SimpleFillSymbol()
                        //color: "red",
                        outline: {
                            // autocasts as new SimpleLineSymbol()
                            color: "yellow",
                            width: 1
                        }
                    };

                    let popupTemplate = {
                        title: `${attribute.PLAN_NAME}`,
                        content: [{
                            // Pass in the fields to display
                            type: "fields",

                            fieldInfos: [
                                { fieldName: "AMANA_A_NA", label: "AMANA_A_NA" },
                                { fieldName: "AMANA_ID", label: "AMANA_ID" },
                                { fieldName: "CITY_A_NAM", label: "CITY_A_NAM" },
                                { fieldName: "CITY_ID", label: "CITY_ID" },
                                { fieldName: "DISTRICT_A", label: "DISTRICT_A" },
                                { fieldName: "DISTRICT_I", label: "DISTRICT_I" },
                                { fieldName: "FID", label: "FID" },
                                { fieldName: "IMAGE_PLAN", label: "IMAGE_PLAN" },
                                { fieldName: "LANDUSEID", label: "LANDUSEID" },
                                { fieldName: "MUNICIPALI", label: "MUNICIPALI" },
                                { fieldName: "OBJECTID", label: "OBJECTID" },
                                { fieldName: "PARCEL_DET", label: "PARCEL_DET" },
                                { fieldName: "PC_NO", label: "PC_NO" },
                                { fieldName: "PLANID", label: "PLANID" },
                                { fieldName: "PLAN_DATE", label: "PLAN_DATE" },
                                { fieldName: "PLAN_NAME", label: "PLAN_NAME" },
                                { fieldName: "PLAN_NO", label: "PLAN_NO" },
                                { fieldName: "PLAN_STATU", label: "PLAN_STATU" },
                                { fieldName: "REGION_ID", label: "REGION_ID" },
                                { fieldName: "SHAPE_Area", label: "SHAPE_Area" },
                                { fieldName: "SHAPE_LENG", label: "SHAPE_LENG" },
                                { fieldName: "X", label: "X" },
                                { fieldName: "Y", label: "Y" },
                            ]

                        }]
                    }

                    // Create a graphic and add the geometry and symbol to it
                    const parcelGraphic = new Graphic({
                        geometry: parcelGeometry,
                        symbol: fillSymbol_parcel,
                        attributes: attribute,
                        popupTemplate: popupTemplate,
                    });

                    view.graphics.add(parcelGraphic);
                    ///////////////////////////////////////////
                    ///////////////////////////////////////////////
                    //////////////////////////////////////////////////
                    /////========== feature layer =============
                    // let features = [
                    //     {
                    //         geometry: parcelGeometry,
                    //         attributes: attribute,
                    //popupTemplate: popupTemplate,
                    // fields: fields,
                    //labelingInfo: [labelClass],
                    // renderer: renderer
                    //     },

                    // ];

                    // const labelClass = new LabelClass({  // autocasts as new LabelClass()
                    //     symbol: {
                    //         type: "text",  // autocasts as new TextSymbol()
                    //         color: "white",
                    //         haloColor: "blue",
                    //         haloSize: 1,
                    //         font: {  // autocast as new Font()
                    //             family: "Ubuntu Mono",
                    //             size: 14,
                    //             weight: "bold"
                    //         }
                    //     },
                    //labelPlacement: "above-right",
                    //     labelExpressionInfo: { expression: `$feature.${pcNo}` },
                    // });

                    // let renderer = {
                    //     type: "simple",
                    //     symbol: {
                    //         type: "simple-marker",
                    //         // color: [255, 255, 255, 0.6],
                    //         size: 4,
                    //         outline: {
                    //             color: "yellow",
                    //             width: 1
                    //         }
                    //     }
                    // };
                    // define each field's schema
                    // const fields = [
                    //     new Field({
                    //         name: "ObjectID",
                    //         alias: "ObjectID",
                    //         type: "oid"
                    //     }), new Field({
                    //         name: "PC_NO",
                    //         alias: "PC_NO",
                    //         type: "string"
                    //     })
                    // ];


                    // let layer = new FeatureLayer({
                    //     source: features,
                    //     objectIdField: "ObjectID",
                    // popupTemplate: popupTemplate,
                    // fields: fields,
                    // labelingInfo: [labelClass],
                    //  renderer: renderer
                    // });
                    // view.map.add(layer)

                    ////////////////////////////////////////////////////////////////
                    ///////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////
                    //--------------
                    let PC_NO = feature.attributes.PC_NO

                    let listPlanParcel = document.querySelector("#listPlanParcel")
                    listPlanParcel.innerHTML += `<option value="${PC_NO}"></option>`
                    ///==========///
                    let inputPlanParcel = document.querySelector("#inputPlanParcel")
                    inputPlanParcel.addEventListener("change", () => {

                        if (inputPlanParcel.value === PC_NO) {
                            //------------------------------------
                            //   Create a symbol for rendering the graphic
                            const fillSymbol_PC = {
                                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                                //color: "red",
                                outline: {
                                    // autocasts as new SimpleLineSymbol()
                                    color: "blue",
                                    width: 1
                                }
                            };

                            // Create a graphic and add the geometry and symbol to it
                            const PC_Graphic = new Graphic({
                                geometry: parcelGeometry,
                                symbol: fillSymbol_PC,
                                attributes: attribute,
                                popupTemplate: popupTemplate,

                            });
                            view.graphics.add(PC_Graphic);


                            //------------
                            setTimeout(() => {
                                inputPlanParcel.value = ""
                            }, 5000)
                            //--------------------
                            let opts = {
                                duration: 5000  // Duration of animation will be 5 seconds
                            };

                            // go to point at LOD 15 with custom duration
                            view.goTo({
                                target: PC_Graphic,
                                zoom: 20
                            }, opts);

                        } //end if ======


                    }) //end event listener 2 ==========

                })

            })

        };
        getParcel(); // to run function 

    }) // ==end add event listener =======
    //=================end function get plan geometry & boundery ==========

    //////////////////////////
    //////////Draw point//////////////
    let draw = new Draw({
        view: view
    });

    let pinPoint = document.querySelector("#pinPoint")
    pinPoint.addEventListener("click", () => {

        view.surface.style.cursor = "crosshair"

        let action = draw.create("point");

        action.on("cursor-update", function (evt) {
            // createPointGraphic(evt.coordinates);
        });


        action.on("draw-complete", function (evt) {
            createPointGraphic(evt.coordinates);
        });


        function createPointGraphic(coordinates) {
            // view.graphics.removeAll();
            let point = {
                type: "point", // autocasts as /Point
                x: coordinates[0],
                y: coordinates[1],
                spatialReference: view.spatialReference
            };

            let graphic = new Graphic({
                geometry: point,
                symbol: {
                    type: "simple-marker", // autocasts as SimpleMarkerSymbol
                    style: "circle",
                    color: "red",
                    size: "10px",
                    outline: { // autocasts as SimpleLineSymbol
                        color: [255, 255, 0],
                        width: 1.5
                    }
                }
            });

            view.graphics.add(graphic);
            view.surface.style.cursor = ""
            //////////////////////////////////////
            ///////-------------------------/////
            viewOnMethod.style.display = "flex"
            viewOnMethod.innerHTML = `
            Display XY & Long-Lat Coordinates <button id="closeBtn" class=" esri-icon-close esri-widget--button"></button>
                                      X : ${coordinates[0]} </br> 
                                      Y : ${coordinates[1]} </br></br> `
            //-----------------------------

            closeBtn.addEventListener("click", () => {
                view.graphics.removeAll();
                viewOnMethod.innerHTML = "";
                viewOnMethod.style.display = "none"
            })
            //////------------------------//////
            ////////////////////////////////////

        }

    })


    /////////////////////
    /////////////////////
    //////////////////
    //========== Widgets =============
    let homeWidget = new Home({
        view: view
    });

    // adds the home widget to the top left corner of the MapView
    view.ui.add(homeWidget, "top-left");
    view.ui.move("zoom", "top-left")
    //--------------------------------
    let scaleBar = new ScaleBar({
        view: view
    });
    view.ui.add(scaleBar, "bottom-left");
    //----------------------------------
    let compass = new Compass({
        view: view
    });
    view.ui.add(compass, "top-left");
    //----------------------------------
    let basemapGallery = new BasemapGallery({
        view: view
    });
    basemapGalleryExpand = new Expand({
        expandIconClass: "esri-icon-basemap",
        expandTooltip: "basemapGallery",
        view: view,
        content: basemapGallery
    });
    view.ui.add(basemapGalleryExpand, "top-left");
    //----------------------------------
    const searchWidget = new Search({
        view: view
    });
    searchWidgetExpand = new Expand({
        expandIconClass: "esri-icon-search",
        expandTooltip: "search",
        view: view,
        content: searchWidget
    });
    view.ui.add(searchWidgetExpand, "top-right");
    //------------------------------------
    let goToDiv = document.querySelector("#goToDiv")
    goToDivExpand = new Expand({
        expandIconClass: "esri-icon-locate",
        expandTooltip: "Zoom To Location",
        view: view,
        content: goToDiv
    });
    view.ui.add(goToDivExpand, "top-right");

    //---------------------------------
    let listDiv = document.querySelector("#listDiv")
    listDivExpand = new Expand({
        expandIconClass: "esri-icon-drag-horizontal",
        expandTooltip: "Search Plans",
        view: view,
        content: listDiv
    });
    view.ui.add(listDivExpand, "top-right");

    //---------------------------------
    view.ui.add(viewOnMethod, "top-right")

    //--------------------------------
    view.ui.add("pinPoint", "top-left")
});  // ===== end Esri Require ======