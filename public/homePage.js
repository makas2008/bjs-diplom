"use strict";

// ---------- 1. Выход из личного кабинета (log out): ----------
const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout(response => {
    // Варианты response:
    // { success: true }
    // { success: false, error: "Пользователь не авторизован"}
    if (response.success) {
      location.reload();
    }
  });
};

// ---------- 2. Получение информации о пользователе: ----------
ApiConnector.current(response => {
  // { success: true,
  //   data: { created_at: "2019-10-15",
  //           login: "oleg@demo.ru",
  //           password: "demo",
  //           id: 1,
  //           balance: {EUR: 20, NTC: 3000, RUB: 1000, USD: 20}
  //         }
  // }
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

// ---------- 3. Получение текущих курсов валюты: ----------
const ratesBoard = new RatesBoard();

function getCurrencyRate() {
  ApiConnector.getStocks(response => {
    // { success: true,
    //   data: { RUB_USD: 92.4102, RUB_EUR: 99.4889, RUB_NTC: 12.2421,
    //           USD_RUB: 0.01082, USD_EUR: 0.92885, USD_NTC: 7.54856,
    //           EUR_RUB: 0.01005, EUR_USD: 1.0766, EUR_NTC: 8.12678,
    //           NTC_RUB: 0.08169, NTC_USD: 0.13248, NTC_EUR: 0.12305,
    //         }
    // }
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });

  setTimeout(getCurrencyRate, 1000 * 60);
}

getCurrencyRate();

// ---------- 4. Операции с деньгами: ----------
const moneyManager = new MoneyManager();

// 4.1 -> пополнение баланса:
moneyManager.addMoneyCallback = money => {
  // { amount: "1000", currency: "RUB" } <- money
  ApiConnector.addMoney(money, response => {
    // Полученный response:
    // { success: true,
    //   data: { created_at: "2019-10-15",
    //           login: "oleg@demo.ru",
    //           password: "demo",
    //           id: 1,
    //           balance: {RUB: 3001, EUR: 3002, USD: 3023, NTC: 5004}
    //         }
    // }
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Баланс пополнен!");
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

// 4.2 -> конвертирование валюты:
moneyManager.conversionMoneyCallback = money => {
  ApiConnector.convertMoney(money, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Конвертация выполнена!");
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

// 4.3 -> перевод валюты:
moneyManager.sendMoneyCallback = money => {
  ApiConnector.transferMoney(money, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Перевод выполнен!");
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

// ---------- 5. Работа с избранным: ----------
const favoritesWidget = new FavoritesWidget();

// 5.1 -> начальный список избранного:
ApiConnector.getFavorites(response => {
  // { success: true,
  //   data: {
  //     "2": "Ваня дурачок",
  //     "3": "Пират Петр",
  //   },
  // }
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

// 5.2 -> добавление пользователя в список избранных:
favoritesWidget.addUserCallback = user => {
  // { id: "4", name: "secret"} <- user
  ApiConnector.addUserToFavorites(user, response => {
    // Варианты response:
    // { success: true,
    //   data: {
    //     "2": "Ваня дурачок",
    //     "3": "Пират Петр",
    //     "4": "secret"
    //   }
    // }
    // {success: false, error: "Такой пользователь уже есть в списке"}
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, "Пользователь добавлен!");
    } else {
      favoritesWidget.setMessage(response.success, response.error);
    }
  });
};

// 5.3 -> удаление пользователя из избранного:
favoritesWidget.removeUserCallback = id => {
  // 5 <- id удаляемого юзера

  ApiConnector.removeUserFromFavorites(id, response => {
    // Полученный response:
    // { success: true,
    //   data: {
    //     2: "Ваня дурачок", 
    //     3: "Пират Петр", 
    //     4: "secret",
    //   }
    // }
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, "Пользователь удалён!");
    } else {
      favoritesWidget.setMessage(response.success, response.error);
    }
  });
};
