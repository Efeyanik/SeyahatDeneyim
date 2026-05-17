// Sayfada şehirlerin basılacağı alanları ve arama elemanlarını seçiyoruz
const cityGrid = document.getElementById('allCitiesGrid');
const featuredGrid = document.getElementById('featuredCities');
const searchInput = document.getElementById('citySearchInput');
const resultInfo = document.getElementById('cityResultInfo');

// Şehir verilerini data klasöründeki iller.json dosyasından çekiyoruz
fetch('/data/iller.json')
    .then(response => response.json())
    .then(cities => {

        // Eğer ana sayfadaysak sadece seçili popüler şehirleri gösteriyoruz

        if (featuredGrid) {
            const popularCityIds = [34, 7, 35, 6, 61];

            const popularCities = cities.filter(city =>
                popularCityIds.includes(city.id)
            );

            showCities(popularCities, featuredGrid);
        }
        // Eğer tüm şehirler sayfasındaysak 81 ilin tamamını listeliyoruz
        if (cityGrid) {
            showCities(cities, cityGrid);
            resultInfo.innerText = `${cities.length} şehir listeleniyor.`;

            // Arama kutusuna yazıldıkça şehir listesini filtreliyoruz
            searchInput.addEventListener('input', () => {
                const searchText = searchInput.value.toLocaleLowerCase('tr-TR');

                const filteredCities = cities.filter(city =>
                    city.name.toLocaleLowerCase('tr-TR').includes(searchText)
                );

                showCities(filteredCities, cityGrid);
                resultInfo.innerText = `${filteredCities.length} şehir listeleniyor.`;
            });
        }
    });

    // Verilen şehir listesini ilgili HTML alanına kart olarak basan fonksiyon

function showCities(cities, container) {
    container.innerHTML = '';

    cities.forEach(city => {
        // Her şehir için tıklanabilir bir şehir kartı oluşturuyoruz
        container.innerHTML += `
            <a href="/views/city.html?id=${city.id}" class="city-list-card">
                <img 
                    src="${city.image_url}" 
                    alt="${city.name}" 
                    class="city-list-image"
                    loading="lazy"
                >

                <div class="city-list-content">
                    <h3>${city.name}</h3>
                    <p>${shortenText(city.description)}</p>
                    <span>Rotaları ve Detayları Gör</span>
                </div>
            </a>
        `;
    });
}

// Uzun şehir açıklamalarını kart içinde daha kısa göstermek için kullanılır
function shortenText(text) {
    if (text.length > 120) {
        return text.substring(0, 120) + '...';
    }

    return text;
}