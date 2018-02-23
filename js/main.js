const showTagBtn = document.querySelector('.show-tags');     // Show tags button
const tagContainer = document.querySelector('.tags');        // Container of tags
const tags = tagContainer.querySelectorAll('.tag');          // Each tag
const refresh = document.querySelector('.refresh');          // Refresh page button
const bookmarks = document.querySelector('.bookmarks');      // Show bookmarks button
const mainBody = document.querySelector('.main-body');       // Main body: Date & Articles
const dailyInfo = document.querySelector('.daily-info');     // Daily Info: Date and weather
const date = document.querySelector('.date');                // Date
const weather = document.querySelector('.weather');          // Weather
const temperature = document.querySelector('.temperature');  // Temperature
const weatherStatus = document.querySelector('.status');     // Weather Status
const bookmarkList = document.querySelector('.bookmarks-list');      // Bookmarks container
const bookmarkArticleBtns = document.querySelectorAll('.bookmark'); // Bookmark article


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

// Check if Geolocation is allowed or blocked for weather
if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(success,fail);
}
// Fetch weather if Geolocation is successful
function success(position) {
   // if (window.innerWidth > 876) {
      dailyInfo.style.height = '140px';
      weather.style.borderBottom = '1px solid #ccc';
      weather.style.height = '60px';
   // }
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
         weather.innerHTML =  `${celcius}&deg;C`;
      }

   });
}
// Run if Geolocation fails
function fail(error) {
   // Don't display anything
   console.log(error);
}

// Checks if bookmark list is empty
function isListEmpty() {
   if (bookmarkList.childElementCount > 0) {
      // If not empty remove empty message
      if (bookmarkList.children[0].tagName == "H5")
         bookmarkList.removeChild(bookmarkList.children[0]);
   } else {
      // If empty add empty message
      const noBookmarkMsg = document.createElement('h5');
      noBookmarkMsg.textContent = "You have no saved bookmarks!";
      bookmarkList.appendChild(noBookmarkMsg);
      bookmarkList.style.textAlign = 'center';
      noBookmarkMsg.style.lineHeight = '50px';      
   }
}

function shareArticle() {
   // Get title
   // Get source
   // Get url
   // Shorten url
}

// Saves bookmarks to localStorage
function saveBookmarks(title,source,url) {
	let bookmarks;

	const bookmark = {
		artclTitle: title,
		artclSource: source,
		artclURL: url
	};

   if (localStorage.getItem('bookmarks') === null) {
		bookmarks = [];
		bookmarks.push(bookmark);
		localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
	} else {
		bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
		bookmarks.push(bookmark);
		localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
	}
}

// Deletes bookmarks
function deleteBookmarks() {}

// Populates bookmark list
function populateBookmarks(title,source,url) {
   // Checks if bookmark list is empty
   isListEmpty();

   // Create bookmark article container
   const bookmarkItem = document.createElement('div');
   bookmarkItem.classList.add('bookmarked-article');

   // Create title and source container
   const bookmarkInfo = document.createElement('div');
   bookmarkInfo.classList.add('bookmarked-article-info');

   // Create title with link
   const bookmarkTitle = document.createElement('a');
   bookmarkTitle.classList.add('bookmarked-article-title');
   bookmarkTitle.textContent = title;
   bookmarkTitle.target = '_blank';
   bookmarkTitle.href = url;

   // Create source
   const bookmarkSource = document.createElement('p');
   bookmarkSource.classList.add('bookmarked-article-source');
   bookmarkSource.textContent = source;

   // Create Buttons Container: Delete bookmark
   const bookmarkButtons = document.createElement('div');
   bookmarkButtons.classList.add('buttons');

   // Create delete button and attach function to it
   const bookmarkDelete = document.createElement('div');
   bookmarkDelete.classList.add('bookmarked-article-buttons','delete');
   bookmarkDelete.innerHTML = '<i class="ion-trash-a"></i>';
   bookmarkDelete.addEventListener('click', function() {
      bookmarkList.removeChild(this.parentElement.parentElement);
      isListEmpty();
   });

   // Append Delete button to button container
   bookmarkButtons.appendChild(bookmarkDelete);
   // Append title and source to info container
   bookmarkInfo.appendChild(bookmarkTitle);
   bookmarkInfo.appendChild(bookmarkSource);
   // Append info and button containers to article
   bookmarkItem.appendChild(bookmarkInfo);
   bookmarkItem.appendChild(bookmarkButtons);
   // Append article to list
   bookmarkList.appendChild(bookmarkItem);
}

