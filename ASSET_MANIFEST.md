# Паспорт материалов GENESIS AI

Дата создания изображений: 5 ноября 2026 года. Инструмент: ChatGPT Images через доступный в этом проекте генератор изображений OpenAI. Конкретный внутренний идентификатор версии модели инструмент не сообщил; мы его не выдумываем. Все файлы сохранены локально в `assets/`.

| Файл | Метод | Исходный материал | Наблюдение |
| --- | --- | --- | --- |
| `city-ai.png` | Text-to-image | Текст ниже | Симметричный бульвар, зелёные террасы, центральный трамвай; мелкая надпись на нём нечёткая. |
| `day-ai.png` | Image editing | `city-ai.png` + запрос ниже | Дневной свет; архитектура в целом сохранена, мелкие детали изменены. |
| `night-ai.png` | Image editing | `city-ai.png` + запрос ниже | Ночные окна и отражения; небольшие различия людей и фасадов. |
| `simple-prompt-ai.png` | Text-to-image | Короткий запрос ниже | Крупный трамвай и вывески, иная композиция. |
| `model-gemini.jpeg` | Text-to-image, Gemini Images | Тот же полный базовый запрос без референса, формат 16:9 | Трамвай правее центра, больше пешеходов и купол на дальнем плане; мелкий текст на табло нечитаем. |
| `city-animated-google-vids.mp4` | Image-to-video, Google Vids «Анимировать», модель Omni | `city-ai.png` + запрос ниже | Трамвай и камера движутся навстречу друг другу, люди идут; основные здания и мосты сохраняются, мелкие фигуры и элементы трамвая меняются. Видимый знак генератора сохранён. |

## Полные запросы

**Базовый кадр**

> Create a refined cinematic concept art image for a modern digital museum exhibition about generative AI. A visionary future city boulevard at blue hour, symmetrical street-level perspective, lush planted terraces integrated in architecture, a sleek tram in the center, human-scale pedestrians, atmospheric violet and teal light, careful coherent architectural geometry, no lettering, no logo, no text. Wide 16:9 composition, editorial art direction, highly detailed but tasteful, premium science museum feel. This is an original generated visual exhibit.

**Дневное редактирование**

> Edit the supplied image as an architectural continuity study. Produce a photorealistic clear DAY version of precisely the same future-city boulevard. Preserve the exact framing and perspective, every major building outline, the left and right curved rooflines, central slender towers and two bridges, tree positions, sidewalk and rail lines, and the tram's position and silhouette. Change ONLY lighting and atmosphere: crisp late morning sun, pale cyan sky, believable daylight reflections, natural green foliage, illuminated by sunlight rather than magenta lights. No new buildings, vehicles, signs or camera shift. No added text. High resolution wide composition.

**Ночное редактирование**

> Edit the supplied image as an architectural continuity study. Produce a photorealistic NIGHT version of precisely the same future-city boulevard. Preserve the exact framing and perspective, every major building outline, left and right curved rooflines, central slender towers and two bridges, tree positions, sidewalk and rail lines, and the tram's position and silhouette. Change ONLY lighting and atmosphere: deep cobalt night sky, realistic warm windows, restrained violet and cyan architectural lighting and wet pavement reflections. Keep people and tram in the same locations. No new buildings, vehicles, signs or camera shift. No added text. High resolution wide composition.

**Короткий запрос**

> A futuristic city street with a tram.

В эксперименте «Сила промпта» исходный запрос для подробного варианта — полный запрос базового кадра выше. Две генерации независимы; не утверждается, что различия вызваны только длиной текста.

**Анимация исходного кадра — Google Vids / Omni, 5 ноября 2026 года**

> Animate the uploaded image as the exact opening frame. Keep the same boulevard, buildings, bridges, trees, tram tracks, camera angle and composition throughout. The single tram glides slowly toward the camera along its rails; pedestrians on both sidewalks walk naturally at different speeds; cherry blossoms and hanging greenery sway gently in a light breeze. Reflections from the violet and teal lights shimmer subtly on the pavement. A very gentle forward camera push, stable and cinematic. Dusk lighting remains consistent. No new vehicles, no extra people suddenly appearing, no morphing architecture, no cuts, no text overlays. Natural, physically coherent motion.

Одна генерация в бесплатных возможностях личного аккаунта. В интерфейсе выбран режим «Анимировать», Omni, 720p, горизонтально, 10 с. После вставки клипа в проект Vids выполнено «Файл → Скачать → Видео (MP4)». Полученный файл H.264/AAC, 1920×1080, 30 кадров/с, 10,09 с. Размер экспорта выше выбранных 720p и сам по себе не означает, что модель создала исходный кадр в 1080p. Исходное изображение 1672×941. Версию или внутренний идентификатор Omni сервис не показал; не называем этот конкретный ролик Veo без подтверждения.

## Сведения о втором генераторе и аудио

Второй кадр получен 5 ноября 2026 года через бесплатный режим создания изображений Gemini. Скачанный исходный JPEG — 1376×768. В интерфейсе выбран Gemini «Авто» и инструмент «Изображения»; точный идентификатор внутренней модели не отображался. Google описывает бесплатный инструмент как Nano Banana 2, но мы не приписываем файлу неподтверждённый точный бэкенд. Сгенерированное музыкальное аудио пока отсутствует; ход проверки — в `GENERATION_BRIEF.md`.
