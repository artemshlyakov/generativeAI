# Бесплатные генеративные инструменты: статус проверки

Дата проверки: 5 ноября 2026 года. В этом проекте не используются подписки, платные API, покупные кредиты и пробные тарифы с обязательным платёжным способом. Не подключайте тариф и не вводите платёжные данные ради экспонатов.

## 1. Сравнение моделей — получено

В подписанном бесплатном Gemini выбраны «Создание изображений» и формат 16:9. Ровно один раз отправлен полный запрос базового кадра из `ASSET_MANIFEST.md`, без референса. Скачан `assets/model-gemini.jpeg` (1376×768). Интерфейс показывал «Gemini Авто», но не точный идентификатор модели. По официальному описанию бесплатная генерация изображений Gemini использует Nano Banana 2; в паспорте файла это указано как контекст, а не как независимо подтверждённая метка бэкенда. Результат сохранён на сайте рядом с ChatGPT Images.

## 2. Настоящее видео — получено в Google Vids

Личный Google-аккаунт открыл Google Vids и функцию «Создание ИИ-видео → Анимировать». Исходный `assets/city-ai.png` загружен в интерфейс, выбраны **Omni**, 720p, 16:9, 10 секунд. Одна генерация завершилась; клип вставлен в проект и скачан через «Файл → Скачать → Видео (MP4)». Локальный файл `assets/city-animated-google-vids.mp4` проверен: 10,09 с, H.264/AAC, 1920×1080 и 30 кадров/с. Экспортный размер не равен выбранному разрешению генерации. Трамвай приближается, пешеходы перемещаются, камера плавно продвигается; отдельные мелкие фигуры и элементы передней части трамвая меняют форму. Знак генератора оставлен. Интерфейс показывает модель **Omni**, поэтому не приписываем результат Veo.

До этого в Gemini пункт «Создание видео» на бесплатном аккаунте был отмечен замком. В Runway Personal · Free фактический баланс — 0 credits, интерфейс сообщает «You've run out of credits». Справка Runway описывает 125 разовых стартовых кредитов, но в этом аккаунте они не доступны. Kling AI показал 10 бесплатных кредитов при минимальной стоимости проверенного 5-секундного ролика 25; генерацию там не запускали. Luma Dream Machine предлагает бесплатный черновой режим, но после получения видео в Google Vids отдельный вход не потребовался. Платных вариантов не выбирали.

**Фактический запрос в Google Vids** приведён дословно в `ASSET_MANIFEST.md` и на странице `gallery.html`. Ранний альтернативный запрос для Kling (не запускался):

> A continuous cinematic shot of the exact futuristic boulevard in the input image. The central tram moves slowly forward along the existing rails toward the camera; pedestrians walk naturally on both sidewalks; leaves and reflections react subtly to the breeze and city lights. The camera makes a very slow stable dolly forward at street level. Preserve the two curved foreground buildings, both bridges, central towers, trees and tram design throughout. No cuts, no new buildings, no teleporting people, no morphing, no camera shake, no added text or logos. Realistic motion, coherent geometry, restrained cinematic lighting.

Файл и ключевые кадры проверены локально. Водяной знак не удалялся.

## 3. Музыка — проверка Gemini, Suno и AIVA

В бесплатном Gemini выбран режим «Создание музыки», короткая длительность и инструментальная версия. Два прежних запроса получили текстовые отказы «Моя программа не рассчитана на такие задачи» и «Такие вопросы и задачи не для меня. Я всего лишь языковая модель». 5 ноября выполнена ещё одна попытка с жанром «Эмбиент» и точным запросом ниже. Gemini выдал текстовый план трека и прямо написал «I am unable to directly render and output an audio file right now». Аудиофайл не появился. Suno Free создал «Rising Dawn» (V6-MINI, 5 ноября 2026), но в меню Download аккаунт показал «Out of Downloads», Plan free, Downloads 0 и предложил оплату. Файл не извлекался обходным способом. AIVA предлагает бесплатный план с ограниченными скачиваниями MP3/MIDI и условиями некоммерческого использования с указанием AIVA. Пользователь решил самостоятельно заняться аудиоматериалом. Экспонат считается готовым только после получения локального файла и проверки актуальных условий сервиса.

**Исходный запрос для Suno (для AIVA подобрать ближайший стиль, если свободный текст не поддерживается):**

> Instrumental cinematic ambient score for a hopeful future city boulevard at blue hour. Warm analog synthesizer pads, delicate glass-like bell motifs, soft pulsing electronic rhythm around 90 BPM, subtle organic textures and a gentle sense of movement as a tram passes through the city. Elegant and optimistic, not epic or aggressive. Clear beginning and ending, restrained dynamics, no vocals, no spoken words, no recognizable existing melody.

Сохранить скачанный MP3/WAV, указать фактическую модель, дату, запрос, длительность, количество попыток и лицензионные условия бесплатного тарифа. Для некоммерческой учебной выставки не использовать трек в монетизации.

## Официальные справки

- Gemini, бесплатные функции: https://gemini.google/subscriptions/
- Gemini, музыка и скачивание: https://support.google.com/gemini/answer/16635495
- Runway, тарифы: https://runwayml.com/pricing
- Kling, бесплатная генерация с водяным знаком: https://kling.ai/explore/best_image_to_video_ai
- Luma Dream Machine, бесплатный тариф: https://lumalabs.ai/learning-hub/payments-subscriptions
- Pika, нулевая ежемесячная квота Free: https://creation.pika.art/pricing
- Suno, бесплатный тариф: https://help.suno.com/en/articles/2416769
- AIVA, бесплатный план и MP3: https://www.aiva.ai/
