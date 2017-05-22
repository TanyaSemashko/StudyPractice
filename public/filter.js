var filter = (function () {
    var formButton;
    function init() {
        formButton = document.getElementById("apply-filters");
        formButton.addEventListener("click", showFilter);
    }
    function showFilter(event) {
        if (event.target.getAttribute("id") === "apply-filters"){
            var sel = document.getElementById("author-filter");
            var config = {author: undefined, dateFrom:undefined, dateTo:undefined,tags:undefined};
            var author = sel.options[sel.selectedIndex].text;
            if (document.getElementById("dateFrom").value != ""){
                var dateFrom = new Date(document.getElementById("dateFrom").value);
                config.dateFrom = dateFrom;
            }
            if (document.getElementById("dateTo").value != ""){
                var dateTo = new Date(document.getElementById("dateTo").value);
                config.dateTo = dateTo;
            }
            var tags = document.getElementById("tag-filter");
            var tag = tags.options[tags.selectedIndex].text;
            var filteredArticles;
            if (tag != "Выбрать тег"){
                config.tags = tag;
            }
            if (author == "Выбрать автора"){
                filteredArticles = articlesService.getArticles(config);
            } else {
                config.author = author;
                filteredArticles = articlesService.getArticles(config);
            }
            articlesRender.buildArticles(filteredArticles);
        }
    }
    return{
        init: init,
        showFilter: showFilter
    }
}());
