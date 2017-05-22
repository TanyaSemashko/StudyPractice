'use strict';

document.addEventListener('DOMContentLoaded', start);
function start() {
       articlesService.init();
       articlesRender.init();
       articlesRender.buildArticles();
       filter.init();
}

