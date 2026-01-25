const API_KEY = 'a6e83e43cbfa756ad6ca52770aa538ee';
const CITY = 'Kyiv'; // Можна змінити на будь-яке місто
const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=uk`;

const weatherInfo = document.getElementById('weather-info');
const refreshBtn = document.getElementById('refresh-weather');

// 2 години у мілісекундах (2 * 60 хвилин * 60 секунд * 1000 мс)
const TWO_HOURS = 2 * 60 * 60 * 1000;

function updateWeather() {
  const lastFetch = localStorage.getItem('weather_timestamp');
  const cachedData = localStorage.getItem('weather_data');
  const now = Date.now();

  // Перевіряємо: чи є дані і чи минуло менше 2 годин
  if (lastFetch && cachedData && (now - lastFetch < TWO_HOURS)) {
    console.log("Дані завантажено з localStorage (минуло менше 2 годин)");
    displayWeather(JSON.parse(cachedData));
  } else {
    console.log("Запит до API (дані застаріли або відсутні)");
    fetchWeather();
  }
}

async function fetchWeather() {
  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error('Помилка мережі');

    const data = await response.json();

    // Зберігаємо дані та поточний час у localStorage
    localStorage.setItem('weather_data', JSON.stringify(data));
    localStorage.setItem('weather_timestamp', Date.now().toString());

    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p style="color:red">Не вдалося отримати погоду: ${error.message}</p>`;
  }
}

function displayWeather(data) {
  const { main, weather, name } = data;
  weatherInfo.innerHTML = `
        <p><strong>Місто:</strong> ${name}</p>
        <p><strong>Температура:</strong> ${Math.round(main.temp)}°C</p>
        <p><strong>Стан:</strong> ${weather[0].description}</p>
        <p><small>Оновлено: ${new Date(parseInt(localStorage.getItem('weather_timestamp'))).toLocaleTimeString()}</small></p>
    `;
}

// Слухач для кнопки (примусове оновлення, якщо треба)
refreshBtn.addEventListener('click', fetchWeather);

// Запуск при завантаженні сторінки
updateWeather();