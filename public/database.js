var database = (function () {
    var accounts = [
        {
            login: 'Таня Семашко',
            password: '11111',
        },
        {
            login: 'Иван Иванов',
            password: '22222',
        },
        {
            login: 'Петр Петрович',
            password: '33333',
        }
    ];

    function getAccount(login, password) {
        var found = accounts.find(function (item, i, arr) {
            return item.login === login;
        });
        if (found && found.password === password)
            return found;
        return null;
    }

    return {
        getAccount: getAccount
    }

}());