// Fetch news
function fetchNews(tagName) {
      
   let query;

   // Assign tag name
	query = !tagName ? '' : `&category=${tagName}`;
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
               featuredTitle.classList.add('featured-title','title');
               featuredTitle.textContent = articles[i].title;
               featuredTitle.target = '_blank';
               featuredTitle.href = articles[i].url;
               // Create featured source
               const featuredSource = document.createElement('p');
               featuredSource.classList.add('featured-source','source');
               featuredSource.textContent = articles[i].source.name;
               // Create featured bookmark button
               const featuredBookmark = document.createElement('div');
               featuredBookmark.classList.add('featured-buttons','bookmark');
               featuredBookmark.innerHTML = '<i class="ion-android-bookmark"></i>';
               featuredBookmark.addEventListener('click', function() {
                  const article = this.parentElement.parentElement;
                  const title = article.querySelector('.title').textContent;
                  const source = article.querySelector('.source').textContent;
						const url = title.href;
						saveBookmarks(title,source,url);
                  populateBookmarks(title,source,url);
               });
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
            if (article.urlToImage != null && article.source.name != "Fox News") {   
               // IF IMAGE EXISTS FOR ARTICLE
               // Create article item            
               const articleItem = document.createElement('div');
               articleItem.classList.add('article');
               // Create image container and add image
               const articleImage = document.createElement('div');
               articleImage.classList.add('image');
               articleImage.style.backgroundImage = `url('${article.urlToImage}')`;
               // Create info container: title and source
               const articleInfo = document.createElement('div');
               articleInfo.classList.add('article-info');
               // Create title container and add title
               const articleTitle = document.createElement('a');
               articleTitle.classList.add('article-title','title');
               articleTitle.textContent = article.title;
               articleTitle.target = '_blank';
               articleTitle.href = article.url;
               // Create source and add source name
               const articleSource = document.createElement('p');
               articleSource.classList.add('article-source','source');
               articleSource.textContent = article.source.name;
               // Create buttons container: Time Published, Share and Bookmark
               const articleButtons = document.createElement('div');
               articleButtons.classList.add('buttons');
               // Create Time published and add time
               const articleTime = document.createElement('p');
               articleTime.classList.add('timePublished');
               articleTime.textContent = '';
               // Create bookmark button and add functionality
               const articleBookmark = document.createElement('div');
               articleBookmark.classList.add('article-buttons','bookmark');
               articleBookmark.innerHTML = '<i class="ion-android-bookmark"></i>';
               articleBookmark.addEventListener('click', function() {
                  const article = this.parentElement.parentElement;
                  const title = article.querySelector('.title').textContent;
                  const source = article.querySelector('.source').textContent;
                  const url = title.href;
						saveBookmarks(title,source,url);
						populateBookmarks(title,source,url);
               });
               // Create share button and add functionality
               const articleShare = document.createElement('div');
               articleShare.classList.add('article-buttons','share');
               articleShare.innerHTML = '<i class="ion-ios-upload-outline"></i>';
               // Append time published, share and bookmark to buttons container
               articleButtons.appendChild(articleTime);
               articleButtons.appendChild(articleShare);
               articleButtons.appendChild(articleBookmark);
               // Append title and source to info container
               articleInfo.appendChild(articleTitle);
               articleInfo.appendChild(articleSource);
               // Append image, info and buttons to article item
               articleItem.appendChild(articleImage);
               articleItem.appendChild(articleInfo);
               articleItem.appendChild(articleButtons);
               // Append article item to articles container 
               articlesContainer.appendChild(articleItem);
            } else {
               // IF IMAGE DOESN'T EXIST FOR ARTICLE
               // Create article item  
               const imglessArticle = document.createElement('div');
               imglessArticle.classList.add('imageless-article');
               // Create info container: title and source
               const imglessInfo = document.createElement('div');
               imglessInfo.classList.add('imageless-article-info');
               // Create title, add title and link
               const imglessTitle = document.createElement('a');
               imglessTitle.classList.add('imageless-article-title','title');
               imglessTitle.textContent = article.title;
               imglessTitle.target = '_blank';
               imglessTitle.href = article.url;
               // Create source and add source
               const imglessSource = document.createElement('p');
               imglessSource.classList.add('imageless-article-source','source');
               imglessSource.textContent = article.source.name;
               // Create buttons container: Time Published, Share and Bookmark
               const imglessButtons = document.createElement('div');
               imglessButtons.classList.add('buttons');
               // Create Time published and add time
               const imglessTime = document.createElement('p');
               imglessTime.classList.add('timePublished');
               imglessTime.textContent = '';
               // Create bookmark button and add functionality
               const imglessBookmark = document.createElement('div');
               imglessBookmark.classList.add('imageless-article-buttons','bookmark');
               imglessBookmark.innerHTML = '<i class="ion-android-bookmark"></i>';
               imglessBookmark.addEventListener('click', function() {
                  const article = this.parentElement.parentElement;
                  const title = article.querySelector('.title').textContent;
                  const source = article.querySelector('.source').textContent;
						const url = title.href;
						saveBookmarks(title,source,url);
                  populateBookmarks(title,source,url);
               });
               // Create share button and add functionality
               const imglessShare = document.createElement('div');
               imglessShare.classList.add('imageless-article-buttons','share');
               imglessShare.innerHTML = '<i class="ion-ios-upload-outline"></i>';
               // Append time published, share and bookmark to buttons container
               imglessButtons.appendChild(imglessTime);
               imglessButtons.appendChild(imglessShare);
               imglessButtons.appendChild(imglessBookmark);
               // Append title and source to info container
               imglessInfo.appendChild(imglessTitle);
               imglessInfo.appendChild(imglessSource);
               // Append info and buttons to article item
               imglessArticle.appendChild(imglessInfo);
               imglessArticle.appendChild(imglessButtons);
               // Append article item to articles container 
					imglessArticles.appendChild(imglessArticle);
				}
				// Sets height of imageless article to content height: Fixes CSS Grid bug
				if (imglessArticles.childElementCount > 0) {
					let imglessArticleHeight = 0;
					for (let i = 0; i < imglessArticles.childElementCount; i++) {
						imglessArticleHeight += imglessArticles.children[i].offsetHeight;
					}
					imglessArticles.style.height = `${imglessArticleHeight + 10}px`;
					imglessArticles.style.border = `1px solid #ccc`;
				} else {
					imglessArticles.style.height = `0px`;
					imglessArticles.style.border = `none`;
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

// Fetch news on load
fetchNews();

// Check if bookmark list is empty on page load
isListEmpty();

// Show bookmarks list
bookmarks.addEventListener('click',function() {
   const rect = this.getBoundingClientRect();
   bookmarkList.style.top = `${rect.bottom + rect.top + 10}px`;
   bookmarkList.style.left = `${rect.x + rect.width - 300}px`;
   bookmarkList.classList.toggle('open-bookmarks-list');   
});

// Hide bookmarks list on resize
window.addEventListener('resize', () => {
   bookmarkList.classList.remove('open-bookmarks-list'); 
})

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

// Expands and collpases tags
showTagBtn.addEventListener('click',function() {
   document.body.classList.toggle('collapse-tags');
   const rect = mainBody.getBoundingClientRect();
   mainBody.style.transform = `translateY(-${rect.top - 60}px)`;
});



// Load bookmarks on load
if (localStorage.length > 0) {
	const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
	savedBookmarks.forEach(bookmark => populateBookmarks(bookmark.artclTitle,bookmark.artclSource,bookmark.artclURL));
}