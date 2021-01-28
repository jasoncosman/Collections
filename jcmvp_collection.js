if (typeof (JCMVP) == "undefined") {
    JCMVP = {};
}
if (typeof (JCMVP.Collection) == "undefined") {
    JCMVP.Collection = {};
}

var fetchDirectorFilter;

JCMVP.Collection.Form = {

    OnLoad: function (executionContext) {
        JCMVP.Collection.Form.getCollectionsMovies(executionContext);
    },


    filterMovieDirectors: function () {
        //https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/controls/addcustomfilter
        formContext.getControl("jcmvp_director").addCustomFilter(fetchDirectorFilter, "jcmvp_director");
    },


    getCollectionsMovies: function (executionContext) {
        formContext = executionContext.getFormContext();

        var collectionID = formContext.data.entity.getId().replace("{", "").replace("}", "");

        //https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/xrm-webapi/retrievemultiplerecords
        Xrm.WebApi.retrieveMultipleRecords("jcmvp_movie", "?$select=_jcmvp_director_value&$filter=(_jcmvp_collection_value eq " + collectionID + ")").then(
            function success(result) {
                debugger;

                if (result.entities.length > 0) {
                    fetchDirectorFilter = "<filter type='and'> <condition attribute = 'jcmvp_directorid' operator = 'in' uitype='jcmvp_director'>";
                }

                for (var i = 0; i < result.entities.length; i++) {
                    //_jcmvp_director_value
                    fetchDirectorFilter += "<value>" + result.entities[i]._jcmvp_director_value + "</value>";
                    console.log(result.entities[i]);
                }
                if (result.entities.length > 0) {
                    fetchDirectorFilter += "</condition ></filter >";
                    //https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/controls/addcustomfilter
                    formContext.getControl("jcmvp_director").addPreSearch(JCMVP.Collection.Form.filterMovieDirectors);    
                }

            },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }

            
        );

    }

};