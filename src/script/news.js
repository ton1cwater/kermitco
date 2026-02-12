
/*

anyone working on this, something important:
the way this works should be one request per hour (subject to be changed). basically, we're gonna store the news data in firebase.
when a page loads, it's going to check whether there is a current (hourly, by this it should just check 9 am rn, is it still
9 am?) version of the news stored in firebase (maybe delete after 3 days idk) if there is, all is well and it'll get the json
and load the news on the news thing. if not, it'll do the fetch thing and save to firebase. then it'll load from firebase
because why not. so yeah

*/

async function firebase_initialize() {
    console.log("firebase_initialize called.")
    if (!db) {
        firebase_loader_script = document.createElement("script");
        firebase_loader_script.src = "./lib/firebase.js";
        UIJS.getElement("#head").appendChild(firebase_loader_script);
    }
    
    if (!db.intialized) {
        await db.setup("kermitco")
        if (!db.initialized) {
            console.error("error intializing firebase.");
        }

        console.log("firebase_initialize status:" + db.initialized);
    } else {
        return;
    }
}

let news_data;
let currently_loaded_cards = 0;
const api_key = "3ed23a3aa4221ed5c5d24f0a0b1ea56c";
const newsapi_url = "https://gnews.io/api/v4/search";

// example https://newsapi.org/v2/everything?q=hello&apiKey=8a3d270640a349258bdc6ca44fbda9b9

async function get_news(keyword="a", article_num=20) {
    console.log("fetching...")
    
    const fetch_url = (newsapi_url + "?q=" + keyword + "&max=" + article_num + "&lang=en&apikey=" + api_key).trim();
    
    console.log("news fetch url:" + fetch_url);
    
    const response = await fetch(fetch_url);
    
    data = await response.json();
    
    console.log("retrieved data:" + data);
    
    return data;
}

function make_news_card(title="not available", author="unknown", desc="not available", imgurl="./images/filler_image.jpg", autoappend=false) {
    let news_card_cont = document.createElement("div")
    let news_card_img = document.createElement("img")
    let news_card_desc_cont = document.createElement("div")
    let news_card_desc_title = document.createElement("h4")
    let news_card_desc_content = document.createElement("h4")
    
    news_card_cont.classList.add("news-card-container")
    news_card_img.classList.add("news-card-image")
    news_card_desc_cont.classList.add("news-card-desc")
    
    news_card_img.src = imgurl;
    news_card_desc_title.textContent = title + " by " + author;
    news_card_desc_content.textContent = news_card_desc_content;
    
    news_card_desc_cont.append(title, document.createElement("br"), desc);
    news_card_cont.append(news_card_img, news_card_desc_cont);
    
    if (autoappend === false) {
        return news_card_cont;
    } else {
        document.getElementById(autoappend).appendChild(news_card_cont);
        return true;
    }
}

async function load_news(index=20, manual_get=false) {
    if (!db || !db.initialized) {
        await firebase_initialize();
    }
    
    let container = UIJS.getElement("#content-main")
    news_data = await db.get_from_db("news");
    
    if (!news_data && !manual_get) {
        news_data = await get_news();
    }
    
    if (typeof news_data === "string") {
        news_data = JSON.parse(news_data)
    }
    
    const current_date = new Date();
    const time_stored = news_data.time_stored ? news_data.time_stored : current_date.getHours();
    
    if (parseInt(news_data.time_stored) != parseInt(current_date.getHours())) {
        news_data = await get_news();
        
        let data = {
            time_stored: current_date.getHours(),
            news_data: news_data
        }
        
        await db.set_in_db("news", data)
        
    }
    
    news_data = news_data.news_data;
    
    if (!news_data) {
        clear_news();
        load_news(index, manual_get);
    }
    
    for (let i = 0; i < index; i ++) {
        if (!news_data.articles[i]) {
            document.getElementById("load-more-cards").disabled = true;
            break;
        }
        
        make_news_card(news_data.articles[i].title, news_data.articles[i].author, news_data.articles[i].description, news_data.articles[i].urlToImage, autoappend="news-cards-cont")
        currently_loaded_cards ++;
    }
}

function load_more_news(index=20) {
    for (let i = currently_loaded_cards; i < currently_loaded_cards + index; i ++) {
        if (!news_data.articles[i]) {
            document.getElementById("load-more-cards").disabled = true;
            break;
        }
        
        make_news_card(news_data.articles[i].title, news_data.articles[i].author, news_data.articles[i].description, news_data.articles[i].image, autoappend="news-cards-cont")
        currently_loaded_cards ++;
    }
}

async function clear_news() {
    await db.set_in_db("news", "");
}
