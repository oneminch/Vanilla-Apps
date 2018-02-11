const showTagBtn = document.querySelector('.show-tags');     // Show tags button
const tagContainer = document.querySelector('.tags');        // Container of tags
const tags = tagContainer.querySelectorAll('.tag');          // Each tag
const refresh = document.querySelector('.refresh');          // Refresh page button
const bookmarks = document.querySelector('.bookmarks');      // Show bookmarks button
const bookmarkList = document.querySelector('.bookmarks-list');      // Bookmarks container
const mainBody = document.querySelector('.main-body');       // Main body: Date & Articles
const dailyInfo = document.querySelector('.daily-info');     // Daily Info: Date and weather
const date = document.querySelector('.date');                // Date
const weather = document.querySelector('.weather');          // Weather
const temperature = document.querySelector('.temperature');  // Temperature
const weatherStatus = document.querySelector('.status');     // Weather Status

// Main Articles: Featured and others with image
const mainArticles = document.querySelector('.main-articles');
// Imageless Articles
const imglessArticles = document.querySelector('.imageless-articles');

// Date
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];       // Name of days
const months  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];   // Name of Months
const now = new Date();
const day = days[now.getDay()];
const month = months[now.getMonth()];
let today = now.getDate();
let year = now.getFullYear();
today = today.toString();
year = year.toString();

// Display date
date.innerHTML = `${day} <br> ${month} ${today}, ${year}`;

// Fetch news on load
fetchNews();

// Expands and collpases tags
showTagBtn.addEventListener('click',function() {
   document.body.classList.toggle('collapse-tags');
   const rect = mainBody.getBoundingClientRect();
   mainBody.style.transform = `translateY(-${rect.top - 60}px)`;
});

bookmarks.addEventListener('click', () => {
   bookmarkList.classList.toggle('open-bookmarks-list');
});

// Fetch news with tag name
tags.forEach(tag => tag.addEventListener('click', () => {
   // Get current tag name
   const tagName = tag.dataset.tag;
   // Clear any current active tag property
   for (let i = 0; i < tags.length; i++) {
      tags[i].style.fontWeight = "normal";
   }
   // Assign active property to clicked tag
   tag.style.fontWeight = "bolder";
   // Fetch news with clicked tag name
   fetchNews(tagName);
}));

// Check if Geolocation is allowed or blocked for weather
if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(success,fail);
}

