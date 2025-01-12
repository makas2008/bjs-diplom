const logoutButton = new LogoutButton();

logoutButton.action = () => {
    const callback = (response) => {
        if (response.success) {
            location.reload();
        }
    }
    ApiConnector.logout(callback);
}

// Получение информации о пользователе

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

// Получение текущих курсов валюты

const ratesBoard = new RatesBoard();

const updateRatesBoard = () => {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}
updateRatesBoard();

setInterval(() => {
    updateRatesBoard();
}, 60000);



// Операции с деньгами

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
    
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, 'успешно');
        }else {
            moneyManager.setMessage(response.error, 'ошибка');
        }
    })
}


moneyManager.conversionMoneyCallback = (data) => {

    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, 'успешно');
        } else {
            moneyManager.setMessage(response.error, 'ошибка');
        }
    })
}

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {

        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, 'успешно');
        } else {
            moneyManager.setMessage(response.error, 'ошибка');
        }
    })
}



// Работа с избранным

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
    if(response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
})

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
   
        if(response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, 'успешно');
        } else {
            favoritesWidget.setMessage(response.error, 'ошибка');
        }
    })
}

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
    
        if(response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
           favoritesWidget.setMessage(response.success, 'успешно');
        } else {
            favoritesWidget.setMessage(response.error, 'ошибка');
        }
    })
}