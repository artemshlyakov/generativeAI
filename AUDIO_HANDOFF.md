# Добавление авторской AI-композиции

Сайт и отчёты не приписывают себе создание аудио. Когда готовый трек будет получен, сохраните файл в `assets/` под именем `future-city-ai.mp3`. Используйте только материал, который можно скачать и применять в некоммерческом учебном проекте по условиям выбранного сервиса.

Предлагаемый запрос: «Instrumental cinematic ambient score for a hopeful future city boulevard at blue hour. Warm analog synthesizer pads, delicate glass-like bell motifs, soft pulsing electronic rhythm around 90 BPM, subtle organic textures and gentle movement as a tram passes through the city. Elegant, optimistic, restrained, no vocals, no spoken words, no recognizable existing melody.»

После генерации запишите название сервиса и модели (если сервис её показывает), точный запрос и настройки, дату, длительность, тип лицензии и требуемое указание авторства. Замените в `gallery.html` блок `<div class="media-pending sound">…</div>` на:

```html
<figure class="audio-exhibit">
  <audio controls preload="metadata">
    <source src="assets/future-city-ai.mp3" type="audio/mpeg">
    Ваш браузер не поддерживает MP3.
  </audio>
  <figcaption>Название трека · сервис и модель · дата · условия атрибуции</figcaption>
</figure>
```

Добавьте точные сведения и запрос в `ASSET_MANIFEST.md`, обновите `README.md` и лабораторные отчёты, затем проверьте воспроизведение локально без доступа к сети. Не оставляйте проигрыватель со ссылкой на отсутствующий файл и не называйте аудио AI-генерацией без подтверждённого происхождения.
