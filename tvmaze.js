"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const BASE_URL = "http://api.tvmaze.com/";
const DEFAULT_IMAGE_URL = "https://tinyurl.com/tv-missing";
const EPISODES_ENDPOINT = "search/shows";
// const SHOWS_ENDPOINT = `shows/${show_id}/episodes`;

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  let response = await axios.get(`${BASE_URL}${EPISODES_ENDPOINT}`,
    { params: { q: searchTerm } });
  console.log(response.data);
  return parseShows(response.data);
}

/* Parses an array of shows
 * returns the following keys: {id, name, summary, image}.
 */
function parseShows(shows) {
  let parsedShows = [];
  for (let i of shows) {
    let show = i["show"];
    //Find image URL, denest from nested object show. If one does not exist, use default
    let image = show.image;
    if (image === null) {
      image = DEFAULT_IMAGE_URL;
    } else {
      image = image.medium;
    }
    
    let { id, name, summary } = show;
    parsedShows.push({ id, name, summary, image });
  }
  return parsedShows;
}

/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  $showsList.empty();
  console.log(shows);
  
  for (let show of shows) {
    let showImage = $('<img>').attr('src', show.image);
    $showsList.append(showImage);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
