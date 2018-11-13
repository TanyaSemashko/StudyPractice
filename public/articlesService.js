var articlesService = (function () {

    var tags;
    var articles = [];

    function init() {
        //localStorage.setItem('');
        articles = JSON.parse(localStorage.getItem('articles'));
        articles.forEach(item => item.createdAt = new Date(item.createdAt));
        tags = JSON.parse(localStorage.getItem('tags'));
    }

    function comparator(a, b) {
        if (a.createdAt < b.createdAt) {
            return 1;
        } else {
            return -1;
        }
    }

    function getArticles(filterConfig) {
        var skip = 0;
        var top = articles.length;
        if (filterConfig) {
            return filterArticles(articles, filterConfig).slice(skip, skip + top).sort(comparator);
        } else return articles.slice(skip, skip + top).sort(comparator);
    }

    function getArticlesCount() {
        return articles.length;
    }

    function getLastId() {
        var max = 0;
        articles.forEach(function (item, i, arr) {
            if (item.id > max){
                max = item.id;
            }
        });
        return max;
    }

    function filterArticles(articles, filterConfig) {
        filterConfig.dateFrom = filterConfig.dateFrom || new Date("01.01.2000");
        filterConfig.dateTo = filterConfig.dateTo || new Date();
        var newArticles = [];
        if (filterConfig && filterConfig.author){
            for (var i = 0; i < articles.length; i++) {
                if (articles[i].author === filterConfig.author) {
                    newArticles.push(articles[i]);
                }
            }
        }
        else {
            newArticles = articles;
        }
        if(filterConfig && filterConfig.tags){
            newArticles = newArticles.filter(function(article){
                return article.tags.some(function(tag){
                    return tag === filterConfig.tags;
                })
            })
        }
        newArticles = newArticles.filter(function (article){
            return ((article.createdAt > filterConfig.dateFrom) && (article.createdAt < filterConfig.dateTo))
        });
        newArticles = newArticles.sort();
        return newArticles;
    }


    function getArticle(ID){
        for(var i = 0;i < articles.length;i++){
            if(articles[i].id == ID){
                return articles[i];
            }
        }
        return null;
    }
    function validateArticle(object) {
        if (object.author && object.id && object.title && object.summary && object.createdAt
            && object.content && object.tags) {
            if (object.title.length < 100 && object.title !== "" && object.summary.length < 200 && object.summary !== ""
                && object.author !== "" && object.content !== "") {
                if (object.tags != "") {
                    return true;
                } else return false;
            } else return false;
        } else return false;
    }

    function addArticle(article) {
        if(validateArticle(article)){
            articles.push(article);
            articles.sort(function compareDate(a, b) {
                if (a.createdAt < b.createdAt) {
                    return 1;
                } else {
                    return -1;
                }
            });
            localStorage.setItem("articles", JSON.stringify(articles));
            return true;
        }
        else{
            return false;
        }
    }

    function deleteArticle(ID) {
        for(var i = 0;i<articles.length;i++){
            if(articles[i].id == ID){
                articles.splice(i,1);
                localStorage.setItem("articles", JSON.stringify(articles));
                return true;
            }
        }
        return false;
    }

    function addTag(tag) {
        var res = tags.find(function (item, i, arr) {
            return item === tag;
        });
        if (res === undefined) {
            tags.push(tag);
            tags.sort();
            localStorage.setItem("tags", JSON.stringify(tags));
            return true;
        } else return false;
    }

    function editArticle(ID, articleObject) {
        var elem = articles.find(function(item, i, arr) {
            if (item.id == ID)
                return item;
        });
        var index = articles.find(function (item, i, arr) {
            if (item.id == ID)
                return i;
        });
        if (validateArticle(elem)) {
            if (articleObject) {
                if (articleObject.title) {
                    elem.title = articleObject.title;
                }
                if (articleObject.summary) {
                    elem.summary = articleObject.summary;
                }
                if (articleObject.content) {
                    elem.content = articleObject.content;
                }
                if (articleObject.image){
                    elem.image = articleObject.image;
                } else elem.image = null;
                if (articleObject.tags){
                    elem.tags = articleObject.tags;
                }
                elem.tags.forEach(
                    function (item) {
                        addTag(item);
                    }
                );
                articles[index] = elem;
                localStorage.setItem("articles", JSON.stringify(articles));
                localStorage.setItem("tags", JSON.stringify(tags));
                return true;
            }
            return false;
        }
        return false;
    }

    function getArticlesNumber(){
        return articles.length;
    }

    function hasTag(article, tag){
        for(var i = 0;i < article.tags.length;i++){
            return article.tags[i] === tag;
        }
        return false;
    }

    function getTags(){
        return tags;
    }

    return{
        init: init,
        getArticles: getArticles,
        getArticlesCount: getArticlesCount,
        filterArticles: filterArticles,
        getArticle: getArticle,
        validateArticle: validateArticle,
        addArticle: addArticle,
        deleteArticle: deleteArticle,
        editArticle: editArticle,
        getArticlesNumber: getArticlesNumber,
        hasTag: hasTag,
        addTag: addTag,
        getTags: getTags,
        getLastId: getLastId
    };
}());