// Fetch weather if Geolocation is successful
function success(position) {
   dailyInfo.style.height = '140px';
   weather.style.borderBottom = '1px solid #ccc';
   weather.style.height = '60px';
   // API URL
   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=0036c88f0dd7246332045207bf44130f&units=metric`;
   // Get Weather Data in JSON Format
   $.getJSON(url,function(data) {
      console.log(data);
      
      // Get Temperature in Celcius
      let celcius = data.main.temp;
      celcius = celcius.toFixed(1);

      // Updates weather status icon and temperature
      if (data.weather[0].id >= 200 && data.weather[0].id <= 232) {
         weather.innerHTML =  `<i class="ion-ios-thunderstorm-outline"></i>      ${celcius}&deg;C`;
      } else if ((data.weather[0].id >= 300 && data.weather[0].id <= 321) || (data.weather[0].id >= 500 && data.weather[0].id <= 531)) {
         weather.innerHTML =  `<i class="ion-ios-rainy-outline"></i>      ${celcius}&deg;C`;
      } else if (data.weather[0].id >= 600 && data.weather[0].id <= 622) {
         weather.innerHTML =  `<i class="ion-ios-snowy"></i>      ${celcius}&deg;C`;
      } else if ((data.weather[0].id >= 701 && data.weather[0].id <= 781) || (data.weather[0].id >= 951 && data.weather[0].id <= 962)) {
         weather.innerHTML =  `<i class="ion-ios-rainy-outline"></i>      ${celcius}&deg;C`;
      } else if (data.weather[0].id == 800) {
         weather.innerHTML =  `<i class="ion-ios-sunny-outline"></i>      ${celcius}&deg;C`;
      } else if (data.weather[0].id == 801) {
         weather.innerHTML =  `<i class="ion-ios-partlysunny-outline"></i>      ${celcius}&deg;C`;
      } else if (data.weather[0].id >= 802 && data.weather[0].id <= 804) {
         weather.innerHTML =  `<i class="ion-ios-cloudy-outline"></i>      ${celcius}&deg;C`;
      } else if (data.weather[0].id == 906) {
         weather.innerHTML =  `<i class="ion-ios-snowy"></i>      ${celcius}&deg;C`;
      } else {
         weather.innerHTML =  `<i class="ion-thermometer"></i>      ${celcius}&deg;C`;
      }

   });
}
// Run if Geolocation fails
function fail(error) {
   // Don't display anything
   console.log(error);
}

// Fetch news
function fetchNews(tagName) {
   let query;

   // Assign tag name
   if (!tagName) {
      query = '';
   } else {
      query = `&category=${tagName}`
   }
   // URL to be sent 
   const newsUrl = `https://newsapi.org/v2/top-headlines?country=us${query}&apiKey=a30e1995b1c948fca82a16cf20634584`;
   // Articles array
   let articles = [];
   // API Call
   $.ajax({
      url: newsUrl,
      dataType: 'json',
      success: (data) => {
         // Empty article containers for new request
         mainArticles.innerHTML = '';
         imglessArticles.innerHTML = ''; 
         // Copy articles from response to custom array
         for (let i = 0; i < data.totalResults; i++) {
            articles.push(data.articles[i]);
         }
         // Add first article with image to the featured section
         for (let i = 0; i < articles.length; i++) {
            if (articles[i].urlToImage != null) {
               // Create Featured container
               const featured = document.createElement('div');
               featured.classList.add('featured');
               featured.style.background = `linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,1) 80%), url('${articles[i].urlToImage}')`;
               // Create Info section
               const featuredInfo = document.createElement('div');
               featuredInfo.classList.add('featured-info');
               // Create featured label
               const featuredLabel = document.createElement('span');
               featuredLabel.classList.add('featured-label');
               featuredLabel.textContent = 'Featured';
               // Create featured title
               const featuredTitle = document.createElement('a');
               featuredTitle.classList.add('featured-title');
               featuredTitle.textContent = articles[i].title;
               featuredTitle.target = '_blank';
               featuredTitle.href = articles[i].url;
               // Create featured source
               const featuredSource = document.createElement('p');
               featuredSource.classList.add('featured-source');
               featuredSource.textContent = articles[i].source.name;
               // Create featured bookmark button
               const featuredBookmark = document.createElement('div');
               featuredBookmark.classList.add('featured-buttons','bookmark');
               featuredBookmark.innerHTML = '<i class="ion-android-bookmark"></i>';
               // Create featured share button
               const featuredShare = document.createElement('div');
               featuredShare.classList.add('featured-buttons','share');
               featuredShare.innerHTML = '<i class="ion-ios-upload-outline"></i>';
               // Append content to info section
               featuredInfo.appendChild(featuredLabel);
               featuredInfo.appendChild(featuredTitle);
               featuredInfo.appendChild(featuredSource);
               featuredInfo.appendChild(featuredBookmark);
               featuredInfo.appendChild(featuredShare);
               // Append info to featured container
               featured.appendChild(featuredInfo);
               // Append featured container to articles
               mainArticles.appendChild(featured);
               // Remove article from array
               articles.splice(i,1);
               // Exit loop
               break;
            }
         }
         // Create container of articles with image
         const articlesContainer = document.createElement('div');
         articlesContainer.classList.add('articles');

         articles.forEach(function(article) {
            if (article.urlToImage != null) {               
               const articleItem = document.createElement('div');
               articleItem.classList.add('article');

               const articleImage = document.createElement('div');
               articleImage.classList.add('image');
               articleImage.style.backgroundImage = `url('${article.urlToImage}')`;

               const articleInfo = document.createElement('div');
               articleInfo.classList.add('article-info');

               const articleTitle = document.createElement('a');
               articleTitle.classList.add('article-title');
               articleTitle.textContent = article.title;
               articleTitle.target = '_blank';
               articleTitle.href = article.url;

               const articleSource = document.createElement('p');
               articleSource.classList.add('article-source');
               articleSource.textContent = article.source.name;

               const articleButtons = document.createElement('div');
               articleButtons.classList.add('buttons');

               const articleTime = document.createElement('p');
               articleTime.classList.add('timePublished');
               articleTime.textContent = '';

               const articleBookmark = document.createElement('div');
               articleBookmark.classList.add('article-buttons','bookmark');
               articleBookmark.innerHTML = '<i class="ion-android-bookmark"></i>';

               const articleShare = document.createElement('div');
               articleShare.classList.add('article-buttons','share');
               articleShare.innerHTML = '<i class="ion-ios-upload-outline"></i>';

               articleButtons.appendChild(articleTime);
               articleButtons.appendChild(articleShare);
               articleButtons.appendChild(articleBookmark);

               articleInfo.appendChild(articleTitle);
               articleInfo.appendChild(articleSource);

               articleItem.appendChild(articleImage);
               articleItem.appendChild(articleInfo);
               articleItem.appendChild(articleButtons);

               articlesContainer.appendChild(articleItem);
            } else {
               const imglessArticle = document.createElement('div');
               imglessArticle.classList.add('imageless-article');

               const imglessInfo = document.createElement('div');
               imglessInfo.classList.add('imageless-article-info');

               const imglessTitle = document.createElement('a');
               imglessTitle.classList.add('imageless-article-title');
               imglessTitle.textContent = article.title;
               imglessTitle.target = '_blank';
               imglessTitle.href = article.url;

               const imglessSource = document.createElement('p');
               imglessSource.classList.add('imageless-article-source');
               imglessSource.textContent = article.source.name;

               const imglessButtons = document.createElement('div');
               imglessButtons.classList.add('buttons');

               const imglessTime = document.createElement('p');
               imglessTime.classList.add('timePublished');
               imglessTime.textContent = '';

               const imglessBookmark = document.createElement('div');
               imglessBookmark.classList.add('imageless-article-buttons','bookmark');
               imglessBookmark.innerHTML = '<i class="ion-android-bookmark"></i>';

               const imglessShare = document.createElement('div');
               imglessShare.classList.add('imageless-article-buttons','share');
               imglessShare.innerHTML = '<i class="ion-ios-upload-outline"></i>';

               imglessButtons.appendChild(imglessTime);
               imglessButtons.appendChild(imglessShare);
               imglessButtons.appendChild(imglessBookmark);

               imglessInfo.appendChild(imglessTitle);
               imglessInfo.appendChild(imglessSource);

               imglessArticle.appendChild(imglessInfo);
               imglessArticle.appendChild(imglessButtons);

               imglessArticles.appendChild(imglessArticle);
            }
         });
         mainArticles.appendChild(articlesContainer);
      },
      fail: (error) => {
         console.log(error);
         // const errMsg = "<h2>Sorry, something went wrong!</h2>";
         // mainArticles.style.height = '75px';
         // mainArticles.appendChild(errMsg);
         mainArticles.innerHTML = error;
      }
   });  
}