var articlesRender = (function () {

    var articles;
    var tags;
    var user;
    var articleTemplate;
    var articlesList;
    var articleButtons;
    var tagModel;
    var tagList;
    var idForEditing;
    var addArticleButton;
    var userButton;
    
    function init() {
        articleTemplate = document.querySelector("#template-articles-container");
        articlesList = document.querySelector(".content-list");
        articleButtons = document.querySelector('.content-list');
        articleButtons.addEventListener('click', buttons);
        tagModel = articleTemplate.content.querySelector('.tag');
        tagList = articleTemplate.content.querySelector('.news-tags-view div');
        addArticleButton = document.querySelector("#rightCol");
        addArticleButton.addEventListener("click", buttons);
        userButton = document.querySelector("#contact");
        userButton.addEventListener("click", buttons);
        var tags = document.querySelector('.tags-filter');
        for(var i = 0;i < articlesService.getTags().length;i++) {
            tags.innerHTML += '<option>' + articlesService.getTags()[i] + '</option>';
        }
        user = JSON.parse(localStorage.getItem('user'));
        showElementsForUser();
    }

    function showElementsForUser() {
        if (!JSON.parse(localStorage.getItem('user'))){
            document.getElementById("add").style.display = "none";
        } else {
            document.getElementById("add").style.display = "block";
            document.getElementById("name").textContent = user;
            document.getElementById("go").style.display = "none";
            document.getElementById("go-out").style.display = "block";
        }
    }
    
    function buttons(event) {
        if (event.target.getAttribute("class") === "edit"){
            var elem = event.target.parentElement;
            var window = document.getElementById("edit-form");
            var article = articlesService.getArticle(elem.dataset.id);
            window.style.display = "block";
            document.getElementById("popup").style.display = "block";
            window.getElementsByTagName("input")[0].value = article.title;
            document.getElementById("news-description-edit").innerHTML = article.summary;
            document.getElementById("news-content-edit").innerHTML = article.content;
            document.getElementById("news-tags-edit").innerHTML = article.tags;
            document.getElementById("news-picture-edit").innerHTML = article.image;
            idForEditing = elem.dataset.id;
        }
        if (event.target.getAttribute("class") === "delete"){
            var elem = event.target.parentElement;
            articlesService.deleteArticle(elem.dataset.id);
            articlesList.removeChild(elem);
        }
        if (event.target.getAttribute("class") === "in-full") {
            var elem = event.target.parentElement.parentElement;
            var article = articlesService.getArticle(elem.dataset.id);
            document.getElementById("popup").style.display = "block";
            var window = document.getElementById("detailed-article-content");
            window.getElementsByClassName("news-title-view")[0].textContent = article.title;
            window.getElementsByClassName("news-author-view")[0].textContent = article.author;
            var options = {
                year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
            };
            window.getElementsByClassName("news-date-view")[0].textContent = article.createdAt.toLocaleDateString("ru", options);
            window.getElementsByClassName("news-content-view")[0].textContent = article.content;
            window.getElementsByClassName("news-tags-view")[0].textContent = "";
            window.getElementsByClassName("news-tags-view")[0].appendChild(renderTags(article.tags));
            if (article.image) {
                window.getElementsByClassName("news-picture-view")[0].src = article.image;
                document.querySelector(".news-picture-view").style.display = "block";
            } else {
                document.querySelector(".news-picture-view").style.display = "none";
            }
            window.style.display = "block";
        }
        if (event.target.getAttribute("id") === "add"){
            var window = document.getElementById("send-form");
            clearAddingWindow();
            document.getElementById("popup").style.display = "block";
            window.style.display = "block";
        }
        if (event.target.getAttribute("id") === "go"){
            var window = document.getElementById("in-form");
            document.getElementById("popup").style.display = "block";
            window.style.display = "block";
        }
        if (event.target.getAttribute("id") === "go-out"){
            localStorage.setItem("user", JSON.stringify(""));
            document.getElementById("name").textContent = "";
            document.getElementById("go-out").style.display = "none";
            document.getElementById("go").style.display = "block";
            buildArticles();
            showElementsForUser();
        }
    }

    function buttonsClose(event) {
        var elem = event.target.parentElement.parentElement;
            elem.style.display = "none";
        document.getElementById("popup").style.display = "none";
    }

    function buildArticles(filteredArticles) {
        deleteNews();
        if (!filteredArticles) {
            articles = articlesService.getArticles();
        } else {
            articles = filteredArticles;
        }
        for(var i = 0;i < articles.length;i++){
            var art =  articleTemplate;
            if (!JSON.parse(localStorage.getItem('user'))){
                art.content.querySelector(".edit").style.display = "none";
                art.content.querySelector(".delete").style.display = "none";
            } else {
                art.content.querySelector(".edit").style.display = "block";
                art.content.querySelector(".delete").style.display = "block";
            }
            if (articles[i].image){
                art.content.querySelector('.image').style.backgroundImage = "url(" + articles[i].image + ")";
                art.content.querySelector('.image').style.display = 'block';

            } else {
                art.content.querySelector('.image').style.display = 'none';
            }
            art.content.querySelector(".title").textContent = articles[i].title;
            art.content.querySelector(".summary").textContent = articles[i].summary;
            var options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            };
            art.content.querySelector(".date").textContent = articles[i].createdAt.toLocaleDateString("ru", options);
            art.content.querySelector(".author").textContent = articles[i].author;
            art.content.querySelector('.news-tags-view').appendChild(renderTags(articles[i].tags));
            art.content.querySelector('.post').dataset.id = articles[i].id;
            art.content.querySelector('.content').textContent = articles[i].content;
            articlesList.appendChild(art.content.querySelector('.post').cloneNode(true));
        }
    }

    function renderTags(tags) {
        var template = tagModel;
        var listTemplate = tagList;
        listTemplate.innerHTML = '';
        tags.forEach(function (item) {
            template.textContent = item;
            listTemplate.appendChild(template.cloneNode(true));
        });
        return listTemplate;
    }

    function editArticle(event) {
        var window = event.target.parentElement;
        var article = {id: idForEditing, title: "", summary: "", content: "",author: "",createdAt: "",tags: [], image: ""};
        article.title = window.getElementsByTagName("input")[0].value;
        article.summary = document.getElementById("news-description-edit").value;
        article.content = document.getElementById("news-content-edit").value;
        article.tags = document.getElementById("news-tags-edit").value.split(",");
        var tags = document.querySelector('.tags-filter');
        article.tags.forEach(function(tag) {
            if (articlesService.addTag(tag)) {
                tags.innerHTML += '<option>' + tag + '</option>';
            }
        });
        article.image = document.getElementById("news-picture-edit").value;
        if (article.image = ""){
            article.image = undefined;
        }
        articlesService.editArticle(idForEditing, article);
        buildArticles();
        window.parentElement.style.display = "none";
        document.getElementById("popup").style.display = "none";
    }
    function addArticle(event) {
        var window = event.target.parentElement;
        var id = articlesService.getLastId();
        var article = {id: id + 1, title: "", summary: "", content: "",author: "",createdAt: new Date(),tags: [], image: ""};
        article.title = window.getElementsByTagName("input")[0].value;
        article.author = user;
        article.summary = document.getElementById("news-description").value;
        article.content = document.getElementById("news-content").value;
        article.tags = document.getElementById("news-tags").value.split(",");
        var tags = document.querySelector('.tags-filter');
        if (article.tags != "") {
            article.tags.forEach(function (tag) {
                if (articlesService.addTag(tag)) {
                    tags.innerHTML += '<option>' + tag + '</option>';
                }
            });
        }
        article.image = document.getElementById("news-picture").value;
        articlesService.addArticle(article);
        if (articlesService.validateArticle(article)) {
            buildArticles();
            window.parentElement.style.display = "none";
            document.getElementById("popup").style.display = "none";
        }
    }

    function clearAddingWindow() {
        var window = document.getElementById("send-form");
        window.getElementsByTagName("input")[0].value = null;
        document.getElementById("news-description").value = null;
        document.getElementById("news-content").value = null;
        document.getElementById("news-tags").value = null;
        document.getElementById("news-picture").value = null;
    }

    function deleteNews() {
        articlesList.innerHTML = "";
    }

    function setUser(event) {
        var window = event.target.parentElement;
        var login = document.getElementById("login").value;
        var password = document.getElementById("password").value;
        if (login && password){
            if (database.getAccount(login, password)){
                window.parentElement.style.display = "none";
                document.getElementById("popup").style.display = "none";
                user = login;
                localStorage.setItem('user', JSON.stringify(user));
                buildArticles();
                showElementsForUser();
            }
        }
    }

    return{
        init: init,
        buildArticles: buildArticles,
        buttonsClose: buttonsClose,
        editArticle: editArticle,
        deleteNews: deleteNews,
        buttons: buttons,
        addArticle: addArticle,
        setUser: setUser
    }
}());













