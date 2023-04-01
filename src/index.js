import fetchImages from './js/fetchImages';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const searchFormEl = document.querySelector('.search-form');
const inputQueryEl = document.querySelector('input[name="searchQuery"]');
const loadMoreBtnEl = document.querySelector('.load-more');
let name = null;
let page = 1;
let counter = 0;
let totalImages = 0;

searchFormEl.addEventListener('submit', searchAndShow);
loadMoreBtnEl.addEventListener('click', loadMoreImages);

function searchAndShow(e) {
  e.preventDefault();
  page = 1;
  counter = 40;
  galleryEl.innerHTML = '';
  name = inputQueryEl.value;
  imagesTemplate(name);
}

async function loadMoreImages() {
  page += 1;
  counter += 40;
  await imagesTemplate(name);
  await smoothScroll();
}

async function imagesTemplate(query) {
  const data = await fetchImages(query, page);
  const images = data.hits;
  totalImages = data.totalHits;

  if (totalImages === 0) {
    loadMoreBtnEl.classList.add('is-hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (counter === 40) {
    Notify.success(`Hooray! We found ${totalImages} images.`);
  }

  counter > totalImages
    ? loadMoreBtnEl.classList.add('is-hidden')
    : loadMoreBtnEl.classList.remove('is-hidden');
  galleryEl.insertAdjacentHTML('beforeend', createMarkup(images));
  useSimpleLightbox();
}

function createMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a href="${largeImageURL}">
    <img class="img" height="350" src="${webformatURL}" alt="${tags}" loading="${largeImageURL}" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>`
    )
    .join('');
}

function useSimpleLightbox() {
  let gallery = new SimpleLightbox('.gallery a');
  gallery.on('show.simplelightbox');
}

function smoothScroll(){
    const { height: cardHeight } = document
  .querySelector(".gallery");
  console.log(document
    .querySelector(".gallery").firstElementChild.getBoundingClientRect());

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}


