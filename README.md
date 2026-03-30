# STO-KRASNODARA — modern rebuild

Статический многостраничный сайт автосервиса с сохранением фактических данных из архивной версии `sto-krasnodara.ru`.

## Запуск локально
1. Откройте `index.html` в браузере.
2. Или поднимите локальный сервер в этой папке:
   - `python -m http.server 8080`
   - `http://localhost:8080`

## Страницы
- `index.html` — Главная
- `uslugi.html` — Услуги
- `praice.html` — Прайс
- `o_nas.html` — О нас
- `contakti.html` — Контакты
- `news.html` — Новости
- `aktciya.html` — Акции
- `vyezdnoy-servis.html` — Выездной сервис
- `uslugi/*.html` — отдельные страницы ключевых услуг

## Данные
- Адрес, телефоны, базовые разделы и структура услуг сохранены.
- Прайс собран из архивной страницы `praice.php` и выведен через `assets/js/price-data.js`.
- Карта на странице контактов использует исходный Yandex constructor ID из старого сайта.

## Миграция URL
- Таблица редиректов: `url-redirects.tsv`
- Пример правил Apache: `.htaccess`
